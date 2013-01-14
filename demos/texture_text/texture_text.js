var gl;
var interactor;

// things to read: 
// http://www.valvesoftware.com/publications/2007/SIGGRAPH2007_AlphaTestedMagnification.pdf

//////////////////////////////////////////////////////////////////////////////

$().ready(function () {
    var canvas = document.getElementById("webgl");
    interactor = Facet.UI.center_zoom_interactor({
        width: canvas.width,
        height: canvas.height,
        center: vec.make([1, -0.2]) 
       // zoom: 0.01,
        // widest_zoom: 1e-6
    });

    gl = Facet.init(canvas, {
        clearColor: [1,1,1,1],
        interactor: interactor
    });
    function checkerboard_pattern(c1, c2) {
        function xor(a, b) { return a.and(b.not()).or(b.and(a.not())); }
        function even_p(p) { 
            var v = Shade(p).floor().div(2);
            return v.eq(v.floor());
        };
        var fc = Shade.fragCoord();
        var x_even = even_p(fc.x()), y_even = even_p(fc.y());
        return Shade.ifelse(xor(x_even, y_even), c1, c2);
    }

    var is_screen_right = Shade.fragCoord().x().gt(gl.parameters.width.div(2));

    Facet.Net.json("opensans.regular.json", function(font) {
        Facet.Scene.add(Facet.Text.texture({
            string: "The quick brown fox jumps\nover the lazy dog.\nFive boxing wizards\njump quickly.",
            font: font,
            size: 0.1,
            compensate_blur: is_screen_right,
            position: function(p) { return interactor.camera(p); },
            color: function(p) { return is_screen_right.ifelse(Shade.color("teal"), Shade.color("#ff8080")); }
        }));
    });
});
