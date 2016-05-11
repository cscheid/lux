/*
 * Lux.onContext returns a wrapped callback that guarantees that the passed
 * callback will be invoked with the given current context. 
 * 
 * This is primarily used to safeguard pieces of code that need to work under
 * multiple active WebGL contexts.
 */
Lux.onContext = function(theCtx, f)
{
    return function() {
        Lux.setContext(theCtx);
        f.apply(this, arguments);
    };
};
