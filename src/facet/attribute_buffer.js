Facet.attribute_buffer = function(opts)
{
    var ctx = Facet._globals.ctx;
    opts = _.defaults(opts, {
        item_size: 3,
        item_type: 'float',
        usage: ctx.STATIC_DRAW,
        normalized: false
    });

    var vertex_array = opts.vertex_array;
    if (_.isUndefined(vertex_array)) {
        throw "opts.vertex_array must be defined";
    }

    var usage = opts.usage;
    if ([ctx.STATIC_DRAW, ctx.DYNAMIC_DRAW, ctx.STREAM_DRAW].indexOf(usage) === -1) {
        throw "opts.usage must be one of STATIC_DRAW, DYNAMIC_DRAW, STREAM_DRAW";
    }

    var itemSize = opts.item_size;
    if ([1,2,3,4].indexOf(itemSize) === -1) {
        throw "opts.item_size must be one of 1, 2, 3, or 4";
    }

    var normalized = opts.normalized;
    if (facet_typeOf(normalized) !== "boolean") {
        throw "opts.normalized must be boolean";
    }

    var gl_enum_typed_array_map = {
        'float': [ctx.FLOAT, Float32Array],
        'short': [ctx.SHORT, Int16Array],
        'ushort': [ctx.UNSIGNED_SHORT, Uint16Array],
        'byte': [ctx.BYTE, Int8Array],
        'ubyte': [ctx.UNSIGNED_BYTE, Uint8Array]
    };
    var itemType = gl_enum_typed_array_map[opts.item_type];
    if (_.isUndefined(itemType)) {
        throw "opts.item_type must be 'float', 'short', 'ushort', 'byte' or 'ubyte'";
    }

    var typedArray = new itemType[1](vertex_array);
    var result = ctx.createBuffer();
    ctx.bindBuffer(ctx.ARRAY_BUFFER, result);
    ctx.bufferData(ctx.ARRAY_BUFFER, typedArray, usage);
    result._shade_type = 'attribute_buffer';
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
