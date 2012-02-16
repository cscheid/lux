// FIXME Can I make these two the same function call?
function facet_constant_type(obj)
// it is convenient in many places to accept as a parameter a scalar,
// a vector or a matrix. This function tries to
// tell them apart. Functions such as vec.make and mat.make populate
// the _type slot. This is ugly, but extremely convenient.
{
    var t = typeof obj;
    if (t === "boolean")         return "boolean";
    if (t === "number")          return "number";
    if (obj) {
        t = obj._type;
        if (!t)                      return "other";
    }
    return t;
}

//////////////////////////////////////////////////////////////////////////////
// http://javascript.crockford.com/remedial.html

function facet_typeOf(value) 
{
    var s = typeof value;
    if (s === 'object') {
        if (value) {
            if (typeof value.length === 'number' &&
                !(value.propertyIsEnumerable('length')) &&
                typeof value.splice === 'function') {
                s = 'array';
            }
        } else {
            s = 'null';
        }
    }
    return s;
}
