var S = Shade;
var gl;
var sphere, sphereProg, sphereDrawable;
var currentMode;
var currentRotation = 0;
var perVertex;
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

function initWebgl()
{
    mvp = S.parameter("mat4");
    perVertex = S.parameter("bool", true);

    sphere = Models.sphere(10, 10);

    var sphereModelVertex = sphere.vertex;
    var position = mvp.mul(sphereModelVertex);
    var val = sphereModelVertex.swizzle("x").add(1).mul(0.5);
    var vVal = S.perVertex(val);

    var col = S.ifelse(perVertex,
                       S.vec(S.perVertex(brewerColormap(vVal)), 1),
                       S.vec(brewerColormap(val), 1));

    Lux.Scene.add(Lux.actor({
        model: sphere,
        appearance: {
            position: position,
            color: col }}));
}

$().ready(function() {
    var canvas = document.getElementById("foo");
    currentMode = "per_vertex";
    $("#vp_button").click(function() { perVertex.set(true); });
    $("#fp_button").click(function() { perVertex.set(false); });
    gl = Lux.init();
    initWebgl();
    var pMatrix = Lux.perspective(45, 720/480, 1.0, 100.0);
    var mvMatrix = mat4.product(Lux.translation(0, 0, -5),
                                Lux.rotation(currentRotation, [0,1,0]));
    mvp.set(mat4.product(pMatrix, mvMatrix));
    var start = new Date().getTime();
    Lux.Scene.animate(function() {
        var elapsed = new Date().getTime() - start;
        currentRotation = (elapsed / 20) * (Math.PI / 180);
        var mvMatrix = mat4.product(Lux.translation(0, 0, -5),
                                    Lux.rotation(currentRotation, [0,1,0]));
        mvp.set(mat4.product(pMatrix, mvMatrix));
    });
});
