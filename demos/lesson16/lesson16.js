/*
 * FIXME THIS LESSON USES REALLY ANCIENT LUX STYLE
 * 
 * It works, but it reflects in no way how you should write Lux code.
 */

var gl;
var cubeDrawable, pyramidDrawable;
var mv;
var proj;
var angle = 0;
var cubeModel;
var lightAmbient = Shade.color('gray');
var lightDiffuse = Shade.color('white');
var lightPosition = Shade.vec(0, 0, 2);
var Models = Lux.Models;

var matAmbient = Shade.vec(0.2, 0.2, 0.2, 1);
var backgroundColor = Shade.vec(0.5, 0.5, 0.5, 1).mul(0.5);

//////////////////////////////////////////////////////////////////////////////

function makeFogger(kind)
{
    if (kind === "linear") {
        return function(color, eyeVertex) {
            return Shade.glFog({ 
                z: eyeVertex.at(2),
                start: -4,
                end: -7,
                mode: "linear",
                fogColor: backgroundColor,
                color: color
            });
        };
    } else if (kind === "exp") {
        return function(color, eyeVertex) {
            return Shade.glFog({
                z: eyeVertex.at(2),
                start: -5,
                mode: "exp",
                fogColor: backgroundColor,
                color: color
            });
        };
    } else if (kind === "exp2") {
        return function(color, eyeVertex) {
            return Shade.glFog({ 
                z: eyeVertex.at(2),
                start: -4,
                density: 1,
                mode: "exp2",
                fogColor: backgroundColor,
                color: color
            });
        };
    } else throw "Unknown fog kind";
};

function createCubeDrawable(opts)
{
    var materialColor = Shade.texture2D(Lux.texture({ 
        src: "../img/crate.jpg",
        magFilter: gl.LINEAR,
        minFilter: gl.LINEAR_MIPMAP_NEAREST,
        mipmaps: true
    }), cubeModel.texCoord);

    opts = _.defaults(opts, { 
        lighting: false,
        fogger: function (c, e) { return c; } 
    });

    var finalColor;
    if (opts.lighting) {
        var mat3 = Shade.mat3(mv);
        finalColor = Shade.glLight({
            lightPosition: lightPosition,
            vertex: mat3.mul(cubeModel.vertex),
            materialColor: materialColor,
            lightAmbient: lightAmbient,
            lightDiffuse: lightDiffuse,
            normal: mat3.mul(cubeModel.normal.normalize())
        });
    } else {
        finalColor = materialColor;
    }

    var mvp = proj.mul(mv);
    var eyeVertex = mv.mul(Shade.vec(cubeModel.vertex, 1));
    return Lux.bake(cubeModel, {
        position: proj.mul(eyeVertex),
        color: opts.fogger(finalColor, eyeVertex)
    });
}

function drawIt()
{
    var modelCube = Lux.rotation(angle, [1,1,1]);
    var view       = Lux.translation(0.0, 0.0, -6.0);
    gl.clear(gl.depthBufferBit | gl.colorBufferBit);
    gl.enable(gl.depthTest);
    gl.depthFunc(gl.LESS);
    mv.set(mat4.product(view, modelCube));
    proj.set(Lux.perspective(45, 720/480, 0.1, 100.0));
    cubeDrawable.draw();
}

$().ready(function () {
    var canvas = document.getElementById("webgl");

    gl = Lux.init({
        clearDepth: 1.0,
        clearColor: backgroundColor,
        display: drawIt,
        attributes: {
            alpha: true,
            depth: true
        }
    });
    cubeModel = Models.flatCube();

    mv = Shade.parameter("mat4");
    proj = Shade.parameter("mat4");

    cubeDrawable = createCubeDrawable({ lighting: true,
                                        fogger: makeFogger("linear")
                                      });

    var start = new Date().getTime();
    var f = function() {
        window.requestAnimationFrame(f, canvas);
        var elapsed = new Date().getTime() - start;
        angle = (elapsed / 20) * (Math.PI/180);
        gl.display();
    };
    f();
});
