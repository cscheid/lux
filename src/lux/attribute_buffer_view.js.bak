/*
 * Lux.attribute_buffer_view builds an attribute_buffer object from an
 * Lux.buffer object, instead of an array (or typed array). The main
 * use case for attribute_buffer_view is to allow one to build
 * several attribute_buffer_views over the same Lux.buffer, for efficient
 * strided attribute buffers (which share the same buffer)
 * 
 * The main difference between calling Lux.attribute_buffer_view and
 * Lux.attribute_buffer is that attribute_buffer_view takes a "buffer"
 * parameter instead of an "array" parameter.
 * 
 */

Lux.attribute_buffer_view = function(opts)
{
    var ctx = Lux._globals.ctx;
    opts = _.defaults(opts, {
        item_size: 3,
        item_type: 'float',
        normalized: false,
        keep_array: false,
        stride: 0,
        offset: 0
    });

    if (_.isUndefined(opts.buffer)) {
        throw new Error("opts.buffer must be defined");
    }

    var itemSize = opts.item_size;
    if ([1,2,3,4].indexOf(itemSize) === -1) {
        throw new Error("opts.item_size must be one of 1, 2, 3, or 4");
    }

    var normalized = opts.normalized;
    if (Lux.type_of(normalized) !== "boolean") {
        throw new Error("opts.normalized must be boolean");
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
        throw new Error("opts.item_type must be 'float', 'short', 'ushort', 'byte' or 'ubyte'");
    }

    function convert_array(array) {
        var numItems;
        if (array.constructor === Array) {
            if (array.length % itemSize) {
                throw new Error("set: attribute_buffer expected length to be a multiple of " + 
                    itemSize + ", got " + array.length + " instead.");
            }
            array = new itemType.typed_array_ctor(array);
        } else if (array.constructor === itemType._typed_array_ctor) {
            if (array.length % itemSize) {
                throw new Error("set: attribute_buffer expected length to be a multiple of " + 
                    itemSize + ", got " + array.length + " instead.");
            }
        } else if (opts.vertex_array.constructor === ArrayBuffer) {
            array = opts.vertex_array;
        }
        return array;
    }

    var result = {
        buffer: opts.buffer,
        itemSize: itemSize,
        normalized: normalized,
        numItems: opts.buffer.byteLength / (opts.stride || itemSize * itemType.size),
        stride: opts.stride,
        offset: opts.offset,
        _ctx: ctx,
        _shade_type: 'attribute_buffer',
        _webgl_type: itemType.webgl_enum,
        _typed_array_ctor: itemType.typed_array_ctor,
        _word_length: itemType.size,
        _item_byte_length: opts.stride || itemType.size * itemSize,
        set: function(vertex_array) {
            vertex_array = convert_array(vertex_array);
            this.buffer.set(vertex_array);
            this.numItems = this.buffer.byteLength / (this.stride || this.itemSize * this._word_length);
            if (opts.keep_array) {
                this.array = this.buffer.array;
            }
        },
        set_region: function() {
            throw new Error("currently unimplemented");
        },
        //////////////////////////////////////////////////////////////////////
        // These methods are only for internal use within Lux
        bind: function(attribute) {
            Lux.set_context(ctx);
            ctx.bindBuffer(ctx.ARRAY_BUFFER, this.buffer);
            ctx.vertexAttribPointer(attribute, this.itemSize, this._webgl_type, normalized, this.stride, this.offset);
        },
        draw: function(primitive) {
            Lux.set_context(ctx);
            ctx.drawArrays(primitive, 0, this.numItems);
        },
        bind_and_draw: function(attribute, primitive) {
            // here we inline the calls to bind and draw to shave a redundant set_context.
            Lux.set_context(ctx);
            ctx.bindBuffer(ctx.ARRAY_BUFFER, this.buffer);
            ctx.vertexAttribPointer(attribute, this.itemSize, this._webgl_type, normalized, this.stride, this.offset);
            ctx.drawArrays(primitive, 0, this.numItems);
        }
    };
    if (opts.keep_array)
        result.array = result.buffer.array;
    return result;
};
