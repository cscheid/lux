/*
 * Lux.attributeBuffer creates the structures necessary for Lux to handle 
 * per-vertex data.
 * 
 * Typically these will be vertex positions, normals, texture coordinates, 
 * colors, etc.
 * 
 * options: 
 * 
 *   vertexArray is the data array to be used. It must be one of the following 
 *     datatypes:
 * 
 *     - a javascript array of values, (which will be converted to a typed array
 *     of the appropriate type)
 * 
 *     - a typed array whose type matches the passed type below
 * 
 *     - an ArrayBuffer of the appropriate size
 * 
 *   itemSize is the number of elements to be associated with each vertex
 * 
 *   itemType is the data type of each element. Default is 'float', for
 *     IEEE 754 32-bit floating point numbers.
 * 
 *   usage follows the WebGL bufferData call. From the man page for bufferData:
 * 
 *     Specifies the expected usage pattern of the data store. The symbolic 
 *     constant must be STREAM_DRAW, STATIC_DRAW, or DYNAMIC_DRAW.
 * 
 *   keepArray tells Lux.attributeBuffer to keep a copy of the buffer in 
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
 *   var positionAttribute = Lux.attributeBuffer({
 *       vertexArray: [1,0,0, 0,1,0, 1,0,0],
 *       // itemSize: 3 is the default
 *       // itemType: 'float' is the default
 *   })
 * 
 *   // associate four 8-bit unsigned bytes with each vertex
 *   var colorAttribute = Lux.attributeBuffer({
 *       vertexArray: [1,0,0,1, 1,1,0,1, 1,1,1,1],
 *       itemSize: 4,
 *       itemType: 'ubyte', // the default itemType is 'float'
 *       normalized: true // when 
 *   });
 *   ...
 * 
 *   var triangle = Lux.model({
 *       type: 'triangles',
 *       position: positionAttribute,
 *       color: colorAttribute
 *   })
 */

Lux.attributeBuffer = function(opts)
{
    var ctx = Lux._globals.ctx;
    opts = _.defaults(opts, {
        itemSize: 3,
        itemType: 'float',
        usage: ctx.STATIC_DRAW,
        normalized: false,
        keepArray: false,
        stride: 0,
        offset: 0
    });

    var itemSize = opts.itemSize;
    if ([1,2,3,4].indexOf(itemSize) === -1) {
        throw new Error("opts.itemSize must be one of 1, 2, 3, or 4");
    }

    var glEnumTypedArrayMap = {
        'float': { webglEnum: ctx.FLOAT, typedArrayCtor: Float32Array, size: 4 },
        'short': { webglEnum: ctx.SHORT, typedArrayCtor: Int16Array, size: 2 },
        'ushort': { webglEnum: ctx.UNSIGNED_SHORT, typedArrayCtor: Uint16Array, size: 2 },
        'byte': { webglEnum: ctx.BYTE, typedArrayCtor: Int8Array, size: 1 },
        'ubyte': { webglEnum: ctx.UNSIGNED_BYTE, typedArrayCtor: Uint8Array, size: 1 }
    };

    var itemType = glEnumTypedArrayMap[opts.itemType];
    if (_.isUndefined(itemType)) {
        throw new Error("opts.itemType must be 'float', 'short', 'ushort', 'byte' or 'ubyte'");
    }

    if (_.isUndefined(opts.vertexArray)) {
        throw new Error("opts.vertexArray must be defined");
    }

    function convertArray(array) {
        var numItems;
        if (array.constructor === Array) {
            if (array.length % itemSize) {
                throw new Error("set: attributeBuffer expected length to be a multiple of " + 
                    itemSize + ", got " + array.length + " instead.");
            }
            array = new itemType.typedArrayCtor(array);
        } else if (array.constructor === itemType.typedArrayCtor) {
            if (array.length % itemSize) {
                throw new Error("set: attributeBuffer expected length to be a multiple of " + 
                    itemSize + ", got " + array.length + " instead.");
            }
        } else if (opts.vertexArray.constructor === ArrayBuffer) {
            array = opts.vertexArray;
        } else {
            throw new Error("Unrecognized array type for attributeBuffer");
        }
        return array;
    }

    var array = convertArray(opts.vertexArray);
    var buffer = Lux.buffer({
        usage: opts.usage,
        array: array,
        keepArray: opts.keepArray
    });

    return Lux.attributeBufferView(_.defaults(opts, {
        buffer: buffer
    }));
};
