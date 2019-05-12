/**
 * skylark-ui-coder - The skylark coder widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylarkui/skylark-ui-coder/
 * @license MIT
 */
define(["../../Coder"],function(e){"use strict";e.defineMode("diff",function(){var e={"+":"positive","-":"negative","@":"meta"};return{token:function(i){var n=i.string.search(/[\t ]+?$/);if(!i.sol()||0===n)return i.skipToEnd(),("error "+(e[i.string.charAt(0)]||"")).replace(/ $/,"");var r=e[i.peek()]||i.skipToEnd();return n===-1?i.skipToEnd():i.pos=n,r}}}),e.defineMIME("text/x-diff","diff")});
//# sourceMappingURL=../../sourcemaps/mode/diff/diff.js.map
