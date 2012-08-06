/*
 * Facet.on_context returns a wrapped callback that guarantees that the passed
 * callback will be invoked with the given current context. 
 * 
 * This is primarily used to safeguard pieces of code that need to work under
 * multiple active WebGL contexts.
 */
Facet.on_context = function(the_ctx, f)
{
    return function() {
        Facet.set_context(the_ctx);
        f.apply(this, arguments);
    };
};
