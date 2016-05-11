var S = Shade;
var Models = Lux.Models;

var gl;
var drawable;
var alive = true;

//////////////////////////////////////////////////////////////////////////////

function initWebgl()
{
    var tex = Lux.texture({ 
        src: "image.png",
        onload: function() { Lux.Scene.invalidate(); }
    });

    var squareModel = Models.square();
    Lux.Scene.add(Lux.actor({
        model: squareModel, 
        appearance: {
            position: squareModel.vertex,
            color: S.texture2D(tex, squareModel.texCoord)}}));
}

$().ready(function() {
    gl = Lux.init();
    initWebgl();
});
