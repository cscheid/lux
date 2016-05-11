/*
 * FIXME Shade.Camera.ortho currently mixes a view matrix
 * with the projection matrix. This must be factored out.
 */

Shade.Camera.ortho = function(opts)
{
    opts = _.defaults(opts || {}, {
        left: -1,
        right: 1,
        bottom: -1,
        top: 1,
        near: -1,
        far: 1,
        center: vec.make([0,0]),
        zoom: 1
    });

    var viewportRatio;
    var ctx;
    if (opts.aspectRatio)
        viewportRatio = opts.aspectRatio;
    else {
        ctx = Lux._globals.ctx;
        if (_.isUndefined(ctx)) {
            throw new Error("aspectRatio is only optional with an active Lux context");
        }
        viewportRatio = ctx.parameters.width.div(ctx.parameters.height);
    };

    var left, right, bottom, top;
    var near = opts.near;
    var far = opts.far;

    left = opts.left;
    right = opts.right;
    bottom = opts.bottom;
    top = opts.top;

    var viewRatio = Shade.sub(right, left).div(Shade.sub(top, bottom));
    var lOrP = viewRatio.gt(viewportRatio); // letterbox or pillarbox

    var cx = Shade.add(right, left).div(2);
    var cy = Shade.add(top, bottom).div(2);
    var halfWidth = Shade.sub(right, left).div(2);
    var halfHeight = Shade.sub(top, bottom).div(2);
    var correctedHalfWidth = halfHeight.mul(viewportRatio);
    var correctedHalfHeight = halfWidth.div(viewportRatio);

    var l = lOrP.ifelse(left,  cx.sub(correctedHalfWidth));
    var r = lOrP.ifelse(right, cx.add(correctedHalfWidth));
    var b = lOrP.ifelse(cy.sub(correctedHalfHeight), bottom);
    var t = lOrP.ifelse(cy.add(correctedHalfHeight), top);
    var m = Shade.ortho(l, r, b, t, near, far);

    function replaceXyWith(vec, newVec) {
        if (vec.type === Shade.Types.vec2)
            return newVec;
        else if (vec.type === Shade.Types.vec3)
            return Shade.vec(newVec, vec.z());
        else if (vec.type === Shade.Types.vec4)
            return Shade.vec(newVec, vec.swizzle("zw"));
        else
            throw new Error("Shade.ortho requires vec2, vec3, or vec4s");
    };

    var viewXform = Shade(function(modelVertex) {
        var newV = modelVertex.swizzle("xy").sub(opts.center).mul(opts.zoom);
        return replaceXyWith(modelVertex, newV);
    });
    var viewXformInvert = Shade(function(viewVertex) {
        var newV = viewVertex.swizzle("xy").div(opts.zoom).add(opts.center);
        return replaceXyWith(viewVertex, newV);
    });

    function result(obj) {
        return result.project(obj);
    }
    result.modelToView = viewXform;
    result.viewToDevice = function(viewVertex) {
        return m.mul(viewVertex);
    };
    result.project = function(modelVertex) {
        return m.mul(viewXform(modelVertex));
    };
    result.unproject = function(normalizedViewPos) {
        // var invM = Shade.Scale.linear({
        //     domain: [Shade.vec(-1,-1,-1),
        //              Shade.vec( 1, 1, 1)],
        //     range: [Shade.vec(l, b, near),
        //             Shade.vec(r, t, far)]});
        var invM = Shade.Scale.linear({
            domain: [Shade.vec(-1,-1),
                     Shade.vec( 1, 1)],
            range: [Shade.vec(l, b),
                    Shade.vec(r, t)]});
        return viewXformInvert(invM(normalizedViewPos));
        // var ctx = Lux._globals.ctx;
        // var screenSize = Shade.vec(ctx.parameters.width, ctx.parameters.height);
        // var viewVtx = min.add(max.sub(min).mul(screenPos.div(screenSize)));
        // return viewXformInvert(viewVtx);
    };
    return result;
};
