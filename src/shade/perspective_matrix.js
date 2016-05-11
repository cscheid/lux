Shade.perspectiveMatrix = Shade.make(function(fovy, aspect, near, far)
{
    var top = near.mul(Shade.tan(fovy.mul(Math.PI / 360)));
    var right = top.mul(aspect);
    return Shade.frustum(right.neg(), right, top.neg(), top, near, far);
});
