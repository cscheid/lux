var gl;
var global_seed_offset;
var is_running = false;
var batch_size = 500;
var interactor;

// we need something quick and dirty and with word size < 24...
// http://en.wikipedia.org/wiki/MINSTD#Parameters_in_common_use
// These were used on the ZX Spectrum (!)
function next_rng(v) {
    return v.mul(75).mod(65537);
}

function iterate_at_random(fs)
{
    var l = fs.length;
    return function(v) {
        var choice = v.seed.div(65537).mul(l);
        var next = next_rng(v.seed);
        var result = fs[l-1](v); // fall-through
        for (var i=l-2; i>=0; --i) {
            var current = fs[i](v);
            result = {
                pos: Shade.ifelse(choice.le(i+1), current.pos, result.pos),
                col: Shade.ifelse(choice.le(i+1), current.col, result.col),
                seed: Shade.ifelse(choice.le(i+1), current.seed, result.seed)
            };
        }
        return result;
    };
}

var affine = function(a, b, c, d, e, f)
{
    return function(v) {
        return Shade.vec(v.x().mul(a).add(v.y().mul(b)).add(c),
                         v.x().mul(d).add(v.y().mul(e)).add(f));
    };
};

////////////////////////////////////////////////////////////////////////////////
// variations

var variations = {
    linear: function(v) { return v; },
    cylinder: function(v) { return Shade.vec(v.x().sin(), v.y()); },
    sinusoidal: function(v) { return Shade.sin(v); },
    spherical: function(v) {
        var r2 = v.x().mul(v.x()).add(v.y().mul(v.y())).add(1e-6);
        return v.div(r2);
    },
    swirl: function(v) {
        var r2 = v.x().mul(v.x()).add(v.y().mul(v.y())).add(1e-6);
        var c1 = r2.sin(), c2 = r2.cos();
        var nx = c1.mul(v.x()).sub(c2.mul(v.y()));
        var ny = c2.mul(v.x()).add(c1.mul(v.y()));
        return Shade.vec(nx, ny);
    },
    horseshoe: function(v) {
        var x = v.x(), y = v.y();
        var r2 = x.mul(x).add(y.mul(y)).add(1e-6);
        var r = Shade.sqrt(r2);
        return Shade.vec(x.sub(y).mul(x.add(y)),x.mul(y).mul(2)).div(r);
    },
    polar: function (v) {
        var x = v.x(), y = v.y();
        var r2 = x.mul(x).add(y.mul(y)).add(1e-6);
        var r = Shade.sqrt(r2);
        var theta = Shade.atan(x.div(y));
        return Shade.vec(theta.div(Math.PI), r.sub(1));
    },
    handkerchief: function(v) {
        var x = v.x(), y = v.y();
        var r2 = x.mul(x).add(y.mul(y)).add(1e-6);
        var r = Shade.sqrt(r2);
        var theta = Shade.atan(x.div(y));
        return Shade.vec(theta.add(r).sin(), theta.sub(r).cos()).mul(r);
    }
};

var variation_names = [];
var affine_xform_params = [];
(function() {
    for (var i=0; i<4; ++i) {
        var lst = [];
        for (var j=0; j<6; ++j) {
            lst.push(Shade.parameter("float", Math.random()-0.5));
        }
        affine_xform_params.push(lst);
    }
})();

function create_function(variation, affine_parameters, color)
{
    function ewma(back, front)
    {
        var weight = 0.1;
        return front.mul(weight).add(back.mul(1-weight));
    };

    return function(v) {
        var pos = v.pos, col = v.col, seed = v.seed;
        return {
            pos: variation(affine.apply(this, affine_parameters)(pos), seed),
            col: ewma(col, color),
            seed: next_rng(seed)
        };
    };
}

var hue = Shade.parameter("float", Math.random() * 2 * Math.PI - Math.PI);
var hue_rotation = Shade.parameter("float", Math.PI/2);
var iterate_f5 = (function() {
    var result = [];
    var total_size = 4;
    var variation_name_index = [];
    for (var k in variations)
        variation_name_index.push(k);
    for (var i=0; i<total_size; ++i) {
        var u = Math.random() * variation_name_index.length;
        // var name = "spherical";
        var name = variation_name_index[~~u];
        variation_names.push(name);
        var variation = variations[name];
        var affine_xform = affine_xform_params[i];
        var color = Shade.Colors.hcl(hue.add(hue_rotation.mul(i)), 80, 80);
        result.push(create_function(variation, affine_xform, color.swizzle("rgb")));
    }
    return iterate_at_random(result);
})();

function make_points_batch()
{
    var x = new Float32Array(batch_size * batch_size);
    var y = new Float32Array(batch_size * batch_size);
    var r = new Float32Array(batch_size * batch_size);
    function update_random() {
        for (var i=0; i<batch_size; ++i)
            for (var j=0; j<batch_size; ++j) {
                x[i * batch_size + j] = (i + Math.random()) / batch_size * 2 - 1;
                y[i * batch_size + j] = (j + Math.random()) / batch_size * 2 - 1;
                r[i * batch_size + j] = ~~(Math.random() * 65536);
            }
    }
    update_random();
    var bx     = Facet.attribute_buffer({ vertex_array: x, item_size: 1 });
    var by     = Facet.attribute_buffer({ vertex_array: y, item_size: 1 });
    var b_seed = Facet.attribute_buffer({ vertex_array: r, item_size: 1 });

    var model = Facet.model({
        x: bx, y: by, seed: b_seed, type: "points"
    });
    
    var start = {
        seed: model.seed.add(global_seed_offset).mod(65536),
        pos: Shade.vec(model.x, model.y),
        col: Shade.vec(0,0,0)
    };

    var state = start;
    for (var i=0; i<10; ++i) {
        state = iterate_f5(state);
    }

    var batch =  Facet.bake(model, {
        mode: Facet.DrawingMode.additive,
        position: interactor.camera(state.pos.swizzle("xy")),
        color: Shade.vec(state.col, 1)
    }, {
        force_no_pick: true,
        force_no_unproject: true
    });

    return {
        draw: function() { batch.draw(); },
        update_random: function() {
            update_random();
            bx.set(x);
            by.set(y);
            b_seed.set(r);
        }
    };
}

