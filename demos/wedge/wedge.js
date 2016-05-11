$().ready(function() {
    var foo = 1;
    function handleMouse(event) {
        Lux.Picker.drawPickScene();
        var r = Lux.Picker.pick(event.luxX, event.luxY);
        $("#pickresult").html(strings[r]);
        var rId = Shade.id(r);
        if (!vec.equal(rId, currentPickId.get())) {
            currentPickId.set(rId);
            Lux.Scene.invalidate();
        }
    }

    var pickIdVal = Lux.freshPickId(3);
    var strings = {};
    strings[0] = "Nothing";
    strings[pickIdVal]   = "Wedge 0";
    strings[pickIdVal+1] = "Wedge 1";
    strings[pickIdVal+2] = "Wedge 2";

    var gl = Lux.init({
        clearColor: [0,0,0,0.2],
        clearDepth: 1.0,
        mousedown: handleMouse,
        mousemove: handleMouse,
        attributes: {
            alpha: true,
            depth: true,
            preserveDrawingBuffer: true
        }
    });

    var square = Lux.Models.square();
    var vertex = square.vertex.mul(2).sub(1);

    var distanceFromOrigin = Shade.norm(vertex);
    var angle = Shade.atan(vertex.at(1), vertex.at(0));

    var currentPickId = Shade.parameter("vec4", Shade.id(0));
    var angleMin = Shade.parameter("float");
    var angleMax = Shade.parameter("float");
    var wedgeId  = Shade.parameter("vec4");
    var wedgeHue = Shade.parameter("float");

    function inside(ang) {
        return ang.ge(angleMin).and(ang.lt(angleMax));
    };
 
    var hit = inside(angle)
        .or(inside(angle.add(Math.PI * 2)))
        .or(inside(angle.sub(Math.PI * 2)));

    function hcl(h, c, l) {
        return Shade.Colors.shadetable.hcl.create(h, c, l).asShade();
    }

    var camera = Shade.Camera.perspective({
        lookAt: [Shade.vec(0, 0, 6), Shade.vec(0, 0, -1), Shade.vec(0, 1, 0)]
    });
    var intensity = currentPickId.eq(wedgeId).ifelse(75, 50);

    var uniforms = [angleMin, angleMax, wedgeId, wedgeHue];
    var states = [
        [ -1, 1, Shade.id(pickIdVal),   0],
        [  1, 2, Shade.id(pickIdVal+1), 2],
        [  2, 5, Shade.id(pickIdVal+2), 4]
    ];

    var wedgeActor = Lux.actor({
        model: square, 
        appearance: {
            position: camera(vertex),
            color: hcl(wedgeHue, intensity, intensity)
                .discardIf(distanceFromOrigin.gt(1).or(hit.not())),
            pickId: wedgeId }});

    var wedgeSetActor = {
        dress: function(scene) {
            var batch = wedgeActor.dress(scene);
            return {
                draw: function() {
                    _.each(states, function(lst) {
                        _.each(lst, function(v, i) { uniforms[i].set(v); });
                        batch.draw();
                    });
                }
            };
        },
        on: function() { return true; }
    };

    Lux.Scene.add(wedgeSetActor);
    // Lux.Picker.drawPickScene();
});
