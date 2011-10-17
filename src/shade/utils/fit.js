// returns a linear transformation of the coordinates such that the given list of values
// fits between [0, 1]

Shade.Utils.fit = function(data) {
    // FIXME this makes float attribute buffers work, but it's probably brittle
    var t = data._shade_type; 
    if (t === 'attribute_buffer')
        data = data.array;
    var min = _.min(data), max = _.max(data);
    return Shade.Utils.linear(min, max, 0, 1);
};
