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
    square_drawable.draw();
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
    var pick_id_val = Facet.fresh_pick_id(3);
    var angle_min = Shade.uniform("float", -Math.PI/3);
    var angle_max = Shade.uniform("float", Math.PI/3);
    var pick_id = Shade.uniform("vec4", Shade.id(pick_id_val));
    var wedge_color = Shade.uniform("vec4", Shade.color('rgb(255, 232, 204)'));

    square_drawable = Facet.bake(square, {
        position: camera.project(model_mat.mul(Shade.vec(square.vertex, 0, 1))),
        color: wedge_color
            .discard_if(distance_from_origin.gt(1)
                        .logical_or(angle.gt(angle_max))
                        .logical_or(angle.lt(angle_min))),
        pick_id: pick_id
    });

    strings[pick_id_val]   = "Wedge 0";
    strings[pick_id_val+1] = "Wedge 1";
    strings[pick_id_val+2] = "Wedge 2";

    gl.display();
});
