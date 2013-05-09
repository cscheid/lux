// FIXME make API similar to Lux.attribute_buffer
Lux.element_buffer = function(vertex_array)
{
    var ctx = Lux._globals.ctx;
    var result = ctx.createBuffer();
    result._ctx = ctx;
    result._shade_type = 'element_buffer';
    result.itemSize = 1;
    var draw_enum;

    //////////////////////////////////////////////////////////////////////////
    // These methods are only for internal use within Lux

    result.set = function(vertex_array) {
        Lux.set_context(ctx);
        var typedArray;
        var typed_array_ctor;
        var has_extension = ctx._lux_globals.webgl_extensions.OES_element_index_uint;
        if (has_extension)
            typed_array_ctor = Uint32Array;
        else
            typed_array_ctor = Uint16Array;

        if (vertex_array.constructor.name === 'Array') {
            typedArray = new typed_array_ctor(vertex_array);
        } else {
            if (has_extension) {
                if (vertex_array.constructor !== Uint16Array &&
                    vertex_array.constructor !== Uint32Array) {
                    throw new Error("Lux.element_buffer.set requires either a plain list, a Uint16Array, or a Uint32Array");
                }
            } else {
                if (vertex_array.constructor !== Uint16Array) {
                    throw new Error("Lux.element_buffer.set requires either a plain list or a Uint16Array");
                }
            }
            typedArray = vertex_array;
        }
        ctx.bindBuffer(ctx.ELEMENT_ARRAY_BUFFER, this);
        ctx.bufferData(ctx.ELEMENT_ARRAY_BUFFER, typedArray, ctx.STATIC_DRAW);
        if (typedArray.constructor === Uint16Array)
            draw_enum = ctx.UNSIGNED_SHORT;
        else if (typedArray.constructor === Uint32Array)
            draw_enum = ctx.UNSIGNED_INT;
        else
            throw new Error("internal error: expecting typed array to be either Uint16 or Uint32");
        this.array = typedArray;
        this.numItems = typedArray.length;
    };
    result.set(vertex_array);

    result.bind = function() {
        ctx.bindBuffer(ctx.ELEMENT_ARRAY_BUFFER, this);
    };
    result.draw = function(primitive) {
        ctx.drawElements(primitive, this.numItems, draw_enum, 0);
    };
    result.bind_and_draw = function(primitive) {
        this.bind();
        this.draw(primitive);
    };
    return result;
};
