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

Facet._globals = {
    ctx: undefined, // stores the active webgl context
    display_callback: undefined
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
    t = obj._type;
    if (!t)                      return "other";
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
            } else if (t === "number" || t == "vector") {
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
            }
            uniform._facet_active_uniform(value);
        });
    }

    batch.draw_chunk();
};

var largest_batch_id = 1;

// FIXME: push the primitives weirdness fix down the API
Facet.bake = function(model, appearance)
{
    var ctx = Facet._globals.ctx;
    var draw_program_exp = {};
    _.each(appearance, function(value, key) {
        if (Shade.is_program_parameter(key)) {
            draw_program_exp[key] = value;
        }
    });
    var draw_program = Shade.program(draw_program_exp);
    var draw_attribute_arrays = _.build(_.map(
        draw_program.attribute_buffers, function(v) { return [v._shade_name, v]; }
    ));

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

    var draw_batch_id = largest_batch_id++;

    var draw_opts = {
        program: draw_program,
        attributes: draw_attribute_arrays,
        set_caps: ((appearance.mode && appearance.mode.set_draw_caps) || 
                   Facet.DrawingMode.standard.set_draw_caps),
        draw_chunk: draw_chunk,
        batch_id: draw_batch_id
    };

    // if no picking is defined, pick to -1, so we at least occlude
    // what was in the background.
    var pick_id = Shade.make(appearance.pick_id || Shade.id(-1));

    var pick_program_exp = {};
    _.each(appearance, function(value, key) {
        if (Shade.is_program_parameter(key)) {
            if (key === 'color' || key === 'gl_FragColor') {
                var pick_if = (appearance.pick_if ||
                               Shade.make(value).swizzle("a").gt(0));
                pick_program_exp[key] = pick_id
                    .discard_if(Shade.logical_not(pick_if));
            } else {
                pick_program_exp[key] = value;
            }
        }
    });
    var pick_program = Shade.program(pick_program_exp);
    var pick_attribute_arrays = _.build(_.map(
        pick_program.attribute_buffers, function(v) { return [v._shade_name, v]; }
    ));
        
    var pick_batch_id = largest_batch_id++;
    var pick_opts = {
        program: pick_program,
        attributes: pick_attribute_arrays,
        set_caps: ((appearance.mode && appearance.mode.set_pick_caps) || 
                   Facet.DrawingMode.standard.set_pick_caps),
        draw_chunk: draw_chunk,
        batch_id: pick_batch_id
    };

    var which_opts = [ draw_opts, pick_opts ];

    var result = {
        draw: function() {
            draw_it(which_opts[Facet.Picker.picking_mode]);
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
Facet.id_buffer = function(vertex_array)
{
    if (typeOf(vertex_array) !== 'array')
        throw "id_buffer expects array of integers";
    var typedArray = new Int32Array(vertex_array);
    var byteArray = new Uint8Array(typedArray.buffer);
    return Facet.attribute_buffer(byteArray, 4, 'ubyte', true);
};
Facet.initGL = function(canvas, opts)
{
    canvas.unselectable = true;
    canvas.onselectstart = function() { return false; };
    var gl;
    var clearColor, clearDepth;
    opts = _.defaults(opts, { clearColor: [1,1,1,0],
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
        if (!opts.clearDepth.type.equals(Shade.Types.float))
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
        if (opts.debugging) {
            function throwOnGLError(err, funcName, args) {
                throw WebGLDebugUtils.glEnumToString(err) + 
                    " was caused by call to " + funcName;
            }
            gl = WebGLDebugUtils.makeDebugContext(gl, throwOnGLError);
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
    } catch(e) {
        alert(e);
    }
    if (!gl) {
        alert("Could not initialise WebGL, sorry :-(");
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
    picking_mode: 0,
    draw_pick_scene: function(callback) {
        var ctx = Facet._globals.ctx;
        if (!rb) {
            rb = Facet.render_buffer({
                width: ctx.viewportWidth,
                height: ctx.viewportHeight,
                TEXTURE_MAG_FILTER: ctx.NEAREST,
                TEXTURE_MIN_FILTER: ctx.NEAREST
            });
        }

        callback = callback || Facet._globals.display_callback;
        this.picking_mode = 1;
        try {
            rb.render_to_buffer(function() {
                ctx.clearColor(0,0,0,0);
                ctx.clear(ctx.COLOR_BUFFER_BIT | ctx.DEPTH_BUFFER_BIT);
                callback();
            });
        } finally {
            this.picking_mode = 0;
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

    var rttTexture = ctx.createTexture();
    rttTexture._shade_type = 'texture';
    ctx.bindTexture(ctx.TEXTURE_2D, rttTexture);
    ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MAG_FILTER, opts.TEXTURE_MAG_FILTER || ctx.LINEAR);
    ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MIN_FILTER, opts.TEXTURE_MIN_FILTER || ctx.LINEAR);
    ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_S, opts.TEXTURE_WRAP_S || ctx.CLAMP_TO_EDGE);
    ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_T, opts.TEXTURE_WRAP_T || ctx.CLAMP_TO_EDGE);
    ctx.texImage2D(ctx.TEXTURE_2D, 0, ctx.RGBA, rttFramebuffer.width, rttFramebuffer.height, 0, ctx.RGBA, ctx.UNSIGNED_BYTE, null);

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
    var onload = opts.onload || function() {};
    var mipmaps = opts.mipmaps || false;
    var width = opts.width;
    var height = opts.height;

    function handler(texture) {
        ctx.bindTexture(ctx.TEXTURE_2D, texture);
        ctx.pixelStorei(ctx.UNPACK_FLIP_Y_WEBGL, true);
        if (texture.image) {
            ctx.texImage2D(ctx.TEXTURE_2D, 0, ctx.RGBA, ctx.RGBA, 
                           ctx.UNSIGNED_BYTE, texture.image);
        } else {
            ctx.texImage2D(ctx.TEXTURE_2D, 0, ctx.RGBA, 
                           texture.width, texture.height,
                           0, ctx.RGBA, ctx.UNSIGNED_BYTE, texture.buffer);
        }
        ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MAG_FILTER, opts.TEXTURE_MAG_FILTER || ctx.LINEAR);
        ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MIN_FILTER, opts.TEXTURE_MIN_FILTER || ctx.LINEAR);
        ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_S, opts.TEXTURE_WRAP_S || ctx.CLAMP_TO_EDGE);
        ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_T, opts.TEXTURE_WRAP_T || ctx.CLAMP_TO_EDGE);
        if (mipmaps)
            ctx.generateMipmap(ctx.TEXTURE_2D);
        ctx.bindTexture(ctx.TEXTURE_2D, null);
        onload(texture);
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
        if (typeOf(this[field_name]) === "undefined") {
            this[field_name] = {};
        }
        if (typeOf(this[field_name][arguments[0]]) === "undefined") {
            this[field_name][arguments[0]] = fun.apply(this, arguments);
        }
        return this[field_name][arguments[0]];
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
})();
//////////////////////////////////////////////////////////////////////////////
// make converts objects which can be meaningfully interpreted as
// Exp values to the appropriate Exp values, giving us some poor-man
// static polymorphism
Shade.make = function(exp)
{
    var t = typeOf(exp);
    if (t === 'boolean' ||
        t === 'number') {
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
Shade.constant = function(v)
{
    var constant_tuple_fun = function(type, args)
    {
        function to_glsl(type, args) {
            return type + '(' + _.toArray(args).join(', ') + ')';
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
    if (t === 'number')
        return constant_tuple_fun(Shade.basic('float'), [v]);
    if (t === 'boolean')
        return constant_tuple_fun(Shade.basic('bool'), [v]);
    if (t === 'vector') {
        var d = v.length;
        if (d < 2 && d > 4)
            throw "Invalid length for constant vector: " + v;

        var el_ts = _.map(v, function(t) { return typeOf(t); });
        if (!_.all(el_ts, function(t) { return t === el_ts[0]; })) {
            throw "Not all constant params have the same types;";
        }
        if (el_ts[0] === "number")
            return constant_tuple_fun(Shade.basic('vec' + d), v);
        else
            throw "bad datatype for constant: " + el_ts[0];
    }
    if (t === 'boolean_vector') {
        // FIXME bvecs
        var d = v.length;
        return constant_tuple_fun(Shade.basic('bvec' + d), v);
    }
    if (t === 'matrix') {
        var d = Math.sqrt(v.length); // FIXME UGLY
        return constant_tuple_fun(Shade.basic('mat' + d), v);
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
    var value = v;
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
    return result;
};
Shade.sampler2D_from_texture = function(texture)
{
    return texture._shade_expression || function() {
        var result = Shade.uniform("sampler2D");
        result.set(texture);
        texture._shade_expression = result;
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
            [Shade.Types.float_t, Shade.Types.mat2, Shade.Types.mat2]
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
            [Shade.Types.float_t, Shade.Types.mat2, Shade.Types.mat2]
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
            [Shade.Types.float_t, Shade.Types.mat2, Shade.Types.mat2]
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
            throw "Could not find appropriate type signature";
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

function mod_min_max_constant_evaluator(op) {
    return function(exp) {
        var values = _.map(exp.parents, function (p) {
            return p.constant_value();
        });
        if (exp.parents[0].type.equals(Shade.Types.float_t))
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

Shade.Optimizer.transform_expression = function(operations)
{
    return function(v) {
        for (var i=0; i<operations.length; ++i) {
            var test = operations[i][0];
            var fun = operations[i][1];
            if (operations[i][2]) {
                var old_guid;
                do {
                    old_guid = v.guid;
                    v = v.replace_if(test, fun);
                } while (v.guid !== old_guid);
            } else
                v = v.replace_if(test, fun);
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
    var result = Shade.constant(v);
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

Shade.program = function(program_obj)
{
    var vp_obj = {}, fp_obj = {};

    // We provide saner names for program targets so users don't
    // need to memorize gl_FragColor, gl_Position and gl_PointSize.
    //
    // However, these names should still work, in case the users
    // want to have GLSL-familiar names.
    _.each(program_obj, function(v, k) {
        if (k === 'color' || k === 'gl_FragColor') {
            fp_obj['gl_FragColor'] = Shade.make(v);
        } else if (k === 'position') {
            vp_obj['gl_Position'] = Shade.make(v);
        } else if (k === 'point_size') {
            vp_obj['gl_PointSize'] = Shade.make(v);
        } else
            vp_obj[k] = Shade.make(v);
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
    var fp_optimize = Shade.Optimizer.transform_expression([
        [is_per_vertex, hoist_to_varying],
        [is_attribute, hoist_to_varying],
        [Shade.Optimizer.is_times_zero, Shade.Optimizer.replace_with_zero, 
         true],
        [Shade.Optimizer.is_times_one, Shade.Optimizer.replace_with_notone, 
         true],
        [Shade.Optimizer.is_plus_zero, Shade.Optimizer.replace_with_nonzero,
         true],
        [Shade.Optimizer.vec_at_constant_index, 
         Shade.Optimizer.replace_vec_at_constant_with_swizzle, false],
        [Shade.Optimizer.is_constant,
         Shade.Optimizer.replace_with_constant]
    ]);

    var vp_optimize = Shade.Optimizer.transform_expression([
        [Shade.Optimizer.is_times_zero, Shade.Optimizer.replace_with_zero, 
         true],
        [Shade.Optimizer.is_times_one, Shade.Optimizer.replace_with_notone, 
         true],
        [Shade.Optimizer.is_plus_zero, Shade.Optimizer.replace_with_nonzero,
         true],
        [Shade.Optimizer.vec_at_constant_index, 
         Shade.Optimizer.replace_vec_at_constant_with_swizzle, false],
        [Shade.Optimizer.is_constant,
         Shade.Optimizer.replace_with_constant]
    ]);

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
        console.log("Vertex program final AST:");
        vp_exp.debug_print();
        console.log("Vertex program source:");
        console.log(vp_source);
        console.log("Fragment program final AST:");
        fp_exp.debug_print();
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
        if (arguments.length === 0) return Shade.constant(false);
        if (arguments.length === 1) return Shade.make(arguments[1]).as_bool();
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

Shade.logical_or = logical_operator_exp(
    "||", lift_binfun_to_evaluator(function(a, b) { return a || b; }),
    function(i) { return i == 0; }
);

Shade.Exp.logical_or = function(other)
{
    return Shade.logical_or(this, other);
};

Shade.logical_and = logical_operator_exp(
    "&&", lift_binfun_to_evaluator(function(a, b) { return a && b; }),
    function(i) { return i == 0; }
);

Shade.Exp.logical_and = function(other)
{
    return Shade.logical_and(this, other);
};

Shade.logical_xor = logical_operator_exp(
    "^^", lift_binfun_to_evaluator(function(a, b) { return ~~(a ^ b); }));
Shade.Exp.logical_xor = function(other)
{
    return Shade.logical_xor(this, other);
};

Shade.logical_not = function(exp)
{
    exp = Shade.make(exp);
    if (!exp.type.equals(Shade.Types.bool_t)) {
        throw "Logical_not requires bool expression";
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

Shade.Exp.logical_not = function() { return Shade.logical_not(this); };

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
Shade.discard_if = function(exp, condition)
{
    exp = Shade.make(exp);
    condition = Shade.make(condition);

    var result = Shade._create_concrete_exp({
        is_constant: Shade.memoize_on_field("_is_constant", function() {
            var cond = _.all(this.parents, function(v) {
                return v.is_constant();
            });
            return (cond && !this.parents[1].constant_value());
        }),
        _must_be_function_call: true,
        type: exp.type,
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
// as the name implies, this is most useful for picking.
Shade.id = function(id_value)
{
    var r = id_value & 255;
    var g = (id_value >> 8) & 255;
    var b = (id_value >> 16) & 255;
    var a = (id_value >> 24) & 255;
    
    return Shade.vec(r / 255, g / 255, b / 255, a / 255);
};

return Shade;
}());
Facet.Marks = {};
// FIXME: alpha=0 points should discard because of depth buffer
Facet.Marks.dots = function(opts)
{
    opts = _.defaults(opts, {
        x_scale: function (x) { return x; },
        y_scale: function (x) { return x; },
        xy_scale: function (x) { return x; },
        fill_color: Shade.vec(0,0,0,1),
        stroke_color: Shade.vec(0,0,0,1),
        point_diameter: 5,
        stroke_width: 2,
        mode: Facet.DrawingMode.over,
        alpha: true,
        plain: false
    });

    function to_opengl(x) { return x.mul(2).sub(1); };
    var S = Shade;

    var fill_color     = Shade.make(opts.fill_color);
    var stroke_color   = Shade.make(opts.stroke_color);
    var point_diameter = Shade.make(opts.point_diameter);
    var stroke_width   = Shade.make(opts.stroke_width).add(1);
    var use_alpha      = Shade.make(opts.alpha);
    
    var x_scale = opts.x_scale;
    var y_scale = opts.y_scale;
    
    var model_opts = {
        type: "points"
    };

    if (opts.x) {
        model_opts.vertex = S.vec(to_opengl(opts.x_scale(opts.x)), 
                                  to_opengl(opts.y_scale(opts.y)));
    } else if (opts.xy) {
        model_opts.vertex = opts.xy_scale(opts.xy).mul(2).sub(S.vec(1,1));
    };

    if (opts.model) {
        model_opts.elements = opts.model.elements;
    } else if (opts.elements) {
        model_opts.elements = opts.elements;
    }
    var model = Facet.model(model_opts);

    var distance_to_center_in_pixels = S.pointCoord().sub(S.vec(0.5, 0.5))
        .length().mul(point_diameter);
    var point_radius = point_diameter.div(2);
    var distance_to_border = point_radius.sub(distance_to_center_in_pixels);
    var gl_Position = S.vec(model.vertex, 0, 1);

    var no_alpha = S.mix(fill_color, stroke_color,
                         S.clamp(stroke_width.sub(distance_to_border), 0, 1));
    
    if (opts.plain) {
        var result = Facet.bake(model, {
            position: gl_Position,
            point_size: point_diameter,
            color: fill_color,
            mode: opts.mode
        });
        result.gl_Position = gl_Position;
        return result;
    } else {
        var result = Facet.bake(model, {
            position: gl_Position,
            point_size: point_diameter,
            color: S.selection(use_alpha,
                               no_alpha.mul(S.vec(1,1,1,S.clamp(distance_to_border, 0, 1))),
                               no_alpha)
                .discard_if(distance_to_center_in_pixels.gt(point_radius)),
            mode: opts.mode
        });
        result.gl_Position = gl_Position;
        return result;
    }
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

    var texture = Facet.texture_from_image({
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
var Models = {
    mesh: function(u_secs, v_secs) {
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
    },
    sphere: function(lat_secs, long_secs) {
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

    square: function() {
        var uv = Shade.make(Facet.attribute_buffer([0, 0, 1, 0, 0, 1, 1, 1], 2));
        return Facet.model({
            type: "triangles",
            elements: Facet.element_buffer([0, 1, 2, 1, 3, 2]),
            vertex: uv,
            tex_coord: uv
        });
    },

    flat_cube: function() {
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
    }
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

var single_hex_to_float = {};
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
    if (spec in css_colors)
        return Shade.color(css_colors[spec], alpha);
    throw "Unrecognized color specifier " + spec;
};
}());
