var gl;
var cube, pyramid;
var angle;
// Shade.debug = true;

//////////////////////////////////////////////////////////////////////////////

function drawIt()
{
    cube.draw();
    pyramid.draw();
}

$().ready(function () {
    var canvas = document.getElementById("webgl");
    var camera = Shade.Camera.perspective({
        lookAt: [Shade.vec(0, 0, 6), Shade.vec(0, 0, -1), Shade.vec(0, 1, 0)],
        fieldOfViewY: 45,
        aspectRatio: 720/480,
        nearDistance: 4,
        farDistance: 10
    });
    angle = Shade.parameter("float");
    gl = Lux.init({
        clearDepth: 1.0,
        clearColor: [0,0,0,0.2],
        display: drawIt,
        attributes: {
            alpha: true,
            depth: true,
            preserveDrawingBuffer: true
        },
        mousedown: function(event) {
            Lux.Unprojector.drawUnprojectScene();
            var r = Lux.Unprojector.unproject(event.luxX, event.luxY);
            $("#pickresult").html(String(r));
        }
    });

    var g = Shade.color('green'),
        r = Shade.color('red'),
        o = Shade.color('orange'),
        y = Shade.color('yellow'),
        b = Shade.color('blue'),
        v = Shade.color('violet');

    // because we're making flat-shaded faces, we need separate
    // vertices for each "side" of the corner. So, even though there's
    // only 8 vertices in a cube, we end up with 24 of them, since we
    // need three colors per corner.

    var cubeModel = Lux.model({
        type: "triangles",
        elements: [0,  1,  2,  0,  2,  3,
                   4,  5,  6,  4,  6,  7,
                   8,  9,  10, 8,  10, 11,
                   12, 13, 14, 12, 14, 15,
                   16, 17, 18, 16, 18, 19,
                   20, 21, 22, 20, 22, 23],
        vertex: [[ 1, 1,-1, -1, 1,-1, -1, 1, 1,  1, 1, 1,
                   1,-1, 1, -1,-1, 1, -1,-1,-1,  1,-1,-1,
                   1, 1, 1, -1, 1, 1, -1,-1, 1,  1,-1, 1,
                   1,-1,-1, -1,-1,-1, -1, 1,-1,  1, 1,-1,
                  -1, 1, 1, -1, 1,-1, -1,-1,-1, -1,-1, 1,
                   1, 1,-1,  1, 1, 1,  1,-1, 1,  1,-1,-1], 3],
        color: [g, g, g, g, o, o, o, o, r, r, r, r,
                y, y, y, y, b, b, b, b, v, v, v, v]
    });

    // For the pyramid, however, each vertex has only one color 
    // associated with it, so we can reuse the information.

    var pyramidModel = Lux.model({
        type: "triangles",
        elements: [0, 1, 2,
                   0, 2, 3,
                   0, 3, 4,
                   0, 4, 1],
        vertex: [[ 0,  1,  0, 
                  -1, -1,  1, 
                  -1, -1, -1,
                   1, -1, -1,
                   1, -1,  1], 3],
        color: [r, g, b, g, b]
    });

    // one id per face of the cube
    var ids = Lux.idBuffer([1,1,1,1,2,2,2,2,3,3,3,3,
                               4,4,4,4,5,5,5,5,6,6,6,6]);
    var cubeXformedVertex = Shade.translation(Shade.vec(1.5, 0, 0))
        .mul(Shade.rotation(angle, Shade.vec(1,1,1)))
        .mul(cubeModel.vertex);

    var pyramidXformedVertex = Shade.translation(Shade.vec(-1.5, 0, 0))
        .mul(Shade.rotation(angle, Shade.vec(0,1,0)))
        .mul(pyramidModel.vertex);

    Lux.Scene.add(Lux.actor({
        appearance: {
            position: camera(cubeXformedVertex),
            color: cubeModel.color,
            pickId: ids
        }, model: cubeModel
    }));

    Lux.Scene.add(Lux.actor({
        appearance: {
            position: camera(pyramidXformedVertex),
            color: pyramidModel.color,
            pickId: Shade.id(7)
        }, model: pyramidModel
    }));

    var start = new Date().getTime();
    Lux.Scene.animate(function() {
        var elapsed = new Date().getTime() - start;
        angle.set((elapsed / 20) * (Math.PI / 180));
    });
    
    // cube = Lux.bake(cubeModel, {
    // });

    // pyramid = Lux.bake(pyramidModel, {
    //     position: camera(pyramidXformedVertex),
    //     color: pyramidModel.color,
    //     pickId: Shade.id(7)
    // });

    // var start = new Date().getTime();
    // var f = function() {
    //     window.requestAnimationFrame(f, canvas);
    //     var elapsed = new Date().getTime() - start;
    //     angle.set((elapsed / 20) * (Math.PI / 180));
    //     gl.display();
    // };
    // f();
});
