var S = Shade;

var gl;
var data;
var barsBatch;
var alive = false;
var histo;

//////////////////////////////////////////////////////////////////////////////

function histoBuffer(opts)
{
    opts = _.defaults(opts || {}, {
        binCount: 64,
        weight: Shade.vec(1,1,1,1)
    });
    if (_.isUndefined(opts.bin)) {
        throw "histoBuffer requires 'bin' field";
    }
    opts.bin = Shade(opts.bin);

    var sz = Math.ceil(Math.sqrt(opts.binCount));

    var ctx = Lux._globals.ctx;
    var renderBuffer = Lux.renderBuffer({
        clearColor: [0,0,0,0],
        width: sz,
        height: sz,
        type: ctx.FLOAT // enable render to floating-point texture
    });
    var readRenderBuffer = Lux.renderBuffer({
        width: sz,
        height: sz
    });

    function binToTexcoord(pos) {
        // the call to floor() prevents spillage when pos is fractional
        return Shade.vec(pos.mod(sz), pos.div(sz)).floor().add(0.5).div(sz);
    }
    function binToScreen(pos) {
        // the call to floor() prevents spillage when pos is fractional
        var xy = Shade.vec(pos.mod(sz), pos.div(sz)).floor().add(0.5);
        var map = Shade.Scale.linear({ domain: [0, sz], range: [-1, 1] });
        return Shade.vec(map(xy), 0, 1);
    }

    var convertActor = renderBuffer.screenActor({
        texelFunction: function(texelAccessor) {
            return Shade.Bits.encodeFloat(texelAccessor().r());
        }});
    
    var drawActor = Lux.actor({
        model: {
            type: "points",
            elements: opts.elements
        }, 
        appearance: {
            mode: Lux.DrawingMode.additive,
            color: opts.weight,
            screenPosition: binToScreen(opts.bin)
        }});
    renderBuffer.scene.add(drawActor);
    readRenderBuffer.scene.add(convertActor);

    return {
        buffer: renderBuffer,
        readBuffer: readRenderBuffer,
        binCount: opts.binCount,
        binAddress: binToTexcoord,
        binValue: Shade(function(pos) {
            return Shade.texture2D(this.buffer, this.binAddress(pos)).r();
        }),
        compute: function() {
            renderBuffer.scene.draw();
        },
        read: function() {
            readRenderBuffer.scene.draw();
            /* In a sane world, we would do this:

             var floatb = new Float32Array(sz * sz);
             ctx.readPixels(0, 0, sz, sz, ctx.RGBA, ctx.FLOAT, floatb);
             return floatb;

             or some rough equivalent. In this crazy WebGL world we
             live in, you can render to a floating point texture,
             you can fetch floating point values in texture
             samplers, but you cannot call readPixels on an FBO
             when it is bound to a floating-point texture.
             
             This upgrades GPGPU from mere torture to a
             particularly exquisite form of torture.

             So we're reduced to doing silly things like Shade.Bits.convertToFloat
             and casting to Float32Array, one channel at a time. Le sigh.

            */
            return readRenderBuffer.withBoundBuffer(function() {
                var ctx = Lux._globals.ctx;
                var buffer = new ArrayBuffer(4*sz*sz);
                var uint8 = new Uint8Array(buffer);
                ctx.readPixels(0, 0, sz, sz,
                               ctx.RGBA, ctx.unsignedByte, uint8);
                return new Float32Array(buffer);
            });
        }
    };
}

function dataBuffers()
{
    var d = Data.flowers();
    var tt = Lux.Data.textureTable(d);

    var pointIndex = Lux.attributeBuffer({ vertexArray: _.range(tt.nRows), itemSize: 1});
    
    return {
        sepalLength: tt.at(pointIndex, 0),
        sepalWidth:  tt.at(pointIndex, 1),
        petalLength: tt.at(pointIndex, 2),
        petalWidth:  tt.at(pointIndex, 3),
        species:     tt.at(pointIndex, 4),
        columns: ['sepalLength', 'sepalWidth', 'petalLength', 'petalWidth', 'species'],
        nRows: d.data.length,
        nColumns: 5
    };
}

function initWebgl()
{
    var canvas = document.getElementById("scatterplot");
    gl = Lux.init({ attributes: { alpha: true,
                                  depth: true
                                },
                    display: function() {
                        barsBatch.draw();
                    },
                    clearColor: [0, 0, 0, 0.2]
                  });
    data = dataBuffers();
    var binCount = 24;
    histo = histoBuffer({
        binCount: binCount,
        bin: Shade.Scale.linear({domain: [4, 8], range: [0, binCount]})(data.sepalLength),
        elements: data.nRows
    });
    histo.compute();

    // FIXME: compute maximum histogram height.
    // This will require texture reductions.. More GPGPU, yay

    var project = Shade(function(x) { return x.mul(2).sub(1); });

    Lux.Scene.add(Lux.Marks.alignedRects({
        elements: binCount,
        bottom: _.compose(project, function(i) { return 0; }),
        top:    _.compose(project, function(i) { return histo.binValue(i).div(30); }),
        left:   _.compose(project, function(i) { return i.div(binCount); }),
        right:  _.compose(project, function(i) { return i.add(1).div(binCount); }),
        color:  function(i) {
            return Shade.Colors.shadetable.hcl.create(0, 50, histo.binValue(i).mul(3)).asShade();
        }
    }));
}

$().ready(function() {
    initWebgl();
});
