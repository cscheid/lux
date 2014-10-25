// This function is fairly ugly, but I'd rather this function be ugly
// than the code which calls it be ugly.
Lux.model = function(input)
{
    var nElements;
    function pushInto(array, dimension) {
        return function(el) {
            var v = el.constantValue();
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
                if (v._shadeType === 'elementBuffer') {
                    // example: 'elements: Lux.elementBuffer(...)'
                    result.elements = v;
                } else if (Lux.typeOf(v) === 'number') {
                    // example: 'elements: 4'
                    result.elements = v;
                } else { // if (Lux.typeOf(v) === 'array') {
                    // example: 'elements: [0, 1, 2, 3]'
                    // example: 'elements: new Int16Array([0, 1, 2, 3])'
                    // example: 'elements: new Int32Array([0, 1, 2, 3])' (WebGL only supports 16-bit elements, so Lux converts this to a 16-bit element array)
                    result.elements = Lux.elementBuffer(v);
                } 
            }
            // Then we handle the model attributes. They can be ...
            else if (v._shadeType === 'attributeBuffer') { // ... attribute buffers,
                // example: 'vertex: Lux.attributeBuffer(...)'
                result[k] = Shade(v);
                result.attributes[k] = result[k];
                nElements = v.numItems;
            } else if (Lux.typeOf(v) === "array") { // ... or a list of per-vertex things
                var buffer;
                // These things can be shade vecs
                if (Lux.typeOf(v[0]) !== "array" && v[0]._luxExpression) {
                    // example: 'color: [Shade.color('white'), Shade.color('blue'), ...]
                    // assume it's a list of shade vecs, assume they all have the same dimension
                    // FIXME: check this
                    var dimension = v[0].type.vecDimension();
                    var newV = [];
                    _.each(v, pushInto(newV, dimension));
                    buffer = Lux.attributeBuffer({
                        vertexArray: newV, 
                        itemSize: dimension
                    });
                    result[k] = Shade(buffer);
                    result.attributes[k] = result[k];
                    nElements = buffer.numItems;
                } else {
                    // Or they can be a single list of plain numbers, in which case we're passed 
                    // a pair, the first element being the list, the second 
                    // being the per-element size
                    // example: 'color: [[1,0,0, 0,1,0, 0,0,1], 3]'
                    buffer = Lux.attributeBuffer({
                        vertexArray: v[0], 
                        itemSize: v[1]
                    });
                    result[k] = Shade(buffer);
                    result.attributes[k] = result[k];
                    nElements = buffer.numItems;
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
        if (_.isUndefined(nElements)) {
            throw new Error("could not figure out how many elements are in this model; "
                + "consider passing an 'elements' field");
        } else {
            result.elements = nElements;
        }
    }
    if (!("type" in result)) {
        result.add("type", "triangles");
    }
    result._ctx = Lux._globals.ctx;
    return result;
};
