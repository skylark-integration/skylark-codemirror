/**
 * skylark-codemirror - A version of codemirror 5.45  that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-codemirror/
 * @license MIT
 */
!function(t){"object"==typeof exports&&"object"==typeof module?t(require("../../CodeMirror"),require("../yaml/yaml")):"function"==typeof define&&define.amd?define(["../../CodeMirror","../yaml/yaml"],t):t(CodeMirror)}(function(t){var e=2;t.defineMode("yaml-frontmatter",function(n,r){var a=t.getMode(n,"yaml"),i=t.getMode(n,r&&r.base||"gfm");function o(t){return t.state==e?i:a}return{startState:function(){return{state:0,inner:t.startState(a)}},copyState:function(e){return{state:e.state,inner:t.copyState(o(e),e.inner)}},token:function(n,r){if(0==r.state)return n.match(/---/,!1)?(r.state=1,a.token(n,r.inner)):(r.state=e,r.inner=t.startState(i),i.token(n,r.inner));if(1==r.state){var o=n.sol()&&n.match(/---/,!1),f=a.token(n,r.inner);return o&&(r.state=e,r.inner=t.startState(i)),f}return i.token(n,r.inner)},innerMode:function(t){return{mode:o(t),state:t.inner}},blankLine:function(t){var e=o(t);if(e.blankLine)return e.blankLine(t.inner)}}})});
//# sourceMappingURL=../../sourcemaps/mode/yaml-frontmatter/yaml-frontmatter.js.map
