(function() {

function internalActor(opts) {
    var texture = opts.font.texture;
    var textureWidth = opts.font.textureWidth;
    var textureHeight = opts.font.textureHeight;
    
    var positionFunction = opts.position;
    var colorFunction = opts.color;

    var uv = Lux.attributeBuffer({vertexArray: [0,0, 1, 0, 1, 1], itemSize: 2});
    var position = Lux.attributeBuffer({vertexArray: [0,0, 1, 0, 1, 1], itemSize: 2});
    var elements = Lux.elementBuffer([0, 1, 2]);

    var xOffset = Shade.parameter("float", 0);
    var yOffset = Shade.parameter("float", 0);
    var offset = Shade.vec(xOffset, yOffset);
    var model = Lux.model({
        uv: uv,
        position: position,
        elements: elements,
        type: "triangles"
    });
    var worldPosition = Shade.add(model.position, offset).div(opts.font.ascender).mul(opts.size);
    var opacity = Shade.texture2D(texture, model.uv).r();
    var uvGradmag = model.uv.x().mul(textureWidth).dFdx().pow(2).add(model.uv.y().mul(textureHeight).dFdy().pow(2)).sqrt();

    var blurCompensation = Shade.Scale.linear(
        {domain: [Shade.max(Shade(0.5).sub(uvGradmag), 0), Shade.min(Shade(0.5).add(uvGradmag), 1)],
         range: [0, 1]})(opacity).clamp(0, 1);

    var finalOpacity = Shade.ifelse(opts.compensateBlur, blurCompensation, opacity);

    var finalColor = colorFunction(worldPosition).mul(Shade.vec(1,1,1, finalOpacity));
    var actor = Lux.actor({
        model: model, 
        appearance: {
            position: positionFunction(worldPosition),
            color: finalColor,
            elements: model.elements,
            mode: Lux.DrawingMode.overWithDepth }});
    return {
        actor: actor,
        model: model,
        xOffset: xOffset,
        yOffset: yOffset
    };
}

function glyphToModel(glyph, font)
{
    if (_.isUndefined(glyph._model)) {
        var elements = [0, 1, 2, 0, 2, 3];
        var position = [glyph.left, glyph.top - glyph.glyphHeight,
                        glyph.left + glyph.glyphWidth, glyph.top - glyph.glyphHeight,
                        glyph.left + glyph.glyphWidth, glyph.top,
                        glyph.left, glyph.top];
        var uv = [glyph.xoff / font.textureWidth, 1 - (glyph.yoff + glyph.glyphHeight) / font.textureHeight,
                  (glyph.xoff + glyph.glyphWidth) / font.textureWidth, 1 - (glyph.yoff + glyph.glyphHeight) / font.textureHeight,
                  (glyph.xoff + glyph.glyphWidth) / font.textureWidth, 1 - glyph.yoff/font.textureHeight,
                  glyph.xoff / font.textureWidth, 1 - glyph.yoff/font.textureHeight];
        glyph._model = Lux.model({
            type: "triangles",
            uv: Lux.attributeBuffer({vertexArray: uv, itemSize: 2, keepArray: true}),
            position: Lux.attributeBuffer({vertexArray: position, itemSize: 2, keepArray: true}),
            elements: Lux.elementBuffer(elements)
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
        compensateBlur: true
    });

    if (_.isUndefined(opts.font)) {
        throw new Error("Lux.Text.texture requires font parameter");
    }

    var actor = {};

    if (!opts.font.texture) {
        opts.font.texture = Lux.texture({
            src: opts.font.imageUrl,
            mipmaps: false,
            onload: function() {
                return opts.onload();
            }
        });
    }
    actor = internalActor(opts);

    var result = {
        set: function(newString) {
            opts.string = newString;
        },
        advance: function(charOffset) {
            var result = 0;
            while (charOffset < opts.string.length &&
                   "\n\r".indexOf(opts.string[charOffset])) {
                // oh god i need to fix this mess
                var ix = String(opts.string[charOffset++].charCodeAt(0));
                result += opts.font.glyphs[ix].ha;
            }
            return result;
        },
        alignmentOffset: function(charOffset) {
            var advance = this.advance(charOffset);
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
                    actor.xOffset.set(result.alignmentOffset(0));
                    actor.yOffset.set(0);
                    for (var i=0; i<opts.string.length; ++i) {
                        var c = opts.string[i];
                        if ("\n\r".indexOf(c) !== -1) {
                            actor.xOffset.set(0);
                            actor.yOffset.set(actor.yOffset.get() - opts.font.lineheight);
                            continue;
                        }
                        var glyph = opts.font.glyphs[String(c.charCodeAt(0))];
                        if (_.isUndefined(glyph))
                            glyph = opts.font.glyphs[String('?'.charCodeAt(0))];
                        var model = glyphToModel(glyph, opts.font);
                        if (model) {
                            actor.model.elements = model.elements;
                            actor.model.uv.set(model.uv.get());
                            actor.model.position.set(model.position.get());
                            actor.batch.draw();
                        }
                        actor.xOffset.set(actor.xOffset.get() + glyph.ha);
                    }
                }
            };
        },
        on: function() { return true; }
    };
    return result;
};

})();
