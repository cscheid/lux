var gl;
var angle_y = Shade.parameter("float", 0.0);
var angle_x = Shade.parameter("float", 0.0);
var camera, model_xform, view_xform;
var u_parameter, v_parameter, t_parameter;
var mesh;

$().ready(function () {
    var prev_mouse_pos;
    gl = Lux.init({
        clearColor: [0,0,0,0.2],
        mousedown: function(event) {
            prev_mouse_pos = [event.offsetX, event.offsetY];
        }, mousemove: function(event) {
            if ((event.which & 1) && !event.shiftKey) {
                var delta_x =  (event.offsetX - prev_mouse_pos[0]) / gl.viewportHeight;
                var delta_y =  (event.offsetY - prev_mouse_pos[1]) / gl.viewportHeight;
                angle_x.set(angle_x.get() + delta_x); 
                angle_y.set(angle_y.get() + delta_y); 
                prev_mouse_pos = [event.offsetX, event.offsetY];
                Lux.Scene.invalidate();
            }
        }
    });

    camera = Shade.Camera.perspective();
    model_xform = 
        Shade.rotation(angle_x, Shade.vec(0,1,0))
       (Shade.rotation(angle_y, Shade.vec(1,0,0)));
    view_xform = Shade.translation(0, 0, -10);

    mesh = Lux.Models.mesh(100, 100);
    t_parameter = Shade.parameter("float", 0);

    update_mesh();

    var start_time = (new Date().getTime()) / 1000;
    var f = function() {
        window.requestAnimFrame(f);
        var this_time = (new Date().getTime()) / 1000;
        var elapsed = this_time - start_time;
        t_parameter.set(elapsed);
        gl.display();
    };
    f();
});

var current_batch;
function create_mesh(position, normal, color)
{
    if (current_batch) {
        Lux.Scene.remove(current_batch);
    }

    var final_color = Shade.gl_light({
        light_position: Shade.vec(0,0,2),
        material_color: color,
        light_ambient: Shade.vec(0.1, 0.1, 0.1, 1.0),
        light_diffuse: Shade.color("white"),
        vertex: model_xform(position),
        normal: model_xform(normal),
        two_sided: true
    });
    current_batch = Lux.bake(mesh, {
        position: camera(view_xform)(model_xform)(position),
        color: final_color
    });
    Lux.Scene.add(current_batch);
}

function parse_expression(v)
{
    return peg_parser.parse(v);
}


function update_mesh()
{
    // wow, this is ugly.

    u_parameter = mesh.tex_coord.x();
    v_parameter = mesh.tex_coord.y();
    var x = parse_expression($("#x").val());
    var y = parse_expression($("#y").val());
    var z = parse_expression($("#z").val());
    var color = parse_expression($("#color").val());
    if (_.isUndefined(x) ||
        _.isUndefined(y) ||
        _.isUndefined(z) ||
        _.isUndefined(color))
        return;

    u_parameter = mesh.tex_coord.x().add(0.01);
    var xu = parse_expression($("#x").val());
    var yu = parse_expression($("#y").val());
    var zu = parse_expression($("#z").val());

    u_parameter = mesh.tex_coord.x();
    v_parameter = mesh.tex_coord.y().add(0.01);
    var xv = parse_expression($("#x").val());
    var yv = parse_expression($("#y").val());
    var zv = parse_expression($("#z").val());

    u_parameter = mesh.tex_coord.x();
    v_parameter = mesh.tex_coord.y();

    var position = Shade.vec(x, y, z);
    var du = Shade.vec(xu,yu,zu).sub(Shade.vec(position)).div(0.01);
    var dv = Shade.vec(xv,yv,zv).sub(Shade.vec(position)).div(0.01);
    var normal = du.cross(dv).normalize();
    create_mesh(position, normal, color);
}
