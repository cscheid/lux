var S = Shade;
var Models = Lux.Models;

var gl;
var drawable;
var alive = true;

//////////////////////////////////////////////////////////////////////////////

function display()
{
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clearDepth(1.0);
    gl.clearColor(1,0,1,1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    drawable.draw();
}

function init_webgl()
{
    Lux.set_context(gl);

    var tex = Lux.texture({ 
        src: "image.png",
        onload: function() {
            display();
        }
    });

    var square_model = Models.square();
    drawable = Lux.bake(square_model, {
        position: square_model.vertex,
        color: S.texture2D(tex, square_model.tex_coord)
    });
}

$().ready(function() {
    var canvas = document.getElementById("foo");
    gl = Lux.init(canvas,
                {
                    attributes: {
                        alpha: true,
                        depth: true
                    }
                });
    init_webgl();
    var start = new Date().getTime();
    var f = function () {
        if (alive) {
            window.requestAnimFrame(f, canvas);
        }
        display();
    };
    f();
});
