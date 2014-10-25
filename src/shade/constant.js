// Shade.constant creates a constant value in the Shade language.
// 
// This value can be one of:
// - a single float: 
//    Shade.constant(1)
//    Shade.constant(3.0, Shade.Types.floatT)
// - a single integer:
//    Shade.constant(1, Shade.Types.intT)
// - a boolean:
//    Shade.constant(false);
// - a GLSL vec2, vec3 or vec4 (of floating point values):
//    Shade.constant(2, vec.make([1, 2]));
// - a GLSL matrix of dimensions 2x2, 3x3, 4x4 (Lux currently does not support GLSL rectangular matrices):
//    Shade.constant(2, mat.make([1, 0, 0, 1]));
// - an array
// - a struct

Shade.constant = function(v, type)
{
    var matLengthToDimension = {16: 4, 9: 3, 4: 2, 1: 1};

    var constantTupleFun = function(type, args)
    {
        function toGlsl(type, args) {
            // this seems incredibly ugly, but we need something
            // like it, so that numbers are appropriately promoted to floats
            // in GLSL's syntax.

            var stringArgs = _.map(args, function(arg) {
                var v = String(arg);
                if (Lux.typeOf(arg) === "number" && v.indexOf(".") === -1) {
                    return v + ".0";
                } else
                    return v;
            });
            return type + '(' + _.toArray(stringArgs).join(', ') + ')';
        }

        function matrixRow(i) {
            var sz = type.arraySize();
            var result = [];
            for (var j=0; j<sz; ++j) {
                result.push(args[i + j*sz]);
            }
            return result;
        }

        return Shade._createConcreteExp( {
            glslExpression: function(glslName) {
                return toGlsl(this.type.repr(), args);
            },
            expressionType: "constant{" + args + "}",
            isConstant: function() { return true; },
            element: Shade.memoizeOnField("_element", function(i) {
                if (this.type.isPod()) {
                    if (i === 0)
                        return this;
                    else
                        throw new Error(this.type.repr() + " is an atomic type, got this: " + i);
                } else if (this.type.isVec()) {
                    return Shade.constant(args[i]);
                } else {
                    return Shade.vec.apply(matrixRow(i));
                }
            }),
            elementIsConstant: function(i) {
                return true;
            },
            elementConstantValue: Shade.memoizeOnField("_elementConstantValue", function(i) {
                if (this.type.equals(Shade.Types.floatT)) {
                    if (i === 0)
                        return args[0];
                    else
                        throw new Error("float is an atomic type");
                } if (this.type.isVec()) {
                    return args[i];
                }
                return vec[this.type.arraySize()].make(matrixRow(i));
            }),
            evaluate: Shade.memoizeOnGuidDict(function(cache) {
                // FIXME booleanVector
                if (this.type.isPod())
                    return args[0];
                if (this.type.equals(Shade.Types.vec2) ||
                    this.type.equals(Shade.Types.vec3) ||
                    this.type.equals(Shade.Types.vec4))
                    return vec[args.length].make(args);
                if (this.type.equals(Shade.Types.mat2) ||
                    this.type.equals(Shade.Types.mat3) ||
                    this.type.equals(Shade.Types.mat4))
                    return mat[matLengthToDimension[args.length]].make(args);
                else
                    throw new Error("internal error: constant of unknown type");
            }),
            compile: function(ctx) {},
            parents: [],
            type: type,

            //////////////////////////////////////////////////////////////////
            // debugging

            _jsonHelper: Shade.Debug._jsonBuilder("constant", function(obj) {
                obj.values = args;
                return obj;
            })
        });
    };

    // FIXME refactor this since typeOf result is now a Shade.Types.*
    var t = Shade.Types.typeOf(v);
    var d, computedT;
    if (t.equals(Shade.Types.floatT)) {
        if (type && !(type.equals(Shade.Types.floatT) ||
                      type.equals(Shade.Types.intT))) {
            throw new Error("expected specified type for numbers to be float or int," +
                   " got " + type.repr() + " instead.");
        }
        return constantTupleFun(type || Shade.Types.floatT, [v]);
    } else if (t.equals(Shade.Types.boolT)) {
        if (type && !type.equals(Shade.Types.boolT))
            throw new Error("boolean constants cannot be interpreted as " + 
                   type.repr());
        return constantTupleFun(Shade.Types.boolT, [v]);
    } else if (t.repr().substr(0,3) === 'vec') {
        d = v.length;
        if (d < 2 && d > 4)
            throw new Error("invalid length for constant vector: " + v);
        var elTs = _.map(v, function(t) { return Lux.typeOf(t); });
        if (!_.all(elTs, function(t) { return t === elTs[0]; })) {
            throw new Error("not all constant params have the same types");
        }
        if (elTs[0] === "number") {
            computedT = Shade.Types['vec' + d];
            if (type && !computedT.equals(type)) {
                throw new Error("passed constant must have type " + computedT.repr()
                    + ", but was request to have incompatible type " 
                    + type.repr());
            }
            return constantTupleFun(computedT, v);
        }
        else
            throw new Error("bad datatype for constant: " + elTs[0]);
    } else if (t.repr().substr(0,3) === 'mat') {
        d = matLengthToDimension[v.length];
        computedT = Shade.Types['mat' + d];
        if (type && !computedT.equals(type)) {
            throw new Error("passed constant must have type " + computedT.repr()
                            + ", but was requested to have incompatible type " 
                            + type.repr());
        }
        return constantTupleFun(computedT, v);
    } else if (type.isStruct()) {
        var obj = {};
        _.each(v, function(val, k) {
            obj[k] = Shade.constant(val, type.fields[k]);
        });
        return Shade.struct(obj);
    } else {
        throw new Error("type error: constant should be bool, number, vector, matrix, array or struct. got " + t
                        + " instead");
    }
    throw new Error("internal error: Shade.Types.typeOf returned bogus value");
};

Shade.asInt = function(v) { return Shade.make(v).asInt(); };
Shade.asBool = function(v) { return Shade.make(v).asBool(); };
Shade.asFloat = function(v) { return Shade.make(v).asFloat(); };
