/**
 * skylark-codemirror - A version of codemirror 5.45  that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-codemirror/
 * @license MIT
 */
define(["../../CodeMirror"],function(e){"use strict";function n(n,t){var i=n.getLine(t),r=i.search(/\S/);return-1==r||/\bcomment\b/.test(n.getTokenTypeAt(e.Pos(t,r+1)))?-1:e.countColumn(i,null,n.getOption("tabSize"))}e.registerHelper("fold","indent",function(t,i){var r=n(t,i.line);if(!(r<0)){for(var o=null,l=i.line+1,f=t.lastLine();l<=f;++l){var s=n(t,l);if(-1==s);else{if(!(s>r))break;o=l}}return o?{from:e.Pos(i.line,t.getLine(i.line).length),to:e.Pos(o,t.getLine(o).length)}:void 0}})});
//# sourceMappingURL=../../sourcemaps/addon/fold/indent-fold.js.map
