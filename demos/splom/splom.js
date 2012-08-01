var S = Shade;

var gl;
var stroke_width;
var point_diameter;
var point_alpha;
var data;
var splom_row, splom_col;
var alive = false;
var has_selection;
var selection_col, selection_row, selection_u1, selection_v1, selection_u2, selection_v2;

var padding = 0.05;
var is_selecting = false;

//////////////////////////////////////////////////////////////////////////////

function data_buffers()
{
    var d = Data.flowers();
    var tt = Facet.Data.texture_table(d);
    var point_index = Facet.attribute_buffer({ vertex_array: _.range(tt.n_rows), item_size: 1 });
    
    return {
        sepalLength: tt.at(point_index, 0),
        sepalWidth:  tt.at(point_index, 1),
        petalLength: tt.at(point_index, 2),
        petalWidth:  tt.at(point_index, 3),
        species:     tt.at(point_index, 4),
        columns: ['sepalLength', 'sepalWidth', 'petalLength', 'petalWidth', 'species'],
        at: tt.at,
        n_rows: d.data.length,
        index: point_index,
        n_columns: 5
    };
}

function init_webgl()
{
    Facet.set_context(gl);
    data = data_buffers();

    var species_color = Shade.vec(Shade.Utils.choose(
        [Shade.vec(1, 0, 0),
         Shade.vec(0, 1, 0),
         Shade.vec(0, 0, 1)])(data.species), 0.5);

    var min_range = Shade.array([4.3, 2.0, 1.0, 0.1]);
    var max_range = Shade.array([7.9, 4.4, 6.9, 2.5]);

    has_selection = Shade.parameter("float", 0);
    selection_u1  = Shade.parameter("float", 0);
    selection_u2  = Shade.parameter("float", 0);
    selection_v1  = Shade.parameter("float", 0);
    selection_v2  = Shade.parameter("float", 0);
    selection_row = Shade.parameter("float", 0);
    selection_col = Shade.parameter("float", 0);

    splom_col     = Shade.parameter("float", 0);
    splom_row     = Shade.parameter("float", 0);

    var min_x = splom_col.add(  2*padding).div(4);
    var max_x = splom_col.add(1-2*padding).div(4);
    var min_y = splom_row.add(  2*padding).div(4);
    var max_y = splom_row.add(1-2*padding).div(4);

    var first_pick_id = Facet.fresh_pick_id(data.n_rows);

    var picked_color = Shade.mix(species_color, Shade.vec(1,1,1,1), 0.8);
    var dot_pick_id  = Shade.add(first_pick_id, data.index);

    var inside_interval = Shade(function(i, v1, v2) {
        var m = S.Scale.linear({ domain: [min_range.at(i), max_range.at(i)], 
                                 range: [2*padding, 1-2*padding] });
        var d = m(data.at(data.index, i));
        return d.ge(v1.min(v2)).and(d.le(v1.max(v2)));
    });

    var inside_box = 
             inside_interval(selection_col, selection_u1, selection_u2)
        .and(inside_interval(selection_row, selection_v1, selection_v2));

    var selection_color = inside_box.ifelse(species_color, Shade.color("gray", 0.3));
    var dot_color = has_selection.ne(0).ifelse(selection_color, species_color);

    var scatterplot_batch = Facet.Marks.scatterplot({
        elements: data.n_rows,
        x: data.at(data.index, splom_col),
        y: data.at(data.index, splom_row),
        x_scale: S.Scale.linear({ domain: [ min_range.at(splom_col), max_range.at(splom_col) ], 
                                  range: [ min_x, max_x ]}),
        y_scale: S.Scale.linear({ domain: [ min_range.at(splom_row), max_range.at(splom_row) ], 
                                  range: [ min_y, max_y ]}),
        fill_color: dot_color,
        stroke_color: dot_color,
        point_diameter: 10,
        mode: Facet.DrawingMode.over,
        pick_id: Shade.shade_id(dot_pick_id)
    });

    var scale = S.Scale.linear({ range: [-1, 1] });
    var el_row = function(index) { return index.mod(4); };
    var el_col = function(index) { return index.div(4).floor(); };
    var aligned_rects = Facet.Marks.aligned_rects({
        elements: 16,
        left:    function(index) { return scale(el_col(index).add(padding).div(4)); },
        right:   function(index) { return scale(el_col(index).add(1-padding).div(4)); },
        top:     function(index) { return scale(el_row(index).add(1-padding).div(4)); },
        bottom:  function(index) { return scale(el_row(index).add(padding).div(4)); },
        color:   Shade.vec(0,0,0,0.3),
        z:       0.1,
        pick_id: Shade.shade_id(0)
    });

    var selection_rect = Facet.Marks.aligned_rects({
        left:   scale(selection_u1.add(selection_col).div(4)),
        right:  scale(selection_u2.add(selection_col).div(4)),
        top:    scale(selection_v1.add(selection_row).div(4)),
        bottom: scale(selection_v2.add(selection_row).div(4)),
        color:  Shade.vec(1,1,1,0.2),
        elements: 1,
        mode: Facet.DrawingMode.over
    });

    Facet.Scene.add({
        draw: function() {
            aligned_rects.draw();
            for (var i=0; i<4; ++i) {
                for (var j=0; j<4; ++j) {
                    splom_row.set(i);
                    splom_col.set(j);
                    scatterplot_batch.draw();
                }
            }
            if (has_selection.get())
                selection_rect.draw();
        }
    });
}

$().ready(function() {
    var canvas = document.getElementById("splom");
    gl = Facet.init(canvas, { 
        clearColor: [0, 0, 0, 0],
        mousemove: function(event) {
            if (is_selecting) {
                var u = (event.facetX / 800 * 4);
                var v = (event.facetY / 800 * 4);
                var col = Math.floor(u);
                var row = Math.floor(v);

                u = u % 1;
                v = v % 1;
                
                if (col !== selection_col.get() ||
                    row !== selection_row.get())
                    return;
                selection_u2.set(u);
                selection_v2.set(v);
            }
            Facet.Scene.invalidate();
        },
        mousedown: function(event) {
            canvas.style.cursor = "crosshair";
            var u = (event.facetX / 800 * 4);
            var v = (event.facetY / 800 * 4);
            var col = Math.floor(u);
            var row = Math.floor(v);

            u = u % 1;
            v = v % 1;
            
            has_selection.set(true);
            is_selecting = true;
            selection_col.set(col);
            selection_row.set(row);
            selection_u1.set(u);
            selection_v1.set(v);
            selection_u2.set(u);
            selection_v2.set(v);
            
            Facet.Scene.invalidate();
        }, mouseup: function(event) {
            canvas.style.cursor = "default";
            if (selection_u1.get() === selection_u2.get() ||
                selection_v1.get() === selection_v2.get()) {
                has_selection.set(false);
                Facet.Scene.invalidate();
            }
            is_selecting = false;
        }
    });
    init_webgl();
    Facet.Picker.draw_pick_scene();
});
