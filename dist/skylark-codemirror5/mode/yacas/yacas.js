/**
 * skylark-codemirror5 - A version of codemirror 5.17.1  that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-codemirror5/
 * @license MIT
 */
define(["../../CodeMirror"],function(e){"use strict";e.defineMode("yacas",function(t,n){var r=function(e){for(var t={},n=e.split(" "),r=0;r<n.length;++r)t[n[r]]=!0;return t}("Assert BackQuote D Defun Deriv For ForEach FromFile FromString Function Integrate InverseTaylor Limit LocalSymbols Macro MacroRule MacroRulePattern NIntegrate Rule RulePattern Subst TD TExplicitSum TSum Taylor Taylor1 Taylor2 Taylor3 ToFile ToStdout ToString TraceRule Until While"),o="(?:[a-zA-Z\\$'][a-zA-Z0-9\\$']*)",a=new RegExp("(?:(?:\\.\\d+|\\d+\\.\\d*|\\d+)(?:[eE][+-]?\\d+)?)"),i=new RegExp(o),c=new RegExp(o+"?_"+o),u=new RegExp(o+"\\s*\\(");function l(e,t){var n;if('"'===(n=e.next()))return t.tokenize=s,t.tokenize(e,t);if("/"===n){if(e.eat("*"))return t.tokenize=p,t.tokenize(e,t);if(e.eat("/"))return e.skipToEnd(),"comment"}e.backUp(1);var o=e.match(/^(\w+)\s*\(/,!1);null!==o&&r.hasOwnProperty(o[1])&&t.scopes.push("bodied");var l=f(t);if("bodied"===l&&"["===n&&t.scopes.pop(),"["!==n&&"{"!==n&&"("!==n||t.scopes.push(n),("["===(l=f(t))&&"]"===n||"{"===l&&"}"===n||"("===l&&")"===n)&&t.scopes.pop(),";"===n)for(;"bodied"===l;)t.scopes.pop(),l=f(t);return e.match(/\d+ *#/,!0,!1)?"qualifier":e.match(a,!0,!1)?"number":e.match(c,!0,!1)?"variable-3":e.match(/(?:\[|\]|{|}|\(|\))/,!0,!1)?"bracket":e.match(u,!0,!1)?(e.backUp(1),"variable"):e.match(i,!0,!1)?"variable-2":e.match(/(?:\\|\+|\-|\*|\/|,|;|\.|:|@|~|=|>|<|&|\||_|`|'|\^|\?|!|%|#)/,!0,!1)?"operator":"error"}function s(e,t){for(var n,r=!1,o=!1;null!=(n=e.next());){if('"'===n&&!o){r=!0;break}o=!o&&"\\"===n}return r&&!o&&(t.tokenize=l),"string"}function p(e,t){for(var n,r;null!=(r=e.next());){if("*"===n&&"/"===r){t.tokenize=l;break}n=r}return"comment"}function f(e){var t=null;return e.scopes.length>0&&(t=e.scopes[e.scopes.length-1]),t}return{startState:function(){return{tokenize:l,scopes:[]}},token:function(e,t){return e.eatSpace()?null:t.tokenize(e,t)},indent:function(n,r){if(n.tokenize!==l&&null!==n.tokenize)return e.Pass;var o=0;return"]"!==r&&"];"!==r&&"}"!==r&&"};"!==r&&");"!==r||(o=-1),(n.scopes.length+o)*t.indentUnit},electricChars:"{}[]();",blockCommentStart:"/*",blockCommentEnd:"*/",lineComment:"//"}}),e.defineMIME("text/x-yacas",{name:"yacas"})});
//# sourceMappingURL=../../sourcemaps/mode/yacas/yacas.js.map
