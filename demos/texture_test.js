var S = Shade;

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
    Facet.set_context(gl);

    var tex = Facet.texture_from_image({ 
        src: "image.png",
        onload: function() {
            display();
        }
    });

    var square_model = Models.square();
    drawable = Facet.bake(square_model, {
        position: S.vec(square_model.vertex, 0, 1),
        color: S.texture2D(tex, square_model.texCoord)
    });
}

$().ready(function() {
    var canvas = document.getElementById("foo");
    gl = Facet.initGL(canvas,
                {
                    attributes: {
                        alpha: true,
                        depth: true
                    },
                    debugging: true
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
