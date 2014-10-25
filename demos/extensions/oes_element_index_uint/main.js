$().ready(function() {
    var gl = Lux.init();
    Lux.Geometry.PLY.load('dragon_vrip_res2.ply', function(obj) {
        var positionArray = new Float32Array(obj.content.vertex);
        var position = Lux.attributeBuffer({
            vertexArray: positionArray,
            itemSize: 3
        });
        
        var cx = 0, cy = 0, cz = 0;
        for (var i=0; i<positionArray.length/3; ++i) {
            cx += positionArray[3*i];
            cy += positionArray[3*i+1];
            cz += positionArray[3*i+2];
        }
        cx /= positionArray.length/3;
        cy /= positionArray.length/3;
        cz /= positionArray.length/3;
        var elements = Lux.elementBuffer(obj.content.face);
        var camera = Shade.Camera.perspective({
            lookAt: [Shade.vec(0,0,0.5), Shade.vec(0,0,0), Shade.vec(0, 1, 0)]
        });
        var lightPosition = Shade.vec(0, 3, 8);
        var ambientLight = Shade.Light.ambient({ 
            color: Shade.vec(0.2, 0.2, 0.2)
        });
        var diffuseLight = Shade.Light.diffuse({
            position: lightPosition,
            color: Shade.vec(0.7, 0.6, 0.5)
        });
        var dragonModel = Lux.model({
            position: Shade.rotation(gl.parameters.now, Shade.vec(0,1,0))
                     (Shade.translation(Shade.vec(-cx, -cy, -cz)))
                     (Shade.vec(position, 1)),
            elements: elements
        });
        var material = {
            position: dragonModel.position,
            normal: Shade.ThreeD.normal(dragonModel.position),
            color: Shade.color("red")
        };
        Lux.Scene.add(Lux.actor({
            model: dragonModel, 
            appearance: {
                position: camera(dragonModel.position),
                color: diffuseLight(material).add(ambientLight(material)) }}));
        Lux.Scene.animate();
    });
});
