// run-time type information helper functions
// 
// All of this would be unnecessary if Javascript was SML. Alas,
// Javascript is no SML.
// 
//////////////////////////////////////////////////////////////////////////////

// returns false if object is not a Shade expression, or returns
// the AST type of the shade expression.
//
// For example, in some instances it is useful to know whether the
// float value comes from a constant or a GLSL uniform or an attribute 
// buffer.
Lux.is_shade_expression = function(obj)
{
    return typeof obj === 'function' && obj._lux_expression && obj.expression_type;
};

//////////////////////////////////////////////////////////////////////////////

// FIXME Can I make these two the same function call?
function lux_constant_type(obj)
// it is convenient in many places to accept as a parameter a scalar,
// a vector or a matrix. This function tries to
// tell them apart. Functions such as vec.make and mat.make populate
// the .buffer._type slot. This is ugly, but extremely convenient.
{
    var t = typeof obj;
    if (t === "boolean")         return "boolean";
    if (t === "number")          return "number";
    if (obj) {
        var b = obj._type;
        if (!_.isUndefined(b))
            return b;
        if (!_.isUndefined(obj.buffer) && obj.buffer._type)
            return obj.buffer._type;
        else
            return "other";
    }
    return t;
}

//////////////////////////////////////////////////////////////////////////////
// http://javascript.crockford.com/remedial.html

// Notice that lux_typeOf is NOT EXACTLY equal to
// 
//   http://javascript.crockford.com/remedial.html
//
// In particular, lux_typeOf will return "object" if given Shade expressions.
// 
// Shade expressions are actually functions with a bunch of extra methods.
// 
// This is something of a hack, but it is the simplest way I know of to get
// operator() overloading, which turns out to be notationally quite powerful.
//

function lux_typeOf(value) 
{
    var s = typeof value;
    if (s === 'function' && value._lux_expression)
        return 'object';
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
