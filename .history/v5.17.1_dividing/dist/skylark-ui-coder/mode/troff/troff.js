/**
 * skylark-ui-coder - The skylark coder widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylarkui/skylark-ui-coder/
 * @license MIT
 */
!function(t){"object"==typeof exports&&"object"==typeof module?t(require("../../Coder")):"function"==typeof define&&define.amd?define(["../../Coder"],t):t(CodeMirror)}(function(t){"use strict";t.defineMode("troff",function(){function t(t){if(t.eatSpace())return null;var e=t.sol(),n=t.next();if("\\"===n)return t.match("fB")||t.match("fR")||t.match("fI")||t.match("u")||t.match("d")||t.match("%")||t.match("&")?"string":t.match("m[")?(t.skipTo("]"),t.next(),"string"):t.match("s+")||t.match("s-")?(t.eatWhile(/[\d-]/),"string"):t.match("(")||t.match("*(")?(t.eatWhile(/[\w-]/),"string"):"string";if(e&&("."===n||"'"===n)&&t.eat("\\")&&t.eat('"'))return t.skipToEnd(),"comment";if(e&&"."===n){if(t.match("B ")||t.match("I ")||t.match("R "))return"attribute";if(t.match("TH ")||t.match("SH ")||t.match("SS ")||t.match("HP "))return t.skipToEnd(),"quote";if(t.match(/[A-Z]/)&&t.match(/[A-Z]/)||t.match(/[a-z]/)&&t.match(/[a-z]/))return"attribute"}t.eatWhile(/[\w-]/);var a=t.current();return r.hasOwnProperty(a)?r[a]:null}function e(e,r){return(r.tokens[0]||t)(e,r)}var r={};return{startState:function(){return{tokens:[]}},token:function(t,r){return e(t,r)}}}),t.defineMIME("text/troff","troff"),t.defineMIME("text/x-troff","troff"),t.defineMIME("application/x-troff","troff")});
//# sourceMappingURL=../../sourcemaps/mode/troff/troff.js.map
