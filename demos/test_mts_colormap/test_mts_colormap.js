$().ready(function () {
    var canvas = document.getElementById("webgl");
    var width = canvas.width, height = canvas.height;

    var gl = Lux.init({
        clearDepth: 1.0,
        clearColor: [0,0,0,1]
    });

    var sq = Lux.Models.square();

    function color(uv) {
        var u = uv.x();
        var intensity = uv.y();

        var h = uv.x().lt(0.5).ifelse(0.5, 3.6);
        var s = u.sub(0.5).abs().mul(2);

        return Shade.Colors.hsv(h, s, intensity.sub(Shade(0.1).sub(s.div(5))));

        return Shade.Colors.hsv(h, s, intensity); // .sub(Shade(0.1).sub(s.div(5))));

        // return Shade.Colors.hcl(h, s.mul(100).mul(intensity), 
        //                         intensity.mul(90));
    }

    var actor = Lux.actor({ 
        model: sq, 
        appearance: {
            position: sq.vertex.mul(2).sub(1),
            color: color(sq.vertex)
        }});

    Lux.Scene.add(actor);
});
