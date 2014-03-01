// This function is fairly ugly, but I'd rather this function be ugly
// than the code which calls it be ugly.
Lux.model = function(input)
{
    var n_elements;
    function push_into(array, dimension) {
        return function(el) {
            var v = el.constant_value();
            for (var i=0; i<dimension; ++i)
                array.push(v[i]);
        };
    }

    var result = {
        add: function(k, v) {
            // First we handle the mandatory keys: "type" and "elements"
            if (k === 'type')
                // example: 'type: "triangles"'
                result.type = v;
            else if (k === 'elements') {
                if (v._shade_type === 'element_buffer') {
                    // example: 'elements: Lux.element_buffer(...)'
                    result.elements = v;
                } else if (Lux.type_of(v) === 'number') {
                    // example: 'elements: 4'
                    result.elements = v;
                } else { // if (Lux.type_of(v) === 'array') {
                    // example: 'elements: [0, 1, 2, 3]'
                    // example: 'elements: new Int16Array([0, 1, 2, 3])'
                    // example: 'elements: new Int32Array([0, 1, 2, 3])' (WebGL only supports 16-bit elements, so Lux converts this to a 16-bit element array)
                    result.elements = Lux.element_buffer(v);
                } 
            }
            // Then we handle the model attributes. They can be ...
            else if (v._shade_type === 'attribute_buffer') { // ... attribute buffers,
                // example: 'vertex: Lux.attribute_buffer(...)'
                result[k] = Shade(v);
                result.attributes[k] = result[k];
                n_elements = v.numItems;
            } else if (Lux.type_of(v) === "array") { // ... or a list of per-vertex things
                var buffer;
                // These things can be shade vecs
                if (Lux.type_of(v[0]) !== "array" && v[0]._lux_expression) {
                    // example: 'color: [Shade.color('white'), Shade.color('blue'), ...]
                    // assume it's a list of shade vecs, assume they all have the same dimension
                    // FIXME: check this
                    var dimension = v[0].type.vec_dimension();
                    var new_v = [];
                    _.each(v, push_into(new_v, dimension));
                    buffer = Lux.attribute_buffer({
                        vertex_array: new_v, 
                        item_size: dimension
                    });
                    result[k] = Shade(buffer);
                    result.attributes[k] = result[k];
                    n_elements = buffer.numItems;
                } else {
                    // Or they can be a single list of plain numbers, in which case we're passed 
                    // a pair, the first element being the list, the second 
                    // being the per-element size
                    // example: 'color: [[1,0,0, 0,1,0, 0,0,1], 3]'
                    buffer = Lux.attribute_buffer({
                        vertex_array: v[0], 
                        item_size: v[1]
                    });
                    result[k] = Shade(buffer);
                    result.attributes[k] = result[k];
                    n_elements = buffer.numItems;
                }
            } else {
                // if it's not any of the above things, then it's either a single shade expression
                // or a function which returns one. In any case, we just assign it to the key
                // and leave the user to fend for his poor self.
                result[k] = v;
            }
        },
        attributes: {}
    };

    for (var k in input) {
        var v = input[k];
        result.add(k, v);
    }
    if (!("elements" in result)) {
        // populate automatically using some sensible guess inferred from the attributes above
        if (_.isUndefined(n_elements)) {
            throw new Error("could not figure out how many elements are in this model; "
                + "consider passing an 'elements' field");
        } else {
            result.elements = n_elements;
        }
    }
    if (!("type" in result)) {
        result.add("type", "triangles");
    }
    result._ctx = Lux._globals.ctx;
    return result;
};
