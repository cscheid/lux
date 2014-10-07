var gl;

//////////////////////////////////////////////////////////////////////////////

function cube_actor()
{
    var cube_model = Lux.Models.flat_cube();

    var b = cube_model.tex_coord.fract().lessThanEqual(Shade.vec(0.5, 0.5));
    var t = b.at(0).xor(b.at(1));
    var material_color = t.ifelse(
        Shade.texture2D(Lux.texture({ src: "../img/glass.jpg" }), cube_model.tex_coord),
        Shade.texture2D(Lux.texture({ src: "../img/crate.jpg" }), cube_model.tex_coord));
    var proj = Shade.Camera.perspective();
    var angle = gl.parameters.now.radians().mul(50);
    var mv = Shade.translation(0, 0, -6)(Shade.rotation(angle, vec.make([1,1,1])));
    var brightness = material_color.dot(Shade.vec(1/3,1/3,1/3,0));
    
    return Lux.actor({
        model: cube_model, 
        appearance: {
            position: proj(mv)(cube_model.vertex),
            color: material_color.discard_if(brightness.gt(0.3))}});
}

$().ready(function () {
    gl = Lux.init({ clearColor: [0,0,0,0.1] });

    Lux.Scene.add(cube_actor());
    Lux.Scene.animate();
});
