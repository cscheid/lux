(function() {

function internal_batch(opts, texture) {
    
    var position_function = opts.position;
    var color_function = opts.color;

    var uv = Facet.attribute_buffer({vertex_array: [0,0, 1, 0, 1, 1], item_size: 2});
    var position = Facet.attribute_buffer({vertex_array: [0,0, 1, 0, 1, 1], item_size: 2});
    var elements = Facet.element_buffer([0, 1, 2]);

    var x_offset = Shade.parameter("float", 0);
    var y_offset = Shade.parameter("float", 0);
    var offset = Shade.vec(x_offset, y_offset);
    var model = Facet.model({
        uv: uv,
        position: position,
        elements: elements,
        type: "triangles"
    });
    var world_position = Shade.add(model.position, offset).div(opts.font.ascender).mul(opts.size);
    var opacity = Shade.texture2D(texture, model.uv).r();
    var uv_gradmag = model.uv.x().mul(texture.width).dFdx().pow(2).add(model.uv.y().mul(texture.height).dFdy().pow(2)).sqrt();

    var opacity_step = Shade.Scale.linear(
        {domain: [Shade.max(Shade(0.5).sub(uv_gradmag), 0), Shade.min(Shade(0.5).add(uv_gradmag), 1)],
         range: [0, 1]})(opacity).clamp(0, 1);

    var final_color = color_function(world_position).mul(Shade.vec(1,1,1,opacity_step));
    var batch = Facet.bake(model, {
        position: position_function(world_position),
        color: final_color,
        elements: model.elements,
        mode: Facet.DrawingMode.over_with_depth
    });
    return {
        batch: batch,
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
        glyph._model = Facet.model({
            type: "triangles",
            uv: Facet.attribute_buffer({vertex_array: uv, item_size: 2, keep_array: true}),
            position: Facet.attribute_buffer({vertex_array: position, item_size: 2, keep_array: true}),
            elements: Facet.element_buffer(elements)
        });
    }
    return glyph._model;
}

Facet.Text.texture_batch = function(opts) {
    var old_opts = opts;
    if (!_.isUndefined(opts.batch)) {
        return opts.batch;
    }
    opts = _.defaults(opts, {
        string: "",
        size: 10,
        align: "left",
        position: function(pos) { return Shade.vec(pos, 0, 1); },
        color: function(pos) { return Shade.color("white"); }
    });

    if (_.isUndefined(opts.font)) {
        throw "texture_batch requires font parameter";
    }

    var batch = {};

    if (!opts.font.texture) {
        opts.font.texture = Facet.texture({
            src: opts.font.image_url,
            onload: function() { 
                batch = internal_batch(opts, this);
                old_opts.batch = batch;
                Facet.Scene.invalidate(); 
            }
        });
    }
    old_opts.batch = batch;

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
                throw "Facet.Text.texture_batch.align must be one of 'left', 'center' or 'right'";
            }
        },
        draw: function() {
            if (_.isUndefined(batch.batch))
                return;

            batch.x_offset.set(this.alignment_offset(0));
            batch.y_offset.set(0);
            for (var i=0; i<opts.string.length; ++i) {
                var c = opts.string[i];
                if ("\n\r".indexOf(c) !== -1) {
                    batch.x_offset.set(0);
                    batch.y_offset.set(batch.y_offset.get() - opts.font.lineheight);
                    continue;
                }
                var glyph = opts.font.glyphs[String(c.charCodeAt(0))];
                if (_.isUndefined(glyph))
                    glyph = opts.font.glyphs[String('?'.charCodeAt(0))];
                var model = glyph_to_model(glyph, opts.font);
                if (model) {
                    batch.model.elements = model.elements;
                    batch.model.uv.set(model.uv.get());
                    batch.model.position.set(model.position.get());
                    batch.batch.draw();
                }
                batch.x_offset.set(batch.x_offset.get() + glyph.ha);
            }
        }
    };
    return result;
};

})();
