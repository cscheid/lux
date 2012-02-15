/*
 * Facet: An EDSL for WebGL graphics
 * By Carlos Scheidegger, cscheid@research.att.com
 * 
 * Copyright (c) 2011 AT&T Intellectual Property
 * 
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors: See github logs.
 *
 */

// Facet depends on the following software libraries:

////////////////////////////////////////////////////////////////////////////////
// BEGIN UNDERSCORE.JS NOTICE
// 
// Underscore.js 1.1.7
// (c) 2011 Jeremy Ashkenas, DocumentCloud Inc.
// Underscore is freely distributable under the MIT license.
// Portions of Underscore are inspired or borrowed from Prototype,
// Oliver Steele's Functional, and John Resig's Micro-Templating.
// For all details and documentation:
// http://documentcloud.github.com/underscore
//
// END UNDERSCORE.JS NOTICE
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
// BEGIN WEBGL-DEBUG.JS NOTICE
// https://cvs.khronos.org/svn/repos/registry/trunk/public/webgl/sdk/debug/webgl-debug.js
//
// Copyright (c) 2009 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
//
// END WEBGL-DEBUG.JS NOTICE
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
// BEGIN WEBGL-UTILS.JS NOTICE
// https://cvs.khronos.org/svn/repos/registry/trunk/public/webgl/sdk/demos/common/webgl-utils.js
/*
 * Copyright 2010, Google Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *     * Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above
 * copyright notice, this list of conditions and the following disclaimer
 * in the documentation and/or other materials provided with the
 * distribution.
 *     * Neither the name of Google Inc. nor the names of its
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
// END WEBGL-UTILS.JS NOTICE
////////////////////////////////////////////////////////////////////////////////
/*

  Facet is a library for making WebGL marginally
  less painful to program, featuring things like nicer support for
  fragment and vertex programs, webgl buffers, textures, etc.

 */

Facet = {};
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
// Underscore.js 1.1.7
// (c) 2011 Jeremy Ashkenas, DocumentCloud Inc.
// Underscore is freely distributable under the MIT license.
// Portions of Underscore are inspired or borrowed from Prototype,
// Oliver Steele's Functional, and John Resig's Micro-Templating.
// For all details and documentation:
// http://documentcloud.github.com/underscore
(function(){var p=this,C=p._,m={},i=Array.prototype,n=Object.prototype,f=i.slice,D=i.unshift,E=n.toString,l=n.hasOwnProperty,s=i.forEach,t=i.map,u=i.reduce,v=i.reduceRight,w=i.filter,x=i.every,y=i.some,o=i.indexOf,z=i.lastIndexOf;n=Array.isArray;var F=Object.keys,q=Function.prototype.bind,b=function(a){return new j(a)};typeof module!=="undefined"&&module.exports?(module.exports=b,b._=b):p._=b;b.VERSION="1.1.7";var h=b.each=b.forEach=function(a,c,b){if(a!=null)if(s&&a.forEach===s)a.forEach(c,b);else if(a.length===
+a.length)for(var e=0,k=a.length;e<k;e++){if(e in a&&c.call(b,a[e],e,a)===m)break}else for(e in a)if(l.call(a,e)&&c.call(b,a[e],e,a)===m)break};b.map=function(a,c,b){var e=[];if(a==null)return e;if(t&&a.map===t)return a.map(c,b);h(a,function(a,g,G){e[e.length]=c.call(b,a,g,G)});return e};b.reduce=b.foldl=b.inject=function(a,c,d,e){var k=d!==void 0;a==null&&(a=[]);if(u&&a.reduce===u)return e&&(c=b.bind(c,e)),k?a.reduce(c,d):a.reduce(c);h(a,function(a,b,f){k?d=c.call(e,d,a,b,f):(d=a,k=!0)});if(!k)throw new TypeError("Reduce of empty array with no initial value");
return d};b.reduceRight=b.foldr=function(a,c,d,e){a==null&&(a=[]);if(v&&a.reduceRight===v)return e&&(c=b.bind(c,e)),d!==void 0?a.reduceRight(c,d):a.reduceRight(c);a=(b.isArray(a)?a.slice():b.toArray(a)).reverse();return b.reduce(a,c,d,e)};b.find=b.detect=function(a,c,b){var e;A(a,function(a,g,f){if(c.call(b,a,g,f))return e=a,!0});return e};b.filter=b.select=function(a,c,b){var e=[];if(a==null)return e;if(w&&a.filter===w)return a.filter(c,b);h(a,function(a,g,f){c.call(b,a,g,f)&&(e[e.length]=a)});return e};
b.reject=function(a,c,b){var e=[];if(a==null)return e;h(a,function(a,g,f){c.call(b,a,g,f)||(e[e.length]=a)});return e};b.every=b.all=function(a,c,b){var e=!0;if(a==null)return e;if(x&&a.every===x)return a.every(c,b);h(a,function(a,g,f){if(!(e=e&&c.call(b,a,g,f)))return m});return e};var A=b.some=b.any=function(a,c,d){c=c||b.identity;var e=!1;if(a==null)return e;if(y&&a.some===y)return a.some(c,d);h(a,function(a,b,f){if(e|=c.call(d,a,b,f))return m});return!!e};b.include=b.contains=function(a,c){var b=
!1;if(a==null)return b;if(o&&a.indexOf===o)return a.indexOf(c)!=-1;A(a,function(a){if(b=a===c)return!0});return b};b.invoke=function(a,c){var d=f.call(arguments,2);return b.map(a,function(a){return(c.call?c||a:a[c]).apply(a,d)})};b.pluck=function(a,c){return b.map(a,function(a){return a[c]})};b.max=function(a,c,d){if(!c&&b.isArray(a))return Math.max.apply(Math,a);var e={computed:-Infinity};h(a,function(a,b,f){b=c?c.call(d,a,b,f):a;b>=e.computed&&(e={value:a,computed:b})});return e.value};b.min=function(a,
c,d){if(!c&&b.isArray(a))return Math.min.apply(Math,a);var e={computed:Infinity};h(a,function(a,b,f){b=c?c.call(d,a,b,f):a;b<e.computed&&(e={value:a,computed:b})});return e.value};b.sortBy=function(a,c,d){return b.pluck(b.map(a,function(a,b,f){return{value:a,criteria:c.call(d,a,b,f)}}).sort(function(a,b){var c=a.criteria,d=b.criteria;return c<d?-1:c>d?1:0}),"value")};b.groupBy=function(a,b){var d={};h(a,function(a,f){var g=b(a,f);(d[g]||(d[g]=[])).push(a)});return d};b.sortedIndex=function(a,c,d){d||
(d=b.identity);for(var e=0,f=a.length;e<f;){var g=e+f>>1;d(a[g])<d(c)?e=g+1:f=g}return e};b.toArray=function(a){if(!a)return[];if(a.toArray)return a.toArray();if(b.isArray(a))return f.call(a);if(b.isArguments(a))return f.call(a);return b.values(a)};b.size=function(a){return b.toArray(a).length};b.first=b.head=function(a,b,d){return b!=null&&!d?f.call(a,0,b):a[0]};b.rest=b.tail=function(a,b,d){return f.call(a,b==null||d?1:b)};b.last=function(a){return a[a.length-1]};b.compact=function(a){return b.filter(a,
function(a){return!!a})};b.flatten=function(a){return b.reduce(a,function(a,d){if(b.isArray(d))return a.concat(b.flatten(d));a[a.length]=d;return a},[])};b.without=function(a){return b.difference(a,f.call(arguments,1))};b.uniq=b.unique=function(a,c){return b.reduce(a,function(a,e,f){if(0==f||(c===!0?b.last(a)!=e:!b.include(a,e)))a[a.length]=e;return a},[])};b.union=function(){return b.uniq(b.flatten(arguments))};b.intersection=b.intersect=function(a){var c=f.call(arguments,1);return b.filter(b.uniq(a),
function(a){return b.every(c,function(c){return b.indexOf(c,a)>=0})})};b.difference=function(a,c){return b.filter(a,function(a){return!b.include(c,a)})};b.zip=function(){for(var a=f.call(arguments),c=b.max(b.pluck(a,"length")),d=Array(c),e=0;e<c;e++)d[e]=b.pluck(a,""+e);return d};b.indexOf=function(a,c,d){if(a==null)return-1;var e;if(d)return d=b.sortedIndex(a,c),a[d]===c?d:-1;if(o&&a.indexOf===o)return a.indexOf(c);d=0;for(e=a.length;d<e;d++)if(a[d]===c)return d;return-1};b.lastIndexOf=function(a,
b){if(a==null)return-1;if(z&&a.lastIndexOf===z)return a.lastIndexOf(b);for(var d=a.length;d--;)if(a[d]===b)return d;return-1};b.range=function(a,b,d){arguments.length<=1&&(b=a||0,a=0);d=arguments[2]||1;for(var e=Math.max(Math.ceil((b-a)/d),0),f=0,g=Array(e);f<e;)g[f++]=a,a+=d;return g};b.bind=function(a,b){if(a.bind===q&&q)return q.apply(a,f.call(arguments,1));var d=f.call(arguments,2);return function(){return a.apply(b,d.concat(f.call(arguments)))}};b.bindAll=function(a){var c=f.call(arguments,1);
c.length==0&&(c=b.functions(a));h(c,function(c){a[c]=b.bind(a[c],a)});return a};b.memoize=function(a,c){var d={};c||(c=b.identity);return function(){var b=c.apply(this,arguments);return l.call(d,b)?d[b]:d[b]=a.apply(this,arguments)}};b.delay=function(a,b){var d=f.call(arguments,2);return setTimeout(function(){return a.apply(a,d)},b)};b.defer=function(a){return b.delay.apply(b,[a,1].concat(f.call(arguments,1)))};var B=function(a,b,d){var e;return function(){var f=this,g=arguments,h=function(){e=null;
a.apply(f,g)};d&&clearTimeout(e);if(d||!e)e=setTimeout(h,b)}};b.throttle=function(a,b){return B(a,b,!1)};b.debounce=function(a,b){return B(a,b,!0)};b.once=function(a){var b=!1,d;return function(){if(b)return d;b=!0;return d=a.apply(this,arguments)}};b.wrap=function(a,b){return function(){var d=[a].concat(f.call(arguments));return b.apply(this,d)}};b.compose=function(){var a=f.call(arguments);return function(){for(var b=f.call(arguments),d=a.length-1;d>=0;d--)b=[a[d].apply(this,b)];return b[0]}};b.after=
function(a,b){return function(){if(--a<1)return b.apply(this,arguments)}};b.keys=F||function(a){if(a!==Object(a))throw new TypeError("Invalid object");var b=[],d;for(d in a)l.call(a,d)&&(b[b.length]=d);return b};b.values=function(a){return b.map(a,b.identity)};b.functions=b.methods=function(a){var c=[],d;for(d in a)b.isFunction(a[d])&&c.push(d);return c.sort()};b.extend=function(a){h(f.call(arguments,1),function(b){for(var d in b)b[d]!==void 0&&(a[d]=b[d])});return a};b.defaults=function(a){h(f.call(arguments,
1),function(b){for(var d in b)a[d]==null&&(a[d]=b[d])});return a};b.clone=function(a){return b.isArray(a)?a.slice():b.extend({},a)};b.tap=function(a,b){b(a);return a};b.isEqual=function(a,c){if(a===c)return!0;var d=typeof a;if(d!=typeof c)return!1;if(a==c)return!0;if(!a&&c||a&&!c)return!1;if(a._chain)a=a._wrapped;if(c._chain)c=c._wrapped;if(a.isEqual)return a.isEqual(c);if(c.isEqual)return c.isEqual(a);if(b.isDate(a)&&b.isDate(c))return a.getTime()===c.getTime();if(b.isNaN(a)&&b.isNaN(c))return!1;
if(b.isRegExp(a)&&b.isRegExp(c))return a.source===c.source&&a.global===c.global&&a.ignoreCase===c.ignoreCase&&a.multiline===c.multiline;if(d!=="object")return!1;if(a.length&&a.length!==c.length)return!1;d=b.keys(a);var e=b.keys(c);if(d.length!=e.length)return!1;for(var f in a)if(!(f in c)||!b.isEqual(a[f],c[f]))return!1;return!0};b.isEmpty=function(a){if(b.isArray(a)||b.isString(a))return a.length===0;for(var c in a)if(l.call(a,c))return!1;return!0};b.isElement=function(a){return!!(a&&a.nodeType==
1)};b.isArray=n||function(a){return E.call(a)==="[object Array]"};b.isObject=function(a){return a===Object(a)};b.isArguments=function(a){return!(!a||!l.call(a,"callee"))};b.isFunction=function(a){return!(!a||!a.constructor||!a.call||!a.apply)};b.isString=function(a){return!!(a===""||a&&a.charCodeAt&&a.substr)};b.isNumber=function(a){return!!(a===0||a&&a.toExponential&&a.toFixed)};b.isNaN=function(a){return a!==a};b.isBoolean=function(a){return a===!0||a===!1};b.isDate=function(a){return!(!a||!a.getTimezoneOffset||
!a.setUTCFullYear)};b.isRegExp=function(a){return!(!a||!a.test||!a.exec||!(a.ignoreCase||a.ignoreCase===!1))};b.isNull=function(a){return a===null};b.isUndefined=function(a){return a===void 0};b.noConflict=function(){p._=C;return this};b.identity=function(a){return a};b.times=function(a,b,d){for(var e=0;e<a;e++)b.call(d,e)};b.mixin=function(a){h(b.functions(a),function(c){H(c,b[c]=a[c])})};var I=0;b.uniqueId=function(a){var b=I++;return a?a+b:b};b.templateSettings={evaluate:/<%([\s\S]+?)%>/g,interpolate:/<%=([\s\S]+?)%>/g};
b.template=function(a,c){var d=b.templateSettings;d="var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push('"+a.replace(/\\/g,"\\\\").replace(/'/g,"\\'").replace(d.interpolate,function(a,b){return"',"+b.replace(/\\'/g,"'")+",'"}).replace(d.evaluate||null,function(a,b){return"');"+b.replace(/\\'/g,"'").replace(/[\r\n\t]/g," ")+"__p.push('"}).replace(/\r/g,"\\r").replace(/\n/g,"\\n").replace(/\t/g,"\\t")+"');}return __p.join('');";d=new Function("obj",d);return c?d(c):d};
var j=function(a){this._wrapped=a};b.prototype=j.prototype;var r=function(a,c){return c?b(a).chain():a},H=function(a,c){j.prototype[a]=function(){var a=f.call(arguments);D.call(a,this._wrapped);return r(c.apply(b,a),this._chain)}};b.mixin(b);h(["pop","push","reverse","shift","sort","splice","unshift"],function(a){var b=i[a];j.prototype[a]=function(){b.apply(this._wrapped,arguments);return r(this._wrapped,this._chain)}});h(["concat","join","slice"],function(a){var b=i[a];j.prototype[a]=function(){return r(b.apply(this._wrapped,
arguments),this._chain)}});j.prototype.chain=function(){this._chain=!0;return this};j.prototype.value=function(){return this._wrapped}})();
//Copyright (c) 2009 The Chromium Authors. All rights reserved.
//Use of this source code is governed by a BSD-style license that can be
//found in the LICENSE file.

// Various functions for helping debug WebGL apps.

WebGLDebugUtils = function() {

/**
 * Wrapped logging function.
 * @param {string} msg Message to log.
 */
var log = function(msg) {
  if (window.console && window.console.log) {
    window.console.log(msg);
  }
};

/**
 * Which arguements are enums.
 * @type {!Object.<number, string>}
 */
var glValidEnumContexts = {

  // Generic setters and getters

  'enable': { 0:true },
  'disable': { 0:true },
  'getParameter': { 0:true },

  // Rendering

  'drawArrays': { 0:true },
  'drawElements': { 0:true, 2:true },

  // Shaders

  'createShader': { 0:true },
  'getShaderParameter': { 1:true },
  'getProgramParameter': { 1:true },

  // Vertex attributes

  'getVertexAttrib': { 1:true },
  'vertexAttribPointer': { 2:true },

  // Textures

  'bindTexture': { 0:true },
  'activeTexture': { 0:true },
  'getTexParameter': { 0:true, 1:true },
  'texParameterf': { 0:true, 1:true },
  'texParameteri': { 0:true, 1:true, 2:true },
  'texImage2D': { 0:true, 2:true, 6:true, 7:true },
  'texSubImage2D': { 0:true, 6:true, 7:true },
  'copyTexImage2D': { 0:true, 2:true },
  'copyTexSubImage2D': { 0:true },
  'generateMipmap': { 0:true },

  // Buffer objects

  'bindBuffer': { 0:true },
  'bufferData': { 0:true, 2:true },
  'bufferSubData': { 0:true },
  'getBufferParameter': { 0:true, 1:true },

  // Renderbuffers and framebuffers

  'pixelStorei': { 0:true, 1:true },
  'readPixels': { 4:true, 5:true },
  'bindRenderbuffer': { 0:true },
  'bindFramebuffer': { 0:true },
  'checkFramebufferStatus': { 0:true },
  'framebufferRenderbuffer': { 0:true, 1:true, 2:true },
  'framebufferTexture2D': { 0:true, 1:true, 2:true },
  'getFramebufferAttachmentParameter': { 0:true, 1:true, 2:true },
  'getRenderbufferParameter': { 0:true, 1:true },
  'renderbufferStorage': { 0:true, 1:true },

  // Frame buffer operations (clear, blend, depth test, stencil)

  'clear': { 0:true },
  'depthFunc': { 0:true },
  'blendFunc': { 0:true, 1:true },
  'blendFuncSeparate': { 0:true, 1:true, 2:true, 3:true },
  'blendEquation': { 0:true },
  'blendEquationSeparate': { 0:true, 1:true },
  'stencilFunc': { 0:true },
  'stencilFuncSeparate': { 0:true, 1:true },
  'stencilMaskSeparate': { 0:true },
  'stencilOp': { 0:true, 1:true, 2:true },
  'stencilOpSeparate': { 0:true, 1:true, 2:true, 3:true },

  // Culling

  'cullFace': { 0:true },
  'frontFace': { 0:true },
};

/**
 * Map of numbers to names.
 * @type {Object}
 */
var glEnums = null;

/**
 * Initializes this module. Safe to call more than once.
 * @param {!WebGLRenderingContext} ctx A WebGL context. If
 *    you have more than one context it doesn't matter which one
 *    you pass in, it is only used to pull out constants.
 */
function init(ctx) {
  if (glEnums == null) {
    glEnums = { };
    for (var propertyName in ctx) {
      if (typeof ctx[propertyName] == 'number') {
        glEnums[ctx[propertyName]] = propertyName;
      }
    }
  }
}

/**
 * Checks the utils have been initialized.
 */
function checkInit() {
  if (glEnums == null) {
    throw 'WebGLDebugUtils.init(ctx) not called';
  }
}

/**
 * Returns true or false if value matches any WebGL enum
 * @param {*} value Value to check if it might be an enum.
 * @return {boolean} True if value matches one of the WebGL defined enums
 */
function mightBeEnum(value) {
  checkInit();
  return (glEnums[value] !== undefined);
}

/**
 * Gets an string version of an WebGL enum.
 *
 * Example:
 *   var str = WebGLDebugUtil.glEnumToString(ctx.getError());
 *
 * @param {number} value Value to return an enum for
 * @return {string} The string version of the enum.
 */
function glEnumToString(value) {
  checkInit();
  var name = glEnums[value];
  return (name !== undefined) ? name :
      ("*UNKNOWN WebGL ENUM (0x" + value.toString(16) + ")");
}

/**
 * Returns the string version of a WebGL argument.
 * Attempts to convert enum arguments to strings.
 * @param {string} functionName the name of the WebGL function.
 * @param {number} argumentIndx the index of the argument.
 * @param {*} value The value of the argument.
 * @return {string} The value as a string.
 */
function glFunctionArgToString(functionName, argumentIndex, value) {
  var funcInfo = glValidEnumContexts[functionName];
  if (funcInfo !== undefined) {
    if (funcInfo[argumentIndex]) {
      return glEnumToString(value);
    }
  }
  return value.toString();
}

/**
 * Given a WebGL context returns a wrapped context that calls
 * gl.getError after every command and calls a function if the
 * result is not gl.NO_ERROR.
 *
 * @param {!WebGLRenderingContext} ctx The webgl context to
 *        wrap.
 * @param {!function(err, funcName, args): void} opt_onErrorFunc
 *        The function to call when gl.getError returns an
 *        error. If not specified the default function calls
 *        console.log with a message.
 */
function makeDebugContext(ctx, opt_onErrorFunc) {
  init(ctx);
  opt_onErrorFunc = opt_onErrorFunc || function(err, functionName, args) {
        // apparently we can't do args.join(",");
        var argStr = "";
        for (var ii = 0; ii < args.length; ++ii) {
          argStr += ((ii == 0) ? '' : ', ') +
              glFunctionArgToString(functionName, ii, args[ii]);
        }
        log("WebGL error "+ glEnumToString(err) + " in "+ functionName +
            "(" + argStr + ")");
      };

  // Holds booleans for each GL error so after we get the error ourselves
  // we can still return it to the client app.
  var glErrorShadow = { };

  // Makes a function that calls a WebGL function and then calls getError.
  function makeErrorWrapper(ctx, functionName) {
    return function() {
      var result = ctx[functionName].apply(ctx, arguments);
      var err = ctx.getError();
      if (err != 0) {
        glErrorShadow[err] = true;
        opt_onErrorFunc(err, functionName, arguments);
      }
      return result;
    };
  }

  // Make a an object that has a copy of every property of the WebGL context
  // but wraps all functions.
  var wrapper = {};
  for (var propertyName in ctx) {
    if (typeof ctx[propertyName] == 'function') {
       wrapper[propertyName] = makeErrorWrapper(ctx, propertyName);
     } else {
       wrapper[propertyName] = ctx[propertyName];
     }
  }

  // Override the getError function with one that returns our saved results.
  wrapper.getError = function() {
    for (var err in glErrorShadow) {
      if (glErrorShadow[err]) {
        glErrorShadow[err] = false;
        return err;
      }
    }
    return ctx.NO_ERROR;
  };

  return wrapper;
}

function resetToInitialState(ctx) {
  var numAttribs = ctx.getParameter(ctx.MAX_VERTEX_ATTRIBS);
  var tmp = ctx.createBuffer();
  ctx.bindBuffer(ctx.ARRAY_BUFFER, tmp);
  for (var ii = 0; ii < numAttribs; ++ii) {
    ctx.disableVertexAttribArray(ii);
    ctx.vertexAttribPointer(ii, 4, ctx.FLOAT, false, 0, 0);
    ctx.vertexAttrib1f(ii, 0);
  }
  ctx.deleteBuffer(tmp);

  var numTextureUnits = ctx.getParameter(ctx.MAX_TEXTURE_IMAGE_UNITS);
  for (var ii = 0; ii < numTextureUnits; ++ii) {
    ctx.activeTexture(ctx.TEXTURE0 + ii);
    ctx.bindTexture(ctx.TEXTURE_CUBE_MAP, null);
    ctx.bindTexture(ctx.TEXTURE_2D, null);
  }

  ctx.activeTexture(ctx.TEXTURE0);
  ctx.useProgram(null);
  ctx.bindBuffer(ctx.ARRAY_BUFFER, null);
  ctx.bindBuffer(ctx.ELEMENT_ARRAY_BUFFER, null);
  ctx.bindFramebuffer(ctx.FRAMEBUFFER, null);
  ctx.bindRenderbuffer(ctx.RENDERBUFFER, null);
  ctx.disable(ctx.BLEND);
  ctx.disable(ctx.CULL_FACE);
  ctx.disable(ctx.DEPTH_TEST);
  ctx.disable(ctx.DITHER);
  ctx.disable(ctx.SCISSOR_TEST);
  ctx.blendColor(0, 0, 0, 0);
  ctx.blendEquation(ctx.FUNC_ADD);
  ctx.blendFunc(ctx.ONE, ctx.ZERO);
  ctx.clearColor(0, 0, 0, 0);
  ctx.clearDepth(1);
  ctx.clearStencil(-1);
  ctx.colorMask(true, true, true, true);
  ctx.cullFace(ctx.BACK);
  ctx.depthFunc(ctx.LESS);
  ctx.depthMask(true);
  ctx.depthRange(0, 1);
  ctx.frontFace(ctx.CCW);
  ctx.hint(ctx.GENERATE_MIPMAP_HINT, ctx.DONT_CARE);
  ctx.lineWidth(1);
  ctx.pixelStorei(ctx.PACK_ALIGNMENT, 4);
  ctx.pixelStorei(ctx.UNPACK_ALIGNMENT, 4);
  ctx.pixelStorei(ctx.UNPACK_FLIP_Y_WEBGL, false);
  ctx.pixelStorei(ctx.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
  // TODO: Delete this IF.
  if (ctx.UNPACK_COLORSPACE_CONVERSION_WEBGL) {
    ctx.pixelStorei(ctx.UNPACK_COLORSPACE_CONVERSION_WEBGL, ctx.BROWSER_DEFAULT_WEBGL);
  }
  ctx.polygonOffset(0, 0);
  ctx.sampleCoverage(1, false);
  ctx.scissor(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.stencilFunc(ctx.ALWAYS, 0, 0xFFFFFFFF);
  ctx.stencilMask(0xFFFFFFFF);
  ctx.stencilOp(ctx.KEEP, ctx.KEEP, ctx.KEEP);
  ctx.viewport(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);
  ctx.clear(ctx.COLOR_BUFFER_BIT | ctx.DEPTH_BUFFER_BIT | ctx.STENCIL_BUFFER_BIT);

  // TODO: This should NOT be needed but Firefox fails with 'hint'
  while(ctx.getError());
}

function makeLostContextSimulatingContext(ctx) {
  var wrapper_ = {};
  var contextId_ = 1;
  var contextLost_ = false;
  var resourceId_ = 0;
  var resourceDb_ = [];
  var onLost_ = undefined;
  var onRestored_ = undefined;
  var nextOnRestored_ = undefined;

  // Holds booleans for each GL error so can simulate errors.
  var glErrorShadow_ = { };

  function isWebGLObject(obj) {
    //return false;
    return (obj instanceof WebGLBuffer ||
            obj instanceof WebGLFramebuffer ||
            obj instanceof WebGLProgram ||
            obj instanceof WebGLRenderbuffer ||
            obj instanceof WebGLShader ||
            obj instanceof WebGLTexture);
  }

  function checkResources(args) {
    for (var ii = 0; ii < args.length; ++ii) {
      var arg = args[ii];
      if (isWebGLObject(arg)) {
        return arg.__webglDebugContextLostId__ == contextId_;
      }
    }
    return true;
  }

  function clearErrors() {
    var k = Object.keys(glErrorShadow_);
    for (var ii = 0; ii < k.length; ++ii) {
      delete glErrorShdow_[k];
    }
  }

  // Makes a function that simulates WebGL when out of context.
  function makeLostContextWrapper(ctx, functionName) {
    var f = ctx[functionName];
    return function() {
      // Only call the functions if the context is not lost.
      if (!contextLost_) {
        if (!checkResources(arguments)) {
          glErrorShadow_[ctx.INVALID_OPERATION] = true;
          return;
        }
        var result = f.apply(ctx, arguments);
        return result;
      }
    };
  }

  for (var propertyName in ctx) {
    if (typeof ctx[propertyName] == 'function') {
       wrapper_[propertyName] = makeLostContextWrapper(ctx, propertyName);
     } else {
       wrapper_[propertyName] = ctx[propertyName];
     }
  }

  function makeWebGLContextEvent(statusMessage) {
    return {statusMessage: statusMessage};
  }

  function freeResources() {
    for (var ii = 0; ii < resourceDb_.length; ++ii) {
      var resource = resourceDb_[ii];
      if (resource instanceof WebGLBuffer) {
        ctx.deleteBuffer(resource);
      } else if (resource instanceof WebctxFramebuffer) {
        ctx.deleteFramebuffer(resource);
      } else if (resource instanceof WebctxProgram) {
        ctx.deleteProgram(resource);
      } else if (resource instanceof WebctxRenderbuffer) {
        ctx.deleteRenderbuffer(resource);
      } else if (resource instanceof WebctxShader) {
        ctx.deleteShader(resource);
      } else if (resource instanceof WebctxTexture) {
        ctx.deleteTexture(resource);
      }
    }
  }

  wrapper_.loseContext = function() {
    if (!contextLost_) {
      contextLost_ = true;
      ++contextId_;
      while (ctx.getError());
      clearErrors();
      glErrorShadow_[ctx.CONTEXT_LOST_WEBGL] = true;
      setTimeout(function() {
          if (onLost_) {
            onLost_(makeWebGLContextEvent("context lost"));
          }
        }, 0);
    }
  };

  wrapper_.restoreContext = function() {
    if (contextLost_) {
      if (onRestored_) {
        setTimeout(function() {
            freeResources();
            resetToInitialState(ctx);
            contextLost_ = false;
            if (onRestored_) {
              var callback = onRestored_;
              onRestored_ = nextOnRestored_;
              nextOnRestored_ = undefined;
              callback(makeWebGLContextEvent("context restored"));
            }
          }, 0);
      } else {
        throw "You can not restore the context without a listener"
      }
    }
  };

  // Wrap a few functions specially.
  wrapper_.getError = function() {
    if (!contextLost_) {
      var err;
      while (err = ctx.getError()) {
        glErrorShadow_[err] = true;
      }
    }
    for (var err in glErrorShadow_) {
      if (glErrorShadow_[err]) {
        delete glErrorShadow_[err];
        return err;
      }
    }
    return ctx.NO_ERROR;
  };

  var creationFunctions = [
    "createBuffer",
    "createFramebuffer",
    "createProgram",
    "createRenderbuffer",
    "createShader",
    "createTexture"
  ];
  for (var ii = 0; ii < creationFunctions.length; ++ii) {
    var functionName = creationFunctions[ii];
    wrapper_[functionName] = function(f) {
      return function() {
        if (contextLost_) {
          return null;
        }
        var obj = f.apply(ctx, arguments);
        obj.__webglDebugContextLostId__ = contextId_;
        resourceDb_.push(obj);
        return obj;
      };
    }(ctx[functionName]);
  }

  var functionsThatShouldReturnNull = [
    "getActiveAttrib",
    "getActiveUniform",
    "getBufferParameter",
    "getContextAttributes",
    "getAttachedShaders",
    "getFramebufferAttachmentParameter",
    "getParameter",
    "getProgramParameter",
    "getProgramInfoLog",
    "getRenderbufferParameter",
    "getShaderParameter",
    "getShaderInfoLog",
    "getShaderSource",
    "getTexParameter",
    "getUniform",
    "getUniformLocation",
    "getVertexAttrib"
  ];
  for (var ii = 0; ii < functionsThatShouldReturnNull.length; ++ii) {
    var functionName = functionsThatShouldReturnNull[ii];
    wrapper_[functionName] = function(f) {
      return function() {
        if (contextLost_) {
          return null;
        }
        return f.apply(ctx, arguments);
      }
    }(wrapper_[functionName]);
  }

  var isFunctions = [
    "isBuffer",
    "isEnabled",
    "isFramebuffer",
    "isProgram",
    "isRenderbuffer",
    "isShader",
    "isTexture"
  ];
  for (var ii = 0; ii < isFunctions.length; ++ii) {
    var functionName = isFunctions[ii];
    wrapper_[functionName] = function(f) {
      return function() {
        if (contextLost_) {
          return false;
        }
        return f.apply(ctx, arguments);
      }
    }(wrapper_[functionName]);
  }

  wrapper_.checkFramebufferStatus = function(f) {
    return function() {
      if (contextLost_) {
        return ctx.FRAMEBUFFER_UNSUPPORTED;
      }
      return f.apply(ctx, arguments);
    };
  }(wrapper_.checkFramebufferStatus);

  wrapper_.getAttribLocation = function(f) {
    return function() {
      if (contextLost_) {
        return -1;
      }
      return f.apply(ctx, arguments);
    };
  }(wrapper_.getAttribLocation);

  wrapper_.getVertexAttribOffset = function(f) {
    return function() {
      if (contextLost_) {
        return 0;
      }
      return f.apply(ctx, arguments);
    };
  }(wrapper_.getVertexAttribOffset);

  wrapper_.isContextLost = function() {
    return contextLost_;
  };

  function wrapEvent(listener) {
    if (typeof(listener) == "function") {
      return listener;
    } else {
      return function(info) {
        listener.handleEvent(info);
      }
    }
  }

  wrapper_.registerOnContextLostListener = function(listener) {
    onLost_ = wrapEvent(listener);
  };

  wrapper_.registerOnContextRestoredListener = function(listener) {
    if (contextLost_) {
      nextOnRestored_ = wrapEvent(listener);
    } else {
      onRestored_ = wrapEvent(listener);
    }
  }

  return wrapper_;
}

return {
  /**
   * Initializes this module. Safe to call more than once.
   * @param {!WebGLRenderingContext} ctx A WebGL context. If
   *    you have more than one context it doesn't matter which one
   *    you pass in, it is only used to pull out constants.
   */
  'init': init,

  /**
   * Returns true or false if value matches any WebGL enum
   * @param {*} value Value to check if it might be an enum.
   * @return {boolean} True if value matches one of the WebGL defined enums
   */
  'mightBeEnum': mightBeEnum,

  /**
   * Gets an string version of an WebGL enum.
   *
   * Example:
   *   WebGLDebugUtil.init(ctx);
   *   var str = WebGLDebugUtil.glEnumToString(ctx.getError());
   *
   * @param {number} value Value to return an enum for
   * @return {string} The string version of the enum.
   */
  'glEnumToString': glEnumToString,

  /**
   * Converts the argument of a WebGL function to a string.
   * Attempts to convert enum arguments to strings.
   *
   * Example:
   *   WebGLDebugUtil.init(ctx);
   *   var str = WebGLDebugUtil.glFunctionArgToString('bindTexture', 0, gl.TEXTURE_2D);
   *
   * would return 'TEXTURE_2D'
   *
   * @param {string} functionName the name of the WebGL function.
   * @param {number} argumentIndx the index of the argument.
   * @param {*} value The value of the argument.
   * @return {string} The value as a string.
   */
  'glFunctionArgToString': glFunctionArgToString,

  /**
   * Given a WebGL context returns a wrapped context that calls
   * gl.getError after every command and calls a function if the
   * result is not NO_ERROR.
   *
   * You can supply your own function if you want. For example, if you'd like
   * an exception thrown on any GL error you could do this
   *
   *    function throwOnGLError(err, funcName, args) {
   *      throw WebGLDebugUtils.glEnumToString(err) + " was caused by call to" +
   *            funcName;
   *    };
   *
   *    ctx = WebGLDebugUtils.makeDebugContext(
   *        canvas.getContext("webgl"), throwOnGLError);
   *
   * @param {!WebGLRenderingContext} ctx The webgl context to wrap.
   * @param {!function(err, funcName, args): void} opt_onErrorFunc The function
   *     to call when gl.getError returns an error. If not specified the default
   *     function calls console.log with a message.
   */
  'makeDebugContext': makeDebugContext,

  /**
   * Given a WebGL context returns a wrapped context that adds 4
   * functions.
   *
   * ctx.loseContext:
   *   simulates a lost context event.
   *
   * ctx.restoreContext:
   *   simulates the context being restored.
   *
   * ctx.registerOnContextLostListener(listener):
   *   lets you register a listener for context lost. Use instead
   *   of addEventListener('webglcontextlostevent', listener);
   *
   * ctx.registerOnContextRestoredListener(listener):
   *   lets you register a listener for context restored. Use
   *   instead of addEventListener('webglcontextrestored',
   *   listener);
   *
   * @param {!WebGLRenderingContext} ctx The webgl context to wrap.
   */
  'makeLostContextSimulatingContext': makeLostContextSimulatingContext,

  /**
   * Resets a context to the initial state.
   * @param {!WebGLRenderingContext} ctx The webgl context to
   *     reset.
   */
  'resetToInitialState': resetToInitialState
};

}();
/*
 * Copyright 2010, Google Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *     * Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above
 * copyright notice, this list of conditions and the following disclaimer
 * in the documentation and/or other materials provided with the
 * distribution.
 *     * Neither the name of Google Inc. nor the names of its
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */


/**
 * @fileoverview This file contains functions every webgl program will need
 * a version of one way or another.
 *
 * Instead of setting up a context manually it is recommended to
 * use. This will check for success or failure. On failure it
 * will attempt to present an approriate message to the user.
 *
 *       gl = WebGLUtils.setupWebGL(canvas);
 *
 * For animated WebGL apps use of setTimeout or setInterval are
 * discouraged. It is recommended you structure your rendering
 * loop like this.
 *
 *       function render() {
 *         window.requestAnimFrame(render, canvas);
 *
 *         // do rendering
 *         ...
 *       }
 *       render();
 *
 * This will call your rendering function up to the refresh rate
 * of your display but will stop rendering if your app is not
 * visible.
 */

WebGLUtils = function() {

/**
 * Creates the HTML for a failure message
 * @param {string} canvasContainerId id of container of th
 *        canvas.
 * @return {string} The html.
 */
var makeFailHTML = function(msg) {
  return '' +
    '<table style="background-color: #8CE; width: 100%; height: 100%;"><tr>' +
    '<td align="center">' +
    '<div style="display: table-cell; vertical-align: middle;">' +
    '<div style="">' + msg + '</div>' +
    '</div>' +
    '</td></tr></table>';
};

/**
 * Message for getting a webgl browser
 * @type {string}
 */
var GET_A_WEBGL_BROWSER = '' +
  'This page requires a browser that supports WebGL.<br/>' +
  '<a href="http://get.webgl.org">Click here to upgrade your browser.</a>';

/**
 * Mesasge for need better hardware
 * @type {string}
 */
var OTHER_PROBLEM = '' +
  "It doesn't appear your computer can support WebGL.<br/>" +
  '<a href="http://get.webgl.org/troubleshooting/">Click here for more information.</a>';

/**
 * Creates a webgl context. If creation fails it will
 * change the contents of the container of the <canvas>
 * tag to an error message with the correct links for WebGL.
 * @param {Element} canvas. The canvas element to create a
 *     context from.
 * @param {WebGLContextCreationAttirbutes} opt_attribs Any
 *     creation attributes you want to pass in.
 * @return {WebGLRenderingContext} The created context.
 */
var setupWebGL = function(canvas, opt_attribs) {
  function showLink(str) {
    var container = canvas.parentNode;
    if (container) {
      container.innerHTML = makeFailHTML(str);
    }
  };

  if (!window.WebGLRenderingContext) {
    showLink(GET_A_WEBGL_BROWSER);
    return null;
  }

  var context = create3DContext(canvas, opt_attribs);
  if (!context) {
    showLink(OTHER_PROBLEM);
  }
  return context;
};

/**
 * Creates a webgl context.
 * @param {!Canvas} canvas The canvas tag to get context
 *     from. If one is not passed in one will be created.
 * @return {!WebGLContext} The created context.
 */
var create3DContext = function(canvas, opt_attribs) {
  var names = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];
  var context = null;
  for (var ii = 0; ii < names.length; ++ii) {
    try {
      context = canvas.getContext(names[ii], opt_attribs);
    } catch(e) {}
    if (context) {
      break;
    }
  }
  return context;
};

return {
  create3DContext: create3DContext,
  setupWebGL: setupWebGL
};
}();

/**
 * Provides requestAnimationFrame in a cross browser way.
 */
window.requestAnimFrame = (function() {
  return window.requestAnimationFrame ||
         window.webkitRequestAnimationFrame ||
         window.mozRequestAnimationFrame ||
         window.oRequestAnimationFrame ||
         window.msRequestAnimationFrame ||
         function(/* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {
           window.setTimeout(callback, 1000/60);
         };
})();


// Some underscore.js extensions

// build objects from key-value pair lists
_.mixin({
    build: function(iterable) {
        var result = {};
        _.each(iterable, function(v) {
            result[v[0]] = v[1];
        });
        return result;
    }
});
// The linalg module is inspired by glMatrix and Sylvester.

// The goal is to be comparably fast as glMatrix but as close to
// Sylvester's generality as possible for
// low-dimensional linear algebra (vec2, 3, 4, mat2, 3, 4).

// In particular, I believe it is possible to have a "fast when
// needed" and "convenient when acceptable" Javascript vector library.

//////////////////////////////////////////////////////////////////////////////

var vec = {};
var mat = {};
vec.eps = 1e-6;
mat.eps = 1e-6;
var vec2 = {};

vec2.create = function()
{
    var result = new Float32Array(2);
    result._type = 'vector';
    return result;
};

vec2.copy = function(vec)
{
    var result = new Float32Array(2);
    result._type = 'vector';
    result[0] = vec[0];
    result[1] = vec[1];
    return result;
};

vec2.make = vec2.copy;

vec2.equal = function(v1, v2)
{
    return Math.abs(v1[0] - v2[0]) < vec.eps &&
        Math.abs(v1[1] - v2[1]) < vec.eps;
};

vec2.random = function()
{
    var result = vec2.make([Math.random(), Math.random()]);
    return result;
};

vec2.set = function(dest, vec)
{
    dest[0] = vec[0];
    dest[1] = vec[1];
    return dest;
};

vec2.plus = function(v1, v2)
{
    var result = new Float32Array(2);
    result._type = 'vector';
    result[0] = v1[0] + v2[0];
    result[1] = v1[1] + v2[1];
    return result;
};

vec2.add = function(dest, other)
{
    dest[0] += other[0];
    dest[1] += other[1];
    return dest;
};

vec2.minus = function(v1, v2)
{
    var result = new Float32Array(2);
    result._type = 'vector';
    result[0] = v1[0] - v2[0];
    result[1] = v1[1] - v2[1];
    return result;
};

vec2.subtract = function(dest, other)
{
    dest[0] -= other[0];
    dest[1] -= other[1];
    return dest;
};

vec2.negative = function(v)
{
    var result = new Float32Array(2);
    result._type = 'vector';
    result[0] = -v[0];
    result[1] = -v[1];
    return result;
};

vec2.negate = function(dest)
{
    dest[0] = -dest[0];
    dest[1] = -dest[1];
    return dest;
};

vec2.scaling = function(vec, val)
{
    var result = new Float32Array(2);
    result._type = 'vector';
    result[0] = vec[0]*val;
    result[1] = vec[1]*val;
    return result;
};

vec2.scale = function(dest, val)
{
    dest[0] *= val;
    dest[1] *= val;
    return dest;
};

vec2.schur_product = function(v1, v2)
{
    var result = new Float32Array(2);
    result._type = 'vector';
    result[0] = v1[0] * v2[0];
    result[1] = v1[1] * v2[1];
    return result;
};

vec2.schur_multiply = function(dest, other)
{
    dest[0] *= other[0];
    dest[1] *= other[1];
    return dest;
};

vec2.normalized = function(vec)
{
    var result = new Float32Array(2);
    result._type = 'vector';
    var x = vec[0], y = vec[1];
    var len = Math.sqrt(x*x + y*y);
    if (!len)
        return result;
    if (len == 1) {
        result[0] = x;
        result[1] = y;
        return result;
    }
    result[0] = x / len;
    result[1] = y / len;
    return result;
};

vec2.normalize = function(dest)
{
    var x = dest[0], y = dest[1];
    var len = Math.sqrt(x*x + y*y);
    if (!len) {
        dest[0] = dest[1] = 0;
        return dest;
    }
    dest[0] /= len;
    dest[1] /= len;
    return dest;
};

vec2.length = function(vec)
{
    var x = vec[0], y = vec[1];
    return Math.sqrt(x*x + y*y);
};

vec2.dot = function(v1, v2)
{
    return v1[0] * v2[0] + v1[1] * v2[1];
};

vec2.map = function(vec, f) {
    return vec2.make(_.map(vec, f));
};

vec2.str = function(v) { return "[" + v[0] + ", " + v[1] + "]"; };
var vec3 = {};

vec3.create = function()
{
    var result = new Float32Array(3);
    result._type = 'vector';
    return result;
};

vec3.copy = function(vec)
{
    var result = new Float32Array(3);
    result._type = 'vector';
    result[0] = vec[0];
    result[1] = vec[1];
    result[2] = vec[2];
    return result;
};

vec3.make = vec3.copy;

vec3.equal = function(v1, v2)
{
    return Math.abs(v1[0] - v2[0]) < vec.eps &&
           Math.abs(v1[1] - v2[1]) < vec.eps &&
           Math.abs(v1[2] - v2[2]) < vec.eps;
};

vec3.random = function()
{
    var result = vec3.make([Math.random(), Math.random(), Math.random()]);
    return result;
};

vec3.set = function(dest, vec)
{
    dest[0] = vec[0];
    dest[1] = vec[1];
    dest[2] = vec[2];
    return dest;
};

vec3.plus = function(v1, v2)
{
    var result = new Float32Array(3);
    result._type = 'vector';
    result[0] = v1[0] + v2[0];
    result[1] = v1[1] + v2[1];
    result[2] = v1[2] + v2[2];
    return result;
};

vec3.add = function(dest, other)
{
    dest[0] += other[0];
    dest[1] += other[1];
    dest[2] += other[2];
    return dest;
};

vec3.minus = function(v1, v2)
{
    var result = new Float32Array(3);
    result._type = 'vector';
    result[0] = v1[0] - v2[0];
    result[1] = v1[1] - v2[1];
    result[2] = v1[2] - v2[2];
    return result;
};

vec3.subtract = function(dest, other)
{
    dest[0] -= other[0];
    dest[1] -= other[1];
    dest[2] -= other[2];
    return dest;
};

vec3.negative = function(v)
{
    var result = new Float32Array(3);
    result._type = 'vector';
    result[0] = -v[0];
    result[1] = -v[1];
    result[2] = -v[2];
    return result;
};

vec3.negate = function(dest)
{
    dest[0] = -dest[0];
    dest[1] = -dest[1];
    dest[2] = -dest[2];
    return dest;
};

vec3.scaling = function(vec, val)
{
    var result = new Float32Array(3);
    result._type = 'vector';
    result[0] = vec[0]*val;
    result[1] = vec[1]*val;
    result[2] = vec[2]*val;
    return result;
};

vec3.scale = function(dest, val)
{
    dest[0] *= val;
    dest[1] *= val;
    dest[2] *= val;
    return dest;
};

vec3.schur_product = function(v1, v2)
{
    var result = new Float32Array(3);
    result._type = 'vector';
    result[0] = v1[0] * v2[0];
    result[1] = v1[1] * v2[1];
    result[2] = v1[2] * v2[2];
    return result;
};

vec3.schur_multiply = function(dest, other)
{
    dest[0] *= other[0];
    dest[1] *= other[1];
    dest[2] *= other[2];
    return dest;
};

vec3.normalized = function(vec)
{
    var result = new Float32Array(3);
    result._type = 'vector';
    var x = vec[0], y = vec[1], z = vec[2];
    var len = Math.sqrt(x*x + y*y + z*z);
    if (!len)
        return result;
    if (len == 1) {
        result[0] = x;
        result[1] = y;
        result[2] = z;
        return result;
    }
    result[0] = x / len;
    result[1] = y / len;
    result[2] = z / len;
    return result;
};

vec3.normalize = function(dest)
{
    var x = dest[0], y = dest[1], z = dest[2];
    var len = Math.sqrt(x*x + y*y + z*z);
    if (!len) {
        dest[0] = dest[1] = dest[2] = 0;
        return dest;
    }
    dest[0] /= len;
    dest[1] /= len;
    dest[2] /= len;
    return dest;
};

vec3.cross = function(v1, v2)
{
    var x1 = v1[0], y1 = v1[1], z1 = v1[2];
    var x2 = v2[0], y2 = v2[1], z2 = v2[2];
    var result = new Float32Array(3);
    result._type = 'vector';
    result[0] = y1 * z2 - z1 * y2;
    result[1] = z1 * x2 - x1 * z2;
    result[2] = x1 * y2 - y1 * x2;
    return result;
};

vec3.length = function(vec)
{
    var x = vec[0], y = vec[1], z = vec[2];
    return Math.sqrt(x*x + y*y + z*z);
};

vec3.dot = function(v1, v2)
{
    return v1[0] * v2[0] + 
           v1[1] * v2[1] + 
           v1[2] * v2[2];
};

vec3.map = function(vec, f) {
    return vec3.make(_.map(vec, f));
};

vec3.str = function(v) { 
    return "[" + v[0] + ", " + v[1] + ", " + v[2] + "]";
};
var vec4 = {};

vec4.create = function()
{
    var result = new Float32Array(4);
    result._type = 'vector';
    return result;
};

vec4.copy = function(vec)
{
    var result = new Float32Array(4);
    result._type = 'vector';
    result[0] = vec[0];
    result[1] = vec[1];
    result[2] = vec[2];
    result[3] = vec[3];
    return result;
};

vec4.make = vec4.copy;

vec4.random = function() {
    var lst = [Math.random(), Math.random(), Math.random(), Math.random()];
    return vec4.make(lst);
};

vec4.equal = function(v1, v2)
{
    return Math.abs(v1[0] - v2[0]) < vec.eps &&
        Math.abs(v1[1] - v2[1]) < vec.eps &&
        Math.abs(v1[2] - v2[2]) < vec.eps &&
        Math.abs(v1[3] - v2[3]) < vec.eps;
};

vec4.set = function(dest, vec)
{
    dest[0] = vec[0];
    dest[1] = vec[1];
    dest[2] = vec[2];
    dest[3] = vec[3];
    return dest;
};

vec4.plus = function(v1, v2)
{
    var result = new Float32Array(4);
    result._type = 'vector';
    result[0] = v1[0] + v2[0];
    result[1] = v1[1] + v2[1];
    result[2] = v1[2] + v2[2];
    result[3] = v1[3] + v2[3];
    return result;
};

vec4.add = function(dest, other)
{
    dest[0] += other[0];
    dest[1] += other[1];
    dest[2] += other[2];
    dest[3] += other[3];
    return dest;
};

vec4.minus = function(v1, v2)
{
    var result = new Float32Array(4);
    result._type = 'vector';
    result[0] = v1[0] - v2[0];
    result[1] = v1[1] - v2[1];
    result[2] = v1[2] - v2[2];
    result[3] = v1[3] - v2[3];
    return result;
};

vec4.subtract = function(dest, other)
{
    dest[0] -= other[0];
    dest[1] -= other[1];
    dest[2] -= other[2];
    dest[3] -= other[3];
    return dest;
};

vec4.negative = function(v)
{
    var result = new Float32Array(4);
    result._type = 'vector';
    result[0] = -v[0];
    result[1] = -v[1];
    result[2] = -v[2];
    result[3] = -v[3];
    return result;
};

vec4.negate = function(dest)
{
    dest[0] = -dest[0];
    dest[1] = -dest[1];
    dest[2] = -dest[2];
    dest[3] = -dest[3];
    return dest;
};

vec4.scaling = function(vec, val)
{
    var result = new Float32Array(4);
    result._type = 'vector';
    result[0] = vec[0]*val;
    result[1] = vec[1]*val;
    result[2] = vec[2]*val;
    result[3] = vec[3]*val;
    return result;
};

vec4.scale = function(dest, val)
{
    dest[0] *= val;
    dest[1] *= val;
    dest[2] *= val;
    dest[3] *= val;
    return dest;
};

vec4.schur_product = function(v1, v2)
{
    var result = new Float32Array(4);
    result._type = 'vector';
    result[0] = v1[0] * v2[0];
    result[1] = v1[1] * v2[1];
    result[2] = v1[2] * v2[2];
    result[3] = v1[3] * v2[3];
    return result;
};

vec4.schur_multiply = function(dest, other)
{
    dest[0] *= other[0];
    dest[1] *= other[1];
    dest[2] *= other[2];
    dest[3] *= other[3];
    return dest;
};

vec4.normalized = function(vec)
{
    var result = new Float32Array(4);
    result._type = 'vector';
    var x = vec[0], y = vec[1], z = vec[2], w = vec[3];
    var len = Math.sqrt(x*x + y*y + z*z + w*w);
    if (!len)
        return result;
    if (len == 1) {
        result[0] = x;
        result[1] = y;
        result[2] = z;
        result[3] = w;
        return result;
    }
    result[0] = x / len;
    result[1] = y / len;
    result[2] = z / len;
    result[3] = w / len;
    return result;
};

vec4.normalize = function(dest)
{
    var x = dest[0], y = dest[1], z = dest[2], w = dest[3];
    var len = Math.sqrt(x*x + y*y + z*z + w*w);
    if (!len) {
        dest[0] = dest[1] = dest[2] = dest[3] = 0;
        return dest;
    }
    dest[0] /= len;
    dest[1] /= len;
    dest[2] /= len;
    dest[3] /= len;
    return dest;
};

vec4.length = function(vec)
{
    var x = vec[0], y = vec[1], z = vec[2], w = vec[3];
    return Math.sqrt(x*x + y*y + z*z + w*w);
};

vec4.dot = function(v1, v2)
{
    return v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2] + v1[3] * v2[3];
};

vec4.map = function(vec, f) {
    return vec4.make(_.map(vec, f));
};

vec4.str = function(v) { 
    return "[" + v[0] + ", " + v[1] + ", " + v[2] + ", " + v[3] + "]";
};
var mat2 = {};

mat2.create = function()
{
    var result = new Float32Array(4);
    result._type = 'matrix';
    return result;
};

mat2.copy = function(mat)
{
    var result = new Float32Array(4);
    result._type = 'matrix';
    result[0] = mat[0];
    result[1] = mat[1];
    result[2] = mat[2];
    result[3] = mat[3];
    return result;
};
mat2.make = mat2.copy;

mat2.equal = function(v1, v2)
{
    return Math.abs(v1[0] - v2[0]) < mat.eps &&
        Math.abs(v1[1] - v2[1]) < mat.eps &&
        Math.abs(v1[2] - v2[2]) < mat.eps &&
        Math.abs(v1[3] - v2[3]) < mat.eps;
};

mat2.random = function()
{
    var result = new Float32Array(4);
    result._type = 'matrix';
    result[0] = Math.random();
    result[1] = Math.random();
    result[2] = Math.random();
    result[3] = Math.random();
    return result;
};

mat2.set = function(dest, mat)
{
    dest[0] = mat[0];
    dest[1] = mat[1];
    dest[2] = mat[2];
    dest[3] = mat[3];
    return dest;
};

(function() {
var _identity = new Float32Array([1,0,0,1]);

mat2.identity = function()
{
    var result = new Float32Array(_identity);
    result._type = 'matrix';
    return result;
};

mat2.set_identity = function(mat)
{
    mat2.set(mat, _identity);
    return mat;
};
})();

mat2.transpose = function(mat)
{
    var result = new Float32Array(4);
    result._type = 'matrix';
    result[0] = mat[0];
    result[1] = mat[2];
    result[2] = mat[1];
    result[3] = mat[3];
    return result;
};

mat2.set_transpose = function(dest, mat)
{
    if (mat == dest) {
        var a01 = mat[1];
        dest[1] = mat[2];
        dest[2] = a01;
        return dest;
    } else {
        dest[0] = mat[0];
        dest[1] = mat[2];
        dest[2] = mat[1];
        dest[3] = mat[3];
        return dest;
    }
};

mat2.determinant = function(mat)
{
    return mat[0]*mat[3] - mat[1]*mat[2];
};

// From glMatrix
mat2.inverse = function(mat)
{
    var result = new Float32Array(4);
    result._type = 'matrix';
	
    var a00 = mat[0], a01 = mat[1];
    var a10 = mat[2], a11 = mat[3];
    
    // Calculate the determinant (inlined to avoid double-caching)
    var det = (a00*a11 - a01*a10);
    if (det === 0)
        throw "Singular matrix";

    result[0] =  a11/det;
    result[1] = -a01/det;
    result[2] = -a10/det;
    result[3] =  a00/det;

    return result;
};

mat2.invert = function(mat)
{
    var a00 = mat[0], a01 = mat[1];
    var a10 = mat[2], a11 = mat[3];
    
    // Calculate the determinant (inlined to avoid double-caching)
    var det = (a00*a11 - a01*a10);
    if (det === 0)
        throw "Singular matrix";

    mat[0] =  a11/det;
    mat[1] = -a01/det;
    mat[2] = -a10/det;
    mat[3] =  a00/det;

    return mat;
};

mat2.as_mat4 = function(mat)
{
    var result = new Float32Array(16);
    result._type = 'matrix';
    result[0]  = mat[0];
    result[1]  = mat[1];
    result[4]  = mat[2];
    result[5]  = mat[3];
    return result;
};

mat2.as_mat3 = function(mat)
{
    var result = new Float32Array(9);
    result._type = 'matrix';
    result[0] = mat[0];
    result[1] = mat[1];
    result[3] = mat[2];
    result[4] = mat[3];
    return result;
};

// from glMatrix
mat2.product = function(m1, m2)
{
    var result = new Float32Array(4);
    result._type = 'matrix';

    // Cache the matrix values (makes for huge speed increases!)
    var a00 = m1[0],  a01 = m1[1];
    var a10 = m1[2],  a11 = m1[3];
    
    var b00 = m2[0],  b01 = m2[1];
    var b10 = m2[2],  b11 = m2[3];
    
    result[0] = b00*a00 + b01*a10;
    result[1] = b00*a01 + b01*a11;
    result[2] = b10*a00 + b11*a10;
    result[3] = b10*a01 + b11*a11;
    
    return result;
};

// from glMatrix
mat2.multiply = function(dest, other)
{
    // Cache the matrix values (makes for huge speed increases!)
    var a00 = dest[0],  a01 = dest[1]; 
    var a10 = dest[2],  a11 = dest[3]; 
    
    var b00 = other[0],  b01 = other[1]; 
    var b10 = other[2],  b11 = other[3]; 
    
    dest[0] = b00*a00 + b01*a10;
    dest[1] = b00*a01 + b01*a11;
    dest[2] = b10*a00 + b11*a10;
    dest[3] = b10*a01 + b11*a11;
    
    return dest;
};

mat2.product_vec = function(mat, vec)
{
    var result = new Float32Array(3);
    result._type = 'vector';
    var x = vec[0], y = vec[1];
    result[0] = mat[0]*x + mat[2]*y;
    result[1] = mat[1]*x + mat[3]*y;
    return result;
};


mat2.multiply_vec = function(mat, vec)
{
    var x = vec[0], y = vec[1];
    vec[0] = mat[0]*x + mat[2]*y;
    vec[1] = mat[1]*x + mat[3]*y;
    return vec;
};

mat2.frobenius_norm = function(mat)
{
    return Math.sqrt(mat[0] * mat[0] +
                     mat[1] * mat[1] +
                     mat[2] * mat[2] +
                     mat[3] * mat[3]);
};

mat2.map = function(mat, f)
{
    return mat2.make(_.map(mat, f));
};

mat2.str = function(mat)
{
    return "[ [" + mat[0] + "] [" + mat[2] + "] ]\n" +
        "[ [" + mat[1] + "] [" + mat[3] + "] ]";
};

var mat3 = {};

mat3.create = function()
{
    var result = new Float32Array(9);
    result._type = 'matrix';
    return result;
};

mat3.copy = function(mat)
{
    var result = new Float32Array(9);
    result._type = 'matrix';
    result[0] = mat[0];
    result[1] = mat[1];
    result[2] = mat[2];
    result[3] = mat[3];
    result[4] = mat[4];
    result[5] = mat[5];
    result[6] = mat[6];
    result[7] = mat[7];
    result[8] = mat[8];
    return result;
};
mat3.make = mat3.copy;

mat3.equal = function(v1, v2)
{
    return Math.abs(v1[0] - v2[0]) < mat.eps &&
        Math.abs(v1[1] - v2[1]) < mat.eps &&
        Math.abs(v1[2] - v2[2]) < mat.eps &&
        Math.abs(v1[3] - v2[3]) < mat.eps &&
        Math.abs(v1[4] - v2[4]) < mat.eps &&
        Math.abs(v1[5] - v2[5]) < mat.eps &&
        Math.abs(v1[6] - v2[6]) < mat.eps &&
        Math.abs(v1[7] - v2[7]) < mat.eps &&
        Math.abs(v1[8] - v2[8]) < mat.eps;
};

mat3.random = function()
{
    var result = new Float32Array(9);
    result._type = 'matrix';
    result[0] = Math.random();
    result[1] = Math.random();
    result[2] = Math.random();
    result[3] = Math.random();
    result[4] = Math.random();
    result[5] = Math.random();
    result[6] = Math.random();
    result[7] = Math.random();
    result[8] = Math.random();
    return result;
};

mat3.set = function(dest, mat)
{
    dest[0] = mat[0];
    dest[1] = mat[1];
    dest[2] = mat[2];
    dest[3] = mat[3];
    dest[4] = mat[4];
    dest[5] = mat[5];
    dest[6] = mat[6];
    dest[7] = mat[7];
    dest[8] = mat[8];
    return dest;
};

(function() {
var _identity = new Float32Array([1,0,0,
                                  0,1,0,
                                  0,0,1]);

mat3.identity = function()
{
    var result = new Float32Array(_identity);
    result._type = 'matrix';
    return result;
};

mat3.set_identity = function(mat)
{
    mat3.set(mat, _identity);
    return mat;
};
})();

mat3.transpose = function(mat)
{
    var result = new Float32Array(9);
    result._type = 'matrix';
    result[0] = mat[0];
    result[1] = mat[3];
    result[2] = mat[6];
    result[3] = mat[1];
    result[4] = mat[4];
    result[5] = mat[7];
    result[6] = mat[2];
    result[7] = mat[5];
    result[8] =  mat[8];
    return result;
};

mat3.set_transpose = function(dest, mat)
{
    if (mat == dest) {
        var a01 = mat[1], a02 = mat[2];
        var a12 = mat[5];
        dest[1] = mat[3];
        dest[2] = mat[6];
        dest[3] = a01;
        dest[5] = mat[7];
        dest[6] = a02;
        dest[7] = a12;
        return dest;
    } else {
        dest[0] = mat[0];
        dest[1] = mat[3];
        dest[2] = mat[6];
        dest[3] = mat[1];
        dest[4] = mat[4];
        dest[5] = mat[7];
        dest[6] = mat[2];
        dest[7] = mat[5];
        dest[8] = mat[8];
        return dest;
    }
};

mat3.determinant = function(mat)
{
    var a00 = mat[0], a01 = mat[1], a02 = mat[2];
    var a10 = mat[3], a11 = mat[4], a12 = mat[5];
    var a20 = mat[6], a21 = mat[7], a22 = mat[8];
    
    return a00*a11*a22 + a01*a12*a20 + a02*a10*a21
        - a02*a11*a20 - a01*a10*a22 - a00*a12*a21;
};

// From glMatrix
mat3.inverse = function(mat)
{
    var result = new Float32Array(9);
    result._type = 'matrix';

    var a00 = mat[0], a01 = mat[3], a02 = mat[6];
    var a10 = mat[1], a11 = mat[4], a12 = mat[7];
    var a20 = mat[2], a21 = mat[5], a22 = mat[8];
    
    // Calculate the determinant (inlined to avoid double-caching)
    // var det = mat3.determinant(mat);
    var det = a00*a11*a22 + a01*a12*a20 + a02*a10*a21
        - a02*a11*a20 - a01*a10*a22 - a00*a12*a21;
    if (det === 0)
        throw "Singular matrix";

    result[0] = ( a11*a22 - a12*a21)/det;
    result[1] = (-a10*a22 + a12*a20)/det;
    result[2] = ( a10*a21 - a11*a20)/det;
    result[3] = (-a01*a22 + a02*a21)/det;
    result[4] = ( a00*a22 - a02*a20)/det;
    result[5] = (-a00*a21 + a01*a20)/det;
    result[6] = ( a01*a12 - a02*a11)/det;
    result[7] = (-a00*a12 + a02*a10)/det;
    result[8] = ( a00*a11 - a01*a10)/det;

    return result;
};

// From glMatrix
mat3.invert = function(mat)
{
    var a00 = mat[0], a01 = mat[3], a02 = mat[6];
    var a10 = mat[1], a11 = mat[4], a12 = mat[7];
    var a20 = mat[2], a21 = mat[5], a22 = mat[8];
    
    // Calculate the determinant (inlined to avoid double-caching)
    var det = a00*a11*a22 + a01*a12*a20 + a02*a10*a21
        - a02*a11*a20 - a01*a10*a22 - a00*a12*a21;
    if (det === 0)
        throw "Singular matrix";

    mat[0] = ( a11*a22 - a12*a21)/det;
    mat[1] = (-a10*a22 + a12*a20)/det;
    mat[2] = ( a10*a21 - a11*a20)/det;
    mat[3] = (-a01*a22 + a02*a21)/det;
    mat[4] = ( a00*a22 - a02*a20)/det;
    mat[5] = (-a00*a21 + a01*a20)/det;
    mat[6] = ( a01*a12 - a02*a11)/det;
    mat[7] = (-a00*a12 + a02*a10)/det;
    mat[8] = ( a00*a11 - a01*a10)/det;

    return mat;
};

mat3.as_mat4 = function(mat)
{
    var result = new Float32Array(9);
    result._type = 'matrix';
    result[0]  = mat[0];
    result[1]  = mat[1];
    result[2]  = mat[2];
    result[4]  = mat[3];
    result[5]  = mat[4];
    result[6]  = mat[5];
    result[8]  = mat[6];
    result[9]  = mat[7];
    result[10] = mat[8];
    return result;
};

mat3.as_mat2 = function(mat)
{
    var result = new Float32Array(4);
    result._type = 'matrix';
    result[0] = mat[0];
    result[1] = mat[1];
    result[2] = mat[3];
    result[3] = mat[4];
    return result;
};

// from glMatrix
mat3.product = function(m1, m2)
{
    var result = new Float32Array(9);
    result._type = 'matrix';

    // Cache the matrix values (makes for huge speed increases!)
    var a00 = m1[0],  a01 = m1[1],  a02 = m1[2];
    var a10 = m1[3],  a11 = m1[4],  a12 = m1[5];
    var a20 = m1[6],  a21 = m1[7],  a22 = m1[8];
    
    var b00 = m2[0],  b01 = m2[1],  b02 = m2[2];
    var b10 = m2[3],  b11 = m2[4],  b12 = m2[5];
    var b20 = m2[6],  b21 = m2[7],  b22 = m2[8];
    
    result[0] = b00*a00 + b01*a10 + b02*a20;
    result[1] = b00*a01 + b01*a11 + b02*a21;
    result[2] = b00*a02 + b01*a12 + b02*a22;
    result[3] = b10*a00 + b11*a10 + b12*a20;
    result[4] = b10*a01 + b11*a11 + b12*a21;
    result[5] = b10*a02 + b11*a12 + b12*a22;
    result[6] = b20*a00 + b21*a10 + b22*a20;
    result[7] = b20*a01 + b21*a11 + b22*a21;
    result[8] = b20*a02 + b21*a12 + b22*a22;
    
    return result;
};

// from glMatrix
mat3.multiply = function(dest, other)
{
    // Cache the matrix values (makes for huge speed increases!)
    var a00 = dest[0],  a01 = dest[1],  a02 = dest[2]; 
    var a10 = dest[3],  a11 = dest[4],  a12 = dest[5]; 
    var a20 = dest[6],  a21 = dest[7],  a22 = dest[8];
    
    var b00 = other[0],  b01 = other[1],  b02 = other[2]; 
    var b10 = other[3],  b11 = other[4],  b12 = other[5]; 
    var b20 = other[6],  b21 = other[7],  b22 = other[8];
    
    dest[0] = b00*a00 + b01*a10 + b02*a20;
    dest[1] = b00*a01 + b01*a11 + b02*a21;
    dest[2] = b00*a02 + b01*a12 + b02*a22;
    dest[3] = b10*a00 + b11*a10 + b12*a20;
    dest[4] = b10*a01 + b11*a11 + b12*a21;
    dest[5] = b10*a02 + b11*a12 + b12*a22;
    dest[6] = b20*a00 + b21*a10 + b22*a20;
    dest[7] = b20*a01 + b21*a11 + b22*a21;
    dest[8] = b20*a02 + b21*a12 + b22*a22;
    
    return dest;
};

mat3.product_vec = function(mat, vec)
{
    var result = new Float32Array(3);
    result._type = 'vector';
    var x = vec[0], y = vec[1], z = vec[2];
    result[0] = mat[0]*x + mat[3]*y + mat[6]*z;
    result[1] = mat[1]*x + mat[4]*y + mat[7]*z;
    result[2] = mat[2]*x + mat[5]*y + mat[8]*z;
    return result;
};

mat3.multiply_vec = function(mat, vec)
{
    var x = vec[0], y = vec[1], z = vec[2];
    vec[0] = mat[0]*x + mat[3]*y + mat[6]*z;
    vec[1] = mat[1]*x + mat[4]*y + mat[7]*z;
    vec[2] = mat[2]*x + mat[5]*y + mat[8]*z;
    return vec;
};

mat3.frobenius_norm = function(mat)
{
    return Math.sqrt(mat[0] * mat[0] +
                     mat[1] * mat[1] +
                     mat[2] * mat[2] +
                     mat[3] * mat[3] +
                     mat[4] * mat[4] +
                     mat[5] * mat[5] +
                     mat[6] * mat[6] +
                     mat[7] * mat[7] +
                     mat[8] * mat[8]);

};

mat3.map = function(mat, f)
{
    return mat3.make(_.map(mat, f));
};

mat3.str = function(mat)
{
    return "[ [" + mat[0] + "] [" + mat[3] + "] [" + mat[6] + "] ]\n" +
        "[ [" + mat[1] + "] [" + mat[4] + "] [" + mat[7] + "] ]\n" +
        "[ [" + mat[2] + "] [" + mat[5] + "] [" + mat[8] + "] ]";
};

var mat4 = {};

mat4.create = function(mat)
{
    var result = new Float32Array(16);
    result._type = 'matrix';
    return result;
};

mat4.copy = function(mat)
{
    var result = new Float32Array(16);
    result._type = 'matrix';
    result[0] = mat[0];
    result[1] = mat[1];
    result[2] = mat[2];
    result[3] = mat[3];
    result[4] = mat[4];
    result[5] = mat[5];
    result[6] = mat[6];
    result[7] = mat[7];
    result[8] = mat[8];
    result[9] = mat[9];
    result[10] = mat[10];
    result[11] = mat[11];
    result[12] = mat[12];
    result[13] = mat[13];
    result[14] = mat[14];
    result[15] = mat[15];
    return result;
};
mat4.make = mat4.copy;

mat4.equal = function(v1, v2)
{
    return Math.abs(v1[0] - v2[0]) < mat.eps &&
        Math.abs(v1[1] - v2[1]) < mat.eps &&
        Math.abs(v1[2] - v2[2]) < mat.eps &&
        Math.abs(v1[3] - v2[3]) < mat.eps &&
        Math.abs(v1[4] - v2[4]) < mat.eps &&
        Math.abs(v1[5] - v2[5]) < mat.eps &&
        Math.abs(v1[6] - v2[6]) < mat.eps &&
        Math.abs(v1[7] - v2[7]) < mat.eps &&
        Math.abs(v1[8] - v2[8]) < mat.eps &&
        Math.abs(v1[9] - v2[9]) < mat.eps &&
        Math.abs(v1[10]- v2[10]) < mat.eps &&
        Math.abs(v1[11]- v2[11]) < mat.eps &&
        Math.abs(v1[12]- v2[12]) < mat.eps &&
        Math.abs(v1[13]- v2[13]) < mat.eps &&
        Math.abs(v1[14]- v2[14]) < mat.eps &&
        Math.abs(v1[15]- v2[15]) < mat.eps;
};

mat4.random = function()
{
    var result = mat4.create();
    for (var i=0; i<16; ++i) {
        result[i] = Math.random();
    }
    return result;
};

mat4.set = function(dest, mat)
{
    dest[0] = mat[0];
    dest[1] = mat[1];
    dest[2] = mat[2];
    dest[3] = mat[3];
    dest[4] = mat[4];
    dest[5] = mat[5];
    dest[6] = mat[6];
    dest[7] = mat[7];
    dest[8] = mat[8];
    dest[9] = mat[9];
    dest[10] = mat[10];
    dest[11] = mat[11];
    dest[12] = mat[12];
    dest[13] = mat[13];
    dest[14] = mat[14];
    dest[15] = mat[15];
    return dest;
};

(function() {
var _identity = new Float32Array([1,0,0,0,
                                  0,1,0,0,
                                  0,0,1,0,
                                  0,0,0,1]);

mat4.identity = function()
{
    var result = new Float32Array(_identity);
    result._type = 'matrix';
    return result;
};

mat4.set_identity = function(mat)
{
    mat4.set(mat, _identity);
    return mat;
};
})();

mat4.transpose = function(mat)
{
    var result = new Float32Array(16);
    result._type = 'matrix';
    result[0] = mat[0];
    result[1] = mat[4];
    result[2] = mat[8];
    result[3] = mat[12];
    result[4] = mat[1];
    result[5] = mat[5];
    result[6] = mat[9];
    result[7] = mat[13];
    result[8] =  mat[2];
    result[9] =  mat[6];
    result[10] = mat[10];
    result[11] = mat[14];
    result[12] = mat[3];
    result[13] = mat[7];
    result[14] = mat[11];
    result[15] = mat[15];
    return result;
};

mat4.set_transpose = function(dest, mat)
{
    if (mat == dest) {
        var a01 = mat[1], a02 = mat[2], a03 = mat[3];
        var a12 = mat[6], a13 = mat[7];
        var a23 = mat[11];
        dest[1] = mat[4];
        dest[2] = mat[8];
        dest[3] = mat[12];
        dest[4] = a01;
        dest[6] = mat[9];
        dest[7] = mat[13];
        dest[8] = a02;
        dest[9] = a03;
        dest[11] = mat[14];
        dest[12] = a03;
        dest[13] = a13;
        dest[14] = a23;
        return dest;
    } else {
        dest[0] = mat[0];
        dest[1] = mat[4];
        dest[2] = mat[8];
        dest[3] = mat[12];
        dest[4] = mat[1];
        dest[5] = mat[5];
        dest[6] = mat[9];
        dest[7] = mat[13];
        dest[8] = mat[2];
        dest[9] = mat[6];
        dest[10] = mat[10];
        dest[11] = mat[14];
        dest[12] = mat[3];
        dest[13] = mat[7];
        dest[14] = mat[11];
        dest[15] = mat[15];
        return dest;
    }
};

// From glMatrix
mat4.determinant = function(mat)
{
    var a00 = mat[0], a01 = mat[1], a02 = mat[2], a03 = mat[3];
    var a10 = mat[4], a11 = mat[5], a12 = mat[6], a13 = mat[7];
    var a20 = mat[8], a21 = mat[9], a22 = mat[10], a23 = mat[11];
    var a30 = mat[12], a31 = mat[13], a32 = mat[14], a33 = mat[15];
    
    return a30*a21*a12*a03 - a20*a31*a12*a03 - a30*a11*a22*a03 + a10*a31*a22*a03 +
	a20*a11*a32*a03 - a10*a21*a32*a03 - a30*a21*a02*a13 + a20*a31*a02*a13 +
	a30*a01*a22*a13 - a00*a31*a22*a13 - a20*a01*a32*a13 + a00*a21*a32*a13 +
	a30*a11*a02*a23 - a10*a31*a02*a23 - a30*a01*a12*a23 + a00*a31*a12*a23 +
	a10*a01*a32*a23 - a00*a11*a32*a23 - a20*a11*a02*a33 + a10*a21*a02*a33 +
	a20*a01*a12*a33 - a00*a21*a12*a33 - a10*a01*a22*a33 + a00*a11*a22*a33;
};

// From glMatrix
mat4.inverse = function(mat)
{
    var result = new Float32Array(16);
    result._type = 'matrix';
	
    var a00 = mat[0], a01 = mat[1], a02 = mat[2], a03 = mat[3];
    var a10 = mat[4], a11 = mat[5], a12 = mat[6], a13 = mat[7];
    var a20 = mat[8], a21 = mat[9], a22 = mat[10], a23 = mat[11];
    var a30 = mat[12], a31 = mat[13], a32 = mat[14], a33 = mat[15];
	
    var b00 = a00*a11 - a01*a10;
    var b01 = a00*a12 - a02*a10;
    var b02 = a00*a13 - a03*a10;
    var b03 = a01*a12 - a02*a11;
    var b04 = a01*a13 - a03*a11;
    var b05 = a02*a13 - a03*a12;
    var b06 = a20*a31 - a21*a30;
    var b07 = a20*a32 - a22*a30;
    var b08 = a20*a33 - a23*a30;
    var b09 = a21*a32 - a22*a31;
    var b10 = a21*a33 - a23*a31;
    var b11 = a22*a33 - a23*a32;
    
    // Calculate the determinant (inlined to avoid double-caching)
    var det = (b00*b11 - b01*b10 + b02*b09 + b03*b08 - b04*b07 + b05*b06);
    
    result[0] = (a11*b11 - a12*b10 + a13*b09)/det;
    result[1] = (-a01*b11 + a02*b10 - a03*b09)/det;
    result[2] = (a31*b05 - a32*b04 + a33*b03)/det;
    result[3] = (-a21*b05 + a22*b04 - a23*b03)/det;
    result[4] = (-a10*b11 + a12*b08 - a13*b07)/det;
    result[5] = (a00*b11 - a02*b08 + a03*b07)/det;
    result[6] = (-a30*b05 + a32*b02 - a33*b01)/det;
    result[7] = (a20*b05 - a22*b02 + a23*b01)/det;
    result[8] = (a10*b10 - a11*b08 + a13*b06)/det;
    result[9] = (-a00*b10 + a01*b08 - a03*b06)/det;
    result[10] = (a30*b04 - a31*b02 + a33*b00)/det;
    result[11] = (-a20*b04 + a21*b02 - a23*b00)/det;
    result[12] = (-a10*b09 + a11*b07 - a12*b06)/det;
    result[13] = (a00*b09 - a01*b07 + a02*b06)/det;
    result[14] = (-a30*b03 + a31*b01 - a32*b00)/det;
    result[15] = (a20*b03 - a21*b01 + a22*b00)/det;
    
    return result;
};

// From glMatrix
mat4.invert = function(mat)
{
    var a00 = mat[0], a01 = mat[1], a02 = mat[2], a03 = mat[3];
    var a10 = mat[4], a11 = mat[5], a12 = mat[6], a13 = mat[7];
    var a20 = mat[8], a21 = mat[9], a22 = mat[10], a23 = mat[11];
    var a30 = mat[12], a31 = mat[13], a32 = mat[14], a33 = mat[15];
	
    var b00 = a00*a11 - a01*a10;
    var b01 = a00*a12 - a02*a10;
    var b02 = a00*a13 - a03*a10;
    var b03 = a01*a12 - a02*a11;
    var b04 = a01*a13 - a03*a11;
    var b05 = a02*a13 - a03*a12;
    var b06 = a20*a31 - a21*a30;
    var b07 = a20*a32 - a22*a30;
    var b08 = a20*a33 - a23*a30;
    var b09 = a21*a32 - a22*a31;
    var b10 = a21*a33 - a23*a31;
    var b11 = a22*a33 - a23*a32;
    
    // Calculate the determinant (inlined to avoid double-caching)
    var det = (b00*b11 - b01*b10 + b02*b09 + b03*b08 - b04*b07 + b05*b06);
    
    mat[0] = (a11*b11 - a12*b10 + a13*b09)/det;
    mat[1] = (-a01*b11 + a02*b10 - a03*b09)/det;
    mat[2] = (a31*b05 - a32*b04 + a33*b03)/det;
    mat[3] = (-a21*b05 + a22*b04 - a23*b03)/det;
    mat[4] = (-a10*b11 + a12*b08 - a13*b07)/det;
    mat[5] = (a00*b11 - a02*b08 + a03*b07)/det;
    mat[6] = (-a30*b05 + a32*b02 - a33*b01)/det;
    mat[7] = (a20*b05 - a22*b02 + a23*b01)/det;
    mat[8] = (a10*b10 - a11*b08 + a13*b06)/det;
    mat[9] = (-a00*b10 + a01*b08 - a03*b06)/det;
    mat[10] = (a30*b04 - a31*b02 + a33*b00)/det;
    mat[11] = (-a20*b04 + a21*b02 - a23*b00)/det;
    mat[12] = (-a10*b09 + a11*b07 - a12*b06)/det;
    mat[13] = (a00*b09 - a01*b07 + a02*b06)/det;
    mat[14] = (-a30*b03 + a31*b01 - a32*b00)/det;
    mat[15] = (a20*b03 - a21*b01 + a22*b00)/det;
    
    return mat;
};

mat4.as_mat3 = function(mat)
{
    var result = new Float32Array(9);
    result._type = 'matrix';
    result[0] = mat[0];
    result[1] = mat[1];
    result[2] = mat[2];
    result[3] = mat[4];
    result[4] = mat[5];
    result[5] = mat[6];
    result[6] = mat[8];
    result[7] = mat[9];
    result[8] = mat[10];
    return result;
};

mat4.as_mat2 = function(mat)
{
    var result = new Float32Array(4);
    result._type = 'matrix';
    result[0] = mat[0];
    result[1] = mat[1];
    result[2] = mat[4];
    result[3] = mat[5];
    return result;
};


// from glMatrix
mat4.as_inverse_transpose_mat3 = function(mat)
{
    // Cache the matrix values (makes for huge speed increases!)
    var a00 = mat[0], a01 = mat[4], a02 = mat[8];
    var a10 = mat[1], a11 = mat[5], a12 = mat[9];
    var a20 = mat[2], a21 = mat[6], a22 = mat[10];
	
    var b01 =  a22*a11-a12*a21;
    var b11 = -a22*a10+a12*a20;
    var b21 =  a21*a10-a11*a20;
		
    var d = a00*b01 + a01*b11 + a02*b21;
    if (!d) throw "singular matrix";

    var result = new Float32Array(9);
    result._type = 'matrix';
	
    result[0] = b01/d;
    result[1] = (-a22*a01 + a02*a21)/d;
    result[2] = ( a12*a01 - a02*a11)/d;
    result[3] = b11/d;
    result[4] = ( a22*a00 - a02*a20)/d;
    result[5] = (-a12*a00 + a02*a10)/d;
    result[6] = b21/d;
    result[7] = (-a21*a00 + a01*a20)/d;
    result[8] = ( a11*a00 - a01*a10)/d;
	
    return result;
};

// from glMatrix
mat4.product = function(m1, m2)
{
    var result = new Float32Array(16);
    result._type = 'matrix';

    // Cache the matrix values (makes for huge speed increases!)
    var a00 = m1[0],  a01 = m1[1],  a02 = m1[2],  a03 = m1[3];
    var a10 = m1[4],  a11 = m1[5],  a12 = m1[6],  a13 = m1[7];
    var a20 = m1[8],  a21 = m1[9],  a22 = m1[10], a23 = m1[11];
    var a30 = m1[12], a31 = m1[13], a32 = m1[14], a33 = m1[15];
    
    var b00 = m2[0],  b01 = m2[1],  b02 = m2[2],  b03 = m2[3];
    var b10 = m2[4],  b11 = m2[5],  b12 = m2[6],  b13 = m2[7];
    var b20 = m2[8],  b21 = m2[9],  b22 = m2[10], b23 = m2[11];
    var b30 = m2[12], b31 = m2[13], b32 = m2[14], b33 = m2[15];
    
    result[0]  = b00*a00 + b01*a10 + b02*a20 + b03*a30;
    result[1]  = b00*a01 + b01*a11 + b02*a21 + b03*a31;
    result[2]  = b00*a02 + b01*a12 + b02*a22 + b03*a32;
    result[3]  = b00*a03 + b01*a13 + b02*a23 + b03*a33;
    result[4]  = b10*a00 + b11*a10 + b12*a20 + b13*a30;
    result[5]  = b10*a01 + b11*a11 + b12*a21 + b13*a31;
    result[6]  = b10*a02 + b11*a12 + b12*a22 + b13*a32;
    result[7]  = b10*a03 + b11*a13 + b12*a23 + b13*a33;
    result[8]  = b20*a00 + b21*a10 + b22*a20 + b23*a30;
    result[9]  = b20*a01 + b21*a11 + b22*a21 + b23*a31;
    result[10] = b20*a02 + b21*a12 + b22*a22 + b23*a32;
    result[11] = b20*a03 + b21*a13 + b22*a23 + b23*a33;
    result[12] = b30*a00 + b31*a10 + b32*a20 + b33*a30;
    result[13] = b30*a01 + b31*a11 + b32*a21 + b33*a31;
    result[14] = b30*a02 + b31*a12 + b32*a22 + b33*a32;
    result[15] = b30*a03 + b31*a13 + b32*a23 + b33*a33;
    
    return result;
};

// from glMatrix
mat4.multiply = function(dest, other)
{
    // Cache the matrix values (makes for huge speed increases!)
    var a00 = dest[0],  a01 = dest[1],  a02 = dest[2],  a03 = dest[3];
    var a10 = dest[4],  a11 = dest[5],  a12 = dest[6],  a13 = dest[7];
    var a20 = dest[8],  a21 = dest[9],  a22 = dest[10], a23 = dest[11];
    var a30 = dest[12], a31 = dest[13], a32 = dest[14], a33 = dest[15];
    
    var b00 = other[0],  b01 = other[1],  b02 = other[2],  b03 = other[3];
    var b10 = other[4],  b11 = other[5],  b12 = other[6],  b13 = other[7];
    var b20 = other[8],  b21 = other[9],  b22 = other[10], b23 = other[11];
    var b30 = other[12], b31 = other[13], b32 = other[14], b33 = other[15];
    
    dest[0]  = b00*a00 + b01*a10 + b02*a20 + b03*a30;
    dest[1]  = b00*a01 + b01*a11 + b02*a21 + b03*a31;
    dest[2]  = b00*a02 + b01*a12 + b02*a22 + b03*a32;
    dest[3]  = b00*a03 + b01*a13 + b02*a23 + b03*a33;
    dest[4]  = b10*a00 + b11*a10 + b12*a20 + b13*a30;
    dest[5]  = b10*a01 + b11*a11 + b12*a21 + b13*a31;
    dest[6]  = b10*a02 + b11*a12 + b12*a22 + b13*a32;
    dest[7]  = b10*a03 + b11*a13 + b12*a23 + b13*a33;
    dest[8]  = b20*a00 + b21*a10 + b22*a20 + b23*a30;
    dest[9]  = b20*a01 + b21*a11 + b22*a21 + b23*a31;
    dest[10] = b20*a02 + b21*a12 + b22*a22 + b23*a32;
    dest[11] = b20*a03 + b21*a13 + b22*a23 + b23*a33;
    dest[12] = b30*a00 + b31*a10 + b32*a20 + b33*a30;
    dest[13] = b30*a01 + b31*a11 + b32*a21 + b33*a31;
    dest[14] = b30*a02 + b31*a12 + b32*a22 + b33*a32;
    dest[15] = b30*a03 + b31*a13 + b32*a23 + b33*a33;
    
    return dest;
};

mat4.product_vec = function(mat, vec)
{
    var result = new Float32Array(4);
    result._type = 'vector';
    var x = vec[0], y = vec[1], z = vec[2], w = vec[3];
    result[0] = mat[0]*x + mat[4]*y + mat[8]*z  + mat[12]*w;
    result[1] = mat[1]*x + mat[5]*y + mat[9]*z  + mat[13]*w;
    result[2] = mat[2]*x + mat[6]*y + mat[10]*z + mat[14]*w;
    result[3] = mat[3]*x + mat[7]*y + mat[11]*z + mat[15]*w;
    return result;
};

mat4.multiply_vec = function(mat, vec)
{
    var x = vec[0], y = vec[1], z = vec[2], w = vec[3];
    vec[0] = mat[0]*x + mat[4]*y + mat[8]*z  + mat[12]*w;
    vec[1] = mat[1]*x + mat[5]*y + mat[9]*z  + mat[13]*w;
    vec[2] = mat[2]*x + mat[6]*y + mat[10]*z + mat[14]*w;
    vec[3] = mat[3]*x + mat[7]*y + mat[11]*z + mat[15]*w;
    return vec;
};

mat4.multiply_vec3 = function(mat, vec)
{
    var x = vec[0], y = vec[1], z = vec[2];
    vec[0] = mat[0]*x + mat[4]*y + mat[8]*z;
    vec[1] = mat[1]*x + mat[5]*y + mat[9]*z;
    vec[2] = mat[2]*x + mat[6]*y + mat[10]*z;
    return vec;
};

// from glMatrix
mat4.translation_of = function(mat, vec)
{
    var result = new Float32Array(16);
    result._type = 'matrix';
    var x = vec[0], y = vec[1], z = vec[2];
    var a00 = mat[0], a01 = mat[1], a02 = mat[2], a03 = mat[3];
    var a10 = mat[4], a11 = mat[5], a12 = mat[6], a13 = mat[7];
    var a20 = mat[8], a21 = mat[9], a22 = mat[10], a23 = mat[11];
    result[0] = a00;
    result[1] = a01;
    result[2] = a02;
    result[3] = a03;
    result[4] = a10;
    result[5] = a11;
    result[6] = a12;
    result[7] = a13;
    result[8] = a20;
    result[9] = a21;
    result[10] = a22;
    result[11] = a23;
    result[12] = a00*x + a10*y + a20*z + mat[12];
    result[13] = a01*x + a11*y + a21*z + mat[13];
    result[14] = a02*x + a12*y + a22*z + mat[14];
    result[15] = a03*x + a13*y + a23*z + mat[15];
    return result;
};

mat4.translation = function(vec)
{
    var result = new Float32Array(16);
    result._type = 'matrix';
    result[0] = result[5] = result[10] = result[15] = 1;    
    result[12] = vec[0];
    result[13] = vec[1];
    result[14] = vec[2];
    return result;
};

mat4.translate = function(mat, vec)
{
    var x = vec[0], y = vec[1], z = vec[2];
    mat[12] = mat[0]*x + mat[4]*y + mat[8]*z + mat[12];
    mat[13] = mat[1]*x + mat[5]*y + mat[9]*z + mat[13];
    mat[14] = mat[2]*x + mat[6]*y + mat[10]*z + mat[14];
    mat[15] = mat[3]*x + mat[7]*y + mat[11]*z + mat[15];
    return mat;
};

mat4.scaling_of = function(mat, vec)
{
    var result = new Float32Array(16);
    result._type = 'matrix';
    var x = vec[0], y = vec[1], z = vec[2];
    result[0] =  mat[0]  * x;
    result[1] =  mat[1]  * x;
    result[2] =  mat[2]  * x;
    result[3] =  mat[3]  * x;
    result[4] =  mat[4]  * y;
    result[5] =  mat[5]  * y;
    result[6] =  mat[6]  * y;
    result[7] =  mat[7]  * y;
    result[8] =  mat[8]  * z;
    result[9] =  mat[9]  * z;
    result[10] = mat[10] * z;
    result[11] = mat[11] * z;
    result[12] = mat[12];
    result[13] = mat[13];
    result[14] = mat[14];
    result[15] = mat[15];
    return result;
};

mat4.scaling = function(mat, vec)
{
    var result = new Float32Array(16);
    result[0] =  vec[0];
    result[5] =  vec[1];
    result[10] = vec[2];
    result[15] = 1;
    return result;
};

mat4.scale = function(mat, vec)
{
    var result = new Float32Array(16);
    result._type = 'matrix';
    var x = vec[0], y = vec[1], z = vec[2];
    mat[0]  *= x;
    mat[1]  *= x;
    mat[2]  *= x;
    mat[3]  *= x;
    mat[4]  *= y;
    mat[5]  *= y;
    mat[6]  *= y;
    mat[7]  *= y;
    mat[8]  *= z;
    mat[9]  *= z;
    mat[10] *= z;
    mat[11] *= z;
    return result;
};

// from glMatrix
mat4.rotation_of = function(mat, angle, axis)
{
    var x = axis[0], y = axis[1], z = axis[2];
    var len = Math.sqrt(x*x + y*y + z*z);
    if (!len) { throw "zero-length axis"; }
    if (len != 1) {
	x /= len; 
	y /= len; 
	z /= len;
    }
    
    var s = Math.sin(angle);
    var c = Math.cos(angle);
    var t = 1-c;
    
    // Cache the matrix values (makes for huge speed increases!)
    var a00 = mat[0], a01 = mat[1], a02 = mat[2],  a03 = mat[3];
    var a10 = mat[4], a11 = mat[5], a12 = mat[6],  a13 = mat[7];
    var a20 = mat[8], a21 = mat[9], a22 = mat[10], a23 = mat[11];
    
    // Construct the elements of the rotation matrix
    var b00 = x*x*t + c, b01 = y*x*t + z*s, b02 = z*x*t - y*s;
    var b10 = x*y*t - z*s, b11 = y*y*t + c, b12 = z*y*t + x*s;
    var b20 = x*z*t + y*s, b21 = y*z*t - x*s, b22 = z*z*t + c;

    var result = new Float32Array(16);    
    result._type = 'matrix';
    
    // Perform rotation-specific matrix multiplication
    result[0]  = a00*b00 + a10*b01 + a20*b02;
    result[1]  = a01*b00 + a11*b01 + a21*b02;
    result[2]  = a02*b00 + a12*b01 + a22*b02;
    result[3]  = a03*b00 + a13*b01 + a23*b02;
    
    result[4]  = a00*b10 + a10*b11 + a20*b12;
    result[5]  = a01*b10 + a11*b11 + a21*b12;
    result[6]  = a02*b10 + a12*b11 + a22*b12;
    result[7]  = a03*b10 + a13*b11 + a23*b12;
    
    result[8]  = a00*b20 + a10*b21 + a20*b22;
    result[9]  = a01*b20 + a11*b21 + a21*b22;
    result[10] = a02*b20 + a12*b21 + a22*b22;
    result[11] = a03*b20 + a13*b21 + a23*b22;

    result[12] = mat[12];
    result[13] = mat[13];
    result[14] = mat[14];
    result[15] = mat[15];
    return result;
};

mat4.rotation = function(angle, axis)
{
    var x = axis[0], y = axis[1], z = axis[2];
    var len = Math.sqrt(x*x + y*y + z*z);
    if (!len) { throw "zero-length axis"; }
    if (len != 1) {
	x /= len; 
	y /= len; 
	z /= len;
    }
    
    var s = Math.sin(angle);
    var c = Math.cos(angle);
    var t = 1-c;
    
    // Cache the matrix values (makes for huge speed increases!)
    var a00 = 1, a01 = 0, a02 = 0, a03 = 0;
    var a10 = 0, a11 = 1, a12 = 0, a13 = 0;
    var a20 = 0, a21 = 0, a22 = 1, a23 = 0;
    
    // Construct the elements of the rotation matrix
    var b00 = x*x*t + c, b01 = y*x*t + z*s, b02 = z*x*t - y*s;
    var b10 = x*y*t - z*s, b11 = y*y*t + c, b12 = z*y*t + x*s;
    var b20 = x*z*t + y*s, b21 = y*z*t - x*s, b22 = z*z*t + c;

    var result = new Float32Array(16);    
    result._type = 'matrix';
    
    // Perform rotation-specific matrix multiplication
    result[0]  = x*x*t + c;
    result[1]  = y*x*t + z*s;
    result[2]  = z*x*t - y*s;
    result[4]  = x*y*t - z*s;
    result[5]  = y*y*t + c;
    result[6]  = z*y*t + x*s;
    result[8]  = x*z*t + y*s;
    result[9]  = y*z*t - x*s;
    result[10] = z*z*t + c;
    result[15] = 1;

    return result;
};

mat4.rotate = function(mat, angle, axis)
{
    var x = axis[0], y = axis[1], z = axis[2];
    var len = Math.sqrt(x*x + y*y + z*z);
    if (!len) { throw "zero-length axis"; }
    if (len != 1) {
	x /= len; 
	y /= len; 
	z /= len;
    }
    
    var s = Math.sin(angle);
    var c = Math.cos(angle);
    var t = 1-c;
    
    // Cache the matrix values (makes for huge speed increases!)
    var a00 = mat[0], a01 = mat[1], a02 = mat[2],  a03 = mat[3];
    var a10 = mat[4], a11 = mat[5], a12 = mat[6],  a13 = mat[7];
    var a20 = mat[8], a21 = mat[9], a22 = mat[10], a23 = mat[11];
    
    // Construct the elements of the rotation matrix
    var b00 = x*x*t + c, b01 = y*x*t + z*s, b02 = z*x*t - y*s;
    var b10 = x*y*t - z*s, b11 = y*y*t + c, b12 = z*y*t + x*s;
    var b20 = x*z*t + y*s, b21 = y*z*t - x*s, b22 = z*z*t + c;
    
    // Perform rotation-specific matrix multiplication
    mat[0]  = a00*b00 + a10*b01 + a20*b02;
    mat[1]  = a01*b00 + a11*b01 + a21*b02;
    mat[2]  = a02*b00 + a12*b01 + a22*b02;
    mat[3]  = a03*b00 + a13*b01 + a23*b02;
    
    mat[4]  = a00*b10 + a10*b11 + a20*b12;
    mat[5]  = a01*b10 + a11*b11 + a21*b12;
    mat[6]  = a02*b10 + a12*b11 + a22*b12;
    mat[7]  = a03*b10 + a13*b11 + a23*b12;
    
    mat[8]  = a00*b20 + a10*b21 + a20*b22;
    mat[9]  = a01*b20 + a11*b21 + a21*b22;
    mat[10] = a02*b20 + a12*b21 + a22*b22;
    mat[11] = a03*b20 + a13*b21 + a23*b22;

    mat[12] = mat[12];
    mat[13] = mat[13];
    mat[14] = mat[14];
    mat[15] = mat[15];
    return mat;
};

mat4.frustum = function(left, right, bottom, top, near, far)
{
    var result = new Float32Array(16);
    result._type = 'matrix';
    var rl = (right - left);
    var tb = (top - bottom);
    var fn = (far - near);
    result[0] = (near*2) / rl;
    result[5] = (near*2) / tb;
    result[8] = (right + left) / rl;
    result[9] = (top + bottom) / tb;
    result[10] = -(far + near) / fn;
    result[11] = -1;
    result[14] = -(far*near*2) / fn;
    return result;
};

mat4.perspective = function(fovy, aspect, near, far)
{
    var top = near*Math.tan(fovy*Math.PI / 360.0);
    var right = top*aspect;
    return mat4.frustum(-right, right, -top, top, near, far);
};

mat4.ortho = function(left, right, bottom, top, near, far)
{
    var result = new Float32Array(16);
    result._type = 'matrix';
    var rl = (right - left);
    var tb = (top - bottom);
    var fn = (far - near);
    result[0] = 2 / rl;
    result[5] = 2 / tb;
    result[10] = -2 / fn;
    result[12] = -(left + right) / rl;
    result[13] = -(top + bottom) / tb;
    result[14] = -(far + near) / fn;
    result[15] = 1;
    return result;
};

mat4.lookAt = function(eye, center, up)
{
    var result = new Float32Array(16);
    result._type = 'matrix';
    
    var eyex = eye[0],
    eyey = eye[1],
    eyez = eye[2],
    upx = up[0],
    upy = up[1],
    upz = up[2],
    centerx = center[0],
    centery = center[1],
    centerz = center[2];

    if (eyex == centerx && eyey == centery && eyez == centerz) {
	return mat4.identity();
    }
    
    var z0,z1,z2,x0,x1,x2,y0,y1,y2,len;
    
    //vec3.direction(eye, center, z);
    z0 = eyex - center[0];
    z1 = eyey - center[1];
    z2 = eyez - center[2];
    
    // normalize (no check needed for 0 because of early return)
    len = Math.sqrt(z0*z0 + z1*z1 + z2*z2);
    z0 /= len;
    z1 /= len;
    z2 /= len;
    
    //vec3.normalize(vec3.cross(up, z, x));
    x0 = upy*z2 - upz*z1;
    x1 = upz*z0 - upx*z2;
    x2 = upx*z1 - upy*z0;
    if ((len = Math.sqrt(x0*x0 + x1*x1 + x2*x2))) {
	x0 /= len;
	x1 /= len;
	x2 /= len;
    };
    
    //vec3.normalize(vec3.cross(z, x, y));
    y0 = z1*x2 - z2*x1;
    y1 = z2*x0 - z0*x2;
    y2 = z0*x1 - z1*x0;
    
    if ((len = Math.sqrt(y0*y0 + y1*y1 + y2*y2))) {
	y0 /= len;
	y1 /= len;
	y2 /= len;
    }
    
    result[0]  = x0;
    result[1]  = y0;
    result[2]  = z0;
    result[4]  = x1;
    result[5]  = y1;
    result[6]  = z1;
    result[8]  = x2;
    result[9]  = y2;
    result[10] = z2;
    result[12] = -(x0*eyex + x1*eyey + x2*eyez);
    result[13] = -(y0*eyex + y1*eyey + y2*eyez);
    result[14] = -(z0*eyex + z1*eyey + z2*eyez);
    result[15] = 1;
    
    return result;
};

mat4.frobenius_norm = function(mat)
{
    return Math.sqrt(mat[0] * mat[0] +
                     mat[1] * mat[1] +
                     mat[2] * mat[2] +
                     mat[3] * mat[3] +
                     mat[4] * mat[4] +
                     mat[5] * mat[5] +
                     mat[6] * mat[6] +
                     mat[7] * mat[7] +
                     mat[8] * mat[8] +
                     mat[9] * mat[9] +
                     mat[10] * mat[10] +
                     mat[11] * mat[11] +
                     mat[12] * mat[12] +
                     mat[13] * mat[13] +
                     mat[14] * mat[14] +
                     mat[15] * mat[15]);
};

mat4.map = function(mat, f)
{
    return mat4.make(_.map(mat, f));
};

mat4.str = function(mat)
{
    return "[ [" + mat[0] + "] [" + mat[4] + "]" + "[ [" + mat[8] + "] [" + mat[12] + "]\n" +
        "[ [" + mat[1] + "] [" + mat[5] + "]" + "[ [" + mat[9] + "] [" + mat[13] + "]\n" +
        "[ [" + mat[2] + "] [" + mat[6] + "]" + "[ [" + mat[10] + "] [" + mat[14] + "]\n" +
        "[ [" + mat[3] + "] [" + mat[7] + "]" + "[ [" + mat[11] + "] [" + mat[15] + "] ]";
};

// A thin veneer of polymorphic convenience over the fast vec classes
// for when you can get away with a little slowness.

vec[2] = vec2;
vec[3] = vec3;
vec[4] = vec4;
vec2.mat = mat2;
vec3.mat = mat3;
vec4.mat = mat4;
vec.eps = 1e-6;

vec.make = function(v)
{
    return vec[v.length].make(v);
};

vec.equal = function(v1, v2)
{
    if (v1.length != v2.length) {
        throw "mismatched lengths";
    }
    return vec[v1.length].equal(v1, v2);
};

vec.plus = function(v1, v2)
{
    if (v1.length != v2.length) {
        throw "mismatched lengths";
    }
    return vec[v1.length].plus(v1, v2);
};

vec.minus = function(v1, v2)
{
    if (v1.length != v2.length) {
        throw "mismatched lengths";
    }
    return vec[v1.length].minus(v1, v2);
};

vec.negative = function(v)
{
    return vec[v.length].negative(v);
};

vec.scaling = function(v, val)
{
    return vec[v.length].scaling(v, val);
};

vec.schur_product = function(v1, v2)
{
    if (v1.length != v2.length) {
        throw "mismatched lengths";
    }
    return vec[v1.length].schur_product(v1, v2);
};

vec.normalized = function(v)
{
    return vec[v.length].schur_product(v);
};

vec.length = function(v)
{
    return vec[v.length].length(v);
};

vec.dot = function(v1, v2)
{
    if (v1.length != v2.length) {
        throw "mismatched lengths";
    }
    return vec[v1.length].dot(v1, v2);
};

vec.map = function(c, f)
{
    return vec[c.length].map(c, f);
};

vec.str = function(vec)
{
    return vec[vec.length].str(vec);
};
(function() {

mat[2] = mat2;
mat[3] = mat3;
mat[4] = mat4;
mat2.vec = vec2;
mat3.vec = vec3;
mat4.vec = vec4;
mat.eps = 1e-6;

function to_dim(l)
{
    switch (l) {
    case 4: return 2;
    case 9: return 3;
    case 16: return 4;
    }
    throw "bad length";
};

mat.make = function(v)
{
    return mat[to_dim(v.length)].make(v);
};

mat.map = function(c, f)
{
    return mat[to_dim(c.length)].map(c, f);
};

mat.equal = function(m1, m2)
{
    if (m1.length != m2.length) {
        throw "mismatched lengths: " + m1.length + ", " + m2.length;
    }
    return mat[to_dim(m1.length)].equal(m1, m2);
};

mat.str = function(m1)
{
    return mat[to_dim(m1.length)].str(m1);
};

})();
// FIXME DO NOT POLLUTE GLOBAL NAMESPACE
// it is convenient in many places to accept as a parameter a scalar,
// a vector or a matrix. This function tries to
// tell them apart.
function constant_type(obj)
{
    var t = typeof obj;
    if (t === "boolean")         return "boolean";
    if (t === "number")          return "number";
    if (obj) {
        t = obj._type;
        if (!t)                      return "other";
    }
    return t;
}

//////////////////////////////////////////////////////////////////////////////
// http://javascript.crockford.com/remedial.html

function typeOf(value) 
{
    var s = typeof value;
    if (s === 'object') {
        if (value) {
            if (typeof value.length === 'number' &&
                !(value.propertyIsEnumerable('length')) &&
                typeof value.splice === 'function') {
                s = 'array';
            }
        } else {
            s = 'null';
        }
    }
    return s;
}
Facet.attribute_buffer = function(vertex_array, itemSize, itemType, normalized)
{
    var ctx = Facet._globals.ctx;
    if (normalized === undefined) {
        normalized = false;
    }
    var gl_enum_typed_array_map = {
        'float': [ctx.FLOAT, Float32Array],
        'short': [ctx.SHORT, Int16Array],
        'ushort': [ctx.UNSIGNED_SHORT, Uint16Array],
        'byte': [ctx.BYTE, Int8Array],
        'ubyte': [ctx.UNSIGNED_BYTE, Uint8Array]
    };

    itemSize = itemSize || 3;
    itemType = gl_enum_typed_array_map[itemType || 'float'];

    var typedArray = new itemType[1](vertex_array);
    var result = ctx.createBuffer();
    ctx.bindBuffer(ctx.ARRAY_BUFFER, result);
    ctx.bufferData(ctx.ARRAY_BUFFER, typedArray, ctx.STATIC_DRAW);
    result._shade_type = 'attribute_buffer'; // FIXME: UGLY
    result.array = typedArray;
    result.itemSize = itemSize;
    result.numItems = vertex_array.length/itemSize;
    result.bind = function(type) {
        return function(attribute) {
            ctx.bindBuffer(ctx.ARRAY_BUFFER, this);
            ctx.vertexAttribPointer(attribute, this.itemSize, type, normalized, 0, 0);
        };
    }(itemType[0]);
    result.draw = function(primitive) {
        ctx.drawArrays(primitive, 0, this.numItems);
    };
    result.bind_and_draw = function(attribute, primitive) {
        this.bind(attribute);
        this.draw(primitive);
    };
    return result;
};
(function() {

var previous_batch = {};

Facet.unload_batch = function()
{
    var ctx = Facet._globals.ctx;
    if (previous_batch.attributes) {
        for (var key in previous_batch.attributes) {
            ctx.disableVertexAttribArray(previous_batch.program[key]);
        }
        _.each(previous_batch.program.uniforms, function (uniform) {
            delete uniform._facet_active_uniform;
        });
    }
    previous_batch = {};

    // reset the opengl capabilities which are determined by
    // Facet.DrawingMode.*
    ctx.disable(ctx.DEPTH_TEST);
    ctx.disable(ctx.BLEND);
    ctx.depthMask(true);
};

function draw_it(batch)
{
    var ctx = Facet._globals.ctx;
    if (batch.batch_id !== previous_batch.batch_id) {
        var attributes = batch.attributes || {};
        var uniforms = batch.uniforms || {};
        var program = batch.program;
        var primitives = batch.primitives;
        var key;

        Facet.unload_batch();
        previous_batch = batch;
        batch.set_caps();

        ctx.useProgram(program);

        for (key in attributes) {
            var attr = program[key];
            if (typeof attr !== 'undefined') {
                ctx.enableVertexAttribArray(attr);
                attributes[key].bind(attr);
            }
        }
        
        var currentActiveTexture = 0;
        _.each(program.uniforms, function(uniform) {
            var key = uniform.uniform_name;
            var call = uniform.uniform_call,
                value = uniform.get();
            if (typeOf(value) === 'undefined') {
                throw "uniform " + key + " has not been set.";
            }
            var t = constant_type(value);
            if (t === "other") {
                uniform._facet_active_uniform = (function(uid, cat) {
                    return function(v) {
                        ctx.activeTexture(ctx.TEXTURE0 + cat);
                        ctx.bindTexture(ctx.TEXTURE_2D, v);
                        ctx.uniform1i(uid, cat);
                    };
                })(program[key], currentActiveTexture);
                currentActiveTexture++;
            } else if (t === "number" || t === "vector" || t === "boolean") {
                uniform._facet_active_uniform = (function(call, uid) {
                    return function(v) {
                        call.call(ctx, uid, v);
                    };
                })(ctx[call], program[key]);
            } else if (t === "matrix") {
                uniform._facet_active_uniform = (function(call, uid) {
                    return function(v) {
                        ctx[call](uid, false, v);
                    };
                })(call, program[key]);
            } else {
                throw "could not figure out uniform type! " + t;
            }
            uniform._facet_active_uniform(value);
        });
    }

    batch.draw_chunk();
};

var largest_batch_id = 1;

Facet.bake = function(model, appearance)
{
    appearance = Shade.canonicalize_program_object(appearance);
    var ctx = Facet._globals.ctx;

    var batch_id = Facet.fresh_pick_id();

    function build_attribute_arrays_obj(prog) {
        return _.build(_.map(
            prog.attribute_buffers, function(v) { return [v._shade_name, v]; }
        ));
    };

    function process_appearance(val_key_function) {
        var result = {};
        _.each(appearance, function(value, key) {
            if (Shade.is_program_parameter(key)) {
                result[key] = val_key_function(value, key);
            }
        });
        return Shade.program(result);
    }

    function create_draw_program() {
        return process_appearance(function(value, key) {
            return value;
        });
    }

    function create_pick_program() {
        var pick_id;
        if (appearance.pick_id)
            pick_id = Shade.make(appearance.pick_id);
        else {
            pick_id = Shade.make(Shade.id(batch_id));
        }
        return process_appearance(function(value, key) {
            if (key === 'gl_FragColor') {
                var pick_if = (appearance.pick_if || 
                               Shade.make(value).swizzle("a").gt(0));
                return pick_id.discard_if(Shade.not(pick_if));
            } else
                return value;
        });
    }

    /* Facet unprojecting uses the render-as-depth technique suggested
     by Benedetto et al. in the SpiderGL paper in the context of
     shadow mapping:

     SpiderGL: A JavaScript 3D Graphics Library for Next-Generation
     WWW

     Marco Di Benedetto, Federico Ponchio, Fabio Ganovelli, Roberto
     Scopigno. Visual Computing Lab, ISTI-CNR

     http://vcg.isti.cnr.it/Publications/2010/DPGS10/spidergl.pdf

     FIXME: Perhaps there should be an option of doing this directly as
     render-to-float-texture.

     */
    
    function create_unproject_program() {
        return process_appearance(function(value, key) {
            if (key === 'gl_FragColor') {
                var position_z = appearance['gl_Position'].swizzle('z'),
                    position_w = appearance['gl_Position'].swizzle('w');
                var normalized_z = position_z.div(position_w).add(1).div(2);

                // normalized_z ranges from 0 to 1.

                // an opengl z-buffer actually stores information as
                // 1/z, so that more precision is spent on the close part
                // of the depth range. Here, we are storing z, and so our efficiency won't be great.
                // 
                // However, even 1/z is only an approximation to the ideal scenario, and 
                // if we're already doing this computation on a shader, it might be worthwhile to use
                // Thatcher Ulrich's suggestion about constant relative precision using 
                // a logarithmic mapping:

                // http://tulrich.com/geekstuff/log_depth_buffer.txt

                // This mapping, incidentally, is more directly interpretable as
                // linear interpolation in log space.

                var result_rgba = Shade.vec(
                    normalized_z,
                    normalized_z.mul(1 << 8),
                    normalized_z.mul(1 << 16),
                    normalized_z.mul(1 << 24)
                );
                return result_rgba;
            } else
                return value;
        });
    }

    var primitive_types = {
        points: ctx.POINTS,
        line_strip: ctx.LINE_STRIP,
        line_loop: ctx.LINE_LOOP,
        lines: ctx.LINES,
        triangle_strip: ctx.TRIANGLE_STRIP,
        triangle_fan: ctx.TRIANGLE_FAN,
        triangles: ctx.TRIANGLES
    };

    var primitive_type = primitive_types[model.type];
    var elements = model.elements;
    var draw_chunk;
    if (typeOf(model.elements) === 'number') {
        draw_chunk = function() {
            ctx.drawArrays(primitive_type, 0, elements);
        };
    } else {
        draw_chunk = function() {
            elements.bind_and_draw(elements, primitive_type);
        };
    }
    var primitives = [primitive_types[model.type], model.elements];

    // FIXME the batch_id field in the batch_opts objects is not
    // the same as the batch_id in the batch itself. 
    // 
    // The former is used to avoid state switching, while the latter is
    // a generic automatic id which might be used for picking, for
    // example.
    // 
    // This should not lead to any problems right now but might be confusing to
    // readers.

    function create_batch_opts(program, caps_name) {
        return {
            program: program,
            attributes: build_attribute_arrays_obj(program),
            set_caps: ((appearance.mode && appearance.mode[caps_name]) ||
                       Facet.DrawingMode.standard[caps_name]),
            draw_chunk: draw_chunk,
            batch_id: largest_batch_id++
        };
    }

    var draw_opts = create_batch_opts(create_draw_program(), "set_draw_caps");
    var pick_opts = create_batch_opts(create_pick_program(), "set_pick_caps");
    var unproject_opts = create_batch_opts(create_unproject_program(), "set_unproject_caps");

    var which_opts = [ draw_opts, pick_opts, unproject_opts ];

    var result = {
        batch_id: batch_id,
        draw: function() {
            console.log(this.batch_id, Facet._globals.batch_render_mode, 
                        which_opts[Facet._globals.batch_render_mode]);
            draw_it(which_opts[Facet._globals.batch_render_mode]);
        },
        // in case you want to force the behavior, or that
        // single array lookup is too slow for you.
        _draw: function() {
            draw_it(draw_opts);
        },
        _pick: function() {
            draw_it(pick_opts);
        }
    };
    return result;
};
})();
Facet.Camera = {};
Facet.Camera.perspective = function(opts)
{
    opts = opts || {};
    opts = _.defaults(opts, {
        look_at: [[0, 0, 0], [0, 0, -1], [0, 1, 0]],
        field_of_view_y: 45,
        aspect_ratio: 1,
        near_distance: 0.1,
        far_distance: 100
    });
    
    var field_of_view_y = opts.field_of_view_y;
    var aspect_ratio = opts.aspect_ratio;
    var near_distance = opts.near_distance;
    var far_distance = opts.far_distance;

    var current_projection;
    var current_view = mat4.lookAt(opts.look_at[0],
                                   opts.look_at[1],
                                   opts.look_at[2]);
    var vp_uniform = Shade.uniform("mat4");
    var view_uniform = Shade.uniform("mat4", current_view);

    function update_projection()
    {
        current_projection = mat4.perspective(field_of_view_y, aspect_ratio,
                                              near_distance, far_distance);
        vp_uniform.set(Shade.mul(mat4.product(current_projection, current_view)));
    }

    update_projection();

    return {
        look_at: function(eye, to, up) {
            current_view = mat4.lookAt(eye, to, up);
            view_uniform.set(current_view);
        },
        set_aspect_ratio: function(a) {
            aspect_ratio = a;
            update_projection();
            vp_uniform.set(Shade.mul(mat4.product(current_projection, current_view)));
        },
        set_near_distance: function(v) {
            near_distance = v;
            update_projection();
            vp_uniform.set(Shade.mul(mat4.product(current_projection, current_view)));
        },
        set_far_distance: function(v) {
            far_distance = v;
            update_projection();
            vp_uniform.set(Shade.mul(mat4.product(current_projection, current_view)));
        },
        set_field_of_view_y: function(v) {
            field_of_view_y = v;
            update_projection();
            vp_uniform.set(Shade.mul(mat4.product(current_projection, current_view)));
        },

        project: function(model_vertex) {
            var t = model_vertex.type;
            if (t.equals(Shade.Types.vec2))
                return vp_uniform.mul(Shade.vec(model_vertex, 0, 1));
            else if (t.equals(Shade.Types.vec3))
                return vp_uniform.mul(Shade.vec(model_vertex, 1));
            else if (t.equals(Shade.Types.vec4))
                return vp_uniform.mul(model_vertex);
            else
                throw "Type mismatch: expected vec, got " + t.repr();
        },
        eye_vertex: function(model_vertex) {
            var t = model_vertex.type;
            if (t.equals(Shade.Types.vec2))
                return view_uniform.mul(Shade.vec(model_vertex, 0, 1));
            else if (t.equals(Shade.Types.vec3))
                return view_uniform.mul(Shade.vec(model_vertex, 1));
            else if (t.equals(Shade.Types.vec4))
                return view_uniform.mul(model_vertex);
            else
                throw "Type mismatch: expected vec, got " + t.repr();
        }
    };
};
Facet.Camera.ortho = function(opts)
{
    opts = _.defaults(opts || {}, {
        aspect_ratio: 1,
        left: -1,
        right: -1,
        bottom: -1,
        top: 1,
        near: -1,
        far: 1
    });

    var left = opts.left;
    var right = opts.right;
    var bottom = opts.bottom;
    var top = opts.top;
    var screen_ratio = opts.aspect_ratio;
    var near = opts.near;
    var far = opts.far;

    var proj_uniform = Shade.uniform("mat4");

    function update_projection()
    {
        var view_ratio = (right - left) / (top - bottom);
        var l, r, t, b;
        if (view_ratio > screen_ratio) {
            // fat view rectangle, "letterbox" the projection
            var cy = (top + bottom) / 2;
            var half_width = (right - left) / 2;
            var half_height = half_width / screen_ratio;
            l = left;
            r = right;
            t = cy + half_height;
            b = cy - half_height;
        } else {
            // tall view rectangle, "pillarbox" the projection
            var cx = (right + left) / 2;
            var half_height = (top - bottom) / 2;
            var half_width = half_height * screen_ratio;
            l = cx - half_width;
            r = cx + half_width;
            t = top;
            b = bottom;
        }
        proj_uniform.set(mat4.ortho(l, r, b, t, near, far));
    }

    update_projection();

    return {
        set_aspect_ratio: function(new_aspect_ratio) {
            screen_ratio = new_aspect_ratio;
            update_projection();
        },
        set_bounds: function(opts) {
            opts = _.defaults(opts, {
                left: -1,
                right: 1,
                bottom: -1,
                top: 1,
                near: -1,
                far: 1
            });
            left = opts.left;
            right = opts.right;
            bottom = opts.bottom;
            top = opts.top;
            near = opts.near;
            far = opts.far;
            update_projection();
        },
        project: function(model_vertex) {
            var t = model_vertex.type;
            if (t.equals(Shade.Types.vec2))
                return proj_uniform.mul(Shade.vec(model_vertex, 0, 1));
            else if (t.equals(Shade.Types.vec3))
                return proj_uniform.mul(Shade.vec(model_vertex, 1));
            else if (t.equals(Shade.Types.vec4))
                return proj_uniform.mul(model_vertex);
            else
                throw "Type mismatch: expected vec, got " + t.repr();
        }
    };
};
(function() {

})();
Facet.element_buffer = function(vertex_array)
{
    var ctx = Facet._globals.ctx;
    var result = ctx.createBuffer();
    ctx.bindBuffer(ctx.ELEMENT_ARRAY_BUFFER, result);
    var typedArray = new Uint16Array(vertex_array);
    ctx.bufferData(ctx.ELEMENT_ARRAY_BUFFER, typedArray, ctx.STATIC_DRAW);
    result._shade_type = 'element_buffer'; // FIXME: UGLY
    result.array = typedArray;
    result.itemSize = 1;
    result.numItems = vertex_array.length;
    // FIXME: to make the interface uniform with attribute buffer, bind
    // takes an unused argument "attribute". I don't see a way to fix this
    // right now while keeping the drawing interface clean (that is, element buffers
    // and attribute buffers being interchangeable).
    // NB it's no longer clear that we need element_buffers and
    // attribute_buffers to look the same way.

    result.bind = function(attribute) {
        ctx.bindBuffer(ctx.ELEMENT_ARRAY_BUFFER, this);
    };
    result.draw = function(primitive) {
        ctx.drawElements(primitive, this.numItems, ctx.UNSIGNED_SHORT, 0);
    };
    result.bind_and_draw = function(attribute, primitive) {
        this.bind(attribute);
        this.draw(primitive);
    };
    return result;
};
// Call this to get a guaranteed unique range of picking ids.
// Useful to avoid name conflicts between automatic ids and
// user-defined ids.

(function() {

var latest_pick_id = 1;

Facet.fresh_pick_id = function(quantity)
{
    quantity = quantity || 1;
    var result = latest_pick_id;
    latest_pick_id += quantity;
    return result;
};

})();
Facet.id_buffer = function(vertex_array)
{
    if (typeOf(vertex_array) !== 'array')
        throw "id_buffer expects array of integers";
    var typedArray = new Int32Array(vertex_array);
    var byteArray = new Uint8Array(typedArray.buffer);
    return Facet.attribute_buffer(byteArray, 4, 'ubyte', true);
};
Facet.init = function(canvas, opts)
{
    canvas.unselectable = true;
    canvas.onselectstart = function() { return false; };
    var gl;
    var clearColor, clearDepth;
    opts = _.defaults(opts || {}, { clearColor: [1,1,1,0],
                                    clearDepth: 1.0,
                                    attributes: {
                                        alpha: true,
                                        depth: true
                                    }
                                  });
    if (opts.clearColor.expression_type) {
        if (!opts.clearColor.is_constant())
            throw "clearColor must be constant expression";
        if (!opts.clearColor.type.equals(Shade.Types.vec4))
            throw "clearColor must be vec4";
        clearColor = _.toArray(opts.clearColor.constant_value());
    } else
        clearColor = opts.clearColor;

    if (opts.clearDepth.expression_type) {
        if (!opts.clearDepth.is_constant())
            throw "clearDepth must be constant expression";
        if (!opts.clearDepth.type.equals(Shade.Types.float_t))
            throw "clearDepth must be float";
        clearDepth = opts.clearDepth.constant_value();
    } else
        clearDepth = opts.clearDepth;

    Facet._globals.display_callback = (opts.display || function() {});

    if (typeof opts === "undefined")
        opts = {};
    // if (typeof listeners === "undefined")
    //     listeners = {};
    try {
//         gl = WebGLDebugUtils.makeDebugContext(canvas.getContext("experimental-webgl"));
        if ("attributes" in opts)
            gl = WebGLUtils.setupWebGL(canvas, opts.attributes);
        else
            gl = WebGLUtils.setupWebGL(canvas);
        if (!gl)
            throw "Failed context creation";
        if (opts.debugging) {
            function throwOnGLError(err, funcName, args) {
                throw WebGLDebugUtils.glEnumToString(err) + 
                    " was caused by call to " + funcName;
            }
            gl = WebGLDebugUtils.makeDebugContext(gl, throwOnGLError, opts.tracing);
        }
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;
        var names = ["mouseover", "mousemove", "mousedown", 
                     "mouseout", "mouseup"];
        for (var i=0; i<names.length; ++i) {
            var ename = names[i];
            var listener = opts[ename];
            if (typeof listener != "undefined")
                canvas.addEventListener(ename, listener, false);
        }
        var ext;
        var exts = _.map(gl.getSupportedExtensions(), function (x) { 
            return x.toLowerCase();
        });
        if (exts.indexOf("oes_texture_float") == -1) {
            // FIXME design something like progressive enhancement for these cases. HARD!
            alert("OES_texture_float is not available on your browser/computer! " +
                  "Facet will not work, sorry.");
            throw "Insufficient GPU support";
        } else {
            gl.getExtension("oes_texture_float");
        }
    } catch(e) {
        alert(e);
    }
    if (!gl) {
        alert("Could not initialise WebGL, sorry :-(");
        throw "Failed initalization";
    }

    gl.display = function() {
        this.viewport(0, 0, this.viewportWidth, this.viewportHeight);
        this.clearDepth(clearDepth);
        this.clearColor.apply(gl, clearColor);
        this.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        Facet._globals.display_callback();
    };
    Facet.set_context(gl);

    return gl;
};
Facet.load_image_into_texture = function(opts)
{
    opts = _.defaults(opts, {
        onload: function() {},
        x_offset: 0,
        y_offset: 0
    });

    var texture = opts.texture;
    var onload = opts.onload;
    var x_offset = opts.x_offset;
    var y_offset = opts.y_offset;
    var ctx = Facet._globals.ctx;

    function image_handler(image) {
        ctx.bindTexture(ctx.TEXTURE_2D, texture);
        ctx.pixelStorei(ctx.UNPACK_FLIP_Y_WEBGL, true);
        ctx.texSubImage2D(ctx.TEXTURE_2D, 0, x_offset, y_offset,
                          ctx.RGBA, ctx.UNSIGNED_BYTE, image);
        onload(image);
    }

    function buffer_handler()
    {
        ctx.bindTexture(ctx.TEXTURE_2D, texture);
        ctx.pixelStorei(ctx.UNPACK_FLIP_Y_WEBGL, true);
        ctx.texSubImage2D(ctx.TEXTURE_2D, 0, x_offset, y_offset,
                          opts.width, opts.height,
                          ctx.RGBA, ctx.UNSIGNED_BYTE, opts.buffer);
        onload();
    }

    if (opts.src) {
        var image = new Image();
        image.onload = function() {
            image_handler(image);
        };
        // CORS support
        if (opts.crossOrigin)
            image.crossOrigin = opts.crossOrigin;
        image.src = opts.src;
    } else if (opts.img) {
        if (opts.img.isComplete) {
            image_handler(opts.img);
        } else {
            var old_onload = texture.image.onload || function() {};
            opts.img.onload = function() {
                image_handler(opts.img);
                old_onload();
            };
        }
    } else {
        buffer_handler();        
    }
};
Facet.identity = function()
{
    return mat4.identity();
};

Facet.translation = function(v)
{
    function t_3x3(ar) {
        var r = mat3.create();
        r[6] = ar[0];
        r[7] = ar[1];
        return r;
    }
    function t_4x4(ar) {
        return mat4.translation(ar);
    }
    if (v.length === 3) return t_4x4(v);
    else if (arguments.length === 3) return t_4x4(arguments);
    else if (v.length === 2) return t_3x3(v);
    else if (arguments.length === 2) return t_3x3(arguments);

    throw "Invalid vector size for translation";
};

Facet.scaling = function (v)
{
    var ar;
    function s_3x3(ar) {
        var r = mat3.create();
        r[0] = ar[0];
        r[4] = ar[1];
        return r;
    }
    function s_4x4(ar) {
        return mat4.scaling(ar);
    }

    if (v.length === 3) return s_4x4(v);
    else if (arguments.length === 3) return s_4x4(arguments);
    else if (v.length === 2) return s_3x3(v);
    else if (arguments.length === 2) return s_3x3(arguments);

    throw "Invalid size for scale";
};

Facet.rotation = function(angle, axis)
{
    return mat4.rotation(angle, axis);
};

Facet.look_at = function(ex, ey, ez, cx, cy, cz, ux, uy, uz)
{
    return mat4.lookAt([ex, ey, ez], [cx, cy, cz], [ux, uy, uz]);
};

Facet.perspective = mat4.perspective;

Facet.frustum = mat4.frustum;

Facet.ortho = mat4.ortho;

Facet.shear = function(xf, yf)
{
    return mat4.create([1, 0, xf, 0,
                        0, 1, yf, 0,
                        0, 0, 1, 0,
                        0, 0, 0, 1]);
};
// This function is fairly ugly, but I'd rather this function be ugly
// than the code which calls it be ugly.
Facet.model = function(input)
{
    var result = {};
    var n_elements;
    for (var k in input) {
        var v = input[k];
        // First we handle the mandatory keys: "type" and "elements"
        if (k === 'type')
            // example: 'type: "triangles"'
            result.type = v;
        else if (k === 'elements') {
            if (v._shade_type === 'element_buffer')
                // example: 'elements: Facet.element_buffer(...)'
                result.elements = Shade.make(v);
            else if (typeOf(v) === 'array')
                // example: 'elements: [0, 1, 2, 3]'
                result.elements = Shade.make(Facet.element_buffer(v));
            else
                // example: 'elements: 4'
                result.elements = v;
        }
        // Then we handle the model attributes. They can be ...
        else if (v._shade_type === 'attribute_buffer') { // ... attribute buffers,
            // example: 'vertex: Facet.attribute_buffer(...)'
            result[k] = Shade.make(v);
            n_elements = v.numItems;
        } else if (typeOf(v) === "array") { // ... or a list of per-vertex things
            // These things can be shade vecs
            if (typeOf(v[0]) !== "array") {
                // example: 'color: [Shade.color('white'), Shade.color('blue'), ...]
                // assume it's a list of shade vecs, assume they all have the same dimension
                var dimension = v[0].type.vec_dimension();
                var new_v = [];
                _.each(v, function(el) {
                    var v = el.constant_value();
                    for (var i=0; i<dimension; ++i)
                        new_v.push(v[i]);
                });
                var buffer = Facet.attribute_buffer(new_v, dimension);
                result[k] = Shade.make(buffer);
                n_elements = buffer.numItems;
            } else {
                // Or they can be a single list of plain numbers, in which case we're passed 
                // a pair, the first element being the list, the second 
                // being the per-element size
                // example: 'color: [[1,0,0, 0,1,0, 0,0,1], 3]'
                var buffer = Facet.attribute_buffer(v[0], v[1]);
                result[k] = Shade.make(buffer);
                n_elements = buffer.numItems;
            }
        } else {
            // if it's not any of the above things, then it's either a single shade expression
            // or a function which returns one. In any case, we just assign it to the key
            // and leave the user to fend for his poor self.
            result[k] = v;
        }
    }
    if (!("elements" in result)) {
        // populate automatically using some sensible guess inferred from the attributes above
        if (typeOf(n_elements) === "undefined") {
            throw "Facet.model could not figure out how many elements are in this model; "
                + "consider passing an 'elements' field.";
        } else {
            result.elements = n_elements;
        }
    }
    return result;
};
(function() {

var rb;

Facet.Picker = {
    draw_pick_scene: function(callback) {
        var _globals = Facet._globals;
        var ctx = _globals.ctx;
        if (!rb) {
            rb = Facet.render_buffer({
                width: ctx.viewportWidth,
                height: ctx.viewportHeight,
                TEXTURE_MAG_FILTER: ctx.NEAREST,
                TEXTURE_MIN_FILTER: ctx.NEAREST
            });
        }

        callback = callback || _globals.display_callback;
        var old_scene_render_mode = _globals.batch_render_mode;
        _globals.batch_render_mode = 1;
        try {
            rb.render_to_buffer(function() {
                ctx.clearColor(0,0,0,0);
                ctx.clear(ctx.COLOR_BUFFER_BIT | ctx.DEPTH_BUFFER_BIT);
                callback();
            });
        } finally {
            _globals.batch_render_mode = old_scene_render_mode;
        }
    },
    pick: function(x, y) {
        var ctx = Facet._globals.ctx;
        var buf = new ArrayBuffer(4);
        var result_bytes = new Uint8Array(4);
        ctx.readPixels(x, y, 1, 1, ctx.RGBA, ctx.UNSIGNED_BYTE, 
                       result_bytes);
        rb.render_to_buffer(function() {
            ctx.readPixels(x, y, 1, 1, ctx.RGBA, ctx.UNSIGNED_BYTE, 
                           result_bytes);
        });
        var result_words = new Uint32Array(result_bytes.buffer);
        return result_words[0];
    }
};

})();
Facet.profile = function(name, seconds, onstart, onend) {
    if (onstart) onstart();
    console.profile(name);
    setTimeout(function() {
        console.profileEnd();
        if (onend) onend();
    }, seconds * 1000);
};
Facet.program = function(vs_src, fs_src)
{
    var ctx = Facet._globals.ctx;
    function getShader(shader_type, str)
    {
        var shader = ctx.createShader(shader_type);
        ctx.shaderSource(shader, str);
        ctx.compileShader(shader);
        if (!ctx.getShaderParameter(shader, ctx.COMPILE_STATUS)) {
            alert(ctx.getShaderInfoLog(shader));
            return null;
        }
        return shader;
    }

    var vertex_shader = getShader(ctx.VERTEX_SHADER, vs_src), 
        fragment_shader = getShader(ctx.FRAGMENT_SHADER, fs_src);

    var shaderProgram = ctx.createProgram();
    ctx.attachShader(shaderProgram, vertex_shader);
    ctx.attachShader(shaderProgram, fragment_shader);
    ctx.linkProgram(shaderProgram);
    
    if (!ctx.getProgramParameter(shaderProgram, ctx.LINK_STATUS)) {
        alert("Could not initialise shaders");
        return null;
    }

    var active_uniforms = ctx.getProgramParameter(shaderProgram, ctx.ACTIVE_UNIFORMS);
    var array_name_regexp = /.*\[0\]/;
    for (var i=0; i<active_uniforms; ++i) {
        var info = ctx.getActiveUniform(shaderProgram, i);
        if (array_name_regexp.test(info.name)) {
            var array_name = info.name.substr(0, info.name.length-3);
            shaderProgram[array_name] = ctx.getUniformLocation(shaderProgram, array_name);
        } else {
            shaderProgram[info.name] = ctx.getUniformLocation(shaderProgram, info.name);
        }
    }
    var active_attributes = ctx.getProgramParameter(shaderProgram, ctx.ACTIVE_ATTRIBUTES);
    for (i=0; i<active_attributes; ++i) {
        var info = ctx.getActiveAttrib(shaderProgram, i);
        shaderProgram[info.name] = ctx.getAttribLocation(shaderProgram, info.name);
    }
    return shaderProgram;    
};
Facet.render_buffer = function(opts)
{
    var ctx = Facet._globals.ctx;
    var rttFramebuffer = ctx.createFramebuffer();
    ctx.bindFramebuffer(ctx.FRAMEBUFFER, rttFramebuffer);
    opts = _.defaults(opts || {}, {
        width: 512,
        height: 512
    });
    rttFramebuffer.width  =  opts.width;
    rttFramebuffer.height = opts.height;

    var rttTexture = Facet.texture(opts);

    // var rttTexture = ctx.createTexture();
    // rttTexture._shade_type = 'texture';
    // ctx.bindTexture(ctx.TEXTURE_2D, rttTexture);
    // ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MAG_FILTER, opts.TEXTURE_MAG_FILTER || ctx.LINEAR);
    // ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MIN_FILTER, opts.TEXTURE_MIN_FILTER || ctx.LINEAR);
    // ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_S, opts.TEXTURE_WRAP_S || ctx.CLAMP_TO_EDGE);
    // ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_T, opts.TEXTURE_WRAP_T || ctx.CLAMP_TO_EDGE);
    // ctx.texImage2D(ctx.TEXTURE_2D, 0, ctx.RGBA, rttFramebuffer.width, rttFramebuffer.height, 0, ctx.RGBA, ctx.UNSIGNED_BYTE, null);

    var renderbuffer = ctx.createRenderbuffer();
    ctx.bindRenderbuffer(ctx.RENDERBUFFER, renderbuffer);
    ctx.renderbufferStorage(ctx.RENDERBUFFER, ctx.DEPTH_COMPONENT16, rttFramebuffer.width, rttFramebuffer.height);

    ctx.framebufferTexture2D(ctx.FRAMEBUFFER, ctx.COLOR_ATTACHMENT0, ctx.TEXTURE_2D, rttTexture, 0);
    ctx.framebufferRenderbuffer(ctx.FRAMEBUFFER, ctx.DEPTH_ATTACHMENT, ctx.RENDERBUFFER, renderbuffer);

    var status = ctx.checkFramebufferStatus(ctx.FRAMEBUFFER);
    switch (status) {
        case ctx.FRAMEBUFFER_COMPLETE:
            break;
        case ctx.FRAMEBUFFER_INCOMPLETE_ATTACHMENT:
            throw("Incomplete framebuffer: FRAMEBUFFER_INCOMPLETE_ATTACHMENT");
            break;
        case ctx.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT:
            throw("Incomplete framebuffer: FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT");
            break;
        case ctx.FRAMEBUFFER_INCOMPLETE_DIMENSIONS:
            throw("Incomplete framebuffer: FRAMEBUFFER_INCOMPLETE_DIMENSIONS");
            break;
        case ctx.FRAMEBUFFER_UNSUPPORTED:
            throw("Incomplete framebuffer: FRAMEBUFFER_UNSUPPORTED");
            break;
        default:
            throw("Incomplete framebuffer: " + status);
    }

    ctx.bindTexture(ctx.TEXTURE_2D, null);
    ctx.bindRenderbuffer(ctx.RENDERBUFFER, null);
    ctx.bindFramebuffer(ctx.FRAMEBUFFER, null);

    return {
        _shade_type: 'render_buffer',
        texture: rttTexture,
        width: rttFramebuffer.width,
        height: rttFramebuffer.height,
        frame_buffer: rttFramebuffer,
        render_to_buffer: function (render) {
            try {
                ctx.bindFramebuffer(ctx.FRAMEBUFFER, rttFramebuffer);
                ctx.viewport(0, 0, rttFramebuffer.width, rttFramebuffer.height);
                render();
            } finally {
                ctx.bindFramebuffer(ctx.FRAMEBUFFER, null);
            }
        },
        make_screen_batch: function (with_texel_at_uv) {
            var sq = Facet.Models.square();
            return Facet.bake(sq, {
                position: Shade.vec(sq.vertex.mul(2).sub(Shade.vec(1, 1)), 0, 1),
                color: with_texel_at_uv(Shade.texture2D(rttTexture, sq.tex_coord), sq.tex_coord)
            });
        }
    };
};
Facet.set_context = function(the_ctx)
{
    Facet._globals.ctx = the_ctx;
    // Shade.set_context(the_ctx);
};
//////////////////////////////////////////////////////////////////////////////
// load texture from DOM element or URL. 
// BEWARE SAME-DOMAIN POLICY!

Facet.texture = function(opts)
{
    var ctx = Facet._globals.ctx;
    opts = _.defaults(opts, {
        onload: function() {},
        mipmaps: false,
        mag_filter: ctx.LINEAR,
        min_filter: ctx.LINEAR,
        wrap_s: ctx.CLAMP_TO_EDGE,
        wrap_t: ctx.CLAMP_TO_EDGE,
        format: ctx.RGBA,
        type: ctx.UNSIGNED_BYTE
    });

    function handler(texture) {
        ctx.bindTexture(ctx.TEXTURE_2D, texture);
        ctx.pixelStorei(ctx.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
        if (texture.image) {
            ctx.pixelStorei(ctx.UNPACK_FLIP_Y_WEBGL, true);
            ctx.pixelStorei(ctx.UNPACK_COLORSPACE_CONVERSION_WEBGL, 
                            ctx.BROWSER_DEFAULT_WEBGL);
            ctx.texImage2D(ctx.TEXTURE_2D, 0, opts.format, opts.format,
                           opts.type, texture.image);
        } else {
            ctx.pixelStorei(ctx.UNPACK_FLIP_Y_WEBGL, false);
            ctx.pixelStorei(ctx.UNPACK_COLORSPACE_CONVERSION_WEBGL, ctx.NONE);
            ctx.texImage2D(ctx.TEXTURE_2D, 0, opts.format,
                           texture.width, texture.height,
                           0, opts.format, opts.type, texture.buffer);
        }
        ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MAG_FILTER, opts.mag_filter);
        ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MIN_FILTER, opts.min_filter);
        ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_S, opts.wrap_s);
        ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_T, opts.wrap_t);
        if (opts.mipmaps)
            ctx.generateMipmap(ctx.TEXTURE_2D);
        ctx.bindTexture(ctx.TEXTURE_2D, null);
        opts.onload(texture);
        // to ensure that all textures are bound correctly,
        // we unload the current batch, forcing all uniforms to be re-evaluated.
        Facet.unload_batch();
    }

    var texture = ctx.createTexture();
    texture._shade_type = 'texture';
    texture.width = opts.width;
    texture.height = opts.height;
    if (opts.src) {
        var image = new Image();
        image.onload = function() {
            texture.width = image.width;
            texture.height = image.height;
            handler(texture);
        };
        texture.image = image;
        if (opts.crossOrigin)
            image.crossOrigin = opts.crossOrigin; // CORS support
        image.src = opts.src;
    } else if (opts.img) {
        texture.image = opts.img;
        if (texture.image.isComplete) {
            texture.width = texture.image.width;
            texture.height = texture.image.height;
            handler(texture);
        } else {
            texture.image.onload = function() {
                texture.width = texture.image.width;
                texture.height = texture.image.height;
                handler(texture);
            };
        }
    } else {
        texture.buffer = opts.buffer || null;
        handler(texture);        
    }
    return texture;
};
(function() {

var rb;
var depth_value;
var clear_batch;
    
Facet.Unprojector = {
    draw_unproject_scene: function(callback) {
        var _globals = Facet._globals;
        var ctx = _globals.ctx;
        if (!rb) {
            rb = Facet.render_buffer({
                width: ctx.viewportWidth,
                height: ctx.viewportHeight,
                TEXTURE_MAG_FILTER: ctx.NEAREST,
                TEXTURE_MIN_FILTER: ctx.NEAREST
            });
        }
        // In addition to clearing the depth buffer, we need to fill
        // the color buffer with
        // the right depth value. We do it via the batch below.

        if (!clear_batch) {
            var xy = Shade.make(Facet.attribute_buffer(
                [-1, -1,   1, -1,   -1,  1,   1,  1], 2));
            var model = Facet.model({
                type: "triangle_strip",
                elements: 4,
                vertex: xy
            });
            depth_value = Shade.uniform("float");
            console.log("xy type", xy.type.repr());
            clear_batch = Facet.bake(model, {
                position: Shade.vec(xy, depth_value, 1.0),
                color: Shade.vec(1,1,1,1)
            });
        }

        callback = callback || _globals.display_callback;
        var old_scene_render_mode = _globals.batch_render_mode;
        _globals.batch_render_mode = 2;
        rb.render_to_buffer(function() {
            var old_clear_color = ctx.getParameter(ctx.COLOR_CLEAR_VALUE);
            var old_clear_depth = ctx.getParameter(ctx.DEPTH_CLEAR_VALUE);
            ctx.clearColor(old_clear_depth,
                           old_clear_depth / (1 << 8),
                           old_clear_depth / (1 << 16),
                           old_clear_depth / (1 << 24));
            ctx.clear(ctx.DEPTH_BUFFER_BIT | ctx.COLOR_BUFFER_BIT);
            try {
                callback();
            } finally {
                console.log(old_clear_color);
                ctx.clearColor(old_clear_color[0],
                               old_clear_color[1],
                               old_clear_color[2],
                               old_clear_color[3]);
                _globals.batch_render_mode = old_scene_render_mode;
            }
        });
    },

    unproject: function(x, y) {
        var ctx = Facet._globals.ctx;
        var buf = new ArrayBuffer(4);
        var result_bytes = new Uint8Array(4);
        ctx.readPixels(x, y, 1, 1, ctx.RGBA, ctx.UNSIGNED_BYTE, 
                       result_bytes);
        rb.render_to_buffer(function() {
            ctx.readPixels(x, y, 1, 1, ctx.RGBA, ctx.UNSIGNED_BYTE, 
                           result_bytes);
        });
        console.log(result_bytes[0], 
                    result_bytes[1],
                    result_bytes[2], 
                    result_bytes[3]);
        return result_bytes[0] / 256 + 
            result_bytes[1] / (1 << 16) + 
            result_bytes[2] / (1 << 24);
        // +  result_bytes[3] / (1 << 32);
    }
};

})();
Facet.Net = {};
// based on http://calumnymmo.wordpress.com/2010/12/22/so-i-decided-to-wait/
Facet.Net.buffer_ajax = function(url, handler)
{
    var xhr = new window.XMLHttpRequest();
    var ready = false;
    xhr.onreadystatechange = function() {
	if (xhr.readyState == 4 && xhr.status == 200
	    && ready!=true) {
	    if (xhr.responseType=="arraybuffer") {
                handler(xhr.response, url);
            } else if (xhr.mozResponseArrayBuffer != null) {
                handler(xhr.mozResponseArrayBuffer, url);
            } else if (xhr.responseText != null) {
	        var data = new String(xhr.responseText);
	        var ary = new Array(data.length);
	        for (var i = 0; i <data.length; i++) {
                    ary[i] = data.charCodeAt(i) & 0xff;
                }
	        var uint8ay = new Uint8Array(ary);
                handler(uint8ay.buffer, url);
	    }
            ready = true;
        }
    };
    xhr.open("GET", url, true);
    if(xhr.hasOwnProperty("responseType")) {
        xhr.responseType="arraybuffer";
    } else {
        xhr.overrideMimeType('text/plain; charset=x-user-defined');
    }
    xhr.send();
};
Facet.Scale = {};
Facet.Scale.Geo = {};
Facet.Scale.Geo.mercator_to_spherical = function(x, y)
{
    var lat = y.sinh().atan();
    var lon = x;
    return Facet.Scale.Geo.latlong_to_spherical(lat, lon);
};
Facet.Scale.Geo.latlong_to_spherical = function(lat, lon)
{
    lat = Shade.make(lat);
    lon = Shade.make(lon);
    var stretch = lat.cos();
    return Shade.vec(lon.sin().mul(stretch),
                     lat.sin(),
                     lon.cos().mul(stretch), 1);
};
// drawing mode objects can be part of the parameters passed to 
// Facet.bake, in order for the batch to automatically set the capabilities.
// This lets us specify blending, depth-testing, etc. at bake time.

/* FIXME This is double dispatch done wrong. See facet.org for details.
 */

Facet.DrawingMode = {};
Facet.DrawingMode.additive = {
    set_draw_caps: function()
    {
        var ctx = Facet._globals.ctx;
        ctx.enable(ctx.BLEND);
        ctx.blendFunc(ctx.SRC_ALPHA, ctx.ONE);
        ctx.enable(ctx.DEPTH_TEST);
        ctx.depthFunc(ctx.LESS);
        ctx.depthMask(false);
    },
    set_pick_caps: function()
    {
        var ctx = Facet._globals.ctx;
        ctx.enable(ctx.DEPTH_TEST);
        ctx.depthFunc(ctx.LESS);
        ctx.depthMask(false);
    },
    set_unproject_caps: function()
    {
        var ctx = Facet._globals.ctx;
        ctx.enable(ctx.DEPTH_TEST);
        ctx.depthFunc(ctx.LESS);
        ctx.depthMask(false);
    }
};
// over is the standard porter-duff over operator

// NB: since over is associative but not commutative, we need
// back-to-front rendering for correct results,
// and then the depth buffer is not necessary. 
// 
// In the case of incorrect behavior (that is, when contents are not
// rendered back-to-front), it is not clear which of the two incorrect 
// behaviors are preferable:
// 
// 1. that depth buffer writing be enabled, and some things which should
// be rendered "behind" alpha-blended simply disappear (this gets
// worse the more transparent objects get)
//
// 2. that depth buffer writing be disabled, and some things which would be
// entirely occluded by others simply appear (this gets worse the more opaque
// objects get)
//
// These two behaviors correspond respectively to 
// Facet.DrawingMode.over_with_depth and Facet.DrawingMode.over

Facet.DrawingMode.over = {
    set_draw_caps: function()
    {
        var ctx = Facet._globals.ctx;
        ctx.enable(ctx.BLEND);
        ctx.blendFuncSeparate(ctx.SRC_ALPHA, ctx.ONE_MINUS_SRC_ALPHA, 
                              ctx.ONE, ctx.ONE_MINUS_SRC_ALPHA);
        ctx.enable(ctx.DEPTH_TEST);
        ctx.depthFunc(ctx.LESS);
        ctx.depthMask(false);
    },
    set_pick_caps: function()
    {
        var ctx = Facet._globals.ctx;
        ctx.enable(ctx.DEPTH_TEST);
        ctx.depthFunc(ctx.LESS);
        ctx.depthMask(false);
    },
    set_unproject_caps: function()
    {
        var ctx = Facet._globals.ctx;
        ctx.enable(ctx.DEPTH_TEST);
        ctx.depthFunc(ctx.LESS);
        ctx.depthMask(false);
    }
};

Facet.DrawingMode.over_with_depth = {
    set_draw_caps: function()
    {
        var ctx = Facet._globals.ctx;
        ctx.enable(ctx.BLEND);
        ctx.blendFuncSeparate(ctx.SRC_ALPHA, ctx.ONE_MINUS_SRC_ALPHA, 
                              ctx.ONE, ctx.ONE_MINUS_SRC_ALPHA);
        ctx.enable(ctx.DEPTH_TEST);
        ctx.depthFunc(ctx.LESS);
    },
    set_pick_caps: function()
    {
        var ctx = Facet._globals.ctx;
        ctx.enable(ctx.DEPTH_TEST);
        ctx.depthFunc(ctx.LESS);
    },
    set_unproject_caps: function()
    {
        var ctx = Facet._globals.ctx;
        ctx.enable(ctx.DEPTH_TEST);
        ctx.depthFunc(ctx.LESS);
    }
};
Facet.DrawingMode.standard = {
    set_draw_caps: function()
    {
        var ctx = Facet._globals.ctx;
        ctx.enable(ctx.DEPTH_TEST);
        ctx.depthFunc(ctx.LESS);
    },
    set_pick_caps: function()
    { 
        var ctx = Facet._globals.ctx;
        ctx.enable(ctx.DEPTH_TEST);
        ctx.depthFunc(ctx.LESS);
   },
    set_unproject_caps: function()
    {
        var ctx = Facet._globals.ctx;
        ctx.enable(ctx.DEPTH_TEST);
        ctx.depthFunc(ctx.LESS);
    }
};
/*
 * Shade is the javascript DSL for writing GLSL shaders, part of Facet.
 * 
 */

// FIXME: fix the constant-index-expression hack I've been using to get around
// restrictions. This will eventually be plugged by webgl implementors.

// FIXME: Move this object inside Facet's main object.

var Shade = {};

(function() {

Shade.debug = false;
/*
 A range expression represents a finite stream of values.

 It is meant to be an abstraction over looping.

 a range object should have the following fields:
 
 - begin, the first value of the stream, which must be of type int.
 
 - end, the first value past the end of the stream, which also must be of type int.
 
 - value, a function which takes an Shade expression of type integer
   and returns the value of the stream at that particular index.
   **This function must not have side effects!** Most importantly, it
   must not leak the reference to the passed parameter. Bad things
   will happen if it does.

 With range expressions, we can build safe equivalents of loops
*/

Shade.variable = function(type)
{
    return Shade._create_concrete_exp( {
        parents: [],
        type: type,
        eval: function() {
            return this.glsl_name;
        },
        compile: function() {}
    });
};

Shade.range = function(range_begin, range_end)
{
    var beg = Shade.make(range_begin).as_int(),
        end = Shade.make(range_end).as_int();
    console.log(beg, beg.type.repr());
    console.log(end, end.type.repr());
    return {
        begin: beg,
        end: end,
        value: function(index) {
            return index;
        },

        // this returns a shade expression which, when evaluated, returns
        // the average of the values in the range.
        average: function() {
            var index_variable = Shade.variable(Shade.Types.int_t);
            var stream_value = this.value(index_variable);
            var stream_type = stream_value.type;
            var average_type;
            var accumulator_value = Shade.variable(stream_type);
            if (stream_value.type.equals(Shade.Types.int_t)) {
                average_type = Shade.Types.float_t;
            } else if (_.any([Shade.Types.float_t,
                              Shade.Types.vec2, Shade.Types.vec3, Shade.Types.vec4, 
                              Shade.Types.mat2, Shade.Types.mat3, Shade.Types.mat4],
                             function(t) { return t.equals(stream_type); })) {
                average_type = stream_type;
            } else
                throw ("Type error, average can't support range of type " +
                       stream_type.repr());

            return Shade._create_concrete_exp({
                parents: [this.begin, this.end, 
                          index_variable, accumulator_value, stream_value],
                type: average_type,
                eval: function() {
                    return this.glsl_name + "()";
                },
                element: Shade.memoize_on_field("_element", function(i) {
                    if (this.type.is_pod()) {
                        if (i === 0)
                            return this;
                        else
                            throw this.type.repr() + " is an atomic type";
                    } else
                        return this.at(i);
                }),
                compile: function(ctx) {
                    var beg = this.parents[0];
                    var end = this.parents[1];
                    var index_variable = this.parents[2];
                    var accumulator_value = this.parents[3];
                    var stream_value = this.parents[4];
                    ctx.strings.push(this.type.repr(), this.glsl_name, "() {\n");
                    ctx.strings.push("    ", accumulator_value.type.declare(accumulator_value.glsl_name), "=", 
                      accumulator_value.type.zero, ";\n");
                    ctx.strings.push("    for (int",
                      index_variable.eval(),"=",beg.eval(),";",
                      index_variable.eval(),"<",end.eval(),";",
                      "++",index_variable.eval(),") {\n");
                    ctx.strings.push("        ",
                      accumulator_value.eval(),"=",
                      accumulator_value.eval(),"+",
                      stream_value.eval(),";\n");
                    ctx.strings.push("    }\n");
                    ctx.strings.push("    return", 
                                     this.type.repr(), "(", accumulator_value.eval(), ")/float(",
                      end.eval(), "-", beg.eval(), ");\n");
                    ctx.strings.push("}\n");
                }
            });
        }
    };
};
Shade.unique_name = function() {
    var counter = 0;
    return function() {
        counter = counter + 1;
        return "_unique_name_" + counter;
    };
}();
//////////////////////////////////////////////////////////////////////////////
// roll-your-own prototypal inheritance

Shade._create = (function() {
    var guid = 0;
    return function(base_type, new_obj)
    {
        function F() {
            for (var key in new_obj) {
                this[key] = new_obj[key];
            }
            this.guid = "GUID_" + guid;

            // this is where memoize_on_field stashes results. putting
            // them all in a single member variable makes it easy to
            // create a clean prototype
            this._caches = {};

            guid += 1;
        }
        F.prototype = base_type;
        return new F();
    };
})();

Shade._create_concrete = function(base, requirements)
{
    function create_it(new_obj) {
        for (var i=0; i<requirements.length; ++i) {
            var field = requirements[i];
            if (!(field in new_obj)) {
                throw "New expression missing " + requirements[i];
            }
            if (typeOf(new_obj[field]) === 'undefined') {
                throw "field '" + field + "' cannot be undefined.";
            }
        }
        return Shade._create(base, new_obj);
    }
    return create_it;
}

// only memoizes on value of first argument, so will fail if function
// takes more than one argument!!
Shade.memoize_on_field = function(field_name, fun)
{
    return function() {
        if (typeOf(this._caches[field_name]) === "undefined") {
            this._caches[field_name] = {};
        }
        if (typeOf(this._caches[field_name][arguments[0]]) === "undefined") {
            this._caches[field_name][arguments[0]] = fun.apply(this, arguments);
        }
        return this._caches[field_name][arguments[0]];
    };
}

function zipWith(f, l1, l2)
{
    var result = [];
    var l = Math.min(l1.length, l2.length);
    for (var i=0; i<l; ++i) {
        result.push(f(l1[i], l2[i]));
    }
    return result;
}

function zipWith3(f, l1, l2, l3)
{
    var result = [];
    var l = Math.min(l1.length, l2.length, l3.length);
    for (var i=0; i<l; ++i) {
        result.push(f(l1[i], l2[i], l3[i]));
    }
    return result;
}
Shade.Types = {};
Shade.Types.base_t = {
    is_floating: function() { return false; },
    is_integral: function() { return false; },
    is_array: function()    { return false; },
    // POD = plain old data (ints, bools, floats)
    is_pod: function()      { return false; },
    is_vec: function()      { return false; },
    vec_dimension: function() { 
        throw "is_vec() === false, cannot call vec_dimension";
    },
    is_function: function() { return false; },
    is_sampler:  function() { return false; },
    equals: function(other) {
        if (typeOf(other) === 'undefined')
            throw "Type.equals can't be compared to undefined";
        return this.repr() == other.repr();
    },
    swizzle: function(pattern) {
        throw "type '" + this.repr() + "' does not support swizzling.";
    },
    element_type: function(i) {
        throw "invalid call: atomic expression";
    },
    declare: function(glsl_name) {
        return this.repr() + " " + glsl_name;
    }
    // repr
    // array_base
    // array_size
    // function_return_type
    // function_parameter
    // function_parameter_count
};
Shade.basic = function(repr) { 
    function is_valid_basic_type(repr) {
        if (repr === 'float') return true;
        if (repr === 'int') return true;
        if (repr === 'bool') return true;
        if (repr === 'void') return true;
        if (repr === 'sampler2D') return true;
        if (repr.substring(0, 3) === 'mat' &&
            (Number(repr[3]) > 1 && 
             Number(repr[3]) < 5)) return true;
        if (repr.substring(0, 3) === 'vec' &&
            (Number(repr[3]) > 1 && 
             Number(repr[3]) < 5)) return true;
        if (repr.substring(0, 4) === 'bvec' &&
            (Number(repr[4]) > 1 && 
             Number(repr[4]) < 5)) return true;
        if (repr.substring(0, 4) === 'ivec' &&
            (Number(repr[4]) > 1 && 
             Number(repr[4]) < 5)) return true;
        // if (repr === '__auto__') return true;
        return false;
    };

    if (!is_valid_basic_type(repr)) {
        throw "invalid basic type '" + repr + "'.";
    };
    
    return Shade._create(Shade.Types.base_t, {
        declare: function(glsl_name) { return repr + " " + glsl_name; },
        repr: function() { return repr; },
        swizzle: function(pattern) {
            // FIXME swizzle is for vecs only, not arrays in general.
            if (!(this.is_array())) {
                throw "Swizzle pattern requires array type";
            }
            var base_repr = this.repr();
            var base_size = Number(base_repr[base_repr.length-1]);

            var valid_re, group_res;
            switch (base_size) {
            case 2:
                valid_re = /[rgxyst]+/;
                group_res = [ /[rg]/, /[xy]/, /[st]/ ];
                break;
            case 3:
                valid_re = /[rgbxyzstp]+/;
                group_res = [ /[rgb]/, /[xyz]/, /[stp]/ ];
                break;
            case 4:
                valid_re = /[rgbazxyzwstpq]+/;
                group_res = [ /[rgba]/, /[xyzw]/, /[stpq]/ ];
                break;
            default:
                throw "Internal error?!";
            };
            if (!pattern.match(valid_re)) {
                throw "Invalid swizzle pattern '" + pattern + "'.";
            }
            var count = 0;
            for (var i=0; i<group_res.length; ++i) {
                if (pattern.match(group_res[i])) count += 1;
            }
            if (count != 1) {
                throw ("Swizzle pattern '" + pattern + 
                       "' belongs to more than one group.");
            }
            if (pattern.length === 1) {
                return this.array_base();
            } else
                return Shade.basic(base_repr.substring(0, base_repr.length-1) +
                                 pattern.length);
        },
        is_pod: function() {
            var repr = this.repr();
            return ["float", "bool", "int"].indexOf(repr) !== -1;
        },
        is_vec: function() {
            var repr = this.repr();
            if (repr.substring(0, 3) === "vec")
                return true;
            if (repr.substring(0, 4) === "ivec")
                return true;
            if (repr.substring(0, 4) === "bvec")
                return true;
            return false;
        },
        is_mat: function() {
            var repr = this.repr();
            if (repr.substring(0, 3) === "mat")
                return true;
            return false;
        },
        vec_dimension: function() {
            var repr = this.repr();
            if (repr.substring(0, 3) === "vec")
                return parseInt(repr[3]);
            if (repr.substring(0, 4) === "ivec" ||
                repr.substring(0, 4) === "bvec")
                return parseInt(repr[4]);
            if (this.repr() === 'float'
                || this.repr() === 'int'
                || this.repr() === 'bool')
                return 1; // FIXME convenient, probably wrong
            if (!this.is_vec()) {
                throw "is_vec() === false, cannot call vec_dimension";
            }
            throw "internal error";
        },
        is_array: function() {
            var repr = this.repr();
            if (repr.substring(0, 3) === "mat")
                return true;
            if (this.is_vec())
                return true;
            return false;
        },
        array_base: function() {
            var repr = this.repr();
            if (repr.substring(0, 3) === "mat")
                return Shade.basic("vec" + repr[3]);
            if (repr.substring(0, 3) === "vec")
                return Shade.basic("float");
            if (repr.substring(0, 4) === "bvec")
                return Shade.basic("bool");
            if (repr.substring(0, 4) === "ivec")
                return Shade.basic("int");
            if (repr == "float")
                return Shade.basic("float");
            throw "datatype not array!";
        },
        size_for_vec_constructor: function() {
            var repr = this.repr();
            if (this.is_array())
                return this.array_size();
            if (repr === 'float' ||
                repr === 'bool' ||
                repr === 'int')
                return 1;
            throw "not usable inside vec constructor";
        },
        array_size: function() {
            if (this.is_vec())
                return this.vec_dimension();
            var repr = this.repr();
            if (repr.substring(0, 3) === "mat")  
                return parseInt(repr[3]);
            throw "datatype not array!";
        },
        is_floating: function() {
            var repr = this.repr();
            if (repr === "float")
                return true;
            if (repr.substring(0, 3) === "vec")
                return true;
            if (repr.substring(0, 3) === "mat")
                return true;
            return false;
        },
        is_integral: function() {
            var repr = this.repr();
            if (repr === "int")
                return true;
            if (repr.substring(0, 4) === "ivec")
                return true;
            return false;
        },
        is_sampler: function() {
            var repr = this.repr();
            if (repr === 'sampler2D')
                return true;
            return false;
        },
        element_type: function(i) {
            if (this.is_pod()) {
                if (i === 0)
                    return this;
                else
                    throw "invalid call: " + this.repr() + " is atomic";
            } else if (this.is_vec()) {
                var f = this.repr()[0];
                var d = this.array_size();
                if (i < 0 || i >= d) {
                    throw "invalid call: " + this.repr() + 
                        " has no element " + i;
                }
                if (f === 'v')
                    return Shade.Types.float_t;
                else if (f === 'b')
                    return Shade.Types.bool_t;
                else if (f === 'i')
                    return Shade.Types.int_t;
                else
                    throw "Internal error";
            } else
                // FIXME implement this
                throw "Unimplemented for mats";
        }
    });
};
Shade.array = function(base_type, size) {
    return Shade._create(Shade.Types.base_t, {
        is_array: function() { return true; },
        declare: function(glsl_name) {
            return base_type.declare(glsl_name) + "[" + size + "]";
        },
        repr: function() {
            return base_type.repr() + "[" + size + "]";
        },
        array_size: function() {
            return size;
        },
        array_base: function() {
            return base_type;
        }
    });
};
Shade.Types.function_t = function(return_type, param_types) {
    return Shade._create(Shade.Types.base_t, {
        repr: function() {
            return "(" + return_type.repr() + ")("
                + ", ".join(param_types.map(function (o) { 
                    return o.repr(); 
                }));
        },
        is_function: function() {
            return true;
        },
        function_return_type: function() {
            return return_type;
        },
        function_parameter: function(i) {
            return param_types[i];
        },
        function_parameter_count: function() {
            return param_types.length;
        }
    });
};
(function() {

    var simple_types = 
        ["mat2", "mat3", "mat4",
         "vec2", "vec3", "vec4",
         "ivec2", "ivec3", "ivec4",
         "bvec2", "bvec3", "bvec4"];

    for (var i=0; i<simple_types.length; ++i) {
        Shade.Types[simple_types[i]] = Shade.basic(simple_types[i]);
    }

    Shade.Types.float_t   = Shade.basic('float');
    Shade.Types.bool_t    = Shade.basic('bool');
    Shade.Types.int_t     = Shade.basic('int');
    Shade.Types.sampler2D = Shade.basic('sampler2D');

    Shade.Types.int_t.zero   = "0";
    Shade.Types.float_t.zero = "0.0";
    Shade.Types.vec2.zero    = "vec2(0,0)";
    Shade.Types.vec3.zero    = "vec3(0,0,0)";
    Shade.Types.vec4.zero    = "vec4(0,0,0,0)";
    Shade.Types.mat2.zero    = "mat2(0,0,0,0)";
    Shade.Types.mat3.zero    = "mat3(0,0,0,0,0,0,0,0,0)";
    Shade.Types.mat4.zero    = "mat4(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0)";
})();
//////////////////////////////////////////////////////////////////////////////
// make converts objects which can be meaningfully interpreted as
// Exp values to the appropriate Exp values, giving us some poor-man
// static polymorphism
Shade.make = function(exp)
{
    var t = typeOf(exp);
    if (t === 'undefined') {
        throw "Shade.make does not support undefined";
    }
    if (t === 'boolean' || t === 'number') {
        return Shade.constant(exp);
    } else if (t === 'array') {
        return Shade.seq(exp);
    }
    t = constant_type(exp);
    if (t === 'vector' || t === 'matrix') {
        return Shade.constant(exp);
    } else if (exp._shade_type === 'attribute_buffer') {
        return Shade.attribute_from_buffer(exp);
    } else if (exp._shade_type === 'render_buffer') {
        return Shade.sampler2D_from_texture(exp.texture);
    } else if (exp._shade_type === 'texture') {
        return Shade.sampler2D_from_texture(exp);
    }
    return exp;
};

Shade.VERTEX_PROGRAM_COMPILE = 1;
Shade.FRAGMENT_PROGRAM_COMPILE = 2;
Shade.UNSET_PROGRAM_COMPILE = 3;

Shade.CompilationContext = function(compile_type) {
    return {
        freshest_glsl_name: 0,
        compile_type: compile_type || Shade.UNSET_PROGRAM_COMPILE,
        float_precision: "highp",
        strings: [],
        initialization_exprs: [],
        declarations: { uniform: {},
                        attribute: {},
                        varying: {}
                      },
        // min_version: -1,
        source: function() {
            return this.strings.join(" ");
        },
        request_fresh_glsl_name: function() {
            var int_name = this.freshest_glsl_name++;
            return "glsl_name_" + int_name;
        },
        // require_version: function(version) {
        //     this.min_version = Math.max(this.min_version, version);
        // },
        declare: function(decltype, glsl_name, type, declmap) {
            if (typeof type === 'undefined') {
                throw "must define type";                
            }
            if (!(glsl_name in declmap)) {
                declmap[glsl_name] = type;
                this.strings.push(decltype + " " + type.declare(glsl_name) + ";\n");
            } else {
                var existing_type = declmap[glsl_name];
                if (!existing_type.equals(type)) {
                    throw ("Compile error: Different expressions use "
                           + "conflicting types for '" + decltype + " " + glsl_name
                           + "': '" + existing_type.repr() + "', '"
                           + type.repr() + "'.");
                }
            }
        },
        declare_uniform: function(glsl_name, type) {
            this.declare("uniform", glsl_name, type, this.declarations.uniform);
        },
        declare_varying: function(glsl_name, type) {
            this.declare("varying", glsl_name, type, this.declarations.varying);
        },
        declare_attribute: function(glsl_name, type) {
            this.declare("attribute", glsl_name, type, this.declarations.attribute);
        },
        compile: function(fun) {
            var topo_sort = fun.sorted_sub_expressions();
            var i;
            var that = this;
            _.each(topo_sort, function(n) {
                n.children_count = 0;
                n.is_unconditional = false;
                n.glsl_name = that.request_fresh_glsl_name();
                n.set_requirements(this);
                for (var j=0; j<n.parents.length; ++j)
                    n.parents[j].children_count++;
            });

            // top-level node is always unconditional.
            topo_sort[topo_sort.length-1].is_unconditional = true;
            i = topo_sort.length;
            while (i--) {
                var n = topo_sort[i];
                n.propagate_conditions();
            }

            this.strings.push("precision",this.float_precision,"float;\n");
            for (i=0; i<topo_sort.length; ++i) {
                topo_sort[i].compile(this);
            }
            this.strings.push("void main() {\n");
            for (i=0; i<this.initialization_exprs.length; ++i)
                this.strings.push("    ", this.initialization_exprs[i], ";\n");
            this.strings.push("    ", fun.eval(), ";\n", "}\n");
        },
        add_initialization: function(expr) {
            this.initialization_exprs.push(expr);
        },
        value_function: function() {
            this.strings.push(arguments[0].type.repr(),
                              arguments[0].glsl_name,
                              "(void) {\n",
                              "    return ");
            for (var i=1; i<arguments.length; ++i) {
                this.strings.push(arguments[i]);
            }
            this.strings.push(";\n}\n");
        },
        void_function: function() {
            this.strings.push("void",
                              arguments[0].glsl_name,
                              "(void) {\n",
                              "    ");
            for (var i=1; i<arguments.length; ++i) {
                this.strings.push(arguments[i]);
            }
            this.strings.push(";\n}\n");
        }
    };
};
Shade.Exp = {
    debug_print: function(indent) {
        if (indent === undefined) indent = 0;
        var str = "";
        for (var i=0; i<indent; ++i) { str = str + ' '; }
        if (this.parents.length === 0) 
            console.log(str + "[" + this.expression_type + ":" + this.guid + "]"
                        // + "[is_constant: " + this.is_constant() + "]"
                        + "()");
        else {
            console.log(str + "[" + this.expression_type + ":" + this.guid + "]"
                        // + "[is_constant: " + this.is_constant() + "]"
                        + "(");
            for (i=0; i<this.parents.length; ++i)
                this.parents[i].debug_print(indent + 2);
            console.log(str + ')');
        }
    },
    eval: function() {
        return this.glsl_name + "()";
    },
    parent_is_unconditional: function(i) {
        return true;
    },
    propagate_conditions: function() {
        // the condition for an execution of a node is the
        // disjunction of the conjunction of all its children and their respective
        // edge conditions
        for (var i=0; i<this.parents.length; ++i)
            this.parents[i].is_unconditional = (
                this.parents[i].is_unconditional ||
                    (this.is_unconditional && 
                     this.parent_is_unconditional(i)));

    },
    set_requirements: function() {},
    // if stage is "vertex" then this expression will be hoisted to the vertex shader
    stage: null,
    // returns all sub-expressions in topologically-sorted order
    sorted_sub_expressions: function() {
        var so_far = [];
        var topological_sort_internal = function(exp) {
            if (so_far.indexOf(exp) != -1) {
                return;
            }
            var parents = exp.parents;
            if (typeOf(parents) === "undefined") {
                throw "Internal error: expression " + exp.eval()
                    + " has undefined parents.";
            }
            for (var i=0; i<parents.length; ++i) {
                topological_sort_internal(parents[i]);
            }
            so_far.push(exp);
        };
        topological_sort_internal(this);
        return so_far;
    },

    //////////////////////////////////////////////////////////////////////////
    // constant checking, will be useful for folding and for enforcement

    is_constant: function() {
        return false;
    },
    constant_value: function() {
        throw "invalid call: this.is_constant() == false";
    },
    element_is_constant: function(i) {
        return false;
    },
    element_constant_value: function(i) {
        throw "invalid call: no constant elements";
    },

    //////////////////////////////////////////////////////////////////////////
    // element access for compound expressions

    element: function(i) {
        // FIXME. Why doesn't this check for is_pod and use this.at()?
        throw "invalid call: atomic expression";  
    },

    //////////////////////////////////////////////////////////////////////////
    // some sugar

    add: function(op) {
        return Shade.add(this, op);
    },
    mul: function(op) {
        return Shade.mul(this, op);
    },
    div: function(op) {
        return Shade.div(this, op);
    },
    sub: function(op) {
        return Shade.sub(this, op);
    },
    length: function() {
        return Shade.length(this);
    },
    distance: function(other) {
        return Shade.distance(this, other);
    },
    dot: function(other) {
        return Shade.dot(this, other);
    },
    cross: function(other) {
        return Shade.cross(this, other);
    },
    normalize: function() {
        return Shade.normalize(this);
    },
    reflect: function(other) {
        return Shade.reflect(this, other);
    },
    refract: function(o1, o2) {
        return Shade.refract(this, o1, o2);
    },
    texture2D: function(coords) {
        return Shade.texture2D(this, coords);
    },
    clamp: function(mn, mx) {
        return Shade.clamp(this, mn, mx);
    },
    min: function(other) {
        return Shade.min(this, other);
    },
    max: function(other) {
        return Shade.max(this, other);
    },

    per_vertex: function() {
        return Shade.per_vertex(this);
    },
    discard_if: function(condition) {
        return Shade.discard_if(this, condition);
    },
    // all sugar for funcs_1op is defined later on in the source

    //////////////////////////////////////////////////////////////////////////

    as_int: function() {
        if (this.type.equals(Shade.Types.int_t))
            return this;
        var parent = this;
        return Shade._create_concrete_value_exp({
            parents: [parent],
            type: Shade.Types.int_t,
            value: function() { return "int(" + this.parents[0].eval() + ")"; },
            is_constant: function() { return parent.is_constant(); },
            constant_value: function() {
                var v = parent.constant_value();
                return Math.floor(v);
            },
            expression_type: "cast(int)"
        });
    },
    as_bool: function() {
        if (this.type.equals(Shade.Types.bool_t))
            return this;
        var parent = this;
        return Shade._create_concrete_value_exp({
            parents: [parent],
            type: Shade.Types.bool_t,
            value: function() { return "bool(" + this.parents[0].eval() + ")"; },
            is_constant: function() { return parent.is_constant(); },
            constant_value: function() {
                var v = parent.constant_value();
                return ~~v;
            },
            expression_type: "cast(bool)"
        });
    },
    as_float: function() {
        if (this.type.equals(Shade.Types.float_t))
            return this;
        var parent = this;
        return Shade._create_concrete_value_exp({
            parents: [parent],
            type: Shade.Types.float_t,
            value: function() { return "float(" + this.parents[0].eval() + ")"; },
            is_constant: function() { return parent.is_constant(); },
            constant_value: function() {
                var v = parent.constant_value();
                return Number(v);
            },
            expression_type: "cast(float)"
        });
    },
    swizzle: function(pattern) {
        function swizzle_pattern_to_indices(pattern) {
            function to_index(v) {
                switch (v.toLowerCase()) {
                case 'r': return 0;
                case 'g': return 1;
                case 'b': return 2;
                case 'a': return 3;
                case 'x': return 0;
                case 'y': return 1;
                case 'z': return 2;
                case 'w': return 3;
                case 's': return 0;
                case 't': return 1;
                case 'p': return 2;
                case 'q': return 3;
                default: throw "Invalid swizzle pattern";
                }
            };
            var result = [];
            for (var i=0; i<pattern.length; ++i) {
                result.push(to_index(pattern[i]));
            }
            return result;
        }
        
        var parent = this;
        var indices = swizzle_pattern_to_indices(pattern);
        return Shade._create_concrete_exp( {
            parents: [parent],
            type: parent.type.swizzle(pattern),
            expression_type: "swizzle",
            eval: function() { return this.parents[0].eval() + "." + pattern; },
            is_constant: Shade.memoize_on_field("_is_constant", function () {
                var that = this;
                return _.all(indices, function(i) {
                    return that.parents[0].element_is_constant(i);
                });
            }),
            constant_value: Shade.memoize_on_field("_constant_value", function() {
                if (this.type.is_pod()) {
                    return this.parents[0].element_constant_value(indices[0]);
                } else {
                    var that = this;
                    var ar = _.map(indices, function(index) {
                        return that.parents[0].element_constant_value(index);
                    });
                    var d = this.type.vec_dimension();
                    switch (d) {
                    case 2: return vec2.make(ar);
                    case 3: return vec3.make(ar);
                    case 4: return vec4.make(ar);
                    default:
                        throw "bad vec dimension " + d;
                    }
                }
            }),
            element: function(i) {
                return this.parents[0].element(indices[i]);
            },
            element_is_constant: Shade.memoize_on_field("_element_is_constant", function(i) {
                return this.parents[0].element_is_constant(indices[i]);
            }),
            element_constant_value: Shade.memoize_on_field("_element_constant_value", function(i) {
                return this.parents[0].element_constant_value(indices[i]);
            }),
            compile: function() {}
        });
    },
    at: function(index) {
        var parent = this;
        index = Shade.make(index);
        // this "works around" current constant index restrictions in webgl
        // look for it to get broken in the future as this hole is plugged.
        index._must_be_function_call = true;
        // FIXME: enforce that at only takes floats or ints;
        return Shade._create_concrete_exp( {
            parents: [parent, index],
            type: parent.type.array_base(),
            expression_type: "index",
            eval: function() { 
                if (this.parents[1].type.is_integral()) {
                    return this.parents[0].eval() + 
                        "[" + this.parents[1].eval() + "]"; 
                } else {
                    return this.parents[0].eval() + 
                        "[int(" + this.parents[1].eval() + ")]"; 
                }
            },
            is_constant: function() {
                return (this.parents[0].is_constant() && 
                        this.parents[1].is_constant());
            },
            constant_value: Shade.memoize_on_field("_constant_value", function() {
                var a = this.parents[0].constant_value();
                if (typeOf(a) === 'array') // this was a GLSL array of stuff
                    return a[this.parents[1].constant_value()];
                else { // this was a vec.
                    if (a._type === 'vector') {
                        return a[this.parents[1].constant_value()];
                    } else {
                        // FIXME: at constant_value for mats is broken.
                        //  Lift and use matrix_row from constant.js
                        throw "at constant_value currently broken";
                    }
                }
            }),
            // the reason for the (if x === this) checks here is that sometimes
            // the only appropriate description of an element() of an
            // opaque object (uniforms and attributes, notably) is an at() call.
            // This means that (this.parents[0].element(ix) === this) happens
            // sometimes, and we're stuck in an infinite loop.
            element: Shade.memoize_on_field("_element", function(i) {
                if (!this.parents[1].is_constant()) {
                    throw "at().element cannot be called with non-constant index";
                }
                var ix = this.parents[1].constant_value();
                var x = this.parents[0].element(ix);
                if (x === this) {
                    return x.at(i);
                } else
                    return x.element(i);
            }),
            element_is_constant: Shade.memoize_on_field("_element_is_constant", function(i) {
                if (!this.parents[1].is_constant()) {
                    return false;
                }
                var ix = this.parents[1].constant_value();
                var x = this.parents[0].element(ix);
                if (x === this) {
                    return false;
                } else
                    return x.element_is_constant(i);
            }),
            element_constant_value: Shade.memoize_on_field("_element_constant_value", function(i) {
                var ix = this.parents[1].constant_value();
                var x = this.parents[0].element(ix);
                if (x === this) {
                    throw "Would have gone into an infinite loop here: internal error.";
                }
                return x.element_constant_value(i);
            }),
            compile: function() {}
        });
    },
    expression_type: "other",
    _type: "shade_expression",
    _attribute_buffers: [],
    _uniforms: [],
    attribute_buffers: function() {
        return _.flatten(this.sorted_sub_expressions().map(function(v) { 
            return v._attribute_buffers; 
        }));
    },
    uniforms: function() {
        return _.flatten(this.sorted_sub_expressions().map(function(v) { 
            return v._uniforms; 
        }));
    },

    // simple re-writing of shaders, useful for moving expressions
    // around, such as the things we move around when attributes are 
    // referenced in fragment programs
    // 
    // FIXME: it's currently easy to create bad expressions with these.
    find_if: function(check) {
        return _.select(this.sorted_sub_expressions(), check);
    },
    replace_if: function(check, replacement) {
        var subexprs = this.sorted_sub_expressions();
        var replaced_pairs = [];
        function has_been_replaced(x) {
            return _.some(replaced_pairs, function(v) {
                return (x.guid === v[0].guid) && (v[0].guid !== v[1].guid); //_.isEqual(x, v[0]);
            });
        }
        function parent_replacement(x) {
            var r = _.select(replaced_pairs, function(v) {
                return (x.guid === v[0].guid) && (v[0].guid !== v[1].guid); //_.isEqual(x, v[0]);
            });
            if (r.length === 0)
                return x;
            else
                return r[0][1];
        }
        for (var i=0; i<subexprs.length; ++i) {
            var exp = subexprs[i];
            if (check(exp)) {
                replaced_pairs.push([exp, replacement(exp)]);
            } else if (_.some(exp.parents, has_been_replaced)) {
                var x = [exp, Shade._create(exp, {
                    parents: _.map(exp.parents, parent_replacement)
                })];
                replaced_pairs.push(x);
            } else {
                replaced_pairs.push([exp, exp]);
            }
        }
        var result = replaced_pairs[replaced_pairs.length-1][1];
        return result;
    }
};

_.each(["r", "g", "b", "a",
        "x", "y", "z", "w"], function(v) {
            Shade.Exp[v] = function() {
                return this.swizzle(v);
            };
        });

Shade._create_concrete_exp = Shade._create_concrete(Shade.Exp, ["parents", "compile", "type"]);
Shade.ValueExp = Shade._create(Shade.Exp, {
    is_constant: Shade.memoize_on_field("_is_constant", function() {
        return _.all(this.parents, function(v) {
            return v.is_constant();
        });
    }),
    _must_be_function_call: false,
    eval: function() {
        if (this._must_be_function_call)
            return this.glsl_name + "()";
        if (this.children_count <= 1)
            return this.value();
        if (this.is_unconditional)
            return this.precomputed_value_glsl_name;
        else
            return this.glsl_name + "()";
    },
    compile: function(ctx) {
        if (this._must_be_function_call) {
            if (this.is_unconditional) {
                if (this.children_count > 1) {
                    this.precomputed_value_glsl_name = ctx.request_fresh_glsl_name();
                    ctx.strings.push(this.type.declare(this.precomputed_value_glsl_name), ";\n");
                    ctx.add_initialization(this.precomputed_value_glsl_name + " = " + this.value());
                    ctx.value_function(this, this.precomputed_value_glsl_name);
                } else {
                    ctx.value_function(this, this.value());
                }
            } else {
                if (this.children_count > 1) {
                    this.precomputed_value_glsl_name = ctx.request_fresh_glsl_name();
                    ctx.strings.push(this.type.declare(this.precomputed_value_glsl_name), ";\n");
                    this.has_precomputed_value_glsl_name = ctx.request_fresh_glsl_name();
                    ctx.strings.push(Shade.Types.bool_t.declare(this.has_precomputed_value_glsl_name), ";\n");
                    ctx.add_initialization(this.has_precomputed_value_glsl_name + " = false");
                    ctx.value_function(this, "(" + this.has_precomputed_value_glsl_name + "?"
                                       + this.precomputed_value_glsl_name + ": (("
                                       + this.has_precomputed_value_glsl_name + "=true),("
                                       + this.precomputed_value_glsl_name + "="
                                       + this.value() + ")))");
                } else
                    ctx.value_function(this, this.value());
            }
        } else {
            if (this.is_unconditional) {
                if (this.children_count > 1) {
                    this.precomputed_value_glsl_name = ctx.request_fresh_glsl_name();
                    ctx.strings.push(this.type.declare(this.precomputed_value_glsl_name), ";\n");
                    ctx.add_initialization(this.precomputed_value_glsl_name + " = " + this.value());
                } else {
                    // don't emit anything, all is taken care by eval()
                }
            } else {
                if (this.children_count > 1) {
                    this.precomputed_value_glsl_name = ctx.request_fresh_glsl_name();
                    ctx.strings.push(this.type.declare(this.precomputed_value_glsl_name), ";\n");
                    this.has_precomputed_value_glsl_name = ctx.request_fresh_glsl_name();
                    ctx.strings.push(Shade.Types.bool_t.declare(this.has_precomputed_value_glsl_name), ";\n");
                    ctx.add_initialization(this.has_precomputed_value_glsl_name + " = false");
                    ctx.value_function(this, "(" + this.has_precomputed_value_glsl_name + "?"
                                       + this.precomputed_value_glsl_name + ": (("
                                       + this.has_precomputed_value_glsl_name + "=true),("
                                       + this.precomputed_value_glsl_name + "="
                                       + this.value() + ")))");
                } else {
                    // don't emit anything, all is taken care by eval()
                }
            }
        }
    }
});
Shade._create_concrete_value_exp = Shade._create_concrete(Shade.ValueExp, ["parents", "type", "value"]);
Shade.swizzle = function(exp, pattern)
{
    return Shade.make(exp).swizzle(pattern);
};
Shade.constant = function(v, type)
{
    var constant_tuple_fun = function(type, args)
    {
        function to_glsl(type, args) {
            // FIXME this seems incredibly ugly, but we need something
            // like it, so that numbers are appropriately promoted to floats
            // in GLSL's syntax.

            var string_args = _.map(args, function(arg) {
                var v = String(arg);
                if (v.indexOf(".") === -1) {
                    return v + ".0";
                } else
                    return v;
            });
            return type + '(' + _.toArray(string_args).join(', ') + ')';
        }

        function matrix_row(i) {
            var sz = type.array_size();
            var result = [];
            for (var j=0; j<sz; ++j) {
                result.push(args[i + j*sz]);
            }
            return result;
        }

        return Shade._create_concrete_exp( {
            eval: function(glsl_name) {
                return to_glsl(this.type.repr(), args);
            },
            expression_type: "constant{" + args + "}",
            is_constant: function() { return true; },
            element: Shade.memoize_on_field("_element", function(i) {
                if (this.type.is_pod()) {
                    if (i === 0)
                        return this;
                    else
                        throw "float is an atomic type, got this: " + i;
                } if (this.type.is_vec()) {
                    return Shade.constant(args[i]);
                } else {
                    return Shade.vec.apply(matrix_row(i));
                }
            }),
            element_is_constant: function(i) {
                return true;
            },
            element_constant_value: Shade.memoize_on_field("_element_constant_value", function(i) {
                if (this.type.equals(Shade.Types.float_t)) {
                    if (i === 0)
                        return args[0];
                    else
                        throw "float is an atomic type";
                } if (this.type.is_vec()) {
                    return args[i];
                }
                return vec[this.type.array_size()].make(matrix_row(i));
            }),
            constant_value: Shade.memoize_on_field("_constant_value", function() {
                // FIXME boolean_vector
                if (this.type.is_pod())
                    return args[0];
                if (this.type.equals(Shade.Types.vec2) ||
                    this.type.equals(Shade.Types.vec3) ||
                    this.type.equals(Shade.Types.vec4))
                    return vec[args.length].make(args);
                if (this.type.equals(Shade.Types.mat2) ||
                    this.type.equals(Shade.Types.mat3) ||
                    this.type.equals(Shade.Types.mat4))
                    return mat[Math.sqrt(args.length)].make(args);
                else
                    throw "Internal Error: constant of unknown type";
            }),
            compile: function(ctx) {},
            parents: [],
            type: type
        });
    };

    var t = constant_type(v);
    if (t === 'other') {
        t = typeOf(v);
        if (t === 'array') {
            var new_v = v.map(Shade.make);
            var array_size = new_v.length;
            if (array_size == 0) {
                throw "array constant must be non-empty";
            }
            var array_type = Shade.array(new_v[0].type, array_size);
            return Shade._create_concrete_exp( {
                parents: new_v,
                type: array_type,
                expression_type: "constant",
                eval: function() { return this.glsl_name; },
                compile: function (ctx) {
                    this.array_initializer_glsl_name = ctx.request_fresh_glsl_name();
                    ctx.strings.push(this.type.declare(this.glsl_name), ";\n");
                    ctx.strings.push("void", this.array_initializer_glsl_name, "(void) {\n");
                    for (var i=0; i<this.parents.length; ++i) {
                        ctx.strings.push("    ", this.glsl_name, "[", i, "] =",
                                         this.parents[i].eval(), ";\n");
                    };
                    ctx.strings.push("}\n");
                    ctx.add_initialization(this.array_initializer_glsl_name + "()");
                },
                element: function(i) {
                    return this.parents[i];
                },
                element_is_constant: function(i) {
                    return this.parents[i].is_constant();
                },
                element_constant_value: function(i) {
                    return this.parents[i].constant_value();
                }
            });
        } else {
            throw "type error: constant should be bool, number, vector or matrix";
        }
    }
    if (t === 'number') {
        if (type && !(type.equals(Shade.Types.float_t) ||
                      type.equals(Shade.Types.int_t))) {
            throw ("expected specified type for numbers to be float or int," +
                   " got " + type.repr() + " instead.");
        }
        return constant_tuple_fun(type || Shade.Types.float_t, [v]);
    }
    if (t === 'boolean') {
        if (type && !type.equals(Shade.Types.bool_t))
            throw ("boolean constants cannot be interpreted as " + 
                   type.repr());
        return constant_tuple_fun(Shade.Types.bool_t, [v]);
    }
    if (t === 'vector') {
        var d = v.length;
        if (d < 2 && d > 4)
            throw "Invalid length for constant vector: " + v;

        var el_ts = _.map(v, function(t) { return typeOf(t); });
        if (!_.all(el_ts, function(t) { return t === el_ts[0]; })) {
            throw "Not all constant params have the same types;";
        }
        if (el_ts[0] === "number") {
            var computed_t = Shade.basic('vec' + d);
            if (type && !computed_t.equals(type)) {
                throw "passed constant must have type " + computed_t.repr()
                    + ", but was request to have incompatible type " 
                    + type.repr();
            }
            return constant_tuple_fun(computed_t, v);
        }
        else
            throw "bad datatype for constant: " + el_ts[0];
    }
    if (t === 'boolean_vector') {
        // FIXME bvecs
        var d = v.length;
        var computed_t = Shade.basic('bvec' + d);
        if (type && !computed_t.equals(type)) {
            throw "passed constant must have type " + computed_t.repr()
                + ", but was request to have incompatible type " 
                + type.repr();
        }
        return constant_tuple_fun(computed_t, v);
    }
    if (t === 'matrix') {
        var d = Math.sqrt(v.length); // FIXME UGLY
        var computed_t = Shade.basic('mat' + d);
        if (type && !computed_t.equals(type)) {
            throw "passed constant must have type " + computed_t.repr()
                + ", but was request to have incompatible type " 
                + type.repr();
        }
        return constant_tuple_fun(computed_t, v);
    }
    throw "type error: constant_type returned bogus value?";
};

Shade.as_int = function(v) { return Shade.make(v).as_int(); };
Shade.as_bool = function(v) { return Shade.make(v).as_bool(); };
Shade.as_float = function(v) { return Shade.make(v).as_float(); };
// FIXME: Shade.set should be (name, exp), not (exp, name)
Shade.set = function(exp, name)
{
    exp = Shade.make(exp);
    var type = exp.type;
    return Shade._create_concrete_exp({
        expression_type: "set",
        compile: function(ctx) {
            if ((name === "gl_FragColor" ||
                 (name.substring(0, 11) === "gl_FragData")) &&
                ctx.compile_type !== Shade.FRAGMENT_PROGRAM_COMPILE) {
                throw ("gl_FragColor and gl_FragData assignment"
                       + " only allowed on fragment shaders");
            }
            if ((name === "gl_Position" ||
                 name === "gl_PointSize") &&
                ctx.compile_type !== Shade.VERTEX_PROGRAM_COMPILE) {
                throw ("gl_Position and gl_PointSize assignment "
                       + "only allowed on vertex shaders");
            }
            if ((ctx.compile_type !== Shade.VERTEX_PROGRAM_COMPILE) &&
                (name !== "gl_FragColor") &&
                (name.substring(0, 11) !== "gl_FragData")) {
                throw ("The only allowed output variables on a fragment"
                       + " shader are gl_FragColor and gl_FragData[]");
            }
            if (name !== "gl_FragColor" &&
                name !== "gl_Position" &&
                name !== "gl_PointSize" &&
                !(name.substring(0, 11) == "gl_FragData")) {
                ctx.declare_varying(name, type);
            }
            ctx.void_function(this, "(", name, "=", this.parents[0].eval(), ")");
        },
        type: Shade.basic('void'),
        parents: [exp]
    });
};
Shade.uniform = function(type, v)
{
    var call_lookup = [
        [Shade.Types.float_t, "uniform1f"],
        [Shade.Types.int_t, "uniform1i"],
        [Shade.Types.bool_t, "uniform1i"],
        [Shade.Types.sampler2D, "uniform1i"],
        [Shade.Types.vec2, "uniform2fv"],
        [Shade.Types.vec3, "uniform3fv"],
        [Shade.Types.vec4, "uniform4fv"],
        [Shade.Types.mat2, "uniformMatrix2fv"],
        [Shade.Types.mat3, "uniformMatrix3fv"],
        [Shade.Types.mat4, "uniformMatrix4fv"]
    ];

    var uniform_name = Shade.unique_name();
    if (typeof type === 'undefined') throw "uniform requires type";
    if (typeof type === 'string') type = Shade.basic(type);
    var value;
    var call = _.detect(call_lookup, function(p) { return type.equals(p[0]); });
    if (typeof call !== 'undefined') {
        call = call[1];
    } else {
        throw "Unsupported type " + type.repr() + " for uniform.";
    }
    var result = Shade._create_concrete_exp({
        parents: [],
        type: type,
        expression_type: 'uniform',
        eval: function() {
            if (this._must_be_function_call) {
                return this.glsl_name + "()";
            } else
                return uniform_name; 
        },
        element: Shade.memoize_on_field("_element", function(i) {
            if (this.type.is_pod()) {
                if (i === 0)
                    return this;
                else
                    throw this.type.repr() + " is an atomic type";
            } else
                return this.at(i);
        }),
        compile: function(ctx) {
            ctx.declare_uniform(uniform_name, this.type);
            if (this._must_be_function_call) {
                this.precomputed_value_glsl_name = ctx.request_fresh_glsl_name();
                ctx.strings.push(this.type.declare(this.precomputed_value_glsl_name), ";\n");
                ctx.add_initialization(this.precomputed_value_glsl_name + " = " + uniform_name);
                ctx.value_function(this, this.precomputed_value_glsl_name);
            }
        },
        // FIXME: type checking
        set: function(v) {
            var t = constant_type(v);
            if (t === "shade_expression")
                v = v.constant_value();
            value = v;
            if (this._facet_active_uniform) {
                this._facet_active_uniform(v);
            }
        },
        get: function(v) {
            return value;
        },
        uniform_call: call,
        uniform_name: uniform_name
    });
    result._uniforms = [result];
    result.set(v);
    return result;
};
Shade.sampler2D_from_texture = function(texture)
{
    return texture._shade_expression || function() {
        var result = Shade.uniform("sampler2D");
        result.set(texture);
        texture._shade_expression = result;
        // FIXME: What if the same texture is bound to many samplers?!
        return result;
    }();
};

Shade.attribute_from_buffer = function(buffer)
{
    return buffer._shade_expression || function() {
        var itemTypeMap = [ undefined, Shade.Types.float_t, Shade.Types.vec2, Shade.Types.vec3, Shade.Types.vec4 ];
        var itemType = itemTypeMap[buffer.itemSize];
        var itemName;
        if (typeof buffer._shade_name === 'undefined') {
            itemName = Shade.unique_name();
            buffer._shade_name = itemName;
        } else {
            itemName = buffer._shade_name;
        }
        var result = Shade.attribute(itemName, itemType);
        result._attribute_buffers = [buffer];
        buffer._shade_expression = result;
        return result;
    }();
};

Shade.attribute = function(name, type)
{
    if (typeof type === 'undefined') throw "attribute requires type";
    if (typeof type === 'string') type = Shade.basic(type);
    return Shade._create_concrete_exp( {
        parents: [],
        type: type,
        expression_type: 'attribute',
        element: Shade.memoize_on_field("_element", function(i) {
            if (this.type.equals(Shade.Types.float_t)) {
                if (i === 0)
                    return this;
                else
                    throw "float is an atomic type";
            } else
                return this.at(i);
        }),
        eval: function() { 
            if (this._must_be_function_call) {
                return this.glsl_name + "()";
            } else
                return name; 
        },
        compile: function(ctx) {
            ctx.declare_attribute(name, this.type);
            if (this._must_be_function_call) {
                this.precomputed_value_glsl_name = ctx.request_fresh_glsl_name();
                ctx.strings.push(this.type.declare(this.precomputed_value_glsl_name), ";\n");
                ctx.add_initialization(this.precomputed_value_glsl_name + " = " + name);
                ctx.value_function(this, this.precomputed_value_glsl_name);
            }
        }
    });
};
// FIXME: typechecking
Shade.varying = function(name, type)
{
    if (typeof type === 'undefined') throw "varying requires type";
    if (typeof type === 'string') type = Shade.basic(type);
    return Shade._create_concrete_exp( {
        parents: [],
        type: type,
        expression_type: 'varying',
        element: Shade.memoize_on_field("_element", function(i) {
            if (this.type.is_pod()) {
                if (i === 0)
                    return this;
                else
                    throw this.type.repr() + " is an atomic type";
            } else
                return this.at(i);
        }),
        eval: function() { return name; },
        compile: function(ctx) {
            ctx.declare_varying(name, this.type);
        }
    });
};

Shade.pointCoord = function() {
    return Shade._create_concrete_exp({
        expression_type: "builtin_input{gl_PointCoord}",
        parents: [],
        type: Shade.Types.vec2,
        eval: function() { return "gl_PointCoord"; },
        compile: function(ctx) {
        }
    });
};
Shade.round_dot = function(color) {
    var outside_dot = Shade.pointCoord().sub(Shade.vec(0.5, 0.5)).length().gt(0.25);
    return Shade.make(color).discard_if(outside_dot);
};
(function() {

var operator = function(exp1, exp2, 
                        operator_name, type_resolver,
                        constant_evaluator)
{
    var resulting_type = type_resolver(exp1.type, exp2.type);
    return Shade._create_concrete_value_exp( {
        parents: [exp1, exp2],
        type: resulting_type,
        expression_type: "operator" + operator_name,
        value: function () {
            return "(" + this.parents[0].eval() + " " + operator_name + " " +
                this.parents[1].eval() + ")";
        },
        constant_value: Shade.memoize_on_field("_constant_value", function() {
            return constant_evaluator(this);
        }),
        element: Shade.memoize_on_field("_element", function(i) {
            return operator(this.parents[0].element(i),
                            this.parents[1].element(i),
                            operator_name, type_resolver,
                            constant_evaluator);
        }),
        element_constant_value: Shade.memoize_on_field("_element_constant_value", function(i) {
            return this.element(i).constant_value();
        }),
        element_is_constant: Shade.memoize_on_field("_element_is_constant", function(i) {
            return (this.parents[0].element_is_constant(i) &&
                    this.parents[1].element_is_constant(i));
        })
    });
};

Shade.add = function() {
    if (arguments.length === 0) throw "add needs at least one argument";
    if (arguments.length === 1) return arguments[0];
    function add_type_resolver(t1, t2) {
        var type_list = [
            [Shade.Types.vec4, Shade.Types.vec4, Shade.Types.vec4],
            [Shade.Types.mat4, Shade.Types.mat4, Shade.Types.mat4],
            [Shade.Types.float_t, Shade.Types.float_t, Shade.Types.float_t],
            [Shade.Types.vec4, Shade.Types.float_t, Shade.Types.vec4],
            [Shade.Types.float_t, Shade.Types.vec4, Shade.Types.vec4],
            [Shade.Types.mat4, Shade.Types.float_t, Shade.Types.mat4],
            [Shade.Types.float_t, Shade.Types.mat4, Shade.Types.mat4],

            [Shade.Types.vec3, Shade.Types.vec3, Shade.Types.vec3],
            [Shade.Types.mat3, Shade.Types.mat3, Shade.Types.mat3],
            [Shade.Types.float_t, Shade.Types.float_t, Shade.Types.float_t],
            [Shade.Types.vec3, Shade.Types.float_t, Shade.Types.vec3],
            [Shade.Types.float_t, Shade.Types.vec3, Shade.Types.vec3],
            [Shade.Types.mat3, Shade.Types.float_t, Shade.Types.mat3],
            [Shade.Types.float_t, Shade.Types.mat3, Shade.Types.mat3],

            [Shade.Types.vec2, Shade.Types.vec2, Shade.Types.vec2],
            [Shade.Types.mat2, Shade.Types.mat2, Shade.Types.mat2],
            [Shade.Types.float_t, Shade.Types.float_t, Shade.Types.float_t],
            [Shade.Types.vec2, Shade.Types.float_t, Shade.Types.vec2],
            [Shade.Types.float_t, Shade.Types.vec2, Shade.Types.vec2],
            [Shade.Types.mat2, Shade.Types.float_t, Shade.Types.mat2],
            [Shade.Types.float_t, Shade.Types.mat2, Shade.Types.mat2],
            
            [Shade.Types.int_t, Shade.Types.int_t, Shade.Types.int_t]
        ];
        for (var i=0; i<type_list.length; ++i)
            if (t1.equals(type_list[i][0]) &&
                t2.equals(type_list[i][1]))
                return type_list[i][2];
        throw ("type mismatch on add: unexpected types  '"
                   + t1.repr() + "' and '" + t2.repr() + "'.");
    };
    var current_result = Shade.make(arguments[0]);
    function evaluator(exp) {
        var exp1 = exp.parents[0], exp2 = exp.parents[1];
        var vt;
        if (exp1.type.is_vec())
            vt = vec[exp1.type.vec_dimension()];
        else if (exp2.type.is_vec())
            vt = vec[exp2.type.vec_dimension()];
        var v1 = exp1.constant_value(), v2 = exp2.constant_value();
        if (exp1.type.equals(Shade.Types.int_t) && 
            exp2.type.equals(Shade.Types.int_t))
            return v1 + v2;
        if (exp1.type.equals(Shade.Types.float_t) &&
            exp2.type.equals(Shade.Types.float_t))
            return v1 + v2;
        if (exp2.type.equals(Shade.Types.float_t))
            return vt.map(v1, function(x) { 
                return x + v2; 
            });
        if (exp1.type.equals(Shade.Types.float_t))
            return vt.map(v2, function(x) {
                return v1 + x;
            });
        return vt.plus(v1, v2);
    }
    for (var i=1; i<arguments.length; ++i) {
        current_result = operator(current_result, Shade.make(arguments[i]),
                                  "+", add_type_resolver, evaluator);
    }
    return current_result;
};

Shade.sub = function() {
    if (arguments.length === 0) throw "sub needs at least two arguments";
    if (arguments.length === 1) throw "unary minus unimplemented";
    function sub_type_resolver(t1, t2) {
        var type_list = [
            [Shade.Types.vec4, Shade.Types.vec4, Shade.Types.vec4],
            [Shade.Types.mat4, Shade.Types.mat4, Shade.Types.mat4],
            [Shade.Types.float_t, Shade.Types.float_t, Shade.Types.float_t],
            [Shade.Types.vec4, Shade.Types.float_t, Shade.Types.vec4],
            [Shade.Types.float_t, Shade.Types.vec4, Shade.Types.vec4],
            [Shade.Types.mat4, Shade.Types.float_t, Shade.Types.mat4],
            [Shade.Types.float_t, Shade.Types.mat4, Shade.Types.mat4],

            [Shade.Types.vec3, Shade.Types.vec3, Shade.Types.vec3],
            [Shade.Types.mat3, Shade.Types.mat3, Shade.Types.mat3],
            [Shade.Types.float_t, Shade.Types.float_t, Shade.Types.float_t],
            [Shade.Types.vec3, Shade.Types.float_t, Shade.Types.vec3],
            [Shade.Types.float_t, Shade.Types.vec3, Shade.Types.vec3],
            [Shade.Types.mat3, Shade.Types.float_t, Shade.Types.mat3],
            [Shade.Types.float_t, Shade.Types.mat3, Shade.Types.mat3],

            [Shade.Types.vec2, Shade.Types.vec2, Shade.Types.vec2],
            [Shade.Types.mat2, Shade.Types.mat2, Shade.Types.mat2],
            [Shade.Types.float_t, Shade.Types.float_t, Shade.Types.float_t],
            [Shade.Types.vec2, Shade.Types.float_t, Shade.Types.vec2],
            [Shade.Types.float_t, Shade.Types.vec2, Shade.Types.vec2],
            [Shade.Types.mat2, Shade.Types.float_t, Shade.Types.mat2],
            [Shade.Types.float_t, Shade.Types.mat2, Shade.Types.mat2],
            
            [Shade.Types.int_t, Shade.Types.int_t, Shade.Types.int_t]
        ];
        for (var i=0; i<type_list.length; ++i)
            if (t1.equals(type_list[i][0]) &&
                t2.equals(type_list[i][1]))
                return type_list[i][2];
        throw ("type mismatch on sub: unexpected types  '"
                   + t1.repr() + "' and '" + t2.repr() + "'.");
    };
    function evaluator(exp) {
        var exp1 = exp.parents[0], exp2 = exp.parents[1];
        var vt;
        if (exp1.type.is_vec())
            vt = vec[exp1.type.vec_dimension()];
        else if (exp2.type.is_vec())
            vt = vec[exp2.type.vec_dimension()];
        var v1 = exp1.constant_value(), v2 = exp2.constant_value();
        if (exp1.type.equals(Shade.Types.int_t) && 
            exp2.type.equals(Shade.Types.int_t))
            return v1 - v2;
        if (exp1.type.equals(Shade.Types.float_t) &&
            exp2.type.equals(Shade.Types.float_t))
            return v1 - v2;
        if (exp2.type.equals(Shade.Types.float_t))
            return vt.map(v1, function(x) { 
                return x - v2; 
            });
        if (exp1.type.equals(Shade.Types.float_t))
            return vt.map(v2, function(x) {
                return v1 - x;
            });
        return vt.minus(v1, v2);
    }
    var current_result = Shade.make(arguments[0]);
    for (var i=1; i<arguments.length; ++i) {
        current_result = operator(current_result, Shade.make(arguments[i]),
                                  "-", sub_type_resolver, evaluator);
    }
    return current_result;
};

Shade.div = function() {
    if (arguments.length === 0) throw "div needs at least two arguments";
    function div_type_resolver(t1, t2) {
        if (typeof t1 === 'undefined')
            throw "t1 multiplication with undefined type?";
        if (typeof t2 === 'undefined')
            throw "t2 multiplication with undefined type?";
        var type_list = [
            [Shade.Types.vec4, Shade.Types.vec4, Shade.Types.vec4],
            [Shade.Types.mat4, Shade.Types.mat4, Shade.Types.mat4],
            [Shade.Types.float_t, Shade.Types.float_t, Shade.Types.float_t],
            [Shade.Types.vec4, Shade.Types.float_t, Shade.Types.vec4],
            [Shade.Types.float_t, Shade.Types.vec4, Shade.Types.vec4],
            [Shade.Types.mat4, Shade.Types.float_t, Shade.Types.mat4],
            [Shade.Types.float_t, Shade.Types.mat4, Shade.Types.mat4],

            [Shade.Types.vec3, Shade.Types.vec3, Shade.Types.vec3],
            [Shade.Types.mat3, Shade.Types.mat3, Shade.Types.mat3],
            [Shade.Types.float_t, Shade.Types.float_t, Shade.Types.float_t],
            [Shade.Types.vec3, Shade.Types.float_t, Shade.Types.vec3],
            [Shade.Types.float_t, Shade.Types.vec3, Shade.Types.vec3],
            [Shade.Types.mat3, Shade.Types.float_t, Shade.Types.mat3],
            [Shade.Types.float_t, Shade.Types.mat3, Shade.Types.mat3],

            [Shade.Types.vec2, Shade.Types.vec2, Shade.Types.vec2],
            [Shade.Types.mat2, Shade.Types.mat2, Shade.Types.mat2],
            [Shade.Types.float_t, Shade.Types.float_t, Shade.Types.float_t],
            [Shade.Types.vec2, Shade.Types.float_t, Shade.Types.vec2],
            [Shade.Types.float_t, Shade.Types.vec2, Shade.Types.vec2],
            [Shade.Types.mat2, Shade.Types.float_t, Shade.Types.mat2],
            [Shade.Types.float_t, Shade.Types.mat2, Shade.Types.mat2]
        ];
        for (var i=0; i<type_list.length; ++i)
            if (t1.equals(type_list[i][0]) &&
                t2.equals(type_list[i][1]))
                return type_list[i][2];
        throw ("type mismatch on div: unexpected types  '"
                   + t1.repr() + "' and '" + t2.repr() + "'.");
    };
    function evaluator(exp) {
        var exp1 = exp.parents[0];
        var exp2 = exp.parents[1];
        var v1 = exp1.constant_value();
        var v2 = exp2.constant_value();
        var vt, mt;
        if (exp1.type.is_array()) {
            vt = vec[exp1.type.array_size()];
            mt = mat[exp1.type.array_size()];
        } else if (exp2.type.is_array()) {
            vt = vec[exp2.type.array_size()];
            mt = mat[exp2.type.array_size()];
        };
        var t1 = constant_type(v1), t2 = constant_type(v2);
        var dispatch = {
            number: { number: function (x, y) { return x / y; },
                      vector: function (x, y) { 
                          return vt.map(y, function(v) {
                              return x/v;
                          });
                      },
                      matrix: function (x, y) { 
                          return mt.map(y, function(v) {
                              return x/v;
                          });
                      }
                    },
            vector: { number: function (x, y) { return vt.scaling(x, 1/y); },
                      vector: function (x, y) { 
                          return vt.map(y, function(v,i) {
                              return x[i]/v;
                          });
                      },
                      matrix: function (x, y) {
                          throw "internal error, can't eval vector/matrix";
                      }
                    },
            matrix: { number: function (x, y) { return mt.scaling(x, 1/y); },
                      vector: function (x, y) { 
                          throw "internal error, can't eval matrix/vector";
                      },
                      matrix: function (x, y) { 
                          throw "internal error, can't eval matrix/matrix";
                      }
                    }
        };
        return dispatch[t1][t2](v1, v2);
    }
    var current_result = Shade.make(arguments[0]);
    for (var i=1; i<arguments.length; ++i) {
        current_result = operator(current_result, Shade.make(arguments[i]),
                                  "/", div_type_resolver, evaluator);
    }
    return current_result;
};

Shade.mul = function() {
    if (arguments.length === 0) throw "mul needs at least one argument";
    if (arguments.length === 1) return arguments[0];
    function mul_type_resolver(t1, t2) {
        if (typeof t1 === 'undefined')
            throw "t1 multiplication with undefined type?";
        if (typeof t2 === 'undefined')
            throw "t2 multiplication with undefined type?";
        var type_list = [
            [Shade.Types.vec4, Shade.Types.vec4, Shade.Types.vec4],
            [Shade.Types.mat4, Shade.Types.mat4, Shade.Types.mat4],
            [Shade.Types.mat4, Shade.Types.vec4, Shade.Types.vec4],
            [Shade.Types.vec4, Shade.Types.mat4, Shade.Types.vec4],
            [Shade.Types.float_t, Shade.Types.float_t, Shade.Types.float_t],
            [Shade.Types.vec4, Shade.Types.float_t, Shade.Types.vec4],
            [Shade.Types.float_t, Shade.Types.vec4, Shade.Types.vec4],
            [Shade.Types.mat4, Shade.Types.float_t, Shade.Types.mat4],
            [Shade.Types.float_t, Shade.Types.mat4, Shade.Types.mat4],

            [Shade.Types.vec3, Shade.Types.vec3, Shade.Types.vec3],
            [Shade.Types.mat3, Shade.Types.mat3, Shade.Types.mat3],
            [Shade.Types.mat3, Shade.Types.vec3, Shade.Types.vec3],
            [Shade.Types.vec3, Shade.Types.mat3, Shade.Types.vec3],
            [Shade.Types.float_t, Shade.Types.float_t, Shade.Types.float_t],
            [Shade.Types.vec3, Shade.Types.float_t, Shade.Types.vec3],
            [Shade.Types.float_t, Shade.Types.vec3, Shade.Types.vec3],
            [Shade.Types.mat3, Shade.Types.float_t, Shade.Types.mat3],
            [Shade.Types.float_t, Shade.Types.mat3, Shade.Types.mat3],

            [Shade.Types.vec2, Shade.Types.vec2, Shade.Types.vec2],
            [Shade.Types.mat2, Shade.Types.mat2, Shade.Types.mat2],
            [Shade.Types.mat2, Shade.Types.vec2, Shade.Types.vec2],
            [Shade.Types.vec2, Shade.Types.mat2, Shade.Types.vec2],
            [Shade.Types.float_t, Shade.Types.float_t, Shade.Types.float_t],
            [Shade.Types.vec2, Shade.Types.float_t, Shade.Types.vec2],
            [Shade.Types.float_t, Shade.Types.vec2, Shade.Types.vec2],
            [Shade.Types.mat2, Shade.Types.float_t, Shade.Types.mat2],
            [Shade.Types.float_t, Shade.Types.mat2, Shade.Types.mat2],
            
            [Shade.Types.int_t, Shade.Types.int_t, Shade.Types.int_t]
        ];
        for (var i=0; i<type_list.length; ++i)
            if (t1.equals(type_list[i][0]) &&
                t2.equals(type_list[i][1]))
                return type_list[i][2];
        throw ("type mismatch on mul: unexpected types  '"
                   + t1.repr() + "' and '" + t2.repr() + "'.");
    };
    function evaluator(exp) {
        var exp1 = exp.parents[0];
        var exp2 = exp.parents[1];
        var v1 = exp1.constant_value();
        var v2 = exp2.constant_value();
        var vt, mt;
        if (exp1.type.is_array()) {
            vt = vec[exp1.type.array_size()];
            mt = mat[exp1.type.array_size()];
        } else if (exp2.type.is_array()) {
            vt = vec[exp2.type.array_size()];
            mt = mat[exp2.type.array_size()];
        }
        var t1 = constant_type(v1), t2 = constant_type(v2);
        var dispatch = {
            number: { number: function (x, y) { return x * y; },
                      vector: function (x, y) { return vt.scaling(y, x); },
                      matrix: function (x, y) { return mt.scaling(y, x); }
                    },
            vector: { number: function (x, y) { return vt.scaling(x, y); },
                      vector: function (x, y) { 
                          return vt.schur_product(x, y); 
                      },
                      matrix: function (x, y) {
                          return mt.product_vec(mt.transpose(y), x);
                      }
                    },
            matrix: { number: function (x, y) { return mt.scaling(x, y); },
                      vector: function (x, y) { return mt.product_vec(x, y); },
                      matrix: function (x, y) { return mt.product(x, y); }
                    }
        };
        return dispatch[t1][t2](v1, v2);
    }
    var current_result = Shade.make(arguments[0]);
    for (var i=1; i<arguments.length; ++i) {
        current_result = operator(current_result, Shade.make(arguments[i]),
                                  "*", mul_type_resolver, evaluator);
    }
    return current_result;
};
})();
Shade.neg = function(x)
{
    return Shade.sub(0, x);
};
Shade.Exp.neg = function() { return Shade.neg(this); };

Shade.vec = function()
{
    var parents = [];
    var parent_offsets = [];
    var total_size = 0;
    var vec_type;
    for (var i=0; i<arguments.length; ++i) {
        var arg = Shade.make(arguments[i]);
        parents.push(arg);
        parent_offsets.push(total_size);
        if (typeOf(vec_type) === 'undefined')
            vec_type = arg.type.element_type(0);
        else if (!vec_type.equals(arg.type.element_type(0)))
            throw "vec requires equal types";
        total_size += arg.type.size_for_vec_constructor();
    }
    parent_offsets.push(total_size);
    if (total_size < 1 || total_size > 4) {
        throw "vec constructor requires resulting width to be between "
            + "1 and 4, got " + total_size + " instead.";
    }
    var type;
    if (vec_type.equals(Shade.Types.float_t)) {
        type = Shade.basic("vec" + total_size);
    } else if (vec_type.equals(Shade.Types.int_t)) {
        type = Shade.basic("ivec" + total_size);
    } else if (vec_type.equals(Shade.Types.bool_t)) {
        type = Shade.basic("bvec" + total_size);
    } else {
        throw "vec type must be bool, int, or float.";
    }
    
    return Shade._create_concrete_value_exp({
        parents: parents,
        parent_offsets: parent_offsets,
        type: type,
        expression_type: 'vec',
        size: total_size,
        element: function(i) {
            var old_i = i;
            for (var j=0; j<this.parents.length; ++j) {
                var sz = this.parent_offsets[j+1] - this.parent_offsets[j];
                if (i < sz)
                    return this.parents[j].element(i);
                i = i - sz;
            }
            throw "Element " + old_i + " out of bounds (size=" 
                + total_size + ")";
        },
        element_is_constant: function(i) {
            var old_i = i;
            for (var j=0; j<this.parents.length; ++j) {
                var sz = this.parent_offsets[j+1] - this.parent_offsets[j];
                if (i < sz)
                    return this.parents[j].element_is_constant(i);
                i = i - sz;
            }
            throw "Element " + old_i + " out of bounds (size=" 
                + total_size + ")";
        },
        element_constant_value: function(i) {
            var old_i = i;
            for (var j=0; j<this.parents.length; ++j) {
                var sz = this.parent_offsets[j+1] - this.parent_offsets[j];
                if (i < sz)
                    return this.parents[j].element_constant_value(i);
                i = i - sz;
            }
            throw "Element " + old_i + " out of bounds (size=" 
                + total_size + ")";
        },
        constant_value: Shade.memoize_on_field("_constant_value", function () {
            var result = [];
            var parent_values = _.each(this.parents, function(v) {
                var c = v.constant_value();
                if (typeOf(c) === 'number')
                    result.push(c);
                else
                    for (var i=0; i<c.length; ++i)
                        result.push(c[i]);
            });
            return vec[result.length].make(result);
        }),
        value: function() {
            return this.type.repr() + "(" +
                this.parents.map(function (t) {
                    return t.eval();
                }).join(", ") + ")";
        }
    });
};
Shade.mat = function()
{
    var parents = [];
    var rows = arguments.length, cols;

    for (var i=0; i<arguments.length; ++i) {
        var arg = arguments[i];
        // if (!(arg.expression_type === 'vec')) {
        //     throw "mat only takes vecs as parameters";
        // }
        parents.push(arg);
        if (i === 0)
            cols = arg.type.size_for_vec_constructor();
        else if (cols !== arg.type.size_for_vec_constructor())
            throw "mat: all vecs must have same dimension";
    }

    if (cols !== rows) {
        throw "non-square matrices currently not supported";
    }

    if (rows < 1 || rows > 4) {
        throw "mat constructor requires resulting dimension to be between "
            + "2 and 4.";
    }
    var type = Shade.basic("mat" + rows);
    return Shade._create_concrete_value_exp( {
        parents: parents,
        type: type,
        expression_type: 'mat',
        size: rows,
        element: function(i) {
            return this.parents[i];
        },
        element_is_constant: function(i) {
            return this.parents[i].is_constant();
        },
        element_constant_value: function(i) {
            return this.parents[i].constant_value();
        },
        constant_value: Shade.memoize_on_field("_constant_value", function() {
            var result = [];
            var ll = _.each(this.parents, function(v) {
                v = v.constant_value();
                for (var i=0; i<v.length; ++i) {
                    result.push(v[i]);
                }
            });
            return mat[this.type.array_size()].make(result);
        }),
        value: function() {
            return this.type.repr() + "(" +
                this.parents.map(function (t) { 
                    return t.eval(); 
                }).join(", ") + ")";
        }
    });
};

Shade.mat3 = function(m)
{
    var t = m.type;
    if (t.equals(Shade.Types.mat2)) {
        return Shade.mat(Shade.vec(m.at(0), 0),
                         Shade.vec(m.at(1), 0),
                         Shade.vec(0, 0, 1));
    } else if (t.equals(Shade.Types.mat3)) {
        return m;
    } else if (t.equals(Shade.Types.mat4)) {
        return Shade.mat(m.element(0).swizzle("xyz"),
                         m.element(1).swizzle("xyz"),
                         m.element(2).swizzle("xyz"));
    } else {
        throw "mat3: need matrix to convert to mat3";
    }
};
// per_vertex is an identity operation value-wise, but it tags the AST
// so the optimizer can do its thing.
Shade.per_vertex = function(exp)
{
    exp = Shade.make(exp);
    return Shade._create_concrete_exp({
        expression_name: "per_vertex",
        parents: [exp],
        type: exp.type,
        stage: "vertex",
        eval: function() { return this.parents[0].eval(); },
        compile: function () {}
    });
};
(function() {

//////////////////////////////////////////////////////////////////////////////
// common functions

function builtin_glsl_function(name, type_resolving_list, constant_evaluator)
{
    for (var i=0; i<type_resolving_list.length; ++i)
        for (var j=0; j<type_resolving_list[i].length; ++j) {
            var t = type_resolving_list[i][j];
            if (typeof(t) === 'undefined')
                throw "undefined type in type_resolver";
        }
    // takes a list of lists of possible argument types, returns a function to 
    // resolve those types.
    function type_resolver_from_list(lst)
    {
        var param_length = lst[0].length - 1;
        return function() {
            if (arguments.length != param_length) {
                throw "expected " + param_length + " arguments, got "
                    + arguments.length + " instead.";
            }
            for (var i=0; i<lst.length; ++i) {
                var this_params = lst[i];
                var matched = true;
                for (var j=0; j<param_length; ++j) {
                    if (!this_params[j].equals(arguments[j].type)) {
                        matched = false;
                        break;
                    }
                }
                if (matched)
                    return this_params[param_length];
            }
            var types = _.map(_.toArray(arguments).slice(0, arguments.length),
                  function(x) { return x.type.repr(); }).join(", ");
            throw "Could not find appropriate type match for (" + types + ")";
        };
    }

    var resolver = type_resolver_from_list(type_resolving_list);
    if (constant_evaluator) {
        return function() {
            var type, canon_args = [];
            for (var i=0; i<arguments.length; ++i) {
                canon_args.push(Shade.make(arguments[i]));
            }
            try {
                type = resolver.apply(this, canon_args);
            } catch (err) {
                throw "type error on " + name + ": " + err;
            }
            return Shade._create_concrete_value_exp( {
                parents: canon_args,
                type: type,
                expression_type: "builtin_function{" + name + "}",
                value: function() {
                    return [name, "(",
                            this.parents.map(function(t) { 
                                return t.eval(); 
                            }).join(", "),
                            ")"].join(" ");
                },
                constant_value: Shade.memoize_on_field("_constant_value", function() {
                    return constant_evaluator(this);
                })
            });
        };
    } else {
        return function() {
            var type, canon_args = [];
            for (var i=0; i<arguments.length; ++i) {
                canon_args.push(Shade.make(arguments[i]));
            }
            try {
                type = resolver.apply(this, canon_args);
            } catch (err) {
                throw "type error on " + name + ": " + err;
            }
            return Shade._create_concrete_value_exp( {
                parents: canon_args,
                expression_type: "builtin_function{" + name + "}",
                type: type,
                value: function() {
                    return [name, "(",
                            this.parents.map(function(t) { 
                                return t.eval(); 
                            }).join(", "),
                            ")"].join(" ");
                },
                is_constant: function() { return false; }
            });
        };
    }
};

function common_fun_1op(fun_name, constant_evaluator) {
    return builtin_glsl_function(fun_name, [
        [Shade.Types.float_t, Shade.Types.float_t],
        [Shade.Types.vec2, Shade.Types.vec2],
        [Shade.Types.vec3, Shade.Types.vec3],
        [Shade.Types.vec4, Shade.Types.vec4]
    ], constant_evaluator);
}

function common_fun_2op(fun_name, constant_evaluator) {
    return builtin_glsl_function(fun_name, [
        [Shade.Types.float_t, Shade.Types.float_t, Shade.Types.float_t],
        [Shade.Types.vec2, Shade.Types.vec2, Shade.Types.vec2],
        [Shade.Types.vec3, Shade.Types.vec3, Shade.Types.vec3],
        [Shade.Types.vec4, Shade.Types.vec4, Shade.Types.vec4]
    ], constant_evaluator);
}

// angle and trig, some common, some exponential,
var funcs_1op = {
    "radians": function(v) { return v * Math.PI / 180; },
    "degrees": function(v) { return v / Math.PI * 180; }, 
    "sin": Math.sin,
    "cos": Math.cos, 
    "tan": Math.tan, 
    "asin": Math.asin, 
    "acos": Math.acos, 
    "abs": Math.abs,
    "sign": function(v) { if (v < 0) return -1;
                          if (v === 0) return 0;
                          return 1;
                        }, 
    "floor": Math.floor,
    "ceil": Math.ceil,
    "fract": function(v) { return v - Math.floor(v); },
    "exp": Math.exp, 
    "log": Math.log, 
    "exp2": function(v) { return Math.exp(v * Math.log(v, 2));},
    "log2": function(v) { return Math.log(v) / Math.log(2); },
    "sqrt": Math.sqrt,
    "inversesqrt": function(v) { return 1 / Math.sqrt(v); }
};

_.each(funcs_1op, function (constant_evaluator_1, fun_name) {
    function constant_evaluator(exp) {
        if (exp.type.equals(Shade.Types.float_t))
            return constant_evaluator_1(exp.parents[0].constant_value());
        else {
            var c = exp.parents[0].constant_value();
            return vec.map(c, constant_evaluator_1);
        }
    };
    Shade[fun_name] = common_fun_1op(fun_name, constant_evaluator);
    Shade.Exp[fun_name] = function(fun) {
        return function() {
            return fun(this);
        };
    }(Shade[fun_name]);
});

function atan1_constant_evaluator(exp)
{
    var v1 = exp.parents[0].constant_value();
    if (exp.type.equals(Shade.Types.float_t))
        return Math.atan(v1);
    else {
        return vec.map(c, Math.atan);
    }
}

function common_fun_2op_constant_evaluator(fun)
{
    return function(exp){
        var v1 = exp.parents[0].constant_value();
        var v2 = exp.parents[1].constant_value();
        if (exp.type.equals(Shade.Types.float_t))
            return fun(v1, v2);
        else {
            var result = [];
            for (var i=0; i<v1.length; ++i) {
                result.push(fun(v1[i], v2[i]));
            }
            return vec.make(result);
        }
    };
}

function atan()
{
    if (arguments.length == 1) {
        return common_fun_1op("atan", atan1_constant_evaluator)(arguments[0]);
    } else if (arguments.length == 2) {
        var c = common_fun_2op_constant_evaluator(Math.atan2);
        return common_fun_2op("atan", c)(arguments[0], arguments[1]);
    } else {
        throw "atan expects 1 or 2 parameters, got " + arguments.length
        + " instead.";
    }
}

Shade.atan = atan;
Shade.Exp.atan = function() { return Shade.atan(this); };
Shade.pow = common_fun_2op("pow", common_fun_2op_constant_evaluator(Math.pow));
Shade.Exp.pow = function(other) { return Shade.pow(this, other); };

function mod_min_max_constant_evaluator(op) {
    return function(exp) {
        var values = _.map(exp.parents, function (p) {
            return p.constant_value();
        });
        if (exp.parents[0].type.equals(Shade.Types.float_t))
            return op.apply(op, values);
        else if (exp.parents[0].type.equals(Shade.Types.int_t))
            return op.apply(op, values);
        else if (exp.parents[0].type.equals(exp.parents[1].type)) {
            return vec.make(zipWith(op, values[0], values[1]));
        } else {
            return vec.map(values[0], function(v) {
                return op(v, values[1]);
            });
        }
    };
}

_.each({
    "mod": function(a,b) { return a % b; },
    "min": Math.min,
    "max": Math.max
}, function(op, k) {
    Shade[k] = builtin_glsl_function(k, [
        [Shade.Types.int_t,    Shade.Types.int_t,   Shade.Types.int_t],
        [Shade.Types.float_t,  Shade.Types.float_t, Shade.Types.float_t],
        [Shade.Types.vec2,     Shade.Types.vec2,    Shade.Types.vec2],
        [Shade.Types.vec3,     Shade.Types.vec3,    Shade.Types.vec3],
        [Shade.Types.vec4,     Shade.Types.vec4,    Shade.Types.vec4],
        [Shade.Types.float_t,  Shade.Types.float_t, Shade.Types.float_t],
        [Shade.Types.vec2,     Shade.Types.float_t, Shade.Types.vec2],
        [Shade.Types.vec3,     Shade.Types.float_t, Shade.Types.vec3],
        [Shade.Types.vec4,     Shade.Types.float_t, Shade.Types.vec4]
    ], mod_min_max_constant_evaluator(op));
});

function clamp_constant_evaluator(exp)
{
    function clamp(v, mn, mx) {
        return Math.max(mn, Math.min(mx, v));
    }

    var e1 = exp.parents[0];
    var e2 = exp.parents[1];
    var e3 = exp.parents[2];
    var v1 = e1.constant_value();
    var v2 = e2.constant_value();
    var v3 = e3.constant_value();

    if (e1.type.equals(Shade.Types.float_t)) {
        return clamp(v1, v2, v3);
    } else if (e1.type.equals(e2.type)) {
        return vec.make(zipWith3(clamp, v1, v2, v3));
    } else {
        return vec.map(v1, function(v) {
            return clamp(v, v2, v3);
        });
    }
};
var clamp = builtin_glsl_function("clamp", [
    [Shade.Types.float_t, Shade.Types.float_t, Shade.Types.float_t, Shade.Types.float_t],
    [Shade.Types.vec2,    Shade.Types.vec2,    Shade.Types.vec2,    Shade.Types.vec2],
    [Shade.Types.vec3,    Shade.Types.vec3,    Shade.Types.vec3,    Shade.Types.vec3],
    [Shade.Types.vec4,    Shade.Types.vec4,    Shade.Types.vec4,    Shade.Types.vec4],
    [Shade.Types.vec2,    Shade.Types.float_t, Shade.Types.float_t, Shade.Types.vec2],
    [Shade.Types.vec3,    Shade.Types.float_t, Shade.Types.float_t, Shade.Types.vec3],
    [Shade.Types.vec4,    Shade.Types.float_t, Shade.Types.float_t, Shade.Types.vec4]], 
                                  clamp_constant_evaluator);

Shade.clamp = clamp;

function mix_constant_evaluator(exp)
{
    function mix(left, right, u) {
        return (1-u) * left + u * right;
    }
    var e1 = exp.parents[0];
    var e2 = exp.parents[1];
    var e3 = exp.parents[2];
    var v1 = e1.constant_value();
    var v2 = e2.constant_value();
    var v3 = e3.constant_value();
    if (e1.type.equals(Shade.Types.float_t)) {
        return mix(v1, v2, v3);
    } else if (e2.type.equals(e3.type)) {
        return vec.make(zipWith3(mix, v1, v2, v3));
    } else {
        return vec.make(zipWith(function(v1, v2) {
            return mix(v1, v2, v3);
        }, v1, v2));
    }
}

var mix = builtin_glsl_function("mix", [
    [Shade.Types.float_t, Shade.Types.float_t, Shade.Types.float_t, Shade.Types.float_t],
    [Shade.Types.vec2,    Shade.Types.vec2,    Shade.Types.vec2,    Shade.Types.vec2],
    [Shade.Types.vec3,    Shade.Types.vec3,    Shade.Types.vec3,    Shade.Types.vec3],
    [Shade.Types.vec4,    Shade.Types.vec4,    Shade.Types.vec4,    Shade.Types.vec4],
    [Shade.Types.vec2,    Shade.Types.vec2,    Shade.Types.float_t, Shade.Types.vec2],
    [Shade.Types.vec3,    Shade.Types.vec3,    Shade.Types.float_t, Shade.Types.vec3],
    [Shade.Types.vec4,    Shade.Types.vec4,    Shade.Types.float_t, Shade.Types.vec4]],
                               mix_constant_evaluator);
Shade.mix = mix;

var step = builtin_glsl_function("step", [
    [Shade.Types.float_t, Shade.Types.float_t, Shade.Types.float_t],
    [Shade.Types.vec2,    Shade.Types.vec2,    Shade.Types.vec2],
    [Shade.Types.vec3,    Shade.Types.vec3,    Shade.Types.vec3],
    [Shade.Types.vec4,    Shade.Types.vec4,    Shade.Types.vec4],
    [Shade.Types.float_t, Shade.Types.vec2,    Shade.Types.vec2],
    [Shade.Types.float_t, Shade.Types.vec3,    Shade.Types.vec3],
    [Shade.Types.float_t, Shade.Types.vec4,    Shade.Types.vec4]], function(exp) {
        function step(edge, x) {
            if (x < edge) return 0.0; else return 1.0;
        }
        var e1 = exp.parents[0];
        var e2 = exp.parents[1];
        var v1 = e1.constant_value();
        var v2 = e2.constant_value();
        if (e2.type.equals(Shade.Types.float_t)) {
            return step(v1, v2);
        } if (e1.type.equals(e2.type)) {
            return vec.make(zipWith(step, v1, v2));
        } else {
            return vec.map(v2, function(v) { 
                return step(v1, v);
            });
        }
    });
Shade.step = step;

var smoothstep = builtin_glsl_function
    ("smoothstep", [
        [Shade.Types.float_t, Shade.Types.float_t, Shade.Types.float_t, Shade.Types.float_t],
        [Shade.Types.vec2,    Shade.Types.vec2,    Shade.Types.vec2,    Shade.Types.vec2],
        [Shade.Types.vec3,    Shade.Types.vec3,    Shade.Types.vec3,    Shade.Types.vec3],
        [Shade.Types.vec4,    Shade.Types.vec4,    Shade.Types.vec4,    Shade.Types.vec4],
        [Shade.Types.float_t, Shade.Types.float_t, Shade.Types.vec2,    Shade.Types.vec2],
        [Shade.Types.float_t, Shade.Types.float_t, Shade.Types.vec3,    Shade.Types.vec3],
        [Shade.Types.float_t, Shade.Types.float_t, Shade.Types.vec4,    Shade.Types.vec4]
    ], function(exp) {
        var edge0 = exp.parents[0];
        var edge1 = exp.parents[1];
        var x = exp.parents[2];
        var t = Shade.clamp(x.sub(edge0).div(edge1.sub(edge0)), 0, 1);
        return t.mul(t).mul(Shade.sub(3, t.mul(2))).constant_value();
    });
Shade.smoothstep = smoothstep;

var length = builtin_glsl_function(
    "length", 
    [
        [Shade.Types.float_t, Shade.Types.float_t],
        [Shade.Types.vec2,    Shade.Types.float_t],
        [Shade.Types.vec3,    Shade.Types.float_t],
        [Shade.Types.vec4,    Shade.Types.float_t]
    ], function(exp) {
        var v = exp.parents[0].constant_value();
        if (exp.parents[0].type.equals(Shade.Types.float_t))
            return v * v;
        else
            return vec.length(v);
    });
Shade.length = length;

var distance = builtin_glsl_function(
    "distance", 
    [
        [Shade.Types.float_t, Shade.Types.float_t, Shade.Types.float_t],
        [Shade.Types.vec2,    Shade.Types.vec2,    Shade.Types.float_t],
        [Shade.Types.vec3,    Shade.Types.vec3,    Shade.Types.float_t],
        [Shade.Types.vec4,    Shade.Types.vec4,    Shade.Types.float_t]
    ], function(exp) {
        return exp.parents[0].sub(exp.parents[1]).length().constant_value();
    });
Shade.distance = distance;

var dot = builtin_glsl_function(
    "dot", 
    [
        [Shade.Types.float_t, Shade.Types.float_t, Shade.Types.float_t],
        [Shade.Types.vec2,    Shade.Types.vec2,    Shade.Types.float_t],
        [Shade.Types.vec3,    Shade.Types.vec3,    Shade.Types.float_t],
        [Shade.Types.vec4,    Shade.Types.vec4,    Shade.Types.float_t]
    ],
    function (exp) {
        var v1 = exp.parents[0].constant_value(),
            v2 = exp.parents[1].constant_value();
        if (exp.parents[0].type.equals(Shade.Types.float_t)) {
            return v1 * v2;
        } else {
            return vec.dot(v1, v2);
        }
    });
Shade.dot = dot;

var cross = builtin_glsl_function(
    "cross", 
    [
        [Shade.Types.vec3, Shade.Types.vec3, Shade.Types.vec3]
    ], function(exp) {
        return vec3.cross(exp.parents[0].constant_value(),
                          exp.parents[1].constant_value());
    });
Shade.cross = cross;

var normalize = builtin_glsl_function(
    "normalize", 
    [
        [Shade.Types.float_t, Shade.Types.float_t],
        [Shade.Types.vec2, Shade.Types.vec2],
        [Shade.Types.vec3, Shade.Types.vec3],
        [Shade.Types.vec4, Shade.Types.vec4]
    ], function(exp) {
        return exp.parents[0].div(exp.parents[0].length()).constant_value();
    });
Shade.normalize = normalize;

var faceforward = builtin_glsl_function(
    "faceforward", 
    [
        [Shade.Types.float_t, Shade.Types.float_t, Shade.Types.float_t, Shade.Types.float_t],
        [Shade.Types.vec2, Shade.Types.vec2, Shade.Types.vec2, Shade.Types.vec2],
        [Shade.Types.vec3, Shade.Types.vec3, Shade.Types.vec3, Shade.Types.vec3],
        [Shade.Types.vec4, Shade.Types.vec4, Shade.Types.vec4, Shade.Types.vec4]
    ], function(exp) {
        var N = exp.parents[0];
        var I = exp.parents[1];
        var Nref = exp.parents[2];
        if (Nref.dot(I).constant_value() < 0)
            return N.constant_value();
        else
            return Shade.sub(0, N).constant_value();
    });
Shade.faceforward = faceforward;

var reflect = builtin_glsl_function(
    "reflect", 
    [
        [Shade.Types.float_t, Shade.Types.float_t, Shade.Types.float_t],
        [Shade.Types.vec2, Shade.Types.vec2, Shade.Types.vec2],
        [Shade.Types.vec3, Shade.Types.vec3, Shade.Types.vec3],
        [Shade.Types.vec4, Shade.Types.vec4, Shade.Types.vec4]
    ], function(exp) {
        var I = exp.parents[0];
        var N = exp.parents[1];
        return I.sub(Shade.mul(2, N.dot(I), N)).constant_value();
    });
Shade.reflect = reflect;

var refract = builtin_glsl_function(
    "refract", 
    [
        [Shade.Types.float_t, Shade.Types.float_t, Shade.Types.float_t, Shade.Types.float_t],
        [Shade.Types.vec2, Shade.Types.vec2, Shade.Types.float_t, Shade.Types.vec2],
        [Shade.Types.vec3, Shade.Types.vec3, Shade.Types.float_t, Shade.Types.vec3],
        [Shade.Types.vec4, Shade.Types.vec4, Shade.Types.float_t, Shade.Types.vec4]
    ], function(exp) {
        var I = exp.parents[0];
        var N = exp.parents[1];
        var eta = exp.parents[2];
        
        var k = Shade.sub(1.0, Shade.mul(eta, eta, Shade.sub(1.0, N.dot(I).mul(N.dot(I)))));
        if (k.constant_value() < 0.0) {
            return Vector.Zero(I.type.array_size());
        } else {
            return eta.mul(I).sub(eta.mul(N.dot(I)).add(k.sqrt()).mul(N)).constant_value();
        }
    });
Shade.refract = refract;

var texture2D = builtin_glsl_function("texture2D", [
    [Shade.Types.sampler2D, Shade.Types.vec2, Shade.Types.vec4]
]);
Shade.texture2D = texture2D;

Shade.equal = builtin_glsl_function(
    "equal", [
        [Shade.Types.vec2, Shade.Types.vec2, Shade.Types.bool_t],
        [Shade.Types.vec3, Shade.Types.vec3, Shade.Types.bool_t],
        [Shade.Types.vec4, Shade.Types.vec4, Shade.Types.bool_t],
        [Shade.Types.ivec2, Shade.Types.ivec2, Shade.Types.bool_t],
        [Shade.Types.ivec3, Shade.Types.ivec3, Shade.Types.bool_t],
        [Shade.Types.ivec4, Shade.Types.ivec4, Shade.Types.bool_t],
        [Shade.Types.bvec2, Shade.Types.bvec2, Shade.Types.bool_t],
        [Shade.Types.bvec3, Shade.Types.bvec3, Shade.Types.bool_t],
        [Shade.Types.bvec4, Shade.Types.bvec4, Shade.Types.bool_t]
    ], function(exp) {
        var left = exp.parents[0].constant_value();
        var right = exp.parents[1].constant_value();
        return (_.all(zipWith(function (x, y) { return x === y; }),
                      left, right));
    });
Shade.Exp.equal = function(other) { return Shade.equal(this, other); };

Shade.notEqual = builtin_glsl_function(
    "notEqual", [
        [Shade.Types.vec2, Shade.Types.vec2, Shade.Types.bool_t],
        [Shade.Types.vec3, Shade.Types.vec3, Shade.Types.bool_t],
        [Shade.Types.vec4, Shade.Types.vec4, Shade.Types.bool_t],
        [Shade.Types.ivec2, Shade.Types.ivec2, Shade.Types.bool_t],
        [Shade.Types.ivec3, Shade.Types.ivec3, Shade.Types.bool_t],
        [Shade.Types.ivec4, Shade.Types.ivec4, Shade.Types.bool_t],
        [Shade.Types.bvec2, Shade.Types.bvec2, Shade.Types.bool_t],
        [Shade.Types.bvec3, Shade.Types.bvec3, Shade.Types.bool_t],
        [Shade.Types.bvec4, Shade.Types.bvec4, Shade.Types.bool_t]
    ], function(exp) {
        var left = exp.parents[0].constant_value();
        var right = exp.parents[1].constant_value();
        return !(_.all(zipWith(function (x, y) { return x === y; }),
                       left, right));
    });
Shade.Exp.notEqual = function(other) { return Shade.notEqual(this, other); };

Shade.lessThan = builtin_glsl_function(
    "lessThan", [
        [Shade.Types.vec2, Shade.Types.vec2, Shade.Types.bvec2],
        [Shade.Types.vec3, Shade.Types.vec3, Shade.Types.bvec3],
        [Shade.Types.vec4, Shade.Types.vec4, Shade.Types.bvec4],
        [Shade.Types.ivec2, Shade.Types.ivec2, Shade.Types.bvec2],
        [Shade.Types.ivec3, Shade.Types.ivec3, Shade.Types.bvec3],
        [Shade.Types.ivec4, Shade.Types.ivec4, Shade.Types.bvec4]
    ], function(exp) {
        var left = exp.parents[0].constant_value();
        var right = exp.parents[1].constant_value();
        return _.map(left, function(x, i) { return x < right[i]; });
    });
Shade.Exp.lessThan = function(other) { return Shade.lessThan(this, other); };

Shade.lessThanEqual = builtin_glsl_function(
    "lessThanEqual", [
        [Shade.Types.vec2, Shade.Types.vec2, Shade.Types.bvec2],
        [Shade.Types.vec3, Shade.Types.vec3, Shade.Types.bvec3],
        [Shade.Types.vec4, Shade.Types.vec4, Shade.Types.bvec4],
        [Shade.Types.ivec2, Shade.Types.ivec2, Shade.Types.bvec2],
        [Shade.Types.ivec3, Shade.Types.ivec3, Shade.Types.bvec3],
        [Shade.Types.ivec4, Shade.Types.ivec4, Shade.Types.bvec4]
    ], function(exp) {
        var left = exp.parents[0].constant_value();
        var right = exp.parents[1].constant_value();
        return _.map(left, function(x, i) { return x <= right[i]; });
    });
Shade.Exp.lessThanEqual = function(other) { 
    return Shade.lessThanEqual(this, other); 
};

Shade.greaterThan = builtin_glsl_function(
    "greaterThan", [
        [Shade.Types.vec2, Shade.Types.vec2, Shade.Types.bvec2],
        [Shade.Types.vec3, Shade.Types.vec3, Shade.Types.bvec3],
        [Shade.Types.vec4, Shade.Types.vec4, Shade.Types.bvec4],
        [Shade.Types.ivec2, Shade.Types.ivec2, Shade.Types.bvec2],
        [Shade.Types.ivec3, Shade.Types.ivec3, Shade.Types.bvec3],
        [Shade.Types.ivec4, Shade.Types.ivec4, Shade.Types.bvec4]
    ], function(exp) {
        var left = exp.parents[0].constant_value();
        var right = exp.parents[1].constant_value();
        return _.map(left, function(x, i) { return x > right[i]; });
    });
Shade.Exp.greaterThan = function(other) {
    return Shade.greaterThan(this, other);
};

Shade.greaterThanEqual = builtin_glsl_function(
    "greaterThanEqual", [
        [Shade.Types.vec2, Shade.Types.vec2, Shade.Types.bvec2],
        [Shade.Types.vec3, Shade.Types.vec3, Shade.Types.bvec3],
        [Shade.Types.vec4, Shade.Types.vec4, Shade.Types.bvec4],
        [Shade.Types.ivec2, Shade.Types.ivec2, Shade.Types.bvec2],
        [Shade.Types.ivec3, Shade.Types.ivec3, Shade.Types.bvec3],
        [Shade.Types.ivec4, Shade.Types.ivec4, Shade.Types.bvec4]
    ], function(exp) {
        var left = exp.parents[0].constant_value();
        var right = exp.parents[1].constant_value();
        return _.map(left, function(x, i) { return x >= right[i]; });
    });
Shade.Exp.greaterThanEqual = function(other) {
    return Shade.greaterThanEqual(this, other);
};

Shade.all = builtin_glsl_function(
    "all", [
        [Shade.Types.bvec2, Shade.Types.bool_t],
        [Shade.Types.bvec3, Shade.Types.bool_t],
        [Shade.Types.bvec4, Shade.Types.bool_t]
    ], function(exp) {
        var v = exp.parents[0].constant_value();
        return _.all(v, function(x) { return x; });
    });
Shade.Exp.all = function() { return Shade.all(this); };

Shade.any = builtin_glsl_function(
    "any", [
        [Shade.Types.bvec2, Shade.Types.bool_t],
        [Shade.Types.bvec3, Shade.Types.bool_t],
        [Shade.Types.bvec4, Shade.Types.bool_t]
    ], function(exp) {
        var v = exp.parents[0].constant_value();
        return _.any(v, function(x) { return x; });
    });
Shade.Exp.any = function() { return Shade.any(this); };

Shade.matrixCompMult = builtin_glsl_function(
    "matrixCompMult", [
        [Shade.Types.mat2, Shade.Types.mat2, Shade.Types.mat2],
        [Shade.Types.mat3, Shade.Types.mat3, Shade.Types.mat3],
        [Shade.Types.mat4, Shade.Types.mat4, Shade.Types.mat4]
    ], function(exp) {
        var v1 = exp.parents[0].constant_value();
        var v2 = exp.parents[1].constant_value();
        return mat.map(v1, function(x, i) { return x * v2[i]; });
    }
);
Shade.Exp.matrixCompMult = function(other) {
    return Shade.matrixCompMult(this, other);
};

})();
Shade.seq = function(parents)
{
    if (parents.length == 1) {
        return parents[0];
    }
    return Shade._create_concrete_exp({
        expression_name: "seq",
        parents: parents,
        eval: function(glsl_name) {
            return this.parents.map(function (n) { return n.eval(); }).join("; ");
        },
        type: Shade.basic('void'),
        compile: function (ctx) {}
    });
};
Shade.Optimizer = {};

Shade.Optimizer._debug_passes = false;

Shade.Optimizer.transform_expression = function(operations)
{
    return function(v) {
        var old_v;
        for (var i=0; i<operations.length; ++i) {
            if (Shade.debug && Shade.Optimizer._debug_passes) {
                old_v = v;
            }
            var test = operations[i][0];
            var fun = operations[i][1];
            var old_guid = v.guid;
            if (operations[i][3]) {
                var this_old_guid;
                do {
                    this_old_guid = v.guid;
                    v = v.replace_if(test, fun);
                } while (v.guid !== this_old_guid);
            } else {
                v = v.replace_if(test, fun);
            }
            var new_guid = v.guid;
            if (Shade.debug && Shade.Optimizer._debug_passes &&
                old_guid != new_guid) {
                console.log("Pass",operations[i][2],"succeeded");
                console.log("Before: ");
                old_v.debug_print();
                console.log("After: ");
                v.debug_print();
            }
        }
        return v;
    };
};

Shade.Optimizer.is_constant = function(exp)
{
    return exp.is_constant();
};

Shade.Optimizer.replace_with_constant = function(exp)
{
    var v = exp.constant_value();
    var result = Shade.constant(v, exp.type);
    return result;
};

Shade.Optimizer.is_zero = function(exp)
{
    if (!exp.is_constant())
        return false;
    var v = exp.constant_value();
    var t = constant_type(v);
    if (t === 'number')
        return v === 0;
    if (t === 'vector')
        return _.all(v, function (x) { return x === 0; });
    if (typeof(v) === 'matrix')
        return _.all(v, function (x) { return x === 0; });
    return false;
};

Shade.Optimizer.is_mul_identity = function(exp)
{
    if (!exp.is_constant())
        return false;
    var v = exp.constant_value();
    var t = constant_type(v);
    if (t === 'number')
        return v === 1;
    if (t === 'vector') {
        switch (v.length) {
        case 2: return vec.equal(v, vec.make([1,1]));
        case 3: return vec.equal(v, vec.make([1,1,1]));
        case 4: return vec.equal(v, vec.make([1,1,1,1]));
        default:
            throw "Bad vec length: " + v.length;    
        }
    }
    if (t === 'matrix')
        return mat.equal(v, mat[Math.sqrt(v.length)].identity());
    return false;
};

Shade.Optimizer.is_times_zero = function(exp)
{
    return exp.expression_type === 'operator*' &&
        (Shade.Optimizer.is_zero(exp.parents[0]) ||
         Shade.Optimizer.is_zero(exp.parents[1]));
};

Shade.Optimizer.is_plus_zero = function(exp)
{
    return exp.expression_type === 'operator+' &&
        (Shade.Optimizer.is_zero(exp.parents[0]) ||
         Shade.Optimizer.is_zero(exp.parents[1]));
};

Shade.Optimizer.replace_with_nonzero = function(exp)
{
    if (Shade.Optimizer.is_zero(exp.parents[0]))
        return exp.parents[1];
    if (Shade.Optimizer.is_zero(exp.parents[1]))
        return exp.parents[0];
    throw "no zero value on input to replace_with_nonzero?!";
};


Shade.Optimizer.is_times_one = function(exp)
{
    if (exp.expression_type !== 'operator*')
        return false;
    var t1 = exp.parents[0].type, t2 = exp.parents[1].type;
    var ft = Shade.Types.float_t;
    if (t1.equals(t2)) {
        return (Shade.Optimizer.is_mul_identity(exp.parents[0]) ||
                Shade.Optimizer.is_mul_identity(exp.parents[1]));
    } else if (!t1.equals(ft) && t2.equals(ft)) {
        return Shade.Optimizer.is_mul_identity(exp.parents[1]);
    } else if (t1.equals(ft) && !t2.equals(ft)) {
        return Shade.Optimizer.is_mul_identity(exp.parents[0]);
    } else if (t1.is_vec() && t2.is_mat()) {
        return Shade.Optimizer.is_mul_identity(exp.parents[1]);
    } else if (t1.is_mat() && t2.is_vec()) {
        return Shade.Optimizer.is_mul_identity(exp.parents[0]);
    } else {
        throw "Internal error, never should have gotten here";
    }
};

Shade.Optimizer.replace_with_notone = function(exp)
{
    var t1 = exp.parents[0].type, t2 = exp.parents[1].type;
    var ft = Shade.Types.float_t;
    if (t1.equals(t2)) {
        if (Shade.Optimizer.is_mul_identity(exp.parents[0])) {
            return exp.parents[1];
        } else if (Shade.Optimizer.is_mul_identity(exp.parents[1])) {
            return exp.parents[0];
        } else {
            throw "Intenal error, never should have gotten here";
        }
    } else if (!t1.equals(ft) && t2.equals(ft)) {
        return exp.parents[0];
    } else if (t1.equals(ft) && !t2.equals(ft)) {
        return exp.parents[1];
    }
    throw "no is_mul_identity value on input to replace_with_notone?!";
};

Shade.Optimizer.replace_with_zero = function(x)
{
    if (x.type.equals(Shade.Types.float_t))
        return Shade.constant(0);
    if (x.type.equals(Shade.Types.int_t))
        return Shade.as_int(0);
    if (x.type.equals(Shade.Types.vec2))
        return Shade.constant(vec2.create());
    if (x.type.equals(Shade.Types.vec3))
        return Shade.constant(vec3.create());
    if (x.type.equals(Shade.Types.vec4))
        return Shade.constant(vec4.create());
    if (x.type.equals(Shade.Types.mat2))
        return Shade.constant(mat2.create());
    if (x.type.equals(Shade.Types.mat3))
        return Shade.constant(mat3.create());
    if (x.type.equals(Shade.Types.mat4))
        return Shade.constant(mat4.create());
    throw "not a type replaceable with zero!?";
};

Shade.Optimizer.vec_at_constant_index = function(exp)
{
    if (exp.expression_type !== "index")
        return false;
    if (!exp.parents[1].is_constant())
        return false;
    var v = exp.parents[1].constant_value();
    if (typeOf(v) !== "number")
        return false;
    var t = exp.parents[0].type;
    if (t.equals(Shade.Types.vec2) && (v >= 0) && (v <= 1))
        return true;
    if (t.equals(Shade.Types.vec3) && (v >= 0) && (v <= 2))
        return true;
    if (t.equals(Shade.Types.vec4) && (v >= 0) && (v <= 3))
        return true;
    return false;
};

Shade.Optimizer.replace_vec_at_constant_with_swizzle = function(exp)
{
    var v = exp.parents[1].constant_value();
    if (v == 0) return exp.parents[0].swizzle("x");
    if (v == 1) return exp.parents[0].swizzle("y");
    if (v == 2) return exp.parents[0].swizzle("z");
    if (v == 3) return exp.parents[0].swizzle("w");
    throw "Internal error, shouldn't get here";
};

Shade.Optimizer.is_logical_and_with_constant = function(exp)
{
    return (exp.expression_type === "operator&&" &&
            exp.parents[0].is_constant());
};

Shade.Optimizer.replace_logical_and_with_constant = function(exp)
{
    if (exp.parents[0].constant_value()) {
        return exp.parents[1];
    } else {
        return Shade.make(false);
    }
};

Shade.Optimizer.is_logical_or_with_constant = function(exp)
{
    return (exp.expression_type === "operator||" &&
            exp.parents[0].is_constant());
};

Shade.Optimizer.replace_logical_or_with_constant = function(exp)
{
    if (exp.parents[0].constant_value()) {
        return Shade.make(true);
    } else {
        return exp.parents[1];
    }
};

Shade.Optimizer.is_never_discarding = function(exp)
{
    return (exp.expression_type === "discard_if" &&
            exp.parents[0].is_constant() &&
            !exp.parents[0].constant_value());
};

Shade.Optimizer.remove_discard = function(exp)
{
    return exp.parents[1];
};

Shade.Optimizer.is_known_branch = function(exp)
{
    var result = (exp.expression_type === "selection" &&
                  exp.parents[0].is_constant());
    return result;
};

Shade.Optimizer.prune_selection_branch = function(exp)
{
    if (exp.parents[0].constant_value()) {
        return exp.parents[1];
    } else {
        return exp.parents[2];
    }
};

// We provide saner names for program targets so users don't
// need to memorize gl_FragColor, gl_Position and gl_PointSize.
//
// However, these names should still work, in case the users
// want to have GLSL-familiar names.
Shade.canonicalize_program_object = function(program_obj)
{
    var result = {};
    var canonicalization_map = {
        'color': 'gl_FragColor',
        'position': 'gl_Position',
        'point_size': 'gl_PointSize'
    };

    _.each(program_obj, function(v, k) {
        var transposed_key = (k in canonicalization_map) ?
            canonicalization_map[k] : k;
        result[transposed_key] = v;
    });
    return result;
};

Shade.program = function(program_obj)
{
    program_obj = Shade.canonicalize_program_object(program_obj);
    var vp_obj = {}, fp_obj = {};

    _.each(program_obj, function(v, k) {
        v = Shade.make(v);
        if (k === 'gl_FragColor') {
            if (!v.type.equals(Shade.Types.vec4)) {
                throw "Shade.program: color attribute must be of type vec4, got " +
                    v.type.repr() + " instead.";
            }
            fp_obj['gl_FragColor'] = v;
        } else if (k === 'gl_Position') {
            if (!v.type.equals(Shade.Types.vec4)) {
                throw "Shade.program: position attribute must be of type vec4, got " +
                    v.type.repr() + " instead.";
            }
            vp_obj['gl_Position'] = v;
        } else if (k === 'gl_PointSize') {
            if (!v.type.equals(Shade.Types.float_t)) {
                throw "Shade.program: color attribute must be of type float, got " +
                    v.type.repr() + " instead.";
            }
            vp_obj['gl_PointSize'] = v;
        } else if (k.substr(0, 3) === 'gl_') {
            // FIXME: Can we sensibly work around these?
            throw "gl_* are reserved GLSL names, sorry; you can't use them in Facet.";
        } else
            vp_obj[k] = v;
    });

    var vp_compile = Shade.CompilationContext(Shade.VERTEX_PROGRAM_COMPILE),
        fp_compile = Shade.CompilationContext(Shade.FRAGMENT_PROGRAM_COMPILE);

    var vp_exprs = [], fp_exprs = [];

    function is_attribute(x) {
        return x.expression_type === 'attribute';
    }
    function is_varying(x) {
        return x.expression_type === 'varying';
    }
    function is_per_vertex(x) {
        return x.stage === 'vertex';
    }
    var varying_names = [];
    function hoist_to_varying(exp) {
        var varying_name = Shade.unique_name();
        vp_obj[varying_name] = exp;
        varying_names.push(varying_name);
        return Shade.varying(varying_name, exp.type);
    };

    // explicit per-vertex hoisting must happen before is_attribute hoisting,
    // otherwise we might end up reading from a varying in the vertex program,
    // which is undefined behavior

    var common_sequence = [
        [Shade.Optimizer.is_times_zero, Shade.Optimizer.replace_with_zero, 
         "v * 0", true],
        [Shade.Optimizer.is_times_one, Shade.Optimizer.replace_with_notone, 
         "v * 1", true],
        [Shade.Optimizer.is_plus_zero, Shade.Optimizer.replace_with_nonzero,
         "v + 0", true],
        [Shade.Optimizer.is_never_discarding,
         Shade.Optimizer.remove_discard, "discard_if(false)"],
        [Shade.Optimizer.is_known_branch,
         Shade.Optimizer.prune_selection_branch, "constant?a:b", true],
        [Shade.Optimizer.vec_at_constant_index, 
         Shade.Optimizer.replace_vec_at_constant_with_swizzle, "vec[constant_ix]"],
        [Shade.Optimizer.is_constant,
         Shade.Optimizer.replace_with_constant, "constant folding"],
        [Shade.Optimizer.is_logical_or_with_constant,
         Shade.Optimizer.replace_logical_or_with_constant, "constant||v", true],
        [Shade.Optimizer.is_logical_and_with_constant,
         Shade.Optimizer.replace_logical_and_with_constant, "constant&&v", true]];

    var fp_sequence = [
        [is_per_vertex, hoist_to_varying, "per-vertex hoisting"],
        [is_attribute, hoist_to_varying, "attribute hoisting"]  
    ];
    fp_sequence.push.apply(fp_sequence, common_sequence);
    var vp_sequence = common_sequence;
    var fp_optimize = Shade.Optimizer.transform_expression(fp_sequence);
    var vp_optimize = Shade.Optimizer.transform_expression(vp_sequence);

    var used_varying_names = [];
    _.each(fp_obj, function(v, k) {
        v = fp_optimize(v);
        used_varying_names.push.apply(used_varying_names,
                                      _.map(v.find_if(is_varying),
                                            function (v) { 
                                                return v.eval();
                                            }));
        fp_exprs.push(Shade.set(v, k));
    });

    _.each(vp_obj, function(v, k) {
        if ((varying_names.indexOf(k) === -1) ||
            (used_varying_names.indexOf(k) !== -1))
            vp_exprs.push(Shade.set(vp_optimize(v), k));
    });

    var vp_exp = Shade.seq(vp_exprs);
    var fp_exp = Shade.seq(fp_exprs);

    vp_compile.compile(vp_exp);
    fp_compile.compile(fp_exp);
    var vp_source = vp_compile.source(),
        fp_source = fp_compile.source();
    if (Shade.debug) {
        if (Shade.debug && Shade.Optimizer._debug_passes) {
            console.log("Vertex program final AST:");
            vp_exp.debug_print();
        }
        console.log("Vertex program source:");
        console.log(vp_source);
        
        if (Shade.debug && Shade.Optimizer._debug_passes) {
            console.log("Fragment program final AST:");
            fp_exp.debug_print();
        }
        console.log("Fragment program source:");
        console.log(fp_source);
    }
    var result = Facet.program(vp_source, fp_source);
    result.attribute_buffers = vp_exp.attribute_buffers();
    result.uniforms = _.union(vp_exp.uniforms(), fp_exp.uniforms());
    return result;
};
Shade.is_program_parameter = function(key)
{
    return ["color", "position", "point_size",
            "gl_FragColor", "gl_Position", "gl_PointSize"].indexOf(key) != -1;
};
Shade.Utils = {};
// given a list of values, returns a function which, when given a
// value between 0 and 1, returns the appropriate linearly interpolated
// value.

// Hat function reconstruction

Shade.Utils.lerp = function(lst) {
    var new_lst = _.toArray(lst);
    new_lst.push(new_lst[new_lst.length-1]);
    // repeat last to make index calc easier
    return function(v) {
        var colors_exp = Shade.constant(new_lst);
        v = Shade.clamp(v, 0, 1).mul(new_lst.length-2);
        var u = v.fract();
        var ix = v.floor();
        return Shade.mix(colors_exp.at(ix),
                         colors_exp.at(ix.add(1)),
                         u);
    };
};
// given a list of values, returns a function which, when given a
// value between 0 and 1, returns the nearest value;

// box function reconstruction

Shade.Utils.choose = function(lst) {
    var new_lst = _.toArray(lst);
    return function(v) {
        var vals_exp = Shade.constant(new_lst);
        v = Shade.clamp(v, 0, new_lst.length-1).floor().as_int();
        return vals_exp.at(v);
    };
};
Shade.Utils.linear = function(f1, f2, t1, t2)
{
    var df = Shade.sub(f2, f1), dt = Shade.sub(t2, t1);
    return function(x) {
        return Shade.make(x).sub(f1).mul(dt.div(df)).add(t1);
    };
};
// returns a linear transformation of the coordinates such that the given list of values
// fits between [0, 1]

Shade.Utils.fit = function(data) {
    // FIXME this makes float attribute buffers work, but it's probably brittle
    var t = data._shade_type; 
    if (t === 'attribute_buffer')
        data = data.array;
    var min = _.min(data), max = _.max(data);
    return Shade.Utils.linear(min, max, 0, 1);
};

// replicates something like an opengl light. 
// Fairly bare-bones for now (only diffuse, no attenuation)
Shade.gl_light = function(opts)
{
    var light_pos = opts.light_position;
    var vertex_pos = opts.vertex;
    var material_color = opts.material_color;
    var light_ambient = opts.light_ambient || Shade.vec(0,0,0,1);
    var light_diffuse = opts.light_diffuse || Shade.vec(1,1,1,1);
    var per_vertex = opts.per_vertex || false;
    var N = opts.normal; // this must be appropriately transformed
    var L = light_pos.sub(vertex_pos).normalize();
    var v = Shade.max(L.dot(N), 0);
    if (per_vertex)
        v = Shade.per_vertex(v);

    return Shade.add(light_ambient.mul(material_color),
                     v.mul(light_diffuse).mul(material_color));
};
// replicates OpenGL's fog functionality

(function() {

var default_color = Shade.vec(0,0,0,0);

Shade.gl_fog = function(opts)
{
    opts = _.defaults(opts, { mode: "exp",
                              density: 1,
                              start: 0,
                              end: 1,
                              fog_color: default_color,
                              per_vertex: false
                            });
    var mode = opts.mode || "exp";
    var fog_color = Shade.make(opts.fog_color);
    var color = opts.color;
    var z = Shade.make(opts.z);
    var f;

    if (opts.mode === "exp") {
        var density = Shade.make(opts.density);
        var start = Shade.make(opts.start);
        f = z.sub(start).mul(density).exp();
    } else if (mode === "exp2") {
        var density = Shade.make(opts.density);
        var start = Shade.make(opts.start);
        f = z.sub(start).min(0).mul(density);
        f = f.mul(f);
        f = f.neg().exp();
    } else if (mode === "linear") {
        var start = Shade.make(opts.start);
        var end = Shade.make(opts.end);
        end = Shade.make(end);
        start = Shade.make(start);
        f = end.sub(z).div(end.sub(start));
    }
    f = f.clamp(0, 1);
    if (opts.per_vertex)
        f = f.per_vertex();
    return Shade.mix(fog_color, color, f);
};

})();
Shade.cosh = function(v)
{
    return Shade.exp(v).add(v.neg().exp()).div(2);
};
Shade.Exp.cosh = function() { return Shade.cosh(this); };
Shade.sinh = function(v)
{
    return Shade.exp(v).sub(v.neg().exp()).div(2);
};
Shade.Exp.sinh = function() { return Shade.sinh(this); };
(function() {

var logical_operator_binexp = function(exp1, exp2, operator_name, constant_evaluator,
                                       parent_is_unconditional)
{
    parent_is_unconditional = parent_is_unconditional ||
        function (i) { return true; };
    return Shade._create_concrete_value_exp({
        parents: [exp1, exp2],
        type: Shade.Types.bool_t,
        expression_type: "operator" + operator_name,
        value: function() {
            return "(" + this.parents[0].eval() + " " + operator_name + " " +
                this.parents[1].eval() + ")";
        },
        constant_value: Shade.memoize_on_field("_constant_value", function() {
            return constant_evaluator(this);
        }),
        parent_is_unconditional: parent_is_unconditional
    });
};

var lift_binfun_to_evaluator = function(binfun) {
    return function(exp) {
        var exp1 = exp.parents[0], exp2 = exp.parents[1];
        return binfun(exp1.constant_value(), exp2.constant_value());
    };
};

var logical_operator_exp = function(operator_name, binary_evaluator,
                                    parent_is_unconditional)
{
    return function() {
        if (arguments.length === 0) 
            throw ("operator " + operator_name 
                   + " requires at least 1 parameter");
        if (arguments.length === 1) return Shade.make(arguments[0]).as_bool();
        var first = Shade.make(arguments[0]);
        if (!first.type.equals(Shade.Types.bool_t))
            throw ("operator " + operator_name + 
                   " requires booleans, got argument 1 as " +
                   arguments[0].type.repr() + " instead.");
        var current_result = first;
        for (var i=1; i<arguments.length; ++i) {
            var next = Shade.make(arguments[i]);
            if (!next.type.equals(Shade.Types.bool_t))
                throw ("operator " + operator_name + 
                       " requires booleans, got argument " + (i+1) +
                       " as " + next.type.repr() + " instead.");
            current_result = logical_operator_binexp(
                current_result, next,
                operator_name, binary_evaluator,
                parent_is_unconditional);
        }
        return current_result;
    };
};

Shade.or = logical_operator_exp(
    "||", lift_binfun_to_evaluator(function(a, b) { return a || b; }),
    function(i) { return i == 0; }
);

Shade.Exp.or = function(other)
{
    return Shade.or(this, other);
};

Shade.and = logical_operator_exp(
    "&&", lift_binfun_to_evaluator(function(a, b) { return a && b; }),
    function(i) { return i == 0; }
);

Shade.Exp.and = function(other)
{
    return Shade.and(this, other);
};

Shade.xor = logical_operator_exp(
    "^^", lift_binfun_to_evaluator(function(a, b) { return ~~(a ^ b); }));
Shade.Exp.xor = function(other)
{
    return Shade.xor(this, other);
};

Shade.not = function(exp)
{
    exp = Shade.make(exp);
    if (!exp.type.equals(Shade.Types.bool_t)) {
        throw "logical_not requires bool expression";
    }
    return Shade._create_concrete_value_exp({
        parents: [exp],
        type: Shade.Types.bool_t,
        expression_type: "operator!",
        value: function() {
            return "(!" + this.parents[0].eval() + ")";
        },
        constant_value: Shade.memoize_on_field("_constant_value", function() {
            return !this.parents[0].constant_value();
        })
    });
};

Shade.Exp.not = function() { return Shade.not(this); };

var comparison_operator_exp = function(operator_name, type_checker, binary_evaluator)
{
    return function(left, right) {
        var first = Shade.make(left);
        var second = Shade.make(right);
        type_checker(first.type, second.type);

        return logical_operator_binexp(
            first, second, operator_name, binary_evaluator);
    };
};

var inequality_type_checker = function(name) {
    return function(t1, t2) {
        if (!(t1.equals(Shade.Types.float_t) && 
              t2.equals(Shade.Types.float_t)) &&
            !(t1.equals(Shade.Types.int_t) && 
              t2.equals(Shade.Types.int_t)))
            throw ("operator" + name + 
                   " requires two ints or two floats, got " +
                   t1.repr() + " and " + t2.repr() +
                   " instead.");
    };
};

var equality_type_checker = function(name) {
    return function(t1, t2) {
        if (!t1.equals(t2))
            throw ("operator" + name +
                   " requires same types, got " +
                   t1.repr() + " and " + t2.repr() +
                   " instead.");
        if (t1.is_array() && !t1.is_vec())
            throw ("operator" + name +
                   " does not support arrays");
    };
};

Shade.lt = comparison_operator_exp("<", inequality_type_checker("<"),
    lift_binfun_to_evaluator(function(a, b) { return a < b; }));
Shade.Exp.lt = function(other) { return Shade.lt(this, other); };

Shade.le = comparison_operator_exp("<=", inequality_type_checker("<="),
    lift_binfun_to_evaluator(function(a, b) { return a <= b; }));
Shade.Exp.le = function(other) { return Shade.le(this, other); };

Shade.gt = comparison_operator_exp(">", inequality_type_checker(">"),
    lift_binfun_to_evaluator(function(a, b) { return a > b; }));
Shade.Exp.gt = function(other) { return Shade.gt(this, other); };

Shade.ge = comparison_operator_exp(">=", inequality_type_checker(">="),
    lift_binfun_to_evaluator(function(a, b) { return a >= b; }));
Shade.Exp.ge = function(other) { return Shade.ge(this, other); };

Shade.eq = comparison_operator_exp("==", equality_type_checker("=="),
    lift_binfun_to_evaluator(function(a, b) { 
        if (typeOf(a) === 'number' ||
            typeOf(a) === 'boolean')
            return a === b;
        if (typeOf(a) === 'array')
            return _.all(zipWith(function(a, b) { return a === b; }, a, b),
                         function (x) { return x; });
        if (constant_type(a) === 'vector' ||
            constant_type(a) === 'matrix')
            return a.eql(b);
        throw "internal error: Unrecognized type " + typeOf(a) + 
            " " + constant_type(a);
    }));
Shade.Exp.eq = function(other) { return Shade.eq(this, other); };

Shade.ne = comparison_operator_exp("!=", equality_type_checker("!="),
    lift_binfun_to_evaluator(function(a, b) { 
        if (typeOf(a) === 'number' ||
            typeOf(a) === 'boolean')
            return a !== b;
        if (typeOf(a) === 'array')
            return _.any(zipWith(function(a, b) { return a !== b; }, a, b),
                         function (x) { return x; });
        if (constant_type(a) === 'vector' ||
            constant_type(a) === 'matrix')
            return !a.eql(b);
        throw "internal error: Unrecognized type " + typeOf(a) + 
            " " + constant_type(a);
    }));
Shade.Exp.ne = function(other) { return Shade.ne(this, other); };

// component-wise comparisons are defined on builtins.js

})();
Shade.selection = function(condition, if_true, if_false)
{
    condition = Shade.make(condition);
    if_true = Shade.make(if_true);
    if_false = Shade.make(if_false);

    if (!if_true.type.equals(if_false.type))
        throw "selection return expressions must have same types";
    if (!condition.type.equals(condition.type))
        throw "selection condition must be of type bool";

    return Shade._create_concrete_value_exp( {
        parents: [condition, if_true, if_false],
        type: if_true.type,
        expression_type: "selection",
        value: function() {
            return "(" + this.parents[0].eval() + "?"
                + this.parents[1].eval() + ":"
                + this.parents[2].eval() + ")";
        },
        constant_value: function() {
            return (this.parents[0].constant_value() ?
                    this.parents[1].constant_value() :
                    this.parents[2].constant_value());
        }, 
        parent_is_unconditional: function(i) {
            return i === 0;
        }
    });
};

Shade.Exp.selection = function(if_true, if_false)
{
    return Shade.selection(this, if_true, if_false);
};
Shade.rotation = function(angle, axis)
{
    angle = Shade.make(angle);
    axis = Shade.make(axis).normalize();

    var s = angle.sin(), c = angle.cos(), t = Shade.sub(1, c);
    var x = axis.at(0), y = axis.at(1), z = axis.at(2);
    
    // return Shade.mat(Shade.vec(1,0,0,0),
    //                  Shade.vec(0,1,0,0),
    //                  Shade.vec(0,0,1,0),
    //                  Shade.vec(0,0,0,1));
                    

    return Shade.mat(Shade.vec(x.mul(x).mul(t).add(c),
                               y.mul(x).mul(t).add(z.mul(s)),
                               z.mul(x).mul(t).sub(y.mul(s)),
                               0),
                     Shade.vec(x.mul(y).mul(t).sub(z.mul(s)),
                               y.mul(y).mul(t).add(c),
                               z.mul(y).mul(t).add(x.mul(s)),
                               0),
                     Shade.vec(x.mul(z).mul(t).add(y.mul(s)),
                               y.mul(z).mul(t).sub(x.mul(s)),
                               z.mul(z).mul(t).add(c),
                               0),
                     Shade.vec(0,0,0,1));
};
Shade.translation = function(t)
{
    return Shade.mat(Shade.vec(1,0,0,0),
                     Shade.vec(0,1,0,0),
                     Shade.vec(0,0,1,0),
                     Shade.vec(t, 1));
};
Shade.look_at = function(eye, center, up)
{
    eye = Shade.make(eye);
    center = Shade.make(center);
    up = Shade.make(up);

    var z = eye.sub(center).normalize();
    var x = up.cross(z).normalize();
    var y = z.cross(x).normalize();

    return Shade.mat(Shade.vec(x, 0),
                     Shade.vec(y, 0),
                     Shade.vec(z, 0),
                     Shade.vec(x.dot(eye).neg(),
                               y.dot(eye).neg(),
                               z.dot(eye).neg(),
                               1));
};
/*
 * Shade.discard_if: conditionally discard fragments from the pipeline
 * 

*********************************************************************************
 * 
 * For future reference, this is a copy of the org discussion on the
 * discard statement as I was designing it.
 * 

Discard is a statement; I don't really have statements in the
language.


*** discard is fragment-only.

How do I implement discard in a vertex shader?

**** Possibilities:
***** Disallow it to happen in the vertex shader
Good: Simplest
Bad: Breaks the model in Facet programs where we don't care much about
what happens in vertex expressions vs fragment expressions
Ugly: The error messages would be really opaque, unless I specifically
detect where the discard statement would appear.
***** Send the vertex outside the homogenous cube
Good: Simple
Bad: doesn't discard the whole primitive
Ugly: would make triangles, etc look really weird.
***** Set some special varying which discards every single fragment in the shader
Good: Discards an entire primitive.
Bad: Wastes a varying, which might be a scarce resource.
Ugly: varying cannot be discrete (bool). The solution would be to
discard if varying is greater than zero, set the discarded varying to be greater
than the largest possible distance between two vertices on the screen,
and the non-discarded to zero.

*** Implementation ideas:

**** special key for the program description

like so:

{
  gl_Position: foo
  gl_FragColor: bar
  discard_if: baz
}

The main disadvantage here is that one application of discard is to
save computation time. This means that my current initialization of
variables used in more than one context will be wasteful if none of
these variables are actually used before the discard condition is
verified. What I would need, then, is some dependency analysis that
determines which variables are used for which discard checks, and
computes those in the correct order.

This discard interacts with the initializer code.

**** new expression called discard_if

We add a discard_when(condition, value_if_not) expression, which
issues the discard statement if condition is true. 

But what about discard_when being executed inside conditional
expressions? Worse: discard_when would turn case D above from a
performance problem into an actual bug.

 * 
 */

Shade.discard_if = function(exp, condition)
{
    exp = Shade.make(exp);
    condition = Shade.make(condition);

    var result = Shade._create_concrete_exp({
        is_constant: Shade.memoize_on_field("_is_constant", function() {
            var cond = _.all(this.parents, function(v) {
                return v.is_constant();
            });
            return (cond && !this.parents[0].constant_value());
        }),
        _must_be_function_call: true,
        type: exp.type,
        expression_type: "discard_if",
        parents: [condition, exp],
        parent_is_unconditional: function(i) {
            return i === 0;
        },
        compile: function(ctx) {
            ctx.strings.push(exp.type.repr(), this.glsl_name, "(void) {\n",
                             "    if (",this.parents[0].eval(),") discard;\n",
                             "    return ", this.parents[1].eval(), ";\n}\n");
        },
        constant_value: function() {
            return exp.constant_value();
        }
    });
    return result;
};
// converts a 32-bit integer into an 8-bit RGBA value.
// this is most useful for picking.

// Ideally we would like this to take shade expressions,
// but WebGL does not support bitwise operators.

Shade.id = function(id_value)
{
    var r = id_value & 255;
    var g = (id_value >> 8) & 255;
    var b = (id_value >> 16) & 255;
    var a = (id_value >> 24) & 255;
    
    return vec4.make([r / 255, g / 255, b / 255, a / 255]);
};

return Shade;
}());
Facet.Marks = {};
// FIXME: alpha=0 points should discard because of depth buffer
Facet.Marks.dots = function(opts)
{
    opts = _.defaults(opts, {
        fill_color: Shade.vec(0,0,0,1),
        stroke_color: Shade.vec(0,0,0,1),
        point_diameter: 5,
        stroke_width: 2,
        mode: Facet.DrawingMode.over,
        alpha: true,
        plain: false
    });

    if (!opts.position)
        throw "Facet.Marks.dots expects parameter 'position'";
    if (!opts.elements)
        throw "Facet.Marks.dots expects parameter 'elements'";

    var S = Shade;

    var fill_color     = Shade.make(opts.fill_color);
    var stroke_color   = Shade.make(opts.stroke_color);
    var point_diameter = Shade.make(opts.point_diameter);
    var stroke_width   = Shade.make(opts.stroke_width).add(1);
    var use_alpha      = Shade.make(opts.alpha);
    
    var model_opts = {
        type: "points",
        vertex: opts.position,
        elements: opts.elements
    };

    var model = Facet.model(model_opts);

    var distance_to_center_in_pixels = S.pointCoord().sub(S.vec(0.5, 0.5))
        .length().mul(point_diameter);
    var point_radius = point_diameter.div(2);
    var distance_to_border = point_radius.sub(distance_to_center_in_pixels);
    var gl_Position = model.vertex;

    var no_alpha = S.mix(fill_color, stroke_color,
                         S.clamp(stroke_width.sub(distance_to_border), 0, 1));
    
    var plain_fill_color = fill_color;
    var alpha_fill_color = 
        S.selection(use_alpha,
                    no_alpha.mul(S.vec(1,1,1,S.clamp(distance_to_border, 0, 1))),
                    no_alpha)
        .discard_if(distance_to_center_in_pixels.gt(point_radius));

    var result = Facet.bake(model, {
        position: gl_Position,
        point_size: point_diameter,
        color: Shade.selection(opts.plain, plain_fill_color, alpha_fill_color),
        mode: opts.mode
    });
    // FIXME there must be a better way to do this.
    result.gl_Position = gl_Position;
    return result;
};
Facet.Marks.scatterplot = function(opts)
{
    opts = _.defaults(opts, {
        x_scale: function (x) { return x; },
        y_scale: function (x) { return x; },
        xy_scale: function (x) { return x; }
    });

    function to_opengl(x) { return x.mul(2).sub(1); };
    var S = Shade;
    
    var x_scale = opts.x_scale;
    var y_scale = opts.y_scale;

    var position, elements;

    if (opts.x) {
        position = S.vec(to_opengl(opts.x_scale(opts.x)), 
                         to_opengl(opts.y_scale(opts.y)));
    } else if (opts.xy) {
        position = opts.xy_scale(opts.xy).mul(2).sub(S.vec(1,1));
    };

    if (opts.model) {
        elements = opts.model.elements;
    } else if (opts.elements) {
        elements = opts.elements;
    }
    return Facet.Marks.dots({
        position: S.vec(position, 0, 1),
        elements: elements,
        fill_color: opts.fill_color,
        stroke_color: opts.stroke_color,
        point_diameter: opts.point_diameter,
        stroke_width: opts.stroke_width,
        mode: opts.mode,
        alpha: opts.alpha,
        plain: opts.plain
    });
};
function spherical_mercator_patch(tess)
{
    var uv = [];
    var elements = [];

    for (var i=0; i<=tess; ++i)
        for (var j=0; j<=tess; ++j)
            uv.push(i/tess, j/tess);

    for (i=0; i<tess; ++i)
        for (var j=0; j<tess; ++j) {
            var ix = (tess + 1) * i + j;
            elements.push(ix, ix+1, ix+tess+2, ix, ix+tess+2, ix+tess+1);
        };

    return Facet.model({
        type: "triangles",
        uv: [uv, 2],
        elements: elements,
        vertex: function(min, max) {
            var xf = this.uv.mul(max.sub(min)).add(min);
            return Facet.Scale.Geo.mercator_to_spherical(xf.at(0), xf.at(1));
        }, transformed_uv: function(min, max) {
            return Shade.mix(min, max, this.uv).div(Math.PI * 2).add(Shade.vec(0, 0.5));
        }
    });
};

function latlong_to_mercator(lat, lon)
{
    lat = lat / (180 / Math.PI);
    lon = lon / (180 / Math.PI);
    return [lon, Math.log(1.0/Math.cos(lat) + Math.tan(lat))];
}

Facet.Marks.globe = function(opts)
{
    opts = _.defaults(opts || {}, {
        longitude_center: -98,
        latitude_center: 38,
        zoom: 3
    });

    var gl = Facet._globals.ctx;

    var zooming = false, panning = false;
    var prev;
    var inertia_delta = [0,0];
    var min_x, max_x, min_y, max_y;
    var sphere = spherical_mercator_patch(40);
    var model_matrix = Shade.uniform("mat4");

    var texture = Facet.texture({
        width: 2048,
        height: 2048,
        TEXTURE_MAG_FILTER: gl.LINEAR,
        TEXTURE_MIN_FILTER: gl.LINEAR
    });

    min_x = Shade.uniform("float");
    max_x = Shade.uniform("float");
    min_y = Shade.uniform("float");
    max_y = Shade.uniform("float");
    var min = Shade.vec(min_x, min_y), max = Shade.vec(max_x, max_y);
    var sampler = Shade.uniform("sampler2D", texture);

    var sphere_drawable = Facet.bake(sphere, {
        gl_Position: opts.view_proj
            .mul(model_matrix)
            .mul(sphere.vertex(min, max)),
        gl_FragColor: Shade.texture2D(sampler, sphere.transformed_uv(min, max))
    });

    for (var i=0; i<8; ++i)
        for (var j=0; j<8; ++j)
            Facet.load_image_into_texture({
                texture: texture,
                src: "http://tile.openstreetmap.org/3/" +
                     i + "/" + j + ".png",
                crossOrigin: "anonymous",
                x_offset: ((i + 4) % 8)  * 256,
                y_offset: 2048 - (j+1) * 256,
                onload: function() { gl.display(); }
            });

    return {
        longitude_center: opts.longitude_center,
        latitude_center: opts.latitude_center,
        zoom: opts.zoom,
        model_matrix: model_matrix,

        mousedown: function(event) {
            prev = [event.offsetX, event.offsetY];
            inertia_delta = [0, 0];
        },

        mousemove: function(event) {
            if (event.which & 1 && !event.shiftKey) {
                panning = true;
                this.longitude_center -= (event.offsetX - prev[0]) / (3.3 * this.zoom);
                this.latitude_center += (event.offsetY - prev[1]) / (4.4 * this.zoom);
                this.latitude_center = Math.max(Math.min(80, this.latitude_center), -80);
            }
            if (event.which & 1 && event.shiftKey) {
                zooming = true;
                this.zoom *= 1.0 + (event.offsetY - prev[1]) / 240;
            }
            prev = [event.offsetX, event.offsetY];
            gl.display();
        },
        mouseup: function(event) {
            var that = this;
            if (panning) {
                inertia_delta[0] = -(event.offsetX - prev[0]) / (3.3 * that.zoom);
                inertia_delta[1] =  (event.offsetY - prev[1]) / (4.4 * that.zoom);
                prev = [event.offsetX, event.offsetY];
                var f = function() {
                    gl.display();
                    that.longitude_center += inertia_delta[0];
                    that.latitude_center  += inertia_delta[1];
                    that.latitude_center  = Math.max(Math.min(80, that.latitude_center),
                                                -80);
                    inertia_delta[0] *= 0.95;
                    inertia_delta[1] *= 0.95;
                    if (Math.max(Math.abs(inertia_delta[0]), Math.abs(inertia_delta[1])) > 0.01)
                        window.requestAnimFrame(f, that.canvas);
                };
                f();
            }
            panning = zooming = false;
        },

        draw: function() {
            while (this.longitude_center < 0)
                this.longitude_center += 360;
            while (this.longitude_center > 360)
                this.longitude_center -= 360;

            var r1 = Facet.rotation(this.latitude_center * (Math.PI/180), [ 1, 0, 0]);
            var r2 = Facet.rotation(this.longitude_center * (Math.PI/180), [ 0,-1, 0]);
            
            // gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
            gl.enable(gl.DEPTH_TEST);
            gl.depthFunc(gl.LESS);
            this.model_matrix.set(mat4.product(r1, r2));

            var t = latlong_to_mercator(this.latitude_center, this.longitude_center);
            var window = Math.PI * Math.min(1, 1 / (this.zoom * Math.cos(this.latitude_center / 180 * Math.PI)));

            var mn_x = (t[0] - window);
            var mx_x = (t[0] + window);
            while (mn_x > Math.PI * 2) {
                mn_x -= Math.PI * 2;
                mx_x -= Math.PI * 2;
            }

            min_y.set(t[1] - window);
            max_y.set(t[1] + window);

            if (mn_x < 0) {
                min_x.set(mn_x + Math.PI*2);
                max_x.set(Math.PI*2);
                sphere_drawable.draw();

                min_x.set(0);
                max_x.set(mx_x);
                sphere_drawable.draw();
            } else if (mx_x > Math.PI*2) {
                min_x.set(mn_x);
                max_x.set(Math.PI*2);
                sphere_drawable.draw();

                min_x.set(0);
                max_x.set(mx_x - Math.PI*2);
                sphere_drawable.draw();
            } else {
                min_x.set(mn_x);
                max_x.set(mx_x);
                sphere_drawable.draw();
            }
            
        }
    };
}
Facet.Models = {};
Facet.Models.flat_cube = function() {
    return Facet.model({
        type: "triangles",
        elements: [0,  1,  2,  0,  2,  3,
                   4,  5,  6,  4,  6,  7,
                   8,  9,  10, 8,  10, 11,
                   12, 13, 14, 12, 14, 15,
                   16, 17, 18, 16, 18, 19,
                   20, 21, 22, 20, 22, 23],
        vertex: [[ 1, 1,-1, -1, 1,-1, -1, 1, 1,  1, 1, 1,
                   1,-1, 1, -1,-1, 1, -1,-1,-1,  1,-1,-1,
                   1, 1, 1, -1, 1, 1, -1,-1, 1,  1,-1, 1,
                   1,-1,-1, -1,-1,-1, -1, 1,-1,  1, 1,-1,
                   -1, 1, 1, -1, 1,-1, -1,-1,-1, -1,-1, 1,
                   1, 1,-1,  1, 1, 1,  1,-1, 1,  1,-1,-1], 3],
        normal: [[ 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0,
                   0,-1, 0, 0,-1, 0, 0,-1, 0, 0,-1, 0,
                   0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,
                   0, 0,-1, 0, 0,-1, 0, 0,-1, 0, 0,-1,
                   -1, 0, 0,-1, 0, 0,-1, 0, 0,-1, 0, 0,
                   1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0], 3],
        tex_coord: [[0,0, 1,0, 1,1, 0,1,
                     0,0, 1,0, 1,1, 0,1,
                     0,0, 1,0, 1,1, 0,1,
                     0,0, 1,0, 1,1, 0,1,
                     0,0, 1,0, 1,1, 0,1,
                     0,0, 1,0, 1,1, 0,1], 2]
    });
};
Facet.Models.mesh = function(u_secs, v_secs) {
    var verts = [];
    var elements = [];
    if (typeof v_secs === "undefined") v_secs = u_secs;
    if (v_secs <= 0) throw "v_secs must be positive";
    if (u_secs <= 0) throw "u_secs must be positive";
    v_secs = Math.floor(v_secs);
    u_secs = Math.floor(u_secs);
    
    for (var i=0; i<=v_secs; ++i) {
        var v = (i / v_secs);
        for (var j=0; j<=u_secs; ++j) {
            var u = (j / u_secs);
            verts.push(u, v);
        }
    }
    for (i=0; i<v_secs; ++i) {
        for (var j=0; j<=u_secs; ++j) {
            elements.push(i * (u_secs + 1) + j,
                          (i + 1) * (u_secs + 1) + j);
        }
        // set up a non-rasterizing triangle in the middle of the strip
        // to transition between strips.
        if (i < v_secs-1) {
            elements.push((i + 1) * (u_secs + 1) + u_secs,
                          (i + 2) * (u_secs + 1),
                          (i + 2) * (u_secs + 1)
                         );
        }
    }

    var S = Shade;
    var uv_attr = Facet.attribute_buffer(verts, 2);
    var phi = S.sub(S.mul(Math.PI, S.swizzle(uv_attr, "r")), Math.PI/2);
    var theta = S.mul(2 * Math.PI, S.swizzle(uv_attr, "g"));
    var cosphi = S.cos(phi);
    return Facet.model({
        type: "triangle_strip",
        tex_coord: uv_attr,
        vertex: Shade.mul(uv_attr, 2).sub(Shade.vec(1, 1)),
        elements: Facet.element_buffer(elements)
    });
};
Facet.Models.sphere = function(lat_secs, long_secs) {
    var verts = [];
    var elements = [];
    if (typeof long_secs === "undefined") long_secs = lat_secs;
    if (lat_secs <= 0) throw "lat_secs must be positive";
    if (long_secs <= 0) throw "long_secs must be positive";
    lat_secs = Math.floor(lat_secs);
    long_secs = Math.floor(long_secs);
    
    for (var i=0; i<=lat_secs; ++i) {
        var phi = (i / lat_secs);
        for (var j=0; j<long_secs; ++j) {
            var theta = (j / long_secs);
            verts.push(theta, phi);
        }
    }
    for (i=0; i<lat_secs; ++i) {
        for (var j=0; j<long_secs; ++j) {
            elements.push(i * long_secs + j,
                          i * long_secs + ((j + 1) % long_secs),
                          (i + 1) * long_secs + j,
                          i * long_secs + ((j + 1) % long_secs),
                          (i + 1) * long_secs + ((j + 1) % long_secs),
                          (i + 1) * long_secs + j);
        }
    }

    var S = Shade;
    var uv_attr = Facet.attribute_buffer(verts, 2);
    var phi = S.sub(S.mul(Math.PI, S.swizzle(uv_attr, "r")), Math.PI/2);
    var theta = S.mul(2 * Math.PI, S.swizzle(uv_attr, "g"));
    var cosphi = S.cos(phi);
    return Facet.model({
        type: "triangles",
        elements: Facet.element_buffer(elements),
        vertex: S.vec(S.sin(theta).mul(cosphi),
                      S.sin(phi),
                      S.cos(theta).mul(cosphi), 1)
    });
},
Facet.Models.square = function() {
    var uv = Shade.make(Facet.attribute_buffer([0, 0, 1, 0, 0, 1, 1, 1], 2));
    return Facet.model({
        type: "triangles",
        elements: Facet.element_buffer([0, 1, 2, 1, 3, 2]),
        vertex: uv,
        tex_coord: uv
    });
};
Facet.Models.teapot = function()
{
    return Facet.model({
        type: "triangles",
        elements: [2908, 2920, 2938, 2938, 2930, 2908, 2868, 2876, 2920, 2920, 2908, 2868, 2818, 2826, 2876, 2876, 2868, 2818, 2736, 2746, 2826, 2826, 2818, 2736, 2668, 2672, 2746, 2746, 2736, 2668, 2566, 2574, 2672, 2672, 2668, 2566, 2475, 2479, 2574, 2574, 2566, 2475, 2357, 2361, 2479, 2479, 2475, 2357, 2157, 2161, 2361, 2361, 2357, 2157, 1714, 1811, 2161, 2161, 2157, 1714, 2900, 2908, 2930, 2930, 2916, 2900, 2862, 2868, 2908, 2908, 2900, 2862, 2812, 2818, 2868, 2868, 2862, 2812, 2728, 2736, 2818, 2818, 2812, 2728, 2662, 2668, 2736, 2736, 2728, 2662, 2560, 2566, 2668, 2668, 2662, 2560, 2467, 2475, 2566, 2566, 2560, 2467, 2349, 2357, 2475, 2475, 2467, 2349, 2151, 2157, 2357, 2357, 2349, 2151, 1716, 1714, 2157, 2157, 2151, 1716, 2902, 2900, 2916, 2916, 2922, 2902, 2864, 2862, 2900, 2900, 2902, 2864, 2814, 2812, 2862, 2862, 2864, 2814, 2732, 2728, 2812, 2812, 2814, 2732, 2664, 2662, 2728, 2728, 2732, 2664, 2563, 2560, 2662, 2662, 2664, 2563, 2472, 2467, 2560, 2560, 2563, 2472, 2353, 2349, 2467, 2467, 2472, 2353, 2154, 2151, 2349, 2349, 2353, 2154, 1926, 1716, 2151, 2151, 2154, 1926, 2910, 2902, 2922, 2922, 2934, 2910, 2874, 2864, 2902, 2902, 2910, 2874, 2822, 2814, 2864, 2864, 2874, 2822, 2740, 2732, 2814, 2814, 2822, 2740, 2670, 2664, 2732, 2732, 2740, 2670, 2570, 2563, 2664, 2664, 2670, 2570, 2477, 2472, 2563, 2563, 2570, 2477, 2359, 2353, 2472, 2472, 2477, 2359, 2159, 2154, 2353, 2353, 2359, 2159, 1717, 1926, 2154, 2154, 2159, 1717, 2928, 2910, 2934, 2934, 2946, 2928, 2880, 2874, 2910, 2910, 2928, 2880, 2828, 2822, 2874, 2874, 2880, 2828, 2750, 2740, 2822, 2822, 2828, 2750, 2676, 2670, 2740, 2740, 2750, 2676, 2576, 2570, 2670, 2670, 2676, 2576, 2481, 2477, 2570, 2570, 2576, 2481, 2363, 2359, 2477, 2477, 2481, 2363, 2163, 2159, 2359, 2359, 2363, 2163, 1841, 1717, 2159, 2159, 2163, 1841, 2944, 2928, 2946, 2946, 2958, 2944, 2896, 2880, 2928, 2928, 2944, 2896, 2834, 2828, 2880, 2880, 2896, 2834, 2760, 2750, 2828, 2828, 2834, 2760, 2678, 2676, 2750, 2750, 2760, 2678, 2578, 2576, 2676, 2676, 2678, 2578, 2485, 2481, 2576, 2576, 2578, 2485, 2367, 2363, 2481, 2481, 2485, 2367, 2171, 2163, 2363, 2363, 2367, 2171, 1724, 1841, 2163, 2163, 2171, 1724, 2964, 2944, 2958, 2958, 2980, 2964, 2906, 2896, 2944, 2944, 2964, 2906, 2844, 2834, 2896, 2896, 2906, 2844, 2768, 2760, 2834, 2834, 2844, 2768, 2684, 2678, 2760, 2760, 2768, 2684, 2586, 2578, 2678, 2678, 2684, 2586, 2490, 2485, 2578, 2578, 2586, 2490, 2369, 2367, 2485, 2485, 2490, 2369, 2173, 2171, 2367, 2367, 2369, 2173, 1833, 1724, 2171, 2171, 2173, 1833, 2981, 2964, 2980, 2980, 2987, 2981, 2932, 2906, 2964, 2964, 2981, 2932, 2854, 2844, 2906, 2906, 2932, 2854, 2778, 2768, 2844, 2844, 2854, 2778, 2690, 2684, 2768, 2768, 2778, 2690, 2594, 2586, 2684, 2684, 2690, 2594, 2499, 2490, 2586, 2586, 2594, 2499, 2373, 2369, 2490, 2490, 2499, 2373, 2177, 2173, 2369, 2369, 2373, 2177, 1715, 1833, 2173, 2173, 2177, 1715, 2989, 2981, 2987, 2987, 3001, 2989, 2948, 2932, 2981, 2981, 2989, 2948, 2870, 2854, 2932, 2932, 2948, 2870, 2790, 2778, 2854, 2854, 2870, 2790, 2698, 2690, 2778, 2778, 2790, 2698, 2600, 2594, 2690, 2690, 2698, 2600, 2505, 2499, 2594, 2594, 2600, 2505, 2377, 2373, 2499, 2499, 2505, 2377, 2179, 2177, 2373, 2373, 2377, 2179, 1713, 1715, 2177, 2177, 2179, 1713, 3007, 2989, 3001, 3001, 3023, 3007, 2972, 2948, 2989, 2989, 3007, 2972, 2888, 2870, 2948, 2948, 2972, 2888, 2804, 2790, 2870, 2870, 2888, 2804, 2710, 2698, 2790, 2790, 2804, 2710, 2610, 2600, 2698, 2698, 2710, 2610, 2520, 2505, 2600, 2600, 2610, 2520, 2386, 2377, 2505, 2505, 2520, 2386, 2190, 2179, 2377, 2377, 2386, 2190, 1809, 1713, 2179, 2179, 2190, 1809, 1463, 1459, 1812, 1812, 1820, 1463, 1263, 1259, 1459, 1459, 1463, 1263, 1145, 1141, 1259, 1259, 1263, 1145, 1054, 1046, 1141, 1141, 1145, 1054, 952, 948, 1046, 1046, 1054, 952, 884, 874, 948, 948, 952, 884, 802, 794, 874, 874, 884, 802, 752, 744, 794, 794, 802, 752, 712, 700, 744, 744, 752, 712, 690, 682, 700, 700, 712, 690, 1469, 1463, 1820, 1820, 1828, 1469, 1271, 1263, 1463, 1463, 1469, 1271, 1153, 1145, 1263, 1263, 1271, 1153, 1060, 1054, 1145, 1145, 1153, 1060, 958, 952, 1054, 1054, 1060, 958, 892, 884, 952, 952, 958, 892, 808, 802, 884, 884, 892, 808, 758, 752, 802, 802, 808, 758, 720, 712, 752, 752, 758, 720, 704, 690, 712, 712, 720, 704, 1468, 1469, 1828, 1828, 1834, 1468, 1267, 1271, 1469, 1469, 1468, 1267, 1150, 1153, 1271, 1271, 1267, 1150, 1059, 1060, 1153, 1153, 1150, 1059, 956, 958, 1060, 1060, 1059, 956, 888, 892, 958, 958, 956, 888, 806, 808, 892, 892, 888, 806, 756, 758, 808, 808, 806, 756, 718, 720, 758, 758, 756, 718, 698, 704, 720, 720, 718, 698, 1461, 1468, 1834, 1834, 1838, 1461, 1261, 1267, 1468, 1468, 1461, 1261, 1143, 1150, 1267, 1267, 1261, 1143, 1050, 1059, 1150, 1150, 1143, 1050, 950, 956, 1059, 1059, 1050, 950, 880, 888, 956, 956, 950, 880, 798, 806, 888, 888, 880, 798, 746, 756, 806, 806, 798, 746, 710, 718, 756, 756, 746, 710, 686, 698, 718, 718, 710, 686, 1457, 1461, 1838, 1838, 1842, 1457, 1257, 1261, 1461, 1461, 1457, 1257, 1139, 1143, 1261, 1261, 1257, 1139, 1044, 1050, 1143, 1143, 1139, 1044, 944, 950, 1050, 1050, 1044, 944, 870, 880, 950, 950, 944, 870, 792, 798, 880, 880, 870, 792, 740, 746, 798, 798, 792, 740, 692, 710, 746, 746, 740, 692, 674, 686, 710, 710, 692, 674, 1449, 1457, 1842, 1842, 1837, 1449, 1253, 1257, 1457, 1457, 1449, 1253, 1135, 1139, 1257, 1257, 1253, 1135, 1042, 1044, 1139, 1139, 1135, 1042, 942, 944, 1044, 1044, 1042, 942, 860, 870, 944, 944, 942, 860, 786, 792, 870, 870, 860, 786, 724, 740, 792, 792, 786, 724, 676, 692, 740, 740, 724, 676, 662, 674, 692, 692, 676, 662, 1447, 1449, 1837, 1837, 1833, 1447, 1251, 1253, 1449, 1449, 1447, 1251, 1132, 1135, 1253, 1253, 1251, 1132, 1034, 1042, 1135, 1135, 1132, 1034, 936, 942, 1042, 1042, 1034, 936, 852, 860, 942, 942, 936, 852, 776, 786, 860, 860, 852, 776, 714, 724, 786, 786, 776, 714, 656, 676, 724, 724, 714, 656, 641, 662, 676, 676, 656, 641, 1443, 1447, 1833, 1833, 1827, 1443, 1247, 1251, 1447, 1447, 1443, 1247, 1121, 1132, 1251, 1251, 1247, 1121, 1026, 1034, 1132, 1132, 1121, 1026, 930, 936, 1034, 1034, 1026, 930, 842, 852, 936, 936, 930, 842, 766, 776, 852, 852, 842, 766, 688, 714, 776, 776, 766, 688, 639, 656, 714, 714, 688, 639, 633, 641, 656, 656, 639, 633, 1441, 1443, 1827, 1827, 1819, 1441, 1243, 1247, 1443, 1443, 1441, 1243, 1115, 1121, 1247, 1247, 1243, 1115, 1020, 1026, 1121, 1121, 1115, 1020, 922, 930, 1026, 1026, 1020, 922, 830, 842, 930, 930, 922, 830, 750, 766, 842, 842, 830, 750, 672, 688, 766, 766, 750, 672, 631, 639, 688, 688, 672, 631, 619, 633, 639, 639, 631, 619, 1428, 1441, 1819, 1819, 1810, 1428, 1232, 1243, 1441, 1441, 1428, 1232, 1105, 1115, 1243, 1243, 1232, 1105, 1010, 1020, 1115, 1115, 1105, 1010, 910, 922, 1020, 1020, 1010, 910, 816, 830, 922, 922, 910, 816, 732, 750, 830, 830, 816, 732, 648, 672, 750, 750, 732, 648, 613, 631, 672, 672, 648, 613, 596, 619, 631, 631, 613, 596, 713, 701, 683, 683, 691, 713, 753, 745, 701, 701, 713, 753, 803, 795, 745, 745, 753, 803, 885, 875, 795, 795, 803, 885, 953, 949, 875, 875, 885, 953, 1055, 1047, 949, 949, 953, 1055, 1146, 1142, 1047, 1047, 1055, 1146, 1264, 1260, 1142, 1142, 1146, 1264, 1464, 1460, 1260, 1260, 1264, 1464, 1914, 1816, 1460, 1460, 1464, 1914, 721, 713, 691, 691, 705, 721, 759, 753, 713, 713, 721, 759, 809, 803, 753, 753, 759, 809, 893, 885, 803, 803, 809, 893, 959, 953, 885, 885, 893, 959, 1061, 1055, 953, 953, 959, 1061, 1154, 1146, 1055, 1055, 1061, 1154, 1272, 1264, 1146, 1146, 1154, 1272, 1470, 1464, 1264, 1264, 1272, 1470, 1916, 1914, 1464, 1464, 1470, 1916, 719, 721, 705, 705, 699, 719, 757, 759, 721, 721, 719, 757, 807, 809, 759, 759, 757, 807, 889, 893, 809, 809, 807, 889, 957, 959, 893, 893, 889, 957, 1058, 1061, 959, 959, 957, 1058, 1149, 1154, 1061, 1061, 1058, 1149, 1268, 1272, 1154, 1154, 1149, 1268, 1467, 1470, 1272, 1272, 1268, 1467, 1696, 1916, 1470, 1470, 1467, 1696, 711, 719, 699, 699, 687, 711, 747, 757, 719, 719, 711, 747, 799, 807, 757, 757, 747, 799, 881, 889, 807, 807, 799, 881, 951, 957, 889, 889, 881, 951, 1051, 1058, 957, 957, 951, 1051, 1144, 1149, 1058, 1058, 1051, 1144, 1262, 1268, 1149, 1149, 1144, 1262, 1462, 1467, 1268, 1268, 1262, 1462, 1918, 1696, 1467, 1467, 1462, 1918, 693, 711, 687, 687, 675, 693, 741, 747, 711, 711, 693, 741, 793, 799, 747, 747, 741, 793, 871, 881, 799, 799, 793, 871, 945, 951, 881, 881, 871, 945, 1045, 1051, 951, 951, 945, 1045, 1140, 1144, 1051, 1051, 1045, 1140, 1258, 1262, 1144, 1144, 1140, 1258, 1458, 1462, 1262, 1262, 1258, 1458, 1844, 1918, 1462, 1462, 1458, 1844, 677, 693, 675, 675, 663, 677, 725, 741, 693, 693, 677, 725, 787, 793, 741, 741, 725, 787, 861, 871, 793, 793, 787, 861, 943, 945, 871, 871, 861, 943, 1043, 1045, 945, 945, 943, 1043, 1136, 1140, 1045, 1045, 1043, 1136, 1254, 1258, 1140, 1140, 1136, 1254, 1450, 1458, 1258, 1258, 1254, 1450, 1897, 1844, 1458, 1458, 1450, 1897, 657, 677, 663, 663, 641, 657, 715, 725, 677, 677, 657, 715, 777, 787, 725, 725, 715, 777, 853, 861, 787, 787, 777, 853, 937, 943, 861, 861, 853, 937, 1035, 1043, 943, 943, 937, 1035, 1131, 1136, 1043, 1043, 1035, 1131, 1252, 1254, 1136, 1136, 1131, 1252, 1448, 1450, 1254, 1254, 1252, 1448, 1836, 1897, 1450, 1450, 1448, 1836, 640, 657, 641, 641, 634, 640, 689, 715, 657, 657, 640, 689, 767, 777, 715, 715, 689, 767, 843, 853, 777, 777, 767, 843, 931, 937, 853, 853, 843, 931, 1027, 1035, 937, 937, 931, 1027, 1122, 1131, 1035, 1035, 1027, 1122, 1248, 1252, 1131, 1131, 1122, 1248, 1444, 1448, 1252, 1252, 1248, 1444, 1917, 1836, 1448, 1448, 1444, 1917, 632, 640, 634, 634, 620, 632, 673, 689, 640, 640, 632, 673, 751, 767, 689, 689, 673, 751, 831, 843, 767, 767, 751, 831, 923, 931, 843, 843, 831, 923, 1021, 1027, 931, 931, 923, 1021, 1116, 1122, 1027, 1027, 1021, 1116, 1244, 1248, 1122, 1122, 1116, 1244, 1442, 1444, 1248, 1248, 1244, 1442, 1915, 1917, 1444, 1444, 1442, 1915, 615, 632, 620, 620, 599, 615, 653, 673, 632, 632, 615, 653, 736, 751, 673, 673, 653, 736, 821, 831, 751, 751, 736, 821, 913, 923, 831, 831, 821, 913, 1013, 1021, 923, 923, 913, 1013, 1103, 1116, 1021, 1021, 1013, 1103, 1236, 1244, 1116, 1116, 1103, 1236, 1432, 1442, 1244, 1244, 1236, 1432, 1818, 1915, 1442, 1442, 1432, 1818, 2158, 2162, 1815, 1815, 1821, 2158, 2358, 2362, 2162, 2162, 2158, 2358, 2476, 2480, 2362, 2362, 2358, 2476, 2567, 2575, 2480, 2480, 2476, 2567, 2669, 2673, 2575, 2575, 2567, 2669, 2737, 2747, 2673, 2673, 2669, 2737, 2819, 2827, 2747, 2747, 2737, 2819, 2869, 2877, 2827, 2827, 2819, 2869, 2909, 2921, 2877, 2877, 2869, 2909, 2931, 2939, 2921, 2921, 2909, 2931, 2152, 2158, 1821, 1821, 1829, 2152, 2350, 2358, 2158, 2158, 2152, 2350, 2468, 2476, 2358, 2358, 2350, 2468, 2561, 2567, 2476, 2476, 2468, 2561, 2663, 2669, 2567, 2567, 2561, 2663, 2729, 2737, 2669, 2669, 2663, 2729, 2813, 2819, 2737, 2737, 2729, 2813, 2863, 2869, 2819, 2819, 2813, 2863, 2901, 2909, 2869, 2869, 2863, 2901, 2917, 2931, 2909, 2909, 2901, 2917, 2153, 2152, 1829, 1829, 1835, 2153, 2354, 2350, 2152, 2152, 2153, 2354, 2471, 2468, 2350, 2350, 2354, 2471, 2562, 2561, 2468, 2468, 2471, 2562, 2665, 2663, 2561, 2561, 2562, 2665, 2733, 2729, 2663, 2663, 2665, 2733, 2815, 2813, 2729, 2729, 2733, 2815, 2865, 2863, 2813, 2813, 2815, 2865, 2903, 2901, 2863, 2863, 2865, 2903, 2923, 2917, 2901, 2901, 2903, 2923, 2160, 2153, 1835, 1835, 1839, 2160, 2360, 2354, 2153, 2153, 2160, 2360, 2478, 2471, 2354, 2354, 2360, 2478, 2571, 2562, 2471, 2471, 2478, 2571, 2671, 2665, 2562, 2562, 2571, 2671, 2741, 2733, 2665, 2665, 2671, 2741, 2823, 2815, 2733, 2733, 2741, 2823, 2875, 2865, 2815, 2815, 2823, 2875, 2911, 2903, 2865, 2865, 2875, 2911, 2935, 2923, 2903, 2903, 2911, 2935, 2164, 2160, 1839, 1839, 1843, 2164, 2364, 2360, 2160, 2160, 2164, 2364, 2482, 2478, 2360, 2360, 2364, 2482, 2577, 2571, 2478, 2478, 2482, 2577, 2677, 2671, 2571, 2571, 2577, 2677, 2751, 2741, 2671, 2671, 2677, 2751, 2829, 2823, 2741, 2741, 2751, 2829, 2881, 2875, 2823, 2823, 2829, 2881, 2929, 2911, 2875, 2875, 2881, 2929, 2947, 2935, 2911, 2911, 2929, 2947, 2172, 2164, 1843, 1843, 1840, 2172, 2368, 2364, 2164, 2164, 2172, 2368, 2486, 2482, 2364, 2364, 2368, 2486, 2579, 2577, 2482, 2482, 2486, 2579, 2679, 2677, 2577, 2577, 2579, 2679, 2761, 2751, 2677, 2677, 2679, 2761, 2835, 2829, 2751, 2751, 2761, 2835, 2897, 2881, 2829, 2829, 2835, 2897, 2945, 2929, 2881, 2881, 2897, 2945, 2959, 2947, 2929, 2929, 2945, 2959, 2174, 2172, 1840, 1840, 1836, 2174, 2370, 2368, 2172, 2172, 2174, 2370, 2489, 2486, 2368, 2368, 2370, 2489, 2587, 2579, 2486, 2486, 2489, 2587, 2685, 2679, 2579, 2579, 2587, 2685, 2769, 2761, 2679, 2679, 2685, 2769, 2845, 2835, 2761, 2761, 2769, 2845, 2907, 2897, 2835, 2835, 2845, 2907, 2965, 2945, 2897, 2897, 2907, 2965, 2980, 2959, 2945, 2945, 2965, 2980, 2178, 2174, 1836, 1836, 1830, 2178, 2374, 2370, 2174, 2174, 2178, 2374, 2500, 2489, 2370, 2370, 2374, 2500, 2595, 2587, 2489, 2489, 2500, 2595, 2691, 2685, 2587, 2587, 2595, 2691, 2779, 2769, 2685, 2685, 2691, 2779, 2855, 2845, 2769, 2769, 2779, 2855, 2933, 2907, 2845, 2845, 2855, 2933, 2982, 2965, 2907, 2907, 2933, 2982, 2988, 2980, 2965, 2965, 2982, 2988, 2180, 2178, 1830, 1830, 1822, 2180, 2378, 2374, 2178, 2178, 2180, 2378, 2506, 2500, 2374, 2374, 2378, 2506, 2601, 2595, 2500, 2500, 2506, 2601, 2699, 2691, 2595, 2595, 2601, 2699, 2791, 2779, 2691, 2691, 2699, 2791, 2871, 2855, 2779, 2779, 2791, 2871, 2949, 2933, 2855, 2855, 2871, 2949, 2990, 2982, 2933, 2933, 2949, 2990, 3002, 2988, 2982, 2982, 2990, 3002, 2193, 2180, 1822, 1822, 1817, 2193, 2390, 2378, 2180, 2180, 2193, 2390, 2517, 2506, 2378, 2378, 2390, 2517, 2613, 2601, 2506, 2506, 2517, 2613, 2711, 2699, 2601, 2601, 2613, 2711, 2805, 2791, 2699, 2699, 2711, 2805, 2889, 2871, 2791, 2791, 2805, 2889, 2973, 2949, 2871, 2871, 2889, 2973, 3008, 2990, 2949, 2949, 2973, 3008, 3024, 3002, 2990, 2990, 3008, 3024, 3039, 3007, 3023, 3023, 3047, 3039, 3017, 2972, 3007, 3007, 3039, 3017, 2942, 2888, 2972, 2972, 3017, 2942, 2840, 2804, 2888, 2888, 2942, 2840, 2730, 2710, 2804, 2804, 2840, 2730, 2644, 2610, 2710, 2710, 2730, 2644, 2528, 2520, 2610, 2610, 2644, 2528, 2401, 2386, 2520, 2520, 2528, 2401, 2207, 2190, 2386, 2386, 2401, 2207, 1805, 1809, 2190, 2190, 2207, 1805, 3071, 3039, 3047, 3047, 3077, 3071, 3043, 3017, 3039, 3039, 3071, 3043, 2993, 2942, 3017, 3017, 3043, 2993, 2882, 2840, 2942, 2942, 2993, 2882, 2772, 2730, 2840, 2840, 2882, 2772, 2658, 2644, 2730, 2730, 2772, 2658, 2538, 2528, 2644, 2644, 2658, 2538, 2409, 2401, 2528, 2528, 2538, 2409, 2221, 2207, 2401, 2401, 2409, 2221, 1693, 1805, 2207, 2207, 2221, 1693, 3091, 3071, 3077, 3077, 3115, 3091, 3073, 3043, 3071, 3071, 3091, 3073, 3029, 2993, 3043, 3043, 3073, 3029, 2936, 2882, 2993, 2993, 3029, 2936, 2809, 2772, 2882, 2882, 2936, 2809, 2682, 2658, 2772, 2772, 2809, 2682, 2553, 2538, 2658, 2658, 2682, 2553, 2419, 2409, 2538, 2538, 2553, 2419, 2237, 2221, 2409, 2409, 2419, 2237, 1929, 1693, 2221, 2221, 2237, 1929, 3131, 3091, 3115, 3115, 3141, 3131, 3089, 3073, 3091, 3091, 3131, 3089, 3053, 3029, 3073, 3073, 3089, 3053, 2983, 2936, 3029, 3029, 3053, 2983, 2836, 2809, 2936, 2936, 2983, 2836, 2704, 2682, 2809, 2809, 2836, 2704, 2573, 2553, 2682, 2682, 2704, 2573, 2429, 2419, 2553, 2553, 2573, 2429, 2246, 2237, 2419, 2419, 2429, 2246, 1912, 1929, 2237, 2237, 2246, 1912, 3149, 3131, 3141, 3141, 3155, 3149, 3127, 3089, 3131, 3131, 3149, 3127, 3075, 3053, 3089, 3089, 3127, 3075, 3013, 2983, 3053, 3053, 3075, 3013, 2860, 2836, 2983, 2983, 3013, 2860, 2722, 2704, 2836, 2836, 2860, 2722, 2584, 2573, 2704, 2704, 2722, 2584, 2437, 2429, 2573, 2573, 2584, 2437, 2252, 2246, 2429, 2429, 2437, 2252, 1710, 1912, 2246, 2246, 2252, 1710, 3161, 3149, 3155, 3155, 3171, 3161, 3147, 3127, 3149, 3149, 3161, 3147, 3087, 3075, 3127, 3127, 3147, 3087, 3035, 3013, 3075, 3075, 3087, 3035, 2892, 2860, 3013, 3013, 3035, 2892, 2742, 2722, 2860, 2860, 2892, 2742, 2598, 2584, 2722, 2722, 2742, 2598, 2449, 2437, 2584, 2584, 2598, 2449, 2266, 2252, 2437, 2437, 2449, 2266, 1793, 1710, 2252, 2252, 2266, 1793, 3177, 3161, 3171, 3171, 3183, 3177, 3153, 3147, 3161, 3161, 3177, 3153, 3117, 3087, 3147, 3147, 3153, 3117, 3045, 3035, 3087, 3087, 3117, 3045, 2914, 2892, 3035, 3035, 3045, 2914, 2762, 2742, 2892, 2892, 2914, 2762, 2614, 2598, 2742, 2742, 2762, 2614, 2451, 2449, 2598, 2598, 2614, 2451, 2276, 2266, 2449, 2449, 2451, 2276, 1709, 1793, 2266, 2266, 2276, 1709, 3187, 3177, 3183, 3183, 3199, 3187, 3163, 3153, 3177, 3177, 3187, 3163, 3129, 3117, 3153, 3153, 3163, 3129, 3057, 3045, 3117, 3117, 3129, 3057, 2940, 2914, 3045, 3045, 3057, 2940, 2774, 2762, 2914, 2914, 2940, 2774, 2626, 2614, 2762, 2762, 2774, 2626, 2457, 2451, 2614, 2614, 2626, 2457, 2286, 2276, 2451, 2451, 2457, 2286, 1909, 1709, 2276, 2276, 2286, 1909, 3197, 3187, 3199, 3199, 3208, 3197, 3169, 3163, 3187, 3187, 3197, 3169, 3135, 3129, 3163, 3163, 3169, 3135, 3063, 3057, 3129, 3129, 3135, 3063, 2954, 2940, 3057, 3057, 3063, 2954, 2780, 2774, 2940, 2940, 2954, 2780, 2635, 2626, 2774, 2774, 2780, 2635, 2461, 2457, 2626, 2626, 2635, 2461, 2294, 2286, 2457, 2457, 2461, 2294, 1908, 1909, 2286, 2286, 2294, 1908, 3201, 3197, 3208, 3208, 3212, 3201, 3173, 3169, 3197, 3197, 3201, 3173, 3137, 3135, 3169, 3169, 3173, 3137, 3065, 3063, 3135, 3135, 3137, 3065, 2960, 2954, 3063, 3063, 3065, 2960, 2782, 2780, 2954, 2954, 2960, 2782, 2641, 2635, 2780, 2780, 2782, 2641, 2463, 2461, 2635, 2635, 2641, 2463, 2296, 2294, 2461, 2461, 2463, 2296, 1783, 1908, 2294, 2294, 2296, 1783, 1413, 1428, 1810, 1810, 1806, 1413, 1219, 1232, 1428, 1428, 1413, 1219, 1092, 1105, 1232, 1232, 1219, 1092, 976, 1010, 1105, 1105, 1092, 976, 890, 910, 1010, 1010, 976, 890, 780, 816, 910, 910, 890, 780, 678, 732, 816, 816, 780, 678, 603, 648, 732, 732, 678, 603, 570, 613, 648, 648, 603, 570, 560, 596, 613, 613, 570, 560, 1399, 1413, 1806, 1806, 1803, 1399, 1211, 1219, 1413, 1413, 1399, 1211, 1082, 1092, 1219, 1219, 1211, 1082, 962, 976, 1092, 1092, 1082, 962, 848, 890, 976, 976, 962, 848, 738, 780, 890, 890, 848, 738, 627, 678, 780, 780, 738, 627, 564, 603, 678, 678, 627, 564, 529, 570, 603, 603, 564, 529, 523, 560, 570, 570, 529, 523, 1385, 1399, 1803, 1803, 1801, 1385, 1201, 1211, 1399, 1399, 1385, 1201, 1069, 1082, 1211, 1211, 1201, 1069, 938, 962, 1082, 1082, 1069, 938, 813, 848, 962, 962, 938, 813, 684, 738, 848, 848, 813, 684, 584, 627, 738, 738, 684, 584, 527, 564, 627, 627, 584, 527, 509, 529, 564, 564, 527, 509, 507, 523, 529, 529, 509, 507, 1374, 1385, 1801, 1801, 1799, 1374, 1191, 1201, 1385, 1385, 1374, 1191, 1049, 1069, 1201, 1201, 1191, 1049, 916, 938, 1069, 1069, 1049, 916, 784, 813, 938, 938, 916, 784, 637, 684, 813, 813, 784, 637, 552, 584, 684, 684, 637, 552, 511, 527, 584, 584, 552, 511, 491, 509, 527, 527, 511, 491, 481, 507, 509, 509, 491, 481, 1368, 1374, 1799, 1799, 1797, 1368, 1183, 1191, 1374, 1374, 1368, 1183, 1036, 1049, 1191, 1191, 1183, 1036, 898, 916, 1049, 1049, 1036, 898, 760, 784, 916, 916, 898, 760, 607, 637, 784, 784, 760, 607, 525, 552, 637, 637, 607, 525, 495, 511, 552, 552, 525, 495, 453, 491, 511, 511, 495, 453, 447, 481, 491, 491, 453, 447, 1354, 1368, 1797, 1797, 1794, 1354, 1171, 1183, 1368, 1368, 1354, 1171, 1022, 1036, 1183, 1183, 1171, 1022, 878, 898, 1036, 1036, 1022, 878, 728, 760, 898, 898, 878, 728, 578, 607, 760, 760, 728, 578, 513, 525, 607, 607, 578, 513, 456, 495, 525, 525, 513, 456, 441, 453, 495, 495, 456, 441, 431, 447, 453, 453, 441, 431, 1344, 1354, 1794, 1794, 1791, 1344, 1169, 1171, 1354, 1354, 1344, 1169, 1006, 1022, 1171, 1171, 1169, 1006, 858, 878, 1022, 1022, 1006, 858, 706, 728, 878, 878, 858, 706, 562, 578, 728, 728, 706, 562, 505, 513, 578, 578, 562, 505, 449, 456, 513, 513, 505, 449, 419, 441, 456, 456, 449, 419, 411, 431, 441, 441, 419, 411, 1334, 1344, 1791, 1791, 1789, 1334, 1163, 1169, 1344, 1344, 1334, 1163, 994, 1006, 1169, 1169, 1163, 994, 846, 858, 1006, 1006, 994, 846, 680, 706, 858, 858, 846, 680, 546, 562, 706, 706, 680, 546, 493, 505, 562, 562, 546, 493, 439, 449, 505, 505, 493, 439, 409, 419, 449, 449, 439, 409, 397, 411, 419, 419, 409, 397, 1326, 1334, 1789, 1789, 1787, 1326, 1159, 1163, 1334, 1334, 1326, 1159, 987, 994, 1163, 1163, 1159, 987, 840, 846, 994, 994, 987, 840, 666, 680, 846, 846, 840, 666, 537, 546, 680, 680, 666, 537, 487, 493, 546, 546, 537, 487, 433, 439, 493, 493, 487, 433, 399, 409, 439, 439, 433, 399, 380, 397, 409, 409, 399, 380, 1323, 1326, 1787, 1787, 1784, 1323, 1155, 1159, 1326, 1326, 1323, 1155, 978, 987, 1159, 1159, 1155, 978, 836, 840, 987, 987, 978, 836, 658, 666, 840, 840, 836, 658, 533, 537, 666, 666, 658, 533, 483, 487, 537, 537, 533, 483, 427, 433, 487, 487, 483, 427, 394, 399, 433, 433, 427, 394, 373, 380, 399, 399, 394, 373, 571, 615, 599, 599, 561, 571, 604, 653, 615, 615, 571, 604, 679, 736, 653, 653, 604, 679, 781, 821, 736, 736, 679, 781, 891, 913, 821, 821, 781, 891, 977, 1013, 913, 913, 891, 977, 1093, 1103, 1013, 1013, 977, 1093, 1220, 1236, 1103, 1103, 1093, 1220, 1414, 1432, 1236, 1236, 1220, 1414, 1808, 1818, 1432, 1432, 1414, 1808, 530, 571, 561, 561, 524, 530, 565, 604, 571, 571, 530, 565, 628, 679, 604, 604, 565, 628, 739, 781, 679, 679, 628, 739, 849, 891, 781, 781, 739, 849, 963, 977, 891, 891, 849, 963, 1083, 1093, 977, 977, 963, 1083, 1212, 1220, 1093, 1093, 1083, 1212, 1400, 1414, 1220, 1220, 1212, 1400, 1930, 1808, 1414, 1414, 1400, 1930, 510, 530, 524, 524, 508, 510, 528, 565, 530, 530, 510, 528, 585, 628, 565, 565, 528, 585, 685, 739, 628, 628, 585, 685, 812, 849, 739, 739, 685, 812, 939, 963, 849, 849, 812, 939, 1068, 1083, 963, 963, 939, 1068, 1202, 1212, 1083, 1083, 1068, 1202, 1384, 1400, 1212, 1212, 1202, 1384, 1692, 1930, 1400, 1400, 1384, 1692, 492, 510, 508, 508, 482, 492, 512, 528, 510, 510, 492, 512, 553, 585, 528, 528, 512, 553, 638, 685, 585, 585, 553, 638, 785, 812, 685, 685, 638, 785, 917, 939, 812, 812, 785, 917, 1048, 1068, 939, 939, 917, 1048, 1192, 1202, 1068, 1068, 1048, 1192, 1375, 1384, 1202, 1202, 1192, 1375, 1711, 1692, 1384, 1384, 1375, 1711, 454, 492, 482, 482, 448, 454, 496, 512, 492, 492, 454, 496, 526, 553, 512, 512, 496, 526, 608, 638, 553, 553, 526, 608, 761, 785, 638, 638, 608, 761, 899, 917, 785, 785, 761, 899, 1037, 1048, 917, 917, 899, 1037, 1184, 1192, 1048, 1048, 1037, 1184, 1369, 1375, 1192, 1192, 1184, 1369, 1911, 1711, 1375, 1375, 1369, 1911, 442, 454, 448, 448, 432, 442, 457, 496, 454, 454, 442, 457, 514, 526, 496, 496, 457, 514, 579, 608, 526, 526, 514, 579, 729, 761, 608, 608, 579, 729, 879, 899, 761, 761, 729, 879, 1023, 1037, 899, 899, 879, 1023, 1172, 1184, 1037, 1037, 1023, 1172, 1355, 1369, 1184, 1184, 1172, 1355, 1796, 1911, 1369, 1369, 1355, 1796, 420, 442, 432, 432, 412, 420, 450, 457, 442, 442, 420, 450, 506, 514, 457, 457, 450, 506, 563, 579, 514, 514, 506, 563, 707, 729, 579, 579, 563, 707, 859, 879, 729, 729, 707, 859, 1007, 1023, 879, 879, 859, 1007, 1170, 1172, 1023, 1023, 1007, 1170, 1345, 1355, 1172, 1172, 1170, 1345, 1910, 1796, 1355, 1355, 1345, 1910, 410, 420, 412, 412, 398, 410, 440, 450, 420, 420, 410, 440, 494, 506, 450, 450, 440, 494, 547, 563, 506, 506, 494, 547, 681, 707, 563, 563, 547, 681, 847, 859, 707, 707, 681, 847, 995, 1007, 859, 859, 847, 995, 1164, 1170, 1007, 1007, 995, 1164, 1335, 1345, 1170, 1170, 1164, 1335, 1708, 1910, 1345, 1345, 1335, 1708, 400, 410, 398, 398, 381, 400, 434, 440, 410, 410, 400, 434, 488, 494, 440, 440, 434, 488, 538, 547, 494, 494, 488, 538, 667, 681, 547, 547, 538, 667, 841, 847, 681, 681, 667, 841, 986, 995, 847, 847, 841, 986, 1160, 1164, 995, 995, 986, 1160, 1327, 1335, 1164, 1164, 1160, 1327, 1707, 1708, 1335, 1335, 1327, 1707, 396, 400, 381, 381, 375, 396, 430, 434, 400, 400, 396, 430, 486, 488, 434, 434, 430, 486, 536, 538, 488, 488, 486, 536, 661, 667, 538, 538, 536, 661, 839, 841, 667, 667, 661, 839, 980, 986, 841, 841, 839, 980, 1158, 1160, 986, 986, 980, 1158, 1325, 1327, 1160, 1160, 1158, 1325, 1786, 1707, 1327, 1327, 1325, 1786, 2208, 2193, 1817, 1817, 1807, 2208, 2402, 2390, 2193, 2193, 2208, 2402, 2529, 2517, 2390, 2390, 2402, 2529, 2645, 2613, 2517, 2517, 2529, 2645, 2731, 2711, 2613, 2613, 2645, 2731, 2841, 2805, 2711, 2711, 2731, 2841, 2943, 2889, 2805, 2805, 2841, 2943, 3018, 2973, 2889, 2889, 2943, 3018, 3040, 3008, 2973, 2973, 3018, 3040, 3048, 3024, 3008, 3008, 3040, 3048, 2222, 2208, 1807, 1807, 1804, 2222, 2410, 2402, 2208, 2208, 2222, 2410, 2539, 2529, 2402, 2402, 2410, 2539, 2659, 2645, 2529, 2529, 2539, 2659, 2773, 2731, 2645, 2645, 2659, 2773, 2883, 2841, 2731, 2731, 2773, 2883, 2994, 2943, 2841, 2841, 2883, 2994, 3044, 3018, 2943, 2943, 2994, 3044, 3072, 3040, 3018, 3018, 3044, 3072, 3078, 3048, 3040, 3040, 3072, 3078, 2236, 2222, 1804, 1804, 1802, 2236, 2420, 2410, 2222, 2222, 2236, 2420, 2552, 2539, 2410, 2410, 2420, 2552, 2683, 2659, 2539, 2539, 2552, 2683, 2808, 2773, 2659, 2659, 2683, 2808, 2937, 2883, 2773, 2773, 2808, 2937, 3030, 2994, 2883, 2883, 2937, 3030, 3074, 3044, 2994, 2994, 3030, 3074, 3092, 3072, 3044, 3044, 3074, 3092, 3116, 3078, 3072, 3072, 3092, 3116, 2247, 2236, 1802, 1802, 1800, 2247, 2430, 2420, 2236, 2236, 2247, 2430, 2572, 2552, 2420, 2420, 2430, 2572, 2705, 2683, 2552, 2552, 2572, 2705, 2837, 2808, 2683, 2683, 2705, 2837, 2984, 2937, 2808, 2808, 2837, 2984, 3054, 3030, 2937, 2937, 2984, 3054, 3090, 3074, 3030, 3030, 3054, 3090, 3132, 3092, 3074, 3074, 3090, 3132, 3142, 3116, 3092, 3092, 3132, 3142, 2253, 2247, 1800, 1800, 1798, 2253, 2438, 2430, 2247, 2247, 2253, 2438, 2585, 2572, 2430, 2430, 2438, 2585, 2723, 2705, 2572, 2572, 2585, 2723, 2861, 2837, 2705, 2705, 2723, 2861, 3014, 2984, 2837, 2837, 2861, 3014, 3076, 3054, 2984, 2984, 3014, 3076, 3128, 3090, 3054, 3054, 3076, 3128, 3150, 3132, 3090, 3090, 3128, 3150, 3156, 3142, 3132, 3132, 3150, 3156, 2267, 2253, 1798, 1798, 1795, 2267, 2450, 2438, 2253, 2253, 2267, 2450, 2599, 2585, 2438, 2438, 2450, 2599, 2743, 2723, 2585, 2585, 2599, 2743, 2893, 2861, 2723, 2723, 2743, 2893, 3036, 3014, 2861, 2861, 2893, 3036, 3088, 3076, 3014, 3014, 3036, 3088, 3148, 3128, 3076, 3076, 3088, 3148, 3162, 3150, 3128, 3128, 3148, 3162, 3172, 3156, 3150, 3150, 3162, 3172, 2277, 2267, 1795, 1795, 1792, 2277, 2452, 2450, 2267, 2267, 2277, 2452, 2615, 2599, 2450, 2450, 2452, 2615, 2763, 2743, 2599, 2599, 2615, 2763, 2915, 2893, 2743, 2743, 2763, 2915, 3046, 3036, 2893, 2893, 2915, 3046, 3118, 3088, 3036, 3036, 3046, 3118, 3154, 3148, 3088, 3088, 3118, 3154, 3178, 3162, 3148, 3148, 3154, 3178, 3184, 3172, 3162, 3162, 3178, 3184, 2287, 2277, 1792, 1792, 1790, 2287, 2458, 2452, 2277, 2277, 2287, 2458, 2627, 2615, 2452, 2452, 2458, 2627, 2775, 2763, 2615, 2615, 2627, 2775, 2941, 2915, 2763, 2763, 2775, 2941, 3058, 3046, 2915, 2915, 2941, 3058, 3130, 3118, 3046, 3046, 3058, 3130, 3164, 3154, 3118, 3118, 3130, 3164, 3188, 3178, 3154, 3154, 3164, 3188, 3200, 3184, 3178, 3178, 3188, 3200, 2295, 2287, 1790, 1790, 1788, 2295, 2462, 2458, 2287, 2287, 2295, 2462, 2634, 2627, 2458, 2458, 2462, 2634, 2781, 2775, 2627, 2627, 2634, 2781, 2955, 2941, 2775, 2775, 2781, 2955, 3064, 3058, 2941, 2941, 2955, 3064, 3136, 3130, 3058, 3058, 3064, 3136, 3170, 3164, 3130, 3130, 3136, 3170, 3198, 3188, 3164, 3164, 3170, 3198, 3209, 3200, 3188, 3188, 3198, 3209, 2298, 2295, 1788, 1788, 1785, 2298, 2466, 2462, 2295, 2295, 2298, 2466, 2643, 2634, 2462, 2462, 2466, 2643, 2785, 2781, 2634, 2634, 2643, 2785, 2963, 2955, 2781, 2781, 2785, 2963, 3068, 3064, 2955, 2955, 2963, 3068, 3140, 3136, 3064, 3064, 3068, 3140, 3176, 3170, 3136, 3136, 3140, 3176, 3203, 3198, 3170, 3170, 3176, 3203, 3213, 3209, 3198, 3198, 3203, 3213, 3193, 3201, 3212, 3212, 3206, 3193, 3165, 3174, 3201, 3201, 3193, 3165, 3133, 3138, 3174, 3174, 3165, 3133, 3059, 3066, 3138, 3138, 3133, 3059, 2952, 2961, 3066, 3066, 3059, 2952, 2776, 2783, 2961, 2961, 2952, 2776, 2628, 2642, 2783, 2783, 2776, 2628, 2459, 2464, 2642, 2642, 2628, 2459, 2292, 2297, 2464, 2464, 2459, 2292, 1695, 1784, 2297, 2297, 2292, 1695, 3179, 3193, 3206, 3206, 3189, 3179, 3157, 3165, 3193, 3193, 3179, 3157, 3123, 3133, 3165, 3165, 3157, 3123, 3049, 3059, 3133, 3133, 3123, 3049, 2926, 2952, 3059, 3059, 3049, 2926, 2766, 2776, 2952, 2952, 2926, 2766, 2618, 2628, 2776, 2776, 2766, 2618, 2453, 2459, 2628, 2628, 2618, 2453, 2282, 2292, 2459, 2459, 2453, 2282, 1694, 1695, 2292, 2292, 2282, 1694, 3159, 3179, 3189, 3189, 3167, 3159, 3143, 3157, 3179, 3179, 3159, 3143, 3085, 3123, 3157, 3157, 3143, 3085, 3031, 3049, 3123, 3123, 3085, 3031, 2890, 2926, 3049, 3049, 3031, 2890, 2738, 2766, 2926, 2926, 2890, 2738, 2596, 2618, 2766, 2766, 2738, 2596, 2447, 2453, 2618, 2618, 2596, 2447, 2264, 2282, 2453, 2453, 2447, 2264, 1706, 1694, 2282, 2282, 2264, 1706, 3145, 3159, 3167, 3167, 3151, 3145, 3121, 3143, 3159, 3159, 3145, 3121, 3069, 3085, 3143, 3143, 3121, 3069, 2997, 3031, 3085, 3085, 3069, 2997, 2852, 2890, 3031, 3031, 2997, 2852, 2716, 2738, 2890, 2890, 2852, 2716, 2581, 2596, 2738, 2738, 2716, 2581, 2433, 2447, 2596, 2596, 2581, 2433, 2250, 2264, 2447, 2447, 2433, 2250, 1906, 1706, 2264, 2264, 2250, 1906, 3119, 3145, 3151, 3151, 3125, 3119, 3081, 3121, 3145, 3145, 3119, 3081, 3041, 3069, 3121, 3121, 3081, 3041, 2956, 2997, 3069, 3069, 3041, 2956, 2824, 2852, 2997, 2997, 2956, 2824, 2692, 2716, 2852, 2852, 2824, 2692, 2555, 2581, 2716, 2716, 2692, 2555, 2423, 2433, 2581, 2581, 2555, 2423, 2238, 2250, 2433, 2433, 2423, 2238, 1905, 1906, 2250, 2250, 2238, 1905, 3079, 3119, 3125, 3125, 3083, 3079, 3055, 3081, 3119, 3119, 3079, 3055, 3011, 3041, 3081, 3081, 3055, 3011, 2898, 2956, 3041, 3041, 3011, 2898, 2788, 2824, 2956, 2956, 2898, 2788, 2674, 2692, 2824, 2824, 2788, 2674, 2544, 2555, 2692, 2692, 2674, 2544, 2415, 2423, 2555, 2555, 2544, 2415, 2227, 2238, 2423, 2423, 2415, 2227, 1769, 1905, 2238, 2238, 2227, 1769, 3052, 3079, 3083, 3083, 3061, 3052, 3027, 3055, 3079, 3079, 3052, 3027, 2977, 3011, 3055, 3055, 3027, 2977, 2859, 2898, 3011, 3011, 2977, 2859, 2753, 2788, 2898, 2898, 2859, 2753, 2651, 2674, 2788, 2788, 2753, 2651, 2533, 2544, 2674, 2674, 2651, 2533, 2405, 2415, 2544, 2544, 2533, 2405, 2216, 2227, 2415, 2415, 2405, 2216, 1928, 1769, 2227, 2227, 2216, 1928, 3034, 3052, 3061, 3061, 3038, 3034, 2996, 3027, 3052, 3052, 3034, 2996, 2919, 2977, 3027, 3027, 2996, 2919, 2831, 2859, 2977, 2977, 2919, 2831, 2727, 2753, 2859, 2859, 2831, 2727, 2633, 2651, 2753, 2753, 2727, 2633, 2527, 2533, 2651, 2651, 2633, 2527, 2395, 2405, 2533, 2533, 2527, 2395, 2201, 2216, 2405, 2405, 2395, 2201, 1764, 1928, 2216, 2216, 2201, 1764, 3016, 3034, 3038, 3038, 3026, 3016, 2979, 2996, 3034, 3034, 3016, 2979, 2895, 2919, 2996, 2996, 2979, 2895, 2811, 2831, 2919, 2919, 2895, 2811, 2714, 2727, 2831, 2831, 2811, 2714, 2617, 2633, 2727, 2727, 2714, 2617, 2522, 2527, 2633, 2633, 2617, 2522, 2391, 2395, 2527, 2527, 2522, 2391, 2195, 2201, 2395, 2395, 2391, 2195, 1723, 1764, 2201, 2201, 2195, 1723, 3006, 3016, 3026, 3026, 3022, 3006, 2968, 2979, 3016, 3016, 3006, 2968, 2886, 2895, 2979, 2979, 2968, 2886, 2801, 2811, 2895, 2895, 2886, 2801, 2708, 2714, 2811, 2811, 2801, 2708, 2608, 2617, 2714, 2714, 2708, 2608, 2518, 2522, 2617, 2617, 2608, 2518, 2385, 2391, 2522, 2522, 2518, 2385, 2189, 2195, 2391, 2391, 2385, 2189, 1758, 1723, 2195, 2195, 2189, 1758, 1328, 1323, 1784, 1784, 1781, 1328, 1161, 1156, 1323, 1323, 1328, 1161, 992, 981, 1156, 1156, 1161, 992, 844, 837, 981, 981, 992, 844, 668, 659, 837, 837, 844, 668, 541, 534, 659, 659, 668, 541, 489, 484, 534, 534, 541, 489, 437, 428, 484, 484, 489, 437, 403, 395, 428, 428, 437, 403, 386, 375, 395, 395, 403, 386, 1338, 1328, 1781, 1781, 1779, 1338, 1167, 1161, 1328, 1328, 1338, 1167, 1002, 992, 1161, 1161, 1167, 1002, 854, 844, 992, 992, 1002, 854, 694, 668, 844, 844, 854, 694, 558, 541, 668, 668, 694, 558, 499, 489, 541, 541, 558, 499, 445, 437, 489, 489, 499, 445, 415, 403, 437, 437, 445, 415, 407, 386, 403, 403, 415, 407, 1356, 1338, 1779, 1779, 1777, 1356, 1173, 1167, 1338, 1338, 1356, 1173, 1024, 1002, 1167, 1167, 1173, 1024, 882, 854, 1002, 1002, 1024, 882, 730, 694, 854, 854, 882, 730, 582, 558, 694, 694, 730, 582, 515, 499, 558, 558, 582, 515, 466, 445, 499, 499, 515, 466, 443, 415, 445, 445, 466, 443, 435, 407, 415, 415, 443, 435, 1370, 1356, 1777, 1777, 1775, 1370, 1187, 1173, 1356, 1356, 1370, 1187, 1041, 1024, 1173, 1173, 1187, 1041, 904, 882, 1024, 1024, 1041, 904, 768, 730, 882, 882, 904, 768, 623, 582, 730, 730, 768, 623, 531, 515, 582, 582, 623, 531, 501, 466, 515, 515, 531, 501, 458, 443, 466, 466, 501, 458, 451, 435, 443, 443, 458, 451, 1382, 1370, 1775, 1775, 1773, 1382, 1197, 1187, 1370, 1370, 1382, 1197, 1067, 1041, 1187, 1187, 1197, 1067, 928, 904, 1041, 1041, 1067, 928, 796, 768, 904, 904, 928, 796, 664, 623, 768, 768, 796, 664, 568, 531, 623, 623, 664, 568, 519, 501, 531, 531, 568, 519, 503, 458, 501, 501, 519, 503, 497, 451, 458, 458, 503, 497, 1393, 1382, 1773, 1773, 1770, 1393, 1205, 1197, 1382, 1382, 1393, 1205, 1076, 1067, 1197, 1197, 1205, 1076, 946, 928, 1067, 1067, 1076, 946, 832, 796, 928, 928, 946, 832, 722, 664, 796, 796, 832, 722, 609, 568, 664, 664, 722, 609, 548, 519, 568, 568, 609, 548, 521, 503, 519, 519, 548, 521, 517, 497, 503, 503, 521, 517, 1406, 1393, 1770, 1770, 1767, 1406, 1215, 1205, 1393, 1393, 1406, 1215, 1089, 1076, 1205, 1205, 1215, 1089, 971, 946, 1076, 1076, 1089, 971, 869, 832, 946, 946, 971, 869, 763, 722, 832, 832, 869, 763, 645, 609, 722, 722, 763, 645, 586, 548, 609, 609, 645, 586, 555, 521, 548, 548, 586, 555, 539, 517, 521, 521, 555, 539, 1419, 1406, 1767, 1767, 1763, 1419, 1225, 1215, 1406, 1406, 1419, 1225, 1095, 1089, 1215, 1215, 1225, 1095, 989, 971, 1089, 1089, 1095, 989, 895, 869, 971, 971, 989, 895, 791, 763, 869, 869, 895, 791, 703, 645, 763, 763, 791, 703, 626, 586, 645, 645, 703, 626, 581, 555, 586, 586, 626, 581, 573, 539, 555, 555, 581, 573, 1425, 1419, 1763, 1763, 1761, 1425, 1229, 1225, 1419, 1419, 1425, 1229, 1100, 1095, 1225, 1225, 1229, 1100, 1005, 989, 1095, 1095, 1100, 1005, 906, 895, 989, 989, 1005, 906, 811, 791, 895, 895, 906, 811, 727, 703, 791, 791, 811, 727, 643, 626, 703, 703, 727, 643, 606, 581, 626, 626, 643, 606, 591, 573, 581, 581, 606, 591, 1429, 1425, 1761, 1761, 1757, 1429, 1233, 1229, 1425, 1425, 1429, 1233, 1106, 1100, 1229, 1229, 1233, 1106, 1011, 1005, 1100, 1100, 1106, 1011, 911, 906, 1005, 1005, 1011, 911, 818, 811, 906, 906, 911, 818, 737, 727, 811, 811, 818, 737, 650, 643, 727, 727, 737, 650, 617, 606, 643, 643, 650, 617, 600, 591, 606, 606, 617, 600, 404, 396, 375, 375, 387, 404, 438, 429, 396, 396, 404, 438, 490, 485, 429, 429, 438, 490, 542, 535, 485, 485, 490, 542, 669, 660, 535, 535, 542, 669, 845, 838, 660, 660, 669, 845, 993, 979, 838, 838, 845, 993, 1162, 1157, 979, 979, 993, 1162, 1329, 1324, 1157, 1157, 1162, 1329, 1925, 1785, 1324, 1324, 1329, 1925, 416, 404, 387, 387, 408, 416, 446, 438, 404, 404, 416, 446, 500, 490, 438, 438, 446, 500, 559, 542, 490, 490, 500, 559, 695, 669, 542, 542, 559, 695, 855, 845, 669, 669, 695, 855, 1003, 993, 845, 845, 855, 1003, 1168, 1162, 993, 993, 1003, 1168, 1339, 1329, 1162, 1162, 1168, 1339, 1924, 1925, 1329, 1329, 1339, 1924, 444, 416, 408, 408, 436, 444, 467, 446, 416, 416, 444, 467, 516, 500, 446, 446, 467, 516, 583, 559, 500, 500, 516, 583, 731, 695, 559, 559, 583, 731, 883, 855, 695, 695, 731, 883, 1025, 1003, 855, 855, 883, 1025, 1174, 1168, 1003, 1003, 1025, 1174, 1357, 1339, 1168, 1168, 1174, 1357, 1907, 1924, 1339, 1339, 1357, 1907, 459, 444, 436, 436, 452, 459, 502, 467, 444, 444, 459, 502, 532, 516, 467, 467, 502, 532, 624, 583, 516, 516, 532, 624, 769, 731, 583, 583, 624, 769, 905, 883, 731, 731, 769, 905, 1040, 1025, 883, 883, 905, 1040, 1188, 1174, 1025, 1025, 1040, 1188, 1371, 1357, 1174, 1174, 1188, 1371, 1705, 1907, 1357, 1357, 1371, 1705, 504, 459, 452, 452, 498, 504, 520, 502, 459, 459, 504, 520, 569, 532, 502, 502, 520, 569, 665, 624, 532, 532, 569, 665, 797, 769, 624, 624, 665, 797, 929, 905, 769, 769, 797, 929, 1066, 1040, 905, 905, 929, 1066, 1198, 1188, 1040, 1040, 1066, 1198, 1383, 1371, 1188, 1188, 1198, 1383, 1704, 1705, 1371, 1371, 1383, 1704, 522, 504, 498, 498, 518, 522, 549, 520, 504, 504, 522, 549, 610, 569, 520, 520, 549, 610, 723, 665, 569, 569, 610, 723, 833, 797, 665, 665, 723, 833, 947, 929, 797, 797, 833, 947, 1077, 1066, 929, 929, 947, 1077, 1206, 1198, 1066, 1066, 1077, 1206, 1394, 1383, 1198, 1198, 1206, 1394, 1772, 1704, 1383, 1383, 1394, 1772, 554, 522, 518, 518, 540, 554, 587, 549, 522, 522, 554, 587, 644, 610, 549, 549, 587, 644, 762, 723, 610, 610, 644, 762, 868, 833, 723, 723, 762, 868, 970, 947, 833, 833, 868, 970, 1088, 1077, 947, 947, 970, 1088, 1216, 1206, 1077, 1077, 1088, 1216, 1405, 1394, 1206, 1206, 1216, 1405, 1691, 1772, 1394, 1394, 1405, 1691, 580, 554, 540, 540, 572, 580, 625, 587, 554, 554, 580, 625, 702, 644, 587, 587, 625, 702, 790, 762, 644, 644, 702, 790, 894, 868, 762, 762, 790, 894, 988, 970, 868, 868, 894, 988, 1094, 1088, 970, 970, 988, 1094, 1226, 1216, 1088, 1088, 1094, 1226, 1420, 1405, 1216, 1216, 1226, 1420, 1765, 1691, 1405, 1405, 1420, 1765, 605, 580, 572, 572, 590, 605, 642, 625, 580, 580, 605, 642, 726, 702, 625, 625, 642, 726, 810, 790, 702, 702, 726, 810, 907, 894, 790, 790, 810, 907, 1004, 988, 894, 894, 907, 1004, 1099, 1094, 988, 988, 1004, 1099, 1230, 1226, 1094, 1094, 1099, 1230, 1426, 1420, 1226, 1226, 1230, 1426, 1896, 1765, 1420, 1420, 1426, 1896, 614, 605, 590, 590, 597, 614, 652, 642, 605, 605, 614, 652, 734, 726, 642, 642, 652, 734, 819, 810, 726, 726, 734, 819, 912, 907, 810, 810, 819, 912, 1012, 1004, 907, 907, 912, 1012, 1102, 1099, 1004, 1004, 1012, 1102, 1235, 1230, 1099, 1099, 1102, 1235, 1431, 1426, 1230, 1230, 1235, 1431, 1759, 1896, 1426, 1426, 1431, 1759, 2293, 2298, 1785, 1785, 1782, 2293, 2460, 2465, 2298, 2298, 2293, 2460, 2629, 2640, 2465, 2465, 2460, 2629, 2777, 2784, 2640, 2640, 2629, 2777, 2953, 2962, 2784, 2784, 2777, 2953, 3060, 3067, 2962, 2962, 2953, 3060, 3134, 3139, 3067, 3067, 3060, 3134, 3166, 3175, 3139, 3139, 3134, 3166, 3194, 3202, 3175, 3175, 3166, 3194, 3207, 3212, 3202, 3202, 3194, 3207, 2283, 2293, 1782, 1782, 1780, 2283, 2454, 2460, 2293, 2293, 2283, 2454, 2619, 2629, 2460, 2460, 2454, 2619, 2767, 2777, 2629, 2629, 2619, 2767, 2927, 2953, 2777, 2777, 2767, 2927, 3050, 3060, 2953, 2953, 2927, 3050, 3124, 3134, 3060, 3060, 3050, 3124, 3158, 3166, 3134, 3134, 3124, 3158, 3180, 3194, 3166, 3166, 3158, 3180, 3190, 3207, 3194, 3194, 3180, 3190, 2265, 2283, 1780, 1780, 1778, 2265, 2448, 2454, 2283, 2283, 2265, 2448, 2597, 2619, 2454, 2454, 2448, 2597, 2739, 2767, 2619, 2619, 2597, 2739, 2891, 2927, 2767, 2767, 2739, 2891, 3032, 3050, 2927, 2927, 2891, 3032, 3086, 3124, 3050, 3050, 3032, 3086, 3144, 3158, 3124, 3124, 3086, 3144, 3160, 3180, 3158, 3158, 3144, 3160, 3168, 3190, 3180, 3180, 3160, 3168, 2251, 2265, 1778, 1778, 1776, 2251, 2434, 2448, 2265, 2265, 2251, 2434, 2580, 2597, 2448, 2448, 2434, 2580, 2717, 2739, 2597, 2597, 2580, 2717, 2853, 2891, 2739, 2739, 2717, 2853, 2998, 3032, 2891, 2891, 2853, 2998, 3070, 3086, 3032, 3032, 2998, 3070, 3122, 3144, 3086, 3086, 3070, 3122, 3146, 3160, 3144, 3144, 3122, 3146, 3152, 3168, 3160, 3160, 3146, 3152, 2239, 2251, 1776, 1776, 1774, 2239, 2424, 2434, 2251, 2251, 2239, 2424, 2554, 2580, 2434, 2434, 2424, 2554, 2693, 2717, 2580, 2580, 2554, 2693, 2825, 2853, 2717, 2717, 2693, 2825, 2957, 2998, 2853, 2853, 2825, 2957, 3042, 3070, 2998, 2998, 2957, 3042, 3082, 3122, 3070, 3070, 3042, 3082, 3120, 3146, 3122, 3122, 3082, 3120, 3126, 3152, 3146, 3146, 3120, 3126, 2228, 2239, 1774, 1774, 1771, 2228, 2416, 2424, 2239, 2239, 2228, 2416, 2545, 2554, 2424, 2424, 2416, 2545, 2675, 2693, 2554, 2554, 2545, 2675, 2789, 2825, 2693, 2693, 2675, 2789, 2899, 2957, 2825, 2825, 2789, 2899, 3012, 3042, 2957, 2957, 2899, 3012, 3056, 3082, 3042, 3042, 3012, 3056, 3080, 3120, 3082, 3082, 3056, 3080, 3084, 3126, 3120, 3120, 3080, 3084, 2215, 2228, 1771, 1771, 1768, 2215, 2406, 2416, 2228, 2228, 2215, 2406, 2532, 2545, 2416, 2416, 2406, 2532, 2650, 2675, 2545, 2545, 2532, 2650, 2752, 2789, 2675, 2675, 2650, 2752, 2858, 2899, 2789, 2789, 2752, 2858, 2976, 3012, 2899, 2899, 2858, 2976, 3028, 3056, 3012, 3012, 2976, 3028, 3051, 3080, 3056, 3056, 3028, 3051, 3062, 3084, 3080, 3080, 3051, 3062, 2202, 2215, 1768, 1768, 1766, 2202, 2396, 2406, 2215, 2215, 2202, 2396, 2526, 2532, 2406, 2406, 2396, 2526, 2632, 2650, 2532, 2532, 2526, 2632, 2726, 2752, 2650, 2650, 2632, 2726, 2830, 2858, 2752, 2752, 2726, 2830, 2918, 2976, 2858, 2858, 2830, 2918, 2995, 3028, 2976, 2976, 2918, 2995, 3033, 3051, 3028, 3028, 2995, 3033, 3037, 3062, 3051, 3051, 3033, 3037, 2196, 2202, 1766, 1766, 1762, 2196, 2392, 2396, 2202, 2202, 2196, 2392, 2521, 2526, 2396, 2396, 2392, 2521, 2616, 2632, 2526, 2526, 2521, 2616, 2715, 2726, 2632, 2632, 2616, 2715, 2810, 2830, 2726, 2726, 2715, 2810, 2894, 2918, 2830, 2830, 2810, 2894, 2978, 2995, 2918, 2918, 2894, 2978, 3015, 3033, 2995, 2995, 2978, 3015, 3025, 3037, 3033, 3033, 3015, 3025, 2192, 2196, 1762, 1762, 1760, 2192, 2388, 2392, 2196, 2196, 2192, 2388, 2515, 2521, 2392, 2392, 2388, 2515, 2609, 2616, 2521, 2521, 2515, 2609, 2709, 2715, 2616, 2616, 2609, 2709, 2802, 2810, 2715, 2715, 2709, 2802, 2884, 2894, 2810, 2810, 2802, 2884, 2970, 2978, 2894, 2894, 2884, 2970, 3004, 3015, 2978, 2978, 2970, 3004, 3021, 3025, 3015, 3015, 3004, 3021, 460, 544, 543, 543, 455, 460, 462, 550, 544, 544, 460, 462, 464, 556, 550, 550, 462, 464, 468, 566, 556, 556, 464, 468, 470, 574, 566, 566, 468, 470, 472, 576, 574, 574, 470, 472, 474, 588, 576, 576, 472, 474, 476, 592, 588, 588, 474, 476, 478, 594, 592, 592, 476, 478, 480, 598, 594, 594, 478, 480, 388, 460, 455, 455, 391, 388, 385, 462, 460, 460, 388, 385, 378, 464, 462, 462, 385, 378, 372, 468, 464, 464, 378, 372, 370, 470, 468, 468, 372, 370, 368, 472, 470, 470, 370, 368, 365, 474, 472, 472, 368, 365, 363, 476, 474, 474, 365, 363, 361, 478, 476, 476, 363, 361, 360, 480, 478, 478, 361, 360, 334, 388, 391, 391, 336, 334, 332, 385, 388, 388, 334, 332, 330, 378, 385, 385, 332, 330, 328, 372, 378, 378, 330, 328, 327, 370, 372, 372, 328, 327, 324, 368, 370, 370, 327, 324, 322, 365, 368, 368, 324, 322, 320, 363, 365, 365, 322, 320, 318, 361, 363, 363, 320, 318, 315, 360, 361, 361, 318, 315, 297, 334, 336, 336, 301, 297, 289, 332, 334, 334, 297, 289, 287, 330, 332, 332, 289, 287, 285, 328, 330, 330, 287, 285, 280, 327, 328, 328, 285, 280, 274, 324, 327, 327, 280, 274, 264, 322, 324, 324, 274, 264, 258, 320, 322, 322, 264, 258, 254, 318, 320, 320, 258, 254, 248, 315, 318, 318, 254, 248, 268, 297, 301, 301, 270, 268, 260, 289, 297, 297, 268, 260, 250, 287, 289, 289, 260, 250, 237, 285, 287, 287, 250, 237, 229, 280, 285, 285, 237, 229, 217, 274, 280, 280, 229, 217, 207, 264, 274, 274, 217, 207, 195, 258, 264, 264, 207, 195, 185, 254, 258, 258, 195, 185, 180, 248, 254, 254, 185, 180, 227, 268, 270, 270, 233, 227, 221, 260, 268, 268, 227, 221, 211, 250, 260, 260, 221, 211, 199, 237, 250, 250, 211, 199, 176, 229, 237, 237, 199, 176, 159, 217, 229, 229, 176, 159, 133, 207, 217, 217, 159, 133, 111, 195, 207, 207, 133, 111, 101, 185, 195, 195, 111, 101, 95, 180, 185, 185, 101, 95, 197, 227, 233, 233, 204, 197, 181, 221, 227, 227, 197, 181, 167, 211, 221, 221, 181, 167, 145, 199, 211, 211, 167, 145, 117, 176, 199, 199, 145, 117, 91, 159, 176, 176, 117, 91, 73, 133, 159, 159, 91, 73, 62, 111, 133, 133, 73, 62, 52, 101, 111, 111, 62, 52, 49, 95, 101, 101, 52, 49, 166, 197, 204, 204, 169, 166, 153, 181, 197, 197, 166, 153, 125, 167, 181, 181, 153, 125, 99, 145, 167, 167, 125, 99, 82, 117, 145, 145, 99, 82, 60, 91, 117, 117, 82, 60, 45, 73, 91, 91, 60, 45, 31, 62, 73, 73, 45, 31, 24, 52, 62, 62, 31, 24, 20, 49, 52, 52, 24, 20, 142, 166, 169, 169, 149, 142, 123, 153, 166, 166, 142, 123, 103, 125, 153, 153, 123, 103, 83, 99, 125, 125, 103, 83, 64, 82, 99, 99, 83, 64, 43, 60, 82, 82, 64, 43, 29, 45, 60, 60, 43, 29, 16, 31, 45, 45, 29, 16, 8, 24, 31, 31, 16, 8, 4, 20, 24, 24, 8, 4, 131, 142, 149, 149, 139, 131, 115, 123, 142, 142, 131, 115, 93, 103, 123, 123, 115, 93, 75, 83, 103, 103, 93, 75, 54, 64, 83, 83, 75, 54, 39, 43, 64, 64, 54, 39, 21, 29, 43, 43, 39, 21, 10, 16, 29, 29, 21, 10, 1, 8, 16, 16, 10, 1, 0, 4, 8, 8, 1, 0, 479, 595, 598, 598, 480, 479, 477, 593, 595, 595, 479, 477, 475, 589, 593, 593, 477, 475, 473, 577, 589, 589, 475, 473, 471, 575, 577, 577, 473, 471, 469, 567, 575, 575, 471, 469, 465, 557, 567, 567, 469, 465, 463, 551, 557, 557, 465, 463, 461, 545, 551, 551, 463, 461, 455, 543, 545, 545, 461, 455, 362, 479, 480, 480, 359, 362, 364, 477, 479, 479, 362, 364, 366, 475, 477, 477, 364, 366, 367, 473, 475, 475, 366, 367, 369, 471, 473, 473, 367, 369, 371, 469, 471, 471, 369, 371, 379, 465, 469, 469, 371, 379, 384, 463, 465, 465, 379, 384, 389, 461, 463, 463, 384, 389, 390, 455, 461, 461, 389, 390, 319, 362, 359, 359, 315, 319, 321, 364, 362, 362, 319, 321, 323, 366, 364, 364, 321, 323, 325, 367, 366, 366, 323, 325, 326, 369, 367, 367, 325, 326, 329, 371, 369, 369, 326, 329, 331, 379, 371, 371, 329, 331, 333, 384, 379, 379, 331, 333, 335, 389, 384, 384, 333, 335, 336, 390, 389, 389, 335, 336, 255, 319, 315, 315, 249, 255, 259, 321, 319, 319, 255, 259, 265, 323, 321, 321, 259, 265, 275, 325, 323, 323, 265, 275, 281, 326, 325, 325, 275, 281, 286, 329, 326, 326, 281, 286, 288, 331, 329, 329, 286, 288, 290, 333, 331, 331, 288, 290, 298, 335, 333, 333, 290, 298, 302, 336, 335, 335, 298, 302, 186, 255, 249, 249, 180, 186, 196, 259, 255, 255, 186, 196, 208, 265, 259, 259, 196, 208, 218, 275, 265, 265, 208, 218, 230, 281, 275, 275, 218, 230, 238, 286, 281, 281, 230, 238, 251, 288, 286, 286, 238, 251, 261, 290, 288, 288, 251, 261, 269, 298, 290, 290, 261, 269, 271, 302, 298, 298, 269, 271, 102, 186, 180, 180, 96, 102, 112, 196, 186, 186, 102, 112, 134, 208, 196, 196, 112, 134, 160, 218, 208, 208, 134, 160, 177, 230, 218, 218, 160, 177, 200, 238, 230, 230, 177, 200, 212, 251, 238, 238, 200, 212, 222, 261, 251, 251, 212, 222, 228, 269, 261, 261, 222, 228, 234, 271, 269, 269, 228, 234, 53, 102, 96, 96, 49, 53, 63, 112, 102, 102, 53, 63, 74, 134, 112, 112, 63, 74, 92, 160, 134, 134, 74, 92, 118, 177, 160, 160, 92, 118, 146, 200, 177, 177, 118, 146, 168, 212, 200, 200, 146, 168, 182, 222, 212, 212, 168, 182, 198, 228, 222, 222, 182, 198, 204, 234, 228, 228, 198, 204, 23, 53, 49, 49, 20, 23, 32, 63, 53, 53, 23, 32, 46, 74, 63, 63, 32, 46, 61, 92, 74, 74, 46, 61, 81, 118, 92, 92, 61, 81, 100, 146, 118, 118, 81, 100, 126, 168, 146, 146, 100, 126, 154, 182, 168, 168, 126, 154, 165, 198, 182, 182, 154, 165, 170, 204, 198, 198, 165, 170, 9, 23, 20, 20, 5, 9, 17, 32, 23, 23, 9, 17, 30, 46, 32, 32, 17, 30, 44, 61, 46, 46, 30, 44, 65, 81, 61, 61, 44, 65, 84, 100, 81, 81, 65, 84, 104, 126, 100, 100, 84, 104, 124, 154, 126, 126, 104, 124, 143, 165, 154, 154, 124, 143, 150, 170, 165, 165, 143, 150, 2, 9, 5, 5, 0, 2, 11, 17, 9, 9, 2, 11, 22, 30, 17, 17, 11, 22, 40, 44, 30, 30, 22, 40, 55, 65, 44, 44, 40, 55, 76, 84, 65, 65, 55, 76, 94, 104, 84, 84, 76, 94, 116, 124, 104, 104, 94, 116, 132, 143, 124, 124, 116, 132, 139, 150, 143, 143, 132, 139, 137, 131, 139, 139, 144, 137, 121, 115, 131, 131, 137, 121, 97, 93, 115, 115, 121, 97, 79, 75, 93, 93, 97, 79, 59, 54, 75, 75, 79, 59, 41, 39, 54, 54, 59, 41, 27, 21, 39, 39, 41, 27, 12, 10, 21, 21, 27, 12, 6, 1, 10, 10, 12, 6, 3, 0, 1, 1, 6, 3, 151, 137, 144, 144, 157, 151, 135, 121, 137, 137, 151, 135, 107, 97, 121, 121, 135, 107, 88, 79, 97, 97, 107, 88, 69, 59, 79, 79, 88, 69, 51, 41, 59, 59, 69, 51, 37, 27, 41, 41, 51, 37, 25, 12, 27, 27, 37, 25, 18, 6, 12, 12, 25, 18, 14, 3, 6, 6, 18, 14, 172, 151, 157, 157, 175, 172, 161, 135, 151, 151, 172, 161, 141, 107, 135, 135, 161, 141, 110, 88, 107, 107, 141, 110, 90, 69, 88, 88, 110, 90, 72, 51, 69, 69, 90, 72, 57, 37, 51, 51, 72, 57, 47, 25, 37, 37, 57, 47, 36, 18, 25, 25, 47, 36, 34, 14, 18, 18, 36, 34, 193, 172, 175, 175, 201, 193, 183, 161, 172, 172, 193, 183, 173, 141, 161, 161, 183, 173, 155, 110, 141, 141, 173, 155, 127, 90, 110, 110, 155, 127, 105, 72, 90, 90, 127, 105, 85, 57, 72, 72, 105, 85, 77, 47, 57, 57, 85, 77, 67, 36, 47, 47, 77, 67, 66, 34, 36, 36, 67, 66, 220, 193, 201, 201, 224, 220, 215, 183, 193, 193, 220, 215, 205, 173, 183, 183, 215, 205, 191, 155, 173, 173, 205, 191, 179, 127, 155, 155, 191, 179, 163, 105, 127, 127, 179, 163, 147, 85, 105, 105, 163, 147, 129, 77, 85, 85, 147, 129, 120, 67, 77, 77, 129, 120, 114, 66, 67, 67, 120, 114, 243, 220, 224, 224, 246, 243, 239, 215, 220, 220, 243, 239, 235, 205, 215, 215, 239, 235, 232, 191, 205, 205, 235, 232, 226, 179, 191, 191, 232, 226, 214, 163, 179, 179, 226, 214, 209, 147, 163, 163, 214, 209, 202, 129, 147, 147, 209, 202, 190, 120, 129, 129, 202, 190, 187, 114, 120, 120, 190, 187, 283, 243, 246, 246, 284, 283, 278, 239, 243, 243, 283, 278, 276, 235, 239, 239, 278, 276, 272, 232, 235, 235, 276, 272, 266, 226, 232, 232, 272, 266, 262, 214, 226, 226, 266, 262, 257, 209, 214, 214, 262, 257, 252, 202, 209, 209, 257, 252, 244, 190, 202, 202, 252, 244, 241, 187, 190, 190, 244, 241, 314, 283, 284, 284, 317, 314, 311, 278, 283, 283, 314, 311, 310, 276, 278, 278, 311, 310, 308, 272, 276, 276, 310, 308, 306, 266, 272, 272, 308, 306, 304, 262, 266, 266, 306, 304, 300, 257, 262, 262, 304, 300, 296, 252, 257, 257, 300, 296, 294, 244, 252, 252, 296, 294, 292, 241, 244, 244, 294, 292, 340, 314, 317, 317, 338, 340, 342, 311, 314, 314, 340, 342, 344, 310, 311, 311, 342, 344, 346, 308, 310, 310, 344, 346, 348, 306, 308, 308, 346, 348, 350, 304, 306, 306, 348, 350, 352, 300, 304, 304, 350, 352, 354, 296, 300, 300, 352, 354, 356, 294, 296, 296, 354, 356, 358, 292, 294, 294, 356, 358, 377, 340, 338, 338, 375, 377, 383, 342, 340, 340, 377, 383, 393, 344, 342, 342, 383, 393, 402, 346, 344, 344, 393, 402, 405, 348, 346, 346, 402, 405, 414, 350, 348, 348, 405, 414, 418, 352, 350, 350, 414, 418, 422, 354, 352, 352, 418, 422, 424, 356, 354, 354, 422, 424, 426, 358, 356, 356, 424, 426, 7, 2, 0, 0, 3, 7, 13, 11, 2, 2, 7, 13, 28, 22, 11, 11, 13, 28, 42, 40, 22, 22, 28, 42, 58, 55, 40, 40, 42, 58, 80, 76, 55, 55, 58, 80, 98, 94, 76, 76, 80, 98, 122, 116, 94, 94, 98, 122, 138, 132, 116, 116, 122, 138, 144, 139, 132, 132, 138, 144, 19, 7, 3, 3, 15, 19, 26, 13, 7, 7, 19, 26, 38, 28, 13, 13, 26, 38, 50, 42, 28, 28, 38, 50, 70, 58, 42, 42, 50, 70, 87, 80, 58, 58, 70, 87, 108, 98, 80, 80, 87, 108, 136, 122, 98, 98, 108, 136, 152, 138, 122, 122, 136, 152, 158, 144, 138, 138, 152, 158, 35, 19, 15, 15, 33, 35, 48, 26, 19, 19, 35, 48, 56, 38, 26, 26, 48, 56, 71, 50, 38, 38, 56, 71, 89, 70, 50, 50, 71, 89, 109, 87, 70, 70, 89, 109, 140, 108, 87, 87, 109, 140, 162, 136, 108, 108, 140, 162, 171, 152, 136, 136, 162, 171, 175, 158, 152, 152, 171, 175, 68, 35, 33, 33, 66, 68, 78, 48, 35, 35, 68, 78, 86, 56, 48, 48, 78, 86, 106, 71, 56, 56, 86, 106, 128, 89, 71, 71, 106, 128, 156, 109, 89, 89, 128, 156, 174, 140, 109, 109, 156, 174, 184, 162, 140, 140, 174, 184, 194, 171, 162, 162, 184, 194, 201, 175, 171, 171, 194, 201, 119, 68, 66, 66, 113, 119, 130, 78, 68, 68, 119, 130, 148, 86, 78, 78, 130, 148, 164, 106, 86, 86, 148, 164, 178, 128, 106, 106, 164, 178, 192, 156, 128, 128, 178, 192, 206, 174, 156, 156, 192, 206, 216, 184, 174, 174, 206, 216, 219, 194, 184, 184, 216, 219, 223, 201, 194, 194, 219, 223, 189, 119, 113, 113, 188, 189, 203, 130, 119, 119, 189, 203, 210, 148, 130, 130, 203, 210, 213, 164, 148, 148, 210, 213, 225, 178, 164, 164, 213, 225, 231, 192, 178, 178, 225, 231, 236, 206, 192, 192, 231, 236, 240, 216, 206, 206, 236, 240, 242, 219, 216, 216, 240, 242, 247, 223, 219, 219, 242, 247, 245, 189, 188, 188, 241, 245, 253, 203, 189, 189, 245, 253, 256, 210, 203, 203, 253, 256, 263, 213, 210, 210, 256, 263, 267, 225, 213, 213, 263, 267, 273, 231, 225, 225, 267, 273, 277, 236, 231, 231, 273, 277, 279, 240, 236, 236, 277, 279, 282, 242, 240, 240, 279, 282, 284, 247, 242, 242, 282, 284, 293, 245, 241, 241, 291, 293, 295, 253, 245, 245, 293, 295, 299, 256, 253, 253, 295, 299, 303, 263, 256, 256, 299, 303, 305, 267, 263, 263, 303, 305, 307, 273, 267, 267, 305, 307, 309, 277, 273, 273, 307, 309, 312, 279, 277, 277, 309, 312, 313, 282, 279, 279, 312, 313, 316, 284, 282, 282, 313, 316, 355, 293, 291, 291, 357, 355, 353, 295, 293, 293, 355, 353, 351, 299, 295, 295, 353, 351, 349, 303, 299, 299, 351, 349, 347, 305, 303, 303, 349, 347, 345, 307, 305, 305, 347, 345, 343, 309, 307, 307, 345, 343, 341, 312, 309, 309, 343, 341, 339, 313, 312, 312, 341, 339, 337, 316, 313, 313, 339, 337, 423, 355, 357, 357, 425, 423, 421, 353, 355, 355, 423, 421, 417, 351, 353, 353, 421, 417, 413, 349, 351, 351, 417, 413, 406, 347, 349, 349, 413, 406, 401, 345, 347, 347, 406, 401, 392, 343, 345, 345, 401, 392, 382, 341, 343, 343, 392, 382, 376, 339, 341, 341, 382, 376, 374, 337, 339, 339, 376, 374, 3185, 3112, 3114, 3114, 3181, 3185, 3191, 3109, 3112, 3112, 3185, 3191, 3195, 3108, 3109, 3109, 3191, 3195, 3204, 3105, 3108, 3108, 3195, 3204, 3210, 3103, 3105, 3105, 3204, 3210, 3214, 3101, 3103, 3103, 3210, 3214, 3216, 3100, 3101, 3101, 3214, 3216, 3219, 3097, 3100, 3100, 3216, 3219, 3221, 3096, 3097, 3097, 3219, 3221, 3222, 3094, 3096, 3096, 3221, 3222, 3226, 3185, 3181, 3181, 3224, 3226, 3228, 3191, 3185, 3185, 3226, 3228, 3230, 3195, 3191, 3191, 3228, 3230, 3232, 3204, 3195, 3195, 3230, 3232, 3234, 3210, 3204, 3204, 3232, 3234, 3240, 3214, 3210, 3210, 3234, 3240, 3244, 3216, 3214, 3214, 3240, 3244, 3248, 3219, 3216, 3216, 3244, 3248, 3250, 3221, 3219, 3219, 3248, 3250, 3252, 3222, 3221, 3221, 3250, 3252, 3238, 3226, 3224, 3224, 3236, 3238, 3242, 3228, 3226, 3226, 3238, 3242, 3246, 3230, 3228, 3228, 3242, 3246, 3256, 3232, 3230, 3230, 3246, 3256, 3262, 3234, 3232, 3232, 3256, 3262, 3270, 3240, 3234, 3234, 3262, 3270, 3278, 3244, 3240, 3240, 3270, 3278, 3284, 3248, 3244, 3244, 3278, 3284, 3292, 3250, 3248, 3248, 3284, 3292, 3296, 3252, 3250, 3250, 3292, 3296, 3258, 3238, 3236, 3236, 3254, 3258, 3260, 3242, 3238, 3238, 3258, 3260, 3264, 3246, 3242, 3242, 3260, 3264, 3274, 3256, 3246, 3246, 3264, 3274, 3286, 3262, 3256, 3256, 3274, 3286, 3302, 3270, 3262, 3262, 3286, 3302, 3313, 3278, 3270, 3270, 3302, 3313, 3319, 3284, 3278, 3278, 3313, 3319, 3329, 3292, 3284, 3284, 3319, 3329, 3331, 3296, 3292, 3292, 3329, 3331, 3269, 3258, 3254, 3254, 3267, 3269, 3272, 3260, 3258, 3258, 3269, 3272, 3282, 3264, 3260, 3260, 3272, 3282, 3298, 3274, 3264, 3264, 3282, 3298, 3307, 3286, 3274, 3274, 3298, 3307, 3321, 3302, 3286, 3286, 3307, 3321, 3337, 3313, 3302, 3302, 3321, 3337, 3345, 3319, 3313, 3313, 3337, 3345, 3350, 3329, 3319, 3319, 3345, 3350, 3354, 3331, 3329, 3329, 3350, 3354, 3281, 3269, 3267, 3267, 3277, 3281, 3289, 3272, 3269, 3269, 3281, 3289, 3301, 3282, 3272, 3272, 3289, 3301, 3311, 3298, 3282, 3282, 3301, 3311, 3323, 3307, 3298, 3298, 3311, 3323, 3339, 3321, 3307, 3307, 3323, 3339, 3352, 3337, 3321, 3321, 3339, 3352, 3367, 3345, 3337, 3337, 3352, 3367, 3372, 3350, 3345, 3345, 3367, 3372, 3378, 3354, 3350, 3350, 3372, 3378, 3294, 3281, 3277, 3277, 3291, 3294, 3305, 3289, 3281, 3281, 3294, 3305, 3315, 3301, 3289, 3289, 3305, 3315, 3325, 3311, 3301, 3301, 3315, 3325, 3344, 3323, 3311, 3311, 3325, 3344, 3358, 3339, 3323, 3323, 3344, 3358, 3375, 3352, 3339, 3339, 3358, 3375, 3393, 3367, 3352, 3352, 3375, 3393, 3403, 3372, 3367, 3367, 3393, 3403, 3405, 3378, 3372, 3372, 3403, 3405, 3309, 3294, 3291, 3291, 3306, 3309, 3317, 3305, 3294, 3294, 3309, 3317, 3335, 3315, 3305, 3305, 3317, 3335, 3347, 3325, 3315, 3315, 3335, 3347, 3368, 3344, 3325, 3325, 3347, 3368, 3388, 3358, 3344, 3344, 3368, 3388, 3424, 3375, 3358, 3358, 3388, 3424, 3448, 3393, 3375, 3375, 3424, 3448, 3467, 3403, 3393, 3393, 3448, 3467, 3471, 3405, 3403, 3403, 3467, 3471, 3334, 3309, 3306, 3306, 3328, 3334, 3342, 3317, 3309, 3309, 3334, 3342, 3361, 3335, 3317, 3317, 3342, 3361, 3385, 3347, 3335, 3335, 3361, 3385, 3421, 3368, 3347, 3347, 3385, 3421, 3463, 3388, 3368, 3368, 3421, 3463, 3489, 3424, 3388, 3388, 3463, 3489, 3504, 3448, 3424, 3424, 3489, 3504, 3520, 3467, 3448, 3448, 3504, 3520, 3522, 3471, 3467, 3467, 3520, 3522, 3363, 3334, 3328, 3328, 3356, 3363, 3381, 3342, 3334, 3334, 3363, 3381, 3415, 3361, 3342, 3342, 3381, 3415, 3464, 3385, 3361, 3361, 3415, 3464, 3494, 3421, 3385, 3385, 3464, 3494, 3527, 3463, 3421, 3421, 3494, 3527, 3552, 3489, 3463, 3463, 3527, 3552, 3578, 3504, 3489, 3489, 3552, 3578, 3591, 3520, 3504, 3504, 3578, 3591, 3603, 3522, 3520, 3520, 3591, 3603, 3220, 3095, 3093, 3093, 3223, 3220, 3218, 3098, 3095, 3095, 3220, 3218, 3217, 3099, 3098, 3098, 3218, 3217, 3215, 3102, 3099, 3099, 3217, 3215, 3211, 3104, 3102, 3102, 3215, 3211, 3205, 3106, 3104, 3104, 3211, 3205, 3196, 3107, 3106, 3106, 3205, 3196, 3192, 3110, 3107, 3107, 3196, 3192, 3186, 3111, 3110, 3110, 3192, 3186, 3182, 3113, 3111, 3111, 3186, 3182, 3251, 3220, 3223, 3223, 3253, 3251, 3249, 3218, 3220, 3220, 3251, 3249, 3245, 3217, 3218, 3218, 3249, 3245, 3241, 3215, 3217, 3217, 3245, 3241, 3235, 3211, 3215, 3215, 3241, 3235, 3233, 3205, 3211, 3211, 3235, 3233, 3231, 3196, 3205, 3205, 3233, 3231, 3229, 3192, 3196, 3196, 3231, 3229, 3227, 3186, 3192, 3192, 3229, 3227, 3225, 3182, 3186, 3186, 3227, 3225, 3293, 3251, 3253, 3253, 3297, 3293, 3285, 3249, 3251, 3251, 3293, 3285, 3279, 3245, 3249, 3249, 3285, 3279, 3271, 3241, 3245, 3245, 3279, 3271, 3263, 3235, 3241, 3241, 3271, 3263, 3257, 3233, 3235, 3235, 3263, 3257, 3247, 3231, 3233, 3233, 3257, 3247, 3243, 3229, 3231, 3231, 3247, 3243, 3239, 3227, 3229, 3229, 3243, 3239, 3237, 3225, 3227, 3227, 3239, 3237, 3330, 3293, 3297, 3297, 3332, 3330, 3320, 3285, 3293, 3293, 3330, 3320, 3314, 3279, 3285, 3285, 3320, 3314, 3303, 3271, 3279, 3279, 3314, 3303, 3287, 3263, 3271, 3271, 3303, 3287, 3275, 3257, 3263, 3263, 3287, 3275, 3265, 3247, 3257, 3257, 3275, 3265, 3261, 3243, 3247, 3247, 3265, 3261, 3259, 3239, 3243, 3243, 3261, 3259, 3255, 3237, 3239, 3239, 3259, 3255, 3349, 3330, 3332, 3332, 3353, 3349, 3346, 3320, 3330, 3330, 3349, 3346, 3338, 3314, 3320, 3320, 3346, 3338, 3322, 3303, 3314, 3314, 3338, 3322, 3308, 3287, 3303, 3303, 3322, 3308, 3299, 3275, 3287, 3287, 3308, 3299, 3283, 3265, 3275, 3275, 3299, 3283, 3273, 3261, 3265, 3265, 3283, 3273, 3268, 3259, 3261, 3261, 3273, 3268, 3266, 3255, 3259, 3259, 3268, 3266, 3371, 3349, 3353, 3353, 3377, 3371, 3366, 3346, 3349, 3349, 3371, 3366, 3351, 3338, 3346, 3346, 3366, 3351, 3340, 3322, 3338, 3338, 3351, 3340, 3324, 3308, 3322, 3322, 3340, 3324, 3312, 3299, 3308, 3308, 3324, 3312, 3300, 3283, 3299, 3299, 3312, 3300, 3288, 3273, 3283, 3283, 3300, 3288, 3280, 3268, 3273, 3273, 3288, 3280, 3276, 3266, 3268, 3268, 3280, 3276, 3402, 3371, 3377, 3377, 3404, 3402, 3392, 3366, 3371, 3371, 3402, 3392, 3376, 3351, 3366, 3366, 3392, 3376, 3359, 3340, 3351, 3351, 3376, 3359, 3343, 3324, 3340, 3340, 3359, 3343, 3326, 3312, 3324, 3324, 3343, 3326, 3316, 3300, 3312, 3312, 3326, 3316, 3304, 3288, 3300, 3300, 3316, 3304, 3295, 3280, 3288, 3288, 3304, 3295, 3290, 3276, 3280, 3280, 3295, 3290, 3468, 3402, 3404, 3404, 3471, 3468, 3449, 3392, 3402, 3402, 3468, 3449, 3425, 3376, 3392, 3392, 3449, 3425, 3389, 3359, 3376, 3376, 3425, 3389, 3369, 3343, 3359, 3359, 3389, 3369, 3348, 3326, 3343, 3343, 3369, 3348, 3336, 3316, 3326, 3326, 3348, 3336, 3318, 3304, 3316, 3316, 3336, 3318, 3310, 3295, 3304, 3304, 3318, 3310, 3306, 3290, 3295, 3295, 3310, 3306, 3519, 3468, 3471, 3471, 3521, 3519, 3503, 3449, 3468, 3468, 3519, 3503, 3488, 3425, 3449, 3449, 3503, 3488, 3462, 3389, 3425, 3425, 3488, 3462, 3420, 3369, 3389, 3389, 3462, 3420, 3384, 3348, 3369, 3369, 3420, 3384, 3360, 3336, 3348, 3348, 3384, 3360, 3341, 3318, 3336, 3336, 3360, 3341, 3333, 3310, 3318, 3318, 3341, 3333, 3327, 3306, 3310, 3310, 3333, 3327, 3590, 3519, 3521, 3521, 3602, 3590, 3577, 3503, 3519, 3519, 3590, 3577, 3551, 3488, 3503, 3503, 3577, 3551, 3529, 3462, 3488, 3488, 3551, 3529, 3498, 3420, 3462, 3462, 3529, 3498, 3466, 3384, 3420, 3420, 3498, 3466, 3414, 3360, 3384, 3384, 3466, 3414, 3380, 3341, 3360, 3360, 3414, 3380, 3362, 3333, 3341, 3341, 3380, 3362, 3355, 3327, 3333, 3333, 3362, 3355, 3373, 3364, 3357, 3357, 3370, 3373, 3394, 3382, 3364, 3364, 3373, 3394, 3442, 3416, 3382, 3382, 3394, 3442, 3480, 3465, 3416, 3416, 3442, 3480, 3513, 3495, 3465, 3465, 3480, 3513, 3544, 3528, 3495, 3495, 3513, 3544, 3572, 3550, 3528, 3528, 3544, 3572, 3596, 3576, 3550, 3550, 3572, 3596, 3612, 3589, 3576, 3576, 3596, 3612, 3618, 3602, 3589, 3589, 3612, 3618, 3386, 3373, 3370, 3370, 3379, 3386, 3412, 3394, 3373, 3373, 3386, 3412, 3460, 3442, 3394, 3394, 3412, 3460, 3492, 3480, 3442, 3442, 3460, 3492, 3523, 3513, 3480, 3480, 3492, 3523, 3555, 3544, 3513, 3513, 3523, 3555, 3583, 3572, 3544, 3544, 3555, 3583, 3610, 3596, 3572, 3572, 3583, 3610, 3627, 3612, 3596, 3596, 3610, 3627, 3631, 3618, 3612, 3612, 3627, 3631, 3397, 3386, 3379, 3379, 3390, 3397, 3434, 3412, 3386, 3386, 3397, 3434, 3472, 3460, 3412, 3412, 3434, 3472, 3499, 3492, 3460, 3460, 3472, 3499, 3530, 3523, 3492, 3492, 3499, 3530, 3561, 3555, 3523, 3523, 3530, 3561, 3594, 3583, 3555, 3555, 3561, 3594, 3616, 3610, 3583, 3583, 3594, 3616, 3632, 3627, 3610, 3610, 3616, 3632, 3640, 3631, 3627, 3627, 3632, 3640, 3408, 3397, 3390, 3390, 3399, 3408, 3446, 3434, 3397, 3397, 3408, 3446, 3476, 3472, 3434, 3434, 3446, 3476, 3505, 3499, 3472, 3472, 3476, 3505, 3539, 3530, 3499, 3499, 3505, 3539, 3566, 3561, 3530, 3530, 3539, 3566, 3600, 3594, 3561, 3561, 3566, 3600, 3623, 3616, 3594, 3594, 3600, 3623, 3638, 3632, 3616, 3616, 3623, 3638, 3643, 3640, 3632, 3632, 3638, 3643, 3432, 3408, 3399, 3399, 3410, 3432, 3452, 3446, 3408, 3408, 3432, 3452, 3482, 3476, 3446, 3446, 3452, 3482, 3509, 3505, 3476, 3476, 3482, 3509, 3542, 3539, 3505, 3505, 3509, 3542, 3568, 3566, 3539, 3539, 3542, 3568, 3598, 3600, 3566, 3566, 3568, 3598, 3621, 3623, 3600, 3600, 3598, 3621, 3636, 3638, 3623, 3623, 3621, 3636, 3641, 3643, 3638, 3638, 3636, 3641, 3438, 3432, 3410, 3410, 3423, 3438, 3457, 3452, 3432, 3432, 3438, 3457, 3486, 3482, 3452, 3452, 3457, 3486, 3512, 3509, 3482, 3482, 3486, 3512, 3541, 3542, 3509, 3509, 3512, 3541, 3565, 3568, 3542, 3542, 3541, 3565, 3592, 3598, 3568, 3568, 3565, 3592, 3615, 3621, 3598, 3598, 3592, 3615, 3629, 3636, 3621, 3621, 3615, 3629, 3635, 3641, 3636, 3636, 3629, 3635, 3440, 3438, 3423, 3423, 3428, 3440, 3458, 3457, 3438, 3438, 3440, 3458, 3484, 3486, 3457, 3457, 3458, 3484, 3507, 3512, 3486, 3486, 3484, 3507, 3532, 3541, 3512, 3512, 3507, 3532, 3557, 3565, 3541, 3541, 3532, 3557, 3581, 3592, 3565, 3565, 3557, 3581, 3606, 3615, 3592, 3592, 3581, 3606, 3619, 3629, 3615, 3615, 3606, 3619, 3625, 3635, 3629, 3629, 3619, 3625, 3436, 3440, 3428, 3428, 3426, 3436, 3454, 3458, 3440, 3440, 3436, 3454, 3478, 3484, 3458, 3458, 3454, 3478, 3501, 3507, 3484, 3484, 3478, 3501, 3525, 3532, 3507, 3507, 3501, 3525, 3546, 3557, 3532, 3532, 3525, 3546, 3570, 3581, 3557, 3557, 3546, 3570, 3587, 3606, 3581, 3581, 3570, 3587, 3604, 3619, 3606, 3606, 3587, 3604, 3608, 3625, 3619, 3619, 3604, 3608, 3418, 3436, 3426, 3426, 3407, 3418, 3444, 3454, 3436, 3436, 3418, 3444, 3469, 3478, 3454, 3454, 3444, 3469, 3491, 3501, 3478, 3478, 3469, 3491, 3516, 3525, 3501, 3501, 3491, 3516, 3535, 3546, 3525, 3525, 3516, 3535, 3553, 3570, 3546, 3546, 3535, 3553, 3574, 3587, 3570, 3570, 3553, 3574, 3579, 3604, 3587, 3587, 3574, 3579, 3586, 3608, 3604, 3604, 3579, 3586, 3400, 3418, 3407, 3407, 3396, 3400, 3430, 3444, 3418, 3418, 3400, 3430, 3450, 3469, 3444, 3444, 3430, 3450, 3474, 3491, 3469, 3469, 3450, 3474, 3496, 3516, 3491, 3491, 3474, 3496, 3517, 3535, 3516, 3516, 3496, 3517, 3536, 3553, 3535, 3535, 3517, 3536, 3548, 3574, 3553, 3553, 3536, 3548, 3559, 3579, 3574, 3574, 3548, 3559, 3563, 3586, 3579, 3579, 3559, 3563, 3613, 3590, 3602, 3602, 3618, 3613, 3597, 3577, 3590, 3590, 3613, 3597, 3573, 3551, 3577, 3577, 3597, 3573, 3545, 3529, 3551, 3551, 3573, 3545, 3514, 3498, 3529, 3529, 3545, 3514, 3481, 3466, 3498, 3498, 3514, 3481, 3443, 3417, 3466, 3466, 3481, 3443, 3395, 3383, 3417, 3417, 3443, 3395, 3374, 3365, 3383, 3383, 3395, 3374, 3370, 3357, 3365, 3365, 3374, 3370, 3628, 3613, 3618, 3618, 3631, 3628, 3611, 3597, 3613, 3613, 3628, 3611, 3584, 3573, 3597, 3597, 3611, 3584, 3556, 3545, 3573, 3573, 3584, 3556, 3524, 3514, 3545, 3545, 3556, 3524, 3493, 3481, 3514, 3514, 3524, 3493, 3461, 3443, 3481, 3481, 3493, 3461, 3413, 3395, 3443, 3443, 3461, 3413, 3387, 3374, 3395, 3395, 3413, 3387, 3379, 3370, 3374, 3374, 3387, 3379, 3633, 3628, 3631, 3631, 3640, 3633, 3617, 3611, 3628, 3628, 3633, 3617, 3595, 3584, 3611, 3611, 3617, 3595, 3562, 3556, 3584, 3584, 3595, 3562, 3531, 3524, 3556, 3556, 3562, 3531, 3500, 3493, 3524, 3524, 3531, 3500, 3473, 3461, 3493, 3493, 3500, 3473, 3435, 3413, 3461, 3461, 3473, 3435, 3398, 3387, 3413, 3413, 3435, 3398, 3391, 3379, 3387, 3387, 3398, 3391, 3639, 3633, 3640, 3640, 3643, 3639, 3624, 3617, 3633, 3633, 3639, 3624, 3601, 3595, 3617, 3617, 3624, 3601, 3567, 3562, 3595, 3595, 3601, 3567, 3538, 3531, 3562, 3562, 3567, 3538, 3506, 3500, 3531, 3531, 3538, 3506, 3477, 3473, 3500, 3500, 3506, 3477, 3447, 3435, 3473, 3473, 3477, 3447, 3409, 3398, 3435, 3435, 3447, 3409, 3399, 3391, 3398, 3398, 3409, 3399, 3637, 3639, 3643, 3643, 3642, 3637, 3622, 3624, 3639, 3639, 3637, 3622, 3599, 3601, 3624, 3624, 3622, 3599, 3569, 3567, 3601, 3601, 3599, 3569, 3543, 3538, 3567, 3567, 3569, 3543, 3510, 3506, 3538, 3538, 3543, 3510, 3483, 3477, 3506, 3506, 3510, 3483, 3453, 3447, 3477, 3477, 3483, 3453, 3433, 3409, 3447, 3447, 3453, 3433, 3411, 3399, 3409, 3409, 3433, 3411, 3630, 3637, 3642, 3642, 3634, 3630, 3614, 3622, 3637, 3637, 3630, 3614, 3593, 3599, 3622, 3622, 3614, 3593, 3564, 3569, 3599, 3599, 3593, 3564, 3540, 3543, 3569, 3569, 3564, 3540, 3511, 3510, 3543, 3543, 3540, 3511, 3487, 3483, 3510, 3510, 3511, 3487, 3456, 3453, 3483, 3483, 3487, 3456, 3439, 3433, 3453, 3453, 3456, 3439, 3422, 3411, 3433, 3433, 3439, 3422, 3620, 3630, 3634, 3634, 3626, 3620, 3607, 3614, 3630, 3630, 3620, 3607, 3582, 3593, 3614, 3614, 3607, 3582, 3558, 3564, 3593, 3593, 3582, 3558, 3533, 3540, 3564, 3564, 3558, 3533, 3508, 3511, 3540, 3540, 3533, 3508, 3485, 3487, 3511, 3511, 3508, 3485, 3459, 3456, 3487, 3487, 3485, 3459, 3441, 3439, 3456, 3456, 3459, 3441, 3429, 3422, 3439, 3439, 3441, 3429, 3605, 3620, 3626, 3626, 3609, 3605, 3588, 3607, 3620, 3620, 3605, 3588, 3571, 3582, 3607, 3607, 3588, 3571, 3547, 3558, 3582, 3582, 3571, 3547, 3526, 3533, 3558, 3558, 3547, 3526, 3502, 3508, 3533, 3533, 3526, 3502, 3479, 3485, 3508, 3508, 3502, 3479, 3455, 3459, 3485, 3485, 3479, 3455, 3437, 3441, 3459, 3459, 3455, 3437, 3427, 3429, 3441, 3441, 3437, 3427, 3580, 3605, 3609, 3609, 3585, 3580, 3575, 3588, 3605, 3605, 3580, 3575, 3554, 3571, 3588, 3588, 3575, 3554, 3534, 3547, 3571, 3571, 3554, 3534, 3515, 3526, 3547, 3547, 3534, 3515, 3490, 3502, 3526, 3526, 3515, 3490, 3470, 3479, 3502, 3502, 3490, 3470, 3445, 3455, 3479, 3479, 3470, 3445, 3419, 3437, 3455, 3455, 3445, 3419, 3406, 3427, 3437, 3437, 3419, 3406, 3560, 3580, 3585, 3585, 3563, 3560, 3549, 3575, 3580, 3580, 3560, 3549, 3537, 3554, 3575, 3575, 3549, 3537, 3518, 3534, 3554, 3554, 3537, 3518, 3497, 3515, 3534, 3534, 3518, 3497, 3475, 3490, 3515, 3515, 3497, 3475, 3451, 3470, 3490, 3490, 3475, 3451, 3431, 3445, 3470, 3470, 3451, 3431, 3401, 3419, 3445, 3445, 3431, 3401, 3396, 3406, 3419, 3419, 3401, 3396, 1887, 2109, 2103, 1887, 2103, 2095, 1887, 2095, 2075, 1887, 2075, 2047, 1887, 2047, 2029, 1887, 2029, 2005, 1887, 2005, 1981, 1887, 1981, 1959, 1887, 1959, 1935, 1887, 1935, 1731, 2256, 2103, 2109, 2109, 2260, 2256, 2248, 2095, 2103, 2103, 2256, 2248, 2225, 2075, 2095, 2095, 2248, 2225, 2199, 2047, 2075, 2075, 2225, 2199, 2141, 2029, 2047, 2047, 2199, 2141, 2093, 2005, 2029, 2029, 2141, 2093, 2035, 1981, 2005, 2005, 2093, 2035, 1987, 1959, 1981, 1981, 2035, 1987, 1947, 1935, 1959, 1959, 1987, 1947, 1727, 1731, 1935, 1935, 1947, 1727, 2309, 2256, 2260, 2260, 2314, 2309, 2299, 2248, 2256, 2256, 2309, 2299, 2278, 2225, 2248, 2248, 2299, 2278, 2242, 2199, 2225, 2225, 2278, 2242, 2203, 2141, 2199, 2199, 2242, 2203, 2131, 2093, 2141, 2141, 2203, 2131, 2066, 2035, 2093, 2093, 2131, 2066, 1999, 1987, 2035, 2035, 2066, 1999, 1955, 1947, 1987, 1987, 1999, 1955, 1733, 1727, 1947, 1947, 1955, 1733, 2311, 2309, 2314, 2314, 2315, 2311, 2301, 2299, 2309, 2309, 2311, 2301, 2280, 2278, 2299, 2299, 2301, 2280, 2244, 2242, 2278, 2278, 2280, 2244, 2205, 2203, 2242, 2242, 2244, 2205, 2133, 2131, 2203, 2203, 2205, 2133, 2067, 2066, 2131, 2131, 2133, 2067, 2001, 1999, 2066, 2066, 2067, 2001, 1957, 1955, 1999, 1999, 2001, 1957, 1877, 1733, 1955, 1955, 1957, 1877, 2284, 2311, 2315, 2315, 2288, 2284, 2258, 2301, 2311, 2311, 2284, 2258, 2240, 2280, 2301, 2301, 2258, 2240, 2213, 2244, 2280, 2280, 2240, 2213, 2167, 2205, 2244, 2244, 2213, 2167, 2105, 2133, 2205, 2205, 2167, 2105, 2041, 2067, 2133, 2133, 2105, 2041, 1993, 2001, 2067, 2067, 2041, 1993, 1951, 1957, 2001, 2001, 1993, 1951, 1730, 1877, 1957, 1957, 1951, 1730, 2219, 2284, 2288, 2288, 2224, 2219, 2209, 2258, 2284, 2284, 2219, 2209, 2185, 2240, 2258, 2258, 2209, 2185, 2145, 2213, 2240, 2240, 2185, 2145, 2107, 2167, 2213, 2213, 2145, 2107, 2059, 2105, 2167, 2167, 2107, 2059, 2017, 2041, 2105, 2105, 2059, 2017, 1977, 1993, 2041, 2041, 2017, 1977, 1943, 1951, 1993, 1993, 1977, 1943, 1726, 1730, 1951, 1951, 1943, 1726, 2140, 2219, 2224, 2224, 2144, 2140, 2126, 2209, 2219, 2219, 2140, 2126, 2111, 2185, 2209, 2209, 2126, 2111, 2083, 2145, 2185, 2185, 2111, 2083, 2043, 2107, 2145, 2145, 2083, 2043, 2023, 2059, 2107, 2107, 2043, 2023, 1991, 2017, 2059, 2059, 2023, 1991, 1969, 1977, 2017, 2017, 1991, 1969, 1941, 1943, 1977, 1977, 1969, 1941, 1720, 1726, 1943, 1943, 1941, 1720, 2078, 2140, 2144, 2144, 2086, 2078, 2074, 2126, 2140, 2140, 2078, 2074, 2054, 2111, 2126, 2126, 2074, 2054, 2038, 2083, 2111, 2111, 2054, 2038, 2020, 2043, 2083, 2083, 2038, 2020, 1995, 2023, 2043, 2043, 2020, 1995, 1973, 1991, 2023, 2023, 1995, 1973, 1953, 1969, 1991, 1991, 1973, 1953, 1933, 1941, 1969, 1969, 1953, 1933, 1719, 1720, 1941, 1941, 1933, 1719, 2062, 2078, 2086, 2086, 2070, 2062, 2050, 2074, 2078, 2078, 2062, 2050, 2040, 2054, 2074, 2074, 2050, 2040, 2028, 2038, 2054, 2054, 2040, 2028, 2012, 2020, 2038, 2038, 2028, 2012, 1990, 1995, 2020, 2020, 2012, 1990, 1971, 1973, 1995, 1995, 1990, 1971, 1949, 1953, 1973, 1973, 1971, 1949, 1931, 1933, 1953, 1953, 1949, 1931, 1700, 1719, 1933, 1933, 1931, 1700, 2114, 2062, 2070, 2070, 2122, 2114, 2100, 2050, 2062, 2062, 2114, 2100, 2080, 2040, 2050, 2050, 2100, 2080, 2056, 2028, 2040, 2040, 2080, 2056, 2032, 2012, 2028, 2028, 2056, 2032, 2008, 1990, 2012, 2012, 2032, 2008, 1983, 1971, 1990, 1990, 2008, 1983, 1963, 1949, 1971, 1971, 1983, 1963, 1937, 1931, 1949, 1949, 1963, 1937, 1697, 1700, 1931, 1931, 1937, 1697, 1887, 1885, 1685, 1887, 1685, 1661, 1887, 1661, 1639, 1887, 1639, 1615, 1887, 1615, 1591, 1887, 1591, 1573, 1887, 1573, 1545, 1887, 1545, 1525, 1887, 1525, 1517, 1887, 1517, 1511, 1673, 1685, 1885, 1885, 1883, 1673, 1633, 1661, 1685, 1685, 1673, 1633, 1585, 1639, 1661, 1661, 1633, 1585, 1527, 1615, 1639, 1639, 1585, 1527, 1479, 1591, 1615, 1615, 1527, 1479, 1421, 1573, 1591, 1591, 1479, 1421, 1395, 1545, 1573, 1573, 1421, 1395, 1372, 1525, 1545, 1545, 1395, 1372, 1364, 1517, 1525, 1525, 1372, 1364, 1360, 1511, 1517, 1517, 1364, 1360, 1665, 1673, 1883, 1883, 1881, 1665, 1621, 1633, 1673, 1673, 1665, 1621, 1556, 1585, 1633, 1633, 1621, 1556, 1489, 1527, 1585, 1585, 1556, 1489, 1417, 1479, 1527, 1527, 1489, 1417, 1378, 1421, 1479, 1479, 1417, 1378, 1342, 1395, 1421, 1421, 1378, 1342, 1321, 1372, 1395, 1395, 1342, 1321, 1311, 1364, 1372, 1372, 1321, 1311, 1308, 1360, 1364, 1364, 1311, 1308, 1663, 1665, 1881, 1881, 1878, 1663, 1619, 1621, 1665, 1665, 1663, 1619, 1553, 1556, 1621, 1621, 1619, 1553, 1487, 1489, 1556, 1556, 1553, 1487, 1415, 1417, 1489, 1489, 1487, 1415, 1376, 1378, 1417, 1417, 1415, 1376, 1340, 1342, 1378, 1378, 1376, 1340, 1319, 1321, 1342, 1342, 1340, 1319, 1309, 1311, 1321, 1321, 1319, 1309, 1305, 1308, 1311, 1311, 1309, 1305, 1669, 1663, 1878, 1878, 1875, 1669, 1627, 1619, 1663, 1663, 1669, 1627, 1579, 1553, 1619, 1619, 1627, 1579, 1515, 1487, 1553, 1553, 1579, 1515, 1453, 1415, 1487, 1487, 1515, 1453, 1407, 1376, 1415, 1415, 1453, 1407, 1380, 1340, 1376, 1376, 1407, 1380, 1362, 1319, 1340, 1340, 1380, 1362, 1336, 1309, 1319, 1319, 1362, 1336, 1332, 1305, 1309, 1309, 1336, 1332, 1677, 1669, 1875, 1875, 1873, 1677, 1643, 1627, 1669, 1669, 1677, 1643, 1603, 1579, 1627, 1627, 1643, 1603, 1561, 1515, 1579, 1579, 1603, 1561, 1513, 1453, 1515, 1515, 1561, 1513, 1475, 1407, 1453, 1453, 1513, 1475, 1435, 1380, 1407, 1407, 1475, 1435, 1411, 1362, 1380, 1380, 1435, 1411, 1401, 1336, 1362, 1362, 1411, 1401, 1398, 1332, 1336, 1336, 1401, 1398, 1679, 1677, 1873, 1873, 1871, 1679, 1651, 1643, 1677, 1677, 1679, 1651, 1629, 1603, 1643, 1643, 1651, 1629, 1597, 1561, 1603, 1603, 1629, 1597, 1577, 1513, 1561, 1561, 1597, 1577, 1537, 1475, 1513, 1513, 1577, 1537, 1509, 1435, 1475, 1475, 1537, 1509, 1496, 1411, 1435, 1435, 1509, 1496, 1482, 1401, 1411, 1411, 1496, 1482, 1478, 1398, 1401, 1401, 1482, 1478, 1687, 1679, 1871, 1871, 1869, 1687, 1667, 1651, 1679, 1679, 1687, 1667, 1647, 1629, 1651, 1651, 1667, 1647, 1625, 1597, 1629, 1629, 1647, 1625, 1602, 1577, 1597, 1597, 1625, 1602, 1584, 1537, 1577, 1577, 1602, 1584, 1568, 1509, 1537, 1537, 1584, 1568, 1548, 1496, 1509, 1509, 1568, 1548, 1544, 1482, 1496, 1496, 1548, 1544, 1536, 1478, 1482, 1482, 1544, 1536, 1689, 1687, 1869, 1869, 1867, 1689, 1671, 1667, 1687, 1687, 1689, 1671, 1649, 1647, 1667, 1667, 1671, 1649, 1632, 1625, 1647, 1647, 1649, 1632, 1610, 1602, 1625, 1625, 1632, 1610, 1594, 1584, 1602, 1602, 1610, 1594, 1582, 1568, 1584, 1584, 1594, 1582, 1572, 1548, 1568, 1568, 1582, 1572, 1560, 1544, 1548, 1548, 1572, 1560, 1552, 1536, 1544, 1544, 1560, 1552, 1683, 1689, 1867, 1867, 1864, 1683, 1657, 1671, 1689, 1689, 1683, 1657, 1637, 1649, 1671, 1671, 1657, 1637, 1614, 1632, 1649, 1649, 1637, 1614, 1590, 1610, 1632, 1632, 1614, 1590, 1566, 1594, 1610, 1610, 1590, 1566, 1542, 1582, 1594, 1594, 1566, 1542, 1522, 1572, 1582, 1582, 1542, 1522, 1508, 1560, 1572, 1572, 1522, 1508, 1500, 1552, 1560, 1560, 1508, 1500, 1887, 1512, 1518, 1887, 1518, 1526, 1887, 1526, 1546, 1887, 1546, 1574, 1887, 1574, 1592, 1887, 1592, 1616, 1887, 1616, 1640, 1887, 1640, 1662, 1887, 1662, 1686, 1887, 1686, 1893, 1365, 1518, 1512, 1512, 1361, 1365, 1373, 1526, 1518, 1518, 1365, 1373, 1396, 1546, 1526, 1526, 1373, 1396, 1422, 1574, 1546, 1546, 1396, 1422, 1480, 1592, 1574, 1574, 1422, 1480, 1528, 1616, 1592, 1592, 1480, 1528, 1586, 1640, 1616, 1616, 1528, 1586, 1634, 1662, 1640, 1640, 1586, 1634, 1674, 1686, 1662, 1662, 1634, 1674, 1894, 1893, 1686, 1686, 1674, 1894, 1312, 1365, 1361, 1361, 1307, 1312, 1322, 1373, 1365, 1365, 1312, 1322, 1343, 1396, 1373, 1373, 1322, 1343, 1379, 1422, 1396, 1396, 1343, 1379, 1418, 1480, 1422, 1422, 1379, 1418, 1490, 1528, 1480, 1480, 1418, 1490, 1555, 1586, 1528, 1528, 1490, 1555, 1622, 1634, 1586, 1586, 1555, 1622, 1666, 1674, 1634, 1634, 1622, 1666, 1889, 1894, 1674, 1674, 1666, 1889, 1310, 1312, 1307, 1307, 1306, 1310, 1320, 1322, 1312, 1312, 1310, 1320, 1341, 1343, 1322, 1322, 1320, 1341, 1377, 1379, 1343, 1343, 1341, 1377, 1416, 1418, 1379, 1379, 1377, 1416, 1488, 1490, 1418, 1418, 1416, 1488, 1554, 1555, 1490, 1490, 1488, 1554, 1620, 1622, 1555, 1555, 1554, 1620, 1664, 1666, 1622, 1622, 1620, 1664, 1880, 1889, 1666, 1666, 1664, 1880, 1337, 1310, 1306, 1306, 1333, 1337, 1363, 1320, 1310, 1310, 1337, 1363, 1381, 1341, 1320, 1320, 1363, 1381, 1408, 1377, 1341, 1341, 1381, 1408, 1454, 1416, 1377, 1377, 1408, 1454, 1516, 1488, 1416, 1416, 1454, 1516, 1580, 1554, 1488, 1488, 1516, 1580, 1628, 1620, 1554, 1554, 1580, 1628, 1670, 1664, 1620, 1620, 1628, 1670, 1892, 1880, 1664, 1664, 1670, 1892, 1402, 1337, 1333, 1333, 1397, 1402, 1412, 1363, 1337, 1337, 1402, 1412, 1436, 1381, 1363, 1363, 1412, 1436, 1476, 1408, 1381, 1381, 1436, 1476, 1514, 1454, 1408, 1408, 1476, 1514, 1562, 1516, 1454, 1454, 1514, 1562, 1604, 1580, 1516, 1516, 1562, 1604, 1644, 1628, 1580, 1580, 1604, 1644, 1678, 1670, 1628, 1628, 1644, 1678, 1899, 1892, 1670, 1670, 1678, 1899, 1481, 1402, 1397, 1397, 1477, 1481, 1495, 1412, 1402, 1402, 1481, 1495, 1510, 1436, 1412, 1412, 1495, 1510, 1538, 1476, 1436, 1436, 1510, 1538, 1578, 1514, 1476, 1476, 1538, 1578, 1598, 1562, 1514, 1514, 1578, 1598, 1630, 1604, 1562, 1562, 1598, 1630, 1652, 1644, 1604, 1604, 1630, 1652, 1680, 1678, 1644, 1644, 1652, 1680, 1901, 1899, 1678, 1678, 1680, 1901, 1543, 1481, 1477, 1477, 1535, 1543, 1547, 1495, 1481, 1481, 1543, 1547, 1567, 1510, 1495, 1495, 1547, 1567, 1583, 1538, 1510, 1510, 1567, 1583, 1601, 1578, 1538, 1538, 1583, 1601, 1626, 1598, 1578, 1578, 1601, 1626, 1648, 1630, 1598, 1598, 1626, 1648, 1668, 1652, 1630, 1630, 1648, 1668, 1688, 1680, 1652, 1652, 1668, 1688, 1920, 1901, 1680, 1680, 1688, 1920, 1559, 1543, 1535, 1535, 1551, 1559, 1571, 1547, 1543, 1543, 1559, 1571, 1581, 1567, 1547, 1547, 1571, 1581, 1593, 1583, 1567, 1567, 1581, 1593, 1609, 1601, 1583, 1583, 1593, 1609, 1631, 1626, 1601, 1601, 1609, 1631, 1650, 1648, 1626, 1626, 1631, 1650, 1672, 1668, 1648, 1648, 1650, 1672, 1690, 1688, 1668, 1668, 1672, 1690, 1921, 1920, 1688, 1688, 1690, 1921, 1507, 1559, 1551, 1551, 1499, 1507, 1521, 1571, 1559, 1559, 1507, 1521, 1541, 1581, 1571, 1571, 1521, 1541, 1565, 1593, 1581, 1581, 1541, 1565, 1589, 1609, 1593, 1593, 1565, 1589, 1613, 1631, 1609, 1609, 1589, 1613, 1638, 1650, 1631, 1631, 1613, 1638, 1658, 1672, 1650, 1650, 1638, 1658, 1684, 1690, 1672, 1672, 1658, 1684, 1927, 1921, 1690, 1690, 1684, 1927, 1887, 1886, 1936, 1887, 1936, 1960, 1887, 1960, 1982, 1887, 1982, 2006, 1887, 2006, 2030, 1887, 2030, 2048, 1887, 2048, 2076, 1887, 2076, 2096, 1887, 2096, 2104, 1887, 2104, 2110, 1948, 1936, 1886, 1886, 1884, 1948, 1988, 1960, 1936, 1936, 1948, 1988, 2036, 1982, 1960, 1960, 1988, 2036, 2094, 2006, 1982, 1982, 2036, 2094, 2142, 2030, 2006, 2006, 2094, 2142, 2200, 2048, 2030, 2030, 2142, 2200, 2226, 2076, 2048, 2048, 2200, 2226, 2249, 2096, 2076, 2076, 2226, 2249, 2257, 2104, 2096, 2096, 2249, 2257, 2261, 2110, 2104, 2104, 2257, 2261, 1956, 1948, 1884, 1884, 1882, 1956, 2000, 1988, 1948, 1948, 1956, 2000, 2065, 2036, 1988, 1988, 2000, 2065, 2132, 2094, 2036, 2036, 2065, 2132, 2204, 2142, 2094, 2094, 2132, 2204, 2243, 2200, 2142, 2142, 2204, 2243, 2279, 2226, 2200, 2200, 2243, 2279, 2300, 2249, 2226, 2226, 2279, 2300, 2310, 2257, 2249, 2249, 2300, 2310, 2313, 2261, 2257, 2257, 2310, 2313, 1958, 1956, 1882, 1882, 1879, 1958, 2002, 2000, 1956, 1956, 1958, 2002, 2068, 2065, 2000, 2000, 2002, 2068, 2134, 2132, 2065, 2065, 2068, 2134, 2206, 2204, 2132, 2132, 2134, 2206, 2245, 2243, 2204, 2204, 2206, 2245, 2281, 2279, 2243, 2243, 2245, 2281, 2302, 2300, 2279, 2279, 2281, 2302, 2312, 2310, 2300, 2300, 2302, 2312, 2316, 2313, 2310, 2310, 2312, 2316, 1952, 1958, 1879, 1879, 1876, 1952, 1994, 2002, 1958, 1958, 1952, 1994, 2042, 2068, 2002, 2002, 1994, 2042, 2106, 2134, 2068, 2068, 2042, 2106, 2168, 2206, 2134, 2134, 2106, 2168, 2214, 2245, 2206, 2206, 2168, 2214, 2241, 2281, 2245, 2245, 2214, 2241, 2259, 2302, 2281, 2281, 2241, 2259, 2285, 2312, 2302, 2302, 2259, 2285, 2289, 2316, 2312, 2312, 2285, 2289, 1944, 1952, 1876, 1876, 1874, 1944, 1978, 1994, 1952, 1952, 1944, 1978, 2018, 2042, 1994, 1994, 1978, 2018, 2060, 2106, 2042, 2042, 2018, 2060, 2108, 2168, 2106, 2106, 2060, 2108, 2146, 2214, 2168, 2168, 2108, 2146, 2186, 2241, 2214, 2214, 2146, 2186, 2210, 2259, 2241, 2241, 2186, 2210, 2220, 2285, 2259, 2259, 2210, 2220, 2223, 2289, 2285, 2285, 2220, 2223, 1942, 1944, 1874, 1874, 1872, 1942, 1970, 1978, 1944, 1944, 1942, 1970, 1992, 2018, 1978, 1978, 1970, 1992, 2024, 2060, 2018, 2018, 1992, 2024, 2044, 2108, 2060, 2060, 2024, 2044, 2084, 2146, 2108, 2108, 2044, 2084, 2112, 2186, 2146, 2146, 2084, 2112, 2125, 2210, 2186, 2186, 2112, 2125, 2139, 2220, 2210, 2210, 2125, 2139, 2143, 2223, 2220, 2220, 2139, 2143, 1934, 1942, 1872, 1872, 1870, 1934, 1954, 1970, 1942, 1942, 1934, 1954, 1974, 1992, 1970, 1970, 1954, 1974, 1996, 2024, 1992, 1992, 1974, 1996, 2019, 2044, 2024, 2024, 1996, 2019, 2037, 2084, 2044, 2044, 2019, 2037, 2053, 2112, 2084, 2084, 2037, 2053, 2073, 2125, 2112, 2112, 2053, 2073, 2077, 2139, 2125, 2125, 2073, 2077, 2085, 2143, 2139, 2139, 2077, 2085, 1932, 1934, 1870, 1870, 1868, 1932, 1950, 1954, 1934, 1934, 1932, 1950, 1972, 1974, 1954, 1954, 1950, 1972, 1989, 1996, 1974, 1974, 1972, 1989, 2011, 2019, 1996, 1996, 1989, 2011, 2027, 2037, 2019, 2019, 2011, 2027, 2039, 2053, 2037, 2037, 2027, 2039, 2049, 2073, 2053, 2053, 2039, 2049, 2061, 2077, 2073, 2073, 2049, 2061, 2069, 2085, 2077, 2077, 2061, 2069, 1938, 1932, 1868, 1868, 1865, 1938, 1964, 1950, 1932, 1932, 1938, 1964, 1984, 1972, 1950, 1950, 1964, 1984, 2007, 1989, 1972, 1972, 1984, 2007, 2031, 2011, 1989, 1989, 2007, 2031, 2055, 2027, 2011, 2011, 2031, 2055, 2079, 2039, 2027, 2027, 2055, 2079, 2099, 2049, 2039, 2039, 2079, 2099, 2113, 2061, 2049, 2049, 2099, 2113, 2121, 2069, 2061, 2061, 2113, 2121, 2231, 2115, 2123, 2123, 2235, 2231, 2217, 2101, 2115, 2115, 2231, 2217, 2198, 2081, 2101, 2101, 2217, 2198, 2149, 2057, 2081, 2081, 2198, 2149, 2119, 2033, 2057, 2057, 2149, 2119, 2063, 2009, 2033, 2033, 2119, 2063, 2022, 1985, 2009, 2009, 2063, 2022, 1979, 1965, 1985, 1985, 2022, 1979, 1945, 1939, 1965, 1965, 1979, 1945, 1861, 1729, 1939, 1939, 1945, 1861, 2331, 2231, 2235, 2235, 2335, 2331, 2321, 2217, 2231, 2231, 2331, 2321, 2305, 2198, 2217, 2217, 2321, 2305, 2274, 2149, 2198, 2198, 2305, 2274, 2233, 2119, 2149, 2149, 2274, 2233, 2169, 2063, 2119, 2119, 2233, 2169, 2092, 2022, 2063, 2063, 2169, 2092, 2015, 1979, 2022, 2022, 2092, 2015, 1967, 1945, 1979, 1979, 2015, 1967, 1857, 1861, 1945, 1945, 1967, 1857, 2408, 2331, 2335, 2335, 2412, 2408, 2399, 2321, 2331, 2331, 2408, 2399, 2375, 2305, 2321, 2321, 2399, 2375, 2348, 2274, 2305, 2305, 2375, 2348, 2323, 2233, 2274, 2274, 2348, 2323, 2270, 2169, 2233, 2233, 2323, 2270, 2184, 2092, 2169, 2169, 2270, 2184, 2071, 2015, 2092, 2092, 2184, 2071, 1975, 1967, 2015, 2015, 2071, 1975, 1728, 1857, 1967, 1967, 1975, 1728, 2487, 2408, 2412, 2412, 2497, 2487, 2469, 2399, 2408, 2408, 2487, 2469, 2443, 2375, 2399, 2399, 2469, 2443, 2417, 2348, 2375, 2375, 2443, 2417, 2383, 2323, 2348, 2348, 2417, 2383, 2337, 2270, 2323, 2323, 2383, 2337, 2268, 2184, 2270, 2270, 2337, 2268, 2137, 2071, 2184, 2184, 2268, 2137, 1997, 1975, 2071, 2071, 2137, 1997, 1721, 1728, 1975, 1975, 1997, 1721, 2558, 2487, 2497, 2497, 2568, 2558, 2548, 2469, 2487, 2487, 2558, 2548, 2530, 2443, 2469, 2469, 2548, 2530, 2491, 2417, 2443, 2443, 2530, 2491, 2435, 2383, 2417, 2417, 2491, 2435, 2393, 2337, 2383, 2383, 2435, 2393, 2325, 2268, 2337, 2337, 2393, 2325, 2211, 2137, 2268, 2268, 2325, 2211, 2025, 1997, 2137, 2137, 2211, 2025, 1849, 1721, 1997, 1997, 2025, 1849, 2652, 2558, 2568, 2568, 2654, 2652, 2630, 2548, 2558, 2558, 2652, 2630, 2592, 2530, 2548, 2548, 2630, 2592, 2550, 2491, 2530, 2530, 2592, 2550, 2509, 2435, 2491, 2491, 2550, 2509, 2431, 2393, 2435, 2435, 2509, 2431, 2365, 2325, 2393, 2393, 2431, 2365, 2262, 2211, 2325, 2325, 2365, 2262, 2051, 2025, 2211, 2211, 2262, 2051, 1725, 1849, 2025, 2025, 2051, 1725, 2719, 2652, 2654, 2654, 2725, 2719, 2696, 2630, 2652, 2652, 2719, 2696, 2661, 2592, 2630, 2630, 2696, 2661, 2606, 2550, 2592, 2592, 2661, 2606, 2546, 2509, 2550, 2550, 2606, 2546, 2483, 2431, 2509, 2509, 2546, 2483, 2404, 2365, 2431, 2431, 2483, 2404, 2307, 2262, 2365, 2365, 2404, 2307, 2089, 2051, 2262, 2262, 2307, 2089, 1718, 1725, 2051, 2051, 2089, 1718, 2786, 2719, 2725, 2725, 2794, 2786, 2758, 2696, 2719, 2719, 2786, 2758, 2712, 2661, 2696, 2696, 2758, 2712, 2656, 2606, 2661, 2661, 2712, 2656, 2588, 2546, 2606, 2606, 2656, 2588, 2524, 2483, 2546, 2546, 2588, 2524, 2421, 2404, 2483, 2483, 2524, 2421, 2329, 2307, 2404, 2404, 2421, 2329, 2117, 2089, 2307, 2307, 2329, 2117, 1699, 1718, 2089, 2089, 2117, 1699, 2833, 2786, 2794, 2794, 2843, 2833, 2797, 2758, 2786, 2786, 2833, 2797, 2749, 2712, 2758, 2758, 2797, 2749, 2689, 2656, 2712, 2712, 2749, 2689, 2623, 2588, 2656, 2656, 2689, 2623, 2535, 2524, 2588, 2588, 2623, 2535, 2440, 2421, 2524, 2524, 2535, 2440, 2339, 2329, 2421, 2421, 2440, 2339, 2127, 2117, 2329, 2329, 2339, 2127, 1824, 1699, 2117, 2117, 2127, 1824, 2846, 2833, 2843, 2843, 2856, 2846, 2820, 2797, 2833, 2833, 2846, 2820, 2764, 2749, 2797, 2797, 2820, 2764, 2702, 2689, 2749, 2749, 2764, 2702, 2636, 2623, 2689, 2689, 2702, 2636, 2542, 2535, 2623, 2623, 2636, 2542, 2445, 2440, 2535, 2535, 2542, 2445, 2343, 2339, 2440, 2440, 2445, 2343, 2135, 2127, 2339, 2339, 2343, 2135, 1712, 1824, 2127, 2127, 2135, 1712, 1675, 1681, 1863, 1863, 1861, 1675, 1641, 1655, 1681, 1681, 1675, 1641, 1600, 1635, 1655, 1655, 1641, 1600, 1557, 1611, 1635, 1635, 1600, 1557, 1501, 1587, 1611, 1611, 1557, 1501, 1471, 1563, 1587, 1587, 1501, 1471, 1424, 1539, 1563, 1563, 1471, 1424, 1403, 1519, 1539, 1539, 1424, 1403, 1389, 1505, 1519, 1519, 1403, 1389, 1386, 1497, 1505, 1505, 1389, 1386, 1653, 1675, 1861, 1861, 1858, 1653, 1605, 1641, 1675, 1675, 1653, 1605, 1530, 1600, 1641, 1641, 1605, 1530, 1451, 1557, 1600, 1600, 1530, 1451, 1387, 1501, 1557, 1557, 1451, 1387, 1346, 1471, 1501, 1501, 1387, 1346, 1315, 1424, 1471, 1471, 1346, 1315, 1299, 1403, 1424, 1424, 1315, 1299, 1289, 1389, 1403, 1403, 1299, 1289, 1285, 1386, 1389, 1389, 1289, 1285, 1645, 1653, 1858, 1858, 1855, 1645, 1549, 1605, 1653, 1653, 1645, 1549, 1438, 1530, 1605, 1605, 1549, 1438, 1350, 1451, 1530, 1530, 1438, 1350, 1297, 1387, 1451, 1451, 1350, 1297, 1274, 1346, 1387, 1387, 1297, 1274, 1245, 1315, 1346, 1346, 1274, 1245, 1221, 1299, 1315, 1315, 1245, 1221, 1214, 1289, 1299, 1299, 1221, 1214, 1210, 1285, 1289, 1289, 1214, 1210, 1623, 1645, 1855, 1855, 1853, 1623, 1483, 1549, 1645, 1645, 1623, 1483, 1352, 1438, 1549, 1549, 1483, 1352, 1283, 1350, 1438, 1438, 1352, 1283, 1237, 1297, 1350, 1350, 1283, 1237, 1203, 1274, 1297, 1297, 1237, 1203, 1177, 1245, 1274, 1274, 1203, 1177, 1151, 1221, 1245, 1245, 1177, 1151, 1133, 1214, 1221, 1221, 1151, 1133, 1123, 1210, 1214, 1214, 1133, 1123, 1595, 1623, 1853, 1853, 1850, 1595, 1409, 1483, 1623, 1623, 1595, 1409, 1295, 1352, 1483, 1483, 1409, 1295, 1227, 1283, 1352, 1352, 1295, 1227, 1185, 1237, 1283, 1283, 1227, 1185, 1129, 1203, 1237, 1237, 1185, 1129, 1090, 1177, 1203, 1203, 1129, 1090, 1072, 1151, 1177, 1177, 1090, 1072, 1062, 1133, 1151, 1151, 1072, 1062, 1052, 1123, 1133, 1133, 1062, 1052, 1569, 1595, 1850, 1850, 1847, 1569, 1358, 1409, 1595, 1595, 1569, 1358, 1255, 1295, 1409, 1409, 1358, 1255, 1189, 1227, 1295, 1295, 1255, 1189, 1111, 1185, 1227, 1227, 1189, 1111, 1070, 1129, 1185, 1185, 1111, 1070, 1028, 1090, 1129, 1129, 1070, 1028, 990, 1072, 1090, 1090, 1028, 990, 968, 1062, 1072, 1072, 990, 968, 966, 1052, 1062, 1062, 968, 966, 1531, 1569, 1847, 1847, 1845, 1531, 1313, 1358, 1569, 1569, 1531, 1313, 1218, 1255, 1358, 1358, 1313, 1218, 1137, 1189, 1255, 1255, 1218, 1137, 1074, 1111, 1189, 1189, 1137, 1074, 1014, 1070, 1111, 1111, 1074, 1014, 961, 1028, 1070, 1070, 1014, 961, 924, 990, 1028, 1028, 961, 924, 903, 968, 990, 990, 924, 903, 897, 966, 968, 968, 903, 897, 1503, 1531, 1845, 1845, 1831, 1503, 1291, 1313, 1531, 1531, 1503, 1291, 1199, 1218, 1313, 1313, 1291, 1199, 1096, 1137, 1218, 1218, 1199, 1096, 1032, 1074, 1137, 1137, 1096, 1032, 964, 1014, 1074, 1074, 1032, 964, 908, 961, 1014, 1014, 964, 908, 862, 924, 961, 961, 908, 862, 834, 903, 924, 924, 862, 834, 826, 897, 903, 903, 834, 826, 1493, 1503, 1831, 1831, 1823, 1493, 1281, 1291, 1503, 1503, 1493, 1281, 1182, 1199, 1291, 1291, 1281, 1182, 1087, 1096, 1199, 1199, 1182, 1087, 999, 1032, 1096, 1096, 1087, 999, 933, 964, 1032, 1032, 999, 933, 873, 908, 964, 964, 933, 873, 825, 862, 908, 908, 873, 825, 789, 834, 862, 862, 825, 789, 779, 826, 834, 834, 789, 779, 1485, 1493, 1823, 1823, 1813, 1485, 1277, 1281, 1493, 1493, 1485, 1277, 1175, 1182, 1281, 1281, 1277, 1175, 1078, 1087, 1182, 1182, 1175, 1078, 984, 999, 1087, 1087, 1078, 984, 918, 933, 999, 999, 984, 918, 856, 873, 933, 933, 918, 856, 800, 825, 873, 873, 856, 800, 774, 789, 825, 825, 800, 774, 764, 779, 789, 789, 774, 764, 1390, 1506, 1498, 1498, 1386, 1390, 1404, 1520, 1506, 1506, 1390, 1404, 1423, 1540, 1520, 1520, 1404, 1423, 1472, 1564, 1540, 1540, 1423, 1472, 1502, 1588, 1564, 1564, 1472, 1502, 1558, 1612, 1588, 1588, 1502, 1558, 1599, 1636, 1612, 1612, 1558, 1599, 1642, 1656, 1636, 1636, 1599, 1642, 1676, 1682, 1656, 1656, 1642, 1676, 1862, 1891, 1682, 1682, 1676, 1862, 1290, 1390, 1386, 1386, 1286, 1290, 1300, 1404, 1390, 1390, 1290, 1300, 1316, 1423, 1404, 1404, 1300, 1316, 1347, 1472, 1423, 1423, 1316, 1347, 1388, 1502, 1472, 1472, 1347, 1388, 1452, 1558, 1502, 1502, 1388, 1452, 1529, 1599, 1558, 1558, 1452, 1529, 1606, 1642, 1599, 1599, 1529, 1606, 1654, 1676, 1642, 1642, 1606, 1654, 1860, 1862, 1676, 1676, 1654, 1860, 1213, 1290, 1286, 1286, 1209, 1213, 1222, 1300, 1290, 1290, 1213, 1222, 1246, 1316, 1300, 1300, 1222, 1246, 1273, 1347, 1316, 1316, 1246, 1273, 1298, 1388, 1347, 1347, 1273, 1298, 1351, 1452, 1388, 1388, 1298, 1351, 1437, 1529, 1452, 1452, 1351, 1437, 1550, 1606, 1529, 1529, 1437, 1550, 1646, 1654, 1606, 1606, 1550, 1646, 1890, 1860, 1654, 1654, 1646, 1890, 1134, 1213, 1209, 1209, 1124, 1134, 1152, 1222, 1213, 1213, 1134, 1152, 1178, 1246, 1222, 1222, 1152, 1178, 1204, 1273, 1246, 1246, 1178, 1204, 1238, 1298, 1273, 1273, 1204, 1238, 1284, 1351, 1298, 1298, 1238, 1284, 1353, 1437, 1351, 1351, 1284, 1353, 1484, 1550, 1437, 1437, 1353, 1484, 1624, 1646, 1550, 1550, 1484, 1624, 1900, 1890, 1646, 1646, 1624, 1900, 1063, 1134, 1124, 1124, 1053, 1063, 1073, 1152, 1134, 1134, 1063, 1073, 1091, 1178, 1152, 1152, 1073, 1091, 1130, 1204, 1178, 1178, 1091, 1130, 1186, 1238, 1204, 1204, 1130, 1186, 1228, 1284, 1238, 1238, 1186, 1228, 1296, 1353, 1284, 1284, 1228, 1296, 1410, 1484, 1353, 1353, 1296, 1410, 1596, 1624, 1484, 1484, 1410, 1596, 1852, 1900, 1624, 1624, 1596, 1852, 969, 1063, 1053, 1053, 967, 969, 991, 1073, 1063, 1063, 969, 991, 1029, 1091, 1073, 1073, 991, 1029, 1071, 1130, 1091, 1091, 1029, 1071, 1112, 1186, 1130, 1130, 1071, 1112, 1190, 1228, 1186, 1186, 1112, 1190, 1256, 1296, 1228, 1228, 1190, 1256, 1359, 1410, 1296, 1296, 1256, 1359, 1570, 1596, 1410, 1410, 1359, 1570, 1898, 1852, 1596, 1596, 1570, 1898, 902, 969, 967, 967, 896, 902, 925, 991, 969, 969, 902, 925, 960, 1029, 991, 991, 925, 960, 1015, 1071, 1029, 1029, 960, 1015, 1075, 1112, 1071, 1071, 1015, 1075, 1138, 1190, 1112, 1112, 1075, 1138, 1217, 1256, 1190, 1190, 1138, 1217, 1314, 1359, 1256, 1256, 1217, 1314, 1532, 1570, 1359, 1359, 1314, 1532, 1919, 1898, 1570, 1570, 1532, 1919, 835, 902, 896, 896, 827, 835, 863, 925, 902, 902, 835, 863, 909, 960, 925, 925, 863, 909, 965, 1015, 960, 960, 909, 965, 1033, 1075, 1015, 1015, 965, 1033, 1097, 1138, 1075, 1075, 1033, 1097, 1200, 1217, 1138, 1138, 1097, 1200, 1292, 1314, 1217, 1217, 1200, 1292, 1504, 1532, 1314, 1314, 1292, 1504, 1923, 1919, 1532, 1532, 1504, 1923, 788, 835, 827, 827, 778, 788, 824, 863, 835, 835, 788, 824, 872, 909, 863, 863, 824, 872, 932, 965, 909, 909, 872, 932, 998, 1033, 965, 965, 932, 998, 1086, 1097, 1033, 1033, 998, 1086, 1181, 1200, 1097, 1097, 1086, 1181, 1282, 1292, 1200, 1200, 1181, 1282, 1494, 1504, 1292, 1292, 1282, 1494, 1825, 1923, 1504, 1504, 1494, 1825, 775, 788, 778, 778, 765, 775, 801, 824, 788, 788, 775, 801, 857, 872, 824, 824, 801, 857, 919, 932, 872, 872, 857, 919, 985, 998, 932, 932, 919, 985, 1079, 1086, 998, 998, 985, 1079, 1176, 1181, 1086, 1086, 1079, 1176, 1278, 1282, 1181, 1181, 1176, 1278, 1486, 1494, 1282, 1282, 1278, 1486, 1913, 1825, 1494, 1494, 1486, 1913, 1946, 1940, 1866, 1866, 1862, 1946, 1980, 1966, 1940, 1940, 1946, 1980, 2021, 1986, 1966, 1966, 1980, 2021, 2064, 2010, 1986, 1986, 2021, 2064, 2120, 2034, 2010, 2010, 2064, 2120, 2150, 2058, 2034, 2034, 2120, 2150, 2197, 2082, 2058, 2058, 2150, 2197, 2218, 2102, 2082, 2082, 2197, 2218, 2232, 2116, 2102, 2102, 2218, 2232, 2235, 2124, 2116, 2116, 2232, 2235, 1968, 1946, 1862, 1862, 1859, 1968, 2016, 1980, 1946, 1946, 1968, 2016, 2091, 2021, 1980, 1980, 2016, 2091, 2170, 2064, 2021, 2021, 2091, 2170, 2234, 2120, 2064, 2064, 2170, 2234, 2275, 2150, 2120, 2120, 2234, 2275, 2306, 2197, 2150, 2150, 2275, 2306, 2322, 2218, 2197, 2197, 2306, 2322, 2332, 2232, 2218, 2218, 2322, 2332, 2336, 2235, 2232, 2232, 2332, 2336, 1976, 1968, 1859, 1859, 1856, 1976, 2072, 2016, 1968, 1968, 1976, 2072, 2183, 2091, 2016, 2016, 2072, 2183, 2271, 2170, 2091, 2091, 2183, 2271, 2324, 2234, 2170, 2170, 2271, 2324, 2347, 2275, 2234, 2234, 2324, 2347, 2376, 2306, 2275, 2275, 2347, 2376, 2400, 2322, 2306, 2306, 2376, 2400, 2407, 2332, 2322, 2322, 2400, 2407, 2411, 2336, 2332, 2332, 2407, 2411, 1998, 1976, 1856, 1856, 1854, 1998, 2138, 2072, 1976, 1976, 1998, 2138, 2269, 2183, 2072, 2072, 2138, 2269, 2338, 2271, 2183, 2183, 2269, 2338, 2384, 2324, 2271, 2271, 2338, 2384, 2418, 2347, 2324, 2324, 2384, 2418, 2444, 2376, 2347, 2347, 2418, 2444, 2470, 2400, 2376, 2376, 2444, 2470, 2488, 2407, 2400, 2400, 2470, 2488, 2498, 2411, 2407, 2407, 2488, 2498, 2026, 1998, 1854, 1854, 1851, 2026, 2212, 2138, 1998, 1998, 2026, 2212, 2326, 2269, 2138, 2138, 2212, 2326, 2394, 2338, 2269, 2269, 2326, 2394, 2436, 2384, 2338, 2338, 2394, 2436, 2492, 2418, 2384, 2384, 2436, 2492, 2531, 2444, 2418, 2418, 2492, 2531, 2549, 2470, 2444, 2444, 2531, 2549, 2559, 2488, 2470, 2470, 2549, 2559, 2569, 2498, 2488, 2488, 2559, 2569, 2052, 2026, 1851, 1851, 1848, 2052, 2263, 2212, 2026, 2026, 2052, 2263, 2366, 2326, 2212, 2212, 2263, 2366, 2432, 2394, 2326, 2326, 2366, 2432, 2510, 2436, 2394, 2394, 2432, 2510, 2551, 2492, 2436, 2436, 2510, 2551, 2593, 2531, 2492, 2492, 2551, 2593, 2631, 2549, 2531, 2531, 2593, 2631, 2653, 2559, 2549, 2549, 2631, 2653, 2655, 2569, 2559, 2559, 2653, 2655, 2090, 2052, 1848, 1848, 1846, 2090, 2308, 2263, 2052, 2052, 2090, 2308, 2403, 2366, 2263, 2263, 2308, 2403, 2484, 2432, 2366, 2366, 2403, 2484, 2547, 2510, 2432, 2432, 2484, 2547, 2607, 2551, 2510, 2510, 2547, 2607, 2660, 2593, 2551, 2551, 2607, 2660, 2697, 2631, 2593, 2593, 2660, 2697, 2718, 2653, 2631, 2631, 2697, 2718, 2724, 2655, 2653, 2653, 2718, 2724, 2118, 2090, 1846, 1846, 1832, 2118, 2330, 2308, 2090, 2090, 2118, 2330, 2422, 2403, 2308, 2308, 2330, 2422, 2525, 2484, 2403, 2403, 2422, 2525, 2589, 2547, 2484, 2484, 2525, 2589, 2657, 2607, 2547, 2547, 2589, 2657, 2713, 2660, 2607, 2607, 2657, 2713, 2759, 2697, 2660, 2660, 2713, 2759, 2787, 2718, 2697, 2697, 2759, 2787, 2795, 2724, 2718, 2718, 2787, 2795, 2128, 2118, 1832, 1832, 1826, 2128, 2340, 2330, 2118, 2118, 2128, 2340, 2439, 2422, 2330, 2330, 2340, 2439, 2534, 2525, 2422, 2422, 2439, 2534, 2622, 2589, 2525, 2525, 2534, 2622, 2688, 2657, 2589, 2589, 2622, 2688, 2748, 2713, 2657, 2657, 2688, 2748, 2796, 2759, 2713, 2713, 2748, 2796, 2832, 2787, 2759, 2759, 2796, 2832, 2842, 2795, 2787, 2787, 2832, 2842, 2136, 2128, 1826, 1826, 1814, 2136, 2344, 2340, 2128, 2128, 2136, 2344, 2446, 2439, 2340, 2340, 2344, 2446, 2543, 2534, 2439, 2439, 2446, 2543, 2637, 2622, 2534, 2534, 2543, 2637, 2703, 2688, 2622, 2622, 2637, 2703, 2765, 2748, 2688, 2688, 2703, 2765, 2821, 2796, 2748, 2748, 2765, 2821, 2847, 2832, 2796, 2796, 2821, 2847, 2857, 2842, 2832, 2832, 2847, 2857, 1734, 2333, 2328, 1734, 2328, 2320, 1734, 2320, 2304, 1734, 2304, 2273, 1734, 2273, 2230, 1734, 2230, 2166, 1734, 2166, 2088, 1734, 2088, 2013, 1734, 2013, 1961, 1734, 1961, 1732, 2514, 2328, 2333, 2333, 2523, 2514, 2494, 2320, 2328, 2328, 2514, 2494, 2455, 2304, 2320, 2320, 2494, 2455, 2428, 2273, 2304, 2304, 2455, 2428, 2398, 2230, 2273, 2273, 2428, 2398, 2346, 2166, 2230, 2230, 2398, 2346, 2291, 2088, 2166, 2166, 2346, 2291, 2147, 2013, 2088, 2088, 2291, 2147, 2003, 1961, 2013, 2013, 2147, 2003, 1738, 1732, 1961, 1961, 2003, 1738, 2646, 2514, 2523, 2523, 2648, 2646, 2620, 2494, 2514, 2514, 2646, 2620, 2583, 2455, 2494, 2494, 2620, 2583, 2540, 2428, 2455, 2455, 2583, 2540, 2501, 2398, 2428, 2428, 2540, 2501, 2425, 2346, 2398, 2398, 2501, 2425, 2351, 2291, 2346, 2346, 2425, 2351, 2254, 2147, 2291, 2291, 2351, 2254, 2045, 2003, 2147, 2147, 2254, 2045, 1701, 1738, 2003, 2003, 2045, 1701, 2745, 2646, 2648, 2648, 2756, 2745, 2720, 2620, 2646, 2646, 2745, 2720, 2680, 2583, 2620, 2620, 2720, 2680, 2638, 2540, 2583, 2583, 2680, 2638, 2556, 2501, 2540, 2540, 2638, 2556, 2504, 2425, 2501, 2501, 2556, 2504, 2414, 2351, 2425, 2425, 2504, 2414, 2317, 2254, 2351, 2351, 2414, 2317, 2097, 2045, 2254, 2254, 2317, 2097, 1744, 1701, 2045, 2045, 2097, 1744, 2839, 2745, 2756, 2756, 2848, 2839, 2807, 2720, 2745, 2745, 2839, 2807, 2755, 2680, 2720, 2720, 2807, 2755, 2695, 2638, 2680, 2680, 2755, 2695, 2625, 2556, 2638, 2638, 2695, 2625, 2537, 2504, 2556, 2556, 2625, 2537, 2442, 2414, 2504, 2504, 2537, 2442, 2341, 2317, 2414, 2414, 2442, 2341, 2130, 2097, 2317, 2317, 2341, 2130, 1903, 1744, 2097, 2097, 2130, 1903, 2905, 2839, 2848, 2848, 2924, 2905, 2866, 2807, 2839, 2839, 2905, 2866, 2817, 2755, 2807, 2807, 2866, 2817, 2735, 2695, 2755, 2755, 2817, 2735, 2666, 2625, 2695, 2695, 2735, 2666, 2564, 2537, 2625, 2625, 2666, 2564, 2474, 2442, 2537, 2537, 2564, 2474, 2355, 2341, 2442, 2442, 2474, 2355, 2155, 2130, 2341, 2341, 2355, 2155, 1703, 1903, 2130, 2130, 2155, 1703, 2975, 2905, 2924, 2924, 2986, 2975, 2913, 2866, 2905, 2905, 2975, 2913, 2851, 2817, 2866, 2866, 2913, 2851, 2771, 2735, 2817, 2817, 2851, 2771, 2687, 2666, 2735, 2735, 2771, 2687, 2591, 2564, 2666, 2666, 2687, 2591, 2496, 2474, 2564, 2564, 2591, 2496, 2371, 2355, 2474, 2474, 2496, 2371, 2175, 2155, 2355, 2355, 2371, 2175, 1751, 1703, 2155, 2155, 2175, 1751, 2992, 2975, 2986, 2986, 3010, 2992, 2951, 2913, 2975, 2975, 2992, 2951, 2873, 2851, 2913, 2913, 2951, 2873, 2793, 2771, 2851, 2851, 2873, 2793, 2701, 2687, 2771, 2771, 2793, 2701, 2603, 2591, 2687, 2687, 2701, 2603, 2508, 2496, 2591, 2591, 2603, 2508, 2379, 2371, 2496, 2496, 2508, 2379, 2181, 2175, 2371, 2371, 2379, 2181, 1722, 1751, 2175, 2175, 2181, 1722, 2999, 2992, 3010, 3010, 3019, 2999, 2966, 2951, 2992, 2992, 2999, 2966, 2878, 2873, 2951, 2951, 2966, 2878, 2798, 2793, 2873, 2873, 2878, 2798, 2706, 2701, 2793, 2793, 2798, 2706, 2604, 2603, 2701, 2701, 2706, 2604, 2511, 2508, 2603, 2603, 2604, 2511, 2381, 2379, 2508, 2508, 2511, 2381, 2187, 2181, 2379, 2379, 2381, 2187, 1698, 1722, 2181, 2181, 2187, 1698, 3005, 2999, 3019, 3019, 3021, 3005, 2971, 2966, 2999, 2999, 3005, 2971, 2887, 2878, 2966, 2966, 2971, 2887, 2803, 2798, 2878, 2878, 2887, 2803, 2709, 2706, 2798, 2798, 2803, 2709, 2612, 2604, 2706, 2706, 2709, 2612, 2519, 2511, 2604, 2604, 2612, 2519, 2387, 2381, 2511, 2511, 2519, 2387, 2191, 2187, 2381, 2381, 2387, 2191, 1759, 1698, 2187, 2187, 2191, 1759, 1734, 1736, 1659, 1734, 1659, 1607, 1734, 1607, 1534, 1734, 1534, 1456, 1734, 1456, 1392, 1734, 1392, 1349, 1734, 1349, 1318, 1734, 1318, 1302, 1734, 1302, 1294, 1734, 1294, 1287, 1617, 1659, 1736, 1736, 1738, 1617, 1473, 1607, 1659, 1659, 1617, 1473, 1331, 1534, 1607, 1607, 1473, 1331, 1276, 1456, 1534, 1534, 1331, 1276, 1224, 1392, 1456, 1456, 1276, 1224, 1194, 1349, 1392, 1392, 1224, 1194, 1165, 1318, 1349, 1349, 1194, 1165, 1128, 1302, 1318, 1318, 1165, 1128, 1108, 1294, 1302, 1302, 1128, 1108, 1098, 1287, 1294, 1294, 1108, 1098, 1575, 1617, 1738, 1738, 1740, 1575, 1366, 1473, 1617, 1617, 1575, 1366, 1269, 1331, 1473, 1473, 1366, 1269, 1195, 1276, 1331, 1331, 1269, 1195, 1119, 1224, 1276, 1276, 1195, 1119, 1080, 1194, 1224, 1224, 1119, 1080, 1039, 1165, 1194, 1194, 1080, 1039, 1000, 1128, 1165, 1165, 1039, 1000, 974, 1108, 1128, 1128, 1000, 974, 972, 1098, 1108, 1108, 974, 972, 1523, 1575, 1740, 1740, 1743, 1523, 1303, 1366, 1575, 1575, 1523, 1303, 1208, 1269, 1366, 1366, 1303, 1208, 1118, 1195, 1269, 1269, 1208, 1118, 1064, 1119, 1195, 1195, 1118, 1064, 982, 1080, 1119, 1119, 1064, 982, 940, 1039, 1080, 1080, 982, 940, 900, 1000, 1039, 1039, 940, 900, 877, 974, 1000, 1000, 900, 877, 864, 972, 974, 974, 877, 864, 1492, 1523, 1743, 1743, 1746, 1492, 1279, 1303, 1523, 1523, 1492, 1279, 1180, 1208, 1303, 1303, 1279, 1180, 1085, 1118, 1208, 1208, 1180, 1085, 997, 1064, 1118, 1118, 1085, 997, 927, 982, 1064, 1064, 997, 927, 867, 940, 982, 982, 927, 867, 815, 900, 940, 940, 867, 815, 783, 877, 900, 900, 815, 783, 772, 864, 877, 877, 783, 772, 1465, 1492, 1746, 1746, 1748, 1465, 1265, 1279, 1492, 1492, 1465, 1265, 1148, 1180, 1279, 1279, 1265, 1148, 1056, 1085, 1180, 1180, 1148, 1056, 954, 997, 1085, 1085, 1056, 954, 887, 927, 997, 997, 954, 887, 805, 867, 927, 927, 887, 805, 754, 815, 867, 867, 805, 754, 717, 783, 815, 815, 754, 717, 696, 772, 783, 783, 717, 696, 1445, 1465, 1748, 1748, 1752, 1445, 1249, 1265, 1465, 1465, 1445, 1249, 1126, 1148, 1265, 1265, 1249, 1126, 1031, 1056, 1148, 1148, 1126, 1031, 935, 954, 1056, 1056, 1031, 935, 851, 887, 954, 954, 935, 851, 771, 805, 887, 887, 851, 771, 709, 754, 805, 805, 771, 709, 647, 717, 754, 754, 709, 647, 636, 696, 717, 717, 647, 636, 1439, 1445, 1752, 1752, 1754, 1439, 1241, 1249, 1445, 1445, 1439, 1241, 1114, 1126, 1249, 1249, 1241, 1114, 1019, 1031, 1126, 1126, 1114, 1019, 921, 935, 1031, 1031, 1019, 921, 829, 851, 935, 935, 921, 829, 749, 771, 851, 851, 829, 749, 671, 709, 771, 771, 749, 671, 630, 647, 709, 709, 671, 630, 612, 636, 647, 647, 630, 612, 1433, 1439, 1754, 1754, 1756, 1433, 1239, 1241, 1439, 1439, 1433, 1239, 1109, 1114, 1241, 1241, 1239, 1109, 1016, 1019, 1114, 1114, 1109, 1016, 914, 921, 1019, 1019, 1016, 914, 822, 829, 921, 921, 914, 822, 742, 749, 829, 829, 822, 742, 654, 671, 749, 749, 742, 654, 621, 630, 671, 671, 654, 621, 601, 612, 630, 630, 621, 601, 1427, 1433, 1756, 1756, 1759, 1427, 1231, 1239, 1433, 1433, 1427, 1231, 1104, 1109, 1239, 1239, 1231, 1104, 1009, 1016, 1109, 1109, 1104, 1009, 912, 914, 1016, 1016, 1009, 912, 820, 822, 914, 914, 912, 820, 735, 742, 822, 822, 820, 735, 651, 654, 742, 742, 735, 651, 618, 621, 654, 654, 651, 618, 600, 601, 621, 621, 618, 600, 1734, 1288, 1293, 1734, 1293, 1301, 1734, 1301, 1317, 1734, 1317, 1348, 1734, 1348, 1391, 1734, 1391, 1455, 1734, 1455, 1533, 1734, 1533, 1608, 1734, 1608, 1660, 1734, 1660, 1888, 1107, 1293, 1288, 1288, 1098, 1107, 1127, 1301, 1293, 1293, 1107, 1127, 1166, 1317, 1301, 1301, 1127, 1166, 1193, 1348, 1317, 1317, 1166, 1193, 1223, 1391, 1348, 1348, 1193, 1223, 1275, 1455, 1391, 1391, 1223, 1275, 1330, 1533, 1455, 1455, 1275, 1330, 1474, 1608, 1533, 1533, 1330, 1474, 1618, 1660, 1608, 1608, 1474, 1618, 1737, 1888, 1660, 1660, 1618, 1737, 975, 1107, 1098, 1098, 973, 975, 1001, 1127, 1107, 1107, 975, 1001, 1038, 1166, 1127, 1127, 1001, 1038, 1081, 1193, 1166, 1166, 1038, 1081, 1120, 1223, 1193, 1193, 1081, 1120, 1196, 1275, 1223, 1223, 1120, 1196, 1270, 1330, 1275, 1275, 1196, 1270, 1367, 1474, 1330, 1330, 1270, 1367, 1576, 1618, 1474, 1474, 1367, 1576, 1902, 1737, 1618, 1618, 1576, 1902, 876, 975, 973, 973, 865, 876, 901, 1001, 975, 975, 876, 901, 941, 1038, 1001, 1001, 901, 941, 983, 1081, 1038, 1038, 941, 983, 1065, 1120, 1081, 1081, 983, 1065, 1117, 1196, 1120, 1120, 1065, 1117, 1207, 1270, 1196, 1196, 1117, 1207, 1304, 1367, 1270, 1270, 1207, 1304, 1524, 1576, 1367, 1367, 1304, 1524, 1741, 1902, 1576, 1576, 1524, 1741, 782, 876, 865, 865, 773, 782, 814, 901, 876, 876, 782, 814, 866, 941, 901, 901, 814, 866, 926, 983, 941, 941, 866, 926, 996, 1065, 983, 983, 926, 996, 1084, 1117, 1065, 1065, 996, 1084, 1179, 1207, 1117, 1117, 1084, 1179, 1280, 1304, 1207, 1207, 1179, 1280, 1491, 1524, 1304, 1304, 1280, 1491, 1702, 1741, 1524, 1524, 1491, 1702, 716, 782, 773, 773, 697, 716, 755, 814, 782, 782, 716, 755, 804, 866, 814, 814, 755, 804, 886, 926, 866, 866, 804, 886, 955, 996, 926, 926, 886, 955, 1057, 1084, 996, 996, 955, 1057, 1147, 1179, 1084, 1084, 1057, 1147, 1266, 1280, 1179, 1179, 1147, 1266, 1466, 1491, 1280, 1280, 1266, 1466, 1904, 1702, 1491, 1491, 1466, 1904, 646, 716, 697, 697, 635, 646, 708, 755, 716, 716, 646, 708, 770, 804, 755, 755, 708, 770, 850, 886, 804, 804, 770, 850, 934, 955, 886, 886, 850, 934, 1030, 1057, 955, 955, 934, 1030, 1125, 1147, 1057, 1057, 1030, 1125, 1250, 1266, 1147, 1147, 1125, 1250, 1446, 1466, 1266, 1266, 1250, 1446, 1750, 1904, 1466, 1466, 1446, 1750, 629, 646, 635, 635, 611, 629, 670, 708, 646, 646, 629, 670, 748, 770, 708, 708, 670, 748, 828, 850, 770, 770, 748, 828, 920, 934, 850, 850, 828, 920, 1018, 1030, 934, 934, 920, 1018, 1113, 1125, 1030, 1030, 1018, 1113, 1242, 1250, 1125, 1125, 1113, 1242, 1440, 1446, 1250, 1250, 1242, 1440, 1895, 1750, 1446, 1446, 1440, 1895, 622, 629, 611, 611, 602, 622, 655, 670, 629, 629, 622, 655, 743, 748, 670, 670, 655, 743, 823, 828, 748, 748, 743, 823, 915, 920, 828, 828, 823, 915, 1017, 1018, 920, 920, 915, 1017, 1110, 1113, 1018, 1018, 1017, 1110, 1240, 1242, 1113, 1113, 1110, 1240, 1434, 1440, 1242, 1242, 1240, 1434, 1922, 1895, 1440, 1440, 1434, 1922, 616, 622, 602, 602, 600, 616, 649, 655, 622, 622, 616, 649, 733, 743, 655, 655, 649, 733, 817, 823, 743, 743, 733, 817, 911, 915, 823, 823, 817, 911, 1008, 1017, 915, 915, 911, 1008, 1101, 1110, 1017, 1017, 1008, 1101, 1234, 1240, 1110, 1110, 1101, 1234, 1430, 1434, 1240, 1240, 1234, 1430, 1758, 1922, 1434, 1434, 1430, 1758, 1734, 1735, 1962, 1734, 1962, 2014, 1734, 2014, 2087, 1734, 2087, 2165, 1734, 2165, 2229, 1734, 2229, 2272, 1734, 2272, 2303, 1734, 2303, 2319, 1734, 2319, 2327, 1734, 2327, 2334, 2004, 1962, 1735, 1735, 1737, 2004, 2148, 2014, 1962, 1962, 2004, 2148, 2290, 2087, 2014, 2014, 2148, 2290, 2345, 2165, 2087, 2087, 2290, 2345, 2397, 2229, 2165, 2165, 2345, 2397, 2427, 2272, 2229, 2229, 2397, 2427, 2456, 2303, 2272, 2272, 2427, 2456, 2493, 2319, 2303, 2303, 2456, 2493, 2513, 2327, 2319, 2319, 2493, 2513, 2523, 2334, 2327, 2327, 2513, 2523, 2046, 2004, 1737, 1737, 1739, 2046, 2255, 2148, 2004, 2004, 2046, 2255, 2352, 2290, 2148, 2148, 2255, 2352, 2426, 2345, 2290, 2290, 2352, 2426, 2502, 2397, 2345, 2345, 2426, 2502, 2541, 2427, 2397, 2397, 2502, 2541, 2582, 2456, 2427, 2427, 2541, 2582, 2621, 2493, 2456, 2456, 2582, 2621, 2647, 2513, 2493, 2493, 2621, 2647, 2649, 2523, 2513, 2513, 2647, 2649, 2098, 2046, 1739, 1739, 1742, 2098, 2318, 2255, 2046, 2046, 2098, 2318, 2413, 2352, 2255, 2255, 2318, 2413, 2503, 2426, 2352, 2352, 2413, 2503, 2557, 2502, 2426, 2426, 2503, 2557, 2639, 2541, 2502, 2502, 2557, 2639, 2681, 2582, 2541, 2541, 2639, 2681, 2721, 2621, 2582, 2582, 2681, 2721, 2744, 2647, 2621, 2621, 2721, 2744, 2757, 2649, 2647, 2647, 2744, 2757, 2129, 2098, 1742, 1742, 1745, 2129, 2342, 2318, 2098, 2098, 2129, 2342, 2441, 2413, 2318, 2318, 2342, 2441, 2536, 2503, 2413, 2413, 2441, 2536, 2624, 2557, 2503, 2503, 2536, 2624, 2694, 2639, 2557, 2557, 2624, 2694, 2754, 2681, 2639, 2639, 2694, 2754, 2806, 2721, 2681, 2681, 2754, 2806, 2838, 2744, 2721, 2721, 2806, 2838, 2849, 2757, 2744, 2744, 2838, 2849, 2156, 2129, 1745, 1745, 1747, 2156, 2356, 2342, 2129, 2129, 2156, 2356, 2473, 2441, 2342, 2342, 2356, 2473, 2565, 2536, 2441, 2441, 2473, 2565, 2667, 2624, 2536, 2536, 2565, 2667, 2734, 2694, 2624, 2624, 2667, 2734, 2816, 2754, 2694, 2694, 2734, 2816, 2867, 2806, 2754, 2754, 2816, 2867, 2904, 2838, 2806, 2806, 2867, 2904, 2925, 2849, 2838, 2838, 2904, 2925, 2176, 2156, 1747, 1747, 1749, 2176, 2372, 2356, 2156, 2156, 2176, 2372, 2495, 2473, 2356, 2356, 2372, 2495, 2590, 2565, 2473, 2473, 2495, 2590, 2686, 2667, 2565, 2565, 2590, 2686, 2770, 2734, 2667, 2667, 2686, 2770, 2850, 2816, 2734, 2734, 2770, 2850, 2912, 2867, 2816, 2816, 2850, 2912, 2974, 2904, 2867, 2867, 2912, 2974, 2985, 2925, 2904, 2904, 2974, 2985, 2182, 2176, 1749, 1749, 1753, 2182, 2380, 2372, 2176, 2176, 2182, 2380, 2507, 2495, 2372, 2372, 2380, 2507, 2602, 2590, 2495, 2495, 2507, 2602, 2700, 2686, 2590, 2590, 2602, 2700, 2792, 2770, 2686, 2686, 2700, 2792, 2872, 2850, 2770, 2770, 2792, 2872, 2950, 2912, 2850, 2850, 2872, 2950, 2991, 2974, 2912, 2912, 2950, 2991, 3009, 2985, 2974, 2974, 2991, 3009, 2188, 2182, 1753, 1753, 1755, 2188, 2382, 2380, 2182, 2182, 2188, 2382, 2512, 2507, 2380, 2380, 2382, 2512, 2605, 2602, 2507, 2507, 2512, 2605, 2707, 2700, 2602, 2602, 2605, 2707, 2799, 2792, 2700, 2700, 2707, 2799, 2879, 2872, 2792, 2792, 2799, 2879, 2967, 2950, 2872, 2872, 2879, 2967, 3000, 2991, 2950, 2950, 2967, 3000, 3020, 3009, 2991, 2991, 3000, 3020, 2194, 2188, 1755, 1755, 1758, 2194, 2389, 2382, 2188, 2188, 2194, 2389, 2516, 2512, 2382, 2382, 2389, 2516, 2611, 2605, 2512, 2512, 2516, 2611, 2708, 2707, 2605, 2605, 2611, 2708, 2800, 2799, 2707, 2707, 2708, 2800, 2885, 2879, 2799, 2799, 2800, 2885, 2969, 2967, 2879, 2879, 2885, 2969, 3003, 3000, 2967, 2967, 2969, 3003, 3021, 3020, 3000, 3000, 3003, 3021],

        vertex: [[-3.0, 1.8, 0.0, -2.9916, 1.8, -0.081, -2.9916, 1.8, 0.081, -2.98945, 1.666162, 0.0, -2.985, 1.92195, 0.0, -2.985, 1.92195, 0.0, -2.981175, 1.667844, -0.081, -2.981175, 1.667844, 0.081, -2.976687, 1.920243, -0.081, -2.976687, 1.920243, 0.081, -2.9688, 1.8, -0.144, -2.9688, 1.8, 0.144, -2.958713, 1.672406, -0.144, -2.958713, 1.672406, 0.144, -2.9576, 1.5348, 0.0, -2.9576, 1.5348, 0.0, -2.954122, 1.915609, -0.144, -2.954122, 1.915609, 0.144, -2.949693, 1.53779, -0.081, -2.949693, 1.53779, 0.081, -2.94, 2.0196, 0.0, -2.9352, 1.8, -0.189, -2.9352, 1.8, 0.189, -2.931958, 2.016526, 0.081, -2.931958, 2.016526, -0.081, -2.92823, 1.545907, -0.144, -2.92823, 1.545907, 0.144, -2.925611, 1.679131, -0.189, -2.925611, 1.679131, 0.189, -2.92087, 1.908779, -0.189, -2.92087, 1.908779, 0.189, -2.910131, 2.008181, -0.144, -2.910131, 2.008181, 0.144, -2.90415, 1.406137, 0.0, -2.90415, 1.406137, 0.0, -2.896846, 1.410135, 0.081, -2.896846, 1.410135, -0.081, -2.896602, 1.557869, -0.189, -2.896602, 1.557869, 0.189, -2.8944, 1.8, -0.216, -2.8944, 1.8, 0.216, -2.885416, 1.687296, -0.216, -2.885416, 1.687296, 0.216, -2.880491, 1.900487, -0.216, -2.880491, 1.900487, 0.216, -2.877965, 1.995883, -0.189, -2.877965, 1.995883, 0.189, -2.877022, 1.420985, -0.144, -2.877022, 1.420985, 0.144, -2.865, 2.09565, 0.0, -2.858195, 1.572394, 0.216, -2.858195, 1.572394, -0.216, -2.857432, 2.091511, -0.081, -2.857432, 2.091511, 0.081, -2.85, 1.8, -0.225, -2.85, 1.8, 0.225, -2.847806, 1.436974, 0.189, -2.847806, 1.436974, -0.189, -2.841675, 1.696181, 0.225, -2.841675, 1.696181, -0.225, -2.838906, 1.98095, -0.216, -2.838906, 1.98095, 0.216, -2.836889, 2.080276, -0.144, -2.836889, 2.080276, 0.144, -2.83655, 1.891463, -0.225, -2.83655, 1.891463, 0.225, -2.8288, 1.2804, 0.0, -2.822326, 1.285171, -0.081, -2.822326, 1.285171, 0.081, -2.8164, 1.5882, -0.225, -2.8164, 1.5882, 0.225, -2.812331, 1.45639, 0.216, -2.812331, 1.45639, -0.216, -2.806615, 2.06372, -0.189, -2.806615, 2.06372, 0.189, -2.8056, 1.8, -0.216, -2.8056, 1.8, 0.216, -2.804755, 1.298122, -0.144, -2.804755, 1.298122, 0.144, -2.797934, 1.705067, -0.216, -2.797934, 1.705067, 0.216, -2.7964, 1.9647, 0.225, -2.7964, 1.9647, -0.225, -2.792609, 1.882438, -0.216, -2.792609, 1.882438, 0.216, -2.778861, 1.317206, -0.189, -2.778861, 1.317206, 0.189, -2.774605, 1.604006, 0.216, -2.774605, 1.604006, -0.216, -2.773725, 1.477519, 0.225, -2.773725, 1.477519, -0.225, -2.769854, 2.043616, -0.216, -2.769854, 2.043616, 0.216, -2.7648, 1.8, -0.189, -2.7648, 1.8, 0.189, -2.76, 2.1528, 0.0, -2.76, 2.1528, 0.0, -2.757739, 1.713232, -0.189, -2.757739, 1.713232, 0.189, -2.753894, 1.94845, -0.216, -2.753894, 1.94845, 0.216, -2.753123, 2.147861, -0.081, -2.753123, 2.147861, 0.081, -2.75223, 1.874146, -0.189, -2.75223, 1.874146, 0.189, -2.747418, 1.340381, -0.216, -2.747418, 1.340381, 0.216, -2.736198, 1.618531, -0.189, -2.736198, 1.618531, 0.189, -2.735119, 1.498648, 0.216, -2.735119, 1.498648, -0.216, -2.734458, 2.134454, -0.144, -2.734458, 2.134454, 0.144, -2.73125, 1.157813, 0.0, -2.73125, 1.157813, 0.0, -2.7312, 1.8, -0.144, -2.7312, 1.8, 0.144, -2.72985, 2.021737, -0.225, -2.72985, 2.021737, 0.225, -2.725825, 1.163194, 0.081, -2.725825, 1.163194, -0.081, -2.724637, 1.719956, -0.144, -2.724637, 1.719956, 0.144, -2.718978, 1.867316, -0.144, -2.718978, 1.867316, 0.144, -2.714835, 1.933517, -0.189, -2.714835, 1.933517, 0.189, -2.7132, 1.3656, -0.225, -2.7132, 1.3656, 0.225, -2.7111, 1.1778, -0.144, -2.7111, 1.1778, 0.144, -2.7084, 1.8, -0.081, -2.7084, 1.8, 0.081, -2.70695, 2.114698, -0.189, -2.70695, 2.114698, 0.189, -2.70457, 1.630493, -0.144, -2.70457, 1.630493, 0.144, -2.702175, 1.724519, -0.081, -2.702175, 1.724519, 0.081, -2.7, 1.8, 0.0, -2.699644, 1.518063, 0.189, -2.699644, 1.518063, -0.189, -2.696413, 1.862682, -0.081, -2.696413, 1.862682, 0.081, -2.6939, 1.7262, 0.0, -2.689846, 1.999859, -0.216, -2.689846, 1.999859, 0.216, -2.6894, 1.199325, -0.189, -2.6894, 1.199325, 0.189, -2.6881, 1.860975, 0.0, -2.6881, 1.860975, 0.0, -2.683107, 1.63861, -0.081, -2.683107, 1.63861, 0.081, -2.682669, 1.921219, -0.144, -2.682669, 1.921219, 0.144, -2.678982, 1.390819, -0.216, -2.678982, 1.390819, 0.216, -2.6752, 1.6416, 0.0, -2.6752, 1.6416, 0.0, -2.673549, 2.090707, -0.216, -2.673549, 2.090707, 0.216, -2.670428, 1.534053, -0.144, -2.670428, 1.534053, 0.144, -2.66305, 1.225463, -0.216, -2.66305, 1.225463, 0.216, -2.660842, 1.912874, 0.081, -2.660842, 1.912874, -0.081, -2.653085, 1.979755, -0.189, -2.653085, 1.979755, 0.189, -2.6528, 1.9098, 0.0, -2.6528, 1.9098, 0.0, -2.650604, 1.544903, 0.081, -2.650604, 1.544903, -0.081, -2.647539, 1.413994, -0.189, -2.647539, 1.413994, 0.189, -2.6433, 1.5489, 0.0, -2.6372, 2.0646, -0.225, -2.6372, 2.0646, 0.225, -2.634375, 1.253906, 0.225, -2.634375, 1.253906, -0.225, -2.625, 2.19375, 0.0, -2.622811, 1.963199, -0.144, -2.622811, 1.963199, 0.144, -2.621645, 1.433078, -0.144, -2.621645, 1.433078, 0.144, -2.61905, 2.188238, -0.081, -2.61905, 2.188238, 0.081, -2.6112, 1.0386, 0.0, -2.6112, 1.0386, 0.0, -2.607034, 1.044497, 0.081, -2.607034, 1.044497, -0.081, -2.6057, 1.28235, -0.216, -2.6057, 1.28235, 0.216, -2.604074, 1.446029, -0.081, -2.604074, 1.446029, 0.081, -2.6029, 2.173275, -0.144, -2.6029, 2.173275, 0.144, -2.602268, 1.951964, -0.081, -2.602268, 1.951964, 0.081, -2.600851, 2.038493, -0.216, -2.600851, 2.038493, 0.216, -2.5976, 1.4508, 0.0, -2.595725, 1.060502, -0.144, -2.595725, 1.060502, 0.144, -2.5947, 1.947825, 0.0, -2.57935, 1.308488, -0.189, -2.57935, 1.308488, 0.189, -2.5791, 2.151225, -0.189, -2.5791, 2.151225, 0.189, -2.579059, 1.08409, -0.189, -2.579059, 1.08409, 0.189, -2.56745, 2.014502, -0.189, -2.56745, 2.014502, 0.189, -2.558822, 1.112731, 0.216, -2.558822, 1.112731, -0.216, -2.55765, 1.330013, -0.144, -2.55765, 1.330013, 0.144, -2.5502, 2.12445, -0.216, -2.5502, 2.12445, 0.216, -2.542925, 1.344619, 0.081, -2.542925, 1.344619, -0.081, -2.539942, 1.994746, -0.144, -2.539942, 1.994746, 0.144, -2.5375, 1.35, 0.0, -2.5375, 1.35, 0.0, -2.5368, 1.1439, 0.225, -2.5368, 1.1439, -0.225, -2.521277, 1.981339, -0.081, -2.521277, 1.981339, 0.081, -2.51875, 2.095312, -0.225, -2.51875, 2.095312, 0.225, -2.514778, 1.175069, 0.216, -2.514778, 1.175069, -0.216, -2.5144, 1.9764, 0.0, -2.5144, 1.9764, 0.0, -2.494541, 1.20371, -0.189, -2.494541, 1.20371, 0.189, -2.4873, 2.066175, -0.216, -2.4873, 2.066175, 0.216, -2.477875, 1.227298, -0.144, -2.477875, 1.227298, 0.144, -2.46835, 0.922987, 0.0, -2.466566, 1.243303, 0.081, -2.466566, 1.243303, -0.081, -2.465644, 0.929375, -0.081, -2.465644, 0.929375, 0.081, -2.4624, 1.2492, 0.0, -2.4624, 1.2492, 0.0, -2.46, 2.2212, 0.0, -2.46, 2.2212, 0.0, -2.4584, 2.0394, -0.189, -2.4584, 2.0394, 0.189, -2.458298, 0.946711, -0.144, -2.458298, 0.946711, 0.144, -2.455229, 2.215303, -0.081, -2.455229, 2.215303, 0.081, -2.447474, 0.97226, 0.189, -2.447474, 0.97226, -0.189, -2.442278, 2.199298, -0.144, -2.442278, 2.199298, 0.144, -2.4346, 2.01735, -0.144, -2.4346, 2.01735, 0.144, -2.434329, 1.003283, -0.216, -2.434329, 1.003283, 0.216, -2.423194, 2.17571, -0.189, -2.423194, 2.17571, 0.189, -2.420025, 1.037044, -0.225, -2.420025, 1.037044, 0.225, -2.41845, 2.002387, -0.081, -2.41845, 2.002388, 0.081, -2.4125, 1.996875, 0.0, -2.4125, 1.996875, 0.0, -2.405721, 1.070804, -0.216, -2.405721, 1.070804, 0.216, -2.400019, 2.147069, -0.216, -2.400019, 2.147069, 0.216, -2.392576, 1.101828, -0.189, -2.392576, 1.101828, 0.189, -2.381752, 1.127376, -0.144, -2.381752, 1.127376, 0.144, -2.3748, 2.1159, -0.225, -2.3748, 2.1159, 0.225, -2.374406, 1.144713, 0.081, -2.374406, 1.144713, -0.081, -2.3717, 1.1511, 0.0, -2.349581, 2.084731, -0.216, -2.349581, 2.084731, 0.216, -2.326406, 2.05609, -0.189, -2.326406, 2.05609, 0.189, -2.307322, 2.032502, -0.144, -2.307322, 2.032502, 0.144, -2.3024, 0.8112, 0.0, -2.3024, 0.8112, 0.0, -2.301347, 0.818122, 0.081, -2.301347, 0.818122, -0.081, -2.29849, 0.836909, 0.144, -2.29849, 0.836909, -0.144, -2.294371, 2.016497, -0.081, -2.294371, 2.016497, 0.081, -2.294278, 0.864595, 0.189, -2.294278, 0.864595, -0.189, -2.2896, 2.0106, 0.0, -2.2896, 2.0106, 0.0, -2.289165, 0.898214, 0.216, -2.289165, 0.898214, -0.216, -2.2836, 0.9348, 0.225, -2.2836, 0.9348, -0.225, -2.278035, 0.971386, 0.216, -2.278035, 0.971386, -0.216, -2.272922, 1.005005, 0.189, -2.272922, 1.005005, -0.189, -2.26871, 1.032691, -0.144, -2.26871, 1.032691, 0.144, -2.265853, 1.051478, 0.081, -2.265853, 1.051478, -0.081, -2.265, 2.23785, 0.0, -2.2648, 1.0584, 0.0, -2.2648, 1.0584, 0.0, -2.261676, 2.23172, -0.081, -2.261676, 2.23172, 0.081, -2.252655, 2.215082, -0.144, -2.252655, 2.215082, 0.144, -2.239361, 2.190562, -0.189, -2.239361, 2.190562, 0.189, -2.223218, 2.160788, -0.216, -2.223218, 2.160788, 0.216, -2.20565, 2.128387, 0.225, -2.20565, 2.128388, -0.225, -2.188082, 2.095987, -0.216, -2.188082, 2.095987, 0.216, -2.171939, 2.066213, -0.189, -2.171939, 2.066213, 0.189, -2.158645, 2.041693, -0.144, -2.158645, 2.041693, 0.144, -2.149624, 2.025055, -0.081, -2.149624, 2.025055, 0.081, -2.1463, 2.018925, 0.0, -2.1411, 0.9738, 0.0, -2.1411, 0.9738, 0.0, -2.140315, 0.966231, 0.081, -2.140315, 0.966231, -0.081, -2.138183, 0.945685, 0.144, -2.138183, 0.945685, -0.144, -2.135041, 0.915407, 0.189, -2.135041, 0.915407, -0.189, -2.131226, 0.878641, 0.216, -2.131226, 0.878641, -0.216, -2.127075, 0.838631, 0.225, -2.127075, 0.838631, -0.225, -2.122924, 0.798621, 0.216, -2.122924, 0.798621, -0.216, -2.119109, 0.761855, 0.189, -2.119109, 0.761855, -0.189, -2.115967, 0.731578, 0.144, -2.115967, 0.731578, -0.144, -2.113835, 0.711032, 0.081, -2.113835, 0.711032, -0.081, -2.11305, 0.703463, 0.0, -2.11305, 0.703463, 0.0, -2.04, 2.2464, 0.0, -2.04, 2.2464, 0.0, -2.03841, 2.24015, -0.081, -2.03841, 2.24015, 0.081, -2.034093, 2.223187, -0.144, -2.034093, 2.223187, 0.144, -2.027731, 2.198189, -0.189, -2.027731, 2.198189, 0.189, -2.020006, 2.167834, 0.216, -2.020006, 2.167834, -0.216, -2.0116, 2.1348, 0.225, -2.0116, 2.1348, -0.225, -2.003194, 2.101766, 0.216, -2.003194, 2.101766, -0.216, -2.0, 0.9, 0.0, -2.0, 0.9, 0.0, -2.0, 0.9, 0.0, -1.9972, 0.8916, 0.081, -1.9972, 0.8916, -0.081, -1.995469, 2.071411, -0.189, -1.995469, 2.071411, 0.189, -1.99275, 1.037175, -0.0, -1.99275, 1.037175, 0.0, -1.9896, 0.8688, 0.144, -1.9896, 0.8688, -0.144, -1.989107, 2.046413, 0.144, -1.989107, 2.046413, -0.144, -1.986, 0.771675, 0.0, -1.986, 0.771675, 0.0, -1.98479, 2.02945, -0.081, -1.98479, 2.02945, 0.081, -1.9832, 2.0232, 0.0, -1.9832, 2.0232, 0.0, -1.9784, 0.8352, 0.189, -1.9784, 0.8352, -0.189, -1.97424, 0.9, -0.32816, -1.97424, 0.9, -0.32816, -1.97424, 0.9, 0.32816, -1.972, 1.1784, -0.0, -1.972, 1.1784, 0.0, -1.967083, 1.037175, -0.32697, -1.967083, 1.037175, 0.32697, -1.9648, 0.7944, 0.216, -1.9648, 0.7944, -0.216, -1.96042, 0.771675, -0.325863, -1.96042, 0.771675, 0.325863, -1.95, 0.75, -0.225, -1.95, 0.75, 0.225, -1.948, 0.6564, 0.0, -1.948, 0.6564, 0.0, -1.946601, 1.1784, -0.323566, -1.946601, 1.1784, 0.323566, -1.93925, 1.323225, 0.0, -1.93925, 1.323225, 0.0, -1.9352, 0.7056, 0.216, -1.9352, 0.7056, -0.216, -1.92291, 0.6564, -0.319628, -1.92291, 0.6564, 0.319628, -1.9216, 0.6648, 0.189, -1.9216, 0.6648, -0.189, -1.914272, 1.323225, -0.318192, -1.914272, 1.323225, 0.318192, -1.9104, 0.6312, 0.144, -1.9104, 0.6312, -0.144, -1.9028, 0.6084, 0.081, -1.9028, 0.6084, -0.081, -1.9, 0.6, 0.0, -1.9, 0.6, 0.0, -1.89952, 0.9, -0.63808, -1.89952, 0.9, -0.63808, -1.89952, 0.9, 0.63808, -1.89952, 0.9, 0.63808, -1.896, 1.4712, 0.0, -1.896, 1.4712, 0.0, -1.892634, 1.037175, -0.635767, -1.892634, 1.037175, 0.635767, -1.892, 0.553725, 0.0, -1.892, 0.553725, 0.0, -1.886223, 0.771675, -0.633613, -1.886223, 0.771675, 0.633613, -1.872927, 1.1784, -0.629147, -1.872927, 1.1784, 0.629147, -1.87158, 1.4712, -0.311096, -1.87158, 1.4712, 0.311096, -1.867631, 0.553725, -0.310439, -1.867631, 0.553725, 0.310439, -1.850132, 0.6564, -0.62149, -1.850132, 0.6564, 0.62149, -1.84375, 1.621875, 0.0, -1.84375, 1.621875, 0.0, -1.841822, 1.323225, -0.618698, -1.841822, 1.323225, 0.618698, -1.824, 0.4632, -0.0, -1.824, 0.4632, 0.0, -1.820003, 1.621875, -0.302522, -1.820003, 1.621875, 0.302523, -1.8009, 2.024775, 0.0, -1.800745, 1.4712, -0.6049, -1.800745, 1.4712, 0.6049, -1.800507, 0.4632, -0.299282, -1.800507, 0.4632, 0.299282, -1.800455, 2.031069, -0.081, -1.800455, 2.031069, 0.081, -1.799246, 2.048152, -0.144, -1.799246, 2.048152, 0.144, -1.797466, 2.073326, -0.189, -1.797466, 2.073326, 0.189, -1.796946, 0.553725, -0.603624, -1.796946, 0.553725, 0.603624, -1.795303, 2.103896, -0.216, -1.795303, 2.103896, 0.216, -1.79295, 2.137163, -0.225, -1.79295, 2.137163, 0.225, -1.790597, 2.170429, -0.216, -1.790597, 2.170429, 0.216, -1.788434, 2.200999, -0.189, -1.788434, 2.200999, 0.189, -1.786654, 2.226173, -0.144, -1.786654, 2.226173, 0.144, -1.785445, 2.243256, -0.081, -1.785445, 2.243256, 0.081, -1.785, 2.24955, 0.0, -1.784, 1.7748, -0.0, -1.784, 1.7748, 0.0, -1.77968, 0.9, -0.92592, -1.77968, 0.9, -0.92592, -1.77968, 0.9, 0.92592, -1.77968, 0.9, 0.92592, -1.773229, 1.037175, -0.922564, -1.773229, 1.037175, 0.922564, -1.767222, 0.771675, -0.919439, -1.767222, 0.771675, 0.919439, -1.761022, 1.7748, -0.292719, -1.761022, 1.7748, 0.292719, -1.754764, 1.1784, -0.912957, -1.754764, 1.1784, 0.912957, -1.75112, 1.621875, -0.58823, -1.75112, 1.621875, 0.58823, -1.75, 0.384375, -0.0, -1.75, 0.384375, 0.0, -1.733408, 0.6564, -0.901846, -1.733408, 0.6564, 0.901846, -1.732362, 0.4632, -0.581929, -1.732362, 0.4632, 0.581929, -1.72746, 0.384375, -0.28714, -1.72746, 0.384375, 0.28714, -1.725622, 1.323225, -0.897795, -1.725622, 1.323225, 0.897795, -1.71825, 1.929525, -0.0, -1.71825, 1.929525, 0.0, -1.696119, 1.929525, -0.28193, -1.696119, 1.929525, 0.28193, -1.694372, 1.7748, -0.569167, -1.694372, 1.7748, 0.569167, -1.687137, 1.4712, -0.877772, -1.687137, 1.4712, 0.877772, -1.683577, 0.553725, -0.87592, -1.683577, 0.553725, 0.87592, -1.676, 0.3168, 0.0, -1.676, 0.3168, 0.0, -1.66208, 0.384375, -0.55832, -1.66208, 0.384375, 0.55832, -1.654413, 0.3168, -0.274998, -1.654413, 0.3168, 0.274998, -1.648, 2.0856, 0.0, -1.648, 2.0856, 0.0, -1.640643, 1.621875, -0.853583, -1.640643, 1.621875, 0.853583, -1.631925, 1.929525, -0.54819, -1.631925, 1.929525, 0.54819, -1.626774, 2.0856, -0.270404, -1.626774, 2.0856, 0.270404, -1.623068, 0.4632, -0.844439, -1.623068, 0.4632, 0.844439, -1.61856, 0.9, -1.18784, -1.61856, 0.9, -1.18784, -1.61856, 0.9, 1.18784, -1.61856, 0.9, 1.18784, -1.612693, 1.037175, -1.183534, -1.612693, 1.037175, 1.183534, -1.608, 0.260025, -0.0, -1.608, 0.260025, 0.0, -1.60723, 0.771675, -1.179525, -1.60723, 0.771675, 1.179525, -1.6, 2.025, 0.0, -1.5972, 2.0313, -0.081, -1.5972, 2.0313, 0.081, -1.5959, 1.1784, -1.17121, -1.5959, 1.1784, 1.17121, -1.591798, 0.3168, -0.534711, -1.591798, 0.3168, 0.534711, -1.5896, 2.0484, -0.144, -1.5896, 2.0484, 0.144, -1.587475, 1.7748, -0.825921, -1.587475, 1.7748, 0.825921, -1.587289, 0.260025, 0.263841, -1.587289, 0.260025, -0.263841, -1.5784, 2.0736, -0.189, -1.5784, 2.0736, 0.189, -1.576477, 0.6564, -1.156956, -1.576477, 0.6564, 1.156956, -1.57475, 2.242575, 0.0, -1.57475, 2.242575, 0.0, -1.569396, 1.323225, -1.151759, -1.569396, 1.323225, 1.151759, -1.565204, 2.0856, -0.525778, -1.565204, 2.0856, 0.525778, -1.5648, 2.1042, -0.216, -1.5648, 2.1042, 0.216, -1.55722, 0.384375, -0.81018, -1.55722, 0.384375, 0.81018, -1.554467, 2.242575, -0.258385, -1.554467, 2.242575, 0.258385, -1.552, 0.2136, 0.0, -1.552, 0.2136, 0.0, -1.55, 2.1375, -0.225, -1.55, 2.1375, 0.225, -1.5352, 2.1708, -0.216, -1.5352, 2.1708, 0.216, -1.534395, 1.4712, -1.126072, -1.534395, 1.4712, 1.126072, -1.53201, 0.2136, 0.254652, -1.53201, 0.2136, -0.254652, -1.531158, 0.553725, -1.123697, -1.531158, 0.553725, 1.123697, -1.528968, 1.929525, -0.795481, -1.528968, 1.929525, 0.795481, -1.527214, 0.260025, -0.513016, -1.527214, 0.260025, 0.513016, -1.5216, 2.2014, -0.189, -1.5216, 2.2014, 0.189, -1.514, 0.177075, 0.0, -1.514, 0.177075, 0.0, -1.5104, 2.2266, -0.144, -1.5104, 2.2266, 0.144, -1.5028, 2.2437, -0.081, -1.5028, 2.2437, 0.081, -1.5, 2.4, 0.0, -1.5, 0.15, 0.0, -1.5, 2.25, 0.0, -1.5, 2.4, 0.0, -1.5, 0.15, 0.0, -1.496475, 0.127575, -0.0, -1.496475, 0.127575, 0.0, -1.495635, 2.242575, -0.502408, -1.495635, 2.242575, 0.502408, -1.4945, 0.177075, 0.248417, -1.4945, 0.177075, -0.248417, -1.49211, 1.621875, -1.09504, -1.49211, 1.621875, 1.09504, -1.491372, 0.3168, -0.775921, -1.491372, 0.3168, 0.775921, -1.4808, 0.1056, 0.0, -1.4808, 0.1056, -0.0, -1.48068, 2.4, -0.24612, -1.48068, 0.15, 0.24612, -1.48068, 2.4, 0.24612, -1.48068, 0.15, -0.24612, -1.48068, 0.15, -0.24612, -1.48068, 0.15, 0.24612, -1.480325, 2.435437, 0.0, -1.480325, 2.435437, 0.0, -1.4772, 0.127575, 0.245542, -1.4772, 0.127575, -0.245542, -1.476127, 0.4632, -1.08331, -1.476127, 0.4632, 1.08331, -1.474028, 0.2136, 0.49515, -1.474028, 0.2136, -0.49515, -1.466456, 2.0856, -0.762958, -1.466456, 2.0856, 0.762958, -1.461727, 0.1056, -0.24297, -1.461727, 0.1056, 0.24297, -1.461258, 2.435437, -0.242892, -1.461258, 2.435437, 0.242892, -1.4596, 2.463, 0.0, -1.4596, 2.463, 0.0, -1.445325, 0.084525, 0.0, -1.445325, 0.084525, 0.0, -1.443756, 1.7748, -1.059553, -1.443756, 1.7748, 1.059553, -1.4408, 2.463, -0.239491, -1.4408, 2.463, 0.239491, -1.439025, 2.482687, 0.0, -1.437937, 0.177075, 0.483027, -1.437937, 0.177075, -0.483027, -1.430863, 0.260025, 0.74444, -1.430863, 0.260025, -0.74444, -1.426709, 0.084525, -0.237149, -1.426709, 0.084525, 0.237149, -1.42464, 2.4, -0.47856, -1.42464, 0.15, -0.47856, -1.42464, 0.15, -0.47856, -1.42464, 0.15, 0.47856, -1.42464, 0.15, 0.47856, -1.42464, 2.4, 0.47856, -1.421292, 0.127575, 0.477435, -1.421292, 0.127575, -0.477435, -1.42049, 2.482687, -0.236115, -1.42049, 2.482687, 0.236115, -1.42, 0.9, -1.42, -1.42, 0.9, -1.42, -1.42, 0.9, 1.42, -1.42, 0.9, 1.42, -1.4198, 2.4945, 0.0, -1.4198, 2.4945, 0.0, -1.41624, 0.384375, -1.03936, -1.41624, 0.384375, 1.03936, -1.414853, 1.037175, -1.414853, -1.414853, 1.037175, 1.414853, -1.41006, 0.771675, -1.41006, -1.41006, 0.771675, 1.41006, -1.406405, 0.1056, -0.472434, -1.406405, 0.1056, 0.472434, -1.405953, 2.435437, -0.472283, -1.405953, 2.435437, 0.472283, -1.403125, 2.498438, 0.0, -1.403125, 2.498438, 0.0, -1.401513, 2.4945, -0.232961, -1.401513, 2.4945, 0.232961, -1.401276, 2.242575, -0.729046, -1.401276, 2.242575, 0.729046, -1.40012, 1.1784, -1.40012, -1.40012, 1.1784, 1.40012, -1.4, 2.4, 0.0, -1.4, 2.4, 0.0, -1.390545, 1.929525, -1.020503, -1.390545, 1.929525, 1.020503, -1.3902, 2.4945, 0.0, -1.3902, 2.4945, 0.0, -1.38627, 2.463, -0.465671, -1.38627, 2.463, 0.465671, -1.385925, 2.435437, 0.0, -1.385925, 2.435437, 0.0, -1.385053, 2.498438, -0.230225, -1.385053, 2.498438, 0.230225, -1.38308, 0.6564, -1.38308, -1.38308, 0.6564, 1.38308, -1.3824, 0.0648, -0.0, -1.3824, 0.0648, 0.0, -1.382225, 2.482687, -0.0, -1.382225, 2.482687, 0.0, -1.381968, 2.4, -0.229712, -1.381968, 2.4, 0.229712, -1.381032, 0.2136, 0.718514, -1.381032, 0.2136, -0.718514, -1.3804, 2.463, 0.0, -1.3804, 2.463, 0.0, -1.376868, 1.323225, -1.376867, -1.376867, 1.323225, 1.376868, -1.372712, 0.084525, -0.461116, -1.372712, 0.084525, 0.461116, -1.372294, 2.4945, -0.228104, -1.372294, 2.4945, 0.228104, -1.368074, 2.435437, -0.227403, -1.368074, 2.435437, 0.227403, -1.366728, 2.482687, -0.459107, -1.366728, 2.482687, 0.459107, -1.364595, 0.0648, -0.226824, -1.364595, 0.0648, 0.226824, -1.364422, 2.482687, -0.226795, -1.364422, 2.482687, 0.226795, -1.36262, 2.463, -0.226496, -1.36262, 2.463, 0.226496, -1.356353, 0.3168, -0.99541, -1.356353, 0.3168, 0.99541, -1.348469, 2.4945, -0.452973, -1.348469, 2.4945, 0.452973, -1.347218, 0.177075, 0.700921, -1.347218, 0.177075, -0.700921, -1.34616, 1.4712, -1.34616, -1.34616, 1.4712, 1.34616, -1.34332, 0.553725, -1.34332, -1.34332, 0.553725, 1.34332, -1.33476, 2.4, -0.69444, -1.33476, 0.15, -0.69444, -1.33476, 0.15, 0.69444, -1.33476, 0.15, 0.69444, -1.33476, 2.4, 0.69444, -1.33476, 0.15, -0.69444, -1.333693, 2.0856, -0.97878, -1.333693, 2.0856, 0.97878, -1.332632, 2.498438, -0.447653, -1.332632, 2.498438, 0.447653, -1.331623, 0.127575, 0.692808, -1.331623, 0.127575, -0.692808, -1.329664, 2.4, -0.446656, -1.329664, 2.4, 0.446656, -1.320356, 2.4945, -0.443529, -1.320356, 2.4945, 0.443529, -1.317675, 0.1056, -0.685551, -1.317675, 0.1056, 0.685551, -1.317252, 2.435437, -0.685331, -1.317252, 2.435437, 0.685331, -1.316296, 2.435437, -0.442166, -1.316296, 2.435437, 0.442166, -1.312948, 0.0648, 0.441041, -1.312948, 0.0648, -0.441041, -1.312782, 2.482687, -0.440985, -1.312782, 2.482687, 0.440985, -1.311049, 2.463, -0.440403, -1.311049, 2.463, 0.440403, -1.309063, 1.621875, -1.309063, -1.309063, 1.621875, 1.309063, -1.301322, 0.260025, 0.955023, -1.301322, 0.260025, -0.955023, -1.3, 2.4, 0.0, -1.3, 2.4, 0.0, -1.29881, 2.463, -0.675736, -1.29881, 2.463, 0.675736, -1.29504, 0.4632, -1.29504, -1.29504, 0.4632, 1.29504, -1.286108, 0.084525, -0.669128, -1.286108, 0.084525, 0.669128, -1.284375, 0.046875, 0.0, -1.284375, 0.046875, 0.0, -1.283256, 2.4, -0.213304, -1.283256, 2.4, 0.213304, -1.280502, 2.482687, -0.666211, -1.280502, 2.482687, 0.666211, -1.2746, 2.4408, 0.0, -1.2746, 2.4408, 0.0, -1.274414, 2.242575, -0.935276, -1.274414, 2.242575, 0.935276, -1.267832, 0.046875, -0.21074, -1.267832, 0.046875, 0.21074, -1.26664, 1.7748, -1.26664, -1.26664, 1.7748, 1.26664, -1.263395, 2.4945, -0.657311, -1.263395, 2.4945, 0.657311, -1.258183, 2.4408, 0.209136, -1.258183, 2.4408, -0.209136, -1.256003, 0.2136, 0.921764, -1.256003, 0.2136, -0.921764, -1.248557, 2.498438, -0.649591, -1.248557, 2.498438, 0.649591, -1.245776, 2.4, -0.648144, -1.245776, 2.4, 0.648144, -1.2425, 0.384375, -1.2425, -1.2425, 0.384375, 1.2425, -1.237056, 2.4945, -0.643607, -1.237056, 2.4945, 0.643607, -1.234688, 2.4, -0.414752, -1.234688, 2.4, 0.414752, -1.233252, 2.435437, -0.641628, -1.233252, 2.435437, 0.641628, -1.230115, 0.0648, -0.639996, -1.230115, 0.0648, 0.639996, -1.229959, 2.482687, -0.639915, -1.229959, 2.482687, 0.639915, -1.228335, 2.463, -0.63907, -1.228335, 2.463, 0.63907, -1.22525, 0.177075, 0.899195, -1.22525, 0.177075, -0.899195, -1.219958, 1.929525, 1.219958, -1.219958, 1.929525, -1.219958, -1.219848, 0.046875, -0.409767, -1.219848, 0.046875, 0.409767, -1.21392, 2.4, -0.89088, -1.21392, 0.15, -0.89088, -1.21392, 0.15, -0.89088, -1.21392, 0.15, 0.89088, -1.21392, 0.15, 0.89088, -1.21392, 2.4, 0.89088, -1.211067, 0.127575, 0.888786, -1.211067, 0.127575, -0.888786, -1.210564, 2.4408, 0.406648, -1.210564, 2.4408, -0.406648, -1.2048, 2.4744, 0.0, -1.2048, 2.4744, 0.0, -1.198382, 0.1056, -0.879477, -1.198382, 0.1056, 0.879477, -1.197997, 2.435437, -0.879195, -1.197997, 2.435437, 0.879195, -1.18996, 0.3168, -1.18996, -1.18996, 0.3168, 1.18996, -1.189282, 2.4744, -0.197684, -1.189282, 2.4744, 0.197684, -1.18784, 0.9, -1.61856, -1.18784, 0.9, -1.61856, -1.18784, 0.9, 1.61856, -1.18784, 0.9, 1.61856, -1.183534, 1.037175, -1.612693, -1.183534, 1.037175, 1.612693, -1.181225, 2.463, -0.866886, -1.181225, 2.463, 0.866886, -1.179525, 0.771675, -1.60723, -1.179525, 0.771675, 1.60723, -1.17121, 1.1784, -1.5959, -1.17121, 1.1784, 1.5959, -1.17008, 2.0856, -1.17008, -1.17008, 2.0856, 1.17008, -1.169673, 0.084525, -0.858407, -1.169673, 0.084525, 0.858407, -1.164574, 2.482687, -0.854666, -1.164574, 2.482687, 0.854666, -1.156956, 0.6564, -1.576477, -1.156956, 0.6564, 1.576477, -1.156792, 2.4, -0.601848, -1.156792, 2.4, 0.601848, -1.151759, 1.323225, -1.569396, -1.151759, 1.323225, 1.569396, -1.149016, 2.4945, -0.843248, -1.149016, 2.4945, 0.843248, -1.144271, 2.4744, -0.384379, -1.144271, 2.4744, 0.384379, -1.1436, 0.0312, 0.0, -1.1436, 0.0312, 0.0, -1.142888, 0.046875, -0.594614, -1.142888, 0.046875, 0.594614, -1.14168, 0.260025, 1.14168, -1.14168, 0.260025, -1.14168, -1.135521, 2.498438, -0.833344, -1.135521, 2.498438, 0.833344, -1.13419, 2.4408, 0.590089, -1.13419, 2.4408, -0.590089, -1.132992, 2.4, -0.831488, -1.132992, 2.4, 0.831488, -1.12887, 0.0312, -0.187642, -1.12887, 0.0312, 0.187642, -1.126072, 1.4712, -1.534395, -1.126072, 1.4712, 1.534395, -1.125061, 2.4945, -0.825668, -1.125061, 2.4945, 0.825668, -1.123697, 0.553725, -1.531158, -1.123697, 0.553725, 1.531158, -1.121601, 2.435437, -0.823129, -1.121601, 2.435437, 0.823129, -1.118749, 0.0648, -0.821035, -1.118749, 0.0648, 0.821035, -1.118607, 2.482687, -0.820931, -1.118607, 2.482687, 0.820931, -1.118073, 2.242575, -1.118073, -1.118073, 2.242575, 1.118073, -1.11713, 2.463, -0.819847, -1.11713, 2.463, 0.819847, -1.10192, 0.2136, 1.10192, -1.10192, 0.2136, -1.10192, -1.1002, 2.5026, 0.0, -1.1002, 2.5026, 0.0, -1.09504, 1.621875, -1.49211, -1.09504, 1.621875, 1.49211, -1.086146, 0.0312, 0.364854, -1.086146, 0.0312, -0.364854, -1.086029, 2.5026, 0.180521, -1.086029, 2.5026, -0.180521, -1.08331, 0.4632, -1.476127, -1.08331, 0.4632, 1.476127, -1.07494, 0.177075, -1.07494, -1.07494, 0.177075, 1.07494, -1.072079, 2.4744, -0.557774, -1.072079, 2.4744, 0.557774, -1.065, 2.4, -1.065, -1.065, 0.15, -1.065, -1.065, 0.15, 1.065, -1.065, 2.4, 1.065, -1.062497, 0.127575, 1.062497, -1.062497, 0.127575, -1.062497, -1.059553, 1.7748, -1.443756, -1.059553, 1.7748, 1.443756, -1.052064, 2.4, -0.772096, -1.052064, 2.4, 0.772096, -1.051368, 0.1056, -1.051368, -1.051368, 0.1056, 1.051368, -1.051031, 2.435437, -1.051031, -1.051031, 2.435437, 1.051031, -1.044926, 2.5026, -0.351008, -1.044926, 2.5026, 0.351008, -1.039419, 0.046875, -0.762816, -1.039419, 0.046875, 0.762816, -1.03936, 0.384375, -1.41624, -1.03936, 0.384375, 1.41624, -1.036316, 2.463, -1.036316, -1.036316, 2.463, 1.036316, -1.031508, 2.4408, 0.75701, -1.031508, 2.4408, -0.75701, -1.026181, 0.084525, -1.026181, -1.026181, 0.084525, 1.026181, -1.021708, 2.482687, -1.021708, -1.021708, 2.482687, 1.021708, -1.020503, 1.929525, -1.390545, -1.020503, 1.929525, 1.390545, -1.017621, 0.0312, 0.529441, -1.017621, 0.0312, -0.529441, -1.008058, 2.4945, -1.008058, -1.008058, 2.4945, 1.008058, -0.996219, 2.498438, -0.996219, -0.996219, 2.498438, 0.996219, -0.99541, 0.3168, -1.356353, -0.99541, 0.3168, 1.356353, -0.994, 2.4, -0.994, -0.994, 2.4, 0.994, -0.987042, 2.4945, -0.987042, -0.987042, 2.4945, 0.987042, -0.984007, 2.435437, -0.984007, -0.984007, 2.435437, 0.984007, -0.981504, 0.0648, 0.981504, -0.981504, 0.0648, -0.981504, -0.98138, 2.482687, -0.98138, -0.98138, 2.482687, 0.98138, -0.980084, 2.463, -0.980084, -0.980084, 2.463, 0.980084, -0.979002, 2.5026, 0.509349, -0.979002, 2.5026, -0.509349, -0.97878, 2.0856, -1.333693, -0.97878, 2.0856, 1.333693, -0.975021, 2.4744, -0.715555, -0.975021, 2.4744, 0.715555, -0.9704, 2.5272, 0.0, -0.9704, 2.5272, 0.0, -0.957901, 2.5272, -0.159223, -0.957901, 2.5272, 0.159223, -0.955023, 0.260025, 1.301322, -0.955023, 0.260025, -1.301322, -0.952425, 0.018225, -0.0, -0.952425, 0.018225, 0.0, -0.940158, 0.018225, 0.156274, -0.940158, 0.018225, -0.156274, -0.935276, 2.242575, -1.274414, -0.935276, 2.242575, 1.274414, -0.92592, 0.9, -1.77968, -0.92592, 0.9, 1.77968, -0.92592, 0.9, 1.77968, -0.92592, 0.9, -1.77968, -0.925493, 0.0312, 0.679207, -0.925493, 0.0312, -0.679207, -0.923, 2.4, -0.923, -0.923, 2.4, 0.923, -0.922564, 1.037175, 1.773229, -0.922564, 1.037175, -1.773229, -0.921764, 0.2136, 1.256003, -0.921764, 0.2136, -1.256003, -0.921647, 2.5272, -0.309596, -0.921647, 2.5272, 0.309596, -0.919439, 0.771675, -1.767222, -0.919439, 0.771675, 1.767222, -0.912957, 1.1784, -1.754764, -0.912957, 1.1784, 1.754764, -0.911906, 0.046875, -0.911906, -0.911906, 0.046875, 0.911906, -0.904966, 2.4408, 0.904966, -0.904966, 2.4408, -0.904966, -0.904575, 0.018225, 0.303862, -0.904575, 0.018225, -0.303862, -0.901846, 0.6564, -1.733408, -0.901846, 0.6564, 1.733408, -0.899195, 0.177075, 1.22525, -0.899195, 0.177075, -1.22525, -0.897795, 1.323225, -1.725622, -0.897795, 1.323225, 1.725622, -0.89088, 0.15, -1.21392, -0.89088, 0.15, 1.21392, -0.89088, 2.4, -1.21392, -0.89088, 0.15, -1.21392, -0.89088, 0.15, 1.21392, -0.89088, 2.4, 1.21392, -0.89037, 2.5026, -0.653431, -0.89037, 2.5026, 0.653431, -0.888786, 0.127575, 1.211067, -0.888786, 0.127575, -1.211067, -0.879477, 0.1056, -1.198382, -0.879477, 0.1056, 1.198382, -0.879195, 2.435437, -1.197997, -0.879195, 2.435437, 1.197997, -0.877772, 1.4712, -1.687137, -0.877772, 1.4712, 1.687137, -0.87592, 0.553725, -1.683577, -0.87592, 0.553725, 1.683577, -0.866886, 2.463, -1.181225, -0.866886, 2.463, 1.181225, -0.863501, 2.5272, -0.449256, -0.863501, 2.5272, 0.449256, -0.858407, 0.084525, -1.169673, -0.858407, 0.084525, 1.169673, -0.855408, 2.4744, -0.855408, -0.855408, 2.4744, 0.855408, -0.854666, 2.482687, -1.164574, -0.854666, 2.482687, 1.164574, -0.853583, 1.621875, -1.640643, -0.853583, 1.621875, 1.640643, -0.847506, 0.018225, -0.440935, -0.847506, 0.018225, 0.440935, -0.844439, 0.4632, 1.623068, -0.844439, 0.4632, -1.623068, -0.843248, 2.4945, -1.149016, -0.843248, 2.4945, 1.149016, -0.833344, 2.498438, -1.135521, -0.833344, 2.498438, 1.135521, -0.831488, 2.4, -1.132992, -0.831488, 2.4, 1.132992, -0.825921, 1.7748, 1.587475, -0.825921, 1.7748, -1.587475, -0.825668, 2.4945, -1.125061, -0.825668, 2.4945, 1.125061, -0.825, 2.55, 0.0, -0.825, 2.55, 0.0, -0.823129, 2.435437, -1.121601, -0.823129, 2.435437, 1.121601, -0.821035, 0.0648, 1.118749, -0.821035, 0.0648, -1.118749, -0.820931, 2.482687, 1.118607, -0.820931, 2.482687, -1.118607, -0.819847, 2.463, -1.11713, -0.819847, 2.463, 1.11713, -0.814374, 2.55, -0.135366, -0.814374, 2.55, 0.135366, -0.811956, 0.0312, 0.811956, -0.811956, 0.0312, -0.811956, -0.81018, 0.384375, 1.55722, -0.81018, 0.384375, -1.55722, -0.795481, 1.929525, 1.528968, -0.795481, 1.929525, -1.528968, -0.785325, 2.5272, -0.57634, -0.785325, 2.5272, 0.57634, -0.783552, 2.55, -0.263208, -0.783552, 2.55, 0.263208, -0.781142, 2.5026, -0.781142, -0.781142, 2.5026, 0.781142, -0.775921, 0.3168, -1.491372, -0.775921, 0.3168, 1.491372, -0.772096, 2.4, -1.052064, -0.772096, 2.4, 1.052064, -0.770779, 0.018225, 0.565664, -0.770779, 0.018225, -0.565664, -0.762958, 2.0856, -1.466456, -0.762958, 2.0856, 1.466456, -0.762816, 0.046875, -1.039419, -0.762816, 0.046875, 1.039419, -0.75701, 2.4408, 1.031508, -0.75701, 2.4408, -1.031508, -0.74444, 0.260025, 1.430863, -0.74444, 0.260025, -1.430863, -0.734118, 2.55, -0.381942, -0.734118, 2.55, 0.381942, -0.729046, 2.242575, -1.401276, -0.729046, 2.242575, 1.401276, -0.718514, 0.2136, 1.381032, -0.718514, 0.2136, -1.381032, -0.715555, 2.4744, -0.975021, -0.715555, 2.4744, 0.975021, -0.7032, 0.0084, 0.0, -0.700921, 0.177075, 1.347218, -0.700921, 0.177075, -1.347218, -0.69444, 0.15, -1.33476, -0.69444, 0.15, 1.33476, -0.69444, 2.4, 1.33476, -0.69444, 0.15, 1.33476, -0.69444, 2.4, -1.33476, -0.69444, 0.15, -1.33476, -0.694143, 0.0084, -0.115381, -0.694143, 0.0084, 0.115381, -0.692808, 0.127575, 1.331623, -0.692808, 0.127575, -1.331623, -0.688984, 2.5272, -0.688984, -0.688984, 2.5272, 0.688984, -0.685551, 0.1056, -1.317675, -0.685551, 0.1056, 1.317675, -0.685331, 2.435437, -1.317252, -0.685331, 2.435437, 1.317252, -0.679207, 0.0312, -0.925493, -0.679207, 0.0312, 0.925493, -0.676222, 0.018225, 0.676222, -0.676222, 0.018225, -0.676222, -0.675736, 2.463, -1.29881, -0.675736, 2.463, 1.29881, -0.6736, 2.5728, 0.0, -0.6736, 2.5728, 0.0, -0.669128, 0.084525, -1.286108, -0.669128, 0.084525, 1.286108, -0.667871, 0.0084, -0.224349, -0.667871, 0.0084, 0.224349, -0.667656, 2.55, -0.489984, -0.667656, 2.55, 0.489984, -0.666211, 2.482687, 1.280502, -0.666211, 2.482687, -1.280502, -0.664924, 2.5728, -0.110524, -0.664924, 2.5728, 0.110524, -0.657311, 2.4945, -1.263395, -0.657311, 2.4945, 1.263395, -0.653431, 2.5026, -0.89037, -0.653431, 2.5026, 0.89037, -0.649591, 2.498438, -1.248557, -0.649591, 2.498438, 1.248557, -0.648144, 2.4, -1.245776, -0.648144, 2.4, 1.245776, -0.643607, 2.4945, -1.237056, -0.643607, 2.4945, 1.237056, -0.641628, 2.435437, -1.233252, -0.641628, 2.435437, 1.233252, -0.639996, 0.0648, -1.230115, -0.639996, 0.0648, 1.230115, -0.639915, 2.482687, 1.229959, -0.639915, 2.482687, -1.229959, -0.639758, 2.5728, -0.214905, -0.639758, 2.5728, 0.214905, -0.63907, 2.463, -1.228335, -0.63907, 2.463, 1.228335, -0.63808, 0.9, -1.89952, -0.63808, 0.9, -1.89952, -0.63808, 0.9, 1.89952, -0.63808, 0.9, 1.89952, -0.635767, 1.037175, -1.892634, -0.635767, 1.037175, 1.892634, -0.633613, 0.771675, -1.886223, -0.633613, 0.771675, 1.886223, -0.629147, 1.1784, -1.872927, -0.629147, 1.1784, 1.872927, -0.625735, 0.0084, 0.325553, -0.625735, 0.0084, -0.325553, -0.62149, 0.6564, -1.850132, -0.62149, 0.6564, 1.850132, -0.618698, 1.323225, -1.841822, -0.618698, 1.323225, 1.841822, -0.6049, 1.4712, -1.800745, -0.6049, 1.4712, 1.800745, -0.603624, 0.553725, -1.796946, -0.603624, 0.553725, 1.796946, -0.601848, 2.4, -1.156792, -0.601848, 2.4, 1.156792, -0.599396, 2.5728, -0.31185, -0.599396, 2.5728, 0.31185, -0.594614, 0.046875, -1.142888, -0.594614, 0.046875, 1.142888, -0.590089, 2.4408, 1.13419, -0.590089, 2.4408, -1.13419, -0.58823, 1.621875, -1.75112, -0.58823, 1.621875, 1.75112, -0.58575, 2.55, -0.58575, -0.58575, 2.55, 0.58575, -0.581929, 0.4632, -1.732362, -0.581929, 0.4632, 1.732362, -0.57634, 2.5272, -0.785325, -0.57634, 2.5272, 0.785325, -0.569167, 1.7748, -1.694372, -0.569167, 1.7748, 1.694372, -0.569086, 0.0084, -0.417645, -0.569086, 0.0084, 0.417645, -0.565664, 0.018225, 0.770779, -0.565664, 0.018225, -0.770779, -0.55832, 0.384375, -1.66208, -0.55832, 0.384375, 1.66208, -0.557774, 2.4744, -1.072079, -0.557774, 2.4744, 1.072079, -0.54819, 1.929525, -1.631925, -0.54819, 1.929525, 1.631925, -0.545131, 2.5728, -0.400065, -0.545131, 2.5728, 0.400065, -0.534711, 0.3168, -1.591798, -0.534711, 0.3168, 1.591798, -0.529441, 0.0312, -1.017621, -0.529441, 0.0312, 1.017621, -0.5258, 2.5974, 0.0, -0.5258, 2.5974, 0.0, -0.525778, 2.0856, -1.565204, -0.525778, 2.0856, 1.565204, -0.519028, 2.5974, 0.086273, -0.519028, 2.5974, -0.086273, -0.513016, 0.260025, -1.527214, -0.513016, 0.260025, 1.527214, -0.509349, 2.5026, 0.979002, -0.509349, 2.5026, -0.979002, -0.502408, 2.242575, -1.495635, -0.502408, 2.242575, 1.495635, -0.499384, 2.5974, -0.167751, -0.499384, 2.5974, 0.167751, -0.499272, 0.0084, -0.499272, -0.499272, 0.0084, 0.499272, -0.49515, 0.2136, -1.474028, -0.49515, 0.2136, 1.474028, -0.489984, 2.55, -0.667656, -0.489984, 2.55, 0.667656, -0.483027, 0.177075, -1.437937, -0.483027, 0.177075, 1.437937, -0.47856, 0.15, 1.42464, -0.47856, 2.4, -1.42464, -0.47856, 0.15, -1.42464, -0.47856, 0.15, -1.42464, -0.47856, 0.15, 1.42464, -0.47856, 2.4, 1.42464, -0.478256, 2.5728, -0.478256, -0.478256, 2.5728, 0.478256, -0.477435, 0.127575, 1.421292, -0.477435, 0.127575, -1.421292, -0.472434, 0.1056, 1.406405, -0.472434, 0.1056, -1.406405, -0.472283, 2.435437, -1.405953, -0.472283, 2.435437, 1.405953, -0.467878, 2.5974, -0.243424, -0.467878, 2.5974, 0.243424, -0.465671, 2.463, -1.38627, -0.465671, 2.463, 1.38627, -0.461116, 0.084525, 1.372712, -0.461116, 0.084525, -1.372712, -0.459107, 2.482687, -1.366728, -0.459107, 2.482687, 1.366728, -0.452973, 2.4945, -1.348469, -0.452973, 2.4945, 1.348469, -0.449256, 2.5272, -0.863501, -0.449256, 2.5272, 0.863501, -0.447653, 2.498438, -1.332632, -0.447653, 2.498438, 1.332632, -0.446656, 2.4, -1.329664, -0.446656, 2.4, 1.329664, -0.443529, 2.4945, -1.320356, -0.443529, 2.4945, 1.320356, -0.442166, 2.435437, -1.316296, -0.442166, 2.435437, 1.316296, -0.441041, 0.0648, 1.312948, -0.441041, 0.0648, -1.312948, -0.440985, 2.482687, -1.312782, -0.440985, 2.482687, 1.312782, -0.440935, 0.018225, 0.847506, -0.440935, 0.018225, -0.847506, -0.440403, 2.463, -1.311049, -0.440403, 2.463, 1.311049, -0.425519, 2.5974, 0.312283, -0.425519, 2.5974, -0.312283, -0.417645, 0.0084, -0.569086, -0.417645, 0.0084, 0.569086, -0.414752, 2.4, -1.234688, -0.414752, 2.4, 1.234688, -0.409767, 0.046875, 1.219848, -0.409767, 0.046875, -1.219848, -0.406648, 2.4408, -1.210564, -0.406648, 2.4408, 1.210564, -0.400065, 2.5728, -0.545131, -0.400065, 2.5728, 0.545131, -0.3912, 2.6256, 0.0, -0.3912, 2.6256, 0.0, -0.388275, 0.002175, -0.0, -0.388275, 0.002175, 0.0, -0.386161, 2.6256, -0.064188, -0.386161, 2.6256, 0.064188, -0.384379, 2.4744, -1.144271, -0.384379, 2.4744, 1.144271, -0.383274, 0.002175, -0.063708, -0.383274, 0.002175, 0.063708, -0.381942, 2.55, -0.734118, -0.381942, 2.55, 0.734118, -0.373318, 2.5974, -0.373318, -0.373318, 2.5974, 0.373318, -0.371546, 2.6256, -0.124808, -0.371546, 2.6256, 0.124808, -0.368768, 0.002175, -0.123875, -0.368768, 0.002175, 0.123875, -0.364854, 0.0312, 1.086146, -0.364854, 0.0312, -1.086146, -0.3584, 3.0348, 0.0, -0.3584, 3.0348, 0.0, -0.3582, 3.08115, 0.0, -0.3582, 3.08115, 0.0, -0.353807, 3.0348, -0.059016, -0.353807, 3.0348, 0.059016, -0.35361, 3.08115, -0.058988, -0.35361, 3.08115, 0.058988, -0.351008, 2.5026, -1.044926, -0.351008, 2.5026, 1.044926, -0.348105, 2.6256, -0.18111, -0.348105, 2.6256, 0.18111, -0.345503, 0.002175, -0.179756, -0.345503, 0.002175, 0.179756, -0.340477, 3.0348, -0.114676, -0.340477, 3.0348, 0.114676, -0.340289, 3.08115, -0.114619, -0.340289, 3.08115, 0.114619, -0.32816, 0.9, -1.97424, -0.32816, 0.9, 1.97424, -0.32816, 0.9, 1.97424, -0.32697, 1.037175, -1.967083, -0.32697, 1.037175, 1.967083, -0.325863, 0.771675, -1.96042, -0.325863, 0.771675, 1.96042, -0.325553, 0.0084, -0.625735, -0.325553, 0.0084, 0.625735, -0.325, 2.98125, 0.0, -0.325, 2.98125, 0.0, -0.323566, 1.1784, -1.946601, -0.323566, 1.1784, 1.946601, -0.320834, 2.98125, -0.053508, -0.320834, 2.98125, 0.053508, -0.319628, 0.6564, -1.92291, -0.319628, 0.6564, 1.92291, -0.319082, 3.0348, -0.166306, -0.319082, 3.0348, 0.166306, -0.318907, 3.08115, -0.166221, -0.318907, 3.08115, 0.166221, -0.318192, 1.323225, -1.914272, -0.318192, 1.323225, 1.914272, -0.31659, 2.6256, -0.232342, -0.31659, 2.6256, 0.232342, -0.314223, 0.002175, -0.230604, -0.314223, 0.002175, 0.230604, -0.312283, 2.5974, -0.425519, -0.312283, 2.5974, 0.425519, -0.31185, 2.5728, -0.599396, -0.31185, 2.5728, 0.599396, -0.311096, 1.4712, -1.87158, -0.311096, 1.4712, 1.87158, -0.310439, 0.553725, -1.867631, -0.310439, 0.553725, 1.867631, -0.309596, 2.5272, -0.921647, -0.309596, 2.5272, 0.921647, -0.3088, 3.1176, 0.0, -0.3088, 3.1176, 0.0, -0.308744, 2.98125, -0.103976, -0.308744, 2.98125, 0.103976, -0.304843, 3.1176, -0.050855, -0.304843, 3.1176, 0.050855, -0.303862, 0.018225, 0.904575, -0.303862, 0.018225, -0.904575, -0.302523, 1.621875, -1.820003, -0.302522, 1.621875, 1.820003, -0.299282, 0.4632, -1.800507, -0.299282, 0.4632, 1.800507, -0.29336, 3.1176, -0.098814, -0.29336, 3.1176, 0.098814, -0.292719, 1.7748, -1.761022, -0.292719, 1.7748, 1.761022, -0.290295, 3.0348, -0.213234, -0.290295, 3.0348, 0.213234, -0.290138, 3.08115, -0.213123, -0.290138, 3.08115, 0.213123, -0.28934, 2.98125, -0.150793, -0.28934, 2.98125, 0.150793, -0.28714, 0.384375, -1.72746, -0.28714, 0.384375, 1.72746, -0.28193, 1.929525, 1.696119, -0.28193, 1.929525, -1.696119, -0.2794, 2.6592, 0.0, -0.277752, 2.6256, -0.277752, -0.277752, 2.6256, 0.277752, -0.275801, 2.6592, -0.045844, -0.275801, 2.6592, 0.045844, -0.275675, 0.002175, -0.275675, -0.275675, 0.002175, 0.275675, -0.274998, 0.3168, -1.654413, -0.274998, 0.3168, 1.654413, -0.274928, 3.1176, -0.143301, -0.274928, 3.1176, 0.143301, -0.2736, 2.9232, 0.0, -0.2736, 2.9232, 0.0, -0.270404, 2.0856, -1.626774, -0.270404, 2.0856, 1.626774, -0.270092, 2.9232, -0.045032, -0.270092, 2.9232, 0.045032, -0.265363, 2.6592, -0.08914, -0.265363, 2.6592, 0.08914, -0.263841, 0.260025, 1.587289, -0.263841, 0.260025, -1.587289, -0.263232, 2.98125, -0.193348, -0.263232, 2.98125, 0.193348, -0.263208, 2.55, -0.783552, -0.263208, 2.55, 0.783552, -0.25991, 2.9232, -0.087511, -0.25991, 2.9232, 0.087511, -0.258385, 2.242575, -1.554467, -0.258385, 2.242575, 1.554467, -0.254788, 3.0348, -0.254788, -0.254788, 3.0348, 0.254788, -0.254653, 3.08115, -0.254653, -0.254653, 3.08115, 0.254653, -0.254652, 0.2136, -1.53201, -0.254652, 0.2136, 1.53201, -0.250127, 3.1176, -0.183734, -0.250127, 3.1176, 0.183734, -0.248621, 2.6592, 0.129351, -0.248621, 2.6592, -0.129351, -0.248417, 0.177075, -1.4945, -0.248417, 0.177075, 1.4945, -0.24612, 0.15, 1.48068, -0.24612, 2.4, -1.48068, -0.24612, 0.15, -1.48068, -0.24612, 0.15, -1.48068, -0.24612, 0.15, 1.48068, -0.24612, 2.4, 1.48068, -0.245542, 0.127575, 1.4772, -0.245542, 0.127575, -1.4772, -0.243569, 2.9232, -0.12692, -0.243569, 2.9232, 0.12692, -0.243424, 2.5974, 0.467878, -0.243424, 2.5974, -0.467878, -0.24297, 0.1056, 1.461727, -0.24297, 0.1056, -1.461727, -0.242892, 2.435437, -1.461258, -0.242892, 2.435437, 1.461258, -0.239491, 2.463, -1.4408, -0.239491, 2.463, 1.4408, -0.237149, 0.084525, 1.426709, -0.237149, 0.084525, -1.426709, -0.236115, 2.482687, -1.42049, -0.236115, 2.482687, 1.42049, -0.232961, 2.4945, -1.401513, -0.232961, 2.4945, 1.401513, -0.232342, 2.6256, -0.31659, -0.232342, 2.6256, 0.31659, -0.231031, 2.98125, -0.231031, -0.231031, 2.98125, 0.231031, -0.230604, 0.002175, -0.314223, -0.230604, 0.002175, 0.314223, -0.230225, 2.498438, -1.385053, -0.230225, 2.498438, 1.385053, -0.229712, 2.4, -1.381968, -0.229712, 2.4, 1.381968, -0.228104, 2.4945, -1.372294, -0.228104, 2.4945, 1.372294, -0.227403, 2.435437, -1.368074, -0.227403, 2.435437, 1.368074, -0.226824, 0.0648, 1.364595, -0.226824, 0.0648, -1.364595, -0.226795, 2.482687, 1.364422, -0.226795, 2.482687, -1.364422, -0.226496, 2.463, -1.36262, -0.226496, 2.463, 1.36262, -0.226113, 2.6592, -0.165941, -0.226113, 2.6592, 0.165941, -0.224349, 0.0084, 0.667871, -0.224349, 0.0084, -0.667871, -0.221585, 2.9232, -0.162745, -0.221585, 2.9232, 0.162745, -0.2198, 2.86335, 0.0, -0.2198, 2.86335, 0.0, -0.219536, 3.1176, -0.219536, -0.219536, 3.1176, 0.219536, -0.216979, 2.86335, 0.036157, -0.216979, 2.86335, -0.036157, -0.214905, 2.5728, -0.639758, -0.214905, 2.5728, 0.639758, -0.213304, 2.4, -1.283256, -0.213304, 2.4, 1.283256, -0.213234, 3.0348, -0.290295, -0.213234, 3.0348, 0.290295, -0.213123, 3.08115, -0.290138, -0.213123, 3.08115, 0.290138, -0.21074, 0.046875, -1.267832, -0.21074, 0.046875, 1.267832, -0.209136, 2.4408, -1.258183, -0.209136, 2.4408, 1.258183, -0.208794, 2.86335, 0.07027, -0.208794, 2.86335, -0.07027, -0.2, 2.7, 0.0, -0.2, 2.7, 0.0, -0.2, 2.7, 0.0, -0.2, 2.7, 0.0, -0.198374, 2.6592, -0.198374, -0.198374, 2.6592, 0.198374, -0.197684, 2.4744, -1.189282, -0.197684, 2.4744, 1.189282, -0.197424, 2.7, -0.032816, -0.197424, 2.7, 0.032816, -0.197424, 2.7, 0.032816, -0.197424, 2.7, -0.032816, -0.195658, 2.86335, -0.101925, -0.195658, 2.86335, 0.101925, -0.1946, 3.14145, 0.0, -0.1946, 3.14145, 0.0, -0.194472, 2.9232, -0.194472, -0.194472, 2.9232, 0.194472, -0.193348, 2.98125, -0.263232, -0.193348, 2.98125, 0.263232, -0.192107, 3.14145, -0.032048, -0.192107, 3.14145, 0.032048, -0.189952, 2.7, -0.063808, -0.189952, 2.7, 0.063808, -0.189952, 2.7, 0.063808, -0.189952, 2.7, -0.063808, -0.187642, 0.0312, 1.12887, -0.187642, 0.0312, -1.12887, -0.18487, 3.14145, -0.062272, -0.18487, 3.14145, 0.062272, -0.183734, 3.1176, -0.250127, -0.183734, 3.1176, 0.250127, -0.18111, 2.6256, 0.348105, -0.18111, 2.6256, -0.348105, -0.180521, 2.5026, -1.086029, -0.180521, 2.5026, 1.086029, -0.179756, 0.002175, -0.345503, -0.179756, 0.002175, 0.345503, -0.1792, 2.8044, 0.0, -0.1792, 2.8044, 0.0, -0.177989, 2.86335, -0.130707, -0.177989, 2.86335, 0.130707, -0.177968, 2.7, -0.092592, -0.177968, 2.7, 0.092592, -0.177968, 2.7, 0.092592, -0.177968, 2.7, -0.092592, -0.176897, 2.8044, 0.02945, -0.176897, 2.8044, -0.02945, -0.173255, 3.14145, -0.090306, -0.173255, 3.14145, 0.090306, -0.170215, 2.8044, 0.057246, -0.170215, 2.8044, -0.057246, -0.167751, 2.5974, -0.499384, -0.167751, 2.5974, 0.499384, -0.1674, 2.74905, 0.0, -0.1674, 2.74905, 0.0, -0.166306, 3.0348, -0.319082, -0.166306, 3.0348, 0.319082, -0.166221, 3.08115, 0.318907, -0.166221, 3.08115, -0.318907, -0.165941, 2.6592, -0.226113, -0.165941, 2.6592, 0.226113, -0.165245, 2.74905, 0.02748, -0.165245, 2.74905, -0.02748, -0.162745, 2.9232, -0.221585, -0.162745, 2.9232, 0.221585, -0.161856, 2.7, -0.118784, -0.161856, 2.7, 0.118784, -0.161856, 2.7, 0.118784, -0.161856, 2.7, -0.118784, -0.159496, 2.8044, 0.083047, -0.159496, 2.8044, -0.083047, -0.159223, 2.5272, -0.957901, -0.159223, 2.5272, 0.957901, -0.158995, 2.74905, 0.053428, -0.158995, 2.74905, -0.053428, -0.157626, 3.14145, -0.115787, -0.157626, 3.14145, 0.115787, -0.156274, 0.018225, 0.940158, -0.156274, 0.018225, -0.940158, -0.1562, 2.86335, -0.1562, -0.1562, 2.86335, 0.1562, -0.150793, 2.98125, -0.28934, -0.150793, 2.98125, 0.28934, -0.148969, 2.74905, 0.077523, -0.148969, 2.74905, -0.077523, -0.145078, 2.8044, 0.106513, -0.145078, 2.8044, -0.106513, -0.143301, 3.1176, -0.274928, -0.143301, 3.1176, 0.274928, -0.142, 2.7, -0.142, -0.142, 2.7, 0.142, -0.142, 2.7, 0.142, -0.142, 2.7, -0.142, -0.138348, 3.14145, -0.138348, -0.138348, 3.14145, 0.138348, -0.135489, 2.74905, 0.099446, -0.135489, 2.74905, -0.099446, -0.135366, 2.55, -0.814374, -0.135366, 2.55, 0.814374, -0.130707, 2.86335, -0.177989, -0.130707, 2.86335, 0.177989, -0.129351, 2.6592, 0.248621, -0.129351, 2.6592, -0.248621, -0.127304, 2.8044, 0.127304, -0.127304, 2.8044, -0.127304, -0.12692, 2.9232, -0.243569, -0.12692, 2.9232, 0.243569, -0.124808, 2.6256, -0.371546, -0.124808, 2.6256, 0.371546, -0.123875, 0.002175, 0.368768, -0.123875, 0.002175, -0.368768, -0.118874, 2.74905, 0.118874, -0.118874, 2.74905, -0.118874, -0.118784, 2.7, -0.161856, -0.118784, 2.7, 0.161856, -0.118784, 2.7, 0.161856, -0.118784, 2.7, -0.161856, -0.115787, 3.14145, -0.157626, -0.115787, 3.14145, 0.157626, -0.115381, 0.0084, 0.694143, -0.115381, 0.0084, -0.694143, -0.114676, 3.0348, -0.340477, -0.114676, 3.0348, 0.340477, -0.114619, 3.08115, -0.340289, -0.114619, 3.08115, 0.340289, -0.110524, 2.5728, -0.664924, -0.110524, 2.5728, 0.664924, -0.106513, 2.8044, -0.145078, -0.106513, 2.8044, 0.145078, -0.103976, 2.98125, -0.308744, -0.103976, 2.98125, 0.308744, -0.101925, 2.86335, -0.195658, -0.101925, 2.86335, 0.195658, -0.099446, 2.74905, 0.135489, -0.099446, 2.74905, -0.135489, -0.098814, 3.1176, -0.29336, -0.098814, 3.1176, 0.29336, -0.092592, 2.7, -0.177968, -0.092592, 2.7, 0.177968, -0.092592, 2.7, -0.177968, -0.092592, 2.7, 0.177968, -0.090306, 3.14145, -0.173255, -0.090306, 3.14145, 0.173255, -0.08914, 2.6592, -0.265363, -0.08914, 2.6592, 0.265363, -0.087511, 2.9232, -0.25991, -0.087511, 2.9232, 0.25991, -0.086273, 2.5974, -0.519028, -0.086273, 2.5974, 0.519028, -0.083047, 2.8044, -0.159496, -0.083047, 2.8044, 0.159496, -0.077523, 2.74905, -0.148969, -0.077523, 2.74905, 0.148969, -0.07027, 2.86335, -0.208794, -0.07027, 2.86335, 0.208794, -0.064188, 2.6256, -0.386161, -0.064188, 2.6256, 0.386161, -0.063808, 2.7, -0.189952, -0.063808, 2.7, 0.189952, -0.063808, 2.7, -0.189952, -0.063808, 2.7, 0.189952, -0.063708, 0.002175, 0.383274, -0.063708, 0.002175, -0.383274, -0.062272, 3.14145, -0.18487, -0.062272, 3.14145, 0.18487, -0.059016, 3.0348, -0.353807, -0.059016, 3.0348, 0.353807, -0.058988, 3.08115, -0.35361, -0.058988, 3.08115, 0.35361, -0.057246, 2.8044, -0.170215, -0.057246, 2.8044, 0.170215, -0.053508, 2.98125, -0.320834, -0.053508, 2.98125, 0.320834, -0.053428, 2.74905, -0.158995, -0.053428, 2.74905, 0.158995, -0.050855, 3.1176, -0.304843, -0.050855, 3.1176, 0.304843, -0.045844, 2.6592, -0.275801, -0.045844, 2.6592, 0.275801, -0.045032, 2.9232, -0.270092, -0.045032, 2.9232, 0.270092, -0.036157, 2.86335, -0.216979, -0.036157, 2.86335, 0.216979, -0.032816, 2.7, -0.197424, -0.032816, 2.7, 0.197424, -0.032816, 2.7, -0.197424, -0.032816, 2.7, 0.197424, -0.032048, 3.14145, -0.192107, -0.032048, 3.14145, 0.192107, -0.02945, 2.8044, -0.176897, -0.02945, 2.8044, 0.176897, -0.02748, 2.74905, -0.165245, -0.02748, 2.74905, 0.165245, -0.0, 0.260025, 1.608, -0.0, 1.929525, 1.71825, -0.0, 2.0856, -1.648, -0.0, 0.6564, -1.948, -0.0, 0.771675, -1.986, -0.0, 2.482687, 1.382225, -0.0, 2.7, -0.2, -0.0, 0.127575, 1.496475, -0.0, 2.4744, -1.2048, -0.0, 2.74905, -0.1674, -0.0, 0.018225, 0.952425, -0.0, 0.046875, -1.284375, -0.0, 0.0648, 1.3824, -0.0, 0.384375, 1.75, -0.0, 0.4632, 1.824, -0.0, 0.553725, -1.892, -0.0, 1.037175, 1.99275, -0.0, 1.1784, 1.972, -0.0, 1.323225, -1.93925, -0.0, 1.621875, -1.84375, -0.0, 1.7748, 1.784, -0.0, 2.4, -1.3, -0.0, 2.435437, -1.480325, -0.0, 2.435437, -1.385925, -0.0, 2.463, -1.4596, -0.0, 2.463, -1.3804, -0.0, 2.4945, -1.3902, -0.0, 2.5026, -1.1002, -0.0, 2.8044, -0.1792, -0.0, 2.86335, -0.2198, -0.0, 2.5728, -0.6736, -0.0, 0.1056, 1.4808, -0.0, 0.177075, -1.514, -0.0, 2.4945, -1.4198, -0.0, 2.5272, -0.9704, -0.0, 2.9232, -0.2736, -0.0, 3.1176, -0.3088, -0.0, 2.5974, -0.5258, -0.0, 2.7, -0.2, -0.0, 2.98125, -0.325, -0.0, 3.14145, -0.1946, -0.0, 0.002175, 0.388275, -0.0, 3.08115, -0.3582, 0.0, 0.0, 0.0, 0.0, 0.002175, -0.388275, 0.0, 0.002175, 0.388275, 0.0, 0.0084, -0.7032, 0.0, 0.0084, 0.7032, 0.0, 0.018225, -0.952425, 0.0, 0.018225, 0.952425, 0.0, 0.0312, -1.1436, 0.0, 0.0312, -1.1436, 0.0, 0.0312, 1.1436, 0.0, 0.0312, 1.1436, 0.0, 0.046875, -1.284375, 0.0, 0.046875, 1.284375, 0.0, 0.0648, -1.3824, 0.0, 0.0648, 1.3824, 0.0, 0.084525, -1.445325, 0.0, 0.084525, -1.445325, 0.0, 0.084525, 1.445325, 0.0, 0.084525, 1.445325, 0.0, 0.1056, -1.4808, 0.0, 0.1056, 1.4808, 0.0, 0.127575, -1.496475, 0.0, 0.127575, 1.496475, 0.0, 0.15, -1.5, 0.0, 0.15, -1.5, 0.0, 0.15, 1.5, 0.0, 0.15, 1.5, 0.0, 0.177075, -1.514, 0.0, 0.177075, 1.514, 0.0, 0.2136, -1.552, 0.0, 0.2136, -1.552, 0.0, 0.2136, 1.552, 0.0, 0.2136, 1.552, 0.0, 0.260025, -1.608, 0.0, 0.260025, 1.608, 0.0, 0.3168, -1.676, 0.0, 0.3168, -1.676, 0.0, 0.3168, 1.676, 0.0, 0.3168, 1.676, 0.0, 0.384375, -1.75, 0.0, 0.384375, 1.75, 0.0, 0.4632, -1.824, 0.0, 0.4632, 1.824, 0.0, 0.553725, -1.892, 0.0, 0.553725, 1.892, 0.0, 0.6564, -1.948, 0.0, 0.6564, 1.948, 0.0, 0.771675, -1.986, 0.0, 0.771675, 1.986, 0.0, 0.9, -2.0, 0.0, 0.9, -2.0, 0.0, 0.9, 2.0, 0.0, 0.9, 2.0, 0.0, 1.037175, -1.99275, 0.0, 1.037175, 1.99275, 0.0, 1.1784, -1.972, 0.0, 1.1784, 1.972, 0.0, 1.323225, -1.93925, 0.0, 1.323225, 1.93925, 0.0, 1.4712, -1.896, 0.0, 1.4712, -1.896, 0.0, 1.4712, 1.896, 0.0, 1.4712, 1.896, 0.0, 1.621875, -1.84375, 0.0, 1.621875, 1.84375, 0.0, 1.7748, -1.784, 0.0, 1.7748, 1.784, 0.0, 1.929525, -1.71825, 0.0, 1.929525, 1.71825, 0.0, 2.0856, -1.648, 0.0, 2.0856, 1.648, 0.0, 2.242575, -1.57475, 0.0, 2.242575, -1.57475, 0.0, 2.242575, 1.57475, 0.0, 2.242575, 1.57475, 0.0, 2.4, -1.5, 0.0, 2.4, -1.5, 0.0, 2.4, -1.4, 0.0, 2.4, -1.4, 0.0, 2.4, -1.3, 0.0, 2.4, 1.3, 0.0, 2.4, 1.4, 0.0, 2.4, 1.4, 0.0, 2.4, 1.5, 0.0, 2.4, 1.5, 0.0, 2.435437, -1.480325, 0.0, 2.435437, -1.385925, 0.0, 2.435437, 1.385925, 0.0, 2.435437, 1.480325, 0.0, 2.4408, -1.2746, 0.0, 2.4408, -1.2746, 0.0, 2.4408, 1.2746, 0.0, 2.4408, 1.2746, 0.0, 2.463, -1.4596, 0.0, 2.463, -1.3804, 0.0, 2.463, 1.3804, 0.0, 2.463, 1.4596, 0.0, 2.4744, -1.2048, 0.0, 2.4744, 1.2048, 0.0, 2.482687, -1.439025, 0.0, 2.482687, -1.382225, 0.0, 2.482687, 1.382225, 0.0, 2.482687, 1.439025, 0.0, 2.4945, -1.4198, 0.0, 2.4945, -1.3902, 0.0, 2.4945, 1.3902, 0.0, 2.4945, 1.4198, 0.0, 2.498438, -1.403125, 0.0, 2.498438, -1.403125, 0.0, 2.498438, 1.403125, 0.0, 2.498438, 1.403125, 0.0, 2.5026, -1.1002, 0.0, 2.5026, 1.1002, 0.0, 2.5272, -0.9704, 0.0, 2.5272, 0.9704, 0.0, 2.55, -0.825, 0.0, 2.55, -0.825, 0.0, 2.55, 0.825, 0.0, 2.55, 0.825, 0.0, 2.5728, -0.6736, 0.0, 2.5728, 0.6736, 0.0, 2.5974, -0.5258, 0.0, 2.5974, 0.5258, 0.0, 2.6256, -0.3912, 0.0, 2.6256, -0.3912, 0.0, 2.6256, 0.3912, 0.0, 2.6256, 0.3912, 0.0, 2.6592, -0.2794, 0.0, 2.6592, 0.2794, 0.0, 2.7, -0.2, 0.0, 2.7, -0.2, 0.0, 2.7, 0.2, 0.0, 2.7, 0.2, 0.0, 2.74905, -0.1674, 0.0, 2.74905, 0.1674, 0.0, 2.8044, -0.1792, 0.0, 2.8044, 0.1792, 0.0, 2.86335, -0.2198, 0.0, 2.86335, 0.2198, 0.0, 2.9232, -0.2736, 0.0, 2.9232, 0.2736, 0.0, 2.98125, -0.325, 0.0, 2.98125, 0.325, 0.0, 3.0348, -0.3584, 0.0, 3.0348, -0.3584, 0.0, 3.0348, 0.3584, 0.0, 3.0348, 0.3584, 0.0, 3.08115, -0.3582, 0.0, 3.08115, 0.3582, 0.0, 3.1176, -0.3088, 0.0, 3.1176, 0.3088, 0.0, 3.14145, -0.1946, 0.0, 3.14145, 0.1946, 0.0, 3.15, 0.0, 0.0, 0.002175, -0.388275, 0.0, 3.08115, 0.3582, 0.0, 2.5974, 0.5258, 0.0, 2.7, 0.2, 0.0, 2.98125, 0.325, 0.0, 3.14145, 0.1946, 0.0, 3.1176, 0.3088, 0.0, 0.1056, -1.4808, 0.0, 0.177075, 1.514, 0.0, 2.4945, 1.4198, 0.0, 2.5272, 0.9704, 0.0, 2.9232, 0.2736, 0.0, 2.5728, 0.6736, 0.0, 2.86335, 0.2198, 0.0, 0.018225, -0.952425, 0.0, 0.046875, 1.284375, 0.0, 0.0648, -1.3824, 0.0, 0.384375, -1.75, 0.0, 0.4632, -1.824, 0.0, 0.553725, 1.892, 0.0, 1.037175, -1.99275, 0.0, 1.1784, -1.972, 0.0, 1.323225, 1.93925, 0.0, 1.621875, 1.84375, 0.0, 1.7748, -1.784, 0.0, 2.4, 1.3, 0.0, 2.435437, 1.385925, 0.0, 2.435437, 1.480325, 0.0, 2.463, 1.3804, 0.0, 2.463, 1.4596, 0.0, 2.4945, 1.3902, 0.0, 2.5026, 1.1002, 0.0, 2.8044, 0.1792, 0.0, 2.74905, 0.1674, 0.0, 0.127575, -1.496475, 0.0, 2.4744, 1.2048, 0.0, 0.6564, 1.948, 0.0, 0.771675, 1.986, 0.0, 2.482687, -1.382225, 0.0, 2.7, 0.2, 0.0, 0.260025, -1.608, 0.0, 1.929525, -1.71825, 0.0, 2.0856, 1.648, 0.02748, 2.74905, -0.165245, 0.02748, 2.74905, 0.165245, 0.02945, 2.8044, -0.176897, 0.02945, 2.8044, 0.176897, 0.032048, 3.14145, -0.192107, 0.032048, 3.14145, 0.192107, 0.032816, 2.7, -0.197424, 0.032816, 2.7, 0.197424, 0.032816, 2.7, -0.197424, 0.032816, 2.7, 0.197424, 0.036157, 2.86335, -0.216979, 0.036157, 2.86335, 0.216979, 0.045032, 2.9232, -0.270092, 0.045032, 2.9232, 0.270092, 0.045844, 2.6592, -0.275801, 0.045844, 2.6592, 0.275801, 0.050855, 3.1176, -0.304843, 0.050855, 3.1176, 0.304843, 0.053428, 2.74905, -0.158995, 0.053428, 2.74905, 0.158995, 0.053508, 2.98125, -0.320834, 0.053508, 2.98125, 0.320834, 0.057246, 2.8044, -0.170215, 0.057246, 2.8044, 0.170215, 0.058988, 3.08115, -0.35361, 0.058988, 3.08115, 0.35361, 0.059016, 3.0348, -0.353807, 0.059016, 3.0348, 0.353807, 0.062272, 3.14145, -0.18487, 0.062272, 3.14145, 0.18487, 0.063708, 0.002175, 0.383274, 0.063708, 0.002175, -0.383274, 0.063808, 2.7, -0.189952, 0.063808, 2.7, 0.189952, 0.063808, 2.7, -0.189952, 0.063808, 2.7, 0.189952, 0.064188, 2.6256, -0.386161, 0.064188, 2.6256, 0.386161, 0.07027, 2.86335, -0.208794, 0.07027, 2.86335, 0.208794, 0.077523, 2.74905, -0.148969, 0.077523, 2.74905, 0.148969, 0.083047, 2.8044, -0.159496, 0.083047, 2.8044, 0.159496, 0.086273, 2.5974, -0.519028, 0.086273, 2.5974, 0.519028, 0.087511, 2.9232, -0.25991, 0.087511, 2.9232, 0.25991, 0.08914, 2.6592, -0.265363, 0.08914, 2.6592, 0.265363, 0.090306, 3.14145, -0.173255, 0.090306, 3.14145, 0.173255, 0.092592, 2.7, -0.177968, 0.092592, 2.7, 0.177968, 0.092592, 2.7, -0.177968, 0.092592, 2.7, 0.177968, 0.098814, 3.1176, -0.29336, 0.098814, 3.1176, 0.29336, 0.099446, 2.74905, 0.135489, 0.099446, 2.74905, -0.135489, 0.101925, 2.86335, -0.195658, 0.101925, 2.86335, 0.195658, 0.103976, 2.98125, -0.308744, 0.103976, 2.98125, 0.308744, 0.106513, 2.8044, -0.145078, 0.106513, 2.8044, 0.145078, 0.110524, 2.5728, -0.664924, 0.110524, 2.5728, 0.664924, 0.114619, 3.08115, -0.340289, 0.114619, 3.08115, 0.340289, 0.114676, 3.0348, -0.340477, 0.114676, 3.0348, 0.340477, 0.115381, 0.0084, 0.694143, 0.115381, 0.0084, -0.694143, 0.115787, 3.14145, -0.157626, 0.115787, 3.14145, 0.157626, 0.118784, 2.7, 0.161856, 0.118784, 2.7, -0.161856, 0.118784, 2.7, -0.161856, 0.118784, 2.7, 0.161856, 0.118874, 2.74905, 0.118874, 0.118874, 2.74905, -0.118874, 0.123875, 0.002175, 0.368768, 0.123875, 0.002175, -0.368768, 0.124808, 2.6256, -0.371546, 0.124808, 2.6256, 0.371546, 0.12692, 2.9232, -0.243569, 0.12692, 2.9232, 0.243569, 0.127304, 2.8044, 0.127304, 0.127304, 2.8044, -0.127304, 0.129351, 2.6592, 0.248621, 0.129351, 2.6592, -0.248621, 0.130707, 2.86335, -0.177989, 0.130707, 2.86335, 0.177989, 0.135366, 2.55, -0.814374, 0.135366, 2.55, 0.814374, 0.135489, 2.74905, 0.099446, 0.135489, 2.74905, -0.099446, 0.138348, 3.14145, -0.138348, 0.138348, 3.14145, 0.138348, 0.142, 2.7, 0.142, 0.142, 2.7, -0.142, 0.142, 2.7, -0.142, 0.142, 2.7, 0.142, 0.143301, 3.1176, -0.274928, 0.143301, 3.1176, 0.274928, 0.145078, 2.8044, 0.106513, 0.145078, 2.8044, -0.106513, 0.148969, 2.74905, 0.077523, 0.148969, 2.74905, -0.077523, 0.150793, 2.98125, -0.28934, 0.150793, 2.98125, 0.28934, 0.1562, 2.86335, -0.1562, 0.1562, 2.86335, 0.1562, 0.156274, 0.018225, 0.940158, 0.156274, 0.018225, -0.940158, 0.157626, 3.14145, -0.115787, 0.157626, 3.14145, 0.115787, 0.158995, 2.74905, 0.053428, 0.158995, 2.74905, -0.053428, 0.159223, 2.5272, -0.957901, 0.159223, 2.5272, 0.957901, 0.159496, 2.8044, 0.083047, 0.159496, 2.8044, -0.083047, 0.161856, 2.7, 0.118784, 0.161856, 2.7, -0.118784, 0.161856, 2.7, -0.118784, 0.161856, 2.7, 0.118784, 0.162745, 2.9232, -0.221585, 0.162745, 2.9232, 0.221585, 0.165245, 2.74905, 0.02748, 0.165245, 2.74905, -0.02748, 0.165941, 2.6592, -0.226113, 0.165941, 2.6592, 0.226113, 0.166221, 3.08115, 0.318907, 0.166221, 3.08115, -0.318907, 0.166306, 3.0348, -0.319082, 0.166306, 3.0348, 0.319082, 0.1674, 2.74905, -0.0, 0.1674, 2.74905, 0.0, 0.167751, 2.5974, -0.499384, 0.167751, 2.5974, 0.499384, 0.170215, 2.8044, 0.057246, 0.170215, 2.8044, -0.057246, 0.173255, 3.14145, -0.090306, 0.173255, 3.14145, 0.090306, 0.176897, 2.8044, 0.02945, 0.176897, 2.8044, -0.02945, 0.177968, 2.7, 0.092592, 0.177968, 2.7, -0.092592, 0.177968, 2.7, -0.092592, 0.177968, 2.7, 0.092592, 0.177989, 2.86335, -0.130707, 0.177989, 2.86335, 0.130707, 0.1792, 2.8044, -0.0, 0.1792, 2.8044, 0.0, 0.179756, 0.002175, -0.345503, 0.179756, 0.002175, 0.345503, 0.180521, 2.5026, -1.086029, 0.180521, 2.5026, 1.086029, 0.18111, 2.6256, 0.348105, 0.18111, 2.6256, -0.348105, 0.183734, 3.1176, -0.250127, 0.183734, 3.1176, 0.250127, 0.18487, 3.14145, -0.062272, 0.18487, 3.14145, 0.062272, 0.187642, 0.0312, 1.12887, 0.187642, 0.0312, -1.12887, 0.189952, 2.7, 0.063808, 0.189952, 2.7, -0.063808, 0.189952, 2.7, -0.063808, 0.189952, 2.7, 0.063808, 0.192107, 3.14145, -0.032048, 0.192107, 3.14145, 0.032048, 0.193348, 2.98125, -0.263232, 0.193348, 2.98125, 0.263232, 0.194472, 2.9232, -0.194472, 0.194472, 2.9232, 0.194472, 0.1946, 3.14145, 0.0, 0.1946, 3.14145, -0.0, 0.195658, 2.86335, -0.101925, 0.195658, 2.86335, 0.101925, 0.197424, 2.7, 0.032816, 0.197424, 2.7, -0.032816, 0.197424, 2.7, -0.032816, 0.197424, 2.7, 0.032816, 0.197684, 2.4744, -1.189282, 0.197684, 2.4744, 1.189282, 0.198374, 2.6592, -0.198374, 0.198374, 2.6592, 0.198374, 0.2, 2.7, -0.0, 0.2, 2.7, 0.0, 0.2, 2.7, 0.0, 0.2, 2.7, -0.0, 0.208794, 2.86335, 0.07027, 0.208794, 2.86335, -0.07027, 0.209136, 2.4408, -1.258183, 0.209136, 2.4408, 1.258183, 0.21074, 0.046875, -1.267832, 0.21074, 0.046875, 1.267832, 0.213123, 3.08115, -0.290138, 0.213123, 3.08115, 0.290138, 0.213234, 3.0348, -0.290295, 0.213234, 3.0348, 0.290295, 0.213304, 2.4, -1.283256, 0.213304, 2.4, 1.283256, 0.214905, 2.5728, -0.639758, 0.214905, 2.5728, 0.639758, 0.216979, 2.86335, 0.036157, 0.216979, 2.86335, -0.036157, 0.219536, 3.1176, -0.219536, 0.219536, 3.1176, 0.219536, 0.2198, 2.86335, -0.0, 0.2198, 2.86335, 0.0, 0.221585, 2.9232, -0.162745, 0.221585, 2.9232, 0.162745, 0.224349, 0.0084, 0.667871, 0.224349, 0.0084, -0.667871, 0.226113, 2.6592, -0.165941, 0.226113, 2.6592, 0.165941, 0.226496, 2.463, -1.36262, 0.226496, 2.463, 1.36262, 0.226795, 2.482687, 1.364422, 0.226795, 2.482687, -1.364422, 0.226824, 0.0648, 1.364595, 0.226824, 0.0648, -1.364595, 0.227403, 2.435437, -1.368074, 0.227403, 2.435437, 1.368074, 0.228104, 2.4945, -1.372294, 0.228104, 2.4945, 1.372294, 0.229712, 2.4, -1.381968, 0.229712, 2.4, 1.381968, 0.230225, 2.498438, -1.385053, 0.230225, 2.498438, 1.385053, 0.230604, 0.002175, -0.314223, 0.230604, 0.002175, 0.314223, 0.231031, 2.98125, -0.231031, 0.231031, 2.98125, 0.231031, 0.232342, 2.6256, -0.31659, 0.232342, 2.6256, 0.31659, 0.232961, 2.4945, -1.401513, 0.232961, 2.4945, 1.401513, 0.236115, 2.482687, -1.42049, 0.236115, 2.482687, 1.42049, 0.237149, 0.084525, 1.426709, 0.237149, 0.084525, -1.426709, 0.239491, 2.463, -1.4408, 0.239491, 2.463, 1.4408, 0.242892, 2.435437, -1.461258, 0.242892, 2.435437, 1.461258, 0.24297, 0.1056, 1.461727, 0.24297, 0.1056, -1.461727, 0.243424, 2.5974, 0.467878, 0.243424, 2.5974, -0.467878, 0.243569, 2.9232, -0.12692, 0.243569, 2.9232, 0.12692, 0.245542, 0.127575, 1.4772, 0.245542, 0.127575, -1.4772, 0.24612, 0.15, -1.48068, 0.24612, 2.4, -1.48068, 0.24612, 0.15, 1.48068, 0.24612, 0.15, 1.48068, 0.24612, 2.4, 1.48068, 0.24612, 0.15, -1.48068, 0.248417, 0.177075, -1.4945, 0.248417, 0.177075, 1.4945, 0.248621, 2.6592, 0.129351, 0.248621, 2.6592, -0.129351, 0.250127, 3.1176, -0.183734, 0.250127, 3.1176, 0.183734, 0.254652, 0.2136, -1.53201, 0.254652, 0.2136, 1.53201, 0.254653, 3.08115, -0.254653, 0.254653, 3.08115, 0.254653, 0.254788, 3.0348, -0.254788, 0.254788, 3.0348, 0.254788, 0.258385, 2.242575, -1.554467, 0.258385, 2.242575, 1.554467, 0.25991, 2.9232, -0.087511, 0.25991, 2.9232, 0.087511, 0.263208, 2.55, -0.783552, 0.263208, 2.55, 0.783552, 0.263232, 2.98125, -0.193348, 0.263232, 2.98125, 0.193348, 0.263841, 0.260025, 1.587289, 0.263841, 0.260025, -1.587289, 0.265363, 2.6592, -0.08914, 0.265363, 2.6592, 0.08914, 0.270092, 2.9232, -0.045032, 0.270092, 2.9232, 0.045032, 0.270404, 2.0856, -1.626774, 0.270404, 2.0856, 1.626774, 0.2736, 2.9232, -0.0, 0.2736, 2.9232, 0.0, 0.274928, 3.1176, -0.143301, 0.274928, 3.1176, 0.143301, 0.274998, 0.3168, -1.654413, 0.274998, 0.3168, 1.654413, 0.275675, 0.002175, -0.275675, 0.275675, 0.002175, 0.275675, 0.275801, 2.6592, -0.045844, 0.275801, 2.6592, 0.045844, 0.277752, 2.6256, -0.277752, 0.277752, 2.6256, 0.277752, 0.2794, 2.6592, 0.0, 0.28193, 1.929525, 1.696119, 0.28193, 1.929525, -1.696119, 0.28714, 0.384375, -1.72746, 0.28714, 0.384375, 1.72746, 0.28934, 2.98125, -0.150793, 0.28934, 2.98125, 0.150793, 0.290138, 3.08115, -0.213123, 0.290138, 3.08115, 0.213123, 0.290295, 3.0348, -0.213234, 0.290295, 3.0348, 0.213234, 0.292719, 1.7748, -1.761022, 0.292719, 1.7748, 1.761022, 0.29336, 3.1176, -0.098814, 0.29336, 3.1176, 0.098814, 0.299282, 0.4632, -1.800507, 0.299282, 0.4632, 1.800507, 0.302522, 1.621875, -1.820003, 0.302523, 1.621875, 1.820003, 0.303862, 0.018225, 0.904575, 0.303862, 0.018225, -0.904575, 0.304843, 3.1176, -0.050855, 0.304843, 3.1176, 0.050855, 0.308744, 2.98125, -0.103976, 0.308744, 2.98125, 0.103976, 0.3088, 3.1176, 0.0, 0.3088, 3.1176, -0.0, 0.309596, 2.5272, -0.921647, 0.309596, 2.5272, 0.921647, 0.310439, 0.553725, -1.867631, 0.310439, 0.553725, 1.867631, 0.311096, 1.4712, -1.87158, 0.311096, 1.4712, 1.87158, 0.31185, 2.5728, -0.599396, 0.31185, 2.5728, 0.599396, 0.312283, 2.5974, -0.425519, 0.312283, 2.5974, 0.425519, 0.314223, 0.002175, -0.230604, 0.314223, 0.002175, 0.230604, 0.31659, 2.6256, -0.232342, 0.31659, 2.6256, 0.232342, 0.318192, 1.323225, -1.914272, 0.318192, 1.323225, 1.914272, 0.318907, 3.08115, -0.166221, 0.318907, 3.08115, 0.166221, 0.319082, 3.0348, -0.166306, 0.319082, 3.0348, 0.166306, 0.319628, 0.6564, -1.92291, 0.319628, 0.6564, 1.92291, 0.320834, 2.98125, -0.053508, 0.320834, 2.98125, 0.053508, 0.323566, 1.1784, -1.946601, 0.323566, 1.1784, 1.946601, 0.325, 2.98125, 0.0, 0.325, 2.98125, -0.0, 0.325553, 0.0084, -0.625735, 0.325553, 0.0084, 0.625735, 0.325863, 0.771675, -1.96042, 0.325863, 0.771675, 1.96042, 0.32697, 1.037175, -1.967083, 0.32697, 1.037175, 1.967083, 0.32816, 0.9, -1.97424, 0.32816, 0.9, -1.97424, 0.32816, 0.9, 1.97424, 0.340289, 3.08115, -0.114619, 0.340289, 3.08115, 0.114619, 0.340477, 3.0348, -0.114676, 0.340477, 3.0348, 0.114676, 0.345503, 0.002175, -0.179756, 0.345503, 0.002175, 0.179756, 0.348105, 2.6256, -0.18111, 0.348105, 2.6256, 0.18111, 0.351008, 2.5026, -1.044926, 0.351008, 2.5026, 1.044926, 0.35361, 3.08115, -0.058988, 0.35361, 3.08115, 0.058988, 0.353807, 3.0348, -0.059016, 0.353807, 3.0348, 0.059016, 0.3582, 3.08115, -0.0, 0.3582, 3.08115, 0.0, 0.3584, 3.0348, 0.0, 0.3584, 3.0348, 0.0, 0.364854, 0.0312, 1.086146, 0.364854, 0.0312, -1.086146, 0.368768, 0.002175, -0.123875, 0.368768, 0.002175, 0.123875, 0.371546, 2.6256, -0.124808, 0.371546, 2.6256, 0.124808, 0.373318, 2.5974, -0.373318, 0.373318, 2.5974, 0.373318, 0.381942, 2.55, -0.734118, 0.381942, 2.55, 0.734118, 0.383274, 0.002175, -0.063708, 0.383274, 0.002175, 0.063708, 0.384379, 2.4744, -1.144271, 0.384379, 2.4744, 1.144271, 0.386161, 2.6256, -0.064188, 0.386161, 2.6256, 0.064188, 0.388275, 0.002175, 0.0, 0.388275, 0.002175, 0.0, 0.3912, 2.6256, 0.0, 0.3912, 2.6256, 0.0, 0.400065, 2.5728, -0.545131, 0.400065, 2.5728, 0.545131, 0.406648, 2.4408, -1.210564, 0.406648, 2.4408, 1.210564, 0.409767, 0.046875, 1.219848, 0.409767, 0.046875, -1.219848, 0.414752, 2.4, -1.234688, 0.414752, 2.4, 1.234688, 0.417645, 0.0084, -0.569086, 0.417645, 0.0084, 0.569086, 0.425519, 2.5974, 0.312283, 0.425519, 2.5974, -0.312283, 0.440403, 2.463, -1.311049, 0.440403, 2.463, 1.311049, 0.440935, 0.018225, 0.847506, 0.440935, 0.018225, -0.847506, 0.440985, 2.482687, -1.312782, 0.440985, 2.482687, 1.312782, 0.441041, 0.0648, 1.312948, 0.441041, 0.0648, -1.312948, 0.442166, 2.435437, -1.316296, 0.442166, 2.435437, 1.316296, 0.443529, 2.4945, -1.320356, 0.443529, 2.4945, 1.320356, 0.446656, 2.4, -1.329664, 0.446656, 2.4, 1.329664, 0.447653, 2.498438, -1.332632, 0.447653, 2.498438, 1.332632, 0.449256, 2.5272, -0.863501, 0.449256, 2.5272, 0.863501, 0.452973, 2.4945, -1.348469, 0.452973, 2.4945, 1.348469, 0.459107, 2.482687, -1.366728, 0.459107, 2.482687, 1.366728, 0.461116, 0.084525, 1.372712, 0.461116, 0.084525, -1.372712, 0.465671, 2.463, -1.38627, 0.465671, 2.463, 1.38627, 0.467878, 2.5974, -0.243424, 0.467878, 2.5974, 0.243424, 0.472283, 2.435437, -1.405953, 0.472283, 2.435437, 1.405953, 0.472434, 0.1056, 1.406405, 0.472434, 0.1056, -1.406405, 0.477435, 0.127575, 1.421292, 0.477435, 0.127575, -1.421292, 0.478256, 2.5728, -0.478256, 0.478256, 2.5728, 0.478256, 0.47856, 0.15, -1.42464, 0.47856, 2.4, -1.42464, 0.47856, 0.15, 1.42464, 0.47856, 0.15, 1.42464, 0.47856, 0.15, -1.42464, 0.47856, 2.4, 1.42464, 0.483027, 0.177075, -1.437937, 0.483027, 0.177075, 1.437937, 0.489984, 2.55, -0.667656, 0.489984, 2.55, 0.667656, 0.49515, 0.2136, -1.474028, 0.49515, 0.2136, 1.474028, 0.499272, 0.0084, -0.499272, 0.499272, 0.0084, 0.499272, 0.499384, 2.5974, -0.167751, 0.499384, 2.5974, 0.167751, 0.502408, 2.242575, -1.495635, 0.502408, 2.242575, 1.495635, 0.509349, 2.5026, 0.979002, 0.509349, 2.5026, -0.979002, 0.513016, 0.260025, -1.527214, 0.513016, 0.260025, 1.527214, 0.519028, 2.5974, 0.086273, 0.519028, 2.5974, -0.086273, 0.525778, 2.0856, -1.565204, 0.525778, 2.0856, 1.565204, 0.5258, 2.5974, -0.0, 0.5258, 2.5974, 0.0, 0.529441, 0.0312, -1.017621, 0.529441, 0.0312, 1.017621, 0.534711, 0.3168, -1.591798, 0.534711, 0.3168, 1.591798, 0.545131, 2.5728, -0.400065, 0.545131, 2.5728, 0.400065, 0.54819, 1.929525, -1.631925, 0.54819, 1.929525, 1.631925, 0.557774, 2.4744, -1.072079, 0.557774, 2.4744, 1.072079, 0.55832, 0.384375, -1.66208, 0.55832, 0.384375, 1.66208, 0.565664, 0.018225, 0.770779, 0.565664, 0.018225, -0.770779, 0.569086, 0.0084, -0.417645, 0.569086, 0.0084, 0.417645, 0.569167, 1.7748, -1.694372, 0.569167, 1.7748, 1.694372, 0.57634, 2.5272, -0.785325, 0.57634, 2.5272, 0.785325, 0.581929, 0.4632, -1.732362, 0.581929, 0.4632, 1.732362, 0.58575, 2.55, -0.58575, 0.58575, 2.55, 0.58575, 0.58823, 1.621875, -1.75112, 0.58823, 1.621875, 1.75112, 0.590089, 2.4408, 1.13419, 0.590089, 2.4408, -1.13419, 0.594614, 0.046875, -1.142888, 0.594614, 0.046875, 1.142888, 0.599396, 2.5728, -0.31185, 0.599396, 2.5728, 0.31185, 0.601848, 2.4, -1.156792, 0.601848, 2.4, 1.156792, 0.603624, 0.553725, -1.796946, 0.603624, 0.553725, 1.796946, 0.6049, 1.4712, -1.800745, 0.6049, 1.4712, 1.800745, 0.618698, 1.323225, -1.841822, 0.618698, 1.323225, 1.841822, 0.62149, 0.6564, -1.850132, 0.62149, 0.6564, 1.850132, 0.625735, 0.0084, 0.325553, 0.625735, 0.0084, -0.325553, 0.629147, 1.1784, -1.872927, 0.629147, 1.1784, 1.872927, 0.633613, 0.771675, -1.886223, 0.633613, 0.771675, 1.886223, 0.635767, 1.037175, -1.892634, 0.635767, 1.037175, 1.892634, 0.63808, 0.9, -1.89952, 0.63808, 0.9, -1.89952, 0.63808, 0.9, 1.89952, 0.63808, 0.9, 1.89952, 0.63907, 2.463, -1.228335, 0.63907, 2.463, 1.228335, 0.639758, 2.5728, -0.214905, 0.639758, 2.5728, 0.214905, 0.639915, 2.482687, 1.229959, 0.639915, 2.482687, -1.229959, 0.639996, 0.0648, -1.230115, 0.639996, 0.0648, 1.230115, 0.641628, 2.435437, -1.233252, 0.641628, 2.435437, 1.233252, 0.643607, 2.4945, -1.237056, 0.643607, 2.4945, 1.237056, 0.648144, 2.4, -1.245776, 0.648144, 2.4, 1.245776, 0.649591, 2.498438, -1.248557, 0.649591, 2.498438, 1.248557, 0.653431, 2.5026, -0.89037, 0.653431, 2.5026, 0.89037, 0.657311, 2.4945, -1.263395, 0.657311, 2.4945, 1.263395, 0.664924, 2.5728, -0.110524, 0.664924, 2.5728, 0.110524, 0.666211, 2.482687, 1.280502, 0.666211, 2.482687, -1.280502, 0.667656, 2.55, -0.489984, 0.667656, 2.55, 0.489984, 0.667871, 0.0084, -0.224349, 0.667871, 0.0084, 0.224349, 0.669128, 0.084525, -1.286108, 0.669128, 0.084525, 1.286108, 0.6736, 2.5728, 0.0, 0.6736, 2.5728, -0.0, 0.675736, 2.463, -1.29881, 0.675736, 2.463, 1.29881, 0.676222, 0.018225, 0.676222, 0.676222, 0.018225, -0.676222, 0.679207, 0.0312, -0.925493, 0.679207, 0.0312, 0.925493, 0.685331, 2.435437, -1.317252, 0.685331, 2.435437, 1.317252, 0.685551, 0.1056, -1.317675, 0.685551, 0.1056, 1.317675, 0.688984, 2.5272, -0.688984, 0.688984, 2.5272, 0.688984, 0.692808, 0.127575, 1.331623, 0.692808, 0.127575, -1.331623, 0.694143, 0.0084, -0.115381, 0.694143, 0.0084, 0.115381, 0.69444, 0.15, 1.33476, 0.69444, 0.15, -1.33476, 0.69444, 2.4, 1.33476, 0.69444, 0.15, -1.33476, 0.69444, 0.15, 1.33476, 0.69444, 2.4, -1.33476, 0.700921, 0.177075, 1.347218, 0.700921, 0.177075, -1.347218, 0.7032, 0.0084, 0.0, 0.715555, 2.4744, -0.975021, 0.715555, 2.4744, 0.975021, 0.718514, 0.2136, 1.381032, 0.718514, 0.2136, -1.381032, 0.729046, 2.242575, -1.401276, 0.729046, 2.242575, 1.401276, 0.734118, 2.55, -0.381942, 0.734118, 2.55, 0.381942, 0.74444, 0.260025, 1.430863, 0.74444, 0.260025, -1.430863, 0.75701, 2.4408, 1.031508, 0.75701, 2.4408, -1.031508, 0.762816, 0.046875, -1.039419, 0.762816, 0.046875, 1.039419, 0.762958, 2.0856, -1.466456, 0.762958, 2.0856, 1.466456, 0.770779, 0.018225, 0.565664, 0.770779, 0.018225, -0.565664, 0.772096, 2.4, -1.052064, 0.772096, 2.4, 1.052064, 0.775921, 0.3168, -1.491372, 0.775921, 0.3168, 1.491372, 0.781142, 2.5026, -0.781142, 0.781142, 2.5026, 0.781142, 0.783552, 2.55, -0.263208, 0.783552, 2.55, 0.263208, 0.785325, 2.5272, -0.57634, 0.785325, 2.5272, 0.57634, 0.795481, 1.929525, 1.528968, 0.795481, 1.929525, -1.528968, 0.81018, 0.384375, 1.55722, 0.81018, 0.384375, -1.55722, 0.811956, 0.0312, 0.811956, 0.811956, 0.0312, -0.811956, 0.814374, 2.55, -0.135366, 0.814374, 2.55, 0.135366, 0.819847, 2.463, -1.11713, 0.819847, 2.463, 1.11713, 0.820931, 2.482687, 1.118607, 0.820931, 2.482687, -1.118607, 0.821035, 0.0648, 1.118749, 0.821035, 0.0648, -1.118749, 0.823129, 2.435437, -1.121601, 0.823129, 2.435437, 1.121601, 0.825, 2.55, 0.0, 0.825, 2.55, 0.0, 0.825668, 2.4945, -1.125061, 0.825668, 2.4945, 1.125061, 0.825921, 1.7748, 1.587475, 0.825921, 1.7748, -1.587475, 0.831488, 2.4, -1.132992, 0.831488, 2.4, 1.132992, 0.833344, 2.498438, -1.135521, 0.833344, 2.498438, 1.135521, 0.843248, 2.4945, -1.149016, 0.843248, 2.4945, 1.149016, 0.844439, 0.4632, 1.623068, 0.844439, 0.4632, -1.623068, 0.847506, 0.018225, -0.440935, 0.847506, 0.018225, 0.440935, 0.853583, 1.621875, -1.640643, 0.853583, 1.621875, 1.640643, 0.854666, 2.482687, -1.164574, 0.854666, 2.482687, 1.164574, 0.855408, 2.4744, -0.855408, 0.855408, 2.4744, 0.855408, 0.858407, 0.084525, -1.169673, 0.858407, 0.084525, 1.169673, 0.863501, 2.5272, -0.449256, 0.863501, 2.5272, 0.449256, 0.866886, 2.463, -1.181225, 0.866886, 2.463, 1.181225, 0.87592, 0.553725, -1.683577, 0.87592, 0.553725, 1.683577, 0.877772, 1.4712, -1.687137, 0.877772, 1.4712, 1.687137, 0.879195, 2.435437, -1.197997, 0.879195, 2.435437, 1.197997, 0.879477, 0.1056, -1.198382, 0.879477, 0.1056, 1.198382, 0.888786, 0.127575, 1.211067, 0.888786, 0.127575, -1.211067, 0.89037, 2.5026, -0.653431, 0.89037, 2.5026, 0.653431, 0.89088, 0.15, -1.21392, 0.89088, 0.15, 1.21392, 0.89088, 2.4, -1.21392, 0.89088, 0.15, -1.21392, 0.89088, 0.15, 1.21392, 0.89088, 2.4, 1.21392, 0.897795, 1.323225, -1.725622, 0.897795, 1.323225, 1.725622, 0.899195, 0.177075, 1.22525, 0.899195, 0.177075, -1.22525, 0.901846, 0.6564, -1.733408, 0.901846, 0.6564, 1.733408, 0.904575, 0.018225, 0.303862, 0.904575, 0.018225, -0.303862, 0.904966, 2.4408, 0.904966, 0.904966, 2.4408, -0.904966, 0.911906, 0.046875, -0.911906, 0.911906, 0.046875, 0.911906, 0.912957, 1.1784, -1.754764, 0.912957, 1.1784, 1.754764, 0.919439, 0.771675, -1.767222, 0.919439, 0.771675, 1.767222, 0.921647, 2.5272, -0.309596, 0.921647, 2.5272, 0.309596, 0.921764, 0.2136, 1.256003, 0.921764, 0.2136, -1.256003, 0.922564, 1.037175, 1.773229, 0.922564, 1.037175, -1.773229, 0.923, 2.4, -0.923, 0.923, 2.4, 0.923, 0.925493, 0.0312, 0.679207, 0.925493, 0.0312, -0.679207, 0.92592, 0.9, 1.77968, 0.92592, 0.9, -1.77968, 0.92592, 0.9, -1.77968, 0.92592, 0.9, 1.77968, 0.935276, 2.242575, -1.274414, 0.935276, 2.242575, 1.274414, 0.940158, 0.018225, 0.156274, 0.940158, 0.018225, -0.156274, 0.952425, 0.018225, 0.0, 0.952425, 0.018225, 0.0, 0.955023, 0.260025, 1.301322, 0.955023, 0.260025, -1.301322, 0.957901, 2.5272, -0.159223, 0.957901, 2.5272, 0.159223, 0.9704, 2.5272, 0.0, 0.9704, 2.5272, -0.0, 0.975021, 2.4744, -0.715555, 0.975021, 2.4744, 0.715555, 0.97878, 2.0856, -1.333693, 0.97878, 2.0856, 1.333693, 0.979002, 2.5026, 0.509349, 0.979002, 2.5026, -0.509349, 0.980084, 2.463, -0.980084, 0.980084, 2.463, 0.980084, 0.98138, 2.482687, -0.98138, 0.98138, 2.482687, 0.98138, 0.981504, 0.0648, 0.981504, 0.981504, 0.0648, -0.981504, 0.984007, 2.435437, -0.984007, 0.984007, 2.435437, 0.984007, 0.987042, 2.4945, -0.987042, 0.987042, 2.4945, 0.987042, 0.994, 2.4, -0.994, 0.994, 2.4, 0.994, 0.99541, 0.3168, -1.356353, 0.99541, 0.3168, 1.356353, 0.996219, 2.498438, -0.996219, 0.996219, 2.498438, 0.996219, 1.008058, 2.4945, -1.008058, 1.008058, 2.4945, 1.008058, 1.017621, 0.0312, 0.529441, 1.017621, 0.0312, -0.529441, 1.020503, 1.929525, -1.390545, 1.020503, 1.929525, 1.390545, 1.021708, 2.482687, -1.021708, 1.021708, 2.482687, 1.021708, 1.026181, 0.084525, -1.026181, 1.026181, 0.084525, 1.026181, 1.031508, 2.4408, 0.75701, 1.031508, 2.4408, -0.75701, 1.036316, 2.463, -1.036316, 1.036316, 2.463, 1.036316, 1.03936, 0.384375, -1.41624, 1.03936, 0.384375, 1.41624, 1.039419, 0.046875, -0.762816, 1.039419, 0.046875, 0.762816, 1.044926, 2.5026, -0.351008, 1.044926, 2.5026, 0.351008, 1.051031, 2.435437, -1.051031, 1.051031, 2.435437, 1.051031, 1.051368, 0.1056, -1.051368, 1.051368, 0.1056, 1.051368, 1.052064, 2.4, -0.772096, 1.052064, 2.4, 0.772096, 1.059553, 1.7748, -1.443756, 1.059553, 1.7748, 1.443756, 1.062497, 0.127575, 1.062497, 1.062497, 0.127575, -1.062497, 1.065, 0.15, -1.065, 1.065, 0.15, 1.065, 1.065, 2.4, -1.065, 1.065, 2.4, 1.065, 1.072079, 2.4744, -0.557774, 1.072079, 2.4744, 0.557774, 1.07494, 0.177075, -1.07494, 1.07494, 0.177075, 1.07494, 1.08331, 0.4632, -1.476127, 1.08331, 0.4632, 1.476127, 1.086029, 2.5026, 0.180521, 1.086029, 2.5026, -0.180521, 1.086146, 0.0312, 0.364854, 1.086146, 0.0312, -0.364854, 1.09504, 1.621875, -1.49211, 1.09504, 1.621875, 1.49211, 1.1002, 2.5026, -0.0, 1.1002, 2.5026, 0.0, 1.10192, 0.2136, 1.10192, 1.10192, 0.2136, -1.10192, 1.11713, 2.463, -0.819847, 1.11713, 2.463, 0.819847, 1.118073, 2.242575, -1.118073, 1.118073, 2.242575, 1.118073, 1.118607, 2.482687, -0.820931, 1.118607, 2.482687, 0.820931, 1.118749, 0.0648, -0.821035, 1.118749, 0.0648, 0.821035, 1.121601, 2.435437, -0.823129, 1.121601, 2.435437, 0.823129, 1.123697, 0.553725, -1.531158, 1.123697, 0.553725, 1.531158, 1.125061, 2.4945, -0.825668, 1.125061, 2.4945, 0.825668, 1.126072, 1.4712, -1.534395, 1.126072, 1.4712, 1.534395, 1.12887, 0.0312, -0.187642, 1.12887, 0.0312, 0.187642, 1.132992, 2.4, -0.831488, 1.132992, 2.4, 0.831488, 1.13419, 2.4408, 0.590089, 1.13419, 2.4408, -0.590089, 1.135521, 2.498438, -0.833344, 1.135521, 2.498438, 0.833344, 1.14168, 0.260025, 1.14168, 1.14168, 0.260025, -1.14168, 1.142888, 0.046875, -0.594614, 1.142888, 0.046875, 0.594614, 1.1436, 0.0312, 0.0, 1.1436, 0.0312, 0.0, 1.144271, 2.4744, -0.384379, 1.144271, 2.4744, 0.384379, 1.149016, 2.4945, -0.843248, 1.149016, 2.4945, 0.843248, 1.151759, 1.323225, -1.569396, 1.151759, 1.323225, 1.569396, 1.156792, 2.4, -0.601848, 1.156792, 2.4, 0.601848, 1.156956, 0.6564, -1.576477, 1.156956, 0.6564, 1.576477, 1.164574, 2.482687, -0.854666, 1.164574, 2.482687, 0.854666, 1.169673, 0.084525, -0.858407, 1.169673, 0.084525, 0.858407, 1.17008, 2.0856, -1.17008, 1.17008, 2.0856, 1.17008, 1.17121, 1.1784, -1.5959, 1.17121, 1.1784, 1.5959, 1.179525, 0.771675, -1.60723, 1.179525, 0.771675, 1.60723, 1.181225, 2.463, -0.866886, 1.181225, 2.463, 0.866886, 1.183534, 1.037175, -1.612693, 1.183534, 1.037175, 1.612693, 1.18784, 0.9, -1.61856, 1.18784, 0.9, -1.61856, 1.18784, 0.9, 1.61856, 1.18784, 0.9, 1.61856, 1.189282, 2.4744, -0.197684, 1.189282, 2.4744, 0.197684, 1.18996, 0.3168, -1.18996, 1.18996, 0.3168, 1.18996, 1.197997, 2.435437, -0.879195, 1.197997, 2.435437, 0.879195, 1.198382, 0.1056, -0.879477, 1.198382, 0.1056, 0.879477, 1.2048, 2.4744, 0.0, 1.2048, 2.4744, -0.0, 1.210564, 2.4408, 0.406648, 1.210564, 2.4408, -0.406648, 1.211067, 0.127575, 0.888786, 1.211067, 0.127575, -0.888786, 1.21392, 0.15, -0.89088, 1.21392, 0.15, -0.89088, 1.21392, 0.15, 0.89088, 1.21392, 0.15, 0.89088, 1.21392, 2.4, -0.89088, 1.21392, 2.4, 0.89088, 1.219848, 0.046875, -0.409767, 1.219848, 0.046875, 0.409767, 1.219958, 1.929525, 1.219958, 1.219958, 1.929525, -1.219958, 1.22525, 0.177075, 0.899195, 1.22525, 0.177075, -0.899195, 1.228335, 2.463, -0.63907, 1.228335, 2.463, 0.63907, 1.229959, 2.482687, -0.639915, 1.229959, 2.482687, 0.639915, 1.230115, 0.0648, -0.639996, 1.230115, 0.0648, 0.639996, 1.233252, 2.435437, -0.641628, 1.233252, 2.435437, 0.641628, 1.234688, 2.4, -0.414752, 1.234688, 2.4, 0.414752, 1.237056, 2.4945, -0.643607, 1.237056, 2.4945, 0.643607, 1.2425, 0.384375, -1.2425, 1.2425, 0.384375, 1.2425, 1.245776, 2.4, -0.648144, 1.245776, 2.4, 0.648144, 1.248557, 2.498438, -0.649591, 1.248557, 2.498438, 0.649591, 1.256003, 0.2136, 0.921764, 1.256003, 0.2136, -0.921764, 1.258183, 2.4408, 0.209136, 1.258183, 2.4408, -0.209136, 1.263395, 2.4945, -0.657311, 1.263395, 2.4945, 0.657311, 1.26664, 1.7748, -1.26664, 1.26664, 1.7748, 1.26664, 1.267832, 0.046875, -0.21074, 1.267832, 0.046875, 0.21074, 1.274414, 2.242575, -0.935276, 1.274414, 2.242575, 0.935276, 1.2746, 2.4408, 0.0, 1.2746, 2.4408, 0.0, 1.280502, 2.482687, -0.666211, 1.280502, 2.482687, 0.666211, 1.283256, 2.4, -0.213304, 1.283256, 2.4, 0.213304, 1.284375, 0.046875, 0.0, 1.284375, 0.046875, -0.0, 1.286108, 0.084525, -0.669128, 1.286108, 0.084525, 0.669128, 1.29504, 0.4632, -1.29504, 1.29504, 0.4632, 1.29504, 1.29881, 2.463, -0.675736, 1.29881, 2.463, 0.675736, 1.3, 2.4, 0.0, 1.3, 2.4, -0.0, 1.301322, 0.260025, 0.955023, 1.301322, 0.260025, -0.955023, 1.309063, 1.621875, -1.309063, 1.309063, 1.621875, 1.309063, 1.311049, 2.463, -0.440403, 1.311049, 2.463, 0.440403, 1.312782, 2.482687, -0.440985, 1.312782, 2.482687, 0.440985, 1.312948, 0.0648, 0.441041, 1.312948, 0.0648, -0.441041, 1.316296, 2.435437, -0.442166, 1.316296, 2.435437, 0.442166, 1.317252, 2.435437, -0.685331, 1.317252, 2.435437, 0.685331, 1.317675, 0.1056, -0.685551, 1.317675, 0.1056, 0.685551, 1.320356, 2.4945, -0.443529, 1.320356, 2.4945, 0.443529, 1.329664, 2.4, -0.446656, 1.329664, 2.4, 0.446656, 1.331623, 0.127575, 0.692808, 1.331623, 0.127575, -0.692808, 1.332632, 2.498438, -0.447653, 1.332632, 2.498438, 0.447653, 1.333693, 2.0856, -0.97878, 1.333693, 2.0856, 0.97878, 1.33476, 0.15, 0.69444, 1.33476, 0.15, -0.69444, 1.33476, 0.15, -0.69444, 1.33476, 0.15, 0.69444, 1.33476, 2.4, -0.69444, 1.33476, 2.4, 0.69444, 1.34332, 0.553725, -1.34332, 1.34332, 0.553725, 1.34332, 1.34616, 1.4712, -1.34616, 1.34616, 1.4712, 1.34616, 1.347218, 0.177075, 0.700921, 1.347218, 0.177075, -0.700921, 1.348469, 2.4945, -0.452973, 1.348469, 2.4945, 0.452973, 1.356353, 0.3168, -0.99541, 1.356353, 0.3168, 0.99541, 1.36262, 2.463, -0.226496, 1.36262, 2.463, 0.226496, 1.364422, 2.482687, -0.226795, 1.364422, 2.482687, 0.226795, 1.364595, 0.0648, -0.226824, 1.364595, 0.0648, 0.226824, 1.366728, 2.482687, -0.459107, 1.366728, 2.482687, 0.459107, 1.368074, 2.435437, -0.227403, 1.368074, 2.435437, 0.227403, 1.372294, 2.4945, -0.228104, 1.372294, 2.4945, 0.228104, 1.372712, 0.084525, -0.461116, 1.372712, 0.084525, 0.461116, 1.376867, 1.323225, -1.376868, 1.376868, 1.323225, 1.376867, 1.3804, 2.463, 0.0, 1.3804, 2.463, -0.0, 1.381032, 0.2136, 0.718514, 1.381032, 0.2136, -0.718514, 1.381968, 2.4, -0.229712, 1.381968, 2.4, 0.229712, 1.382225, 2.482687, 0.0, 1.382225, 2.482687, 0.0, 1.3824, 0.0648, 0.0, 1.3824, 0.0648, 0.0, 1.38308, 0.6564, -1.38308, 1.38308, 0.6564, 1.38308, 1.385053, 2.498438, -0.230225, 1.385053, 2.498438, 0.230225, 1.385925, 2.435437, 0.0, 1.385925, 2.435437, -0.0, 1.38627, 2.463, -0.465671, 1.38627, 2.463, 0.465671, 1.3902, 2.4945, 0.0, 1.3902, 2.4945, -0.0, 1.390545, 1.929525, -1.020503, 1.390545, 1.929525, 1.020503, 1.4, 2.4, 0.0, 1.4, 2.4, 0.0, 1.40012, 1.1784, -1.40012, 1.40012, 1.1784, 1.40012, 1.401276, 2.242575, -0.729046, 1.401276, 2.242575, 0.729046, 1.401513, 2.4945, -0.232961, 1.401513, 2.4945, 0.232961, 1.403125, 2.498438, 0.0, 1.403125, 2.498438, 0.0, 1.405953, 2.435437, -0.472283, 1.405953, 2.435437, 0.472283, 1.406405, 0.1056, -0.472434, 1.406405, 0.1056, 0.472434, 1.41006, 0.771675, -1.41006, 1.41006, 0.771675, 1.41006, 1.414853, 1.037175, -1.414853, 1.414853, 1.037175, 1.414853, 1.41624, 0.384375, -1.03936, 1.41624, 0.384375, 1.03936, 1.4198, 2.4945, 0.0, 1.4198, 2.4945, -0.0, 1.42, 0.9, -1.42, 1.42, 0.9, -1.42, 1.42, 0.9, 1.42, 1.42, 0.9, 1.42, 1.42049, 2.482687, -0.236115, 1.42049, 2.482687, 0.236115, 1.421292, 0.127575, 0.477435, 1.421292, 0.127575, -0.477435, 1.42464, 0.15, -0.47856, 1.42464, 0.15, -0.47856, 1.42464, 0.15, 0.47856, 1.42464, 0.15, 0.47856, 1.42464, 2.4, -0.47856, 1.42464, 2.4, 0.47856, 1.426709, 0.084525, -0.237149, 1.426709, 0.084525, 0.237149, 1.430863, 0.260025, 0.74444, 1.430863, 0.260025, -0.74444, 1.437937, 0.177075, 0.483027, 1.437937, 0.177075, -0.483027, 1.439025, 2.482687, 0.0, 1.4408, 2.463, -0.239491, 1.4408, 2.463, 0.239491, 1.443756, 1.7748, -1.059553, 1.443756, 1.7748, 1.059553, 1.445325, 0.084525, 0.0, 1.445325, 0.084525, 0.0, 1.4596, 2.463, 0.0, 1.4596, 2.463, -0.0, 1.461258, 2.435437, -0.242892, 1.461258, 2.435437, 0.242892, 1.461727, 0.1056, -0.24297, 1.461727, 0.1056, 0.24297, 1.466456, 2.0856, -0.762958, 1.466456, 2.0856, 0.762958, 1.474028, 0.2136, 0.49515, 1.474028, 0.2136, -0.49515, 1.476127, 0.4632, -1.08331, 1.476127, 0.4632, 1.08331, 1.4772, 0.127575, 0.245542, 1.4772, 0.127575, -0.245542, 1.480325, 2.435437, 0.0, 1.480325, 2.435437, -0.0, 1.48068, 0.15, -0.24612, 1.48068, 0.15, 0.24612, 1.48068, 0.15, 0.24612, 1.48068, 0.15, -0.24612, 1.48068, 2.4, -0.24612, 1.48068, 2.4, 0.24612, 1.4808, 0.1056, 0.0, 1.4808, 0.1056, 0.0, 1.491372, 0.3168, -0.775921, 1.491372, 0.3168, 0.775921, 1.49211, 1.621875, -1.09504, 1.49211, 1.621875, 1.09504, 1.4945, 0.177075, 0.248417, 1.4945, 0.177075, -0.248417, 1.495635, 2.242575, -0.502408, 1.495635, 2.242575, 0.502408, 1.496475, 0.127575, 0.0, 1.496475, 0.127575, 0.0, 1.5, 0.15, 0.0, 1.5, 0.15, 0.0, 1.5, 2.4, 0.0, 1.5, 2.4, 0.0, 1.514, 0.177075, -0.0, 1.514, 0.177075, 0.0, 1.527214, 0.260025, -0.513016, 1.527214, 0.260025, 0.513016, 1.528968, 1.929525, -0.795481, 1.528968, 1.929525, 0.795481, 1.531158, 0.553725, -1.123697, 1.531158, 0.553725, 1.123697, 1.53201, 0.2136, 0.254652, 1.53201, 0.2136, -0.254652, 1.534395, 1.4712, -1.126072, 1.534395, 1.4712, 1.126072, 1.552, 0.2136, 0.0, 1.552, 0.2136, 0.0, 1.554467, 2.242575, -0.258385, 1.554467, 2.242575, 0.258385, 1.55722, 0.384375, -0.81018, 1.55722, 0.384375, 0.81018, 1.565204, 2.0856, -0.525778, 1.565204, 2.0856, 0.525778, 1.569396, 1.323225, -1.151759, 1.569396, 1.323225, 1.151759, 1.57475, 2.242575, 0.0, 1.57475, 2.242575, 0.0, 1.576477, 0.6564, -1.156956, 1.576477, 0.6564, 1.156956, 1.587289, 0.260025, 0.263841, 1.587289, 0.260025, -0.263841, 1.587475, 1.7748, -0.825921, 1.587475, 1.7748, 0.825921, 1.591798, 0.3168, -0.534711, 1.591798, 0.3168, 0.534711, 1.5959, 1.1784, -1.17121, 1.5959, 1.1784, 1.17121, 1.60723, 0.771675, -1.179525, 1.60723, 0.771675, 1.179525, 1.608, 0.260025, 0.0, 1.608, 0.260025, 0.0, 1.612693, 1.037175, -1.183534, 1.612693, 1.037175, 1.183534, 1.61856, 0.9, -1.18784, 1.61856, 0.9, -1.18784, 1.61856, 0.9, 1.18784, 1.61856, 0.9, 1.18784, 1.623068, 0.4632, -0.844439, 1.623068, 0.4632, 0.844439, 1.626774, 2.0856, -0.270404, 1.626774, 2.0856, 0.270404, 1.631925, 1.929525, -0.54819, 1.631925, 1.929525, 0.54819, 1.640643, 1.621875, -0.853583, 1.640643, 1.621875, 0.853583, 1.648, 2.0856, 0.0, 1.648, 2.0856, -0.0, 1.654413, 0.3168, -0.274998, 1.654413, 0.3168, 0.274998, 1.66208, 0.384375, -0.55832, 1.66208, 0.384375, 0.55832, 1.676, 0.3168, 0.0, 1.676, 0.3168, 0.0, 1.683577, 0.553725, -0.87592, 1.683577, 0.553725, 0.87592, 1.687137, 1.4712, -0.877772, 1.687137, 1.4712, 0.877772, 1.694372, 1.7748, -0.569167, 1.694372, 1.7748, 0.569167, 1.696119, 1.929525, -0.28193, 1.696119, 1.929525, 0.28193, 1.7, 0.6, 0.0, 1.7, 0.6, 0.0, 1.7, 0.6231, 0.1782, 1.7, 0.6231, -0.1782, 1.7, 0.6858, -0.3168, 1.7, 0.6858, 0.3168, 1.7, 0.7782, 0.4158, 1.7, 0.7782, -0.4158, 1.7, 0.8904, -0.4752, 1.7, 0.8904, 0.4752, 1.7, 1.0125, -0.495, 1.7, 1.0125, 0.495, 1.7, 1.1346, -0.4752, 1.7, 1.1346, 0.4752, 1.7, 1.2468, 0.4158, 1.7, 1.2468, -0.4158, 1.7, 1.3392, -0.3168, 1.7, 1.3392, 0.3168, 1.7, 1.4019, 0.1782, 1.7, 1.4019, -0.1782, 1.7, 1.425, 0.0, 1.7, 1.425, 0.0, 1.71825, 1.929525, 0.0, 1.71825, 1.929525, 0.0, 1.725622, 1.323225, -0.897795, 1.725622, 1.323225, 0.897795, 1.72746, 0.384375, -0.28714, 1.72746, 0.384375, 0.28714, 1.732362, 0.4632, -0.581929, 1.732362, 0.4632, 0.581929, 1.733408, 0.6564, -0.901846, 1.733408, 0.6564, 0.901846, 1.75, 0.384375, 0.0, 1.75, 0.384375, 0.0, 1.75112, 1.621875, -0.58823, 1.75112, 1.621875, 0.58823, 1.754764, 1.1784, -0.912957, 1.754764, 1.1784, 0.912957, 1.761022, 1.7748, -0.292719, 1.761022, 1.7748, 0.292719, 1.767222, 0.771675, -0.919439, 1.767222, 0.771675, 0.919439, 1.773229, 1.037175, -0.922564, 1.773229, 1.037175, 0.922564, 1.77968, 0.9, -0.92592, 1.77968, 0.9, -0.92592, 1.77968, 0.9, 0.92592, 1.77968, 0.9, 0.92592, 1.784, 1.7748, 0.0, 1.784, 1.7748, 0.0, 1.796946, 0.553725, -0.603624, 1.796946, 0.553725, 0.603624, 1.800507, 0.4632, -0.299282, 1.800507, 0.4632, 0.299282, 1.800745, 1.4712, -0.6049, 1.800745, 1.4712, 0.6049, 1.820003, 1.621875, -0.302523, 1.820003, 1.621875, 0.302522, 1.824, 0.4632, 0.0, 1.824, 0.4632, 0.0, 1.841822, 1.323225, -0.618698, 1.841822, 1.323225, 0.618698, 1.84375, 1.621875, 0.0, 1.84375, 1.621875, -0.0, 1.850132, 0.6564, -0.62149, 1.850132, 0.6564, 0.62149, 1.867631, 0.553725, -0.310439, 1.867631, 0.553725, 0.310439, 1.87158, 1.4712, -0.311096, 1.87158, 1.4712, 0.311096, 1.872927, 1.1784, -0.629147, 1.872927, 1.1784, 0.629147, 1.886223, 0.771675, -0.633613, 1.886223, 0.771675, 0.633613, 1.892, 0.553725, 0.0, 1.892, 0.553725, -0.0, 1.892634, 1.037175, -0.635767, 1.892634, 1.037175, 0.635767, 1.896, 1.4712, 0.0, 1.896, 1.4712, 0.0, 1.89952, 0.9, -0.63808, 1.89952, 0.9, -0.63808, 1.89952, 0.9, 0.63808, 1.89952, 0.9, 0.63808, 1.914272, 1.323225, -0.318192, 1.914272, 1.323225, 0.318192, 1.92291, 0.6564, -0.319628, 1.92291, 0.6564, 0.319628, 1.9359, 1.4442, 0.0, 1.9359, 1.4442, 0.0, 1.93925, 1.323225, 0.0, 1.93925, 1.323225, -0.0, 1.939394, 1.423221, -0.1751, 1.939394, 1.423221, 0.1751, 1.946601, 1.1784, -0.323566, 1.946601, 1.1784, 0.323566, 1.948, 0.6564, 0.0, 1.948, 0.6564, -0.0, 1.948879, 1.366278, -0.31129, 1.948879, 1.366278, 0.31129, 1.96042, 0.771675, -0.325863, 1.96042, 0.771675, 0.325863, 1.962857, 1.282362, -0.408568, 1.962857, 1.282362, 0.408568, 1.967083, 1.037175, -0.32697, 1.967083, 1.037175, 0.32697, 1.972, 1.1784, 0.0, 1.972, 1.1784, 0.0, 1.97424, 0.9, -0.32816, 1.97424, 0.9, 0.32816, 1.97424, 0.9, 0.32816, 1.97983, 1.180464, -0.466934, 1.97983, 1.180464, 0.466934, 1.986, 0.771675, 0.0, 1.986, 0.771675, -0.0, 1.99275, 1.037175, 0.0, 1.99275, 1.037175, 0.0, 1.9983, 1.069575, -0.48639, 1.9983, 1.069575, 0.48639, 2.0, 0.9, 0.0, 2.0, 0.9, 0.0, 2.01677, 0.958686, -0.466934, 2.01677, 0.958686, 0.466934, 2.033743, 0.856788, -0.408568, 2.033743, 0.856788, 0.408568, 2.047721, 0.772872, 0.31129, 2.047721, 0.772872, -0.31129, 2.057206, 0.715929, 0.1751, 2.057206, 0.715929, -0.1751, 2.0607, 0.69495, 0.0, 2.0607, 0.69495, 0.0, 2.1112, 1.4976, 0.0, 2.1112, 1.4976, 0.0, 2.116979, 1.47912, -0.166687, 2.116979, 1.47912, 0.166687, 2.132666, 1.42896, -0.296333, 2.132666, 1.42896, 0.296333, 2.155782, 1.35504, -0.388937, 2.155782, 1.35504, 0.388937, 2.183853, 1.26528, -0.444499, 2.183853, 1.26528, 0.444499, 2.2144, 1.1676, -0.46302, 2.2144, 1.1676, 0.46302, 2.2373, 1.5789, 0.0, 2.2373, 1.5789, 0.0, 2.244457, 1.563171, -0.154289, 2.244457, 1.563171, 0.154289, 2.244947, 1.06992, -0.444499, 2.244947, 1.06992, 0.444499, 2.263882, 1.520478, -0.274291, 2.263882, 1.520478, 0.274291, 2.273018, 0.98016, -0.388937, 2.273018, 0.98016, 0.388937, 2.29251, 1.457562, -0.360007, 2.29251, 1.457562, 0.360007, 2.296134, 0.90624, -0.296333, 2.296134, 0.90624, 0.296333, 2.311821, 0.85608, -0.166687, 2.311821, 0.85608, 0.166687, 2.3176, 0.8376, 0.0, 2.3176, 0.8376, 0.0, 2.3256, 1.6818, 0.0, 2.3256, 1.6818, 0.0, 2.327271, 1.381164, -0.411437, 2.327271, 1.381164, 0.411437, 2.33353, 1.668948, -0.139234, 2.33353, 1.668948, 0.139234, 2.355053, 1.634064, -0.247526, 2.355053, 1.634064, 0.247526, 2.3651, 1.298025, -0.42858, 2.3651, 1.298025, 0.42858, 2.386771, 1.582656, -0.324878, 2.386771, 1.582656, 0.324878, 2.3875, 1.8, 0.0, 2.3875, 1.8, 0.0, 2.3959, 1.790025, 0.12285, 2.3959, 1.790025, -0.12285, 2.402929, 1.214886, -0.411437, 2.402929, 1.214886, 0.411437, 2.4187, 1.76295, -0.2184, 2.4187, 1.76295, 0.2184, 2.425286, 1.520232, -0.37129, 2.425286, 1.520232, 0.37129, 2.4344, 1.9272, 0.0, 2.4344, 1.9272, 0.0, 2.43769, 1.138488, -0.360007, 2.43769, 1.138488, 0.360007, 2.44327, 1.919976, 0.106466, 2.44327, 1.919976, -0.106466, 2.4523, 1.72305, -0.28665, 2.4523, 1.72305, 0.28665, 2.466318, 1.075572, -0.274291, 2.466318, 1.075572, 0.274291, 2.4672, 1.4523, -0.38676, 2.4672, 1.4523, 0.38676, 2.467347, 1.900368, 0.189274, 2.467347, 1.900368, -0.189274, 2.4777, 2.0571, 0.0, 2.4777, 2.0571, 0.0, 2.485743, 1.032879, -0.154289, 2.485743, 1.032879, 0.154289, 2.487343, 2.052375, -0.091411, 2.487343, 2.052375, 0.091411, 2.4929, 1.01715, 0.0, 2.4929, 1.01715, 0.0, 2.4931, 1.6746, -0.3276, 2.4931, 1.6746, 0.3276, 2.502829, 1.871472, 0.248422, 2.502829, 1.871472, -0.248422, 2.509114, 1.384368, -0.37129, 2.509114, 1.384368, 0.37129, 2.513518, 2.03955, 0.162509, 2.513518, 2.03955, -0.162509, 2.5288, 2.1834, 0.0, 2.5375, 1.621875, -0.34125, 2.5375, 1.621875, 0.34125, 2.539821, 2.180796, -0.079013, 2.539821, 2.180796, 0.079013, 2.545914, 1.836384, -0.28391, 2.545914, 1.836384, 0.28391, 2.547629, 1.321944, -0.324878, 2.547629, 1.321944, 0.324878, 2.55209, 2.02065, -0.213293, 2.55209, 2.02065, 0.213293, 2.569734, 2.173728, -0.140467, 2.569734, 2.173728, 0.140467, 2.579347, 1.270536, -0.247526, 2.579347, 1.270536, 0.247526, 2.5819, 1.56915, -0.3276, 2.5819, 1.56915, 0.3276, 2.5928, 1.7982, -0.29574, 2.5928, 1.7982, 0.29574, 2.598929, 1.9977, -0.243763, 2.598929, 1.9977, 0.243763, 2.5991, 2.2998, 0.0, 2.5991, 2.2998, 0.0, 2.60087, 1.235652, -0.139234, 2.60087, 1.235652, 0.139234, 2.6088, 1.2228, 0.0, 2.6088, 1.2228, 0.0, 2.612406, 2.298813, 0.0706, 2.612406, 2.298813, -0.0706, 2.613818, 2.163312, -0.184363, 2.613818, 2.163312, 0.184363, 2.6227, 1.5207, -0.28665, 2.6227, 1.5207, 0.28665, 2.639686, 1.760016, -0.28391, 2.639686, 1.760016, 0.28391, 2.648521, 2.296134, 0.12551, 2.648521, 2.296134, -0.12551, 2.6499, 1.972725, 0.25392, 2.6499, 1.972725, -0.25392, 2.6563, 1.4808, -0.2184, 2.6563, 1.4808, 0.2184, 2.667347, 2.150664, -0.210701, 2.667347, 2.150664, 0.210701, 2.6791, 1.453725, 0.12285, 2.6791, 1.453725, -0.12285, 2.682771, 1.724928, 0.248422, 2.682771, 1.724928, -0.248422, 2.6875, 1.44375, 0.0, 2.6875, 1.44375, 0.0, 2.7, 2.4, 0.0, 2.7, 2.4, 0.0, 2.7, 2.4, 0.0, 2.700871, 1.94775, -0.243763, 2.700871, 1.94775, 0.243763, 2.701743, 2.292186, 0.164732, 2.701743, 2.292186, -0.164732, 2.7168, 2.4, 0.0675, 2.7168, 2.4, -0.0675, 2.7168, 2.4, -0.0675, 2.7168, 2.4, 0.0675, 2.718253, 1.696032, 0.189274, 2.718253, 1.696032, -0.189274, 2.7256, 2.1369, -0.21948, 2.7256, 2.1369, 0.21948, 2.7298, 2.42025, 0.0, 2.74233, 1.676424, 0.106466, 2.74233, 1.676424, -0.106466, 2.747407, 2.420406, -0.066744, 2.747407, 2.420406, 0.066744, 2.74771, 1.9248, -0.213293, 2.74771, 1.9248, 0.213293, 2.7512, 1.6692, 0.0, 2.7512, 1.6692, 0.0, 2.7584, 2.436, 0.0, 2.7624, 2.4, 0.12, 2.7624, 2.4, -0.12, 2.7624, 2.4, -0.12, 2.7624, 2.4, 0.12, 2.76637, 2.287392, 0.188266, 2.76637, 2.287392, -0.188266, 2.776365, 2.436302, -0.064692, 2.776365, 2.436302, 0.064692, 2.783853, 2.123136, -0.210701, 2.783853, 2.123136, 0.210701, 2.7846, 2.44725, 0.0, 2.7846, 2.44725, 0.0, 2.786282, 1.9059, 0.162509, 2.786282, 1.9059, -0.162509, 2.795198, 2.420829, -0.118656, 2.795198, 2.420829, 0.118656, 2.8, 2.4, 0.0, 2.802528, 2.44768, -0.061668, 2.802528, 2.44768, 0.061668, 2.8072, 2.454, 0.0, 2.8112, 2.4, -0.0405, 2.8112, 2.4, 0.0405, 2.812457, 1.893075, 0.091411, 2.812457, 1.893075, -0.091411, 2.8221, 1.88835, 0.0, 2.8221, 1.88835, 0.0, 2.8242, 2.42025, 0.0, 2.8242, 2.42025, 0.0, 2.82475, 2.454529, -0.057996, 2.82475, 2.454529, 0.057996, 2.825, 2.45625, 0.0, 2.825, 2.45625, 0.0, 2.825126, 2.437123, -0.115008, 2.825126, 2.437123, 0.115008, 2.8296, 2.4, 0.1575, 2.8296, 2.4, -0.1575, 2.8296, 2.4, -0.1575, 2.8296, 2.4, 0.1575, 2.836672, 2.420519, -0.041256, 2.836672, 2.420519, 0.041256, 2.8367, 2.282175, 0.19611, 2.8367, 2.282175, -0.19611, 2.8368, 2.454, 0.0, 2.8368, 2.454, 0.0, 2.837382, 2.110488, -0.184363, 2.837382, 2.110488, 0.184363, 2.8376, 2.436, 0.0, 2.8376, 2.436, 0.0, 2.8414, 2.44725, 0.0, 2.8414, 2.44725, 0.0, 2.8416, 2.4, -0.072, 2.8416, 2.4, 0.072, 2.841887, 2.456841, -0.054, 2.841887, 2.456841, 0.054, 2.851189, 2.448847, -0.109632, 2.851189, 2.448847, 0.109632, 2.851331, 2.436454, -0.043308, 2.851331, 2.436454, 0.043308, 2.852794, 2.454605, -0.050004, 2.852794, 2.454605, 0.050004, 2.856323, 2.447812, -0.046332, 2.856323, 2.447812, 0.046332, 2.865626, 2.421453, -0.155736, 2.865626, 2.421453, 0.155736, 2.870524, 2.42125, -0.073344, 2.870524, 2.42125, 0.073344, 2.872387, 2.455966, -0.103104, 2.872387, 2.455966, 0.103104, 2.881466, 2.100072, -0.140467, 2.881466, 2.100072, 0.140467, 2.8864, 2.4, -0.0945, 2.8864, 2.4, 0.0945, 2.887725, 2.458444, -0.096, 2.887725, 2.458444, 0.096, 2.888602, 2.437685, -0.076992, 2.888602, 2.437685, 0.076992, 2.896205, 2.456246, 0.088896, 2.896205, 2.456246, -0.088896, 2.896829, 2.449338, -0.082368, 2.896829, 2.449338, 0.082368, 2.896986, 2.438333, -0.150948, 2.896986, 2.438333, 0.150948, 2.90703, 2.276958, 0.188266, 2.90703, 2.276958, -0.188266, 2.9112, 2.4, -0.18, 2.9112, 2.4, -0.18, 2.9112, 2.4, 0.18, 2.911379, 2.093004, -0.079013, 2.911379, 2.093004, 0.079013, 2.920412, 2.422328, -0.096264, 2.920412, 2.422328, 0.096264, 2.9224, 2.0904, 0.0, 2.922899, 2.450567, -0.143892, 2.922899, 2.450567, 0.143892, 2.9408, 2.4, -0.108, 2.9408, 2.4, 0.108, 2.942589, 2.458082, -0.135324, 2.942589, 2.458082, 0.135324, 2.943526, 2.439499, -0.101052, 2.943526, 2.439499, 0.101052, 2.951146, 2.42221, -0.177984, 2.951146, 2.42221, 0.177984, 2.955275, 2.460806, -0.126, 2.955275, 2.460806, 0.126, 2.956523, 2.451588, -0.108108, 2.956523, 2.451588, 0.108108, 2.960179, 2.458666, -0.116676, 2.960179, 2.458666, 0.116676, 2.971657, 2.272164, 0.164732, 2.971657, 2.272164, -0.164732, 2.98099, 2.423636, 0.110016, 2.98099, 2.423636, -0.110016, 2.984243, 2.439802, -0.172512, 2.984243, 2.439802, 0.172512, 3.0, 2.4, -0.1875, 3.0, 2.4, -0.1875, 3.0, 2.4, -0.1125, 3.0, 2.4, 0.1125, 3.0, 2.4, 0.1875, 3.009977, 2.452655, -0.164448, 3.009977, 2.452655, 0.164448, 3.010221, 2.441702, -0.115488, 3.010221, 2.441702, 0.115488, 3.024879, 2.268216, 0.12551, 3.024879, 2.268216, -0.12551, 3.027834, 2.460653, -0.154656, 3.027834, 2.460653, 0.154656, 3.029007, 2.454319, -0.123552, 3.029007, 2.454319, 0.123552, 3.0373, 2.463675, -0.144, 3.0373, 2.463675, 0.144, 3.037862, 2.461603, 0.133344, 3.037862, 2.461603, -0.133344, 3.044212, 2.423034, -0.1854, 3.044212, 2.423034, 0.1854, 3.046912, 2.425059, 0.1146, 3.046912, 2.425059, -0.1146, 3.0592, 2.4, -0.108, 3.0592, 2.4, 0.108, 3.060994, 2.265537, 0.0706, 3.060994, 2.265537, -0.0706, 3.0743, 2.26455, 0.0, 3.0743, 2.26455, 0.0, 3.0792, 2.4414, -0.1797, 3.0792, 2.4414, 0.1797, 3.0828, 2.4441, -0.1203, 3.0828, 2.4441, 0.1203, 3.0888, 2.4, -0.18, 3.0888, 2.4, -0.18, 3.0888, 2.4, 0.18, 3.104737, 2.454928, -0.1713, 3.104738, 2.454928, 0.1713, 3.107887, 2.457291, -0.1287, 3.107887, 2.457291, 0.1287, 3.112835, 2.426483, 0.110016, 3.112835, 2.426483, -0.110016, 3.1136, 2.4, -0.0945, 3.1136, 2.4, 0.0945, 3.1206, 2.46345, 0.1611, 3.1206, 2.46345, -0.1611, 3.1224, 2.4648, 0.1389, 3.1224, 2.4648, -0.1389, 3.126562, 2.466797, -0.15, 3.126562, 2.466797, 0.15, 3.137279, 2.423859, -0.177984, 3.137279, 2.423859, 0.177984, 3.155379, 2.446498, -0.115488, 3.155379, 2.446498, 0.115488, 3.1584, 2.4, -0.072, 3.1584, 2.4, 0.072, 3.1704, 2.4, -0.1575, 3.1704, 2.4, 0.1575, 3.1704, 2.4, -0.1575, 3.173413, 2.427791, -0.096264, 3.173413, 2.427791, 0.096264, 3.174157, 2.442998, -0.172512, 3.174157, 2.442998, 0.172512, 3.186768, 2.460263, -0.123552, 3.186768, 2.460263, 0.123552, 3.1888, 2.4, -0.0405, 3.1888, 2.4, 0.0405, 3.199498, 2.457201, -0.164448, 3.199498, 2.457201, 0.164448, 3.2, 2.4, 0.0, 3.206938, 2.467997, 0.133344, 3.206938, 2.467997, -0.133344, 3.213366, 2.466247, -0.154656, 3.213366, 2.466247, 0.154656, 3.215825, 2.469919, -0.144, 3.215825, 2.469919, 0.144, 3.222074, 2.448701, -0.101052, 3.222074, 2.448701, 0.101052, 3.222799, 2.424616, -0.155736, 3.222799, 2.424616, 0.155736, 3.223301, 2.428868, -0.073344, 3.223301, 2.428868, 0.073344, 3.2376, 2.4, -0.12, 3.2376, 2.4, 0.12, 3.2376, 2.4, -0.12, 3.257153, 2.429599, -0.041256, 3.257153, 2.429599, 0.041256, 3.259252, 2.462994, -0.108108, 3.259252, 2.462994, 0.108108, 3.261414, 2.444467, -0.150948, 3.261414, 2.444467, 0.150948, 3.269625, 2.429869, 0.0, 3.269625, 2.429869, 0.0, 3.276998, 2.450515, -0.076992, 3.276998, 2.450515, 0.076992, 3.2832, 2.4, -0.0675, 3.2832, 2.4, 0.0675, 3.2832, 2.4, -0.0675, 3.284621, 2.470934, -0.116676, 3.284621, 2.470934, 0.116676, 3.286576, 2.459289, -0.143892, 3.286576, 2.459289, 0.143892, 3.293227, 2.42524, -0.118656, 3.293227, 2.42524, 0.118656, 3.29785, 2.472787, -0.126, 3.29785, 2.472788, 0.126, 3.298611, 2.468818, -0.135324, 3.298611, 2.468818, 0.135324, 3.3, 2.4, 0.0, 3.3, 2.4, 0.0, 3.314269, 2.451746, -0.043308, 3.314269, 2.451746, 0.043308, 3.318946, 2.465243, -0.082368, 3.318946, 2.465243, 0.082368, 3.328, 2.4522, 0.0, 3.328, 2.4522, 0.0, 3.333274, 2.445677, -0.115008, 3.333274, 2.445677, 0.115008, 3.341018, 2.425663, -0.066744, 3.341018, 2.425663, 0.066744, 3.348595, 2.473354, 0.088896, 3.348595, 2.473354, -0.088896, 3.358286, 2.461009, -0.109632, 3.358286, 2.461009, 0.109632, 3.358625, 2.425819, 0.0, 3.359452, 2.466769, -0.046332, 3.359452, 2.466769, 0.046332, 3.3654, 2.47515, -0.096, 3.3654, 2.47515, 0.096, 3.368813, 2.470934, -0.103104, 3.368813, 2.470934, 0.103104, 3.374375, 2.467331, 0.0, 3.374375, 2.467331, 0.0, 3.382035, 2.446498, -0.064692, 3.382035, 2.446498, 0.064692, 3.392006, 2.474995, -0.050004, 3.392006, 2.474995, 0.050004, 3.4, 2.4468, 0.0, 3.406947, 2.462176, -0.061668, 3.406947, 2.462176, 0.061668, 3.408, 2.4756, 0.0, 3.408, 2.4756, 0.0, 3.411237, 2.476753, -0.054, 3.411237, 2.476753, 0.054, 3.41645, 2.472371, -0.057996, 3.41645, 2.472371, 0.057996, 3.424875, 2.462606, 0.0, 3.428125, 2.477344, 0.0, 3.428125, 2.477344, 0.0, 3.434, 2.4729, 0.0], 3]
    });
};
// Specifying colors in shade in an easier way
(function() {

var css_colors = {
    "aliceblue":	    "#F0F8FF",
    "antiquewhite":	    "#FAEBD7",
    "aqua":		    "#00FFFF",
    "aquamarine":	    "#7FFFD4",
    "azure":		    "#F0FFFF",
    "beige":		    "#F5F5DC",
    "bisque":		    "#FFE4C4",
    "black":		    "#000000",
    "blanchedalmond":       "#FFEBCD",
    "blue":		    "#0000FF",
    "blueviolet":	    "#8A2BE2",
    "brown":		    "#A52A2A",
    "burlywood":	    "#DEB887",
    "cadetblue":	    "#5F9EA0",
    "chartreuse":	    "#7FFF00",
    "chocolate":	    "#D2691E",
    "coral":		    "#FF7F50",
    "cornflowerblue":       "#6495ED",
    "cornsilk":             "#FFF8DC",
    "crimson":		    "#DC143C",
    "cyan":		    "#00FFFF",
    "darkblue":             "#00008B",
    "darkcyan":             "#008B8B",
    "darkgoldenrod":	    "#B8860B",
    "darkgray":             "#A9A9A9",
    "darkgrey":             "#A9A9A9",
    "darkgreen":	    "#006400",
    "darkkhaki":	    "#BDB76B",
    "darkmagenta":	    "#8B008B",
    "darkolivegreen":       "#556B2F",
    "darkorange":	    "#FF8C00",
    "darkorchid":	    "#9932CC",
    "darkred":		    "#8B0000",
    "darksalmon":	    "#E9967A",
    "darkseagreen":	    "#8FBC8F",
    "darkslateblue":	    "#483D8B",
    "darkslategray":	    "#2F4F4F",
    "darkslategrey":	    "#2F4F4F",
    "darkturquoise":	    "#00CED1",
    "darkviolet":	    "#9400D3",
    "deeppink":             "#FF1493",
    "deepskyblue":	    "#00BFFF",
    "dimgray":		    "#696969",
    "dimgrey":		    "#696969",
    "dodgerblue":	    "#1E90FF",
    "firebrick":	    "#B22222",
    "floralwhite":	    "#FFFAF0",
    "forestgreen":	    "#228B22",
    "fuchsia":		    "#FF00FF",
    "gainsboro":	    "#DCDCDC",
    "ghostwhite":	    "#F8F8FF",
    "gold":		    "#FFD700",
    "goldenrod":	    "#DAA520",
    "gray":		    "#808080",
    "grey":		    "#808080",
    "green":		    "#008000",
    "greenyellow":	    "#ADFF2F",
    "honeydew":             "#F0FFF0",
    "hotpink":		    "#FF69B4",
    "indianred":	    "#CD5C5C",
    "indigo":		    "#4B0082",
    "ivory":		    "#FFFFF0",
    "khaki":		    "#F0E68C",
    "lavender":             "#E6E6FA",
    "lavenderblush":	    "#FFF0F5",
    "lawngreen":	    "#7CFC00",
    "lemonchiffon":	    "#FFFACD",
    "lightblue":	    "#ADD8E6",
    "lightcoral":	    "#F08080",
    "lightcyan":	    "#E0FFFF",
    "lightgoldenrodyellow": "#FAFAD2",
    "lightgray":	    "#D3D3D3",
    "lightgrey":	    "#D3D3D3",
    "lightgreen":	    "#90EE90",
    "lightpink":	    "#FFB6C1",
    "lightsalmon":	    "#FFA07A",
    "lightseagreen":	    "#20B2AA",
    "lightskyblue":	    "#87CEFA",
    "lightslategray":       "#778899",
    "lightslategrey":       "#778899",
    "lightsteelblue":       "#B0C4DE",
    "lightyellow":	    "#FFFFE0",
    "lime":		    "#00FF00",
    "limegreen":	    "#32CD32",
    "linen":		    "#FAF0E6",
    "magenta":		    "#FF00FF",
    "maroon":		    "#800000",
    "mediumaquamarine":     "#66CDAA",
    "mediumblue":	    "#0000CD",
    "mediumorchid":	    "#BA55D3",
    "mediumpurple":	    "#9370D8",
    "mediumseagreen":       "#3CB371",
    "mediumslateblue":      "#7B68EE",
    "mediumspringgreen":    "#00FA9A",
    "mediumturquoise":      "#48D1CC",
    "mediumvioletred":      "#C71585",
    "midnightblue":	    "#191970",
    "mintcream":	    "#F5FFFA",
    "mistyrose":	    "#FFE4E1",
    "moccasin":             "#FFE4B5",
    "navajowhite":	    "#FFDEAD",
    "navy":		    "#000080",
    "oldlace":		    "#FDF5E6",
    "olive":		    "#808000",
    "olivedrab":	    "#6B8E23",
    "orange":		    "#FFA500",
    "orangered":	    "#FF4500",
    "orchid":		    "#DA70D6",
    "palegoldenrod":	    "#EEE8AA",
    "palegreen":	    "#98FB98",
    "paleturquoise":	    "#AFEEEE",
    "palevioletred":	    "#D87093",
    "papayawhip":	    "#FFEFD5",
    "peachpuff":	    "#FFDAB9",
    "peru":		    "#CD853F",
    "pink":		    "#FFC0CB",
    "plum":		    "#DDA0DD",
    "powderblue":	    "#B0E0E6",
    "purple":		    "#800080",
    "red":		    "#FF0000",
    "rosybrown":	    "#BC8F8F",
    "royalblue":	    "#4169E1",
    "saddlebrown":	    "#8B4513",
    "salmon":		    "#FA8072",
    "sandybrown":	    "#F4A460",
    "seagreen":             "#2E8B57",
    "seashell":             "#FFF5EE",
    "sienna":		    "#A0522D",
    "silver":		    "#C0C0C0",
    "skyblue":		    "#87CEEB",
    "slateblue":	    "#6A5ACD",
    "slategray":	    "#708090",
    "slategrey":	    "#708090",
    "snow":		    "#FFFAFA",
    "springgreen":	    "#00FF7F",
    "steelblue":	    "#4682B4",
    "tan":		    "#D2B48C",
    "teal":		    "#008080",
    "thistle":		    "#D8BFD8",
    "tomato":		    "#FF6347",
    "turquoise":	    "#40E0D0",
    "violet":		    "#EE82EE",
    "wheat":		    "#F5DEB3",
    "white":		    "#FFFFFF",
    "whitesmoke":	    "#F5F5F5",
    "yellow":		    "#FFFF00",
    "yellowgreen":	    "#9ACD32"
};

var rgb_re = / *rgb *\( *(\d+) *, *(\d+) *, *(\d+) *\) */;
Shade.color = function(spec, alpha)
{
    if (typeOf(alpha) === 'undefined')
        alpha = 1;
    if (spec[0] === '#') {
        if (spec.length === 4) {
            return Shade.vec(parseInt(spec[1], 16) / 15,
                             parseInt(spec[2], 16) / 15,
                             parseInt(spec[3], 16) / 15, alpha);
        } else if (spec.length == 7) {
            return Shade.vec(parseInt(spec.substr(1,2), 16) / 255,
                             parseInt(spec.substr(3,2), 16) / 255,
                             parseInt(spec.substr(5,2), 16) / 255, alpha);
        } else
            throw "hex specifier must be either #rgb or #rrggbb";
    }
    var m = rgb_re.exec(spec);
    if (m) {
        return Shade.vec(parseInt(m[1]) / 255,
                         parseInt(m[2]) / 255,
                         parseInt(m[3]) / 255, alpha);
    }
    if (spec in css_colors)
        return Shade.color(css_colors[spec], alpha);
    throw "Unrecognized color specifier " + spec;
};
}());

Shade.Colors = {};

Shade.Colors.alpha = function(color, alpha)
{
    color = Shade.make(color);
    alpha = Shade.make(alpha);
    if (!alpha.type.equals(Shade.Types.float_t))
        throw "Shade.Colors.alpha type error: alpha parameter must be float";
    if (color.type.equals(Shade.Types.vec4)) {
        return Shade.vec(color.swizzle("rgb"), alpha);
    }
    if (color.type.equals(Shade.Types.vec3)) {
        return Shade.vec(color, alpha);
    }
    throw "Shade.Colors.alpha type error: color parameter must be vec3 or vec4";
};

Shade.Exp.alpha = function(alpha)
{
    return Shade.Colors.alpha(this, alpha);
};


