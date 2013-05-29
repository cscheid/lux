Lux.scene = function(opts)
{
    opts = _.defaults(opts || {}, {
        context: Lux._globals.ctx,
        clearDepth: 1.0,
        clearColor: [1,1,1,0],
        transform: function(i) { return i; }
    });
    var ctx = opts.context;
    var clearColor;
    var clearDepth;
    var transform = opts.transform;

    if (Lux.is_shade_expression(opts.clearColor)) {
        if (!opts.clearColor.is_constant())
            throw new Error("clearColor must be constant expression");
        if (!opts.clearColor.type.equals(Shade.Types.vec4))
            throw new Error("clearColor must be vec4");
        clearColor = _.toArray(opts.clearColor.constant_value());
    } else
        clearColor = opts.clearColor;

    if (Lux.is_shade_expression(opts.clearDepth)) {
        if (!opts.clearDepth.is_constant())
            throw new Error("clearDepth must be constant expression");
        if (!opts.clearDepth.type.equals(Shade.Types.float_t))
            throw new Error("clearDepth must be float");
        clearDepth = opts.clearDepth.constant_value();
    } else
        clearDepth = opts.clearDepth;

    var dirty = false;
    var pre_display_list = [];
    var post_display_list = [];
    function draw_it() {
        Lux.set_context(ctx);
        var pre = pre_display_list;
        pre_display_list = [];
        var post = post_display_list;
        post_display_list = [];
        for (var i=0; i<pre.length; ++i)
            pre[i]();
        result.display();
        dirty = false;
        for (i=0; i<post.length; ++i)
            post[i]();
    }

    var batch_list = [];
    var actor_list = [];
    var result = {
        get_transform: function() { return transform; },
        display: function() {
            
        },

        //////////////////////////////////////////////////////////////////////

        add: function(actor) {
            actor_list.push(actor);
            batch_list.push(actor.dress(this));
            this.invalidate(undefined, undefined, ctx);
        }, 

        //////////////////////////////////////////////////////////////////////
        /*
         * animate starts a continuous stream of animation
         * refresh triggers. It returns an object with a single field
         * "stop", which is a function that when called will stop the
         * refresh triggers.
         */

        animate: function(tick_function) {
            if (_.isUndefined(tick_function)) {
                tick_function = _.identity;
            }
            var done = false;
            var that = this;
            function f() {
                that.invalidate(
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
        },

        /*
         * Lux.Scene.invalidate triggers a scene redraw using
         * requestAnimFrame.  It takes two callbacks to be called respectively
         * before the scene is drawn and after. 
         * 
         * The function allows many different callbacks to be
         * invoked by a single requestAnimFrame handler. This guarantees that
         * every callback passed to Lux.Scene.invalidate during the rendering
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
        invalidate: function(pre_display, post_display) {
            if (!dirty) {
                dirty = true;
                window.requestAnimFrame(function() { 
            }
        }
    };
};
