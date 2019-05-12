/**
 * skylark-ui-coder - The skylark coder widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylarkui/skylark-ui-coder/
 * @license MIT
 */
define(["../../lib/codemirror","../yaml/yaml"],function(t){var n=0,e=1,r=2;t.defineMode("yaml-frontmatter",function(a,i){function o(t){return t.state==r?s:u}var u=t.getMode(a,"yaml"),s=t.getMode(a,i&&i.base||"gfm");return{startState:function(){return{state:n,inner:t.startState(u)}},copyState:function(n){return{state:n.state,inner:t.copyState(o(n),n.inner)}},token:function(a,i){if(i.state==n)return a.match(/---/,!1)?(i.state=e,u.token(a,i.inner)):(i.state=r,i.inner=t.startState(s),s.token(a,i.inner));if(i.state==e){var o=a.sol()&&a.match(/---/,!1),f=u.token(a,i.inner);return o&&(i.state=r,i.inner=t.startState(s)),f}return s.token(a,i.inner)},innerMode:function(t){return{mode:o(t),state:t.inner}},blankLine:function(t){var n=o(t);if(n.blankLine)return n.blankLine(t.inner)}}})});
//# sourceMappingURL=../../sourcemaps/mode/yaml-frontmatter/yaml-frontmatter.js.map
