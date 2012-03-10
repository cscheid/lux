var S = Shade;
var gl;
var sphere, sphere_prog, sphere_drawable;
var current_mode;
var current_rotation = 0;
var mvp;
var Models = Facet.Models;

//////////////////////////////////////////////////////////////////////////////

// from colorbrewer2.org
var brewer_colormap = S.Utils.lerp([
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
    var pMatrix = Facet.perspective(45, 720/480, 1.0, 100.0);
    var mvMatrix = mat4.product(Facet.translation(0, 0, -5),
                                Facet.rotation(current_rotation, [0,1,0]));
    mvp.set(mat4.product(pMatrix, mvMatrix));
    sphere_drawable[current_mode].draw();
}

function init_webgl()
{
    Facet.set_context(gl);
    mvp = S.parameter("mat4");

    sphere = Models.sphere(10, 10);

    var sphere_model_vertex = sphere.vertex;
    var position = mvp.mul(sphere_model_vertex);
    var vVal = S.per_vertex(sphere_model_vertex.swizzle("x").add(1).mul(0.5));

    var p1 = Facet.bake(sphere, { 
        position: position,
        color: S.vec(S.per_vertex(brewer_colormap(vVal)), 1)
    });

    var p2 = Facet.bake(sphere, {
        position: position,
        color: S.vec(brewer_colormap(S.per_vertex(vVal)), 1)
    });

    sphere_drawable = {
        per_vertex: p1,
        per_fragment: p2
    };
}

$().ready(function() {
    var canvas = document.getElementById("foo");
    current_mode = "per_vertex";
    $("#vp_button").click(function() {
        current_mode = "per_vertex";
    });
    $("#fp_button").click(function() {
        current_mode = "per_fragment";
    });
    gl = Facet.init(canvas,
                {
                    attributes: {
                        alpha: true,
                        depth: true
                    }
                    , debugging: true
                });

    init_webgl();
    var start = new Date().getTime();
    var f = function () {
        window.requestAnimFrame(f, canvas);
        var elapsed = new Date().getTime() - start;
        current_rotation = (elapsed / 20) * (Math.PI / 180);
        display();
    };
    f();
});
