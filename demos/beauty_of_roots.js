var gl;
var points_batch;

//////////////////////////////////////////////////////////////////////////////

function get_buffers(urls, alldone)
{
    var obj = {};
    var done = _.after(urls.length, alldone);

    function handler(buffer, url) {
        obj[url] = Facet.attribute_buffer(new Float32Array(buffer), 1);
        done(obj);
    };
    _.each(urls, function(url) {
        Facet.Net.buffer_ajax(url, handler);
    });
};

function draw_it()
{
    points_batch && points_batch.draw();
}

$().ready(function() {
    var canvas = document.getElementById("webgl");
    gl = Facet.init(canvas, {
        clearDepth: 1.0,
        clearColor: [0,0,0,1],
        display: draw_it,
        attributes: {
            alpha: true,
            depth: true
        }
    });

    var camera = Facet.Camera.ortho({
        left: -1.5, right: 1.5, bottom: -1.5, top: 1.5,
        aspect_ratio: 720/480
    });

    get_buffers(["data/roots_real.raw", "data/roots_imag.raw"], 
                function (obj) {
                    var x = obj["data/roots_real.raw"];
                    var y = obj["data/roots_imag.raw"];
                    
                    var points_model = Facet.model({
                        x: x,
                        y: y,
                        type: "points"
                    });
                    var pt = Shade.vec(points_model.x, points_model.y, 0, 1);
                    points_batch = Facet.bake(points_model, {
                        position: camera.project(pt),
                        color: Shade.color("white"),
                        gl_PointSize: 2
                    });
                    console.log("HERE!");
                    gl.display();
                });
    gl.display();
});
