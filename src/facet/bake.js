(function() {

var largest_batch_id = 1;

// FIXME: push the primitives weirdness fix down the API
Facet.bake = function(model, program_exp)
{
    var ctx = Facet.ctx;
    var program = Shade.program(program_exp);
    var attribute_arrays = {};
    for (var i=0; i<program.attribute_buffers.length; ++i) {
        var b = program.attribute_buffers[i];
        attribute_arrays[b._shade_name] = b;
    }

    // primitives[model.type] = model.elements;

    var primitive_types = {
        points: ctx.POINTS,
        line_strip: ctx.LINE_STRIP,
        line_loop: ctx.LINE_LOOP,
        lines: ctx.LINES,
        triangle_strip: ctx.TRIANGLE_STRIP,
        triangle_fan: ctx.TRIANGLE_FAN,
        triangles: ctx.TRIANGLES
    };

    var primitive_type = primitive_types[model.type];
    var elements = model.elements;
    var draw_chunk;
    if (typeOf(model.elements) === 'number') {
        draw_chunk = function() {
            ctx.drawArrays(primitive_type, 0, elements);
        };
    } else {
        draw_chunk = function() {
            elements.bind_and_draw(elements, primitive_type);
        };
    }
    var primitives = [primitive_types[model.type], model.elements];

    var draw_opts = {
        program: program,
        attributes: attribute_arrays,
        draw_chunk: draw_chunk
    };

    return {
        batch_id: largest_batch_id++,
        draw: function() {
            draw_opts.batch_id = this.batch_id;
            Facet.draw(draw_opts);
        }
    };
};
})();
