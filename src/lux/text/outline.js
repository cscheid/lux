(function() {

function parse_typeface_instructions(glyph)
{
    // convert the string of typeface instructions coming from a typeface.js glyph
    // representation to a list of "paths", each path being a list of points
    // which are the glyph "internal polygon", and a list of "ears", the quadratic
    // splines that are to be rendered using Loop-Blinn.

    // this function mutates the passed glyph to memoize the result for increased
    // performance.

    if (_.isUndefined(glyph.o))
        return [];

    var x, y, cpx, cpy;
    var ops = _.map(glyph.o.split(" "), function(e) {
        var n = Number(e);
        return isNaN(n) ? e : n;
    });
    ops = ops.slice(0, ops.length-1);

    var paths = [];
    var points = [];
    var quadratic_ears = [];
    var current_point = undefined, control_point;
    var next_point = undefined;
    var pc = 0;
    var quadratic_sign, opcode;
    while (pc < ops.length) {
        switch (opcode = ops[pc++]) {
        case "m":
            if (points.length || quadratic_ears.length) {
                paths.push({points: points,
                            ears: quadratic_ears});
                points = [];
                quadratic_ears = [];
            }
            x = ops[pc++];
            y = ops[pc++];
            current_point = vec.make([x, y]);
            break;
        case "q":
            x = ops[pc++];
            y = ops[pc++];
            cpx = ops[pc++];
            cpy = ops[pc++];
            next_point = vec.make([x, y]);
            control_point = vec.make([cpx, cpy]);
            quadratic_sign = vec.cross(vec.minus(control_point, current_point),
                                       vec.minus(next_point, control_point));
            quadratic_sign = quadratic_sign / Math.abs(quadratic_sign);
            quadratic_ears.push([current_point, control_point, next_point, quadratic_sign]);

            if (quadratic_sign < 0) {
                if (current_point)
                    points.push(current_point);
                current_point = next_point;
            } else {
                if (current_point)
                    points.push(current_point);
                points.push(control_point);
                current_point = next_point;
            }
            break;
        case "l":
            if (current_point)
                points.push(current_point);
            x = ops[pc++];
            y = ops[pc++];
            current_point = vec.make([x, y]);
            break;
        default:
            throw new Error("Unsupported opcode '" + opcode + "'");
        };
    }
    if (points.length || quadratic_ears.length)
        paths.push({points: points,
                    ears: quadratic_ears});

    return paths;
}

var loop_blinn_actor = function(opts) {
    var position_function = opts.position;
    var color_function = opts.color;
    
    function quadratic_discriminator(model) {
        var u = model.uv.x(), v = model.uv.y(), 
        winding = model.winding.sign();
        return u.mul(u).sub(v).mul(winding);
    }
    
    function quadratic_discard(exp, model) {
        return exp.discard_if(quadratic_discriminator(model).gt(0));
    };

    var model = {};
    var uv = Lux.attribute_buffer({vertex_array: [0,0], item_size: 2});
    var winding = Lux.attribute_buffer({vertex_array: [0], item_size: 1});
    var position = Lux.attribute_buffer({vertex_array: [0,0], item_size: 2});
    var internal_position_attribute = Lux.attribute_buffer({vertex_array: [0,0], item_size: 2});
    var elements = Lux.element_buffer([0]); // {vertex_array: []});
    
    var ears_model = Lux.model({
        uv: uv,
        position: position,
        winding: winding,
        elements: 1,
        type: "triangles"
    });
    var x_offset = Shade.parameter("float", 0);
    var y_offset = Shade.parameter("float", 0);
    var offset = Shade.vec(x_offset, y_offset);
    var ears_position = Shade.add(ears_model.position, offset);
    var ears_actor = Lux.actor({
        model: ears_model, 
        appearance: {
            position: position_function(ears_position.div(1000).mul(opts.size)),
            color: quadratic_discard(color_function(ears_position), ears_model)}});
    var internal_model = Lux.model({
        vertex: internal_position_attribute,
        elements: elements
    });
    var internal_position = Shade.add(internal_model.vertex, offset);
    var internal_actor = Lux.actor({
        model: internal_model, 
        appearance: {
            position: position_function(internal_position.div(1000).mul(opts.size)),
            elements: internal_model.elements,
            color: color_function(internal_position)}});
    return {
        ears_actor: ears_actor,
        ears_model: ears_model,
        internal_actor: internal_actor,
        internal_model: internal_model,
        x_offset: x_offset,
        y_offset: y_offset
    };
};

function glyph_to_model(glyph)
{
    if (_.isUndefined(glyph._model)) {
        var paths = parse_typeface_instructions(glyph);
        if (paths.length === 0)
            return undefined;

        var elements = [], vertex = [], uv = [], position = [], winding = [];
        _.each(paths, function(path) {
            _.each(path.ears, function(ear) {
                winding.push.apply(winding, [-ear[3], -ear[3], -ear[3]]);
                position.push.apply(position, ear[0]);
                position.push.apply(position, ear[1]);
                position.push.apply(position, ear[2]);
                uv.push.apply(uv, [0,0, 0.5,0, 1,1]);
            });
        });

        var contour = _.map(paths, function(path) {
            return path.points.slice().reverse();
        });
        var triangulation = Lux.Geometry.triangulate({ contour: contour });
        var internal_model = Lux.model({
            type: "triangles",
            vertex: Lux.attribute_buffer({vertex_array: new Float32Array(triangulation.vertices), item_size: 2, keep_array: true}),
            elements: _.toArray(triangulation.triangles)
        });

        var ears_model = Lux.model({
            uv: Lux.attribute_buffer({vertex_array: uv, item_size: 2, keep_array: true}),
            position: Lux.attribute_buffer({vertex_array: position, item_size: 2, keep_array: true}),
            winding: Lux.attribute_buffer({vertex_array: winding, item_size: 1, keep_array: true}),
            elements: uv.length/2,
            type: "triangles"
        });

        glyph._model = {
            ears_model: ears_model, 
            internal_model: internal_model
        };
    };
    return glyph._model;
}

Lux.Text.outline = function(opts) {
    opts = _.defaults(opts, {
        string: "",
        size: 10,
        align: "left",
        position: function(pos) { return Shade.vec(pos, 0, 1); },
        color: function(pos) { return Shade.color("white"); }
    });
    if (_.isUndefined(opts.font)) {
        throw new Error("outline requires font parameter");
    }
    var actor = loop_blinn_actor(opts);

    var result = {
        set: function(new_string) {
            opts.string = new_string;
        },
        advance: function(char_offset) {
            var result = 0;
            while (char_offset < opts.string.length &&
                   "\n\r".indexOf(opts.string[char_offset])) {
                result += opts.font.glyphs[opts.string[char_offset++]].ha;
            }
            return result;
        },
        alignment_offset: function(char_offset) {
            var advance = this.advance(char_offset);
            switch (opts.align) {
            case "left": return 0;
            case "right": return -advance;
            case "center": return -advance/2;
            default:
                throw new Error("align must be one of 'left', 'center' or 'right'");
            }
        },
        dress: function(scene) {
            actor.internal_batch = actor.internal_actor.dress(scene);
            actor.ears_batch = actor.ears_actor.dress(scene);
            return {
                draw: function() {
                    actor.x_offset.set(result.alignment_offset(0));
                    actor.y_offset.set(0);
                    for (var i=0; i<opts.string.length; ++i) {
                        var c = opts.string[i];
                        if ("\n\r".indexOf(c) !== -1) {
                            actor.x_offset.set(0);                    
                            actor.y_offset.set(actor.y_offset.get() - opts.font.lineHeight);
                            continue;
                        }
                        var glyph = opts.font.glyphs[c];
                        if (_.isUndefined(glyph))
                            glyph = opts.font.glyphs['?'];
                        var model = glyph_to_model(glyph);
                        if (model) {
                            actor.ears_model.elements = model.ears_model.elements;
                            actor.ears_model.uv.set(model.ears_model.uv.get());
                            actor.ears_model.winding.set(model.ears_model.winding.get());
                            actor.ears_model.position.set(model.ears_model.position.get());
                            actor.internal_model.vertex.set(model.internal_model.vertex.get());
                            actor.internal_model.elements.set(model.internal_model.elements.array);
                            actor.ears_batch.draw();
                            actor.internal_batch.draw();
                        }
                        actor.x_offset.set(actor.x_offset.get() + glyph.ha);
                    }
                }
            };
        },
        on: function() { return true; }
    };
    return result;
};

})();
