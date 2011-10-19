(function() {

var previous_batch = {};
Facet.unload_batch = function()
{
    var ctx = Facet.ctx;
    if (previous_batch.attributes) {
        for (var key in previous_batch.attributes) {
            ctx.disableVertexAttribArray(previous_batch.program[key]);
        }
        _.each(previous_batch.program.uniforms, function (uniform) {
            delete uniform._facet_active_uniform;
        });
    }
    previous_batch = {};

    // reset the opengl capabilities which are determined by
    // Facet.DrawingMode.*
    ctx.disable(ctx.DEPTH_TEST);
    ctx.disable(ctx.BLEND);
    ctx.depthMask(true);
};

function draw_it(batch)
{
    var ctx = Facet.ctx;
    if (batch.batch_id !== previous_batch.batch_id) {
        var attributes = batch.attributes || {};
        var uniforms = batch.uniforms || {};
        var program = batch.program;
        var primitives = batch.primitives;
        var key;

        Facet.unload_batch();
        previous_batch = batch;
        batch.drawing_mode.set_draw_caps();

        ctx.useProgram(program);

        for (key in attributes) {
            var attr = program[key];
            if (typeof attr !== 'undefined') {
                ctx.enableVertexAttribArray(attr);
                attributes[key].bind(attr);
            }
        }
        
        var currentActiveTexture = 0;
        _.each(program.uniforms, function(uniform) {
            var key = uniform.uniform_name;
            var call = uniform.uniform_call,
                value = uniform.get();
            if (typeOf(value) === 'undefined') {
                throw "uniform " + key + " has not been set.";
            }
            var t = constant_type(value);
            if (t === "other") {
                uniform._facet_active_uniform = (function(uid, cat) {
                    return function(v) {
                        ctx.activeTexture(ctx.TEXTURE0 + cat);
                        ctx.bindTexture(ctx.TEXTURE_2D, v);
                        ctx.uniform1i(uid, cat);
                    };
                })(program[key], currentActiveTexture);
                currentActiveTexture++;
            } else if (t === "number" || t == "vector") {
                uniform._facet_active_uniform = (function(call, uid) {
                    return function(v) {
                        call.call(ctx, uid, v);
                    };
                })(ctx[call], program[key]);
            } else if (t === "matrix") {
                uniform._facet_active_uniform = (function(call, uid) {
                    return function(v) {
                        ctx[call](uid, false, v);
                    };
                })(call, program[key]);
            }
            uniform._facet_active_uniform(value);
        });
    }

    batch.draw_chunk();
};

var largest_batch_id = 1;

// FIXME: push the primitives weirdness fix down the API
Facet.bake = function(model, appearance)
{
    var ctx = Facet.ctx;
    var program_exp = {};
    _.each(appearance, function(value, key) {
        if (Shade.is_program_parameter(key)) {
            program_exp[key] = value;
        }
    });
    var program = Shade.program(program_exp);
    var attribute_arrays = {};
    for (var i=0; i<program.attribute_buffers.length; ++i) {
        var b = program.attribute_buffers[i];
        attribute_arrays[b._shade_name] = b;
    }

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

    var draw_batch_id = largest_batch_id++;
    var pick_batch_id = largest_batch_id++;

    var draw_opts = {
        program: program,
        attributes: attribute_arrays,
        drawing_mode: appearance.mode || Facet.DrawingMode.standard,
        draw_chunk: draw_chunk,
        batch_id: draw_batch_id
    };

    var pick_opts = {
        program: program,
        attributes: attribute_arrays,
        drawing_mode: appearance.mode || Facet.DrawingMode.standard,
        draw_chunk: draw_chunk,
        batch_id: draw_batch_id
    };

    return {
        draw: function() {
            draw_it(draw_opts);
        }
    };
};
})();
