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
    result.bind = function() {
        /* Javascript functions are quirky in that they can take unused arguments.
         So if a call passes an argument to result.bind, it won't fail; the argument
         is simply dropped.

         This has the fortuitous consequence of making attribute
         buffers and element buffers share the same interface
         (attributes that get passed to bind are ignored by element
         buffers and handled by attribute buffers)
        */
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
