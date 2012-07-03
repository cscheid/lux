// we need something quick and dirty and with word size < 24...
// http://en.wikipedia.org/wiki/MINSTD#Parameters_in_common_use
// These were used on the ZX Spectrum (!)
function next_rng(v) {
    return v.mul(75).mod(65537);
}

function create_colormap(dom)
{
    var color_array = [];
    _.each(_.toArray(dom.getElementsByTagName("color")), function(el) {
        var index = Number(el.getAttribute("index"));
        var rgb = Shade.vec.apply(this, _.map(el.getAttribute("rgb").split(" "), Number));
        color_array[index] = rgb;
    });
    var shade_array = Shade.array(color_array);
    return Shade(function(v) {
        v = v.mul(255);
        var left_ix = v.floor();
        var right_ix = v.floor().add(1);
        var u = v.sub(left_ix);
        return Shade.mix(shade_array.at(left_ix),
                         shade_array.at(right_ix),
                         u);
    });
}

function parse_coefs(coefs)
{
    var coef_array = Shade.array(_.map(coefs.split(" "), Number));
    return Shade(function(vec) {
        var ox = vec.x(), oy = vec.y();
        var nx = ox.mul(coef_array.at(0))
            .add(oy.mul(coef_array.at(2)))
            .add(       coef_array.at(4));
        var ny = ox.mul(coef_array.at(1))
            .add(oy.mul(coef_array.at(3)))
            .add(       coef_array.at(5));
        return Shade.vec(nx, ny);
    });
}

function combine_color(old_color, new_color)
{
    return old_color.add(new_color).div(2);
}

var state = Shade(function(pos, color, seed)
{
    return {
        pos: function(new_pos) {
            if (_.isUndefined(new_pos))
                return pos;
            return state(new_pos, color, seed);
        },
        color: function(new_color) {
            if (_.isUndefined(new_color))
                return color;
            return state(pos, new_color, seed);
        },
        seed: function(new_seed) {
            if (_.isUndefined(new_seed))
                return seed;
            return state(pos, color, new_seed);
        },

        rand: function() {
            var result = seed.div(65537);
            return { result: result, state: this.seed(next_rng(seed)) };
        },

        lift: function(v) {
            return function(state) {
                return {
                    result: v,
                    state: state
                };
            };
        },

        ifelse: function(condition, k_true, k_false) {
            var test_result = condition(this);
            var test_passes = k_true(test_result.state);
            var test_fails = k_false(test_result.state);
            
            return { 
                result: Shade.ifelse(test_result.result, test_passes.result, test_fails.result),
                state: state(Shade.ifelse(test_result.result, test_passes.state.pos(),   test_fails.state.pos()),
                             Shade.ifelse(test_result.result, test_passes.state.color(), test_fails.state.color()),
                             Shade.ifelse(test_result.result, test_passes.state.seed(),  test_fails.state.seed()))
            };
        }
    };
});

