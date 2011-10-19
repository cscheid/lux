Facet.element_buffer = function(vertex_array)
{
    var ctx = Facet._globals.ctx;
    var result = ctx.createBuffer();
    ctx.bindBuffer(ctx.ELEMENT_ARRAY_BUFFER, result);
    var typedArray = new Uint16Array(vertex_array);
    ctx.bufferData(ctx.ELEMENT_ARRAY_BUFFER, typedArray, ctx.STATIC_DRAW);
    result._shade_type = 'element_buffer'; // FIXME: UGLY
    result.array = typedArray;
    result.itemSize = 1;
    result.numItems = vertex_array.length;
    // FIXME: to make the interface uniform with attribute buffer, bind
    // takes an unused argument "attribute". I don't see a way to fix this
    // right now while keeping the drawing interface clean (that is, element buffers
    // and attribute buffers being interchangeable).
    // NB it's no longer clear that we need element_buffers and
    // attribute_buffers to look the same way.

    result.bind = function(attribute) {
        ctx.bindBuffer(ctx.ELEMENT_ARRAY_BUFFER, this);
    };
    result.draw = function(primitive) {
        ctx.drawElements(primitive, this.numItems, ctx.UNSIGNED_SHORT, 0);
    };
    result.bind_and_draw = function(attribute, primitive) {
        this.bind(attribute);
        this.draw(primitive);
    };
    return result;
};
