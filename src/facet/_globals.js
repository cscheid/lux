// yucky globals used throughout Facet. I guess this means I lost.
//
////////////////////////////////////////////////////////////////////////////////

/* FIXME there should be one globals object per WebGL context.

 When fixing Facet so that it works in multiple-context
 situations, all the globals scattered throughout Facet should be
 collected here.

*/

Facet._globals = {
    ctx: undefined,
     // stores the active webgl context

    display_callback: undefined,
    // when Facet.init is called with a display callback, it gets stored in
    // _globals.display_callback

    batch_render_mode: 0
    // batches can currently be rendered in "draw" or "pick" mode.

    // draw: 0
    // pick: 1

    // these are indices into an array defined inside Facet.bake

    // For legibility, they should be strings, but for speed, they'll be integers.
};
