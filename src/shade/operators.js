(function() {

var operator = function(exp1, exp2, 
                        operatorName, typeResolver,
                        evaluator,
                        elementEvaluator,
                        shadeName)
{
    var resultingType = typeResolver(exp1.type, exp2.type);
    return Shade._createConcreteValueExp( {
        parents: [exp1, exp2],
        type: resultingType,
        expressionType: "operator" + operatorName,
        _jsonKey: function() { return shadeName; },
        value: function () {
            var p1 = this.parents[0], p2 = this.parents[1];
            if (this.type.isStruct()) {
                return "(" + this.type.repr() + "(" +
                    _.map(this.type.fields, function (v,k) {
                        return p1.field(k).glslExpression() + " " + operatorName + " " +
                            p2.field(k).glslExpression();
                    }).join(", ") + "))";
            } else {
                return "(" + this.parents[0].glslExpression() + " " + operatorName + " " +
                    this.parents[1].glslExpression() + ")";
            }
        },
        evaluate: Shade.memoizeOnGuidDict(function(cache) {
            return evaluator(this, cache);
        }),
        element: Shade.memoizeOnField("_element", function(i) {
            return elementEvaluator(this, i);
        }),
        elementConstantValue: Shade.memoizeOnField("_elementConstantValue", function(i) {
            return this.element(i).constantValue();
        }),
        elementIsConstant: Shade.memoizeOnField("_elementIsConstant", function(i) {
            return this.element(i).isConstant();
        })
    });
};

Shade.add = function() {
    if (arguments.length === 0) throw new Error("add needs at least one argument");
    if (arguments.length === 1) return arguments[0];
    function addTypeResolver(t1, t2) {
        var typeList = [
            [Shade.Types.vec4, Shade.Types.vec4, Shade.Types.vec4],
            [Shade.Types.mat4, Shade.Types.mat4, Shade.Types.mat4],
            [Shade.Types.floatT, Shade.Types.floatT, Shade.Types.floatT],
            [Shade.Types.vec4, Shade.Types.floatT, Shade.Types.vec4],
            [Shade.Types.floatT, Shade.Types.vec4, Shade.Types.vec4],
            [Shade.Types.mat4, Shade.Types.floatT, Shade.Types.mat4],
            [Shade.Types.floatT, Shade.Types.mat4, Shade.Types.mat4],

            [Shade.Types.vec3, Shade.Types.vec3, Shade.Types.vec3],
            [Shade.Types.mat3, Shade.Types.mat3, Shade.Types.mat3],
            [Shade.Types.floatT, Shade.Types.floatT, Shade.Types.floatT],
            [Shade.Types.vec3, Shade.Types.floatT, Shade.Types.vec3],
            [Shade.Types.floatT, Shade.Types.vec3, Shade.Types.vec3],
            [Shade.Types.mat3, Shade.Types.floatT, Shade.Types.mat3],
            [Shade.Types.floatT, Shade.Types.mat3, Shade.Types.mat3],

            [Shade.Types.vec2, Shade.Types.vec2, Shade.Types.vec2],
            [Shade.Types.mat2, Shade.Types.mat2, Shade.Types.mat2],
            [Shade.Types.floatT, Shade.Types.floatT, Shade.Types.floatT],
            [Shade.Types.vec2, Shade.Types.floatT, Shade.Types.vec2],
            [Shade.Types.floatT, Shade.Types.vec2, Shade.Types.vec2],
            [Shade.Types.mat2, Shade.Types.floatT, Shade.Types.mat2],
            [Shade.Types.floatT, Shade.Types.mat2, Shade.Types.mat2],
            
            [Shade.Types.intT, Shade.Types.intT, Shade.Types.intT],

            [Shade.Types.functionT, Shade.Types.functionT, Shade.Types.functionT]
        ];
        for (var i=0; i<typeList.length; ++i)
            if (t1.equals(typeList[i][0]) &&
                t2.equals(typeList[i][1]))
                return typeList[i][2];

        // if t1 and t2 are the same struct and all fields admit
        // addition, then a+b is field-wise a+b
        if (t1.isStruct() && t2.isStruct() && t1.equals(t2) &&
            _.all(t1.fields, function(v, k) {
                try {
                    addTypeResolver(v, v);
                    return true;
                } catch (e) {
                    return false;
                }
            })) {
            return t1;
        }
        throw new Error("type mismatch on add: unexpected types  '"
                   + t1.repr() + "' and '" + t2.repr() + "'.");
    }
    var currentResult = Shade.make(arguments[0]);
    function evaluator(exp, cache) {
        var exp1 = exp.parents[0], exp2 = exp.parents[1];
        var vt;
        if (exp1.type.isVec())
            vt = vec[exp1.type.vecDimension()];
        else if (exp2.type.isVec())
            vt = vec[exp2.type.vecDimension()];
        var v1 = exp1.evaluate(cache), v2 = exp2.evaluate(cache);
        if (exp1.type.equals(Shade.Types.intT) && 
            exp2.type.equals(Shade.Types.intT))
            return v1 + v2;
        if (exp1.type.equals(Shade.Types.floatT) &&
            exp2.type.equals(Shade.Types.floatT))
            return v1 + v2;
        if (exp2.type.equals(Shade.Types.floatT))
            return vt.map(v1, function(x) { 
                return x + v2;
            });
        if (exp1.type.equals(Shade.Types.floatT))
            return vt.map(v2, function(x) {
                return v1 + x;
            });
        if (vt) {
            return vt.plus(v1, v2);
        } else if (exp1.type.isFunction()) {
            return function() {
                var args = _.map(arguments, Shade.make);
                return Shade.add(v1.apply(this, args), v2.apply(this, args));
            };
        } else if (exp1.type.isStruct()) {
            var s = {};
            _.each(v1, function(v, k) {
                s[k] = evaluator(Shade.add(exp1.field(k), exp2.field(k)), cache);
            });
            return s;
        } else {
            throw new Error("internal error, was not expecting types " +
                            exp1.type.repr() + " and " +
                            exp2.type.repr());
        }
    };
    function elementEvaluator(exp, i) {
        var e1 = exp.parents[0], e2 = exp.parents[1];
        var v1, v2;
        var t1 = e1.type, t2 = e2.type;
        if (t1.isPod() && t2.isPod()) {
            if (i === 0)
                return exp;
            else
                throw new Error("i > 0 in pod element");
        }
        if (t1.isStruct() || t2.isStruct())
            throw new Error("can't take elements of structs");
        if (t1.isFunction() || t2.isFunction())
            throw new Error("can't take elements of functions");

        if (t1.isVec() || t1.isMat())
            v1 = e1.element(i);
        else
            v1 = e1;
        if (t2.isVec() || t2.isVec())
            v2 = e2.element(i);
        else
            v2 = e2;
        return operator(v1, v2, "+", addTypeResolver, evaluator, elementEvaluator, "add");
    }
    for (var i=1; i<arguments.length; ++i) {
        currentResult = operator(currentResult, Shade.make(arguments[i]),
                                  "+", addTypeResolver, evaluator,
                                  elementEvaluator, "add");
    }
    return currentResult;
};

Shade.sub = function() {
    if (arguments.length === 0) throw new Error("sub needs at least two arguments");
    if (arguments.length === 1) throw new Error("unary minus unimplemented");
    function subTypeResolver(t1, t2) {
        var typeList = [
            [Shade.Types.vec4, Shade.Types.vec4, Shade.Types.vec4],
            [Shade.Types.mat4, Shade.Types.mat4, Shade.Types.mat4],
            [Shade.Types.floatT, Shade.Types.floatT, Shade.Types.floatT],
            [Shade.Types.vec4, Shade.Types.floatT, Shade.Types.vec4],
            [Shade.Types.floatT, Shade.Types.vec4, Shade.Types.vec4],
            [Shade.Types.mat4, Shade.Types.floatT, Shade.Types.mat4],
            [Shade.Types.floatT, Shade.Types.mat4, Shade.Types.mat4],

            [Shade.Types.vec3, Shade.Types.vec3, Shade.Types.vec3],
            [Shade.Types.mat3, Shade.Types.mat3, Shade.Types.mat3],
            [Shade.Types.floatT, Shade.Types.floatT, Shade.Types.floatT],
            [Shade.Types.vec3, Shade.Types.floatT, Shade.Types.vec3],
            [Shade.Types.floatT, Shade.Types.vec3, Shade.Types.vec3],
            [Shade.Types.mat3, Shade.Types.floatT, Shade.Types.mat3],
            [Shade.Types.floatT, Shade.Types.mat3, Shade.Types.mat3],

            [Shade.Types.vec2, Shade.Types.vec2, Shade.Types.vec2],
            [Shade.Types.mat2, Shade.Types.mat2, Shade.Types.mat2],
            [Shade.Types.floatT, Shade.Types.floatT, Shade.Types.floatT],
            [Shade.Types.vec2, Shade.Types.floatT, Shade.Types.vec2],
            [Shade.Types.floatT, Shade.Types.vec2, Shade.Types.vec2],
            [Shade.Types.mat2, Shade.Types.floatT, Shade.Types.mat2],
            [Shade.Types.floatT, Shade.Types.mat2, Shade.Types.mat2],
            
            [Shade.Types.intT, Shade.Types.intT, Shade.Types.intT],

            [Shade.Types.functionT, Shade.Types.functionT, Shade.Types.functionT]
        ];
        for (var i=0; i<typeList.length; ++i)
            if (t1.equals(typeList[i][0]) &&
                t2.equals(typeList[i][1]))
                return typeList[i][2];
        // if t1 and t2 are the same struct and all fields admit
        // subtraction, then a-b is field-wise a-b
        if (t1.isStruct() && t2.isStruct() && t1.equals(t2) &&
            _.all(t1.fields, function(v, k) {
                try {
                    subTypeResolver(v, v);
                    return true;
                } catch (e) {
                    return false;
                }
            })) {
            return t1;
        }
        throw new Error("type mismatch on sub: unexpected types  '"
                   + t1.repr() + "' and '" + t2.repr() + "'.");
    }
    function evaluator(exp, cache) {
        var exp1 = exp.parents[0], exp2 = exp.parents[1];
        var vt;
        if (exp1.type.isVec())
            vt = vec[exp1.type.vecDimension()];
        else if (exp2.type.isVec())
            vt = vec[exp2.type.vecDimension()];
        var v1 = exp1.evaluate(cache), v2 = exp2.evaluate(cache);
        if (exp1.type.equals(Shade.Types.intT) && 
            exp2.type.equals(Shade.Types.intT))
            return v1 - v2;
        if (exp1.type.equals(Shade.Types.floatT) &&
            exp2.type.equals(Shade.Types.floatT))
            return v1 - v2;
        if (exp2.type.equals(Shade.Types.floatT))
            return vt.map(v1, function(x) { 
                return x - v2; 
            });
        if (exp1.type.equals(Shade.Types.floatT))
            return vt.map(v2, function(x) {
                return v1 - x;
            });
        if (vt) {
            return vt.minus(v1, v2);
        } else if (exp1.type.isFunction()) {
            return function() {
                var args = _.map(arguments, Shade.make);
                return Shade.sub(v1.apply(this, args), v2.apply(this, args));
            };
        } else if (exp1.type.isStruct()) {
            var s = {};
            _.each(v1, function(v, k) {
                s[k] = evaluator(Shade.sub(exp1.field(k), exp2.field(k)), cache);
            });
            return s;
        } else {
            throw new Error("internal error, was not expecting types " +
                            exp1.type.repr() + " and " +
                            exp2.type.repr());
        }
    }
    function elementEvaluator(exp, i) {
        var e1 = exp.parents[0], e2 = exp.parents[1];
        var v1, v2;
        var t1 = e1.type, t2 = e2.type;
        if (t1.isPod() && t2.isPod()) {
            if (i === 0)
                return exp;
            else
                throw new Error("i > 0 in pod element");
        }
        if (t1.isStruct() || t2.isStruct())
            throw new Error("can't take elements of structs");
        if (t1.isFunction() || t2.isFunction())
            throw new Error("can't take elements of functions");

        if (e1.type.isVec() || e1.type.isMat())
            v1 = e1.element(i);
        else
            v1 = e1;
        if (e2.type.isVec() || e2.type.isVec())
            v2 = e2.element(i);
        else
            v2 = e2;
        return operator(v1, v2, "-", subTypeResolver, evaluator, elementEvaluator, "sub");
    }
    var currentResult = Shade.make(arguments[0]);
    for (var i=1; i<arguments.length; ++i) {
        currentResult = operator(currentResult, Shade.make(arguments[i]),
                                  "-", subTypeResolver, evaluator,
                                  elementEvaluator, "sub");
    }
    return currentResult;
};

Shade.div = function() {
    if (arguments.length === 0) throw new Error("div needs at least two arguments");
    function divTypeResolver(t1, t2) {
        if (_.isUndefined(t1))
            throw new Error("internal error: t1 multiplication with undefined type");
        if (_.isUndefined(t2))
            throw new Error("internal error: t2 multiplication with undefined type");
        var typeList = [
            [Shade.Types.vec4, Shade.Types.vec4, Shade.Types.vec4],
            [Shade.Types.mat4, Shade.Types.mat4, Shade.Types.mat4],
            [Shade.Types.floatT, Shade.Types.floatT, Shade.Types.floatT],
            [Shade.Types.vec4, Shade.Types.floatT, Shade.Types.vec4],
            [Shade.Types.floatT, Shade.Types.vec4, Shade.Types.vec4],
            [Shade.Types.mat4, Shade.Types.floatT, Shade.Types.mat4],
            [Shade.Types.floatT, Shade.Types.mat4, Shade.Types.mat4],

            [Shade.Types.vec3, Shade.Types.vec3, Shade.Types.vec3],
            [Shade.Types.mat3, Shade.Types.mat3, Shade.Types.mat3],
            [Shade.Types.floatT, Shade.Types.floatT, Shade.Types.floatT],
            [Shade.Types.vec3, Shade.Types.floatT, Shade.Types.vec3],
            [Shade.Types.floatT, Shade.Types.vec3, Shade.Types.vec3],
            [Shade.Types.mat3, Shade.Types.floatT, Shade.Types.mat3],
            [Shade.Types.floatT, Shade.Types.mat3, Shade.Types.mat3],

            [Shade.Types.vec2, Shade.Types.vec2, Shade.Types.vec2],
            [Shade.Types.mat2, Shade.Types.mat2, Shade.Types.mat2],
            [Shade.Types.floatT, Shade.Types.floatT, Shade.Types.floatT],
            [Shade.Types.vec2, Shade.Types.floatT, Shade.Types.vec2],
            [Shade.Types.floatT, Shade.Types.vec2, Shade.Types.vec2],
            [Shade.Types.mat2, Shade.Types.floatT, Shade.Types.mat2],
            [Shade.Types.floatT, Shade.Types.mat2, Shade.Types.mat2],

            [Shade.Types.intT, Shade.Types.intT, Shade.Types.intT],

            [Shade.Types.functionT, Shade.Types.functionT, Shade.Types.functionT]
        ];
        for (var i=0; i<typeList.length; ++i)
            if (t1.equals(typeList[i][0]) &&
                t2.equals(typeList[i][1]))
                return typeList[i][2];
        throw new Error("type mismatch on div: unexpected types '"
                   + t1.repr() + "' and '" + t2.repr() + "'");
    }
    function evaluator(exp, cache) {
        var exp1 = exp.parents[0];
        var exp2 = exp.parents[1];
        var v1 = exp1.evaluate(cache);
        var v2 = exp2.evaluate(cache);
        var vt, mt;
        if (exp1.type.isArray()) {
            vt = vec[exp1.type.arraySize()];
            mt = mat[exp1.type.arraySize()];
        } else if (exp2.type.isArray()) {
            vt = vec[exp2.type.arraySize()];
            mt = mat[exp2.type.arraySize()];
        }
        var t1 = Shade.Types.typeOf(v1), t2 = Shade.Types.typeOf(v2);
        var k1 = t1.isVec() ? "vector" :
                 t1.isMat() ? "matrix" :
                 t1.isPod() ? "number" : 
                 t1.isFunction() ? "function" : "BAD";
        var k2 = t2.isVec() ? "vector" :
                 t2.isMat() ? "matrix" :
                 t2.isPod() ? "number" : 
                 t2.isFunction() ? "function" : "BAD";
        var dispatch = {
            number: { number: function (x, y) { 
                                  if (exp1.type.equals(Shade.Types.intT))
                                      return ~~(x / y);
                                  else
                                      return x / y;
                              },
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
                          throw new Error("internal error, can't evaluate vector/matrix");
                      }
                    },
            matrix: { number: function (x, y) { return mt.scaling(x, 1/y); },
                      vector: function (x, y) { 
                          throw new Error("internal error, can't evaluate matrix/vector");
                      },
                      matrix: function (x, y) { 
                          throw new Error("internal error, can't evaluate matrix/matrix");
                      }
                    },
            "function": { 
                "function": function (x, y) {
                    return function() {
                        var args = _.map(arguments, Shade.make);
                        return Shade.div(x.apply(this, args), y.apply(this, args));
                    };
                }
            }
        };
        if (k1 === "BAD" || k2 === "BAD")
            console.log(t1.repr(), t2.repr());
        return dispatch[k1][k2](v1, v2);
    }
    function elementEvaluator(exp, i) {
        var e1 = exp.parents[0], e2 = exp.parents[1];
        var v1, v2;
        var t1 = e1.type, t2 = e2.type;
        if (t1.isPod() && t2.isPod()) {
            if (i === 0)
                return exp;
            else
                throw new Error("i > 0 in pod element");
        }
        if (e1.type.isVec() || e1.type.isMat())
            v1 = e1.element(i);
        else
            v1 = e1;
        if (e2.type.isVec() || e2.type.isVec())
            v2 = e2.element(i);
        else
            v2 = e2;
        if (t1.isFunction() || t2.isFunction())
            throw new Error("can't take elements of functions");
        return operator(v1, v2, "/", divTypeResolver, evaluator, elementEvaluator, "div");
    }
    var currentResult = Shade.make(arguments[0]);
    for (var i=1; i<arguments.length; ++i) {
        currentResult = operator(currentResult, Shade.make(arguments[i]),
                                  "/", divTypeResolver, evaluator, elementEvaluator,
                                  "div");
    }
    return currentResult;
};

Shade.mul = function() {
    if (arguments.length === 0) throw new Error("mul needs at least one argument");
    if (arguments.length === 1) return arguments[0];
    function mulTypeResolver(t1, t2) {
        if (_.isUndefined(t1))
            throw new Error("t1 multiplication with undefined type?");
        if (_.isUndefined(t2))
            throw new Error("t2 multiplication with undefined type?");
        var typeList = [
            [Shade.Types.vec4, Shade.Types.vec4, Shade.Types.vec4],
            [Shade.Types.mat4, Shade.Types.mat4, Shade.Types.mat4],
            [Shade.Types.mat4, Shade.Types.vec4, Shade.Types.vec4],
            [Shade.Types.vec4, Shade.Types.mat4, Shade.Types.vec4],
            [Shade.Types.floatT, Shade.Types.floatT, Shade.Types.floatT],
            [Shade.Types.vec4, Shade.Types.floatT, Shade.Types.vec4],
            [Shade.Types.floatT, Shade.Types.vec4, Shade.Types.vec4],
            [Shade.Types.mat4, Shade.Types.floatT, Shade.Types.mat4],
            [Shade.Types.floatT, Shade.Types.mat4, Shade.Types.mat4],

            [Shade.Types.vec3, Shade.Types.vec3, Shade.Types.vec3],
            [Shade.Types.mat3, Shade.Types.mat3, Shade.Types.mat3],
            [Shade.Types.mat3, Shade.Types.vec3, Shade.Types.vec3],
            [Shade.Types.vec3, Shade.Types.mat3, Shade.Types.vec3],
            [Shade.Types.floatT, Shade.Types.floatT, Shade.Types.floatT],
            [Shade.Types.vec3, Shade.Types.floatT, Shade.Types.vec3],
            [Shade.Types.floatT, Shade.Types.vec3, Shade.Types.vec3],
            [Shade.Types.mat3, Shade.Types.floatT, Shade.Types.mat3],
            [Shade.Types.floatT, Shade.Types.mat3, Shade.Types.mat3],

            [Shade.Types.vec2, Shade.Types.vec2, Shade.Types.vec2],
            [Shade.Types.mat2, Shade.Types.mat2, Shade.Types.mat2],
            [Shade.Types.mat2, Shade.Types.vec2, Shade.Types.vec2],
            [Shade.Types.vec2, Shade.Types.mat2, Shade.Types.vec2],
            [Shade.Types.floatT, Shade.Types.floatT, Shade.Types.floatT],
            [Shade.Types.vec2, Shade.Types.floatT, Shade.Types.vec2],
            [Shade.Types.floatT, Shade.Types.vec2, Shade.Types.vec2],
            [Shade.Types.mat2, Shade.Types.floatT, Shade.Types.mat2],
            [Shade.Types.floatT, Shade.Types.mat2, Shade.Types.mat2],
            
            [Shade.Types.intT, Shade.Types.intT, Shade.Types.intT],
            [Shade.Types.functionT, Shade.Types.functionT, Shade.Types.functionT]
        ];
        for (var i=0; i<typeList.length; ++i)
            if (t1.equals(typeList[i][0]) &&
                t2.equals(typeList[i][1]))
                return typeList[i][2];
        throw new Error("type mismatch on mul: unexpected types  '"
                   + t1.repr() + "' and '" + t2.repr() + "'.");
    }
    function evaluator(exp, cache) {
        var exp1 = exp.parents[0];
        var exp2 = exp.parents[1];
        var v1 = exp1.evaluate(cache);
        var v2 = exp2.evaluate(cache);
        var vt, mt;
        if (exp1.type.isArray()) {
            vt = vec[exp1.type.arraySize()];
            mt = mat[exp1.type.arraySize()];
        } else if (exp2.type.isArray()) {
            vt = vec[exp2.type.arraySize()];
            mt = mat[exp2.type.arraySize()];
        }
        var t1 = Shade.Types.typeOf(v1), t2 = Shade.Types.typeOf(v2);
        var k1 = t1.isVec() ? "vector" :
                 t1.isMat() ? "matrix" :
                 t1.isPod() ? "number" : 
                 t1.isFunction() ? "function" : "BAD";
        var k2 = t2.isVec() ? "vector" :
                 t2.isMat() ? "matrix" :
                 t2.isPod() ? "number" : 
                 t2.isFunction() ? "function" : "BAD";
        var dispatch = {
            number: { number: function (x, y) { return x * y; },
                      vector: function (x, y) { return vt.scaling(y, x); },
                      matrix: function (x, y) { return mt.scaling(y, x); }
                    },
            vector: { number: function (x, y) { return vt.scaling(x, y); },
                      vector: function (x, y) {
                          return vt.schurProduct(x, y);
                      },
                      matrix: function (x, y) {
                          return mt.productVec(mt.transpose(y), x);
                      }
                    },
            matrix: { number: function (x, y) { return mt.scaling(x, y); },
                      vector: function (x, y) { return mt.productVec(x, y); },
                      matrix: function (x, y) { return mt.product(x, y); }
                    },
            "function": { "function": function(x, y) {
                return function() {
                    var args = _.map(arguments, Shade.make);
                    return Shade.mul(x.apply(this, args), y.apply(this, args));
                };
            }}
        };
        return dispatch[k1][k2](v1, v2);
    }
    function elementEvaluator(exp, i) {
        var e1 = exp.parents[0], e2 = exp.parents[1];
        var v1, v2;
        var t1 = e1.type, t2 = e2.type;
        if (t1.isPod() && t2.isPod()) {
            if (i === 0)
                return exp;
            else
                throw new Error("i > 0 in pod element");
        }
        function valueKind(t) {
            if (t.isPod())
                return "pod";
            if (t.isVec())
                return "vec";
            if (t.isMat())
                return "mat";
            throw new Error("internal error: not pod, vec or mat");
        }
        var k1 = valueKind(t1), k2 = valueKind(t2);
        var dispatch = {
            "pod": { 
                "pod": function() { 
                    throw new Error("internal error, pod pod"); 
                },
                "vec": function() { 
                    v1 = e1; v2 = e2.element(i); 
                    return operator(v1, v2, "*", mulTypeResolver, evaluator, elementEvaluator, "mul");
                },
                "mat": function() { 
                    v1 = e1; v2 = e2.element(i); 
                    return operator(v1, v2, "*", mulTypeResolver, evaluator, elementEvaluator, "mul");
                }
            },
            "vec": { 
                "pod": function() { 
                    v1 = e1.element(i); v2 = e2; 
                    return operator(v1, v2, "*", mulTypeResolver, evaluator, elementEvaluator, "mul");
                },
                "vec": function() { 
                    v1 = e1.element(i); v2 = e2.element(i); 
                    return operator(v1, v2, "*", mulTypeResolver, evaluator, elementEvaluator, "mul");
                },
                "mat": function() {
                    // FIXME should we have a matDimension?
                    return Shade.dot(e1, e2.element(i));
                }
            },
            "mat": { 
                "pod": function() { 
                    v1 = e1.element(i); v2 = e2;
                    return operator(v1, v2, "*", mulTypeResolver, evaluator, elementEvaluator, "mul");
                },
                "vec": function() {
                    // FIXME should we have a matDimension?
                    var d = t1.arraySize();
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
                        throw new Error("bad dimension for mat " + d);
                    return Shade.dot(row, e2);
                    // var row = e1.element(i);
                    // return Shade.dot(row, e2);
                },
                "mat": function() {
                    var col = e2.element(i);
                    return operator(e1, col, "*", mulTypeResolver, evaluator, elementEvaluator,
                                    "mul");
                }
            }
        };
        return dispatch[k1][k2]();
    };
    var currentResult = Shade.make(arguments[0]);
    for (var i=1; i<arguments.length; ++i) {
        if (currentResult.type.equals(Shade.Types.mat4)) {
            if (arguments[i].type.equals(Shade.Types.vec2)) {
                arguments[i] = Shade.vec(arguments[i], 0, 1);
            } else if (arguments[i].type.equals(Shade.Types.vec3)) {
                arguments[i] = Shade.vec(arguments[i], 1);
            }
        }
        currentResult = operator(currentResult, Shade.make(arguments[i]),
                                  "*", mulTypeResolver, evaluator, elementEvaluator, "mul");
    }
    return currentResult;
};
})();
