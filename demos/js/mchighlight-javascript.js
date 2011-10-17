/* 
   McHighlight-JavaScript: A syntax-highlighter for JavaScript.
 
   Author: Matthew Might
   Site:   http://matt.might.net/
           http://www.ucombinator.org/  

   This highlighter makes a "best-effort" attempt at handling JavaScript.

   If you sharpen the specification or clean it up, please send me the update.
 */


/* Lexical analysis states. */
var JAVASCRIPT         = new McLexer.State() ;
var JAVASCRIPT_1STRING = new McLexer.State() ;
var JAVASCRIPT_2STRING = new McLexer.State() ;
var JAVASCRIPT_COMMENT = new McLexer.State() ;

var JSHighlighter = new McHighlighter(JAVASCRIPT) ;


/* Standard JavaScript lexemes. */
JAVASCRIPT (/function|return|var|if|for|in|while|do|break/)   (JSHighlighter.classify("jskeyword")) ;
JAVASCRIPT (/continue|switch|case|true|false|null|prototype/) (JSHighlighter.classify("jskeyword")) ;
JAVASCRIPT (/Facet|Shade/)                                     (JSHighlighter.classify("jskeyword"));

JAVASCRIPT (/[-=<>&|?{}()\[\]:;,.+*\/!%]/) (JSHighlighter.rewriteAndClassify(McEscapeHTML,'jspunctuation')) ;

JAVASCRIPT (/\'/)               (JSHighlighter.classify("jsstring",McCONTINUE(JAVASCRIPT_1STRING))) ;
JAVASCRIPT (/\"/)               (JSHighlighter.classify("jsstring",McCONTINUE(JAVASCRIPT_2STRING))) ;

JAVASCRIPT (/\/[*]/)            (JSHighlighter.rewriteAndClassify(JSHighlighter.whitespaceHardener,"jscomment",McCONTINUE(JAVASCRIPT_COMMENT))) ;
JAVASCRIPT (/\/\/[^\r\n]*/)     (JSHighlighter.classify("jscomment")) ;

JAVASCRIPT (/[\n\r \t]+/)       (JSHighlighter.eta('hardenWhitespace')) ;
JAVASCRIPT (/\d+([.]\d+)?/)     (JSHighlighter.classify("jsnumber")) ;
JAVASCRIPT (/(\w|\d|_|\$)+/)    (JSHighlighter.classify("jsidentifier")) ;

JAVASCRIPT (/\/[*]([^*]|[*][^\/])*[*]\//)  (JSHighlighter.rewriteAndClassify(JSHighlighter.escapeAndHarden,"jscomment")) ;
JAVASCRIPT (/\/(\\\/|[^\/\n])*\/[gim]*/)   (JSHighlighter.classify("jsregexp")) ;

JAVASCRIPT (/$/) (JSHighlighter.stop) ;


/* Comments. */
JAVASCRIPT_COMMENT (/\s+/)   (JSHighlighter.eta('hardenWhitespace')) ;
JAVASCRIPT_COMMENT (/[*]\//) (JSHighlighter.classify("jscomment",McCONTINUE(JAVASCRIPT))) ;
JAVASCRIPT_COMMENT (/./)     (JSHighlighter.classify("jscomment")) ;


/* Single-quoted strings. */
JAVASCRIPT_1STRING (/\\\'/)  (JSHighlighter.classify("jsstring")) ;
JAVASCRIPT_1STRING (/\'/)    (JSHighlighter.classify("jsstring",McCONTINUE(JAVASCRIPT))) ;
JAVASCRIPT_1STRING (/.|\s/)  (JSHighlighter.classify("jsstring")) ;


/* Doubly-quoted strings. */
JAVASCRIPT_2STRING (/\\\"/)  (JSHighlighter.classify("jsstring")) ;
JAVASCRIPT_2STRING (/\"/)    (JSHighlighter.classify("jsstring",McCONTINUE(JAVASCRIPT))) ;
JAVASCRIPT_2STRING (/.|\s/)  (JSHighlighter.classify("jsstring")) ;


var JavaScriptHighlighter = JSHighlighter ;
var Highlighter = JSHighlighter ;
