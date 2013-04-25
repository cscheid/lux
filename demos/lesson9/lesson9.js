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
var star_list;
var z_translate = -10;
var tilt = 90, spin = 0, twinkle = false;

//////////////////////////////////////////////////////////////////////////////

function square_model()
{
    return Lux.model({
        type: "triangle_strip",
        // type: "points",
        elements: 4,
        vertex: [[-1, -1, 1, -1, -1, 1, 1, 1], 2],
        tex_coord: [[0, 0, 1, 0, 0, 1, 1, 1], 2]
    });
}

function star_drawable()
{
    var model = square_model();
    return Lux.bake(model, {
        position: proj.mul(mv).mul(Shade.vec(model.vertex, 0, 1)),
        color: Shade.texture2D(Lux.texture({
            src: "../img/star.gif"
        }), model.tex_coord).swizzle("rgbr").mul(Shade.vec(color, 1.0)),
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
            mat4.set_identity(modelview);
            mat4.translate(modelview, [0, 0, z_translate]);
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
                this.randomise_colors();
            }
        },
        randomise_colors: function() {
            this.color = vec3.random();
            this.twinkle = vec3.random();
        }
    };
    result.randomise_colors();
    return result;
}

function init_star_list()
{
    var result = [];
    var n_stars = 50;
    for (var i=0; i<n_stars; ++i) {
        result.push(star(5*i/n_stars, (i/n_stars) * (Math.PI/180)));
    }
    return result;
}

function draw_it()
{
    proj.set(Lux.perspective(45, 720/480, 0.1, 100));
    _.each(star_list, function(x) {
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
        display: draw_it,
        attributes:
        {
            alpha: true,
            depth: true
        }
    });
    mv = Shade.parameter("mat4");
    proj = Shade.parameter("mat4");
    color = Shade.parameter("vec3");
    drawable = star_drawable();
    star_list = init_star_list();

    var start = new Date().getTime();
    
    var f = function() {
        counter += 1;
        window.requestAnimFrame(f, canvas);
        var now = new Date().getTime();
        var elapsed = now - start;
        start = now;
        gl.display();
        _.each(star_list, function(x) {
            x.animate(elapsed);
        });
    };
    f();
});
