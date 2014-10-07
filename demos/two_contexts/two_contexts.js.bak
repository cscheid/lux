$().ready(function () {
    function create_scene(canvas_id) {
        var canvas = document.getElementById(canvas_id);
        var ctx = Lux.init({
            canvas: canvas,
            clearColor: [0,0,0,0.1],
            mousedown: function(event) {
                var result = globe.mousedown(event);
                return result;
            },
            mousemove: function(event) {
                var result = globe.mousemove(event);
                return result;
            },
            mouseup: function(event) {
                var result = globe.mouseup(event);
                return result;
            }
        });
        
        var globe_zoom = Shade.parameter("float", 3.0);
        var view_proj = Shade.Camera.perspective({
            look_at: [Shade.vec(0, 0,  6),
                      Shade.vec(0, 0, -1),
                      Shade.vec(0, 1,  0)],
            field_of_view_y: Shade.div(20, globe_zoom)
        });
        
        var globe = Lux.Marks.globe({ 
            view_proj: view_proj,
            zoom: globe_zoom
        });
        
        Lux.Scene.add(globe);
        return ctx;
    }

    create_scene("webgl1");
    create_scene("webgl2");
});
