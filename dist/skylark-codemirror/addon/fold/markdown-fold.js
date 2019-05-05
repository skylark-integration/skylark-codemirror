/**
 * skylark-codemirror - A version of codemirror 5.45  that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-codemirror/
 * @license MIT
 */
define(["../../CodeMirror"],function(e){"use strict";e.registerHelper("fold","markdown",function(n,t){var r=100;function i(t){var r=n.getTokenTypeAt(e.Pos(t,0));return r&&/\bheader\b/.test(r)}function o(e,n,t){var o=n&&n.match(/^#+/);return o&&i(e)?o[0].length:(o=t&&t.match(/^[=\-]+\s*$/))&&i(e+1)?"="==t[0]?1:2:r}var l=n.getLine(t.line),a=n.getLine(t.line+1),g=o(t.line,l,a);if(g!==r){for(var f=n.lastLine(),s=t.line,u=n.getLine(s+2);s<f&&!(o(s+1,a,u)<=g);)++s,a=u,u=n.getLine(s+2);return{from:e.Pos(t.line,l.length),to:e.Pos(s,n.getLine(s).length)}}})});
//# sourceMappingURL=../../sourcemaps/addon/fold/markdown-fold.js.map
