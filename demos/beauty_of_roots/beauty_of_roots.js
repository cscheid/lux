var gl;
var points_batch;
var rb, rb_batch;
var pointsize, pointweight;
var camera, center, zoom;
var aspect_ratio;

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
    rb.with_bound_buffer(function() {
        gl.clear(gl.COLOR_BUFFER_BIT);
        if (points_batch)
            points_batch.draw();
    });
    rb_batch.draw();
}

function change_pointsize()
{
    var new_value = $("#pointsize").slider("value") / 100.0;
    pointsize.set(new_value);
    gl.display();
}

function change_pointweight()
{
    var new_value = $("#pointweight").slider("value") / 1000.0;
    pointweight.set(new_value);
    gl.display();
}

function update_camera() {
    gl.display();
};

function init_gui()
{
    $("#pointsize").slider({
        min: 0, 
        max: 1000, 
        orientation: "horizontal",
        value: 250,
        slide: change_pointsize,
        change: change_pointsize
    });
    $("#pointweight").slider({
        min: 0, 
        max: 1000, 
        orientation: "horizontal",
        value: 500,
        slide: change_pointweight,
        change: change_pointweight
    });
    $("#set_center").click(function() {
        var x = Number($("#realvalue").val()),
            y = Number($("#imagvalue").val());
        if (!isNaN(x) && !isNaN(y)) {
            center.set(vec.make([x, y]));
            update_camera();
        }
    });
    $(window).resize(function(eventObject) {
        if (!rb)
            return;
        var w = window.innerWidth;
        var h = window.innerHeight;
        aspect_ratio.set(w/h);
        gl.resize(w, h);
        rb.resize(w, h);
        gl.display();
    });
}

$().ready(function() {
    init_gui();

    $("#greeting").click(function() {
        $("#greeting").fadeOut(500);
    });

    window.setTimeout(function() {
        $("#greeting").fadeOut(500);
    }, 15000);

    var prev_mouse_pos;
    var canvas = document.getElementById("webgl");
    var width = window.innerWidth, height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    center = Shade.parameter("vec2", vec.make([0, 0]));
    zoom = Shade.parameter("float", 2/3);
    pointsize = Shade.parameter("float", 2.5);
    pointweight = Shade.parameter("float", 0.5);

    // FIXME That hardcoded 240 should be computed based on screen size or something
    gl = Facet.init(canvas, {
        clearDepth: 1.0,
        clearColor: [0,0,0,1],
        display: draw_it,
        attributes: {
            alpha: true,
            depth: true
        }, mousedown: function(event) {
            prev_mouse_pos = [ event.offsetX, event.offsetY ];
        }, mousemove: function(event) {
            if ((event.which & 1) && !event.shiftKey) {
                var deltaX =  (event.offsetX - prev_mouse_pos[0]) / (height * zoom.get() / 2);
                var deltaY = -(event.offsetY - prev_mouse_pos[1]) / (height * zoom.get() / 2);
                var delta = vec.make([deltaX, deltaY]);
                center.set(vec.minus(center.get(), delta));
            } else if ((event.which & 1) && event.shiftKey) {
                zoom.set(zoom.get() * (1.0 + (event.offsetY - prev_mouse_pos[1]) / 240));
            }
            prev_mouse_pos = [ event.offsetX, event.offsetY ];
            update_camera();
        }
    });

    $(canvas).bind('mousewheel', function(event, delta, deltaX, deltaY) {
        zoom.set(zoom.get() * (1.0 - deltaY / 15));
        update_camera();
    });

    aspect_ratio = Shade.parameter("float", width/height);
    camera = Facet.Camera.ortho({
        center: center,
        zoom: zoom,
        aspect_ratio: aspect_ratio
    });

    rb = Facet.render_buffer({ width: width, height: height, type: gl.FLOAT });
    rb_batch = rb.make_screen_batch(function(texel_at_uv) {
        return Shade.vec(1,1,1,2)
            .sub(Shade.Utils.lerp([Shade.color("white"),
                                   Shade.color("#d29152"),
                                   Shade.color("sienna"),
                                   Shade.color("black")])(texel_at_uv.at(0).add(1).log()));
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
                    var pt = Shade.vec(points_model.x, points_model.y);
                    points_batch = Facet.bake(points_model, {
                        position: camera(pt),
                        mode: Facet.DrawingMode.additive,

                        //color: Shade.round_dot(Shade.vec(0.1,0,0,1)),
                        color: Shade.pointCoord().sub(Shade.vec(0.5, 0.5))
                                    .norm().pow(2).neg()
                                    .mul(20)
                                    .exp()
                                    .mul(pointweight)
                                    .mul(zoom.pow(0.33))
                                    .mul(Shade.color("white")),
                        gl_PointSize: zoom.pow(0.5).mul(pointsize)
                    });
                    $("#loading").fadeOut(500);
                    gl.display();
                });
    gl.display();
});
