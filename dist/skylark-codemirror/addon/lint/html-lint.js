/**
 * skylark-codemirror - A version of codemirror 5.45  that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-codemirror/
 * @license MIT
 */
define(["../../CodeMirror","htmlhint"],function(e,r){"use strict";var o={"tagname-lowercase":!0,"attr-lowercase":!0,"attr-value-double-quotes":!0,"doctype-first":!1,"tag-pair":!0,"spec-char-escape":!0,"id-unique":!0,"src-not-empty":!0,"attr-no-duplication":!0};e.registerHelper("lint","html",function(n,t){var i=[];if(r&&!r.verify&&(r=r.HTMLHint),r||(r=window.HTMLHint),!r)return window.console&&window.console.error("Error: HTMLHint not found, not defined on window, or not available through define/require, CodeMirror HTML linting cannot run."),i;for(var a=r.verify(n,t&&t.rules||o),s=0;s<a.length;s++){var l=a[s],u=l.line-1,c=l.line-1,d=l.col-1,f=l.col;i.push({from:e.Pos(u,d),to:e.Pos(c,f),message:l.message,severity:l.type})}return i})});
//# sourceMappingURL=../../sourcemaps/addon/lint/html-lint.js.map
