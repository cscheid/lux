Shade.frustum = Shade.make(function(left, right, bottom, top, near, far)
{
    var rl = right.sub(left);
    var tb = top.sub(bottom);
    var fn = far.sub(near);
    return Shade.mat(Shade.vec(near.mul(2).div(rl), 0, 0, 0),
                     Shade.vec(0, near.mul(2).div(tb), 0, 0),
                     Shade.vec(right.add(left).div(rl), 
                               top.add(bottom).div(tb), 
                               far.add(near).neg().div(fn),
                               -1),
                     Shade.vec(0, 0, far.mul(near).mul(2).neg().div(fn), 0));
});
