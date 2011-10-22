(function() {

var operator = function(exp1, exp2, 
                        operator_name, type_resolver,
                        constant_evaluator)
{
    var resulting_type = type_resolver(exp1.type, exp2.type);
    return Shade._create_concrete_value_exp( {
        parents: [exp1, exp2],
        type: resulting_type,
        expression_type: "operator" + operator_name,
        value: function () {
            return "(" + this.parents[0].eval() + " " + operator_name + " " +
                this.parents[1].eval() + ")";
        },
        constant_value: Shade.memoize_on_field("_constant_value", function() {
            return constant_evaluator(this);
        }),
        element: Shade.memoize_on_field("_element", function(i) {
            return operator(this.parents[0].element(i),
                            this.parents[1].element(i),
                            operator_name, type_resolver,
                            constant_evaluator);
        }),
        element_constant_value: Shade.memoize_on_field("_element_constant_value", function(i) {
            return this.element(i).constant_value();
        }),
        element_is_constant: Shade.memoize_on_field("_element_is_constant", function(i) {
            return (this.parents[0].element_is_constant(i) &&
                    this.parents[1].element_is_constant(i));
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
        throw ("type mismatch on add: unexpected types  '"
                   + t1.repr() + "' and '" + t2.repr() + "'.");
    };
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
        return vt.plus(v1, v2);
    }
    for (var i=1; i<arguments.length; ++i) {
        current_result = operator(current_result, Shade.make(arguments[i]),
                                  "+", add_type_resolver, evaluator);
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
        throw ("type mismatch on sub: unexpected types  '"
                   + t1.repr() + "' and '" + t2.repr() + "'.");
    };
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
    var current_result = Shade.make(arguments[0]);
    for (var i=1; i<arguments.length; ++i) {
        current_result = operator(current_result, Shade.make(arguments[i]),
                                  "-", sub_type_resolver, evaluator);
    }
    return current_result;
};

Shade.div = function() {
    if (arguments.length === 0) throw "div needs at least two arguments";
    function div_type_resolver(t1, t2) {
        if (typeof t1 === 'undefined')
            throw "t1 multiplication with undefined type?";
        if (typeof t2 === 'undefined')
            throw "t2 multiplication with undefined type?";
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
        throw ("type mismatch on div: unexpected types  '"
                   + t1.repr() + "' and '" + t2.repr() + "'.");
    };
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
        };
        var t1 = constant_type(v1), t2 = constant_type(v2);
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
                          throw "internal error, can't eval vector/matrix";
                      }
                    },
            matrix: { number: function (x, y) { return mt.scaling(x, 1/y); },
                      vector: function (x, y) { 
                          throw "internal error, can't eval matrix/vector";
                      },
                      matrix: function (x, y) { 
                          throw "internal error, can't eval matrix/matrix";
                      }
                    }
        };
        return dispatch[t1][t2](v1, v2);
    }
    var current_result = Shade.make(arguments[0]);
    for (var i=1; i<arguments.length; ++i) {
        current_result = operator(current_result, Shade.make(arguments[i]),
                                  "/", div_type_resolver, evaluator);
    }
    return current_result;
};

Shade.mul = function() {
    if (arguments.length === 0) throw "mul needs at least one argument";
    if (arguments.length === 1) return arguments[0];
    function mul_type_resolver(t1, t2) {
        if (typeof t1 === 'undefined')
            throw "t1 multiplication with undefined type?";
        if (typeof t2 === 'undefined')
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
    };
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
        var t1 = constant_type(v1), t2 = constant_type(v2);
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
    var current_result = Shade.make(arguments[0]);
    for (var i=1; i<arguments.length; ++i) {
        current_result = operator(current_result, Shade.make(arguments[i]),
                                  "*", mul_type_resolver, evaluator);
    }
    return current_result;
};
})();
