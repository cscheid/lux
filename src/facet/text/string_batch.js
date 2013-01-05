(function() {

function parse_typeface_instructions(glyph)
{
    // convert the string of typeface instructions coming from a typeface.js glyph
    // representation to a list of "paths", each path being a list of points
    // which are the glyph "internal polygon", and a list of "ears", the quadratic
    // splines that are to be rendered using Loop-Blinn.

    // this function mutates the passed glyph to memoize the result for increased
    // performance.

    if (_.isUndefined(glyph.o))
        return [];

    var x, y, cpx, cpy;
    var ops = _.map(glyph.o.split(" "), function(e) {
        var n = Number(e);
        return isNaN(n) ? e : n;
    });
    ops = ops.slice(0, ops.length-1);

    var paths = [];
    var points = [];
    var quadratic_ears = [];
    var current_point = undefined, control_point;
    var next_point = undefined;
    var pc = 0;
    var quadratic_sign, opcode;
    while (pc < ops.length) {
        switch (opcode = ops[pc++]) {
        case "m":
            if (points.length || quadratic_ears.length) {
                paths.push({points: points,
                            ears: quadratic_ears});
                points = [];
                quadratic_ears = [];
            }
            x = ops[pc++];
            y = ops[pc++];
            current_point = vec.make([x, y]);
            break;
        case "q":
            x = ops[pc++];
            y = ops[pc++];
            cpx = ops[pc++];
            cpy = ops[pc++];
            next_point = vec.make([x, y]);
            control_point = vec.make([cpx, cpy]);
            quadratic_sign = vec.cross(vec.minus(control_point, current_point),
                                       vec.minus(next_point, control_point));
            quadratic_sign = quadratic_sign / Math.abs(quadratic_sign);
            quadratic_ears.push([current_point, control_point, next_point, quadratic_sign]);

            if (quadratic_sign < 0) {
                if (current_point)
                    points.push(current_point);
                current_point = next_point;
            } else {
                if (current_point)
                    points.push(current_point);
                points.push(control_point);
                current_point = next_point;
            }
            break;
        case "l":
            if (current_point)
                points.push(current_point);
            x = ops[pc++];
            y = ops[pc++];
            current_point = vec.make([x, y]);
            break;
        default:
            throw "Unsupported opcode '" + opcode + "'";
        };
    }
    if (points.length || quadratic_ears.length)
        paths.push({points: points,
                    ears: quadratic_ears});

    return paths;
}

function merge_paths(paths)
{
    /*

    merge_paths takes a sequence of simply-connected subpaths from
    a glyph which might contain holes and returns contiguous, 
    simply-connected subpaths by connecting hole contours to their enclosing contours
    through the closest pair of points between them.
    
    I've taken the idea from Three.JS's FontUtils.js:
    
    https://github.com/mrdoob/three.js/blob/7aba6e974350dd7fdac5d399b19e28b32079ffa4/src/extras/FontUtils.js

    That file points out that the technique comes from the following post:
    http://www.sakri.net/blog/2009/06/12/an-approach-to-triangulating-polygons-with-holes/

    Note especially one of the comments therein, which points out that
    using polygon endpoints as proxies for polygon's endpoints is not
    the correct approach, since the closest endpoint might actually
    cross important bits of the enclosing polygon.  A real solution
    must find the closest *point on each of the polygon*, possibly
    further tesselating each contours. Since this involves potentially
    finding the closest pair of points between two quadratic curves
    (or, worse, a closest pair between cubics for open-type fonts, which is
    a sixth-degree root-finding problem if I have my math right!), I
    don't want to implement the real solution right now.

    In addition, the current algorithm does not implement quadratic
    curve refinement, which is also necessary whenever the convex
    hulls of any quadratic ears overlap. This might cause additional
    artifacts.

    I would love to hear from whomever finds an open-source TTF file
    in the wild for which this algorithm breaks.

*/

    // we assume all paths are simple and non-intersecting.
    // 
    // If your glyphs have non-simple or intersecting paths, your
    // glyphs are bad, and you should feel bad.

    if (paths.length === 0)
        return [];

    function flip_quadratic_ear(ear)
    {
        // a quadratic ear is represented by a list where
        // ear[0..2] are the points in the quadratic bezier, and ear[3] is
        // the quadratic discriminant, either 1 or -1 for quadratic curves.
        // The discriminant chooses which side of the ear to paint.

        return [ear[2], ear[1], ear[0], ear[3]];
    }
    
    function contour_area(path) {
        // returns the signed area of the internal polygon. used to determine
        // whether the contour is a hole inside another contour.
        // ccw paths have positive area, cw paths have negative area.
        if (path.points.length === 0)
            return 0;
        var area = 0;
        var current_point = path.points[path.points.length-1];
        _.each(path.points, function(point) {
            area += vec.cross(current_point, point);
            current_point = point;
        });
        return area / 2;
    }

    function reverse_path(path) {
        var new_points = path.points.slice().reverse();
        var new_ears = _.map(path.ears, flip_quadratic_ear);
        return {
            points: new_points,
            ears: new_ears
        };
    }

    // first, we canonicalize the paths by forcing all of the paths to be CCW.
    paths = _.map(paths, function(path) {
        return (contour_area(path) < 0) ? reverse_path(path) : path;
    });

    // now, for each path, we determine the "contains" relationship, in reduced form.
    // http://en.wikipedia.org/wiki/Transitive_reduction
    function determine_contains(paths) {
        // this test returns *false* if point is on triangle lines.
        function is_point_in_triangle(pt, tri, pts) {
            var subtris = [{ points: [pt, pts[tri[0]], pts[tri[1]]] },
                           { points: [pt, pts[tri[1]], pts[tri[2]]] },
                           { points: [pt, pts[tri[2]], pts[tri[0]]] }];
            var subareas = _.map(subtris, contour_area);
            function same_sign(v1, v2) {
                if (v1 < 0 && v2 < 0)
                    return true;
                if (v1 > 0 && v2 > 0)
                    return true;
                if (v1 === 0 && v2 === 0)
                    return true;
                return false;
            }
            // point is inside triangle if all subtriangle signed
            // areas are either positive or negative.
            if (_.all(subareas, function(v) { return v !== 0; })) {
                return _.all(subareas, function(v) { return same_sign(subareas[0], v); });
            } else {
                // some subarea is zero. In this case, the point must lie on some of the lines. 
                // We will check this by testing that distance(a, b) + distance(b, c) = distance(a, c)
                // (with some eps)
                function ddist(l) {
                    return vec2.length(vec2.minus(l[2], l[0])) + 
                        vec2.length(vec2.minus(l[1], l[0])) - 
                        vec2.length(vec2.minus(l[2], l[1]));
                }
                var eps = 0.001;
                return _.all(ddist, function(d) { return d < eps; });
            }
            return result;
        }
        var triangulations = _.map(paths, function(p) { return Facet.Geometry.triangulate({contour: p.points}); });
        function is_inside(i1, i2) {
            // returns true if paths[i1] is inside paths[i2], 
            // again assuming paths are simple and non-intersecting;
            var point_inside_poly = function(point) {
                function point_in_tri(tri) {
                    return is_point_in_triangle(point, tri, paths[i2].points);
                }
                var result = _.any(triangulations[i2], point_in_tri);
                return result;
            };
            var result = _.all(paths[i1].points, point_inside_poly);
            return result;
        }
        var result = _.map(triangulations, function() { 
            return _.map(triangulations, function() { return 0; });
        });
        for (var i=0; i<triangulations.length; ++i)
            for (var j=0; j<triangulations.length; ++j) {
                if (i === j)
                    continue;
                if (is_inside(i, j)) {
                    result[j][i] = 1;
                }
            }
        // http://stackoverflow.com/questions/1690953/transitive-reduction-algorithm-pseudocode
        for (i=0; i<triangulations.length; ++i)
            for (var j=0; j<triangulations.length; ++j)
                for (var k=0; k<triangulations.length; ++k)
                    if (result[i][j] && result[j][k])
                        result[i][k] = 0;
        return result;
    }

    var contains = determine_contains(paths);
    // then, assuming the paths are simple and non-intersecting,
    // the outer polygons can be matched to their respective "hole" contours
    // by traversing the reduced contains relationship

    function match_contours(paths, contains) {
        // match_contours mutates the contains parameter!

        var in_degrees = [], curves_in_play = {};
        for (var i=0; i<contains.length; ++i) {
            in_degrees[i] = 0;
            curves_in_play[i] = true;
        }
        for (i=0; i<contains.length; ++i) {
            for (var j=0; j<contains.length; ++j) {
                if (contains[i][j])
                    in_degrees[j]++;
            }
        }
        function find_index_of(lst, f) {
            for (var i=0; i<lst.length; ++i) {
                if (f(lst[i], i))
                    return i;
            }
            return -1;
        }
        var source;
        var result = [];
        while ((source = find_index_of(in_degrees, function(d, i) { 
            return d === 0 && curves_in_play[i];
        })) !== -1) {
            // collect source together with all direct descendants
            var curves = _.filter(_.range(contains.length), function(i) { return contains[source][i] === 1; });
            curves.push(source);
            result.push(curves);
            // update in-degrees and available_curves
            _.each(curves, function(curve) {
                delete curves_in_play[curve];
                for (var j=0; j<contains.length; ++j) {
                    if (contains[curve][j]) {
                        in_degrees[j]--;
                    }
                }
            });
        }
        return result;
    }

    // now, we collect the lists of subpaths punctuated by the reverse-winding paths.
    var subpaths = _.map(match_contours(paths, contains), function(curves) {
        return _.map(curves, function(curve, i) {
            if (i === curves.length-1)
                return reverse_path(paths[curve]);
            else
                return paths[curve];
        });
    });

    function merge_contour(c1, c2) {
        // precondition: c1 is a ccw path, c2 is a cw path
        //
        // return value is a new cw contour which stitches the pair together.
        //
        // as described above, this algorithm is not correct, but it seems
        // to work for TTF files in the wild, and is much simpler than the correct
        // one.
        var best_c1_index, best_c2_index, best_l2;
        _.each(c1.points, function(p1, i) {
            _.each(c2.points, function(p2, j) {
                var this_l2 = vec2.length2(vec2.minus(p1, p2));
                if (!(best_l2 < this_l2)) {
                    best_l2 = this_l2;
                    best_c1_index = i;
                    best_c2_index = j;
                }
            });
        });
        var merged_ears = c1.ears.concat(_.map(c2.ears, flip_quadratic_ear));
        var merged_points =
            [].concat(c2.points.slice(0, best_c2_index+1), // c2[0..best_c2+1)
                      c1.points.slice(best_c1_index),      // c1[best_c1..end)
                      c1.points.slice(0, best_c1_index+1), // c1[0..best_c1+1)
                      c2.points.slice(best_c2_index));     // c2[best_c2..end)
        return {
            points: merged_points,
            ears: merged_ears
        };
    }

    // finally, we merge all contours
    return _.map(subpaths, function(subpath) { 
        return _.foldr(subpath, function(a, b) { return merge_contour(b, a); });
    });
};

var loop_blinn_batch = function(opts) {
    var position_function = opts.position;
    var color_function = opts.color;
    
    function quadratic_discriminator(model) {
        var u = model.uv.x(), v = model.uv.y(), 
        winding = model.winding.sign();
        return u.mul(u).sub(v).mul(winding);
    }
    
    function quadratic_discard(exp, model) {
        return exp.discard_if(quadratic_discriminator(model).gt(0));
    };

    var model = {};
    var uv = Facet.attribute_buffer({vertex_array: [0,0], item_size: 2});
    var winding = Facet.attribute_buffer({vertex_array: [0], item_size: 1});
    var position = Facet.attribute_buffer({vertex_array: [0,0], item_size: 2});
    var internal_position_attribute = Facet.attribute_buffer({vertex_array: [0,0], item_size: 2});
    var elements = Facet.element_buffer([0]); // {vertex_array: []});
    
    var ears_model = Facet.model({
        uv: uv,
        position: position,
        winding: winding,
        elements: 1,
        type: "triangles"
    });
    var x_offset = Shade.parameter("float", 0);
    var y_offset = Shade.parameter("float", 0);
    var offset = Shade.vec(x_offset, y_offset);
    var ears_position = Shade.add(ears_model.position, offset);
    var ears_batch = Facet.bake(ears_model, {
        position: position_function(ears_position.div(1000).mul(opts.size)),
        color: quadratic_discard(color_function(ears_position), ears_model)
    });
    var internal_model = Facet.model({
        vertex: internal_position_attribute,
        elements: elements
    });
    var internal_position = Shade.add(internal_model.vertex, offset);
    var internal_batch = Facet.bake(internal_model, {
        // point_size: 10,
        position: position_function(internal_position.div(1000).mul(opts.size)),
        elements: internal_model.elements,
        color: color_function(internal_position)
    });
    return {
        ears_batch: ears_batch,
        ears_model: ears_model,
        internal_batch: internal_batch,
        internal_model: internal_model,
        x_offset: x_offset,
        y_offset: y_offset
    };
};

function glyph_to_model(glyph)
{
    if (_.isUndefined(glyph._model)) {
        var paths = merge_paths(parse_typeface_instructions(glyph));
        if (paths.length === 0)
            return undefined;

        var elements = [], vertex = [], uv = [], position = [], winding = [];
        _.each(paths, function(path) {
            var prev_npoints = vertex.length / 2;
            var tris = Facet.Geometry.triangulate({ contour: path.points });
            _.each(path.points, function(vec) {
                vertex.push.apply(vertex, vec);
            });
            _.each(tris, function(tri) {
                elements.push(tri[0]+prev_npoints);
                elements.push(tri[1]+prev_npoints);
                elements.push(tri[2]+prev_npoints);
            });
            _.each(path.ears, function(ear) {
                winding.push.apply(winding, [-ear[3], -ear[3], -ear[3]]);
                position.push.apply(position, ear[0]);
                position.push.apply(position, ear[1]);
                position.push.apply(position, ear[2]);
                uv.push.apply(uv, [0,0, 0.5,0, 1,1]);
            });
        });

        var internal_model = Facet.model({
            type: "triangles",
            vertex: Facet.attribute_buffer({vertex_array: vertex, item_size: 2, keep_array: true}), 
            elements: elements
        });

        var ears_model = Facet.model({
            uv: Facet.attribute_buffer({vertex_array: uv, item_size: 2, keep_array: true}),
            position: Facet.attribute_buffer({vertex_array: position, item_size: 2, keep_array: true}),
            winding: Facet.attribute_buffer({vertex_array: winding, item_size: 1, keep_array: true}),
            elements: uv.length/2,
            type: "triangles"
        });

        glyph._model = {
            ears_model: ears_model, 
            internal_model: internal_model
        };
    };
    return glyph._model;
}

Facet.Text.string_batch = function(opts) {
    var old_opts = opts;
    if (opts.batch) {
        return opts.batch;
    }
    opts = _.defaults(opts, {
        string: "",
        size: 10,
        align: "left",
        position: function(pos) { return Shade.vec(pos, 0, 1); },
        color: function(pos) { return Shade.color("white"); }
    });
    if (_.isUndefined(opts.font)) {
        throw "string_batch requires font parameter";
    }
    var batch = loop_blinn_batch(opts);
    old_opts.batch = batch;

    var result = {
        set: function(new_string) {
            opts.string = new_string;
        },
        advance: function(char_offset) {
            var result = 0;
            while (char_offset < opts.string.length &&
                   "\n\r".indexOf(opts.string[char_offset])) {
                result += opts.font.glyphs[opts.string[char_offset++]].ha;
            }
            return result;
        },
        alignment_offset: function(char_offset) {
            var advance = this.advance(char_offset);
            switch (opts.align) {
            case "left": return 0;
            case "right": return -advance;
            case "center": return -advance/2;
            default:
                throw "Facet.Text.string_batch.align must be one of 'left', 'center' or 'right'";
            }
        },
        // vertical_alignment_offset: function() {
        //     switch (opts.vertical_align) {
        //     case "baseline": return 0;
        //     case "middle": return -opts.font.lineHeight/2;
        //     case "top": return -opts.font.lineHeight;
        //         default:
        //         throw "Facet.Text.string_batch.vertical_align must be one of 'baseline', 'middle' or 'top'";
        //     };
        // },
        draw: function() {
            batch.x_offset.set(this.alignment_offset(0));
            batch.y_offset.set(0);
            for (var i=0; i<opts.string.length; ++i) {
                var c = opts.string[i];
                if ("\n\r".indexOf(c) !== -1) {
                    batch.x_offset.set(0);                    
                    batch.y_offset.set(batch.y_offset.get() - opts.font.lineHeight);
                    continue;
                }
                var glyph = opts.font.glyphs[c];
                if (_.isUndefined(glyph))
                    glyph = opts.font.glyphs['?'];
                var model = glyph_to_model(glyph);
                if (model) {
                    batch.ears_model.elements = model.ears_model.elements;
                    batch.ears_model.uv.set(model.ears_model.uv.get());
                    batch.ears_model.winding.set(model.ears_model.winding.get());
                    batch.ears_model.position.set(model.ears_model.position.get());
                    batch.internal_model.vertex.set(model.internal_model.vertex.get());
                    batch.internal_model.elements.set(model.internal_model.elements.array);
                    batch.ears_batch.draw();
                    batch.internal_batch.draw();
                }
                batch.x_offset.set(batch.x_offset.get() + glyph.ha);
            }
        }
    };
    return result;
};

})();
