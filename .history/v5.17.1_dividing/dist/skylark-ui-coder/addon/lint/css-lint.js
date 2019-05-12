/**
 * skylark-ui-coder - The skylark coder widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylarkui/skylark-ui-coder/
 * @license MIT
 */
define(["../../Coder"],function(e){"use strict";e.registerHelper("lint","css",function(r){var s=[];if(!window.CSSLint)return s;for(var n=CSSLint.verify(r),i=n.messages,t=null,o=0;o<i.length;o++){t=i[o];var l=t.line-1,f=t.line-1,u=t.col-1,a=t.col;s.push({from:e.Pos(l,u),to:e.Pos(f,a),message:t.message,severity:t.type})}return s})});
//# sourceMappingURL=../../sourcemaps/addon/lint/css-lint.js.map
