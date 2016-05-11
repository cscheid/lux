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
        preDraw: function() {},
        postDraw: function() {}
    });
    var ctx = opts.context;
    var transform = opts.transform;

    var dirty = false;
    var preDisplayList = [];
    var postDisplayList = [];
    function drawIt() {
        Lux.setContext(ctx);
        var pre = preDisplayList;
        preDisplayList = [];
        var post = postDisplayList;
        postDisplayList = [];
        for (var i=0; i<pre.length; ++i)
            pre[i]();
        scene.draw();
        dirty = false;
        for (i=0; i<post.length; ++i)
            post[i]();
    }

    var batchList = [];
    var actorList = [];
    var parentScene = undefined;
    var scene = {
        context: ctx,
        getTransform: function() { return transform; },

        add: function(actor) {
            actorList.push(actor);
            var result = actor.dress(this);
            batchList.push(result);
            this.invalidate(undefined, undefined, ctx);
            return result;
        }, 

        remove: function(actor) {
            var i = actorList.indexOf(actor);
            if (i === -1)
                throw new Error("actor not found in scene");
            actorList.splice(i, 1);
            batchList.splice(i, 1);
            this.invalidate(undefined, undefined, ctx);
        },

        //////////////////////////////////////////////////////////////////////
        /*
         * animate starts a continuous stream of animation
         * refresh triggers. It returns an object with a single field
         * "stop", which is a function that when called will stop the
         * refresh triggers.
         */

        animate: function(tickFunction) {
            if (parentScene)
                return parentScene.animate(tickFunction);
            if (_.isUndefined(tickFunction)) {
                tickFunction = _.identity;
            }
            var done = false;
            var that = this;
            function f() {
                that.invalidate(
                    function() {
                        tickFunction();
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
         * requestAnimationFrame.  It takes two callbacks to be called respectively
         * before the scene is drawn and after. 
         * 
         * The function allows many different callbacks to be
         * invoked by a single requestAnimationFrame handler. This guarantees that
         * every callback passed to scene.invalidate during the rendering
         * of a single frame will be called before the invocation of the next scene 
         * redraw.
         * 
         * If every call to invalidate issues a new requestAnimationFrame, the following situation might happen:
         * 
         * - during scene.render:
         * 
         *    - object 1 calls scene.invalidate(f1, f2) (requestAnimationFrame #1)
         * 
         *    - object 2 calls scene.invalidate(f3, f4) (requestAnimationFrame #2)
         * 
         *    - scene.render ends
         * 
         * - requestAnimationFrame #1 is triggered:
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
        invalidate: function(preDisplay, postDisplay) {
            if (parentScene) {
                parentScene.invalidate(preDisplay, postDisplay);
                return;
            }
            if (!dirty) {
                dirty = true;
                window.requestAnimationFrame(function() { return drawIt(); });
            }
            if (preDisplay) {
                preDisplayList.push(preDisplay);
            }
            if (postDisplay) {
                postDisplayList.push(postDisplay);
            }
        },


        //////////////////////////////////////////////////////////////////////
        // actor interface

        on: function(eventName, event) {
            for (var i=0; i<actorList.length; ++i) {
                if (!actorList[i].on(eventName, event))
                    return false;
            }
            return true;
        },

        dress: function(scene) {
            parentScene = scene;
            var that = this;
            // reset transform, then re-add things to batch list.
            transform = function(appearance) {
                appearance = opts.transform(appearance);
                appearance = parentScene.getTransform()(appearance);
                return appearance;
            };
            transform.inverse = function(appearance) {
                appearance = parentScene.getTransform().inverse(appearance);
                appearance = opts.transform.inverse(appearance);
                return appearance;
            };
            // FIXME ideally we'd have a well-defined cleanup of batches; I
            // think the current implementation below might leak.
            batchList = _.map(actorList, function(actor) {
                return actor.dress(that);                
            });
            return this;
        },

        //////////////////////////////////////////////////////////////////////
        // batch interface

        draw: function() {
            opts.preDraw();
            for (var i=0; i<batchList.length; ++i) {
                batchList[i].draw();
            }
            opts.postDraw();
        }

    };
    return scene;
};

Lux.defaultScene = function(opts)
{
    opts = _.clone(opts);
    opts.transform = function(appearance) {
        appearance = _.clone(appearance);
        if (!_.isUndefined(appearance.screenPosition))
            appearance.position = appearance.screenPosition;
        // return Shade.canonicalizeProgramObject(appearance);
        return appearance;
    };
    opts.transform.inverse = function(i) { return i; };
    var scene = Lux.scene(opts);
    var ctx = scene.context;

    var clearColor, clearDepth;

    if (Lux.isShadeExpression(opts.clearColor)) {
        if (!opts.clearColor.isConstant())
            throw new Error("clearColor must be constant expression");
        if (!opts.clearColor.type.equals(Shade.Types.vec4))
            throw new Error("clearColor must be vec4");
        clearColor = _.toArray(opts.clearColor.constantValue());
    } else
        clearColor = opts.clearColor;

    if (Lux.isShadeExpression(opts.clearDepth)) {
        if (!opts.clearDepth.isConstant())
            throw new Error("clearDepth must be constant expression");
        if (!opts.clearDepth.type.equals(Shade.Types.floatT))
            throw new Error("clearDepth must be float");
        clearDepth = opts.clearDepth.constantValue();
    } else
        clearDepth = opts.clearDepth;

    // FIXME this is kind of ugly, but would otherwise requiring changing the picker infrastructure
    // quite a bit. Since the picker infrastructure should be overhauled anyway,
    // we stick with this hack until we fix everything.
    function clear() {
        switch (ctx._luxGlobals.batchRenderMode) {
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
