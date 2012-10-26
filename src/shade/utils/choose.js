// given a list of values, returns a function which, when given a
// value between 0 and l, returns the value of the index;

// box function reconstruction

Shade.Utils.choose = function(lst) {
    var new_lst = _.toArray(lst);
    var vals_exp = Shade.array(new_lst);
    return function(v) {
        v = Shade.clamp(v, 0, new_lst.length-1).floor().as_int();
        return vals_exp.at(v);
    };
};
