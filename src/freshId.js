// Call this to get a guaranteed unique range of ids.
// Useful to avoid name conflicts between automatic ids and
// user-defined ids.

var latestId = 1;

function freshId(quantity)
{
    quantity = quantity || 1;
    var result = latestId;
    latestId += quantity;
    return result;
};

exports.freshId = freshId;
