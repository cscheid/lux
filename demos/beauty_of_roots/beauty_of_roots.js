var gl;
var points_batch;
var rb, rb_batch;
var pointsize, pointweight;
var interactor;

//////////////////////////////////////////////////////////////////////////////

function center_zoom_interactor(opts)
{
    opts = _.defaults(opts, {
        mouse_move: function() {},
        mouse_down: function() {},
        mouse_wheel: function() {},
        center: vec.make([0,0]),
        zoom: 1
    });

    var height = opts.height;
    var width = opts.width;
    var center = Shade.parameter("vec2", opts.center);
    var zoom = Shade.parameter("float", opts.zoom);
    
    var prev_mouse_pos;
    function mouse_down(event) {
        prev_mouse_pos = [event.offsetX, event.offsetY];
        opts.mouse_down(event);
    }
    function mouse_move(event) {
        if ((event.which & 1) && !event.shiftKey) {
            var deltaX =  (event.offsetX - prev_mouse_pos[0]) / (height * zoom.get() / 2);
            var deltaY = -(event.offsetY - prev_mouse_pos[1]) / (height * zoom.get() / 2);
            var delta = vec.make([deltaX, deltaY]);
            center.set(vec.minus(center.get(), delta));
        } else if ((event.which & 1) && event.shiftKey) {
            zoom.set(zoom.get() * (1.0 + (event.offsetY - prev_mouse_pos[1]) / 240));
        }
        prev_mouse_pos = [ event.offsetX, event.offsetY ];
        opts.mouse_move(event);
        Facet.Scene.invalidate();
    }
    function mouse_wheel(event, delta, deltaX, deltaY) {
        zoom.set(zoom.get() * (1.0 - deltaY / 15));
        opts.mouse_wheel(event, delta, deltaX, deltaY);
        Facet.Scene.invalidate();
    }

    var aspect_ratio = Shade.parameter("float", width/height);
    var camera = Shade.Camera.ortho({
        center: center,
        zoom: zoom,
        aspect_ratio: aspect_ratio
    });

    return {
        camera: camera,
        center: center,
        zoom: zoom,

        resize: function(w, h) {
            aspect_ratio.set(w/h);
            width = w;
            height = h;
            Facet.Scene.invalidate();
        },

        mouse_down: mouse_down,
        mouse_move: mouse_move,
        mouse_wheel: mouse_wheel
    };
}

function draw_it()
{
    rb.with_bound_buffer(function() {
        gl.clear(gl.COLOR_BUFFER_BIT);
        if (points_batch)
            points_batch.draw();
    });
    rb_batch.draw();
}

function update_camera() {
    gl.display();
};

function parameter_slider(element, parameter, opts)
{
    opts = _.defaults(opts, {
        min: 0,
        max: 1,
        orientation: "horizontal",
        slide: function() {},
        change: function() {}
    });

    var slider_min = 0,
        slider_max = 1000;

    function to_slider(v) {
        return (v-opts.min) / (opts.max - opts.min) * 
            (slider_max - slider_min) + slider_min;
    }
    function to_parameter(v) {
        return (v-slider_min) / (slider_max - slider_min) *
            (opts.max - opts.min) + opts.min;
    }

    $(element).slider({
        min: slider_min,
        max: slider_max,
        value: to_slider(parameter.get()),
        orientation: opts.orientation,
        slide: function() {
            var v = to_parameter($(element).slider("value"));
            parameter.set(v);
            opts.slide(parameter, v);
            Facet.Scene.invalidate();
        },
        change: function() {
            var v = to_parameter($(element).slider("value"));
            parameter.set(v);
            opts.change(parameter, v);
            Facet.Scene.invalidate();
        }
    });
}

function init_gui()
{
    parameter_slider("#pointsize",   pointsize,   { min: 0, max: 10 });
    parameter_slider("#pointweight", pointweight, { min: 0, max: 1  });

    $("#set_center").click(function() {
        var x = Number($("#realvalue").val()),
            y = Number($("#imagvalue").val());
        if (!isNaN(x) && !isNaN(y)) {
            interactor.center.set(vec.make([x, y]));
            update_camera();
        }
    });
    $(window).resize(function(eventObject) {
        if (!rb)
            return;
        var w = window.innerWidth;
        var h = window.innerHeight;
        interactor.resize(w, h);
        gl.resize(w, h);
        rb.resize(w, h);
        gl.display();
    });
}

$().ready(function() {
    pointsize = Shade.parameter("float", 2.5);
    pointweight = Shade.parameter("float", 0.5);
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

    interactor = center_zoom_interactor({
        width: width,
        height: height,
        zoom: 2/3
    });

    // FIXME That hardcoded 240 should be computed based on screen size or something
    gl = Facet.init(canvas, {
        clearDepth: 1.0,
        clearColor: [0,0,0,1],
        display: draw_it,
        attributes: {
            alpha: true,
            depth: true
        },
        mousedown: interactor.mouse_down,
        mousemove: interactor.mouse_move
    });

    $(canvas).bind('mousewheel', interactor.mouse_wheel);

    rb = Facet.render_buffer({ width: width, height: height, type: gl.FLOAT });
    rb_batch = rb.make_screen_batch(function(texel_at_uv) {
        return Shade.vec(1,1,1,2)
            .sub(Shade.Utils.lerp([Shade.color("white"),
                                   Shade.color("#d29152"),
                                   Shade.color("sienna"),
                                   Shade.color("black")])(texel_at_uv.at(0).add(1).log()));
    });

    Facet.Net.binary(["data/roots_real.raw", "data/roots_imag.raw"], function (obj) {
        var x = Facet.attribute_buffer({ vertex_array: new Float32Array(obj["data/roots_real.raw"]), item_size: 1});
        var y = Facet.attribute_buffer({ vertex_array: new Float32Array(obj["data/roots_imag.raw"]), item_size: 1});
        var points_model = Facet.model({
            x: x,
            y: y,
            type: "points"
        });
        var pt = Shade.vec(points_model.x, points_model.y);
        points_batch = Facet.bake(points_model, {
            position: interactor.camera(pt),
            mode: Facet.DrawingMode.additive,
            
            //color: Shade.round_dot(Shade.vec(0.1,0,0,1)),
            color: Shade.pointCoord().sub(Shade.vec(0.5, 0.5))
                .norm().pow(2).neg()
                .mul(20)
                .exp()
                .mul(pointweight)
                .mul(interactor.zoom.pow(0.33))
                .mul(Shade.color("white")),
            gl_PointSize: interactor.zoom.pow(0.5).mul(pointsize)
        });
        $("#loading").fadeOut(500);
        gl.display();
    });
    gl.display();
});
