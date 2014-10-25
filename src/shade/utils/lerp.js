// given a list of values, returns a function which, when given a
// value between 0 and 1, returns the appropriate linearly interpolated
// value.

// Hat function reconstruction

Shade.Utils.lerp = function(lst) {
    var newLst = _.toArray(lst);
    newLst.push(newLst[newLst.length-1]);
    // repeat last to make index calc easier
    return function(v) {
        var colorsExp = Shade.array(newLst);
        v = Shade.clamp(v, 0, 1).mul(newLst.length-2);
        var u = v.fract();
        var ix = v.floor();
        return Shade.mix(colorsExp.at(ix),
                         colorsExp.at(ix.add(1)),
                         u);
    };
};
