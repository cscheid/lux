$().ready(function() {
    var gl = Lux.init();
    Lux.Geometry.PLY.load('dragon_vrip_res2.ply', function(obj) {
        var position_array = new Float32Array(obj.content.vertex);
        var position = Lux.attribute_buffer({
            vertex_array: position_array,
            item_size: 3
        });
        
        var cx = 0, cy = 0, cz = 0;
        for (var i=0; i<position_array.length/3; ++i) {
            cx += position_array[3*i];
            cy += position_array[3*i+1];
            cz += position_array[3*i+2];
        }
        cx /= position_array.length/3;
        cy /= position_array.length/3;
        cz /= position_array.length/3;
        var elements = Lux.element_buffer(obj.content.face);
        var camera = Shade.Camera.perspective({
            look_at: [Shade.vec(0,0,0.5), Shade.vec(0,0,0), Shade.vec(0, 1, 0)]
        });
        // var light_position = Shade.vec(0, 3, 8);
        // var ambient_light = Shade.Light.ambient({ 
        //     color: Shade.vec(0.3, 0.3, 0.3)
        // });
        // var diffuse_light = Shade.Light.diffuse({
        //     position: light_position,
        //     color: Shade.light(1, 0.9, 0.8)
        // });
        var dragon_model = Lux.model({
            position: Shade.rotation(gl.parameters.now, Shade.vec(0,1,0))
                     (Shade.translation(Shade.vec(-cx, -cy, -cz)))
                     (Shade.vec(position, 1)),
            elements: elements
        });
        Lux.Scene.add(Lux.bake(dragon_model, {
            position: camera(dragon_model.position),
            color: Shade.color("red")
        }));
        Lux.Scene.animate();
    });
    Lux.Scene.invalidate();
});
