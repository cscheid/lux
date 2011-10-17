/*
 * Shade is the javascript DSL for writing GLSL shaders, part of Facet.
 * 
 */

// FIXME: fix the constant-index-expression hack I've been using to get around
// restrictions. This will eventually be plugged by webgl implementors.

// FIXME: Move this object inside Facet's main object.

var Shade = {};

(function() {

Shade.debug = false;
