// Call this to get a guaranteed unique range of picking ids.
// Useful to avoid name conflicts between automatic ids and
// user-defined ids.

(function() {

var latest_pick_id = 1;

Facet.fresh_pick_id = function(quantity)
{
    quantity = quantity || 1;
    var result = latest_pick_id;
    latest_pick_id += quantity;
    return result;
};

})();
