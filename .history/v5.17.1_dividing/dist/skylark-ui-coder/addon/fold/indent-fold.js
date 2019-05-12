/**
 * skylark-ui-coder - The skylark coder widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylarkui/skylark-ui-coder/
 * @license MIT
 */
define(["../../Coder"],function(e){"use strict";e.registerHelper("fold","indent",function(n,t){var i=n.getOption("tabSize"),r=n.getLine(t.line);if(/\S/.test(r)){for(var l=function(n){return e.countColumn(n,null,i)},o=l(r),f=null,u=t.line+1,s=n.lastLine();u<=s;++u){var g=n.getLine(u),a=l(g);if(a>o)f=u;else if(/\S/.test(g))break}return f?{from:e.Pos(t.line,r.length),to:e.Pos(f,n.getLine(f).length)}:void 0}})});
//# sourceMappingURL=../../sourcemaps/addon/fold/indent-fold.js.map
