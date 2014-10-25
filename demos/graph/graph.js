var gl;
var height = 480;
var interactor;

function makeGraphModel(graph)
{
    var pos = [];
    var indices = {};
    var lineElements = [];
    var names = [];
    _.each(graph.nodes, function(node, i) {
        pos.push.apply(pos, node.position);
        indices[node.name] = i;
        names.push(node.name);
    });
    _.each(graph.edges, function(node, i) {
        lineElements.push(indices[node.source]);
        lineElements.push(indices[node.target]);
    });
    var position = Lux.attributeBuffer({ vertexArray: pos, itemSize: 2});
    return {
        position: Shade(position),
        name: names,
        nodeElements: position.numItems,
        edgeElements: Lux.elementBuffer(lineElements)
    };
}

function graphActors(model, center, zoom)
{
    return Lux.actorList([Lux.Marks.dots({
        elements: model.nodeElements,
        position: model.position,
        strokeColor: Shade.color("white", 0.9),
        fillColor: Shade.color("slategray", 0.9),
        pointDiameter: zoom.mul(2000),
        strokeWidth: zoom.mul(200)
    }), Lux.actor({
        model: { type: 'lines',
                 elements: model.edgeElements },
        appearance: {
            position: Shade(model.position, -0.1),
            color: Shade.vec(0, 0, 0, 0.2)
        }
    })]);
}

$().ready(function () {
    var canvas = document.getElementById("webgl");
    var center = Shade.parameter("vec2", vec.make([450, 450]));
    var prevMousePos;
    
    interactor = Lux.UI.centerZoomInteractor({
        width: 720, height: 480, zoom: 1/450, center: vec.make([450, 450]), widestZoom: 1/450
    });

    gl = Lux.init({
        clearDepth: 1.0,
        clearColor: [0, 0, 0, 0.05],
        interactor: interactor
    });

    jQuery.getJSON("graph_extras/1138_bus.graph",
                   function (data) {
                       var graph = data;
                       var model = makeGraphModel(graph);
                       Lux.Scene.add(graphActors(model, center, interactor.zoom));
                   });
});
