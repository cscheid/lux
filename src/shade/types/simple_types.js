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
})();
