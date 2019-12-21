/**
 * skylark-codemirror - A version of codemirror 5.45  that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-codemirror/
 * @license MIT
 */
define(["../../CodeMirror","../yaml/yaml"],function(t){var n=2;t.defineMode("yaml-frontmatter",function(e,r){var a=t.getMode(e,"yaml"),i=t.getMode(e,r&&r.base||"gfm");function o(t){return t.state==n?i:a}return{startState:function(){return{state:0,inner:t.startState(a)}},copyState:function(n){return{state:n.state,inner:t.copyState(o(n),n.inner)}},token:function(e,r){if(0==r.state)return e.match(/---/,!1)?(r.state=1,a.token(e,r.inner)):(r.state=n,r.inner=t.startState(i),i.token(e,r.inner));if(1==r.state){var o=e.sol()&&e.match(/---/,!1),u=a.token(e,r.inner);return o&&(r.state=n,r.inner=t.startState(i)),u}return i.token(e,r.inner)},innerMode:function(t){return{mode:o(t),state:t.inner}},blankLine:function(t){var n=o(t);if(n.blankLine)return n.blankLine(t.inner)}}})});
//# sourceMappingURL=../../sourcemaps/mode/yaml-frontmatter/yaml-frontmatter.js.map
