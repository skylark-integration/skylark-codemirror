/**
 * skylark-codemirror - A version of codemirror 5.45  that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-codemirror/
 * @license MIT
 */
define(["../../CodeMirror"],function(n){n.defineOption("showTrailingSpace",!1,function(e,i,r){r==n.Init&&(r=!1),r&&!i?e.removeOverlay("trailingspace"):!r&&i&&e.addOverlay({token:function(n){for(var e=n.string.length,i=e;i&&/\s/.test(n.string.charAt(i-1));--i);return i>n.pos?(n.pos=i,null):(n.pos=e,"trailingspace")},name:"trailingspace"})})});
//# sourceMappingURL=../../sourcemaps/addon/edit/trailingspace.js.map
