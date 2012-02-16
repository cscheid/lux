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
            if (!_.isUndefined(attr)) {
                ctx.enableVertexAttribArray(attr);
                attributes[key].bind(attr);
            }
        }
        
        var currentActiveTexture = 0;
        _.each(program.uniforms, function(uniform) {
            var key = uniform.uniform_name;
            var call = uniform.uniform_call,
                value = uniform.get();
            if (_.isUndefined(value)) {
                throw "uniform " + key + " has not been set.";
            }
            var t = facet_constant_type(value);
            if (t === "other") {
                uniform._facet_active_uniform = (function(uid, cat) {
                    return function(v) {
                        ctx.activeTexture(ctx.TEXTURE0 + cat);
                        ctx.bindTexture(ctx.TEXTURE_2D, v);
                        ctx.uniform1i(uid, cat);
                    };
                })(program[key], currentActiveTexture);
                currentActiveTexture++;
            } else if (t === "number" || t === "vector" || t === "boolean") {
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
            } else {
                throw "could not figure out uniform type! " + t;
            }
            uniform._facet_active_uniform(value);
        });
    }

    batch.draw_chunk();
}

var largest_batch_id = 1;

Facet.bake = function(model, appearance)
{
    appearance = Shade.canonicalize_program_object(appearance);
    var ctx = Facet._globals.ctx;

    var batch_id = Facet.fresh_pick_id();

    function build_attribute_arrays_obj(prog) {
        return _.build(_.map(
            prog.attribute_buffers, function(v) { return [v._shade_name, v]; }
        ));
    }

    function process_appearance(val_key_function) {
        var result = {};
        _.each(appearance, function(value, key) {
            if (Shade.is_program_parameter(key)) {
                result[key] = val_key_function(value, key);
            }
        });
        return Shade.program(result);
    }

    function create_draw_program() {
        return process_appearance(function(value, key) {
            return value;
        });
    }

    function create_pick_program() {
        var pick_id;
        if (appearance.pick_id)
            pick_id = Shade.make(appearance.pick_id);
        else {
            pick_id = Shade.make(Shade.id(batch_id));
        }
        return process_appearance(function(value, key) {
            if (key === 'gl_FragColor') {
                var pick_if = (appearance.pick_if || 
                               Shade.make(value).swizzle("a").gt(0));
                return pick_id.discard_if(Shade.not(pick_if));
            } else
                return value;
        });
    }

    /* Facet unprojecting uses the render-as-depth technique suggested
     by Benedetto et al. in the SpiderGL paper in the context of
     shadow mapping:

     SpiderGL: A JavaScript 3D Graphics Library for Next-Generation
     WWW

     Marco Di Benedetto, Federico Ponchio, Fabio Ganovelli, Roberto
     Scopigno. Visual Computing Lab, ISTI-CNR

     http://vcg.isti.cnr.it/Publications/2010/DPGS10/spidergl.pdf

     FIXME: Perhaps there should be an option of doing this directly as
     render-to-float-texture.

     */
    
    function create_unproject_program() {
        return process_appearance(function(value, key) {
            if (key === 'gl_FragColor') {
                var position_z = appearance.gl_Position.swizzle('z'),
                    position_w = appearance.gl_Position.swizzle('w');
                var normalized_z = position_z.div(position_w).add(1).div(2);

                // normalized_z ranges from 0 to 1.

                // an opengl z-buffer actually stores information as
                // 1/z, so that more precision is spent on the close part
                // of the depth range. Here, we are storing z, and so our efficiency won't be great.
                // 
                // However, even 1/z is only an approximation to the ideal scenario, and 
                // if we're already doing this computation on a shader, it might be worthwhile to use
                // Thatcher Ulrich's suggestion about constant relative precision using 
                // a logarithmic mapping:

                // http://tulrich.com/geekstuff/log_depth_buffer.txt

                // This mapping, incidentally, is more directly interpretable as
                // linear interpolation in log space.

                var result_rgba = Shade.vec(
                    normalized_z,
                    normalized_z.mul(1 << 8),
                    normalized_z.mul(1 << 16),
                    normalized_z.mul(1 << 24)
                );
                return result_rgba;
            } else
                return value;
        });
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
    if (facet_typeOf(elements) === 'number') {
        draw_chunk = function() {
            ctx.drawArrays(primitive_type, 0, elements);
        };
    } else {
        draw_chunk = function() {
            elements.bind_and_draw(elements, primitive_type);
        };
    }
    var primitives = [primitive_types[model.type], model.elements];

    // FIXME the batch_id field in the batch_opts objects is not
    // the same as the batch_id in the batch itself. 
    // 
    // The former is used to avoid state switching, while the latter is
    // a generic automatic id which might be used for picking, for
    // example.
    // 
    // This should not lead to any problems right now but might be confusing to
    // readers.

    function create_batch_opts(program, caps_name) {
        return {
            program: program,
            attributes: build_attribute_arrays_obj(program),
            set_caps: ((appearance.mode && appearance.mode[caps_name]) ||
                       Facet.DrawingMode.standard[caps_name]),
            draw_chunk: draw_chunk,
            batch_id: largest_batch_id++
        };
    }

    var draw_opts = create_batch_opts(create_draw_program(), "set_draw_caps");
    var pick_opts = create_batch_opts(create_pick_program(), "set_pick_caps");
    var unproject_opts = create_batch_opts(create_unproject_program(), "set_unproject_caps");

    var which_opts = [ draw_opts, pick_opts, unproject_opts ];

    var result = {
        batch_id: batch_id,
        draw: function() {
            draw_it(which_opts[Facet._globals.batch_render_mode]);
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
