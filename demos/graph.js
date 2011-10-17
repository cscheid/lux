var gl;

function make_graph_model(graph)
{
    var pos = [];
    var indices = {};
    var line_elements = [];
    var names = [];
    _.each(graph.nodes, function(node, i) {
        pos.push.apply(pos, node.position);
        indices[node.name] = i;
        names.push(node.name);
    });
    _.each(graph.edges, function(node, i) {
        line_elements.push(indices[node.source]);
        line_elements.push(indices[node.target]);
    });
    var position = Facet.attribute_buffer(pos, 2);
    return {
        position: Shade.make(position),
        name: names,
        node_elements: position.numItems,
        edge_elements: Facet.element_buffer(line_elements)
    };
}

function make_graph_drawable(model, center, zoom)
{
    var half_width  = Shade.div(720, zoom).div(2);
    var half_height = Shade.div(480, zoom).div(2);
    var dots_drawable = Facet.Marks.dots({
        elements: model.node_elements,
        x: model.position.at(0),
        y: model.position.at(1),
        x_scale: Shade.Utils.linear(center.at(0).sub(half_width), center.at(0).add(half_width), 0, 1),
        y_scale: Shade.Utils.linear(center.at(1).sub(half_height), center.at(1).add(half_height), 0, 1),
        stroke_color: Shade.color("black"),
        fill_color: Shade.color("gray"),
        point_diameter: zoom.mul(10),
        stroke_width: zoom
    });

    var lines_drawable = Facet.bake({
        type: 'lines',
        elements: model.edge_elements
    }, {
        position: dots_drawable.gl_Position,
        color: Shade.color("black", 0.5)
    });

    return {
        draw: function() {
            lines_drawable.draw();
            dots_drawable.draw();
        }
    };
}

var graph_drawable;

function draw_it()
{
    gl.enable(gl.BLEND);
    gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.SRC_ALPHA, gl.ONE);
    if (graph_drawable) {
        graph_drawable.draw();
    }
}

$().ready(function () {
    var canvas = document.getElementById("webgl");
    var model;
    var graph;
    var center = Shade.uniform("vec2", vec.make([250, 250]));
    var zoom = Shade.uniform("float", 1);
    var prev_mouse_pos;
    jQuery.getJSON("graph_extras/USAir97.graph",
                   function (data) {
                       graph = data;
                       model = make_graph_model(graph);
                       graph_drawable = make_graph_drawable(model, center, zoom);
                       gl.display();
                   });
    gl = Facet.initGL(canvas, {
        clearDepth: 1.0,
        clearColor: [0,0,0,0],
        display: draw_it,
        attributes: {
            alpha: true,
            depth: true
        }, mousedown: function(event) {
            prev_mouse_pos = [event.offsetX, event.offsetY];
        }, mousemove: function(event) {
            if ((event.which & 1) && !event.shiftKey) {
                var deltaX =  (event.offsetX - prev_mouse_pos[0]) / zoom.get();
                var deltaY = -(event.offsetY - prev_mouse_pos[1]) / zoom.get();
                var delta = vec.make([deltaX, deltaY]);
                center.set(vec.minus(center.get(), delta));
                // console.log(center.get());
            }
            if ((event.which & 1) && event.shiftKey) {
                zoom.set(zoom.get() * (1.0 + (event.offsetY - prev_mouse_pos[1]) / 240));
            }
            prev_mouse_pos = [event.offsetX, event.offsetY];
            gl.display();
        }
    });
    gl.display();
});
