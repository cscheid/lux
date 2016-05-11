var gl;
var angleY = Shade.parameter("float", 0.0);
var angleX = Shade.parameter("float", 0.0);
var camera, modelXform, viewXform;
var uParameter, vParameter, tParameter;
var mesh;

$().ready(function () {
    var prevMousePos;
    gl = Lux.init({
        clearColor: [0,0,0,0.2],
        mousedown: function(event) {
            prevMousePos = [event.offsetX, event.offsetY];
        }, mousemove: function(event) {
            if ((event.which & 1) && !event.shiftKey) {
                var deltaX =  (event.offsetX - prevMousePos[0]) / gl.viewportHeight;
                var deltaY =  (event.offsetY - prevMousePos[1]) / gl.viewportHeight;
                angleX.set(angleX.get() + deltaX); 
                angleY.set(angleY.get() + deltaY); 
                prevMousePos = [event.offsetX, event.offsetY];
                Lux.Scene.invalidate();
            }
        }
    });

    camera = Shade.Camera.perspective();
    modelXform = 
        Shade.rotation(angleX, Shade.vec(0,1,0))
       (Shade.rotation(angleY, Shade.vec(1,0,0)));
    viewXform = Shade.translation(0, 0, -10);

    mesh = Lux.Models.mesh(100, 100);
    tParameter = Shade.parameter("float", 0);

    updateMesh();

    var startTime = (new Date().getTime()) / 1000;
    Lux.Scene.animate(function() {
        var thisTime = (new Date().getTime()) / 1000;
        var elapsed = thisTime - startTime;
        tParameter.set(elapsed);
    });
});

var currentActor;
function createMesh(position, normal, color)
{
    if (currentActor) {
        Lux.Scene.remove(currentActor);
    }

    var finalColor = Shade.glLight({
        lightPosition: Shade.vec(0,0,2),
        materialColor: color,
        lightAmbient: Shade.vec(0.1, 0.1, 0.1, 1.0),
        lightDiffuse: Shade.color("white"),
        vertex: modelXform(position),
        normal: modelXform(normal),
        twoSided: true
    });
    currentActor = Lux.actor({
        model: mesh, 
        appearance: {
            position: camera(viewXform)(modelXform)(position),
            color: finalColor
        }});
    Lux.Scene.add(currentActor);
}

function parseExpression(v)
{
    return peg_parser.parse(v);
}


function updateMesh()
{
    // wow, this is ugly.

    uParameter = mesh.texCoord.x();
    vParameter = mesh.texCoord.y();
    var x = parseExpression($("#x").val());
    var y = parseExpression($("#y").val());
    var z = parseExpression($("#z").val());
    var color = parseExpression($("#color").val());
    if (_.isUndefined(x) ||
        _.isUndefined(y) ||
        _.isUndefined(z) ||
        _.isUndefined(color))
        return;

    uParameter = mesh.texCoord.x().add(0.01);
    var xu = parseExpression($("#x").val());
    var yu = parseExpression($("#y").val());
    var zu = parseExpression($("#z").val());

    uParameter = mesh.texCoord.x();
    vParameter = mesh.texCoord.y().add(0.01);
    var xv = parseExpression($("#x").val());
    var yv = parseExpression($("#y").val());
    var zv = parseExpression($("#z").val());

    uParameter = mesh.texCoord.x();
    vParameter = mesh.texCoord.y();

    var position = Shade.vec(x, y, z);
    var du = Shade.vec(xu,yu,zu).sub(Shade.vec(position)).div(0.01);
    var dv = Shade.vec(xv,yv,zv).sub(Shade.vec(position)).div(0.01);
    var normal = du.cross(dv).normalize();
    createMesh(position, normal, color);
}
