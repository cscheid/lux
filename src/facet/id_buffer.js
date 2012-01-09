Facet.id_buffer = function(vertex_array)
{
    if (facet_typeOf(vertex_array) !== 'array')
        throw "id_buffer expects array of integers";
    var typedArray = new Int32Array(vertex_array);
    var byteArray = new Uint8Array(typedArray.buffer);
    return Facet.attribute_buffer(byteArray, 4, 'ubyte', true);
};
