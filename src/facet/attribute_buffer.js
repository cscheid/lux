/*
 * Facet.attribute_buffer creates the structures necessary for Facet to handle 
 * per-vertex data.
 * 
 * Typically these will be vertex positions, normals, texture coordinates, 
 * colors, etc.
 * 
 * options: 
 * 
 *   vertex_array is the data array to be used. It must be one of the following 
 *     datatypes:
 * 
 *     - a javascript array of values, (which will be converted to a typed array
 *     of the appropriate type)
 * 
 *     - a typed array whose type matches the passed type below
 * 
 *     - an ArrayBuffer of the appropriate size
 * 
 *   item_size is the number of elements to be associated with each vertex
 * 
 *   item_type is the data type of each element. Default is 'float', for
 *     IEEE 754 32-bit floating point numbers.
 * 
 *   usage follows the WebGL bufferData call. From the man page for bufferData:
 * 
 *     Specifies the expected usage pattern of the data store. The symbolic 
 *     constant must be STREAM_DRAW, STATIC_DRAW, or DYNAMIC_DRAW.
 * 
 *   keep_array tells Facet.attribute_buffer to keep a copy of the buffer in 
 *   Javascript. This will be stored in the returned object, in the "array" 
 *   property.
 * 
 *   stride: if stride is non-zero, WebGL will skip an arbitrary number of 
 *   bytes per element. This is used to specify many different attributes which
 *   share a single buffer (which gives memory locality advantages in some
 *   GPU architectures). stride uses *bytes* as units, so be aware of datatype
 *   conversions.
 * 
 *   offset: gives the offset into the buffer at which to access the data,
 *   again used to specify different attributes sharing a single buffer.
 *   offset uses *bytes* as units, so be aware of datatype conversions.
 * 
 * 
 * Example usage:
 * 
 *   // associate three 32-bit floating-point values with each vertex
 *   var position_attribute = Facet.attribute_buffer({
 *       vertex_array: [1,0,0, 0,1,0, 1,0,0],
 *       // item_size: 3 is the default
 *       // item_type: 'float' is the default
 *   })
 * 
 *   // associate four 8-bit unsigned bytes with each vertex
 *   var color_attribute = Facet.attribute_buffer({
 *       vertex_array: [1,0,0,1, 1,1,0,1, 1,1,1,1],
 *       item_size: 4,
 *       item_type: 'ubyte', // the default item_type is 'float'
 *       normalized: true // when 
 *   });
 *   ...
 * 
 *   var triangle = Facet.model({
 *       type: 'triangles',
 *       position: position_attribute,
 *       color: color_attribute
 *   })
 */

Facet.attribute_buffer = function(opts)
{
    var ctx = Facet._globals.ctx;
    opts = _.defaults(opts, {
        item_size: 3,
        item_type: 'float',
        usage: ctx.STATIC_DRAW,
        normalized: false,
        keep_array: false,
        stride: 0,
        offset: 0
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
    result.itemSize = itemSize;
    result.usage = usage;
    result.normalized = normalized;
    result._ctx = ctx;
    result._shade_type = 'attribute_buffer';
    result._webgl_type = itemType.webgl_enum;
    result._typed_array_ctor = itemType.typed_array_ctor;
    result._word_length = itemType.size;
    result._item_byte_length = opts.stride || itemType.size * itemSize;

    result.set = function(vertex_array) {
        var typedArray;
        Facet.set_context(ctx);
        if (vertex_array.length % itemSize !== 0) {
            throw "length of array must be multiple of item_size";
        }
        // FIXME this might be brittle, but I don't know of a better way

        if (vertex_array.constructor === Array) {
            if (vertex_array.length % itemSize) {
                throw "set: attribute_buffer expected length to be a multiple of " + 
                    itemSize + ", got " + vertex_array.length + " instead.";
            }
            typedArray = new this._typed_array_ctor(vertex_array);
            ctx.bindBuffer(ctx.ARRAY_BUFFER, this);
            ctx.bufferData(ctx.ARRAY_BUFFER, typedArray, this.usage);
            this.numItems = vertex_array.length/itemSize;
        } else if (vertex_array.constructor === ArrayBuffer) {
            if (vertex_array.length % itemSize) {
                throw "set: attribute_buffer expected length to be a multiple of " + 
                    itemSize + ", got " + vertex_array.length + " instead.";
            }
            typedArray = vertex_array;
            ctx.bindBuffer(ctx.ARRAY_BUFFER, this);
            ctx.bufferData(ctx.ARRAY_BUFFER, typedArray, this.usage);
            this.numItems = vertex_array.length/itemSize;
        } else if (vertex_array.constructor === this._typed_array_ctor) {
            if (vertex_array.length % this._item_byte_length) {
                throw "set: attribute_buffer expected length to be a multiple of " + 
                    this._item_byte_length + ", got " + vertex_array.length + " instead.";
            }
            typedArray = vertex_array;
            ctx.bindBuffer(ctx.ARRAY_BUFFER, this);
            ctx.bufferData(ctx.ARRAY_BUFFER, typedArray, this.usage);
            this.numItems = vertex_array.length/this._item_byte_length;
        } else
            throw "Facet.attribute_buffer.set requires a plain list, an ArrayBuffer, or a typed array of the right type";

        ctx.bindBuffer(ctx.ARRAY_BUFFER, this);
        ctx.bufferData(ctx.ARRAY_BUFFER, typedArray, this.usage);
        this.numItems = vertex_array.length/itemSize;

        if (opts.keep_array) {
            this.array = typedArray;
        }
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

    //////////////////////////////////////////////////////////////////////////
    // These methods are only for internal use within Facet

    result.bind = function(attribute) {
        Facet.set_context(ctx);
        ctx.bindBuffer(ctx.ARRAY_BUFFER, this);
        ctx.vertexAttribPointer(attribute, this.itemSize, this._webgl_type, normalized, opts.stride, opts.offset);
    };

    result.draw = function(primitive) {
        Facet.set_context(ctx);
        ctx.drawArrays(primitive, 0, this.numItems);
    };
    result.bind_and_draw = function(attribute, primitive) {
        // here we inline the calls to bind and draw to shave a redundant set_context.
        Facet.set_context(ctx);
        ctx.bindBuffer(ctx.ARRAY_BUFFER, this);
        ctx.vertexAttribPointer(attribute, this.itemSize, this._webgl_type, normalized, opts.stride, opts.offset);
        ctx.drawArrays(primitive, 0, this.numItems);
    };
    return result;
};
