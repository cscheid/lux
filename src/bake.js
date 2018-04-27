import { LuxError } from './luxError.js';
import _ from 'lodash';
import { canonicalizeAppearance } from './canonicalizeAppearance.js';
import { freshId } from './freshId.js';
import Lux from './lux.js';

var previousBatchOpts = {};

function getCurrentBatchOpts()
{
  return previousBatchOpts;
};

function unloadBatch()
{
  if (!previousBatchOpts._ctx)
    return;
  var ctx = previousBatchOpts._ctx;
  if (previousBatchOpts.attributes) {
    for (var key in previousBatchOpts.attributes) {
      ctx.disableVertexAttribArray(previousBatchOpts.program[key]);
    }
    previousBatchOpts.program.uniforms.forEach(function (uniform) {
      delete uniform._luxActiveUniform;
    });
  }

  if (previousBatchOpts.polygonOffset) {
    ctx.disable(ctx.POLYGON_OFFSET_FILL);
  }

  // reset the opengl capabilities which are determined by
  // Lux.DrawingMode.*
  ctx.disable(ctx.DEPTH_TEST);
  ctx.disable(ctx.BLEND);
  ctx.depthMask(true);

  previousBatchOpts = {};
};

function drawIt(batchOpts)
{
  if (_.isUndefined(batchOpts))
    throw new LuxError("drawing mode undefined");

  // When the batchOptions object is different from the one previously drawn,
  // we must set up the appropriate state for drawing.
  if (batchOpts.batchId !== previousBatchOpts.batchId) {
    var attributes = batchOpts.attributes || {};
    var uniforms = batchOpts.uniforms || {};
    var program = batchOpts.program;
    var key;

    unloadBatch();
    previousBatchOpts = batchOpts;
    batchOpts.setCaps();

    var ctx = batchOpts._ctx;
    ctx.useProgram(program);

    for (key in attributes) {
      var attr = program[key];
      if (!_.isUndefined(attr)) {
        ctx.enableVertexAttribArray(attr);
        var buffer = attributes[key].get();
        if (!buffer) {
          throw new LuxError("Unset attribute for batch " + attributes[key]._attributeName);
        }
        buffer.bind(attr);
      }
    }

    var currentActiveTexture = 0;
    program.uniforms.forEach(function(uniform) {
      var key = uniform.uniformName;
      var call = uniform.uniformCall,
          value = uniform.get();
      if (_.isUndefined(value)) {
        throw new LuxError("parameter " + key + " has not been set.");
      }
      var t = Shade.Types.typeOf(value);
      if (t.equals(Shade.Types.otherT)) {
        uniform._luxActiveUniform = (function(uid, cat) {
          return function(v) {
            ctx.activeTexture(ctx.TEXTURE0 + cat);
            ctx.bindTexture(ctx.TEXTURE_2D, v);
            ctx.uniform1i(uid, cat);
          };
        })(program[key], currentActiveTexture);
        currentActiveTexture++;
      } else if (t.equals(Shade.Types.floatT) ||
                 t.equals(Shade.Types.boolT) ||
                 t.repr().substr(0,3) === "vec") {
        uniform._luxActiveUniform = (function(call, uid) {
          return function(v) {
            call.call(ctx, uid, v);
          };
        })(ctx[call], program[key]);
      } else if (t.repr().substr(0,3) === "mat") {
        uniform._luxActiveUniform = (function(call, uid) {
          return function(v) {
            ctx[call](uid, false, v);
          };
        })(call, program[key]);
      } else {
        throw new Error("could not figure out parameter type! " + t);
      }
      uniform._luxActiveUniform(value);
    });
  }

  batchOpts.drawChunk();
}

var largestBatchId = 1;

