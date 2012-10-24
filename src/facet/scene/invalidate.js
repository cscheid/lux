/*
 * Facet.Scene.invalidate triggers a scene redraw using
 * requestAnimFrame.  It takes two callbacks to be called respectively
 * before the scene is drawn and after. 
 * 
 * The function allows many different callbacks to be
 * invoked by a single requestAnimFrame handler. This guarantees that
 * every callback passed to Facet.Scene.invalidate during the rendering
 * of a single frame will be called before the invocation of the next scene 
 * redraw.
 * 
 * If every call to invalidate issues a new requestAnimFrame, the following situation might happen:
 * 
 * - during scene.render:
 * 
 *    - object 1 calls Scene.invalidate(f1, f2) (requestAnimFrame #1)
 * 
 *    - object 2 calls Scene.invalidate(f3, f4) (requestAnimFrame #2)
 * 
 *    - scene.render ends
 * 
 * - requestAnimFrame #1 is triggered:
 * 
 *    - f1 is called
 * 
 *    - scene.render is called
 * 
 *    ...
 * 
 * So scene.render is being called again before f3 has a chance to run.
 * 
 */

(function() {

function draw_it(ctx) {
    Facet.set_context(ctx);

    // Pluck out all callbacks first to avoid infinite loops.
    var pre = ctx._facet_globals.pre_display_list;
    ctx._facet_globals.pre_display_list = [];
    var post = ctx._facet_globals.post_display_list;
    ctx._facet_globals.post_display_list = [];

    for (var i=0; i<pre.length; ++i)
        pre[i]();
    ctx.display();
    ctx._facet_globals.dirty = false;
    for (i=0; i<post.length; ++i)
        post[i]();
}

Facet.Scene.invalidate = function(pre_display, post_display, ctx)
{
    if (_.isUndefined(ctx)) {
        ctx = Facet._globals.ctx;
    }
    if (!ctx._facet_globals.dirty) {
        ctx._facet_globals.dirty = true;
        window.requestAnimFrame(function() { return draw_it(ctx); });
    }
    if (pre_display) {
        ctx._facet_globals.pre_display_list.push(pre_display);
    }
    if (post_display) {
        ctx._facet_globals.post_display_list.push(post_display);
    }
};

})();
