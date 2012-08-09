(function() {

var operator = function(exp1, exp2, 
                        operator_name, type_resolver,
                        constant_evaluator,
                        element_evaluator)
{
    var resulting_type = type_resolver(exp1.type, exp2.type);
    return Shade._create_concrete_value_exp( {
        parents: [exp1, exp2],
        type: resulting_type,
        expression_type: "operator" + operator_name,
        value: function () {
            var p1 = this.parents[0], p2 = this.parents[1];
            if (this.type.is_struct()) {
                return "(" + this.type.repr() + "(" +
                    _.map(this.type.fields, function (v,k) {
                        return p1.field(k).evaluate() + " " + operator_name + " " +
                            p2.field(k).evaluate();
                    }).join(", ") + "))";
            } else {
                return "(" + this.parents[0].evaluate() + " " + operator_name + " " +
                    this.parents[1].evaluate() + ")";
            }
        },
        constant_value: Shade.memoize_on_field("_constant_value", function() {
            return constant_evaluator(this);
        }),
        element: Shade.memoize_on_field("_element", function(i) {
            return element_evaluator(this, i);
        }),
        element_constant_value: Shade.memoize_on_field("_element_constant_value", function(i) {
            return this.element(i).constant_value();
        }),
        element_is_constant: Shade.memoize_on_field("_element_is_constant", function(i) {
            return this.element(i).is_constant();
        })
    });
};

Shade.add = function() {
    if (arguments.length === 0) throw "add needs at least one argument";
    if (arguments.length === 1) return arguments[0];
    function add_type_resolver(t1, t2) {
        var type_list = [
            [Shade.Types.vec4, Shade.Types.vec4, Shade.Types.vec4],
            [Shade.Types.mat4, Shade.Types.mat4, Shade.Types.mat4],
            [Shade.Types.float_t, Shade.Types.float_t, Shade.Types.float_t],
            [Shade.Types.vec4, Shade.Types.float_t, Shade.Types.vec4],
            [Shade.Types.float_t, Shade.Types.vec4, Shade.Types.vec4],
            [Shade.Types.mat4, Shade.Types.float_t, Shade.Types.mat4],
            [Shade.Types.float_t, Shade.Types.mat4, Shade.Types.mat4],

            [Shade.Types.vec3, Shade.Types.vec3, Shade.Types.vec3],
            [Shade.Types.mat3, Shade.Types.mat3, Shade.Types.mat3],
            [Shade.Types.float_t, Shade.Types.float_t, Shade.Types.float_t],
            [Shade.Types.vec3, Shade.Types.float_t, Shade.Types.vec3],
            [Shade.Types.float_t, Shade.Types.vec3, Shade.Types.vec3],
            [Shade.Types.mat3, Shade.Types.float_t, Shade.Types.mat3],
            [Shade.Types.float_t, Shade.Types.mat3, Shade.Types.mat3],

            [Shade.Types.vec2, Shade.Types.vec2, Shade.Types.vec2],
            [Shade.Types.mat2, Shade.Types.mat2, Shade.Types.mat2],
            [Shade.Types.float_t, Shade.Types.float_t, Shade.Types.float_t],
            [Shade.Types.vec2, Shade.Types.float_t, Shade.Types.vec2],
            [Shade.Types.float_t, Shade.Types.vec2, Shade.Types.vec2],
            [Shade.Types.mat2, Shade.Types.float_t, Shade.Types.mat2],
            [Shade.Types.float_t, Shade.Types.mat2, Shade.Types.mat2],
            
            [Shade.Types.int_t, Shade.Types.int_t, Shade.Types.int_t]
        ];
        for (var i=0; i<type_list.length; ++i)
            if (t1.equals(type_list[i][0]) &&
                t2.equals(type_list[i][1]))
                return type_list[i][2];

        // if t1 and t2 are the same struct and all fields admit
        // addition, then a+b is field-wise a+b
        if (t1.is_struct() && t2.is_struct() && t1.equals(t2) &&
            _.all(t1.fields, function(v, k) {
                try {
                    add_type_resolver(v, v);
                    return true;
                } catch (e) {
                    return false;
                }
            })) {
            return t1;
        }
        throw ("type mismatch on add: unexpected types  '"
                   + t1.repr() + "' and '" + t2.repr() + "'.");
    }
    var current_result = Shade.make(arguments[0]);
    function evaluator(exp) {
        var exp1 = exp.parents[0], exp2 = exp.parents[1];
        var vt;
        if (exp1.type.is_vec())
            vt = vec[exp1.type.vec_dimension()];
        else if (exp2.type.is_vec())
            vt = vec[exp2.type.vec_dimension()];
        var v1 = exp1.constant_value(), v2 = exp2.constant_value();
        if (exp1.type.equals(Shade.Types.int_t) && 
            exp2.type.equals(Shade.Types.int_t))
            return v1 + v2;
        if (exp1.type.equals(Shade.Types.float_t) &&
            exp2.type.equals(Shade.Types.float_t))
            return v1 + v2;
        if (exp2.type.equals(Shade.Types.float_t))
            return vt.map(v1, function(x) { 
                return x + v2; 
            });
        if (exp1.type.equals(Shade.Types.float_t))
            return vt.map(v2, function(x) {
                return v1 + x;
            });
        if (vt) {
            return vt.plus(v1, v2);
        } else {
            if (!exp1.type.is_struct())
                throw "internal error, was expecting a struct here";
            var s = {};
            _.each(v1, function(v, k) {
                s[k] = evaluator(Shade.add(exp1.field(k), exp2.field(k)));
            });
            return s;
        }
    };
    function element_evaluator(exp, i) {
        var e1 = exp.parents[0], e2 = exp.parents[1];
        var v1, v2;
        var t1 = e1.type, t2 = e2.type;
        if (t1.is_pod() && t2.is_pod()) {
            if (i === 0)
                return exp;
            else
                throw "i > 0 in pod element";
        }
        if (e1.type.is_vec() || e1.type.is_mat())
            v1 = e1.element(i);
        else
            v1 = e1;
        if (e2.type.is_vec() || e2.type.is_vec())
            v2 = e2.element(i);
        else
            v2 = e2;
        return operator(v1, v2, "+", add_type_resolver, evaluator, element_evaluator);
    }
    for (var i=1; i<arguments.length; ++i) {
        current_result = operator(current_result, Shade.make(arguments[i]),
                                  "+", add_type_resolver, evaluator,
                                  element_evaluator);
    }
    return current_result;
};

Shade.sub = function() {
    if (arguments.length === 0) throw "sub needs at least two arguments";
    if (arguments.length === 1) throw "unary minus unimplemented";
    function sub_type_resolver(t1, t2) {
        var type_list = [
            [Shade.Types.vec4, Shade.Types.vec4, Shade.Types.vec4],
            [Shade.Types.mat4, Shade.Types.mat4, Shade.Types.mat4],
            [Shade.Types.float_t, Shade.Types.float_t, Shade.Types.float_t],
            [Shade.Types.vec4, Shade.Types.float_t, Shade.Types.vec4],
            [Shade.Types.float_t, Shade.Types.vec4, Shade.Types.vec4],
            [Shade.Types.mat4, Shade.Types.float_t, Shade.Types.mat4],
            [Shade.Types.float_t, Shade.Types.mat4, Shade.Types.mat4],

            [Shade.Types.vec3, Shade.Types.vec3, Shade.Types.vec3],
            [Shade.Types.mat3, Shade.Types.mat3, Shade.Types.mat3],
            [Shade.Types.float_t, Shade.Types.float_t, Shade.Types.float_t],
            [Shade.Types.vec3, Shade.Types.float_t, Shade.Types.vec3],
            [Shade.Types.float_t, Shade.Types.vec3, Shade.Types.vec3],
            [Shade.Types.mat3, Shade.Types.float_t, Shade.Types.mat3],
            [Shade.Types.float_t, Shade.Types.mat3, Shade.Types.mat3],

            [Shade.Types.vec2, Shade.Types.vec2, Shade.Types.vec2],
            [Shade.Types.mat2, Shade.Types.mat2, Shade.Types.mat2],
            [Shade.Types.float_t, Shade.Types.float_t, Shade.Types.float_t],
            [Shade.Types.vec2, Shade.Types.float_t, Shade.Types.vec2],
            [Shade.Types.float_t, Shade.Types.vec2, Shade.Types.vec2],
            [Shade.Types.mat2, Shade.Types.float_t, Shade.Types.mat2],
            [Shade.Types.float_t, Shade.Types.mat2, Shade.Types.mat2],
            
            [Shade.Types.int_t, Shade.Types.int_t, Shade.Types.int_t]
        ];
        for (var i=0; i<type_list.length; ++i)
            if (t1.equals(type_list[i][0]) &&
                t2.equals(type_list[i][1]))
                return type_list[i][2];
        // if t1 and t2 are the same struct and all fields admit
        // subtraction, then a-b is field-wise a-b
        if (t1.is_struct() && t2.is_struct() && t1.equals(t2) &&
            _.all(t1.fields, function(v, k) {
                try {
                    sub_type_resolver(v, v);
                    return true;
                } catch (e) {
                    return false;
                }
            })) {
            return t1;
        }
        throw ("type mismatch on sub: unexpected types  '"
                   + t1.repr() + "' and '" + t2.repr() + "'.");
    }
    function evaluator(exp) {
        var exp1 = exp.parents[0], exp2 = exp.parents[1];
        var vt;
        if (exp1.type.is_vec())
            vt = vec[exp1.type.vec_dimension()];
        else if (exp2.type.is_vec())
            vt = vec[exp2.type.vec_dimension()];
        var v1 = exp1.constant_value(), v2 = exp2.constant_value();
        if (exp1.type.equals(Shade.Types.int_t) && 
            exp2.type.equals(Shade.Types.int_t))
            return v1 - v2;
        if (exp1.type.equals(Shade.Types.float_t) &&
            exp2.type.equals(Shade.Types.float_t))
            return v1 - v2;
        if (exp2.type.equals(Shade.Types.float_t))
            return vt.map(v1, function(x) { 
                return x - v2; 
            });
        if (exp1.type.equals(Shade.Types.float_t))
            return vt.map(v2, function(x) {
                return v1 - x;
            });
        return vt.minus(v1, v2);
    }
    function element_evaluator(exp, i) {
        var e1 = exp.parents[0], e2 = exp.parents[1];
        var v1, v2;
        var t1 = e1.type, t2 = e2.type;
        if (t1.is_pod() && t2.is_pod()) {
            if (i === 0)
                return exp;
            else
                throw "i > 0 in pod element";
        }
        if (e1.type.is_vec() || e1.type.is_mat())
            v1 = e1.element(i);
        else
            v1 = e1;
        if (e2.type.is_vec() || e2.type.is_vec())
            v2 = e2.element(i);
        else
            v2 = e2;
        return operator(v1, v2, "-", sub_type_resolver, evaluator, element_evaluator);
    }
    var current_result = Shade.make(arguments[0]);
    for (var i=1; i<arguments.length; ++i) {
        current_result = operator(current_result, Shade.make(arguments[i]),
                                  "-", sub_type_resolver, evaluator,
                                  element_evaluator);
    }
    return current_result;
};

Shade.div = function() {
    if (arguments.length === 0) throw "div needs at least two arguments";
    function div_type_resolver(t1, t2) {
        if (_.isUndefined(t1))
            throw "internal error: t1 multiplication with undefined type";
        if (_.isUndefined(t2))
            throw "internal error: t2 multiplication with undefined type";
        var type_list = [
            [Shade.Types.vec4, Shade.Types.vec4, Shade.Types.vec4],
            [Shade.Types.mat4, Shade.Types.mat4, Shade.Types.mat4],
            [Shade.Types.float_t, Shade.Types.float_t, Shade.Types.float_t],
            [Shade.Types.vec4, Shade.Types.float_t, Shade.Types.vec4],
            [Shade.Types.float_t, Shade.Types.vec4, Shade.Types.vec4],
            [Shade.Types.mat4, Shade.Types.float_t, Shade.Types.mat4],
            [Shade.Types.float_t, Shade.Types.mat4, Shade.Types.mat4],

            [Shade.Types.vec3, Shade.Types.vec3, Shade.Types.vec3],
            [Shade.Types.mat3, Shade.Types.mat3, Shade.Types.mat3],
            [Shade.Types.float_t, Shade.Types.float_t, Shade.Types.float_t],
            [Shade.Types.vec3, Shade.Types.float_t, Shade.Types.vec3],
            [Shade.Types.float_t, Shade.Types.vec3, Shade.Types.vec3],
            [Shade.Types.mat3, Shade.Types.float_t, Shade.Types.mat3],
            [Shade.Types.float_t, Shade.Types.mat3, Shade.Types.mat3],

            [Shade.Types.vec2, Shade.Types.vec2, Shade.Types.vec2],
            [Shade.Types.mat2, Shade.Types.mat2, Shade.Types.mat2],
            [Shade.Types.float_t, Shade.Types.float_t, Shade.Types.float_t],
            [Shade.Types.vec2, Shade.Types.float_t, Shade.Types.vec2],
            [Shade.Types.float_t, Shade.Types.vec2, Shade.Types.vec2],
            [Shade.Types.mat2, Shade.Types.float_t, Shade.Types.mat2],
            [Shade.Types.float_t, Shade.Types.mat2, Shade.Types.mat2]
        ];
        for (var i=0; i<type_list.length; ++i)
            if (t1.equals(type_list[i][0]) &&
                t2.equals(type_list[i][1]))
                return type_list[i][2];
        throw ("type mismatch on div: unexpected types '"
                   + t1.repr() + "' and '" + t2.repr() + "'");
    }
    function evaluator(exp) {
        var exp1 = exp.parents[0];
        var exp2 = exp.parents[1];
        var v1 = exp1.constant_value();
        var v2 = exp2.constant_value();
        var vt, mt;
        if (exp1.type.is_array()) {
            vt = vec[exp1.type.array_size()];
            mt = mat[exp1.type.array_size()];
        } else if (exp2.type.is_array()) {
            vt = vec[exp2.type.array_size()];
            mt = mat[exp2.type.array_size()];
        }
        var t1 = facet_constant_type(v1), t2 = facet_constant_type(v2);
        var dispatch = {
            number: { number: function (x, y) { return x / y; },
                      vector: function (x, y) { 
                          return vt.map(y, function(v) {
                              return x/v;
                          });
                      },
                      matrix: function (x, y) { 
                          return mt.map(y, function(v) {
                              return x/v;
                          });
                      }
                    },
            vector: { number: function (x, y) { return vt.scaling(x, 1/y); },
                      vector: function (x, y) { 
                          return vt.map(y, function(v,i) {
                              return x[i]/v;
                          });
                      },
                      matrix: function (x, y) {
                          throw "internal error, can't evaluate vector/matrix";
                      }
                    },
            matrix: { number: function (x, y) { return mt.scaling(x, 1/y); },
                      vector: function (x, y) { 
                          throw "internal error, can't evaluate matrix/vector";
                      },
                      matrix: function (x, y) { 
                          throw "internal error, can't evaluate matrix/matrix";
                      }
                    }
        };
        return dispatch[t1][t2](v1, v2);
    }
    function element_evaluator(exp, i) {
        var e1 = exp.parents[0], e2 = exp.parents[1];
        var v1, v2;
        var t1 = e1.type, t2 = e2.type;
        if (t1.is_pod() && t2.is_pod()) {
            if (i === 0)
                return exp;
            else
                throw "i > 0 in pod element";
        }
        if (e1.type.is_vec() || e1.type.is_mat())
            v1 = e1.element(i);
        else
            v1 = e1;
        if (e2.type.is_vec() || e2.type.is_vec())
            v2 = e2.element(i);
        else
            v2 = e2;
        return operator(v1, v2, "/", div_type_resolver, evaluator, element_evaluator);
    }
    var current_result = Shade.make(arguments[0]);
    for (var i=1; i<arguments.length; ++i) {
        current_result = operator(current_result, Shade.make(arguments[i]),
                                  "/", div_type_resolver, evaluator, element_evaluator);
    }
    return current_result;
};

Shade.mul = function() {
    if (arguments.length === 0) throw "mul needs at least one argument";
    if (arguments.length === 1) return arguments[0];
    function mul_type_resolver(t1, t2) {
        if (_.isUndefined(t1))
            throw "t1 multiplication with undefined type?";
        if (_.isUndefined(t2))
            throw "t2 multiplication with undefined type?";
        var type_list = [
            [Shade.Types.vec4, Shade.Types.vec4, Shade.Types.vec4],
            [Shade.Types.mat4, Shade.Types.mat4, Shade.Types.mat4],
            [Shade.Types.mat4, Shade.Types.vec4, Shade.Types.vec4],
            [Shade.Types.vec4, Shade.Types.mat4, Shade.Types.vec4],
            [Shade.Types.float_t, Shade.Types.float_t, Shade.Types.float_t],
            [Shade.Types.vec4, Shade.Types.float_t, Shade.Types.vec4],
            [Shade.Types.float_t, Shade.Types.vec4, Shade.Types.vec4],
            [Shade.Types.mat4, Shade.Types.float_t, Shade.Types.mat4],
            [Shade.Types.float_t, Shade.Types.mat4, Shade.Types.mat4],

            [Shade.Types.vec3, Shade.Types.vec3, Shade.Types.vec3],
            [Shade.Types.mat3, Shade.Types.mat3, Shade.Types.mat3],
            [Shade.Types.mat3, Shade.Types.vec3, Shade.Types.vec3],
            [Shade.Types.vec3, Shade.Types.mat3, Shade.Types.vec3],
            [Shade.Types.float_t, Shade.Types.float_t, Shade.Types.float_t],
            [Shade.Types.vec3, Shade.Types.float_t, Shade.Types.vec3],
            [Shade.Types.float_t, Shade.Types.vec3, Shade.Types.vec3],
            [Shade.Types.mat3, Shade.Types.float_t, Shade.Types.mat3],
            [Shade.Types.float_t, Shade.Types.mat3, Shade.Types.mat3],

            [Shade.Types.vec2, Shade.Types.vec2, Shade.Types.vec2],
            [Shade.Types.mat2, Shade.Types.mat2, Shade.Types.mat2],
            [Shade.Types.mat2, Shade.Types.vec2, Shade.Types.vec2],
            [Shade.Types.vec2, Shade.Types.mat2, Shade.Types.vec2],
            [Shade.Types.float_t, Shade.Types.float_t, Shade.Types.float_t],
            [Shade.Types.vec2, Shade.Types.float_t, Shade.Types.vec2],
            [Shade.Types.float_t, Shade.Types.vec2, Shade.Types.vec2],
            [Shade.Types.mat2, Shade.Types.float_t, Shade.Types.mat2],
            [Shade.Types.float_t, Shade.Types.mat2, Shade.Types.mat2],
            
            [Shade.Types.int_t, Shade.Types.int_t, Shade.Types.int_t]
        ];
        for (var i=0; i<type_list.length; ++i)
            if (t1.equals(type_list[i][0]) &&
                t2.equals(type_list[i][1]))
                return type_list[i][2];
        throw ("type mismatch on mul: unexpected types  '"
                   + t1.repr() + "' and '" + t2.repr() + "'.");
    }
    function evaluator(exp) {
        var exp1 = exp.parents[0];
        var exp2 = exp.parents[1];
        var v1 = exp1.constant_value();
        var v2 = exp2.constant_value();
        var vt, mt;
        if (exp1.type.is_array()) {
            vt = vec[exp1.type.array_size()];
            mt = mat[exp1.type.array_size()];
        } else if (exp2.type.is_array()) {
            vt = vec[exp2.type.array_size()];
            mt = mat[exp2.type.array_size()];
        }
        var t1 = facet_constant_type(v1), t2 = facet_constant_type(v2);
        var dispatch = {
            number: { number: function (x, y) { return x * y; },
                      vector: function (x, y) { return vt.scaling(y, x); },
                      matrix: function (x, y) { return mt.scaling(y, x); }
                    },
            vector: { number: function (x, y) { return vt.scaling(x, y); },
                      vector: function (x, y) {
                          return vt.schur_product(x, y);
                      },
                      matrix: function (x, y) {
                          return mt.product_vec(mt.transpose(y), x);
                      }
                    },
            matrix: { number: function (x, y) { return mt.scaling(x, y); },
                      vector: function (x, y) { return mt.product_vec(x, y); },
                      matrix: function (x, y) { return mt.product(x, y); }
                    }
        };
        return dispatch[t1][t2](v1, v2);
    }
    function element_evaluator(exp, i) {
        var e1 = exp.parents[0], e2 = exp.parents[1];
        var v1, v2;
        var t1 = e1.type, t2 = e2.type;
        if (t1.is_pod() && t2.is_pod()) {
            if (i === 0)
                return exp;
            else
                throw "i > 0 in pod element";
        }
        function value_kind(t) {
            if (t.is_pod())
                return "pod";
            if (t.is_vec())
                return "vec";
            if (t.is_mat())
                return "mat";
            throw "internal error: not pod, vec or mat";
        }
        var k1 = value_kind(t1), k2 = value_kind(t2);
        var dispatch = {
            "pod": { 
                "pod": function() { 
                    throw "internal error, pod pod"; 
                },
                "vec": function() { 
                    v1 = e1; v2 = e2.element(i); 
                    return operator(v1, v2, "*", mul_type_resolver, evaluator, element_evaluator);
                },
                "mat": function() { 
                    v1 = e1; v2 = e2.element(i); 
                    return operator(v1, v2, "*", mul_type_resolver, evaluator, element_evaluator);
                }
            },
            "vec": { 
                "pod": function() { 
                    v1 = e1.element(i); v2 = e2; 
                    return operator(v1, v2, "*", mul_type_resolver, evaluator, element_evaluator);
                },
                "vec": function() { 
                    v1 = e1.element(i); v2 = e2.element(i); 
                    return operator(v1, v2, "*", mul_type_resolver, evaluator, element_evaluator);
                },
                "mat": function() {
                    // FIXME should we have a mat_dimension?
                    return Shade.dot(e1, e2.element(i));
                }
            },
            "mat": { 
                "pod": function() { 
                    v1 = e1.element(i); v2 = e2;
                    return operator(v1, v2, "*", mul_type_resolver, evaluator, element_evaluator);
                },
                "vec": function() {
                    // FIXME should we have a mat_dimension?
                    var d = t1.array_size();
                    var row;
                    if (d === 2) {
                        row = Shade.vec(e1.element(0).element(i),
                                        e1.element(1).element(i));
                    } else if (d === 3) {
                        row = Shade.vec(e1.element(0).element(i),
                                        e1.element(1).element(i),
                                        e1.element(2).element(i));
                    } else if (d === 4) {
                        row = Shade.vec(e1.element(0).element(i),
                                        e1.element(1).element(i),
                                        e1.element(2).element(i),
                                        e1.element(3).element(i));
                    } else
                        throw "bad dimension for mat " + d;
                    return Shade.dot(row, e2);
                    // var row = e1.element(i);
                    // return Shade.dot(row, e2);
                },
                "mat": function() {
                    var col = e2.element(i);
                    return operator(e1, col, "*", mul_type_resolver, evaluator, element_evaluator);
                }
            }
        };
        return dispatch[k1][k2]();
    };
    var current_result = Shade.make(arguments[0]);
    for (var i=1; i<arguments.length; ++i) {
        if (current_result.type.equals(Shade.Types.mat4)) {
            if (arguments[i].type.equals(Shade.Types.vec2)) {
                arguments[i] = Shade.vec(arguments[i], 0, 1);
            } else if (arguments[i].type.equals(Shade.Types.vec3)) {
                arguments[i] = Shade.vec(arguments[i], 1);
            }
        }
        current_result = operator(current_result, Shade.make(arguments[i]),
                                  "*", mul_type_resolver, evaluator, element_evaluator);
    }
    return current_result;
};
})();
