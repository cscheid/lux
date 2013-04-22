/*
 * Lux.Scene.animate starts a continuous stream of animation refresh
 * triggers. It returns an object with a single field "stop", which is
 * a function that when called will stop the refresh triggers.
 */

Lux.Scene.animate = function(tick_function, ctx)
{
    if (_.isUndefined(ctx)) {
        ctx = Lux._globals.ctx;
    }
    if (_.isUndefined(tick_function)) {
        tick_function = _.identity;
    }
    var done = false;
    function f() {
        Lux.Scene.invalidate(
            function() {
                tick_function();
            }, function() { 
                if (!done) f();
            }, ctx);
    };
    f();

    return {
        stop: function() {
            done = true;
        }
    };
};
