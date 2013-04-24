// FIXME make API similar to Lux.attribute_buffer
Lux.element_buffer = function(vertex_array)
{
    var ctx = Lux._globals.ctx;
    var result = ctx.createBuffer();
    var typedArray = new Uint16Array(vertex_array);
    result._ctx = ctx;
    result._shade_type = 'element_buffer';
    result.itemSize = 1;

    //////////////////////////////////////////////////////////////////////////
    // These methods are only for internal use within Lux

    result.set = function(vertex_array) {
        Lux.set_context(ctx);
        var typedArray;
        if (vertex_array.constructor.name === 'Array') {
            typedArray = new Uint16Array(vertex_array);
        } else {
            if (vertex_array.constructor !== Uint16Array) {
                throw new Error("Lux.element_buffer.set requires either a plain list or a Uint16Array");
            }
            typedArray = vertex_array;
        }
        ctx.bindBuffer(ctx.ELEMENT_ARRAY_BUFFER, this);
        ctx.bufferData(ctx.ELEMENT_ARRAY_BUFFER, typedArray, ctx.STATIC_DRAW);
        this.array = typedArray;
        this.numItems = typedArray.length;
    };
    result.set(vertex_array);

    result.bind = function() {
        ctx.bindBuffer(ctx.ELEMENT_ARRAY_BUFFER, this);
    };
    result.draw = function(primitive) {
        ctx.drawElements(primitive, this.numItems, ctx.UNSIGNED_SHORT, 0);
    };
    result.bind_and_draw = function(primitive) {
        this.bind();
        this.draw(primitive);
    };
    return result;
};
