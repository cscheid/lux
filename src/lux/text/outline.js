(function() {

function parseTypefaceInstructions(glyph)
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
    var quadraticEars = [];
    var currentPoint = undefined, controlPoint;
    var nextPoint = undefined;
    var pc = 0;
    var quadraticSign, opcode;
    while (pc < ops.length) {
        switch (opcode = ops[pc++]) {
        case "m":
            if (points.length || quadraticEars.length) {
                paths.push({points: points,
                            ears: quadraticEars});
                points = [];
                quadraticEars = [];
            }
            x = ops[pc++];
            y = ops[pc++];
            currentPoint = vec.make([x, y]);
            break;
        case "q":
            x = ops[pc++];
            y = ops[pc++];
            cpx = ops[pc++];
            cpy = ops[pc++];
            nextPoint = vec.make([x, y]);
            controlPoint = vec.make([cpx, cpy]);
            quadraticSign = vec.cross(vec.minus(controlPoint, currentPoint),
                                      vec.minus(nextPoint, controlPoint));
            quadraticSign = quadraticSign / Math.abs(quadraticSign);
            quadraticEars.push([currentPoint, controlPoint, nextPoint, quadraticSign]);

            if (quadraticSign < 0) {
                if (currentPoint)
                    points.push(currentPoint);
                currentPoint = nextPoint;
            } else {
                if (currentPoint)
                    points.push(currentPoint);
                points.push(controlPoint);
                currentPoint = nextPoint;
            }
            break;
        case "l":
            if (currentPoint)
                points.push(currentPoint);
            x = ops[pc++];
            y = ops[pc++];
            currentPoint = vec.make([x, y]);
            break;
        default:
            throw new Error("Unsupported opcode '" + opcode + "'");
        };
    }
    if (points.length || quadraticEars.length)
        paths.push({points: points,
                    ears: quadraticEars});

    return paths;
}

var loopBlinnActor = function(opts) {
    var positionFunction = opts.position;
    var colorFunction = opts.color;
    
    function quadraticDiscriminator(model) {
        var u = model.uv.x(), v = model.uv.y(), 
        winding = model.winding.sign();
        return u.mul(u).sub(v).mul(winding);
    }
    
    function quadraticDiscard(exp, model) {
        return exp.discardIf(quadraticDiscriminator(model).gt(0));
    };

    var model = {};
    var uv = Lux.attributeBuffer({vertexArray: [0,0], itemSize: 2});
    var winding = Lux.attributeBuffer({vertexArray: [0], itemSize: 1});
    var position = Lux.attributeBuffer({vertexArray: [0,0], itemSize: 2});
    var internalPositionAttribute = Lux.attributeBuffer({vertexArray: [0,0], itemSize: 2});
    var elements = Lux.elementBuffer([0]); // {vertexArray: []});
    
    var earsModel = Lux.model({
        uv: uv,
        position: position,
        winding: winding,
        elements: 1,
        type: "triangles"
    });
    var xOffset = Shade.parameter("float", 0);
    var yOffset = Shade.parameter("float", 0);
    var offset = Shade.vec(xOffset, yOffset);
    var earsPosition = Shade.add(earsModel.position, offset);
    var earsActor = Lux.actor({
        model: earsModel, 
        appearance: {
            position: positionFunction(earsPosition.div(1000).mul(opts.size)),
            color: quadraticDiscard(colorFunction(earsPosition), earsModel)}});
    var internalModel = Lux.model({
        vertex: internalPositionAttribute,
        elements: elements
    });
    var internalPosition = Shade.add(internalModel.vertex, offset);
    var internalActor = Lux.actor({
        model: internalModel, 
        appearance: {
            position: positionFunction(internalPosition.div(1000).mul(opts.size)),
            elements: internalModel.elements,
            color: colorFunction(internalPosition)}});
    return {
        earsActor: earsActor,
        earsModel: earsModel,
        internalActor: internalActor,
        internalModel: internalModel,
        xOffset: xOffset,
        yOffset: yOffset
    };
};

function glyphToModel(glyph)
{
    if (_.isUndefined(glyph._model)) {
        var paths = parseTypefaceInstructions(glyph);
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
        var internalModel = Lux.model({
            type: "triangles",
            vertex: Lux.attributeBuffer({vertexArray: new Float32Array(triangulation.vertices), itemSize: 2, keepArray: true}),
            elements: _.toArray(triangulation.triangles)
        });

        var earsModel = Lux.model({
            uv: Lux.attributeBuffer({vertexArray: uv, itemSize: 2, keepArray: true}),
            position: Lux.attributeBuffer({vertexArray: position, itemSize: 2, keepArray: true}),
            winding: Lux.attributeBuffer({vertexArray: winding, itemSize: 1, keepArray: true}),
            elements: uv.length/2,
            type: "triangles"
        });

        glyph._model = {
            earsModel: earsModel, 
            internalModel: internalModel
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
    var actor = loopBlinnActor(opts);

    var result = {
        set: function(newString) {
            opts.string = newString;
        },
        advance: function(charOffset) {
            var result = 0;
            while (charOffset < opts.string.length &&
                   "\n\r".indexOf(opts.string[charOffset])) {
                result += opts.font.glyphs[opts.string[charOffset++]].ha;
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
            actor.internalBatch = actor.internalActor.dress(scene);
            actor.earsBatch = actor.earsActor.dress(scene);
            return {
                draw: function() {
                    actor.xOffset.set(result.alignmentOffset(0));
                    actor.yOffset.set(0);
                    for (var i=0; i<opts.string.length; ++i) {
                        var c = opts.string[i];
                        if ("\n\r".indexOf(c) !== -1) {
                            actor.xOffset.set(0);                    
                            actor.yOffset.set(actor.yOffset.get() - opts.font.lineHeight);
                            continue;
                        }
                        var glyph = opts.font.glyphs[c];
                        if (_.isUndefined(glyph))
                            glyph = opts.font.glyphs['?'];
                        var model = glyphToModel(glyph);
                        if (model) {
                            actor.earsModel.elements = model.earsModel.elements;
                            actor.earsModel.uv.set(model.earsModel.uv.get());
                            actor.earsModel.winding.set(model.earsModel.winding.get());
                            actor.earsModel.position.set(model.earsModel.position.get());
                            actor.internalModel.vertex.set(model.internalModel.vertex.get());
                            actor.internalModel.elements.set(model.internalModel.elements.array);
                            actor.earsBatch.draw();
                            actor.internalBatch.draw();
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
