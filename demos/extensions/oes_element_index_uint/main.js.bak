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
        var light_position = Shade.vec(0, 3, 8);
        var ambient_light = Shade.Light.ambient({ 
            color: Shade.vec(0.2, 0.2, 0.2)
        });
        var diffuse_light = Shade.Light.diffuse({
            position: light_position,
            color: Shade.vec(0.7, 0.6, 0.5)
        });
        var dragon_model = Lux.model({
            position: Shade.rotation(gl.parameters.now, Shade.vec(0,1,0))
                     (Shade.translation(Shade.vec(-cx, -cy, -cz)))
                     (Shade.vec(position, 1)),
            elements: elements
        });
        var material = {
            position: dragon_model.position,
            normal: Shade.ThreeD.normal(dragon_model.position),
            color: Shade.color("red")
        };
        Lux.Scene.add(Lux.actor({
            model: dragon_model, 
            appearance: {
                position: camera(dragon_model.position),
                color: diffuse_light(material).add(ambient_light(material)) }}));
        Lux.Scene.animate();
    });
});
