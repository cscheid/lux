var gl;
var scene;

//////////////////////////////////////////////////////////////////////////////

function rotated(angle, axis, m)
{
    return Shade.rotation(Shade(angle).neg(), axis)(m)(Shade.rotation(angle, axis));
}

function make_scene()
{
    var drawable;
    var star_list;
    var twinkle = false;
    var tilt = 90;
    var angle = Shade.parameter("float", 0);
    var dist = Shade.parameter("float", 0);
    var spin = Shade.parameter("float", 0);
    var color = Shade.parameter("vec3", vec.make([0,0,0]));

    var proj = Shade.Camera.perspective({aspect_ratio: 1});
    var mv = (Shade.rotation(spin, vec.make([0,0,1])))
             (rotated(tilt, vec.make([1,0,0]),
                      rotated(angle, vec.make([0,1,0]),
                              Shade.translation(dist, 0, 0))))
             (Shade.translation(0, 0, -10))
    ;

    function star_batch()
    {
        var model = Lux.Models.square();

        return Lux.bake(model, {
            position: proj(mv(Shade.vec(model.vertex.mul(2).sub(Shade.vec(1,1))))),
            color: Shade.texture2D(Lux.texture({ src: "../img/star.gif" }), 
                                   model.tex_coord).mul(Shade.vec(color, 1.0)),
            mode: Lux.DrawingMode.additive
        });
    }

    function star(startingDistance, rotationSpeed)
    {
        var result = {
            angle: 0,
            dist: startingDistance,
            rotationSpeed: rotationSpeed,
            draw: function(twinkle) {
                var spin_amount = spin.get();
                angle.set(this.angle);
                dist.set(this.dist);
                if (twinkle) {
                    spin.set(0);
                    color.set(this.twinkle);
                    drawable.draw();
                }
                spin.set(spin_amount);
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

    drawable = star_batch();
    star_list = init_star_list();
    
    return {
        draw: function() {
            _.each(star_list, function(x) {
                x.draw(twinkle);
            });
            spin.set(spin.get() + 0.1 * (Math.PI / 180));
        },
        tick: function(elapsed) {
            _.each(star_list, function(x) {
                x.animate(elapsed);
            });
        }
    };
}

function cube_batch(texture)
{
    var light_ambient = Shade.color('gray');
    var light_diffuse = Shade.color('white');
    var light_position = Shade.vec(0, 0, 2);
    var proj = Shade.Camera.perspective();
    var angle = gl.parameters.now.radians().mul(50);
    var mv = Shade.translation(0,0,-6)(
        Shade.rotation(angle, vec.make([1,1,1])));
    
    var mat_ambient = Shade.vec(0.2, 0.2, 0.2, 1);
    var background_color = Shade.vec(0.5, 0.5, 0.5, 1);

    var cube_model = Lux.Models.flat_cube();
    var material_color = Shade.texture2D(texture, cube_model.tex_coord);

    var final_color;
    var mat3 = Shade.mat3(mv);
    final_color = Shade.gl_light({
        light_position: light_position,
        vertex: mat3.mul(cube_model.vertex),
        material_color: material_color,
        light_ambient: light_ambient,
        light_diffuse: light_diffuse,
        normal: mat3.mul(cube_model.normal.normalize())
    });

    var eye_vertex = mv.mul(Shade.vec(cube_model.vertex, 1));
    return Lux.bake(cube_model, {
        position: proj(eye_vertex),
        color: final_color
    });
}

var counter = 0;
$().ready(function () {
    var canvas = document.getElementById("webgl");

    gl = Lux.init({
        clearDepth: 1.0,
        clearColor: [0,0,0,0.1],
        display: function() {
            cube.draw();

            rb.with_bound_buffer(function() {
                gl.clearColor(0.1,0.2,0.3,1);
                gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
                scene.draw();
            });
        },
        attributes:
        {
            alpha: true,
            depth: true
        }
    });
    gl.depthFunc(gl.LESS);

    scene = make_scene();
    var rb = Lux.render_buffer();
    var cube = cube_batch(rb);
    var angle = 0;
    
    var start = new Date().getTime();
    var f = function() {
        var now = new Date().getTime();
        var elapsed = now - start;
        start = now;
        counter += 1;
        scene.tick(elapsed);
        angle += (elapsed / 20) * (Math.PI/180);
        window.requestAnimFrame(f, canvas);
        gl.display();
    };
    f();
});
