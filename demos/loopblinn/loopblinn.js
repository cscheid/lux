var gl;
var interactor;

// things to read: 
// http://www.valvesoftware.com/publications/2007/SIGGRAPH2007_AlphaTestedMagnification.pdf

//////////////////////////////////////////////////////////////////////////////

$().ready(function () {
    var canvas = document.getElementById("webgl");
    interactor = Lux.UI.centerZoomInteractor({
        width: canvas.width,
        height: canvas.height,
        center: vec.make([100, -50]),
        zoom: 0.01,
        widestZoom: 1e-6
    });

    gl = Lux.init({
        clearColor: [1,1,1,1],
        interactor: interactor
    });
    function checkerboardPattern(c1, c2) {
        function xor(a, b) { return a.and(b.not()).or(b.and(a.not())); }
        function evenP(p) { 
            var v = Shade(p).floor().div(2);
            return v.eq(v.floor());
        };
        var fc = Shade.fragCoord();
        var xEven = evenP(fc.x()), yEven = evenP(fc.y());
        return Shade.ifelse(xor(xEven, yEven), c1, c2);
    }
    Lux.Net.json("opensans.regular.json", function(font) {
        Lux.Scene.add(Lux.Text.outline({
            string: "THE QUICK BROWN FOX\nJUMPS OVER THE LAZY DOG.\nfive boxing wizards\njump quickly.\n0123456789",
            font: font,
            color: function(p) { 
                return checkerboardPattern(Shade.color("red"), Shade.color("black"));
            }
        }));
    });
});
