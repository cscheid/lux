var S = Shade;

var gl;
var data;
var points_batch;
var alive = false;
var histo;

//////////////////////////////////////////////////////////////////////////////

function histo_buffer(opts)
{
    opts = _.defaults(opts || {}, {
        bin_count: 64,
        weight: Shade.vec(1,1,1,1)
    });
    if (_.isUndefined(opts.bin)) {
        throw "histo_buffer requires 'bin' field";
    }
    opts.bin = Shade.make(opts.bin);

    var sz = Math.ceil(Math.sqrt(opts.bin_count));

    var ctx = Facet._globals.ctx;
    var render_buffer = Facet.render_buffer({
        width: sz,
        height: sz,
        type: ctx.FLOAT // enable render to floating-point texture
    });
    var read_render_buffer = Facet.render_buffer({
        width: sz,
        height: sz
    });

    function bin_to_texcoord(pos) {
        var y = pos.div(sz).floor().add(0.5/sz);
        var x = pos.mod(sz).add(0.5/sz);
        var map = Shade.Utils.linear(0, sz, 0, 1);
        return Shade.vec(map(x), map(y));
    }
    function bin_to_screen(pos) {
        var y = pos.div(sz).floor().add(0.5/sz);
        var x = pos.mod(sz).add(0.5/sz);
        var map = Shade.Utils.linear(0, sz, -1, 1);
        return Shade.vec(map(x), map(y), 0, 1);
    }

    var convert_batch = render_buffer.make_screen_batch(function(texel) {
        return Shade.Bits.encode_float(texel.r());
    });
    
    var batch = Facet.bake({
        type: "points",
        elements: opts.elements
    }, {
        mode: Facet.DrawingMode.additive,
        color: opts.weight,
        position: bin_to_screen(opts.bin)
    });

    return {
        buffer: render_buffer,
        read_buffer: read_render_buffer,
        bin_count: opts.bin_count,
        bin_address: bin_to_texcoord,
        bin_value: Shade.make(function(pos) {
            return Shade.texture2D(this.buffer, this.bin_address(pos)).r();
        }),
        compute: function() {
            render_buffer.with_bound_buffer(function() {
                var ctx = Facet._globals.ctx;
                ctx.clearColor(0,0,0,0);
                ctx.clear(ctx.COLOR_BUFFER_BIT);
                batch.draw();
            });
        },
        read: function() {
            return read_render_buffer.with_bound_buffer(function() {
                var ctx = Facet._globals.ctx;
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

                So we're reduced to doing silly things like Shade.Bits.convert_to_float
                and casting to Float32Array, one channel at a time. Le sigh.

                */

                convert_batch.draw();
                var buffer = new ArrayBuffer(4*sz*sz);
                var uint8 = new Uint8Array(buffer);
                ctx.readPixels(0, 0, sz, sz,
                               ctx.RGBA, ctx.UNSIGNED_BYTE, uint8);
                return new Float32Array(buffer);
            });
        }
    };
}

function data_buffers()
{
    var d = Data.flowers();
    var tt = Facet.Data.texture_table(d);
    var point_index = Facet.attribute_buffer(_.range(tt.n_rows), 1);
    
    return {
        sepalLength: tt.at(point_index, 0),
        sepalWidth:  tt.at(point_index, 1),
        petalLength: tt.at(point_index, 2),
        petalWidth:  tt.at(point_index, 3),
        species:     tt.at(point_index, 4),
        columns: ['sepalLength', 'sepalWidth', 'petalLength', 'petalWidth', 'species'],
        n_rows: d.data.length,
        n_columns: 5
    };
}

function init_webgl()
{
    var canvas = document.getElementById("scatterplot");
    gl = Facet.init(canvas, { attributes: { alpha: true,
                                            depth: true
                                          },
                              debugging: true,
                              display: function() {
                                  points_batch.draw();
                              },
                              clearColor: [0, 0, 0, 0.2]
                            });
    Facet.set_context(gl);
    data = data_buffers();
    var bin_count = 16;
    histo = histo_buffer({
        bin_count: bin_count,
        bin: Shade.Utils.linear(5, 8, 0, 16)(data.sepalLength),
        elements: data.n_rows
    });
    histo.compute();

    // FIXME: compute maximum histogram height.
    // This will require texture reductions.. More GPGPU, yay

    //////////////////////////////////////////////////////////////////////////
    // This is like a poor man's instancing/geometry shader. I need an API for it.

    var vertex_index = Facet.attribute_buffer(_.range(bin_count * 6), 1);
    var bin_index = Shade.div(vertex_index, 6).floor();
    var which_vertex = Shade.mod(vertex_index, 6);

    var bin_value = histo.bin_value(bin_index);
    var bar_height = bin_value.div(20);
    
    var bottom = 0, 
        top = bar_height,
        left = Shade.div(bin_index, bin_count), 
        right = Shade.div(bin_index.add(1), bin_count);

    var lower_left  = Shade.vec(left, bottom);
    var lower_right = Shade.vec(right, bottom);
    var upper_left  = Shade.vec(left, top);
    var upper_right = Shade.vec(right, top);
    var vertex_map  = Shade.array([lower_left, upper_right, upper_left,
                                   lower_left, lower_right, upper_right]);

    points_batch = Facet.bake({
        type: "triangles",
        elements: vertex_index
    }, {
        color: Shade.Colors.shadetable.hcl.create(0, 50, bin_value.mul(5)).as_shade(),
        position: Shade.vec(vertex_map.at(which_vertex).mul(2).sub(1), 0, 1)
    });
}

$().ready(function() {
    init_webgl();
    var start = new Date().getTime();
    var f = function () {
        if (alive) {
            window.requestAnimFrame(f, canvas);
        }
        gl.display();
    };
    f();
});
