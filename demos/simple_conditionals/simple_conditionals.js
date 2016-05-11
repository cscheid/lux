var gl;

//////////////////////////////////////////////////////////////////////////////

function cubeActor()
{
    var cubeModel = Lux.Models.flatCube();

    var b = cubeModel.texCoord.fract().lessThanEqual(Shade.vec(0.5, 0.5));
    var t = b.at(0).xor(b.at(1));
    var materialColor = t.ifelse(
        Shade.texture2D(Lux.texture({ src: "../img/glass.jpg" }), cubeModel.texCoord),
        Shade.texture2D(Lux.texture({ src: "../img/crate.jpg" }), cubeModel.texCoord));
    var proj = Shade.Camera.perspective();
    var angle = gl.parameters.now.radians().mul(50);
    var mv = Shade.translation(0, 0, -6)(Shade.rotation(angle, vec.make([1,1,1])));
    var brightness = materialColor.dot(Shade.vec(1/3,1/3,1/3,0));
    
    return Lux.actor({
        model: cubeModel, 
        appearance: {
            position: proj(mv)(cubeModel.vertex),
            color: materialColor}});
}

$().ready(function () {
    gl = Lux.init({ clearColor: [0,0,0,0.1] });

    Lux.Scene.add(cubeActor());
    Lux.Scene.animate();
});
