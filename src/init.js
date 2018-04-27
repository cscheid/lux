import _ from 'lodash';
import { LuxError } from './luxError.js';
import { setContext } from './setContext.js';

var luxContexts = {};

function initializeContextGlobals(gl, canvas) {
  canvas.gl = gl;

  // per-context globals
  var globals = {};
  gl._luxGlobals = globals;
  canvas._luxGlobals = globals;

  // batches can currently be rendered in "draw" or "pick" mode.
  // draw: 0
  // pick: 1
  // these are indices into an array defined inside Lux.bake
  // For legibility, they should be strings, but for speed, they'll be integers.
  globals.batchRenderMode = 0;
  globals.epoch = new Date().getTime() / 1000;
  globals.devicePixelRatio = undefined;
  globals.webglExtensions = {};

  globals.littleEndian = (() => {
    var buffer = new ArrayBuffer(2);
    new DataView(buffer).setInt16(0, 256, true);
    return new Int16Array(buffer)[0] === 256;
  })();
}

function init(opts)
{
  opts = _.defaults(opts || {}, {
    clearColor: [1,1,1,0],
    clearDepth: 1.0,
    attributes: {
      alpha: true,
      depth: true,
      preserveDrawingBuffer: true
    },
    highDPS: false
  });

  var canvas = opts.canvas;
  if (_.isUndefined(canvas)) {
    var q = document.querySelectorAll("canvas");
    if (q.length === 0) {
      throw new LuxError("no canvas elements found in document");
    } else if (q.length > 1) {
      throw new LuxError("more than one canvas element found in document; please specify which canvas to use with the 'canvas' parameter");
    } else {
      canvas = q[0];
    }
  }

  canvas.unselectable = true;
  canvas.onselectstart = () => false;

  var gl;
  var devicePixelRatio = 1;

  if (opts.fullSize) {
    var width = window.innerWidth, height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    // TODO - handle resize like https://webglfundamentals.org/webgl/lessons/webgl-anti-patterns.html
  }

  if (opts.highDPS) {
    devicePixelRatio = window.devicePixelRatio || 1;
    canvas.style.width = canvas.width + "px";
    canvas.style.height = canvas.height + "px";
    canvas.width = (canvas.clientWidth || canvas.width) * devicePixelRatio;
    canvas.height = (canvas.clientHeight || canvas.height) * devicePixelRatio;
  }

  if ("attributes" in opts) {
    gl = canvas.getContext("webgl", opts.attributes);
    var obtainedAttrs = gl.getContextAttributes();
    for (var key in opts.attributes) {
      if (opts.attributes[key] !== obtainedAttrs[key]) {
        throw new LuxError("requested attribute " + key + ": " + opts.attributes[key] +
                           " could not be satisfied (obtained " + obtainedAttrs[key] + " instead)");
      }
    }
  } else {
    gl = canvas.getContext("webgl");
  }
  if (gl === null) {
    throw new LuxError("Could not create WebGL context");
  }
  initializeContextGlobals(gl, canvas);

  gl._luxGlobals.devicePixelRatio = devicePixelRatio;

  // FIXME; interaction?

  // FIXME: debugging?

  // FIXME: event handling

  // FIXME: mousewheel


  ////////////////////////////////////////////////////////////////////////////
  // extensions

  var exts = gl.getSupportedExtensions();
  function enableIfExisting(name) {
    if (exts.indexOf(name) !== -1 && gl.getExtension(name) !== null) {
      gl._luxGlobals.webglExtensions[name] = true;
    }
  }
  ["OES_texture_float", "OES_standard_derivatives"].forEach(function(ext) {
    if (exts.indexOf(ext) === -1 || gl.getExtension(ext) === null) {
      throw new LuxError(
        ext + " is not available on your browser/computer! " +
          "Lux will not work, sorry.");
    }
  });
  enableIfExisting("OES_texture_float_linear");
  ["WEBKIT_EXT_texture_filter_anisotropic",
   "EXT_texture_filter_anisotropic"].forEach( function(ext) {
     if (exts.indexOf(ext) !== -1 && (gl.getExtension(ext) !== null)) {
       gl._luxGlobals.webglExtensions.EXT_texture_filter_anisotropic = true;
       gl.TEXTURE_MAX_ANISOTROPY_EXT     = 0x84FE;
       gl.MAX_TEXTURE_MAX_ANISOTROPY_EXT = 0x84FF;
     }
   });
  if (exts.indexOf("OES_element_index_uint") !== -1 &&
      gl.getExtension("OES_element_index_uint") !== null) {
    gl._luxGlobals.webglExtensions.OES_element_index_uint = true;
  }

  setContext(gl);
}

exports.init = init;
