(function() {

var active = false;
var rb;

Facet.picker = {
    is_active: function() {
        return active;        
    },
    draw_pick_scene: function() {
        var ctx = Facet._globals.ctx;
        active = true;
    },
};
