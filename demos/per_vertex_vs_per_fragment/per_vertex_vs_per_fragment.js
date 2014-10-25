var S = Shade;
var gl;
var sphere, sphereProg, sphereDrawable;
var currentMode;
var currentRotation = 0;
var mvp;
var Models = Lux.Models;

//////////////////////////////////////////////////////////////////////////////

// from colorbrewer2.org
var brewerColormap = S.Utils.lerp([
    S.vec(140/255, 81/255, 10/255),
    S.vec(191/255, 129/255, 45/255),
    S.vec(223/255, 194/255, 125/255),
    S.vec(246/255, 232/255, 195/255),
    S.vec(1,0,0), //S.vec(245/255, 245/255, 245/255),
    S.vec(199/255, 234/255, 229/255),
    S.vec(128/255, 205/255, 193/255),
    S.vec(53/255, 151/255, 143/255),
    S.vec(1/255, 102/255, 94/255)
]);

function display()
{
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clearDepth(1.0);
    gl.clearColor(0,0,0,0.5);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.depthFunc(gl.LESS);
    gl.enable(gl.DEPTH_TEST);

    // ortho(-5, 5, -5, 5, -5, 5);
    var pMatrix = Lux.perspective(45, 720/480, 1.0, 100.0);
    var mvMatrix = mat4.product(Lux.translation(0, 0, -5),
                                Lux.rotation(currentRotation, [0,1,0]));
    mvp.set(mat4.product(pMatrix, mvMatrix));
    sphereDrawable[currentMode].draw();
}

function initWebgl()
{
    mvp = S.parameter("mat4");

    sphere = Models.sphere(10, 10);

    var sphereModelVertex = sphere.vertex;
    var position = mvp.mul(sphereModelVertex);
    var vVal = S.perVertex(sphereModelVertex.swizzle("x").add(1).mul(0.5));

    var p1 = Lux.bake(sphere, { 
        position: position,
        color: S.vec(S.perVertex(brewerColormap(vVal)), 1)
    });

    var p2 = Lux.bake(sphere, {
        position: position,
        color: S.vec(brewerColormap(S.perVertex(vVal)), 1)
    });

    sphereDrawable = {
        perVertex: p1,
        perFragment: p2
    };
}

$().ready(function() {
    var canvas = document.getElementById("foo");
    currentMode = "per_vertex";
    $("#vp_button").click(function() {
        currentMode = "per_vertex";
    });
    $("#fp_button").click(function() {
        currentMode = "per_fragment";
    });
    gl = Lux.init();
    initWebgl();
    var start = new Date().getTime();
    var f = function () {
        window.requestAnimationFrame(f, canvas);
        var elapsed = new Date().getTime() - start;
        currentRotation = (elapsed / 20) * (Math.PI / 180);
        display();
    };
    f();
});
