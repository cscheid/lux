var gl;

//////////////////////////////////////////////////////////////////////////////

function rotated(angle, axis, m)
{
    var forward = Shade.rotation(Shade(angle).neg(), axis),
       backward = Shade.rotation(angle,              axis);
    return (forward)(m)(backward);
}

function make_stars_actor(star_texture)
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

    star_list = init_star_list();
    var model = Lux.Models.square();
    var star_actor = Lux.actor({
        model: model,
        appearance: {
            position: proj(mv(Shade.vec(model.vertex.mul(2).sub(Shade.vec(1,1))))),
            color: Shade.texture2D(star_texture, model.tex_coord).mul(Shade.vec(color, 1.0)),
            mode: Lux.DrawingMode.additive
        },
        bake: function(model, changed_appearance) {
            drawable = Lux.bake(model, changed_appearance);
            return {
                draw: function() {
                    console.log("draw");
                    _.each(star_list, function(x) { x.draw(twinkle); });
                },
                tick: function(elapsed) {
                    console.log("tick");
                   _.each(star_list, function(x) { x.animate(elapsed); });
                }
            };
        }
    });
    return star_actor;
}

function cube_actor(texture)
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
    return Lux.actor({ 
        model: cube_model, 
        appearance: {
            position: proj(eye_vertex),
            color: final_color
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

    var stars_batch;
    var stars_actor;
    var rb = Lux.render_buffer({
        clearColor: [0.1, 0.2, 0.3, 1],
        clearDepth: 1.0
    });
    var rb_scene = rb.scene;

    Lux.texture({ 
        src: "../img/star.gif",
        onload: function() {
            stars_actor = make_stars_actor(this);
            stars_batch = rb_scene.add(stars_actor);
        }
    });

    var cube = cube_actor(rb);
    Lux.Scene.add(cube);

    var start = new Date().getTime();
    var angle = 0;
    Lux.Scene.animate(function() {
        var now = new Date().getTime();
        var elapsed = now - start;
        start = now;
        counter += 1;
        stars_batch && stars_batch.tick(elapsed);
        angle += (elapsed / 20) * (Math.PI/180);
        rb_scene.invalidate();
    });
});
