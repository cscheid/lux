var luminanceParameter, showOutOfGamut;

//////////////////////////////////////////////////////////////////////////////

$().ready(function () {
    initUi();

    showOutOfGamut = Shade.parameter("bool", true);
    var gl = Lux.init();

    function max3(v) {
        return Shade.max(v.r(), Shade.max(v.g(), v.b()));
    }
    function min3(v) {
        return Shade.min(v.r(), Shade.min(v.g(), v.b()));
    }
    function evenP(p) { 
        var v = Shade(p).floor().div(2);
        return v.eq(v.floor());
    };
    function xor(a, b) { return a.and(b.not()).or(b.and(a.not())); }
    function outOfGamut(rgb) {
        var maxValue = max3(rgb), minValue = min3(rgb);
        return maxValue.gt(1).or(minValue.lt(0));
    }
    function outOfGamutPattern(rgb) {
        var xEven = evenP(Shade.fragCoord().x()),
            yEven = evenP(Shade.fragCoord().y());
        return Shade.ifelse(xor(xEven, yEven),
                            rgb,
                            rgb.clamp(0, 1).alpha(0.1));
    }
    var hclMesh = Lux.Models.mesh(1, 1);
    var color = Shade.Colors.hcl(
        hclMesh.texCoord.r().mul(Math.PI*2),
        hclMesh.texCoord.g().mul(100),
        luminanceParameter);
    Lux.Scene.add(Lux.actor({
        model: hclMesh,
        appearance: {
            mode: Lux.DrawingMode.over,
            position: hclMesh.vertex,
            color: Shade.ifelse(outOfGamut(color).and(showOutOfGamut),
                                outOfGamutPattern(color),
                                color)}}));
});

function switchGamut()
{
    showOutOfGamut.set(!showOutOfGamut.get());
    Lux.Scene.invalidate();
}

function initUi()
{
    var startingLuminance = 80;
    luminanceParameter = Shade.parameter("float", startingLuminance);
    function changeLuminance() {
        var newValue = $("#luminance").slider("value") / 10.0;
        luminanceParameter.set(newValue);
        Lux.Scene.invalidate();
    };
    $("#luminance").slider({
        min: 0,
        max: 1000,
        orientation: "horizontal",
        value: startingLuminance * 10,
        slide: changeLuminance,
        change: changeLuminance
    });
}
