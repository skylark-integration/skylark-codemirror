/**
 * skylark-ui-coder - The skylark coder widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylarkui/skylark-ui-coder/
 * @license MIT
 */
!function(n){"object"==typeof exports&&"object"==typeof module?n(require("../../Coder")):"function"==typeof define&&define.amd?define(["../../Coder"],n):n(CodeMirror)}(function(n){"use strict";n.defineMode("cmake",function(){function n(n,e){for(var t,i,r=!1;!n.eol()&&(t=n.next())!=e.pending;){if("$"===t&&"\\"!=i&&'"'==e.pending){r=!0;break}i=t}return r&&n.backUp(1),t==e.pending?e.continueString=!1:e.continueString=!0,"string"}function e(e,i){var r=e.next();return"$"===r?e.match(t)?"variable-2":"variable":i.continueString?(e.backUp(1),n(e,i)):e.match(/(\s+)?\w+\(/)||e.match(/(\s+)?\w+\ \(/)?(e.backUp(1),"def"):"#"==r?(e.skipToEnd(),"comment"):"'"==r||'"'==r?(i.pending=r,n(e,i)):"("==r||")"==r?"bracket":r.match(/[0-9]/)?"number":(e.eatWhile(/[\w-]/),null)}var t=/({)?[a-zA-Z0-9_]+(})?/;return{startState:function(){var n={};return n.inDefinition=!1,n.inInclude=!1,n.continueString=!1,n.pending=!1,n},token:function(n,t){return n.eatSpace()?null:e(n,t)}}}),n.defineMIME("text/x-cmake","cmake")});
//# sourceMappingURL=../../sourcemaps/mode/cmake/cmake.js.map
