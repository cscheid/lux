Lux.Marks.lines = function(opts)
{
    opts = _.defaults(opts || {}, {
        mode: Lux.DrawingMode.standard,
        z: function() { return 0; }
    });

    if (_.isUndefined(opts.elements)) throw new Error("elements is a required field");
    if (_.isUndefined(opts.color))    throw new Error("color is a required field");
    if (_.isUndefined(opts.position) && 
        (_.isUndefined(opts.x) || _.isUndefined(opts.y))) {
        throw new Error("either position or x and y are required fields");
    }
    if (Lux.isShadeExpression(opts.color)) {
        var ccolor = opts.color;
        opts.color = function() { return ccolor; };
    }

    var vertexIndex  = Lux.attributeBuffer({
        vertexArray: _.range(opts.elements * 2), 
        itemSize: 1
    });
    var primitiveIndex    = Shade.div(vertexIndex, 2).floor();
    var vertexInPrimitive = Shade.mod(vertexIndex, 2).floor();

    var position = opts.position 
        ? opts.position(primitiveIndex, vertexInPrimitive)
        : Shade.vec(opts.x(primitiveIndex, vertexInPrimitive),
                    opts.y(primitiveIndex, vertexInPrimitive),
                    opts.z(primitiveIndex, vertexInPrimitive));

    var appearance = {
        mode: opts.mode,
        position: position,
        color: opts.color(primitiveIndex, vertexInPrimitive)
    };
    if (opts.lineWidth) {
        appearance.lineWidth = opts.lineWidth;
    }
    var model = {
        type: "lines",
        elements: vertexIndex
    };
    return Lux.actor({ model: model, appearance: appearance });
};
