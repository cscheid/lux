(function() {

function internal_actor(opts) {
    var texture = opts.font.texture;
    var texture_width = opts.font.texture_width;
    var texture_height = opts.font.texture_height;
    
    var position_function = opts.position;
    var color_function = opts.color;

    var uv = Lux.attribute_buffer({vertex_array: [0,0, 1, 0, 1, 1], item_size: 2});
    var position = Lux.attribute_buffer({vertex_array: [0,0, 1, 0, 1, 1], item_size: 2});
    var elements = Lux.element_buffer([0, 1, 2]);

    var x_offset = Shade.parameter("float", 0);
    var y_offset = Shade.parameter("float", 0);
    var offset = Shade.vec(x_offset, y_offset);
    var model = Lux.model({
        uv: uv,
        position: position,
        elements: elements,
        type: "triangles"
    });
    var world_position = Shade.add(model.position, offset).div(opts.font.ascender).mul(opts.size);
    var opacity = Shade.texture2D(texture, model.uv).r();
    var uv_gradmag = model.uv.x().mul(texture_width).dFdx().pow(2).add(model.uv.y().mul(texture_height).dFdy().pow(2)).sqrt();

    var blur_compensation = Shade.Scale.linear(
        {domain: [Shade.max(Shade(0.5).sub(uv_gradmag), 0), Shade.min(Shade(0.5).add(uv_gradmag), 1)],
         range: [0, 1]})(opacity).clamp(0, 1);

    var final_opacity = Shade.ifelse(opts.compensate_blur, blur_compensation, opacity);

    var final_color = color_function(world_position).mul(Shade.vec(1,1,1, final_opacity));
    var actor = Lux.actor({
        model: model, 
        appearance: {
            position: position_function(world_position),
            color: final_color,
            elements: model.elements,
            mode: Lux.DrawingMode.over_with_depth }});
    return {
        actor: actor,
        model: model,
        x_offset: x_offset,
        y_offset: y_offset
    };
}

function glyph_to_model(glyph, font)
{
    if (_.isUndefined(glyph._model)) {
        var elements = [0, 1, 2, 0, 2, 3];
        var position = [glyph.left, glyph.top - glyph.glyph_height,
                        glyph.left + glyph.glyph_width, glyph.top - glyph.glyph_height,
                        glyph.left + glyph.glyph_width, glyph.top,
                        glyph.left, glyph.top];
        var uv = [glyph.xoff / font.texture_width, 1 - (glyph.yoff + glyph.glyph_height) / font.texture_height,
                  (glyph.xoff + glyph.glyph_width) / font.texture_width, 1 - (glyph.yoff + glyph.glyph_height) / font.texture_height,
                  (glyph.xoff + glyph.glyph_width) / font.texture_width, 1 - glyph.yoff/font.texture_height,
                  glyph.xoff / font.texture_width, 1 - glyph.yoff/font.texture_height];
        glyph._model = Lux.model({
            type: "triangles",
            uv: Lux.attribute_buffer({vertex_array: uv, item_size: 2, keep_array: true}),
            position: Lux.attribute_buffer({vertex_array: position, item_size: 2, keep_array: true}),
            elements: Lux.element_buffer(elements)
        });
    }
    return glyph._model;
}

Lux.Text.texture = function(opts) {
    opts = _.defaults(opts, {
        string: "",
        size: 10,
        align: "left",
        position: function(pos) { return Shade.vec(pos, 0, 1); },
        color: function(pos) { return Shade.color("white"); },
        onload: function() { Lux.Scene.invalidate(); },
        compensate_blur: true
    });

    if (_.isUndefined(opts.font)) {
        throw new Error("Lux.Text.texture requires font parameter");
    }

    var actor = {};

    if (!opts.font.texture) {
        opts.font.texture = Lux.texture({
            src: opts.font.image_url,
            mipmaps: false,
            onload: function() {
                return opts.onload();
            }
        });
    }
    actor = internal_actor(opts);

    var result = {
        set: function(new_string) {
            opts.string = new_string;
        },
        advance: function(char_offset) {
            var result = 0;
            while (char_offset < opts.string.length &&
                   "\n\r".indexOf(opts.string[char_offset])) {
                // oh god i need to fix this mess
                var ix = String(opts.string[char_offset++].charCodeAt(0));
                result += opts.font.glyphs[ix].ha;
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
            actor.batch = actor.actor.dress(scene);
            return {
                draw: function() {
                    actor.x_offset.set(result.alignment_offset(0));
                    actor.y_offset.set(0);
                    for (var i=0; i<opts.string.length; ++i) {
                        var c = opts.string[i];
                        if ("\n\r".indexOf(c) !== -1) {
                            actor.x_offset.set(0);
                            actor.y_offset.set(actor.y_offset.get() - opts.font.lineheight);
                            continue;
                        }
                        var glyph = opts.font.glyphs[String(c.charCodeAt(0))];
                        if (_.isUndefined(glyph))
                            glyph = opts.font.glyphs[String('?'.charCodeAt(0))];
                        var model = glyph_to_model(glyph, opts.font);
                        if (model) {
                            actor.model.elements = model.elements;
                            actor.model.uv.set(model.uv.get());
                            actor.model.position.set(model.position.get());
                            actor.batch.draw();
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
