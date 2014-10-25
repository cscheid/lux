// Call this to get a guaranteed unique range of picking ids.
// Useful to avoid name conflicts between automatic ids and
// user-defined ids.

(function() {

var latestPickId = 1;

Lux.freshPickId = function(quantity)
{
    quantity = quantity || 1;
    var result = latestPickId;
    latestPickId += quantity;
    return result;
};

})();
