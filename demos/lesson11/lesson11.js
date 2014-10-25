/*
 * FIXME THIS LESSON USES REALLY ANCIENT LUX STYLE
 * 
 * It works, but it reflects in no way how you should write Lux code.
 */

var gl;
var flag;
var mvp;
var phase = 0;

var currentMouseX = 0;
var currentMouseY = 0;

//////////////////////////////////////////////////////////////////////////////

var model = mat4.product(Lux.translation(0.0, 0.0, -4.0),
                         Lux.rotation(-40 * Math.PI / 180, [1, 0, 0]));

function drawIt()
{
    var proj = Lux.perspective(45, 720/480, 0.1, 100.0);
    var view = mat4.lookAt([currentMouseX, currentMouseY, 0], 
                           [0, 0, -3], [0,1,0]);
    mvp.set(mat4.product(proj, mat4.product(view, model)));
    flag.draw();
}

$().ready(function () {
    var canvas = document.getElementById("webgl");

    gl = Lux.init({
        clearDepth: 1.0,
        clearColor: [0,0,0,0.2],
        display: drawIt,
        attributes:
        {
            alpha: true,
            depth: true
        },
        mousemove: function(event) {
            currentMouseX = (event.offsetX / 720) - 0.5;
            currentMouseY = (event.offsetY / 480) - 0.5;
        }
    });

    var mesh = Lux.Models.mesh(50, 2);

    mvp = Shade.parameter("mat4");
    phase = Shade.parameter("float");
    var texture = Lux.texture({ src: "../img/sunflower.jpg" });

    flag = Lux.conditionalBatch(
        Lux.bake(mesh, {
            position: mvp.mul(Shade.vec(mesh.vertex, Shade.sin(mesh.texCoord.at(0).mul(20).add(phase)).mul(0.08), 1)),
            color: Shade.texture2D(texture, mesh.texCoord)
        }), function() {
            return texture.ready;
        });

    var start = new Date().getTime();
    var f = function() {
        window.requestAnimationFrame(f, canvas);
        var elapsed = new Date().getTime() - start;
        phase.set((elapsed / 3) * (Math.PI/180));
        gl.display();
    };
    f();
});
