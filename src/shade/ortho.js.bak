Shade.ortho = Shade.make(function(left, right, bottom, top, near, far) {
    var rl = right.sub(left);
    var tb = top.sub(bottom);
    var fn = far.sub(near);
    return Shade.mat(Shade.vec(Shade.div(2, rl), 0, 0, 0),
                     Shade.vec(0, Shade.div(2, tb), 0, 0),
                     Shade.vec(0, 0, Shade.div(-2, fn), 0),
                     Shade.vec(Shade.add(right, left).neg().div(rl),
                               Shade.add(top, bottom).neg().div(tb),
                               Shade.add(far, near).neg().div(fn),
                               1));
});
