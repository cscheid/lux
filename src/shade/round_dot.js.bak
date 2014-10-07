Shade.round_dot = function(color) {
    var outside_dot = Shade.pointCoord().sub(Shade.vec(0.5, 0.5)).norm().gt(0.25);
    return Shade.make(color).discard_if(outside_dot);
};
