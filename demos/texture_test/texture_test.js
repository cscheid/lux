var S = Shade;
var Models = Lux.Models;

var gl;
var drawable;
var alive = true;

//////////////////////////////////////////////////////////////////////////////

function init_webgl()
{
    Lux.set_context(gl);

    var tex = Lux.texture({ 
        src: "image.png",
        onload: function() { Lux.Scene.invalidate(); }
    });

    var square_model = Models.square();
    Lux.Scene.add(Lux.actor({
        model: square_model, 
        appearance: {
            position: square_model.vertex,
            color: S.texture2D(tex, square_model.tex_coord)}}));
}

$().ready(function() {
    gl = Lux.init();
    init_webgl();
});
