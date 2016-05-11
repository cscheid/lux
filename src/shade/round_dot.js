Shade.roundDot = function(color) {
    var outsideDot = Shade.pointCoord().sub(Shade.vec(0.5, 0.5)).norm().gt(0.25);
    return Shade.make(color).discardIf(outsideDot);
};
