var gl;
var height = 480;
var interactor;

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
    var position = Facet.attribute_buffer({ vertex_array: pos, item_size: 2});
    return {
        position: Shade(position),
        name: names,
        node_elements: position.numItems,
        edge_elements: Facet.element_buffer(line_elements)
    };
}

function make_graph_batch(model, center, zoom)
{
    var dots_batch = Facet.Marks.dots({
        elements: model.node_elements,
        position: interactor.camera(model.position),
        stroke_color: Shade.color("white", 0.9),
        fill_color: Shade.color("slategray", 0.9),
        point_diameter: zoom.mul(2000),
        stroke_width: zoom.mul(200)
    });

    var lines_batch = Facet.bake({
        type: 'lines',
        elements: model.edge_elements
    }, {
        position: interactor.camera(Shade(model.position, -0.1)),
        color: Shade.vec(0, 0, 0, 0.2),
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
    var center = Shade.parameter("vec2", vec.make([450, 450]));
    var prev_mouse_pos;
    
    interactor = Facet.UI.center_zoom_interactor({
        width: 720, height: 480, zoom: 1/450, center: vec.make([450, 450]), widest_zoom: 1/450
    });

    jQuery.getJSON("graph_extras/1138_bus.graph",
                   function (data) {
                       var graph = data;
                       var model = make_graph_model(graph);
                       graph_batch = make_graph_batch(model, center, interactor.zoom);
                       gl.display();
                   });
    gl = Facet.init(canvas, {
        clearDepth: 1.0,
        clearColor: [0, 0, 0, 0.05],
        display: draw_it,
        interactor: interactor
    });
    gl.display();
});
