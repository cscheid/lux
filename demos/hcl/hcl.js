var gl;
var hcl_batch;
var luminance_parameter, show_out_of_gamut;

//////////////////////////////////////////////////////////////////////////////

function draw_it()
{
    hcl_batch.draw();
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
    show_out_of_gamut = Shade.parameter("bool", true);
    var starting_luminance = 80;
    luminance_parameter = Shade.parameter("float", starting_luminance);
    function change_luminance() {
        var new_value = $("#luminance").slider("value") / 10.0;
        luminance_parameter.set(new_value);
        gl.display();
    };
    $("#luminance").slider({
        min: 0,
        max: 1000,
        orientation: "horizontal",
        value: starting_luminance * 10,
        slide: change_luminance,
        change: change_luminance
    });
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

    var steps = 1;
    function max3(v) {
        return Shade.max(v.r(), Shade.max(v.g(), v.b()));
    }
    function min3(v) {
        return Shade.min(v.r(), Shade.min(v.g(), v.b()));
    }
    function even_p(p) { 
        var v = Shade(p).floor().div(2);
        return v.eq(v.floor());
    };
    function xor(a, b) { return a.and(b.not()).or(b.and(a.not())); }
    function out_of_gamut(rgb) {
        var max_value = max3(rgb), min_value = min3(rgb);
        return max_value.gt(1).or(min_value.lt(0));
    }
    function out_of_gamut_pattern(rgb) {
        var x_even = even_p(Shade.fragCoord().x()),
            y_even = even_p(Shade.fragCoord().y());
        return Shade.selection(xor(x_even, y_even),
                               rgb,
                               rgb.clamp(0, 1).alpha(0.1));
    }
    var hcl_mesh = Facet.Models.mesh(steps, steps);
    var color = Shade.Colors.shadetable.hcl.create(
        hcl_mesh.tex_coord.r().mul(Math.PI*2),
        hcl_mesh.tex_coord.g().mul(100),
        luminance_parameter).as_shade(1);
    hcl_batch = Facet.bake(hcl_mesh, {
        mode: Facet.DrawingMode.over,
        position: hcl_mesh.vertex,
        color: Shade.selection(out_of_gamut(color).and(show_out_of_gamut),
                               out_of_gamut_pattern(color),
                               color)
    });

    var start = new Date().getTime();
    var f = function() {
        // window.requestAnimFrame(f, canvas);
        gl.display();
    };
    f();
});

function switch_gamut()
{
    show_out_of_gamut.set(!show_out_of_gamut.get());
    gl.display();
}
