(function() {

function isValidBasicType(repr) {
    if (repr === 'float') return true;
    if (repr === 'int') return true;
    if (repr === 'bool') return true;
    if (repr === 'void') return true;
    if (repr === 'sampler2D') return true;
    if (repr.substring(0, 3) === 'mat' &&
        (Number(repr[3]) > 1 && 
         Number(repr[3]) < 5)) return true;
    if (repr.substring(0, 3) === 'vec' &&
        (Number(repr[3]) > 1 && 
         Number(repr[3]) < 5)) return true;
    if (repr.substring(0, 4) === 'bvec' &&
        (Number(repr[4]) > 1 && 
         Number(repr[4]) < 5)) return true;
    if (repr.substring(0, 4) === 'ivec' &&
        (Number(repr[4]) > 1 && 
         Number(repr[4]) < 5)) return true;
    // if (repr === '__auto__') return true;
    return false;
}

Shade.Types.basic = function(repr) {
    if (!isValidBasicType(repr)) {
        throw new Error("invalid basic type '" + repr + "'");
    }
    return Shade.Types[repr];
};

Shade.Types._createBasic = function(repr) { 
    return Shade._create(Shade.Types.baseT, {
        declare: function(glslName) { return repr + " " + glslName; },
        repr: function() { return repr; },
        swizzle: function(pattern) {
            if (!this.isVec()) {
                throw new Error("swizzle requires a vec");
            }
            var baseRepr = this.repr();
            var baseSize = Number(baseRepr[baseRepr.length-1]);

            var validRe, groupRes;
            switch (baseSize) {
            case 2:
                validRe = /[rgxyst]+/;
                groupRes = [ /[rg]/, /[xy]/, /[st]/ ];
                break;
            case 3:
                validRe = /[rgbxyzstp]+/;
                groupRes = [ /[rgb]/, /[xyz]/, /[stp]/ ];
                break;
            case 4:
                validRe = /[rgbaxyzwstpq]+/;
                groupRes = [ /[rgba]/, /[xyzw]/, /[stpq]/ ];
                break;
            default:
                throw new Error("internal error on swizzle");
            }
            if (!pattern.match(validRe)) {
                throw new Error("invalid swizzle pattern '" + pattern + "'");
            }
            var count = 0;
            for (var i=0; i<groupRes.length; ++i) {
                if (pattern.match(groupRes[i])) count += 1;
            }
            if (count != 1) {
                throw new Error("swizzle pattern '" + pattern + 
                       "' belongs to more than one group");
            }
            if (pattern.length === 1) {
                return this.arrayBase();
            } else {
                var typeStr = baseRepr.substring(0, baseRepr.length-1) + pattern.length;
                return Shade.Types[typeStr];
            }
        },
        isPod: function() {
            var repr = this.repr();
            return ["float", "bool", "int"].indexOf(repr) !== -1;
        },
        isVec: function() {
            var repr = this.repr();
            if (repr.substring(0, 3) === "vec")
                return true;
            if (repr.substring(0, 4) === "ivec")
                return true;
            if (repr.substring(0, 4) === "bvec")
                return true;
            return false;
        },
        isMat: function() {
            var repr = this.repr();
            if (repr.substring(0, 3) === "mat")
                return true;
            return false;
        },
        vecDimension: function() {
            var repr = this.repr();
            if (repr.substring(0, 3) === "vec")
                return parseInt(repr[3], 10);
            if (repr.substring(0, 4) === "ivec" ||
                repr.substring(0, 4) === "bvec")
                return parseInt(repr[4], 10);
            if (this.repr() === 'float'
                || this.repr() === 'int'
                || this.repr() === 'bool')
                // This is convenient: assuming vecDimension() === 1 for POD 
                // lets me pretend floats, ints and bools are vec1, ivec1 and bvec1.
                // 
                // However, this might have
                // other bad consequences I have not thought of.
                //
                // For example, I cannot make floatT.isVec() be true, because
                // this would allow sizzling from a float, which GLSL disallows.
                return 1;
            if (!this.isVec()) {
                throw new Error("isVec() === false, cannot call vecDimension");
            }
            throw new Error("internal error");
        },
        isArray: function() {
            var repr = this.repr();
            if (repr.substring(0, 3) === "mat")
                return true;
            if (this.isVec())
                return true;
            return false;
        },
        arrayBase: function() {
            var repr = this.repr();
            if (repr.substring(0, 3) === "mat")
                return Shade.Types["vec" + repr[3]];
            if (repr.substring(0, 3) === "vec")
                return Shade.Types.floatT;
            if (repr.substring(0, 4) === "bvec")
                return Shade.Types.boolT;
            if (repr.substring(0, 4) === "ivec")
                return Shade.Types.intT;
            if (repr === "float")
                return Shade.Types.floatT;
            throw new Error("datatype not array");
        },
        sizeForVecConstructor: function() {
            var repr = this.repr();
            if (this.isArray())
                return this.arraySize();
            if (repr === 'float' ||
                repr === 'bool' ||
                repr === 'int')
                return 1;
            throw new Error("not usable inside vec constructor");
        },
        arraySize: function() {
            if (this.isVec())
                return this.vecDimension();
            var repr = this.repr();
            if (repr.substring(0, 3) === "mat")  
                return parseInt(repr[3], 10);
            throw new Error("datatype not array");
        },
        isFloating: function() {
            var repr = this.repr();
            if (repr === "float")
                return true;
            if (repr.substring(0, 3) === "vec")
                return true;
            if (repr.substring(0, 3) === "mat")
                return true;
            return false;
        },
        isIntegral: function() {
            var repr = this.repr();
            if (repr === "int")
                return true;
            if (repr.substring(0, 4) === "ivec")
                return true;
            return false;
        },
        isSampler: function() {
            var repr = this.repr();
            if (repr === 'sampler2D')
                return true;
            return false;
        },
        elementType: function(i) {
            if (this.isPod()) {
                if (i === 0)
                    return this;
                else
                    throw new Error("invalid call: " + this.repr() + " is atomic");
            } else if (this.isVec()) {
                var f = this.repr()[0];
                var d = this.arraySize();
                if (i < 0 || i >= d) {
                    throw new Error("invalid call: " + this.repr() + 
                                    " has no element " + i);
                }
                if (f === 'v')
                    return Shade.Types.floatT;
                else if (f === 'b')
                    return Shade.Types.boolT;
                else if (f === 'i')
                    return Shade.Types.intT;
                else
                    throw new Error("internal error");
            } else
                // FIXME implement this
                throw new Error("unimplemented for mats");
        },
        valueEquals: function(v1, v2) {
            if (this.isPod())
                return v1 === v2;
            if (this.isVec())
                return vec.equal(v1, v2);
            if (this.isMat())
                return mat.equal(v1, v2);
            throw new Error("bad type for equality comparison: " + this.repr());
        }
    });
};

})();
