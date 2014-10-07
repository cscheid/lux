(function() {

    var simple_types = 
        ["mat2", "mat3", "mat4",
         "vec2", "vec3", "vec4",
         "ivec2", "ivec3", "ivec4",
         "bvec2", "bvec3", "bvec4"];

    for (var i=0; i<simple_types.length; ++i) {
        Shade.Types[simple_types[i]] = Shade.Types._create_basic(simple_types[i]);
    }

    Shade.Types.float_t   = Shade.Types._create_basic('float');
    Shade.Types.bool_t    = Shade.Types._create_basic('bool');
    Shade.Types.int_t     = Shade.Types._create_basic('int');

    Shade.Types.sampler2D = Shade.Types._create_basic('sampler2D');
    Shade.Types.void_t    = Shade.Types._create_basic('void');

    // create aliases so that x === y.repr() implies Shade.Types[x] === y
    Shade.Types["float"] = Shade.Types.float_t;
    Shade.Types["bool"]  = Shade.Types.bool_t;
    Shade.Types["int"]   = Shade.Types.int_t;
    Shade.Types["void"]  = Shade.Types.void_t;

    // represents other "non-constant" types. kludgy, but hey.
    Shade.Types.undefined_t = Shade.Types._create_basic('<undefined>');
    Shade.Types.shade_t     = Shade.Types._create_basic('<shade>');
    Shade.Types.other_t     = Shade.Types._create_basic('<other>');
})();
