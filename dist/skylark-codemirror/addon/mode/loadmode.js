/**
 * skylark-codemirror - A version of codemirror 5.45  that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-codemirror/
 * @license MIT
 */
define(["../../CodeMirror"],function(e,r){e.modeURL||(e.modeURL="../mode/%N/%N.js");var n={};function o(r,n){var o=e.modes[r].dependencies;if(!o)return n();for(var t=[],i=0;i<o.length;++i)e.modes.hasOwnProperty(o[i])||t.push(o[i]);if(!t.length)return n();var d=function(e,r){var n=r;return function(){0==--n&&e()}}(n,t.length);for(i=0;i<t.length;++i)e.requireMode(t[i],d)}e.requireMode=function(r,t){if("string"!=typeof r&&(r=r.name),e.modes.hasOwnProperty(r))return o(r,t);if(n.hasOwnProperty(r))return n[r].push(t);var i=e.modeURL.replace(/%N/g,r);requirejs([i],t)},e.autoLoadMode=function(r,n){e.modes.hasOwnProperty(n)||e.requireMode(n,function(){r.setOption("mode",r.getOption("mode"))})}});
//# sourceMappingURL=../../sourcemaps/addon/mode/loadmode.js.map
