//////////////////////////////////////////////////////////////////////////
// This is like a poor man's instancing/geometry shader. I need a
// general API for it.

Lux.Marks.alignedRects = function(opts)
{
    opts = _.defaults(opts || {}, {
        mode: Lux.DrawingMode.standard,
        z: function() { return 0; }
    });
    if (!opts.elements) throw new Error("elements is a required field");
    if (!opts.left)     throw new Error("left is a required field");
    if (!opts.right)    throw new Error("right is a required field");
    if (!opts.top)      throw new Error("top is a required field");
    if (!opts.bottom)   throw new Error("bottom is a required field");
    if (!opts.color)    throw new Error("color is a required field");

    var index = _.range(opts.elements * 6);
    var vertexIndex = Lux.attributeBuffer({ 
        vertexArray: index, 
        itemSize: 1
    });
    var primitiveIndex = Shade.div(vertexIndex, 6).floor();
    var vertexInPrimitive = Shade.mod(vertexIndex, 6).floor();

    // 0 -> 0
    // 1 -> 2
    // 2 -> 3
    // 3 -> 0
    // 4 -> 1
    // 5 -> 2
    // this tries to avoid the "index expression must be constant" nonsense.
    var indexInVertexPrimitive = vertexInPrimitive.mod(3)
        .add(vertexInPrimitive.lt(3).
             and(vertexInPrimitive.ne(0)).
             ifelse(1,0));

    // aif == applyIfFunction
    var aif = function(f, params) {
        if (Lux.typeOf(f) === 'function')
            return f.apply(this, params);
        else
            return f;
    };

    var left   = aif(opts.left,   [primitiveIndex]),
        right  = aif(opts.right,  [primitiveIndex]),
        bottom = aif(opts.bottom, [primitiveIndex]),
        top    = aif(opts.top,    [primitiveIndex]),
        color  = aif(opts.color,  [primitiveIndex, indexInVertexPrimitive]),
        z      = aif(opts.z,      [primitiveIndex]);

    var lowerLeft  = Shade.vec(left,  bottom);
    var lowerRight = Shade.vec(right, bottom);
    var upperLeft  = Shade.vec(left,  top);
    var upperRight = Shade.vec(right, top);
    var vertexMap  = Shade.array([lowerLeft, upperRight, upperLeft,
                                  lowerLeft, lowerRight, upperRight]);

    var model = Lux.model({
        type: "triangles",
        elements: index
    });

    var appearance = {
        position: Shade.vec(vertexMap.at(vertexInPrimitive), z),
        color: color,
        pickId: opts.pickId,
        mode: opts.mode
    };

    return Lux.actor({ model: model, appearance: appearance });
};
