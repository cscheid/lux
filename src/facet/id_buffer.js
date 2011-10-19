Facet.id_buffer = function(vertex_array)
{
    var typedArray = new Int32Array(vertex_array);
    return Facet.attribute_buffer(typedArray, 4, 'ubyte');
};
