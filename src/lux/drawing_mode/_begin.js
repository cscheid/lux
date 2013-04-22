// drawing mode objects can be part of the parameters passed to 
// Lux.bake, in order for the batch to automatically set the capabilities.
// This lets us specify blending, depth-testing, etc. at bake time.

/* FIXME This is double dispatch done wrong. See lux.org for details.
 */

Lux.DrawingMode = {};
