/*
 * Scenes conform to the actor interface. Scenes can then
   contain other scenes, and have hierarchical structure. Currently,
   "sub-scenes" cannot have more than one parent. (If you're thinking
   about scene graphs and sharing, this means that, to you, Lux scenes
   are actually "scene trees".)

 */
Lux.scene = function(opts)
{
    opts = _.defaults(opts || {}, {
        context: Lux._globals.ctx,
        transform: function(i) { return i; },
        pre_draw: function() {},
        post_draw: function() {}
    });
    var ctx = opts.context;
    var transform = opts.transform;

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
        scene.draw();
        dirty = false;
        for (i=0; i<post.length; ++i)
            post[i]();
    }

    var batch_list = [];
    var actor_list = [];
    var parent_scene = undefined;
    var scene = {
        context: ctx,
        get_transform: function() { return transform; },

        add: function(actor) {
            actor_list.push(actor);
            var result = actor.dress(this);
            batch_list.push(result);
            this.invalidate(undefined, undefined, ctx);
            return result;
        }, 

        //////////////////////////////////////////////////////////////////////
        /*
         * animate starts a continuous stream of animation
         * refresh triggers. It returns an object with a single field
         * "stop", which is a function that when called will stop the
         * refresh triggers.
         */

        animate: function(tick_function) {
            if (parent_scene)
                return parent_scene.animate(tick_function);
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
         * scene.invalidate triggers a scene redraw using
         * requestAnimFrame.  It takes two callbacks to be called respectively
         * before the scene is drawn and after. 
         * 
         * The function allows many different callbacks to be
         * invoked by a single requestAnimFrame handler. This guarantees that
         * every callback passed to scene.invalidate during the rendering
         * of a single frame will be called before the invocation of the next scene 
         * redraw.
         * 
         * If every call to invalidate issues a new requestAnimFrame, the following situation might happen:
         * 
         * - during scene.render:
         * 
         *    - object 1 calls scene.invalidate(f1, f2) (requestAnimFrame #1)
         * 
         *    - object 2 calls scene.invalidate(f3, f4) (requestAnimFrame #2)
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
            if (parent_scene) {
                parent_scene.invalidate(pre_display, post_display);
                return;
            }
            if (!dirty) {
                dirty = true;
                window.requestAnimFrame(function() { return draw_it(); });
            }
            if (pre_display) {
                pre_display_list.push(pre_display);
            }
            if (post_display) {
                post_display_list.push(post_display);
            }
        },


        //////////////////////////////////////////////////////////////////////
        // actor interface

        on: function(event_name, event) {
            for (var i=0; i<actor_list.length; ++i) {
                if (!actor_list[i].on(event_name, event))
                    return false;
            }
            return true;
        },

        dress: function(scene) {
            parent_scene = scene;
            var that = this;
            // reset transform, then re-add things to batch list.
            transform = function(appearance) {
                appearance = opts.transform(appearance);
                appearance = parent_scene.get_transform()(appearance);
                return appearance;
            };
            transform.inverse = function(appearance) {
                appearance = parent_scene.get_transform().inverse(appearance);
                appearance = opts.transform.inverse(appearance);
                return appearance;
            };
            // FIXME ideally we'd have a well-defined cleanup of batches; I
            // think the current implementation below might leak.
            batch_list = _.map(actor_list, function(actor) {
                return actor.dress(that);                
            });
            return this;
        },

        //////////////////////////////////////////////////////////////////////
        // batch interface

        draw: function() {
            opts.pre_draw();
            for (var i=0; i<batch_list.length; ++i) {
                batch_list[i].draw();
            }
            opts.post_draw();
        }

    };
    return scene;
};

Lux.default_scene = function(opts)
{
    opts = _.clone(opts);
    opts.transform = function(appearance) {
        appearance = _.clone(appearance);
        if (!_.isUndefined(appearance.screen_position))
            appearance.position = appearance.screen_position;
        // return Shade.canonicalize_program_object(appearance);
        return appearance;
    };
    opts.transform.inverse = function(i) { return i; };
    var scene = Lux.scene(opts);
    var ctx = scene.context;

    var clearColor, clearDepth;

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

    // FIXME this is kind of ugly, but would otherwise requiring changing the picker infrastructure
    // quite a bit. Since the picker infrastructure should be overhauled anyway,
    // we stick with this hack until we fix everything.
    function clear() {
        switch (ctx._lux_globals.batch_render_mode) {
        case 1:
        case 2:
            ctx.clearDepth(clearDepth);
            ctx.clearColor(0,0,0,0);
            break;
        case 0:
            ctx.clearDepth(clearDepth);
            ctx.clearColor.apply(ctx, clearColor);
            break;
        default:
            throw new Error("Unknown batch rendering mode");
        }
        ctx.clear(ctx.COLOR_BUFFER_BIT | ctx.DEPTH_BUFFER_BIT);
    }
    scene.add({
        dress: function(scene) { return { draw: clear }; },
        on: function() { return true; }
    });
    return scene;
};
