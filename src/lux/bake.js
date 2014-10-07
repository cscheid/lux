(function() {

var previous_batch_opts = {};
Lux.get_current_batch_opts = function()
{
    return previous_batch_opts;
};

Lux.unload_batch = function()
{
    if (!previous_batch_opts._ctx)
        return;
    var ctx = previous_batch_opts._ctx;
    if (previous_batch_opts.attributes) {
        for (var key in previous_batch_opts.attributes) {
            ctx.disableVertexAttribArray(previous_batch_opts.program[key]);
        }
        _.each(previous_batch_opts.program.uniforms, function (uniform) {
            delete uniform._lux_active_uniform;
        });
    }

    if (previous_batch_opts.line_width)
        ctx.lineWidth(1.0);
    if (previous_batch_opts.polygon_offset) {
        ctx.disable(ctx.POLYGON_OFFSET_FILL);
    }

    // reset the opengl capabilities which are determined by
    // Lux.DrawingMode.*
    ctx.disable(ctx.DEPTH_TEST);
    ctx.disable(ctx.BLEND);
    ctx.depthMask(true);

    previous_batch_opts = {};
};

function draw_it(batch_opts)
{
    if (_.isUndefined(batch_opts))
        throw new Error("drawing mode undefined");

    // When the batch_options object is different from the one previously drawn,
    // we must set up the appropriate state for drawing.
    if (batch_opts.batch_id !== previous_batch_opts.batch_id) {
        var attributes = batch_opts.attributes || {};
        var uniforms = batch_opts.uniforms || {};
        var program = batch_opts.program;
        var key;

        Lux.unload_batch();
        previous_batch_opts = batch_opts;
        batch_opts.set_caps();

        var ctx = batch_opts._ctx;
        ctx.useProgram(program);

        for (key in attributes) {
            var attr = program[key];
            if (!_.isUndefined(attr)) {
                ctx.enableVertexAttribArray(attr);
                var buffer = attributes[key].get();
                if (!buffer) {
                    throw new Error("Unset Shade.attribute " + attributes[key]._attribute_name);
                }
                buffer.bind(attr);
            }
        }
        
        var currentActiveTexture = 0;
        _.each(program.uniforms, function(uniform) {
            var key = uniform.uniform_name;
            var call = uniform.uniform_call,
                value = uniform.get();
            if (_.isUndefined(value)) {
                throw new Error("parameter " + key + " has not been set.");
            }
            var t = Shade.Types.type_of(value);
            if (t.equals(Shade.Types.other_t)) {
                uniform._lux_active_uniform = (function(uid, cat) {
                    return function(v) {
                        ctx.activeTexture(ctx.TEXTURE0 + cat);
                        ctx.bindTexture(ctx.TEXTURE_2D, v);
                        ctx.uniform1i(uid, cat);
                    };
                })(program[key], currentActiveTexture);
                currentActiveTexture++;
            } else if (t.equals(Shade.Types.float_t) || 
                       t.equals(Shade.Types.bool_t) ||
                       t.repr().substr(0,3) === "vec") {
                uniform._lux_active_uniform = (function(call, uid) {
                    return function(v) {
                        call.call(ctx, uid, v);
                    };
                })(ctx[call], program[key]);
            } else if (t.repr().substr(0,3) === "mat") {
                uniform._lux_active_uniform = (function(call, uid) {
                    return function(v) {
                        ctx[call](uid, false, v);
                    };
                })(call, program[key]);
            } else {
                throw new Error("could not figure out parameter type! " + t);
            }
            uniform._lux_active_uniform(value);
        });
    }

    batch_opts.draw_chunk();
}

var largest_batch_id = 1;

Lux.bake = function(model, appearance, opts)
{
    appearance = Shade.canonicalize_program_object(appearance);
    opts = _.defaults(opts || {}, {
        force_no_draw: false,
        force_no_pick: false,
        force_no_unproject: false
    });
    var ctx = model._ctx || Lux._globals.ctx;

    if (_.isUndefined(appearance.gl_FragColor)) {
        appearance.gl_FragColor = Shade.vec(1,1,1,1);
    }

    // these are necessary outputs which must be compiled by Shade.program
    function is_program_output(key)
    {
        return ["color", "position", "point_size",
                "gl_FragColor", "gl_Position", "gl_PointSize"].indexOf(key) != -1;
    };

    if (appearance.gl_Position.type.equals(Shade.Types.vec2)) {
        appearance.gl_Position = Shade.vec(appearance.gl_Position, 0, 1);
    } else if (appearance.gl_Position.type.equals(Shade.Types.vec3)) {
        appearance.gl_Position = Shade.vec(appearance.gl_Position, 1);
    } else if (!appearance.gl_Position.type.equals(Shade.Types.vec4)) {
        throw new Error("position appearance attribute must be vec2, vec3 or vec4");
    }

    var batch_id = Lux.fresh_pick_id();

    function build_attribute_arrays_obj(prog) {
        return _.build(_.map(
            prog.attribute_buffers, function(v) { return [v._attribute_name, v]; }
        ));
    }

    function process_appearance(val_key_function) {
        var result = {};
        _.each(appearance, function(value, key) {
            if (is_program_output(key)) {
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
            pick_id = Shade(appearance.pick_id);
        else {
            pick_id = Shade(Shade.id(batch_id));
        }
        return process_appearance(function(value, key) {
            if (key === 'gl_FragColor') {
                var pick_if = (appearance.pick_if || 
                               Shade(value).swizzle("a").gt(0));
                return pick_id.discard_if(Shade.not(pick_if));
            } else
                return value;
        });
    }

    /* Lux unprojecting uses the render-as-depth technique suggested
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
    if (Lux.type_of(elements) === 'number') {
        draw_chunk = function() {
            // it's important to use "model.elements" here instead of "elements" because
            // the indirection captures the fact that the model might have been updated with
            // a different number of elements, by changing the attribute buffers.
            // 
            // FIXME This is a phenomentally bad way to go about this problem, but let's go with it for now.
            ctx.drawArrays(primitive_type, 0, model.elements);
        };
    } else {
        if (elements._shade_type === 'attribute_buffer') {
            draw_chunk = function() {
                model.elements.draw(primitive_type);
            };
        } else if (elements._shade_type === 'element_buffer') {
            draw_chunk = function() {
                model.elements.bind_and_draw(primitive_type);
            };
        } else
            throw new Error("model.elements must be a number, an element buffer or an attribute buffer");
    }

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
        function ensure_parameter(v) {
            if (Lux.type_of(v) === 'number')
                return Shade.parameter("float", v);
            else if (Lux.is_shade_expression(v) === 'parameter')
                return v;
            else throw new Error("expected float or parameter, got " + v + " instead.");
        }
        var result = {
            _ctx: ctx,
            program: program,
            attributes: build_attribute_arrays_obj(program),
            set_caps: function() {
                var ctx = Lux._globals.ctx;
                var mode_caps = ((appearance.mode && appearance.mode[caps_name]) ||
                       Lux.DrawingMode.standard[caps_name]);
                mode_caps();
                if (this.line_width) {
                    ctx.lineWidth(this.line_width.get());
                }
                if (this.polygon_offset) {
                    ctx.enable(ctx.POLYGON_OFFSET_FILL);
                    ctx.polygonOffset(this.polygon_offset.factor.get(), 
                                      this.polygon_offset.units.get());
                }
            },
            draw_chunk: draw_chunk,
            batch_id: largest_batch_id++
        };
        if (!_.isUndefined(appearance.line_width))
            result.line_width = ensure_parameter(appearance.line_width);
        if (!_.isUndefined(appearance.polygon_offset))
            result.polygon_offset = {
                factor: ensure_parameter(appearance.polygon_offset.factor),
                units: ensure_parameter(appearance.polygon_offset.units)
            };
        return result;
    }

    var draw_opts, pick_opts, unproject_opts;

    if (!opts.force_no_draw)
        draw_opts = create_batch_opts(create_draw_program(), "set_draw_caps");

    if (!opts.force_no_pick)
        pick_opts = create_batch_opts(create_pick_program(), "set_pick_caps");

    if (!opts.force_no_unproject)
        unproject_opts = create_batch_opts(create_unproject_program(), "set_unproject_caps");

    var which_opts = [ draw_opts, pick_opts, unproject_opts ];

    var result = {
        model: model,
        batch_id: batch_id,
        draw: function() {
            draw_it(which_opts[ctx._luxGlobals.batch_render_mode]);
        },
        // in case you want to force the behavior, or that
        // single array lookup is too slow for you.
        _draw: function() {
            draw_it(draw_opts);
        },
        _pick: function() {
            draw_it(pick_opts);
        },
        // for debugging purposes
        _batch_opts: function() { return which_opts; }
    };
    return result;
};
})();
