/**
 * skylark-codemirror - A version of codemirror 5.45  that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-codemirror/
 * @license MIT
 */
define(["../../CodeMirror"],function(e){"use strict";e.defineMode("diff",function(){var e={"+":"positive","-":"negative","@":"meta"};return{token:function(r){var i=r.string.search(/[\t ]+?$/);if(!r.sol()||0===i)return r.skipToEnd(),("error "+(e[r.string.charAt(0)]||"")).replace(/ $/,"");var n=e[r.peek()]||r.skipToEnd();return-1===i?r.skipToEnd():r.pos=i,n}}}),e.defineMIME("text/x-diff","diff")});
//# sourceMappingURL=../../sourcemaps/mode/diff/diff.js.map
