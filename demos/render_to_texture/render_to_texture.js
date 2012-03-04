var gl;
var scene;
var Models = Facet.Models;

//////////////////////////////////////////////////////////////////////////////

function make_scene()
{
    var drawable;
    var mv;
    var proj;
    var color;
    var star_list;
    var z_translate = -10;
    var tilt = 90, spin = 0, twinkle = false;

    mv = Shade.uniform("mat4");
    proj = Shade.uniform("mat4");
    color = Shade.uniform("vec3");

    function star_drawable()
    {
        var model = Models.square();
        return Facet.bake(model, {
            position: proj.mul(mv)
                .mul(Shade.vec(model.vertex
                               .mul(2)
                               .sub(Shade.vec(1,1)),
                               0, 1)),
            color: Shade.texture2D(Facet.texture({
                src: "../img/star.gif"
            }), model.tex_coord).mul(Shade.vec(color, 1.0)),
            mode: Facet.DrawingMode.additive
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

    drawable = star_drawable();
    star_list = init_star_list();
    
    return {
        draw: function() {
            proj.set(Facet.perspective(45, 720/480, 0.1, 100));
            _.each(star_list, function(x) {
                x.draw(tilt, spin, twinkle);
            });
            spin += 0.1 * (Math.PI / 180);
        },
        tick: function(elapsed) {
            _.each(star_list, function(x) {
                x.animate(elapsed);
            });
        }
    };
}

function create_cube_drawable(texture, mv, proj)
{
    var light_ambient = Shade.color('gray');
    var light_diffuse = Shade.color('white');
    var light_position = Shade.vec(0, 0, 2);
    
    var mat_ambient = Shade.vec(0.2, 0.2, 0.2, 1);
    var background_color = Shade.vec(0.5, 0.5, 0.5, 1);

    var cube_model = Models.flat_cube();
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

    var mvp = proj.mul(mv);
    var eye_vertex = mv.mul(Shade.vec(cube_model.vertex, 1));
    return Facet.bake(cube_model, {
        position: proj.mul(eye_vertex),
        color: final_color
    });
}

var counter = 0;
$().ready(function () {
    var canvas = document.getElementById("webgl");

    gl = Facet.init(canvas, {
        clearDepth: 1.0,
        clearColor: [0,0,0,1],
        display: function() {
            cube.draw();

            rb.render_to_buffer(function() {
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

    var mv = Shade.uniform("mat4");
    var proj = Shade.uniform("mat4");
    proj.set(Facet.perspective(45, 720/480, 0.1, 100.0));
    scene = make_scene();
    var rb = Facet.render_buffer();
    var cube = create_cube_drawable(rb, mv, proj);
    var angle = 0;
    
    var start = new Date().getTime();
    var f = function() {
        var now = new Date().getTime();
        var elapsed = now - start;
        start = now;
        counter += 1;
        scene.tick(elapsed);
        angle += (elapsed / 20) * (Math.PI/180);
        mv.set(mat4.product(Facet.translation(0,0,-6),
                            Facet.rotation(angle, [1,1,1])));

        window.requestAnimFrame(f, canvas);
        gl.display();
    };
    f();
});
