/*
 * Lux.with_transformation(transformation, what) calls the function what() in a
 * context in which a new transformation is pushed onto the transform stack.
 * 
 * The transform stack is a wide generalization of the venerable OpenGL matrix stack.
 * Instead of multiplying one specific matrix of the fixed function pipeline, the Lux
 * transform stack changes the *appearance* parameter passed to Lux.bake. It can
 * be used to implement a regular matrix stack, but can also perform non-linear
 * transformations, apply arbitrary transformations to the color field, etc.
 * 
 * Some parts of Lux (Lux.Marks.center_zoom_interactor_brush, for example) need the
 * transformations to be invertible, so that the unprojection code works appropriately.
 * This is done by monkey-patching the transformation function with an "inverse" field,
 * which is itself a function that will perform the inverse transformation to the
 * appearance. If the inverse of a transformation is unknown or unavailable, it will
 * be assumed to be the identity function. This might have undesired side effects.
 * 
 */

Lux.with_transformation = function(transformation, what) {
    var ctx = Lux._globals.ctx;
    var old_stack, new_stack;
    old_stack = ctx._lux_globals.transform_stack;
    try {
        new_stack = old_stack.slice();
        ctx._lux_globals.transform_stack = new_stack;
        ctx._lux_globals.transform_stack.push(transformation);
        return what();
    } finally {
        ctx._lux_globals.transform_stack = old_stack;
    }
};

Lux.apply_transformation_stack = function(appearance, stack) 
{
    if (_.isUndefined(stack))
        stack = Lux._globals.ctx._lux_globals.transform_stack;

    var s = stack;
    var i = s.length;
    while (--i >= 0) {
        appearance = s[i](appearance);
    }
    return appearance;
};

Lux.apply_transformation_stack_inverse = function(appearance, stack) 
{
    if (_.isUndefined(stack))
        stack = Lux._globals.ctx._lux_globals.transform_stack;

    var s = stack;
    for (var i=0; i<s.length; ++i) {
        appearance = (s[i].inverse || function(i) { return i; })(appearance);
    }
    return appearance;
};
