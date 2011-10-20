(function() {

var previous_batch = {};

Facet.unload_batch = function()
{
    var ctx = Facet._globals.ctx;
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
    var ctx = Facet._globals.ctx;
    if (batch.batch_id !== previous_batch.batch_id) {
        var attributes = batch.attributes || {};
        var uniforms = batch.uniforms || {};
        var program = batch.program;
        var primitives = batch.primitives;
        var key;

        Facet.unload_batch();
        previous_batch = batch;
        batch.set_caps();

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
    var ctx = Facet._globals.ctx;
    var draw_program_exp = {};
    _.each(appearance, function(value, key) {
        if (Shade.is_program_parameter(key)) {
            draw_program_exp[key] = value;
        }
    });
    var draw_program = Shade.program(draw_program_exp);
    var draw_attribute_arrays = _.build(_.map(
        draw_program.attribute_buffers, function(v) { return [v._shade_name, v]; }
    ));

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

    // NB: the batch_id field in the *_opts objects is not
    // the same as the batch_id in the batch itself. 
    // 
    // The former is used to avoid state switching, while the latter is
    // a generic automatic id which might be used for picking, for
    // example.
    // 
    // This should not lead to any problems right now but might be confusing to
    // readers.

    var draw_opts = {
        program: draw_program,
        attributes: draw_attribute_arrays,
        set_caps: ((appearance.mode && appearance.mode.set_draw_caps) || 
                   Facet.DrawingMode.standard.set_draw_caps),
        draw_chunk: draw_chunk,
        batch_id: draw_batch_id
    };

    var batch_id = Facet.fresh_pick_id();
    var pick_id;
    if (appearance.pick_id)
        pick_id = Shade.make(appearance.pick_id);
    else {
        pick_id = Shade.make(Shade.id(batch_id));
    }

    var pick_program_exp = {};
    _.each(appearance, function(value, key) {
        if (Shade.is_program_parameter(key)) {
            if (key === 'color' || key === 'gl_FragColor') {
                var pick_if = (appearance.pick_if ||
                               Shade.make(value).swizzle("a").gt(0));
                pick_program_exp[key] = pick_id
                    .discard_if(Shade.logical_not(pick_if));
            } else {
                pick_program_exp[key] = value;
            }
        }
    });
    var pick_program = Shade.program(pick_program_exp);
    var pick_attribute_arrays = _.build(_.map(
        pick_program.attribute_buffers, function(v) { return [v._shade_name, v]; }
    ));
        
    var pick_batch_id = largest_batch_id++;
    var pick_opts = {
        program: pick_program,
        attributes: pick_attribute_arrays,
        set_caps: ((appearance.mode && appearance.mode.set_pick_caps) || 
                   Facet.DrawingMode.standard.set_pick_caps),
        draw_chunk: draw_chunk,
        batch_id: pick_batch_id
    };

    var which_opts = [ draw_opts, pick_opts ];

    var result = {
        batch_id: batch_id,
        draw: function() {
            draw_it(which_opts[Facet.Picker.picking_mode]);
        },
        // in case you want to force the behavior, or that
        // single array lookup is too slow for you.
        _draw: function() {
            draw_it(draw_opts);
        },
        _pick: function() {
            draw_it(pick_opts);
        }
    };
    return result;
};
})();
