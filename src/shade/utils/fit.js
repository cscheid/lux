// returns a linear transformation of the coordinates such that the given list of values
// fits between [0, 1]

Shade.Utils.fit = function(data) {
    // this makes float attribute buffers work, but it might be confusing to the
    // user that there exist values v for which Shade.Utils.fit(v) works,
    // but Shade.Utils.fit(Shade.make(v)) does not
    var t = data._shadeType;
    if (t === 'attributeBuffer') {
        if (data.itemSize !== 1)
            throw new Error("only dimension-1 attribute buffers are supported");
        if (_.isUndefined(data.array))
            throw new Error("Shade.Utils.fit on attribute buffers requires keepArray:true in options");
        data = data.array;
    }

    var min = _.min(data), max = _.max(data);
    return Shade.Scale.linear({domain: [min, max]},
                              {range: [0, 1]});
};
