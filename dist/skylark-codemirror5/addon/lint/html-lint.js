/**
 * skylark-codemirror5 - A version of codemirror 5.17.1  that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-codemirror5/
 * @license MIT
 */
!function(e){"object"==typeof exports&&"object"==typeof module?e(require("../../lib/codemirror"),require("htmlhint")):"function"==typeof define&&define.amd?define(["../../lib/codemirror","htmlhint"],e):e(CodeMirror,window.HTMLHint)}(function(e,r){"use strict";var o={"tagname-lowercase":!0,"attr-lowercase":!0,"attr-value-double-quotes":!0,"doctype-first":!1,"tag-pair":!0,"spec-char-escape":!0,"id-unique":!0,"src-not-empty":!0,"attr-no-duplication":!0};e.registerHelper("lint","html",function(t,i){var n=[];if(r&&!r.verify&&(r=r.HTMLHint),r||(r=window.HTMLHint),!r)return window.console&&window.console.error("Error: HTMLHint not found, not defined on window, or not available through define/require, CodeMirror HTML linting cannot run."),n;for(var a=r.verify(t,i&&i.rules||o),l=0;l<a.length;l++){var c=a[l],d=c.line-1,s=c.line-1,u=c.col-1,f=c.col;n.push({from:e.Pos(d,u),to:e.Pos(s,f),message:c.message,severity:c.type})}return n})});
//# sourceMappingURL=../../sourcemaps/addon/lint/html-lint.js.map
