/* 
   McHighlight: A convenience layer atop McLexer for building syntax highlighters. 
 
   Author: Matthew Might
   Site:   http://matt.might.net/
           http://www.ucombinator.org/  

 */

/*
  To create a new highlighter, use new McHighlighter(initialLexicalState).

  initialLexicalState.lex should invoke the convenience methods provide by McHighlighter.

  For instance, classify(className) creates an action that wraps the matched text
  in a span tag with class className.

  The convenience methods will call the append method to handle new HTML.
 */

function McHighlighter(initialState) { 
  this.initialState = initialState ;
}

function McEscapeHTML(text) {
  var s = text ;
  s = s.replace(/&/g,"&amp;") ;
  // s = s.replace(/</g,"&lt;") ;  
  // s = s.replace(/>/g,"&gt;") ;
  return s ;
}


McHighlighter.prototype.stop = function (match,rest,state) {
  return null ;
} ;

McHighlighter.prototype.tabSpaces = 3 ;

McHighlighter.prototype.tabSpace = function () {
  var tabSpace = "" ;
  for (var i = 0; i < this.tabSpaces; ++i)
    tabSpace += "&nbsp;" ; 
  return tabSpace ;
} ;

McHighlighter.prototype.hardenWhitespace = function (match,rest,state) {
  this.append(this.whitespaceHardener(match[0])) ;
  return state.continuation(rest) ;
} ;

McHighlighter.prototype.whitespaceHardener = function (s) {
  s = s.replace(/ /g,"&nbsp;");
  s = s.replace(/\n/g,"<br />");
  s = s.replace(/\t/g,this.tabSpace()) ;
  return s ;
} ;

McHighlighter.prototype.escapeAndHarden = function (s) {
  s = McEscapeHTML(s) ;
  return this.whitespaceHardener(s) ;
} ;

McHighlighter.prototype.escapeHTML = function (match,rest,state) {
  this.append(McEscapeHTML(match[0])) ;
  return state.continuation(rest) ;
} ;

McHighlighter.prototype.style = function(style,cc) {
  var that = this ;
  return function (match,rest,state) {
    that.append('<span style="'+style+'">'+McEscapeHTML(match[0])+'</span>') ;
    return cc ? cc(rest) : state.continuation(rest) ;
  } ;
} ;

McHighlighter.prototype.classify = function(className,cc) {
  var that = this ;
  return function (match,rest,state) {
    that.append('<span class="'+className+'">'+McEscapeHTML(match[0])+'</span>') ;
    return cc ? cc(rest) : state.continuation(rest) ;
  } ;
} ;

McHighlighter.prototype.rewrite = function(f,cc) {
  var that = this ;
  return function (match,rest,state) {
    that.append(f.call(that,match[0])) ;
    return cc ? cc(rest) : state.continuation(rest) ;
  } ;
} ;

McHighlighter.prototype.rewriteAndClassify = function(f,className,cc) {
  var that = this ;
  return function (match,rest,state) {
    that.append('<span class="'+className+'">'+f.call(that,match[0])+'</span>') ;
    return cc ? cc(rest) : state.continuation(rest) ;
  } ;
} ;

McHighlighter.prototype.normal = function (match,rest,state) {
  this.append(McEscapeHTML(match[0])) ;
  return state.continuation(rest) ;
} ;

McHighlighter.prototype.eta = function (methodName) {
  var that = this ;
  return function () { 
    return (that[methodName]).apply(that,arguments) ;
  } ;
} ;


/* Highlights source code inside an element; if no input is supplied,
   it will use the contents of the element. */
McHighlighter.prototype.highlight = function (element,input) {
  var buffer = "" ;
  if (typeof element == "string") element = document.getElementById(element) ;
  if (!input) { 
    input = element.innerHTML ;
    var parts = input.match(/^\n*((.|\r|\n)*)\s*$/) ;
    input = parts[1] ;
  }
  this.append = function (html) {
    buffer += html ;
  } ;
  this.initialState.lex(input) ;
  element.innerHTML = buffer ;
} ;
