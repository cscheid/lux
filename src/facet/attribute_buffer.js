Facet.attribute_buffer = function(opts)
{
    var ctx = Facet._globals.ctx;
    opts = _.defaults(opts, {
        item_size: 3,
        item_type: 'float',
        usage: ctx.STATIC_DRAW,
        normalized: false,
        keep_array: false
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
        'float': { webgl_enum: ctx.FLOAT, typed_array_ctor: Float32Array, size: 4 },
        'short': { webgl_enum: ctx.SHORT, typed_array_ctor: Int16Array, size: 2 },
        'ushort': { webgl_enum: ctx.UNSIGNED_SHORT, typed_array_ctor: Uint16Array, size: 2 },
        'byte': { webgl_enum: ctx.BYTE, typed_array_ctor: Int8Array, size: 1 },
        'ubyte': { webgl_enum: ctx.UNSIGNED_BYTE, typed_array_ctor: Uint8Array, size: 1 }
    };
    var itemType = gl_enum_typed_array_map[opts.item_type];
    if (_.isUndefined(itemType)) {
        throw "opts.item_type must be 'float', 'short', 'ushort', 'byte' or 'ubyte'";
    }

    var result = ctx.createBuffer();
    result._ctx = ctx;
    result._shade_type = 'attribute_buffer';
    result.itemSize = itemSize;
    result.usage = usage;
    result.normalized = normalized;
    result._webgl_type = itemType.webgl_enum;
    result._typed_array_ctor = itemType.typed_array_ctor;
    result._word_length = itemType.size;

    result.set = function(vertex_array) {
        Facet.set_context(ctx);
        if (vertex_array.length % itemSize !== 0) {
            throw "length of array must be multiple of item_size";
        }
        var typedArray = new this._typed_array_ctor(vertex_array);
        ctx.bindBuffer(ctx.ARRAY_BUFFER, this);
        ctx.bufferData(ctx.ARRAY_BUFFER, typedArray, this.usage);
        if (opts.keep_array) {
            this.array = typedArray;
        }
        this.numItems = vertex_array.length/itemSize;
    };
    result.set(vertex_array);

    result.set_region = function(index, array) {
        Facet.set_context(ctx);
        if ((index + array.length) > (this.numItems * this.itemSize) || (index < 0))
            throw "set_region index out of bounds";
        var typedArray = new this._typed_array_ctor(array);
        ctx.bindBuffer(ctx.ARRAY_BUFFER, this);
        ctx.bufferSubData(ctx.ARRAY_BUFFER, index * this._word_length, typedArray);
        if (opts.keep_array) {
            for (var i=0; i<array.length; ++i) {
                this.array[index+i] = array[i];
            }
        }
    };

    result.bind = function(attribute) {
        Facet.set_context(ctx);
        ctx.bindBuffer(ctx.ARRAY_BUFFER, this);
        ctx.vertexAttribPointer(attribute, this.itemSize, this._webgl_type, normalized, 0, 0);
    };

    result.draw = function(primitive) {
        Facet.set_context(ctx);
        ctx.drawArrays(primitive, 0, this.numItems);
    };
    result.bind_and_draw = function(attribute, primitive) {
        // inline the calls to bind and draw to shave a redundant set_context.
        Facet.set_context(ctx);
        ctx.bindBuffer(ctx.ARRAY_BUFFER, this);
        ctx.vertexAttribPointer(attribute, this.itemSize, this._webgl_type, normalized, 0, 0);
        ctx.drawArrays(primitive, 0, this.numItems);
    };
    return result;
};
