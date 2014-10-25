/*
 * FIXME THIS LESSON USES REALLY ANCIENT LUX STYLE
 * 
 * It works, but it reflects in no way how you should write Lux code.
 */

var gl;
var drawable;
var mv;
var proj;
var color;
var starList;
var zTranslate = -10;
var tilt = 90, spin = 0, twinkle = false;

//////////////////////////////////////////////////////////////////////////////

function squareModel()
{
    return Lux.model({
        type: "triangleStrip",
        // type: "points",
        elements: 4,
        vertex: [[-1, -1, 1, -1, -1, 1, 1, 1], 2],
        texCoord: [[0, 0, 1, 0, 0, 1, 1, 1], 2]
    });
}

function starDrawable()
{
    var model = squareModel();
    return Lux.bake(model, {
        position: proj.mul(mv).mul(Shade.vec(model.vertex, 0, 1)),
        color: Shade.texture2D(Lux.texture({
            src: "../img/star.gif"
        }), model.texCoord).swizzle("rgbr").mul(Shade.vec(color, 1.0)),
        mode: Lux.DrawingMode.additive
    });
}

function star(startingDistance, rotationSpeed)
{
    var modelview = mat4.create();
    var result = {
        angle: 0,
        dist: startingDistance,
        rotationSpeed: rotationSpeed,
        draw: function(tilt, spin, twinkle) {
            mat4.setIdentity(modelview);
            mat4.translate(modelview, [0, 0, zTranslate]);
            mat4.rotate   (modelview,  tilt, [1,0,0]);
            mat4.rotate   (modelview,  this.angle, [0,1,0]);
            mat4.translate(modelview, [this.dist, 0, 0]);
            mat4.rotate   (modelview, -this.angle, [0,1,0]);
            mat4.rotate   (modelview, -tilt, [1,0,0]);

            if (twinkle) {
                mv.set(modelview);
                color.set(this.twinkle);
                drawable.draw();
            }

            mat4.rotate(modelview, spin, [0,0,1]);
            mv.set(modelview);
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

function drawIt()
{
    proj.set(Lux.perspective(45, 720/480, 0.1, 100));
    _.each(starList, function(x) {
        x.draw(tilt, spin, twinkle);
    });
    spin += 0.1 * (Math.PI / 180);
};

var counter = 0;
$().ready(function () {
    var canvas = document.getElementById("webgl");

    gl = Lux.init({
        clearDepth: 1.0,
        clearColor: [0, 0, 0, 1],
        display: drawIt,
        attributes:
        {
            alpha: true,
            depth: true
        }
    });
    mv = Shade.parameter("mat4");
    proj = Shade.parameter("mat4");
    color = Shade.parameter("vec3");
    drawable = starDrawable();
    starList = initStarList();

    var start = new Date().getTime();
    
    var f = function() {
        counter += 1;
        window.requestAnimationFrame(f, canvas);
        var now = new Date().getTime();
        var elapsed = now - start;
        start = now;
        gl.display();
        _.each(starList, function(x) {
            x.animate(elapsed);
        });
    };
    f();
});
