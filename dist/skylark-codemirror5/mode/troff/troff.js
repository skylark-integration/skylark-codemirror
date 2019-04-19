/**
 * skylark-codemirror5 - A version of codemirror 5.17.1  that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-codemirror5/
 * @license MIT
 */
!function(t){"object"==typeof exports&&"object"==typeof module?t(require("../../lib/codemirror")):"function"==typeof define&&define.amd?define(["../../lib/codemirror"],t):t(CodeMirror)}(function(t){"use strict";t.defineMode("troff",function(){var t={};function e(e,r){return(r.tokens[0]||function(e){if(e.eatSpace())return null;var r=e.sol(),n=e.next();if("\\"===n)return e.match("fB")||e.match("fR")||e.match("fI")||e.match("u")||e.match("d")||e.match("%")||e.match("&")?"string":e.match("m[")?(e.skipTo("]"),e.next(),"string"):e.match("s+")||e.match("s-")?(e.eatWhile(/[\d-]/),"string"):e.match("(")||e.match("*(")?(e.eatWhile(/[\w-]/),"string"):"string";if(r&&("."===n||"'"===n)&&e.eat("\\")&&e.eat('"'))return e.skipToEnd(),"comment";if(r&&"."===n){if(e.match("B ")||e.match("I ")||e.match("R "))return"attribute";if(e.match("TH ")||e.match("SH ")||e.match("SS ")||e.match("HP "))return e.skipToEnd(),"quote";if(e.match(/[A-Z]/)&&e.match(/[A-Z]/)||e.match(/[a-z]/)&&e.match(/[a-z]/))return"attribute"}e.eatWhile(/[\w-]/);var i=e.current();return t.hasOwnProperty(i)?t[i]:null})(e,r)}return{startState:function(){return{tokens:[]}},token:function(t,r){return e(t,r)}}}),t.defineMIME("text/troff","troff"),t.defineMIME("text/x-troff","troff"),t.defineMIME("application/x-troff","troff")});
//# sourceMappingURL=../../sourcemaps/mode/troff/troff.js.map
