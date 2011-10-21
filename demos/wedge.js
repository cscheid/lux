var gl;
var square_drawable, triangle_drawable;
var model_mat;

var pick_id_val;
var angle_min;
var angle_max;
var pick_id;
var wedge_color;

//////////////////////////////////////////////////////////////////////////////

function draw_it()
{
    var states = [ [ [angle_min, -Math.PI/3],
                     [angle_max,  Math.PI/3],
                     [pick_id, Shade.id(pick_id_val)],
                     [wedge_color, Shade.color('red')] ],
                   [ [angle_min, Math.PI/3],
                     [angle_max, Math.PI/2],
                     [pick_id, Shade.id(pick_id_val+1)],
                     [wedge_color, Shade.color('blue')] ],
                   [ [angle_min,   Math.PI/2],
                     [angle_max, 5*Math.PI/3],
                     [pick_id, Shade.id(pick_id_val+2)],
                     [wedge_color, Shade.color('green') ] ] ];
    _.each(states, function(lst) {
        _.each(lst, function(pair) {
            var uniform = pair[0],
                value = pair[1];
            uniform.set(value);
        });
        square_drawable.draw();
    });
}

$().ready(function () {
    var canvas = document.getElementById("webgl");
    var camera = Facet.Camera.perspective({
        look_at: [[0, 0, 6], [0, 0, -1], [0, 1, 0]],
        field_of_view_y: 45,
        aspect_ratio: 720/480,
        near_distance: 0.1,
        far_distance: 100
    });
    model_mat = Shade.uniform("mat4", Facet.identity());

    var strings = {};
    strings[0] = "Miss";

    gl = Facet.initGL(canvas, {
        clearDepth: 1.0,
        clearColor: [0,0,0,0.2],
        display: draw_it,
        attributes: {
            alpha: true,
            depth: true
        },
        mousedown: function(event) {
            Facet.Picker.draw_pick_scene();
            var r = Facet.Picker.pick(event.offsetX, gl.viewportHeight - event.offsetY);
            $("#pickresult").html(strings[r]);
            // console.log(strings[r]);
        }
    });

    var square = Facet.model({
        type: "triangles",
        elements: [0, 1, 2, 0, 2, 3],
        vertex: [[-1,-1, 1,-1, 1,1, -1,1], 2]
    });

    var distance_from_origin = Shade.length(square.vertex);
    var angle = Shade.selection(distance_from_origin.eq(0), 
                                0, Shade.atan(square.vertex.at(1), 
                                              square.vertex.at(0)));
    pick_id_val = Facet.fresh_pick_id(3);
    angle_min = Shade.uniform("float");
    angle_max = Shade.uniform("float");
    pick_id = Shade.uniform("vec4");
    wedge_color = Shade.uniform("vec4");

    var angle_p1 = angle.add(Math.PI * 2);
    var angle_m1 = angle.sub(Math.PI * 2);

    function inside(ang) {
        return Shade.and(ang.ge(angle_min), ang.lt(angle_max));
    };
 
    var hit = inside(angle).or(inside(angle_p1)).or(inside(angle_m1));
    square_drawable = Facet.bake(square, {
        position: camera.project(model_mat.mul(Shade.vec(square.vertex, 0, 1))),
        color: wedge_color
            .discard_if(distance_from_origin.gt(1).or(hit.not())),
        pick_id: pick_id
    });

    strings[pick_id_val]   = "Wedge 0";
    strings[pick_id_val+1] = "Wedge 1";
    strings[pick_id_val+2] = "Wedge 2";

    gl.display();
});