function xform_shade_from_xform_element(element, colormap)
{
    var weight = Number(element.getAttribute("weight"));
    var color = Number(element.getAttribute("color"));

    var affine_xform = parse_coefs(element.getAttribute("coefs"));

    return { 
        weight: weight, 
        xform: function(state) {
            var new_affine = affine_xform(state.pos());
            var X = new_affine.x(), Y = new_affine.y();
            
            function rand() { 
                var r = state.rand();
                state = r.state;
                return r.result;
            };

            var handlers = {
                linear: function() {
                    return new_affine;
                },
                sinusoidal: function() {
                    return new_affine.sin();
                },
                spherical: function() {
                    var r2 = Shade.div(1, Shade.norm(new_affine).pow(2).add(1e-6));
                    return new_affine.mul(r2);
                },
                swirl: function() {
                    var r2 = Shade.norm(new_affine).pow(2);
                    var c1 = r2.sin(), c2 = r2.cos();
                    return Shade.vec(c1.mul(X).sub(c2.mul(Y)),
                                     c2.mul(X).add(c1.mul(Y)));
                },
                heart: function() {
                    var n = new_affine.norm();
                    var a = Shade.atan(new_affine.x(), new_affine.y()).mul(n);
                    return Shade.vec(a.sin(), a.cos().neg()).mul(n);
                },
                julia: function() {
                    var a = Shade.atan(new_affine.x(), new_affine.y()).div(2);
                    a = Shade.ifelse(rand().gt(0.5), a, a.add(Math.PI));
                    var r = new_affine.norm().sqrt();
                    var v = Shade.vec(a.cos(), a.sin());
                    return v.mul(r);
                },
                gaussian_blur: function() {
                    var ang = rand().mul(2 * Math.PI);
                    var a = Shade.vec(ang.cos(), ang.sin());
                    var r = rand().add(rand()).add(rand()).add(rand()).sub(2);
                    return a.mul(r);
                },
                disc: function() {
                    var a = Shade.atan(new_affine.x().mul(Math.PI),
                                       new_affine.y().mul(Math.PI)).div(Math.PI);
                    var r = new_affine.norm().mul(Math.PI);
                    var v = Shade.vec(r.sin(), r.cos());
                    return v.mul(a);
                },
                blur: function() {
                    var r = rand();
                    return Shade.vec(rand().mul(Math.PI * 2).cos(),
                                     rand().mul(Math.PI * 2).sin()).mul(r);
                },
                julian: function() {
                    var julian_dist = Number(element.getAttribute("julian_dist"));
                    var julian_power = Number(element.getAttribute("julian_power"));
                    var rN = Math.abs(julian_power);
                    var cn = julian_dist / julian_power / 2;
                    var rnd = rand().mul(rN).floor();

                    var a = Shade.atan(Y, X).add(Math.PI * 2).mul(rnd).div(julian_power);
                    var p = Shade.pow(new_affine.norm(), cn * 2);

                    return Shade.vec(Shade.cos(a), Shade.sin(a));
                }
            };

            var new_position = Shade.vec(0,0);
            _.each(handlers, function(v, k) {
                if (element.hasAttribute(k)) {
                    new_position = new_position.add(v().mul(weight));
                }
            });

            return state
                .pos(new_position)
                .color(combine_color(state.color(), color));
        }
    };
}

function flame_parse(url, k)
{
    $.ajax({
        url: url
    }).done(function(dom, status) {
        var colormap = create_colormap(dom);
        var xform_elements = _.toArray(dom.getElementsByTagName("xform"));
        // xform_elements.push.apply(xform_elements, _.toArray(dom.getElementsByTagName("finalxform")));
        var xform_shade_expressions = _.map(xform_elements, xform_shade_from_xform_element);
        var final_xform_element = _.toArray(dom.getElementsByTagName("xform"));

        var threshold_weights = [xform_shade_expressions[0].weight];
        for (var i=1; i<xform_shade_expressions.length; ++i) {
            threshold_weights.push(threshold_weights[threshold_weights.length-1] +
                                   xform_shade_expressions[i].weight);
        }
        var iteration = function(state) {
            function rand() { 
                var r = state.rand();
                state = r.state;
                return r.result;
            };

            var r = rand().mul(threshold_weights[threshold_weights.length-1]);
            
            var result = xform_shade_expressions[xform_shade_expressions.length-1].xform(state);

            for (var i=xform_shade_expressions.length-2; i>=0; --i) {
                var condition = r.le(threshold_weights[i]);
                result = result.ifelse(
                    state.lift(condition),
                    function(state) {
                        return { result: 0,
                                 state: xform_shade_expressions[i].xform(state)
                               };
                    }, function(state) {
                        return { result: 0, state: state };
                    }).state;
            }
            return result;
        };

        var flame_element = dom.getElementsByTagName("flame")[0];

        k({
            iteration: iteration,
            colormap: colormap,
            center: _.map(flame_element.getAttribute("center").split(" "), Number),
            scale: Number(flame_element.getAttribute("scale")),
            rotate: Number(flame_element.getAttribute("rotate"))
        });
    });
}
