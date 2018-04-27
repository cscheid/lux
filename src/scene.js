/*
 * Scenes conform to the actor interface. Scenes can then
   contain other scenes, and have hierarchical structure. Currently,
   "sub-scenes" cannot have more than one parent. (If you're thinking
   about scene graphs and sharing, this means that, to you, Lux scenes
   are actually "scene trees".)

*/

import _ from 'lodash';
import Lux from './lux.js';
import { setContext } from './setContext.js';
import { vec4 } from './vec.js';

function scene(opts)
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
    setContext(ctx);
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

    //////////////////////////////////////////////////////////////////////////
    /*
     * animate starts a continuous stream of animation refresh triggers.
     * It returns an object with a single field "stop", which is a function
     * that when called will stop the refresh triggers.
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
          () => tickFunction(),
          () => { if (!done) f(); },
          ctx);
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
     * requestAnimationFrame.  scene.invalidate takes two callbacks, called respectively
     * before the scene is drawn, and after the scene is drawn.
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

    //////////////////////////////////////////////////////////////////////////
    // actor interface

    on: function(eventName, event) {
      for (var i=0; i<actorList.length; ++i) {
        if (!actorList[i].on(eventName, event))
          return false;
      }
      return true;
    },

    dress: function(parentScene) {
      // reset transform, then re-add things to batch list.
      transform = function(appearanceFun) {
        appearanceFun = opts.transform(appearanceFun);
        appearanceFun = parentScene.getTransform()(appearanceFun);
        return appearanceFun;
      };
      transform.inverse = function(appearanceFun) {
        appearanceFun = parentScene.getTransform().inverse(appearanceFun);
        appearanceFun = opts.transform.inverse(appearanceFun);
        return appearanceFun;
      };
      // FIXME ideally we'd have a well-defined cleanup of batches; I
      // think the implementation below might leak.
      batchList = actorList.map(actor => actor.dress(this));
      return this;
    },

    //////////////////////////////////////////////////////////////////////////
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

function defaultScene(opts)
{
  opts = _.clone(opts);
  opts.transform = function(appearanceFun) {
    // FIXME there used to be a screenPosition hack here that we
    // dropped. Fix this later.
    return appearanceFun;
  };
  opts.transform.inverse = function(i) { return i; };
  opts = _.defaults(opts, {
    clearDepth: 1.0,
    clearColor: vec4(1,1,1,0)
  });
  var theScene = scene(opts);
  var ctx = theScene.context;
  var clearColor = opts.clearColor;
  var clearDepth = opts.clearDepth;

  function clear() {
    ctx.clearDepth(clearDepth);
    ctx.clearColor.apply(ctx, clearColor);
    ctx.clear(ctx.COLOR_BUFFER_BIT | ctx.DEPTH_BUFFER_BIT);
  }

  theScene.add({
    dress: function(_) { return { draw: clear }; },
    on: function() { return true; }
  });

  return theScene;
};

exports.scene = scene;
exports.defaultScene = defaultScene;
