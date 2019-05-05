/**
 * skylark-codemirror - A version of codemirror 5.45  that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-codemirror/
 * @license MIT
 */
define(["../../CodeMirror"],function(n){"use strict";n.registerHelper("lint","javascript",function(r,e){if(!window.JSHINT)return window.console&&window.console.error("Error: window.JSHINT not defined, CodeMirror JavaScript linting cannot run."),[];e.indent||(e.indent=1),JSHINT(r,e,e.globals);var i=JSHINT.data().errors,o=[];return i&&function(r,e){for(var i=0;i<r.length;i++){var o=r[i];if(o){if(o.line<=0){window.console&&window.console.warn("Cannot display JSHint error (invalid line "+o.line+")",o);continue}var t=o.character-1,a=t+1;if(o.evidence){var s=o.evidence.substring(t).search(/.\b/);s>-1&&(a+=s)}var d={message:o.reason,severity:o.code&&o.code.startsWith("W")?"warning":"error",from:n.Pos(o.line-1,t),to:n.Pos(o.line-1,a)};e.push(d)}}}(i,o),o})});
//# sourceMappingURL=../../sourcemaps/addon/lint/javascript-lint.js.map
