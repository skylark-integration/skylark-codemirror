/**
 * skylark-ui-coder - The skylark coder widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylarkui/skylark-ui-coder/
 * @license MIT
 */
define(["../../Coder","htmlhint"],function(e){"use strict";var t={"tagname-lowercase":!0,"attr-lowercase":!0,"attr-value-double-quotes":!0,"doctype-first":!1,"tag-pair":!0,"spec-char-escape":!0,"id-unique":!0,"src-not-empty":!0,"attr-no-duplication":!0};e.registerHelper("lint","html",function(r,i){var n=[];if(!window.HTMLHint)return n;for(var a=HTMLHint.verify(r,i&&i.rules||t),o=0;o<a.length;o++){var s=a[o],l=s.line-1,c=s.line-1,u=s.col-1,p=s.col;n.push({from:e.Pos(l,u),to:e.Pos(c,p),message:s.message,severity:s.type})}return n})});
//# sourceMappingURL=../../sourcemaps/addon/lint/html-lint.js.map
