/*
 * Lux.attribute_buffer creates the structures necessary for Lux to handle 
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
 *   keep_array tells Lux.attribute_buffer to keep a copy of the buffer in 
 *   Javascript. This will be stored in the returned object, in the "array" 
 *   property. It is useful for javascript-side inspection, or as a convenient
 *   place to keep the array stashed in case you need it.
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
 *   var position_attribute = Lux.attribute_buffer({
 *       vertex_array: [1,0,0, 0,1,0, 1,0,0],
 *       // item_size: 3 is the default
 *       // item_type: 'float' is the default
 *   })
 * 
 *   // associate four 8-bit unsigned bytes with each vertex
 *   var color_attribute = Lux.attribute_buffer({
 *       vertex_array: [1,0,0,1, 1,1,0,1, 1,1,1,1],
 *       item_size: 4,
 *       item_type: 'ubyte', // the default item_type is 'float'
 *       normalized: true // when 
 *   });
 *   ...
 * 
 *   var triangle = Lux.model({
 *       type: 'triangles',
 *       position: position_attribute,
 *       color: color_attribute
 *   })
 */

Lux.attribute_buffer = function(opts)
{
    var ctx = Lux._globals.ctx;
    opts = _.defaults(opts, {
        item_size: 3,
        item_type: 'float',
        usage: ctx.STATIC_DRAW,
        normalized: false,
        keep_array: false,
        stride: 0,
        offset: 0
    });

    var itemSize = opts.item_size;
    if ([1,2,3,4].indexOf(itemSize) === -1) {
        throw "opts.item_size must be one of 1, 2, 3, or 4";
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

    if (_.isUndefined(opts.vertex_array)) {
        throw "opts.vertex_array must be defined";
    }

    function convert_array(array) {
        var numItems;
        if (array.constructor === Array) {
            if (array.length % itemSize) {
                throw "set: attribute_buffer expected length to be a multiple of " + 
                    itemSize + ", got " + array.length + " instead.";
            }
            array = new itemType.typed_array_ctor(array);
        } else if (array.constructor === itemType.typed_array_ctor) {
            if (array.length % itemSize) {
                throw "set: attribute_buffer expected length to be a multiple of " + 
                    itemSize + ", got " + array.length + " instead.";
            }
        } else if (opts.vertex_array.constructor === ArrayBuffer) {
            array = opts.vertex_array;
        } else {
            throw "Unrecognized array type for attribute_buffer";
        }
        return array;
    }

    var array = convert_array(opts.vertex_array);
    var buffer = Lux.buffer({
        usage: opts.usage,
        array: array,
        keep_array: opts.keep_array
    });

    return Lux.attribute_buffer_view(_.defaults(opts, {
        buffer: buffer
    }));
};
