Lux.idBuffer = function(vertexArray)
{
    if (Lux.typeOf(vertexArray) !== 'array')
        throw new Error("idBuffer expects array of integers");
    var typedArray = new Int32Array(vertexArray);
    var byteArray = new Uint8Array(typedArray.buffer);
    return Lux.attributeBuffer({
        vertexArray: byteArray, 
        itemSize: 4, 
        itemType: 'ubyte', 
        normalized: true
    });
};
