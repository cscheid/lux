Facet.Scene.invalidate = function()
{
    if (!Facet._globals.ctx._facet_globals.dirty) {
        Facet._globals.ctx._facet_globals.dirty = true;
        var this_ctx = Facet._globals.ctx;
        function draw_it() {
            Facet.set_context(this_ctx);
            this_ctx.display();
            this_ctx._facet_globals.dirty = false;
        }
        window.requestAnimFrame(draw_it, this_ctx);
    }
};
