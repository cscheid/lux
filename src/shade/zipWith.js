// FIXME DO NOT POLLUTE GLOBAL NAMESPACE These really need to go someplace else.
function zipWith(f, l1, l2)
{
    var result = [];
    var l = Math.min(l1.length, l2.length);
    for (var i=0; i<l; ++i) {
        result.push(f(l1[i], l2[i]));
    }
    return result;
}

function zipWith3(f, l1, l2, l3)
{
    var result = [];
    var l = Math.min(l1.length, l2.length, l3.length);
    for (var i=0; i<l; ++i) {
        result.push(f(l1[i], l2[i], l3[i]));
    }
    return result;
}
