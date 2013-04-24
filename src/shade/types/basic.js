(function() {

function is_valid_basic_type(repr) {
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
    if (!is_valid_basic_type(repr)) {
        throw new Error("invalid basic type '" + repr + "'");
    }
    return Shade.Types[repr];
};

Shade.Types._create_basic = function(repr) { 
    return Shade._create(Shade.Types.base_t, {
        declare: function(glsl_name) { return repr + " " + glsl_name; },
        repr: function() { return repr; },
        swizzle: function(pattern) {
            if (!this.is_vec()) {
                throw new Error("swizzle requires a vec");
            }
            var base_repr = this.repr();
            var base_size = Number(base_repr[base_repr.length-1]);

            var valid_re, group_res;
            switch (base_size) {
            case 2:
                valid_re = /[rgxyst]+/;
                group_res = [ /[rg]/, /[xy]/, /[st]/ ];
                break;
            case 3:
                valid_re = /[rgbxyzstp]+/;
                group_res = [ /[rgb]/, /[xyz]/, /[stp]/ ];
                break;
            case 4:
                valid_re = /[rgbazxyzwstpq]+/;
                group_res = [ /[rgba]/, /[xyzw]/, /[stpq]/ ];
                break;
            default:
                throw new Error("internal error on swizzle");
            }
            if (!pattern.match(valid_re)) {
                throw new Error("invalid swizzle pattern '" + pattern + "'");
            }
            var count = 0;
            for (var i=0; i<group_res.length; ++i) {
                if (pattern.match(group_res[i])) count += 1;
            }
            if (count != 1) {
                throw new Error("swizzle pattern '" + pattern + 
                       "' belongs to more than one group");
            }
            if (pattern.length === 1) {
                return this.array_base();
            } else {
                var type_str = base_repr.substring(0, base_repr.length-1) + pattern.length;
                return Shade.Types[type_str];
            }
        },
        is_pod: function() {
            var repr = this.repr();
            return ["float", "bool", "int"].indexOf(repr) !== -1;
        },
        is_vec: function() {
            var repr = this.repr();
            if (repr.substring(0, 3) === "vec")
                return true;
            if (repr.substring(0, 4) === "ivec")
                return true;
            if (repr.substring(0, 4) === "bvec")
                return true;
            return false;
        },
        is_mat: function() {
            var repr = this.repr();
            if (repr.substring(0, 3) === "mat")
                return true;
            return false;
        },
        vec_dimension: function() {
            var repr = this.repr();
            if (repr.substring(0, 3) === "vec")
                return parseInt(repr[3], 10);
            if (repr.substring(0, 4) === "ivec" ||
                repr.substring(0, 4) === "bvec")
                return parseInt(repr[4], 10);
            if (this.repr() === 'float'
                || this.repr() === 'int'
                || this.repr() === 'bool')
                // This is convenient: assuming vec_dimension() === 1 for POD 
                // lets me pretend floats, ints and bools are vec1, ivec1 and bvec1.
                // 
                // However, this might have
                // other bad consequences I have not thought of.
                //
                // For example, I cannot make float_t.is_vec() be true, because
                // this would allow sizzling from a float, which GLSL disallows.
                return 1;
            if (!this.is_vec()) {
                throw new Error("is_vec() === false, cannot call vec_dimension");
            }
            throw new Error("internal error");
        },
        is_array: function() {
            var repr = this.repr();
            if (repr.substring(0, 3) === "mat")
                return true;
            if (this.is_vec())
                return true;
            return false;
        },
        array_base: function() {
            var repr = this.repr();
            if (repr.substring(0, 3) === "mat")
                return Shade.Types["vec" + repr[3]];
            if (repr.substring(0, 3) === "vec")
                return Shade.Types.float_t;
            if (repr.substring(0, 4) === "bvec")
                return Shade.Types.bool_t;
            if (repr.substring(0, 4) === "ivec")
                return Shade.Types.int_t;
            if (repr === "float")
                return Shade.Types.float_t;
            throw new Error("datatype not array");
        },
        size_for_vec_constructor: function() {
            var repr = this.repr();
            if (this.is_array())
                return this.array_size();
            if (repr === 'float' ||
                repr === 'bool' ||
                repr === 'int')
                return 1;
            throw new Error("not usable inside vec constructor");
        },
        array_size: function() {
            if (this.is_vec())
                return this.vec_dimension();
            var repr = this.repr();
            if (repr.substring(0, 3) === "mat")  
                return parseInt(repr[3], 10);
            throw new Error("datatype not array");
        },
        is_floating: function() {
            var repr = this.repr();
            if (repr === "float")
                return true;
            if (repr.substring(0, 3) === "vec")
                return true;
            if (repr.substring(0, 3) === "mat")
                return true;
            return false;
        },
        is_integral: function() {
            var repr = this.repr();
            if (repr === "int")
                return true;
            if (repr.substring(0, 4) === "ivec")
                return true;
            return false;
        },
        is_sampler: function() {
            var repr = this.repr();
            if (repr === 'sampler2D')
                return true;
            return false;
        },
        element_type: function(i) {
            if (this.is_pod()) {
                if (i === 0)
                    return this;
                else
                    throw new Error("invalid call: " + this.repr() + " is atomic");
            } else if (this.is_vec()) {
                var f = this.repr()[0];
                var d = this.array_size();
                if (i < 0 || i >= d) {
                    throw new Error("invalid call: " + this.repr() + 
                                    " has no element " + i);
                }
                if (f === 'v')
                    return Shade.Types.float_t;
                else if (f === 'b')
                    return Shade.Types.bool_t;
                else if (f === 'i')
                    return Shade.Types.int_t;
                else
                    throw new Error("internal error");
            } else
                // FIXME implement this
                throw new Error("unimplemented for mats");
        },
        value_equals: function(v1, v2) {
            if (this.is_pod())
                return v1 === v2;
            if (this.is_vec() || this.is_mat())
                return _.all(_.range(v1.length), function(i) { return v1[i] === v2[i]; });
            else
                throw new Error("bad type for equality comparison: " + this.repr());
        }
    });
};

})();
