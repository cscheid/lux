$().ready(function () {
    var canvas = document.getElementById("webgl");
    var gl = Lux.init({
        clearColor: [0,0,0,0.1],
        mousedown: function(event) { return globe.mousedown(event); },
        mousemove: function(event) { return globe.mousemove(event); },
        mouseup:   function(event) { return globe.mouseup(event); }
    });

    var globe_zoom = Shade.parameter("float", 1.0);
    var perspective_scene = Lux.Scene.Transform.Camera.perspective({
        look_at: [Shade.vec(0, 0,  6),
                  Shade.vec(0, 0, -1),
                  Shade.vec(0, 1,  0)],
        field_of_view_y: Shade.div(20, globe_zoom)
    });

    var globe = Lux.Marks.globe({ 
        zoom: globe_zoom
    });

    Lux.Scene.add(perspective_scene);
    perspective_scene.add(globe);
});
