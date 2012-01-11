var gl;
var cube_batch, pyramid_batch, strip_batch;
var model_mat;
var angle = 0;

//////////////////////////////////////////////////////////////////////////////

function draw_it()
{
    var model_cube = mat4.product(Facet.translation( 1.5, 0, 0), Facet.rotation(angle, [1,1,1]));
    var model_pyr  = mat4.product(Facet.translation(-1.5, 0, 0), Facet.rotation(angle, [0,1,0]));
    
    model_mat.set(model_cube);
    cube_batch.draw();

    model_mat.set(model_pyr);
    pyramid_batch.draw();
    strip_batch.draw();
}

$().ready(function () {
    var canvas = document.getElementById("webgl");
    var camera = Facet.Camera.perspective({
        look_at: [[0, 0, 6], [0, 0, -1], [0, 1, 0]],
        field_of_view_y: 45,
        aspect_ratio: 720/480,
        near_distance: 0.1,
        far_distance: 100
    });
    model_mat = Shade.uniform("mat4");
    gl = Facet.init(canvas, {
        clearDepth: 1.0,
        clearColor: [0,0,0,0.2],
        display: draw_it,
        attributes: {
            alpha: true,
            depth: true
        },
        debugging: true
    });

    var g = Shade.Colors.jstable.hcl.create(0,1,2).as_shade(),
        r = Shade.Colors.jstable.hcl.create(1,1,2).as_shade(),
        o = Shade.Colors.jstable.hcl.create(2,1,2).as_shade(),
        y = Shade.Colors.jstable.hcl.create(3,1,2).as_shade(),
        b = Shade.Colors.jstable.hcl.create(4,1,2).as_shade(),
        v = Shade.Colors.jstable.hcl.create(5,1,2).as_shade();

    // because we're making flat-shaded faces, we need separate
    // vertices for each "side" of the corner. So, even though there's
    // only 8 vertices in a cube, we end up with 24 of them, since we
    // need three colors per corner.

    var cube = Facet.model({
        type: "triangles",
        elements: [0,  1,  2,  0,  2,  3,
                   4,  5,  6,  4,  6,  7,
                   8,  9,  10, 8,  10, 11,
                   12, 13, 14, 12, 14, 15,
                   16, 17, 18, 16, 18, 19,
                   20, 21, 22, 20, 22, 23],
        vertex: [[ 1, 1,-1, -1, 1,-1, -1, 1, 1,  1, 1, 1,
                   1,-1, 1, -1,-1, 1, -1,-1,-1,  1,-1,-1,
                   1, 1, 1, -1, 1, 1, -1,-1, 1,  1,-1, 1,
                   1,-1,-1, -1,-1,-1, -1, 1,-1,  1, 1,-1,
                  -1, 1, 1, -1, 1,-1, -1,-1,-1, -1,-1, 1,
                   1, 1,-1,  1, 1, 1,  1,-1, 1,  1,-1,-1], 3],
        color: [g, g, g, g, o, o, o, o, r, r, r, r,
                y, y, y, y, b, b, b, b, v, v, v, v]
    });

    // For the pyramid, however, each vertex has only one color 
    // associated with it, so we can reuse the information.

    var pyramid = Facet.model({
        type: "triangles",
        elements: [0, 1, 2,
                   0, 2, 3,
                   0, 3, 4,
                   0, 4, 1],
        vertex: [[ 0,  1,  0, 
                  -1, -1,  1, 
                  -1, -1, -1,
                   1, -1, -1,
                   1, -1,  1], 3],
        color: [r, g, b, g, b]
    });

    cube_batch = Facet.bake(cube, {
        position: camera.project(model_mat.mul(Shade.vec(cube.vertex, 1))),
        color: cube.color
    });

    pyramid_batch = Facet.bake(pyramid, {
        position: camera.project(model_mat.mul(Shade.vec(pyramid.vertex, 1))),
        color: pyramid.color
    });

    var steps = 20;
    var strip_model_uv = _.range(steps+1).map(function(x) { return x / steps; });
    var strip_model_colors = strip_model_uv.map(function(x) {
        return Shade.Colors.jstable.hcl.create(x * Math.PI * 2, 100, 100).as_shade();
    });

    var params = {
        type: "triangle_strip",
        elements: 2 * (steps + 1),
        uv: [[], 2],
        color: []
    };
    var uv = params.uv[0];
    for (var i=0; i<strip_model_uv.length; ++i) {
        uv.push(strip_model_uv[i]);
        uv.push(0);
        uv.push(strip_model_uv[i]);
        uv.push(0.5);
        params.color.push(strip_model_colors[i]);
        params.color.push(strip_model_colors[i]);
    }

    var strip_model = Facet.model(params);
    var max_value = Shade.max(strip_model.color.swizzle("r"),
                              Shade.max(strip_model.color.swizzle("g"),
                                        strip_model.color.swizzle("b")));
    var min_value = Shade.min(strip_model.color.swizzle("r"),
                              Shade.min(strip_model.color.swizzle("g"),
                                        strip_model.color.swizzle("b")));
    var even_p = function(p) { 
        var v = Shade.make(p).floor().div(2);
        return v.eq(v.floor());
    };

    var x_even = even_p(Shade.fragCoord().swizzle("x")),
        y_even = even_p(Shade.fragCoord().swizzle("y"));
    function xor(a, b) { return a.and(b.not()).or(b.and(a.not())); }
    var out_of_gamut = Shade.selection(xor(x_even, y_even),
                                       strip_model.color,
                                       strip_model.color
                                       .clamp(
                                           Shade.vec(0,0,0,0),
                                           Shade.vec(1,1,1,1))
                                       .alpha(0.5));

    strip_batch = Facet.bake(strip_model, {
        mode: Facet.DrawingMode.over,
        position: Shade.vec(strip_model.uv.mul(2).sub(1), 0, 1),
        color: Shade.selection(max_value.gt(1).or(min_value.lt(0)),
                               out_of_gamut,
                               strip_model.color)
    });

    var start = new Date().getTime();
    var f = function() {
        window.requestAnimFrame(f, canvas);
        var elapsed = new Date().getTime() - start;
        angle = (elapsed / 20) * (Math.PI / 180);
        gl.display();
    };
    f();
});
