/*
 * Shade is the javascript DSL for writing GLSL shaders, part of Lux.
 * 
 */

// FIXME: fix the constant-index-expression hack I've been using to get around
// restrictions. This will eventually be plugged by webgl implementors.

var Shade = function(exp)
{
    return Shade.make(exp);
};

Lux.Shade = Shade;

(function() {

Shade.debug = false;
