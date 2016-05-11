// given a list of values, returns a function which, when given a
// value between 0 and l, returns the value of the index;

// box function reconstruction

Shade.Utils.choose = function(lst) {
    var newLst = _.toArray(lst);
    var valsExp = Shade.array(newLst);
    return function(v) {
        v = Shade.clamp(v, 0, newLst.length-1).floor().asInt();
        return valsExp.at(v);
    };
};
