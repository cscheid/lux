var gl;
var view_proj;
var globe;

//////////////////////////////////////////////////////////////////////////////

function draw_it()
{
    view_proj.set(mat4.product(Facet.perspective(20 / globe.zoom, 720/480, 0.1, 100.0),
                               Facet.translation(0, 0, -6)));
    globe.draw();
}

$().ready(function () {
    var canvas = document.getElementById("webgl");
    gl = Facet.init(canvas, {
        clearDepth: 1.0,
        clearColor: [0,0,0,1],
        display: draw_it,
        attributes:
        {
            alpha: true,
            depth: true
        },
        mousedown: function(event) {
            var result = globe.mousedown(event);
            return result;
        },
        mousemove: function(event) {
            var result = globe.mousemove(event);
            return result;
        },
        mouseup: function(event) {
            var result = globe.mouseup(event);
            return result;
        }
    });

    view_proj = Shade.parameter("mat4", mat4.identity());
    globe = Facet.Marks.globe({ 
        view_proj: view_proj
    });
    globe.init();

    // var f = function() {
    //     window.requestAnimFrame(f, canvas);
    //     gl.display();
    // };
    // f();
});
