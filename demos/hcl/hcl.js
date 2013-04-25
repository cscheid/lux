var luminance_parameter, show_out_of_gamut;

//////////////////////////////////////////////////////////////////////////////

$().ready(function () {
    init_ui();

    show_out_of_gamut = Shade.parameter("bool", true);
    var gl = Lux.init();

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
        return Shade.ifelse(xor(x_even, y_even),
                            rgb,
                            rgb.clamp(0, 1).alpha(0.1));
    }
    var hcl_mesh = Lux.Models.mesh(1, 1);
    var color = Shade.Colors.hcl(
        hcl_mesh.tex_coord.r().mul(Math.PI*2),
        hcl_mesh.tex_coord.g().mul(100),
        luminance_parameter);
    Lux.Scene.add(Lux.bake(hcl_mesh, {
        mode: Lux.DrawingMode.over,
        position: hcl_mesh.vertex,
        color: Shade.ifelse(out_of_gamut(color).and(show_out_of_gamut),
                            out_of_gamut_pattern(color),
                            color)
    }));
});

function switch_gamut()
{
    show_out_of_gamut.set(!show_out_of_gamut.get());
    Lux.Scene.invalidate();
}

function init_ui()
{
    var starting_luminance = 80;
    luminance_parameter = Shade.parameter("float", starting_luminance);
    function change_luminance() {
        var new_value = $("#luminance").slider("value") / 10.0;
        luminance_parameter.set(new_value);
        Lux.Scene.invalidate();
    };
    $("#luminance").slider({
        min: 0,
        max: 1000,
        orientation: "horizontal",
        value: starting_luminance * 10,
        slide: change_luminance,
        change: change_luminance
    });
}
