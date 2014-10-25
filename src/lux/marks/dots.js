Lux.Marks.dots = function(opts)
{
    opts = _.defaults(opts, {
        fillColor: Shade.vec(0,0,0,1),
        strokeColor: Shade.vec(0,0,0,1),
        pointDiameter: 5,
        strokeWidth: 2,
        mode: Lux.DrawingMode.overWithDepth,
        alpha: true,
        plain: false
    });

    if (!opts.position)
        throw new Error("missing required parameter 'position'");
    if (!opts.elements)
        throw new Error("missing required parameter 'elements'");

    var S = Shade;
    var ctx = Lux._globals.ctx;

    var fillColor     = Shade(opts.fillColor);
    var strokeColor   = Shade(opts.strokeColor);
    var pointDiameter = Shade(opts.pointDiameter).mul(ctx._luxGlobals.devicePixelRatio);
    var strokeWidth   = Shade(opts.strokeWidth).add(1);
    var useAlpha      = Shade(opts.alpha);
    opts.plain = Shade(opts.plain);
    
    var modelOpts = {
        type: "points",
        vertex: opts.position,
        elements: opts.elements
    };

    var model = Lux.model(modelOpts);

    var distanceToCenterInPixels = S.pointCoord().sub(S.vec(0.5, 0.5))
        .norm().mul(pointDiameter);
    var pointRadius = pointDiameter.div(2);
    var distanceToBorder = pointRadius.sub(distanceToCenterInPixels);
    var glPosition = model.vertex;

    var noAlpha = S.mix(fillColor, strokeColor,
                        S.clamp(strokeWidth.sub(distanceToBorder), 0, 1));
    
    var plainFillColor = fillColor;
    var alphaFillColor = 
        S.ifelse(useAlpha,
                 noAlpha.mul(S.vec(1,1,1,S.clamp(distanceToBorder, 0, 1))),
                 noAlpha)
        .discardIf(distanceToCenterInPixels.gt(pointRadius));

    var result = Lux.actor({
        model: model, 
        appearance: {
            position: glPosition,
            pointSize: pointDiameter,
            color: opts.plain.ifelse(plainFillColor, alphaFillColor),
            mode: opts.mode,
            pickId: opts.pickId }});

    /* We pass the glPosition attribute explicitly because some other
     call might want to explicitly use the same position of the dots marks.

     This is the exact use case of dot-and-line graph drawing.
     */
    result.glPosition = glPosition;
    return result;
};
