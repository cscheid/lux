var gl;
var points_batch;
var globe;
var view_proj;

//////////////////////////////////////////////////////////////////////////////

function get_buffers(urls, alldone)
{
    var obj = {};
    var done = _.after(urls.length, alldone);

    function handler(buffer, url) {
        obj[url] = Facet.attribute_buffer({ vertex_array: new Float32Array(buffer), item_size: 1 });
        done(obj);
    };
    _.each(urls, function(url) {
        Facet.Net.buffer_ajax(url, handler);
    });
};

function draw_it()
{
    view_proj.set(mat4.product(Facet.perspective(20 / globe.zoom, 720/480, 0.1, 100.0),
                               Facet.translation(0, 0, -6)));
    globe.draw();
    gl.clear(gl.DEPTH_BUFFER_BIT);
                  
    points_batch && points_batch.draw();
}

$().ready(function() {
    var canvas = document.getElementById("webgl");
    gl = Facet.init(canvas, {
        clearDepth: 1.0,
        clearColor: [1,1,1,1],
        display: draw_it,
        attributes: {
            alpha: true,
            depth: true
        },
        mousedown: function(event) {
            globe.mousedown(event);
        },
        mouseup: function(event) {
            globe.mouseup(event);
        },
        mousemove: function(event) {
            globe.mousemove(event);
        }
    });

    view_proj = Shade.parameter("mat4");

    globe = Facet.Marks.globe({
        view_proj: view_proj
    });

    get_buffers(["/demos/data/lats.raw", "/demos/data/lons.raw",
                "/demos/data/type.raw"], 
                function (obj) {
                    var lats = obj["/demos/data/lats.raw"];
                    var lons = obj["/demos/data/lons.raw"];
                    
                    var points_model = Facet.model({
                        x: lats,
                        y: lons,
                        incident_type: type,
                        type: "points"
                    });

                    var colormap = Shade.Utils.choose([Shade.color("red"),
                                                       Shade.color("black"),
                                                       Shade.color("yellow"),
                                                       Shade.color("cyan"),
                                                       Shade.color("red"),
                                                       Shade.color("cyan"),
                                                       Shade.color("cyan")]);

                    points_batch = Facet.bake(points_model, {
                        position: view_proj
                            .mul(globe.model_matrix)
                            .mul(Facet.Scale.Geo.latlong_to_spherical(Shade.radians(lats),
                                                                      Shade.radians(lons))),
                        color: colormap(points_model.incident_type),
                        point_size: 1
                    });
                    gl.display();
                });
    gl.display();
});
