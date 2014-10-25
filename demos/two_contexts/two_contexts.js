$().ready(function () {
    function createScene(canvasId) {
        var canvas = document.getElementById(canvasId);
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
        
        var globeZoom = Shade.parameter("float", 3.0);
        var viewProj = Shade.Camera.perspective({
            lookAt: [Shade.vec(0, 0,  6),
                      Shade.vec(0, 0, -1),
                      Shade.vec(0, 1,  0)],
            fieldOfViewY: Shade.div(20, globeZoom)
        });
        
        var globe = Lux.Marks.globe({ 
            viewProj: viewProj,
            zoom: globeZoom
        });
        
        Lux.Scene.add(globe);
        return ctx;
    }

    createScene("webgl1");
    createScene("webgl2");
});
