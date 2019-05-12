/**
 * skylark-ui-coder - The skylark coder widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylarkui/skylark-ui-coder/
 * @license MIT
 */
define(["../../Coder"],function(e){"use strict";e.registerHelper("fold","markdown",function(n,t){function i(t){var i=n.getTokenTypeAt(e.Pos(t,0));return i&&/\bheader\b/.test(i)}function r(e,n,t){var r=n&&n.match(/^#+/);return r&&i(e)?r[0].length:(r=t&&t.match(/^[=\-]+\s*$/),r&&i(e+1)?"="==t[0]?1:2:o)}var o=100,l=n.getLine(t.line),g=n.getLine(t.line+1),a=r(t.line,l,g);if(a!==o){for(var f=n.lastLine(),s=t.line,u=n.getLine(s+2);s<f&&!(r(s+1,g,u)<=a);)++s,g=u,u=n.getLine(s+2);return{from:e.Pos(t.line,l.length),to:e.Pos(s,n.getLine(s).length)}}})});
//# sourceMappingURL=../../sourcemaps/addon/fold/markdown-fold.js.map
