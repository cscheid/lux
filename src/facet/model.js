// This function is fairly ugly, but I'd rather this function be ugly
// than the code which calls it be ugly.
Facet.model = function(input)
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
                if (v._shade_type === 'element_buffer')
                    // example: 'elements: Facet.element_buffer(...)'
                    result.elements = Shade(v);
                else if (facet_typeOf(v) === 'array')
                    // example: 'elements: [0, 1, 2, 3]'
                    result.elements = Shade(Facet.element_buffer(v));
                else
                    // example: 'elements: 4'
                    result.elements = v;
            }
            // Then we handle the model attributes. They can be ...
            else if (v._shade_type === 'attribute_buffer') { // ... attribute buffers,
                // example: 'vertex: Facet.attribute_buffer(...)'
                result[k] = Shade(v);
                n_elements = v.numItems;
            } else if (facet_typeOf(v) === "array") { // ... or a list of per-vertex things
                var buffer;
                // These things can be shade vecs
                if (facet_typeOf(v[0]) !== "array" && v[0]._facet_expression) {
                    // example: 'color: [Shade.color('white'), Shade.color('blue'), ...]
                    // assume it's a list of shade vecs, assume they all have the same dimension
                    var dimension = v[0].type.vec_dimension();
                    var new_v = [];
                    _.each(v, push_into(new_v, dimension));
                    buffer = Facet.attribute_buffer(new_v, dimension);
                    result[k] = Shade(buffer);
                    n_elements = buffer.numItems;
                } else {
                    // Or they can be a single list of plain numbers, in which case we're passed 
                    // a pair, the first element being the list, the second 
                    // being the per-element size
                    // example: 'color: [[1,0,0, 0,1,0, 0,0,1], 3]'
                    buffer = Facet.attribute_buffer(v[0], v[1]);
                    result[k] = Shade(buffer);
                    n_elements = buffer.numItems;
                }
            } else {
                // if it's not any of the above things, then it's either a single shade expression
                // or a function which returns one. In any case, we just assign it to the key
                // and leave the user to fend for his poor self.
                result[k] = v;
            }
        }
    };

    for (var k in input) {
        var v = input[k];
        result.add(k, v);
    }
    if (!("elements" in result)) {
        // populate automatically using some sensible guess inferred from the attributes above
        if (_.isUndefined(n_elements)) {
            throw "could not figure out how many elements are in this model; "
                + "consider passing an 'elements' field";
        } else {
            result.elements = n_elements;
        }
    }
    return result;
};