var global_scale = Shade.parameter("float", 1);
var gamma = Shade.parameter("float", 1);

function offscreen_batch()
{
    var count_scale = Shade.parameter("float", 1);
    var vibrancy = 1.0;
    var gamma_value = Shade.div(1.0, gamma);
    var rb = Facet.render_buffer({ width: 720, height: 600, type: gl.FLOAT });
    function clear() {
        rb.with_bound_buffer(function() {
            // ugly...
            gl.clearColor(1,1,1,1);
            gl.clear(gl.COLOR_BUFFER_BIT);
        });
    }
    clear();
    var rb_batch = rb.make_screen_batch(function(texel_at_uv) {
        var scale = texel_at_uv.a().log().div(texel_at_uv.a()).mul(count_scale);
        var pregamma = texel_at_uv.mul(scale);
        var alpha_gamma_factor = pregamma.a().pow(gamma_value).div(pregamma.a());
        var rgb_gamma_factor = pregamma.swizzle("rgb").pow(Shade.vec(gamma_value, gamma_value, gamma_value)).div(pregamma.swizzle("rgb"));
        var vibrancy_factor = Shade.mix(rgb_gamma_factor, 
                                        Shade.vec(alpha_gamma_factor, alpha_gamma_factor, alpha_gamma_factor), 
                                        vibrancy);

        var rgb_color = pregamma.swizzle("rgb").mul(vibrancy_factor).mul(global_scale);
        return Shade.vec(rgb_color, 1);
    });
    var points_batch = make_points_batch();

    return {
        draw: function() {
            if (is_running) {
                rb.with_bound_buffer(function() {
                    points_batch.draw();
                });
            }
            rb_batch.draw();
        },
        update_random: function() {
            points_batch.update_random();
        },
        clear: function() {
            clear();
        },
        count_scale: count_scale
    };
};

$().ready(function() {
    var main_batch;
    function change_xform_param(evt, obj)
    {
        var i = Number(evt.target.id[1])-1,
            j = evt.target.id.charCodeAt(0)-97;
        affine_xform_params[i][j].set(obj.value / 100);
        main_batch.clear();
    }
    function change_global_scale(evt, obj)
    {
        global_scale.set(obj.value / 100);
        Facet.Scene.invalidate();
    }
    function change_hue(evt, obj)
    {
        hue.set(obj.value / 100 * Math.PI);
        main_batch.clear();
    }
    function change_hue_rotation(evt, obj)
    {
        hue_rotation.set(obj.value / 100 * Math.PI);
        main_batch.clear();
    }
    function change_gamma(evt, obj)
    {
        gamma.set(obj.value / 100);
        Facet.Scene.invalidate();
    }
    var canvas = document.getElementById("webgl");
    interactor = Facet.UI.center_zoom_interactor({
        width: 640, height: 480, zoom: 1,
        mousemove: function(event) { 
            if (event.which & 1)
                main_batch.clear(); 
        },
        mousewheel: function() { main_batch.clear(); }
    });
    flame_parse("flames/ex0.xml", function(d) {
        sheep = d;
        interactor.center.set(vec.make(d.center));
        interactor.zoom.set(1.0/d.scale);
        main_batch = offscreen_batch();
        Facet.Scene.add(main_batch);
    });
    gl = Facet.init(canvas, {
        interactor: interactor
    });
    for (var i=0; i<4; ++i) {
        $("#name" + (i+1)).text(variation_names[i]);
        for (var j=0; j<6; ++j) {
            $("#" + String.fromCharCode(97+j) + (i+1)).slider({
                min:-100, max:100, value: affine_xform_params[i][j].get()*100,
                orientation: "horizontal",
                slide: change_xform_param,
                change: change_xform_param
            });
        }
    };
    $("#global-scale").slider({
        min: 0, max: 500, value: 100,
        orientation: "horizontal",
        slide: change_global_scale,
        change: change_global_scale
    });
    $("#gamma").slider({
        min: 10, max: 290, value: 100,
        orientation: "horizontal",
        slide: change_gamma,
        change: change_gamma
    });
    $("#hue").slider({
        min: -100, max: 100, value: hue.get() / (2 * Math.PI) * 100,
        orientation: "horizontal",
        slide: change_hue,
        change: change_hue
    });
    $("#hue-rotation").slider({
        min: -100, max: 100, value: 25,
        orientation: "horizontal",
        slide: change_hue_rotation,
        change: change_hue_rotation
    });
    $("#run-it").button();
    $("#run-it").change(function() {
        if (is_running) {
            is_running = false;
        } else {
            is_running = true;
            main_loop();
        }
    });
    global_seed_offset = Shade.parameter("float", 0);
    // var main_batch = offscreen_batch();
    // Facet.Scene.add(main_batch);
    var frame_count = 0;
    var main_loop = function() {
        if (is_running) {
            window.requestAnimFrame(main_loop);
        }
        frame_count++;
        main_batch.count_scale.set(1/Math.log(frame_count-1));
        var offset = global_seed_offset.get();
        if (offset == 20) {
            console.log("click", offset * batch_size * batch_size);
            offset = 0;
            main_batch.update_random();
        }
        global_seed_offset.set(offset+1);
        Facet.Scene.invalidate();
    };
    is_running = true;
    main_loop();
});
