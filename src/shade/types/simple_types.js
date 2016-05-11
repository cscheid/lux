(function() {

    var simpleTypes = 
        ["mat2", "mat3", "mat4",
         "vec2", "vec3", "vec4",
         "ivec2", "ivec3", "ivec4",
         "bvec2", "bvec3", "bvec4"];

    for (var i=0; i<simpleTypes.length; ++i) {
        Shade.Types[simpleTypes[i]] = Shade.Types._createBasic(simpleTypes[i]);
    }

    Shade.Types.floatT   = Shade.Types._createBasic('float');
    Shade.Types.boolT    = Shade.Types._createBasic('bool');
    Shade.Types.intT     = Shade.Types._createBasic('int');

    Shade.Types.sampler2D = Shade.Types._createBasic('sampler2D');
    Shade.Types.voidT    = Shade.Types._createBasic('void');

    // create aliases so that x === y.repr() implies Shade.Types[x] === y
    Shade.Types["float"] = Shade.Types.floatT;
    Shade.Types["bool"]  = Shade.Types.boolT;
    Shade.Types["int"]   = Shade.Types.intT;
    Shade.Types["void"]  = Shade.Types.voidT;

    // represents other "non-constant" types. kludgy, but hey.
    Shade.Types.undefinedT = Shade.Types._createBasic('<undefined>');
    Shade.Types.shadeT     = Shade.Types._createBasic('<shade>');
    Shade.Types.otherT     = Shade.Types._createBasic('<other>');
})();
