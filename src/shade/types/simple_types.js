(function() {

    var simple_types = 
        ["mat2", "mat3", "mat4",
         "vec2", "vec3", "vec4",
         "ivec2", "ivec3", "ivec4",
         "bvec2", "bvec3", "bvec4"];

    for (var i=0; i<simple_types.length; ++i) {
        Shade.Types[simple_types[i]] = Shade.basic(simple_types[i]);
    }

    Shade.Types.float_t   = Shade.basic('float');
    Shade.Types.bool_t    = Shade.basic('bool');
    Shade.Types.int_t     = Shade.basic('int');
    Shade.Types.sampler2D = Shade.basic('sampler2D');

    Shade.Types.int_t.zero   = "0";
    Shade.Types.float_t.zero = "0.0";
    Shade.Types.vec2.zero    = "vec2(0,0)";
    Shade.Types.vec3.zero    = "vec3(0,0,0)";
    Shade.Types.vec4.zero    = "vec4(0,0,0,0)";
    Shade.Types.mat2.zero    = "mat2(0,0,0,0)";
    Shade.Types.mat3.zero    = "mat3(0,0,0,0,0,0,0,0,0)";
    Shade.Types.mat4.zero    = "mat4(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0)";
})();
