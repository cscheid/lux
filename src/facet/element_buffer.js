// FIXME make API similar to Facet.attribute_buffer
Facet.element_buffer = function(vertex_array)
{
    var ctx = Facet._globals.ctx;
    var result = ctx.createBuffer();
    ctx.bindBuffer(ctx.ELEMENT_ARRAY_BUFFER, result);
    var typedArray = new Uint16Array(vertex_array);
    ctx.bufferData(ctx.ELEMENT_ARRAY_BUFFER, typedArray, ctx.STATIC_DRAW);
    result._shade_type = 'element_buffer';
    result.array = typedArray;
    result.itemSize = 1;
    result.numItems = vertex_array.length;

    //////////////////////////////////////////////////////////////////////////
    // These methods are only for internal use within Facet

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
