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
// http://javascript.crockford.com/remedial.html

// Notice that Lux.type_of is NOT EXACTLY equal to
// 
//   http://javascript.crockford.com/remedial.html
//
// In particular, Lux.type_of will return "object" if given Shade expressions
// 
// Shade expressions are actually functions with a bunch of extra methods.
// 
// This is something of a hack, but it is the simplest way I know of to get
// operator() overloading, which turns out to be notationally quite powerful.
//

Lux.type_of = function(value) 
{
    var s = typeof value;
    if (s === 'function' && value._lux_expression)
        return 'object'; // shade expression
    if (s === 'object') {
        if (value) {
            if (typeof value.length === 'number'
                 && !(value.propertyIsEnumerable('length'))
                 && typeof value.splice === 'function')  { // typed array
                s = 'array';
            }
        } else {
            s = 'null';
        }
    }
    return s;
};
