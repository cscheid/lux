Facet.attribute_buffer = function(vertex_array, itemSize, itemType, normalized)
{
    var ctx = Facet._globals.ctx;
    if (normalized === undefined) {
        normalized = false;
    }
    var gl_enum_typed_array_map = {
        'float': [ctx.FLOAT, Float32Array],
        'short': [ctx.SHORT, Int16Array],
        'ushort': [ctx.UNSIGNED_SHORT, Uint16Array],
        'byte': [ctx.BYTE, Int8Array],
        'ubyte': [ctx.UNSIGNED_BYTE, Uint8Array]
    };

    itemSize = itemSize || 3;
    itemType = gl_enum_typed_array_map[itemType || 'float'];

    var typedArray = new itemType[1](vertex_array);
    var result = ctx.createBuffer();
    ctx.bindBuffer(ctx.ARRAY_BUFFER, result);
    ctx.bufferData(ctx.ARRAY_BUFFER, typedArray, ctx.STATIC_DRAW);
    result._shade_type = 'attribute_buffer'; // FIXME: UGLY
    result.array = typedArray;
    result.itemSize = itemSize;
    result.numItems = vertex_array.length/itemSize;
    result.bind = function(type) {
        return function(attribute) {
            ctx.bindBuffer(ctx.ARRAY_BUFFER, this);
            ctx.vertexAttribPointer(attribute, this.itemSize, type, normalized, 0, 0);
        };
    }(itemType[0]);
    result.draw = function(primitive) {
        ctx.drawArrays(primitive, 0, this.numItems);
    };
    result.bind_and_draw = function(attribute, primitive) {
        this.bind(attribute);
        this.draw(primitive);
    };
    return result;
};
