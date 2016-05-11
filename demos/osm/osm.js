$().ready(function () {
    var canvas = document.getElementById("webgl");
    var gl = Lux.init({
        clearColor: [0,0,0,0.1],
        mousedown: function(event) { return globe.mousedown(event); },
        mousemove: function(event) { return globe.mousemove(event); },
        mouseup:   function(event) { return globe.mouseup(event); }
    });

    var globeZoom = Shade.parameter("float", 1.0);
    var perspectiveScene = Lux.Scene.Transform.Camera.perspective({
        lookAt: [Shade.vec(0, 0,  6),
                 Shade.vec(0, 0, -1),
                 Shade.vec(0, 1,  0)],
        fieldOfViewY: Shade.div(20, globeZoom)
    });

    var globe = Lux.Marks.globe({ 
        zoom: globeZoom
    });

    Lux.Scene.add(perspectiveScene);
    perspectiveScene.add(globe);
});
