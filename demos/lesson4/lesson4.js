$().ready(function () {
    var gl = Facet.init(document.getElementById("webgl"), {
        clearColor: [0,0,0,0.2]
    });

    var square = Facet.model({
        type: "triangles",
        elements: [0, 1, 2, 0, 2, 3],
        vertex: [[-1,-1, 1,-1, 1,1, -1,1], 2]
    });
    var triangle = Facet.model({
        type: "triangles",
        elements: [0, 1, 2],
        vertex: [[0,1, -1,-1, 1,-1], 2],
        color: [Shade.color('red'),
                Shade.color('green'),
                Shade.color('blue')]
    });

    var camera = Shade.Camera.perspective({ aspect_ratio: 720/480 });
    var angle = Shade.parameter("float");

    Facet.Scene.add(Facet.bake(square, {
        position: camera(
            Shade.mul(Shade.translation(Shade.vec( 1.5, 0, -6)), 
                      Shade.rotation(angle, Shade.vec(1, 0, 0)))
                .mul(square.vertex)),
        color: Shade.color('#88f')
    }));
    Facet.Scene.add(Facet.bake(triangle, {
        position: camera(
            Shade.mul(Shade.translation(Shade.vec(-1.5, 0, -6)), 
                      Shade.rotation(angle, Shade.vec(0, 1, 0)))
                .mul(triangle.vertex)),
        color: triangle.color
    }));

    var start = new Date().getTime();
    var f = function() {
        window.requestAnimFrame(f);
        var elapsed = new Date().getTime() - start;
        angle.set((elapsed / 20) * (Math.PI/180));
        gl.display();
    };
    f();
});
