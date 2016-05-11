var gl;

//////////////////////////////////////////////////////////////////////////////

function rotated(angle, axis, m)
{
    var forward = Shade.rotation(Shade(angle).neg(), axis),
       backward = Shade.rotation(angle,              axis);
    return (forward)(m)(backward);
}

function makeStarsActor(starTexture)
{
    var drawable;
    var starList;
    var twinkle = false;
    var tilt = 90;
    var angle = Shade.parameter("float", 0);
    var dist = Shade.parameter("float", 0);
    var spin = Shade.parameter("float", 0);
    var color = Shade.parameter("vec3", vec.make([0,0,0]));

    var proj = Shade.Camera.perspective({aspectRatio: 1});
    var mv = (Shade.rotation(spin, vec.make([0,0,1])))
             (rotated(tilt, vec.make([1,0,0]),
                      rotated(angle, vec.make([0,1,0]),
                              Shade.translation(dist, 0, 0))))
             (Shade.translation(0, 0, -10))
    ;

    function star(startingDistance, rotationSpeed)
    {
        var result = {
            angle: 0,
            dist: startingDistance,
            rotationSpeed: rotationSpeed,
            draw: function(twinkle) {
                var spinAmount = spin.get();
                angle.set(this.angle);
                dist.set(this.dist);
                if (twinkle) {
                    spin.set(0);
                    color.set(this.twinkle);
                    drawable.draw();
                }
                spin.set(spinAmount);
                color.set(this.color);
                drawable.draw();
            },
            animate: function(elapsedTime) {
                this.angle += this.rotationSpeed * (60/1000) * elapsedTime;
                this.dist -= 0.01 * (60/1000) * elapsedTime;
                if (this.dist < 0.0) {
                    this.dist += 5.0;
                    this.randomiseColors();
                }
            },
            randomiseColors: function() {
                this.color = vec3.random();
                this.twinkle = vec3.random();
            }
        };
        result.randomiseColors();
        return result;
    }
    
    function initStarList()
    {
        var result = [];
        var nStars = 50;
        for (var i=0; i<nStars; ++i) {
            result.push(star(5*i/nStars, (i/nStars) * (Math.PI/180)));
        }
        return result;
    }

    starList = initStarList();
    var model = Lux.Models.square();
    var starActor = Lux.actor({
        model: model,
        appearance: {
            position: proj(mv(Shade.vec(model.vertex.mul(2).sub(Shade.vec(1,1))))),
            color: Shade.texture2D(starTexture, model.texCoord).mul(Shade.vec(color, 1.0)),
            mode: Lux.DrawingMode.additive
        },
        bake: function(model, changedAppearance) {
            drawable = Lux.bake(model, changedAppearance);
            return {
                draw: function() {
                    console.log("draw");
                    _.each(starList, function(x) { x.draw(twinkle); });
                },
                tick: function(elapsed) {
                    console.log("tick");
                   _.each(starList, function(x) { x.animate(elapsed); });
                }
            };
        }
    });
    return starActor;
}

function cubeActor(texture)
{
    var lightAmbient = Shade.color('gray');
    var lightDiffuse = Shade.color('white');
    var lightPosition = Shade.vec(0, 0, 2);
    var proj = Shade.Camera.perspective();
    var angle = gl.parameters.now.radians().mul(50);
    var mv = Shade.translation(0,0,-6)(
        Shade.rotation(angle, vec.make([1,1,1])));
    
    var matAmbient = Shade.vec(0.2, 0.2, 0.2, 1);
    var backgroundColor = Shade.vec(0.5, 0.5, 0.5, 1);

    var cubeModel = Lux.Models.flatCube();
    var materialColor = Shade.texture2D(texture, cubeModel.texCoord);

    var finalColor;
    var mat3 = Shade.mat3(mv);
    finalColor = Shade.glLight({
        lightPosition: lightPosition,
        vertex: mat3.mul(cubeModel.vertex),
        materialColor: materialColor,
        lightAmbient: lightAmbient,
        lightDiffuse: lightDiffuse,
        normal: mat3.mul(cubeModel.normal.normalize())
    });

    var eyeVertex = mv.mul(Shade.vec(cubeModel.vertex, 1));
    return Lux.actor({ 
        model: cubeModel, 
        appearance: {
            position: proj(eyeVertex),
            color: finalColor
        }
    });
}

var counter = 0;
$().ready(function () {
    var canvas = document.getElementById("webgl");

    gl = Lux.init({
        clearDepth: 1.0,
        clearColor: [0,0,0,0.1],
        attributes: {
            alpha: true,
            depth: true
        }
    });

    var starsBatch;
    var starsActor;
    var rb = Lux.renderBuffer({
        clearColor: [0.1, 0.2, 0.3, 1],
        clearDepth: 1.0
    });
    var rbScene = rb.scene;

    Lux.texture({ 
        src: "../img/star.gif",
        onload: function() {
            starsActor = makeStarsActor(this);
            starsBatch = rbScene.add(starsActor);
        }
    });

    var cube = cubeActor(rb);
    Lux.Scene.add(cube);

    var start = new Date().getTime();
    var angle = 0;
    Lux.Scene.animate(function() {
        var now = new Date().getTime();
        var elapsed = now - start;
        start = now;
        counter += 1;
        starsBatch && starsBatch.tick(elapsed);
        angle += (elapsed / 20) * (Math.PI/180);
        rbScene.invalidate();
    });
});