function bake(model, appearance, opts)
{
  appearance = canonicalizeAppearance(appearance);
  // opts = _.defaults(opts || {}, {
  //     forceNoDraw: false,
  //     forceNoPick: false,
  //     forceNoUnproject: false
  // });
  var ctx = model._ctx || Lux._globals.ctx;

  if (_.isUndefined(appearance.gl_FragColor)) {
    appearance.gl_FragColor = function(v) {
      return Lux.vec4(1,1,1,1);
    };
  }

  // these are necessary outputs which must be compiled by Shade.program
  function isProgramOutput(key)
  {
    return ["color", "position", "pointSize",
            "gl_FragColor", "gl_Position", "gl_PointSize"].indexOf(key) != -1;
  };

  // if (appearance.gl_Position.type.equals(Shade.Types.vec2)) {
  //   appearance.gl_Position = Shade.vec(appearance.gl_Position, 0, 1);
  // } else if (appearance.gl_Position.type.equals(Shade.Types.vec3)) {
  //   appearance.gl_Position = Shade.vec(appearance.gl_Position, 1);
  // } else if (!appearance.gl_Position.type.equals(Shade.Types.vec4)) {
  //   throw new Error("position appearance attribute must be vec2, vec3 or vec4");
  // }

  var batchId = freshId();

  function buildAttributeArraysObj(prog) {
    return _.build(_.map(
      prog.attributeBuffers, function(v) { return [v._attributeName, v]; }
    ));
  }

  function createDrawProgram() {
    var result = {};
    _.each(appearance, function(value, key) {
      if (isProgramOutput(key)) {
        result[key] = value;
      }
    });
    return Lux.program(result);
  }

  var primitiveType = model.primitive;
  var elements = model.elements;
  var drawChunk;
  if (typeof elements === 'number') {
    drawChunk = function() {
      // it's important to use "model.elements" here instead of "elements" because
      // the indirection captures the fact that the model might have been updated with
      // a different number of elements, by changing the attribute buffers.
      //
      // FIXME This is a phenomentally bad way to go about this problem, but let's go with it for now.
      ctx.drawArrays(primitiveType, 0, model.elements);
    };
  } else {
    if (elements._shadeType === 'attributeBuffer') {
      drawChunk = function() {
        model.elements.draw(primitiveType);
      };
    } else if (elements._shadeType === 'elementBuffer') {
      drawChunk = function() {
        model.elements.bindAndDraw(primitiveType);
      };
    } else
      throw new LuxError("model.elements must be a number, an element buffer or an attribute buffer");
  }

  // FIXME the batchId field in the batchOpts objects is not
  // the same as the batchId in the batch itself.
  //
  // The former is used to avoid state switching, while the latter is
  // a generic automatic id which might be used for picking, for
  // example.
  //
  // This should not lead to any problems right now but might be confusing to
  // readers.

  function createBatchOpts(program, capsName) {
    function ensureParameter(v) {
      if (Lux.typeOf(v) === 'number')
        return Shade.parameter("float", v);
      else if (Lux.isShadeExpression(v) === 'parameter')
        return v;
      else throw new Error("expected float or parameter, got " + v + " instead.");
    }
    var result = {
      _ctx: ctx,
      program: program,
      attributes: buildAttributeArraysObj(program),
      setCaps: function() {
        var ctx = Lux._globals.ctx;
        var modeCaps = ((appearance.mode && appearance.mode[capsName]) ||
                        Lux.DrawingMode.standard[capsName]);
        modeCaps();
        if (this.polygonOffset) {
          ctx.enable(ctx.POLYGON_OFFSET_FILL);
          ctx.polygonOffset(this.polygonOffset.factor.get(),
                            this.polygonOffset.units.get());
        }
      },
      drawChunk: drawChunk,
      batchId: largestBatchId++
    };
    if (!_.isUndefined(appearance.polygonOffset))
      result.polygonOffset = {
        factor: ensureParameter(appearance.polygonOffset.factor),
        units: ensureParameter(appearance.polygonOffset.units)
      };
    return result;
  }

  var drawOpts;

  drawOpts = createBatchOpts(createDrawProgram(), "setDrawCaps");

  var result = {
    model: model,
    batchId: batchId,
    draw: function() {
      drawIt(drawOpts);
    }
  };
  return result;
};

exports.getCurrentBatchOpts = getCurrentBatchOpts;
exports.unloadBatch = unloadBatch;
exports.bake = bake;
