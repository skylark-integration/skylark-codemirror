/**
 * skylark-codemirror - A version of codemirror 5.45  that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-codemirror/
 * @license MIT
 */
define(["../../CodeMirror"],function(e){"use strict";e.registerHelper("lint","css",function(n,r){var o=[];if(!window.CSSLint)return window.console&&window.console.error("Error: window.CSSLint not defined, CodeMirror CSS linting cannot run."),o;for(var i=CSSLint.verify(n,r).messages,s=null,t=0;t<i.length;t++){var l=(s=i[t]).line-1,c=s.line-1,d=s.col-1,f=s.col;o.push({from:e.Pos(l,d),to:e.Pos(c,f),message:s.message,severity:s.type})}return o})});
//# sourceMappingURL=../../sourcemaps/addon/lint/css-lint.js.map
