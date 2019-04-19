/**
 * skylark-codemirror5 - A version of codemirror 5.17.1  that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-codemirror5/
 * @license MIT
 */
!function(n){"object"==typeof exports&&"object"==typeof module?n(require("../../lib/codemirror")):"function"==typeof define&&define.amd?define(["../../lib/codemirror"],n):n(CodeMirror)}(function(n){"use strict";n.defineMode("cmake",function(){var n=/({)?[a-zA-Z0-9_]+(})?/;function e(n,e){for(var t,i,r=!1;!n.eol()&&(t=n.next())!=e.pending;){if("$"===t&&"\\"!=i&&'"'==e.pending){r=!0;break}i=t}return r&&n.backUp(1),t==e.pending?e.continueString=!1:e.continueString=!0,"string"}return{startState:function(){var n={inDefinition:!1,inInclude:!1,continueString:!1,pending:!1};return n},token:function(t,i){return t.eatSpace()?null:function(t,i){var r=t.next();return"$"===r?t.match(n)?"variable-2":"variable":i.continueString?(t.backUp(1),e(t,i)):t.match(/(\s+)?\w+\(/)||t.match(/(\s+)?\w+\ \(/)?(t.backUp(1),"def"):"#"==r?(t.skipToEnd(),"comment"):"'"==r||'"'==r?(i.pending=r,e(t,i)):"("==r||")"==r?"bracket":r.match(/[0-9]/)?"number":(t.eatWhile(/[\w-]/),null)}(t,i)}}}),n.defineMIME("text/x-cmake","cmake")});
//# sourceMappingURL=../../sourcemaps/mode/cmake/cmake.js.map
