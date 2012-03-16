var gl;
var height = 480;

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
        position: Shade(position),
        name: names,
        node_elements: position.numItems,
        edge_elements: Facet.element_buffer(line_elements)
    };
}

function make_graph_batch(model, center, zoom)
{
    var camera = Facet.Camera.ortho({
        center: center,
        zoom: zoom,
        aspect_ratio: 720/480
    });

    var dots_batch = Facet.Marks.dots({
        elements: model.node_elements,
        position: camera(model.position),
        stroke_color: Shade.color("black"),
        fill_color: Shade.color("slategray", 0.8),
        point_diameter: zoom.mul(2000),
        stroke_width: zoom.mul(200)
    });

    var lines_batch = Facet.bake({
        type: 'lines',
        elements: model.edge_elements
    }, {
        position: Shade.vec(dots_batch.gl_Position.swizzle("xy"), 0.1),
        color: Shade.vec(1, 1, 1, 0.1),
        mode: Facet.DrawingMode.over
    });

    return {
        draw: function() {
            dots_batch.draw();
            lines_batch.draw();
        }
    };
}

var graph_batch;

function draw_it()
{
    gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
    if (graph_batch) {
        graph_batch.draw();
    }
}

$().ready(function () {
    var canvas = document.getElementById("webgl");
    var model;
    var graph;
    var center = Shade.parameter("vec2", vec.make([450, 450]));
    var zoom = Shade.parameter("float", 1/450);
    var prev_mouse_pos;
    jQuery.getJSON("graph_extras/1138_bus.graph",
                   function (data) {
                       graph = data;
                       model = make_graph_model(graph);
                       graph_batch = make_graph_batch(model, center, zoom);
                       gl.display();
                   });
    gl = Facet.init(canvas, {
        clearDepth: 1.0,
        clearColor: [0,0,0,0.2],
        display: draw_it,
        attributes: {
            alpha: true,
            depth: true
        }
        , mousedown: function(event) {
            prev_mouse_pos = [event.offsetX, event.offsetY];
        }, mousemove: function(event) {
            if ((event.which & 1) && !event.shiftKey) {
                var deltaX =  (event.offsetX - prev_mouse_pos[0]) / (height * zoom.get() / 2);
                var deltaY = -(event.offsetY - prev_mouse_pos[1]) / (height * zoom.get() / 2);
                var delta = vec.make([deltaX, deltaY]);
                center.set(vec.minus(center.get(), delta));
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
