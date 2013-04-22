/*
 * Shade is the javascript DSL for writing GLSL shaders, part of Lux.
 * 
 */

// FIXME: fix the constant-index-expression hack I've been using to get around
// restrictions. This will eventually be plugged by webgl implementors.

// FIXME: Move this object inside Lux's main object.

var Shade = function(exp)
{
    return Shade.make(exp);
};

(function() {

Shade.debug = false;
