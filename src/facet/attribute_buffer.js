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
        'float': { webgl_type: ctx.FLOAT, typed_array_ctor: Float32Array, size: 4 },
        'short': { webgl_type: ctx.SHORT, typed_array_ctor: Int16Array, size: 2 },
        'ushort': { webgl_type: ctx.UNSIGNED_SHORT, typed_array_ctor: Uint16Array, size: 2 },
        'byte': { webgl_type: ctx.BYTE, typed_array_ctor: Int8Array, size: 1 },
        'ubyte': { webgl_type: ctx.UNSIGNED_BYTE, typed_array_ctor: Uint8Array, size: 1 }
    };
    var itemType = gl_enum_typed_array_map[opts.item_type];
    if (_.isUndefined(itemType)) {
        throw "opts.item_type must be 'float', 'short', 'ushort', 'byte' or 'ubyte'";
    }

    var result = ctx.createBuffer();
    result._shade_type = 'attribute_buffer';
    result.itemSize = itemSize;
    result.usage = usage;
    result.normalized = normalized;
    result._webgl_type = itemType.webgl_enum;
    result._typed_array_ctor = itemType.TypedArrayCtor;
    result._word_length = itemType.size;

    result.set = function(vertex_array) {
        var ctx = Facet._globals.ctx;
        var typedArray = new this._typed_array_ctor(vertex_array);
        ctx.bindBuffer(ctx.ARRAY_BUFFER, this);
        ctx.bufferData(ctx.ARRAY_BUFFER, typedArray, this.usage);
        this.array = typedArray; // FIXME Should only store this optionally.
        this.numItems = vertex_array.length/itemSize;
    };
    result.set(vertex_array);

    result.set_region = function(index, array) {
        var ctx = Facet._globals.ctx;
        var typedArray = new this._typed_array_ctor(array);
        ctx.bindBuffer(ctx.ARRAY_BUFFER, this);
        ctx.bufferSubData(ctx.ARRAY_BUFFER, index * this._word_length, typedArray, this.usage);
        for (var i=0; i<array.length; ++i) {
            this.array[index+i] = array[i];
        }
    };

    // This function is relatively slow; you should call set_region if
    // at all possible
    result.set_value = function(index, value) {
        var ctx = Facet._globals.ctx;
        var typedArray = new this._typed_array_ctor([value]);
        ctx.bindBuffer(ctx.ARRAY_BUFFER, this);
        ctx.bufferSubData(ctx.ARRAY_BUFFER, index * this._word_length, typedArray, this.usage);
        this.array[index] = value;
    };

    result.bind = function(attribute) {
        var ctx = Facet._globals.ctx;
        ctx.bindBuffer(ctx.ARRAY_BUFFER, this);
        ctx.vertexAttribPointer(attribute, this.itemSize, this._webgl_type, normalized, 0, 0);
    };

    result.draw = function(primitive) {
        var ctx = Facet._globals.ctx;
        ctx.drawArrays(primitive, 0, this.numItems);
    };
    result.bind_and_draw = function(attribute, primitive) {
        this.bind(attribute);
        this.draw(primitive);
    };
    return result;
};
