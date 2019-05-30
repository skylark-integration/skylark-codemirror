/**
 * skylark-ui-coder - The skylark coder widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylarkui/skylark-ui-coder/
 * @license MIT
 */
define(["../../Coder","../../mode/sql/sql"],function(t){"use strict";function r(t){return"[object Array]"==Object.prototype.toString.call(t)}function e(r){var e=r.doc.modeOption;return"sql"===e&&(e="text/x-sql"),t.resolveMode(e).keywords}function n(t){return"string"==typeof t?t:t.text}function o(t,e){return r(e)&&(e={columns:e}),e.text||(e.text=t),e}function i(t){var e={};if(r(t))for(var i=t.length-1;i>=0;i--){var s=t[i];e[n(s).toUpperCase()]=o(n(s),s)}else if(t)for(var a in t)e[a.toUpperCase()]=o(a,t[a]);return e}function s(t){return h[t.toUpperCase()]}function a(t){var r={};for(var e in t)t.hasOwnProperty(e)&&(r[e]=t[e]);return r}function u(t,r){var e=t.length,o=n(r).substr(0,e);return t.toUpperCase()===o.toUpperCase()}function l(t,e,n,o){if(r(n))for(var i=0;i<n.length;i++)u(e,n[i])&&t.push(o(n[i]));else for(var s in n)if(n.hasOwnProperty(s)){var a=n[s];a=a&&a!==!0?a.displayText?{text:a.text,displayText:a.displayText}:a.text:s,u(e,a)&&t.push(o(a))}}function f(t){return"."==t.charAt(0)&&(t=t.substr(1)),t.replace(/`/g,"")}function c(t){for(var r=n(t).split("."),e=0;e<r.length;e++)r[e]="`"+r[e]+"`";var o=r.join(".");return"string"==typeof t?o:(t=a(t),t.text=o,t)}function p(t,r,e,n){for(var o=!1,i=[],u=r.start,p=!0;p;)p="."==r.string.charAt(0),o=o||"`"==r.string.charAt(0),u=r.start,i.unshift(f(r.string)),r=n.getTokenAt(y(t.line,r.start)),"."==r.string&&(p=!0,r=n.getTokenAt(y(t.line,r.start)));var g=i.join(".");l(e,g,h,function(t){return o?c(t):t}),l(e,g,d,function(t){return o?c(t):t}),g=i.pop();var x=i.join("."),A=!1,m=x;if(!s(x)){var C=x;x=v(x,n),x!==C&&(A=!0)}var U=s(x);return U&&U.columns&&(U=U.columns),U&&l(e,g,U,function(t){var r=x;return 1==A&&(r=m),"string"==typeof t?t=r+"."+t:(t=a(t),t.text=r+"."+t.text),o?c(t):t}),u}function g(t,r){if(t)for(var e=/[,;]/g,n=t.split(" "),o=0;o<n.length;o++)r(n[o]?n[o].replace(e,""):"")}function v(t,r){for(var e=r.doc,n=e.getValue(),o=t.toUpperCase(),i="",a="",u=[],l={start:y(0,0),end:y(r.lastLine(),r.getLineHandle(r.lastLine()).length)},f=n.indexOf(A.QUERY_DIV);f!=-1;)u.push(e.posFromIndex(f)),f=n.indexOf(A.QUERY_DIV,f+1);u.unshift(y(0,0)),u.push(y(r.lastLine(),r.getLineHandle(r.lastLine()).text.length));for(var c=null,p=r.getCursor(),v=0;v<u.length;v++){if((null==c||m(p,c)>0)&&m(p,u[v])<=0){l={start:c,end:u[v]};break}c=u[v]}for(var h=e.getRange(l.start,l.end,!1),v=0;v<h.length;v++){var d=h[v];if(g(d,function(t){var r=t.toUpperCase();r===o&&s(i)&&(a=i),r!==A.ALIAS_KEYWORD&&(i=t)}),a)break}return a}var h,d,x,A={QUERY_DIV:";",ALIAS_KEYWORD:"AS"},y=t.Pos,m=t.cmpPos;t.registerHelper("hint","sql",function(t,r){h=i(r&&r.tables);var n=r&&r.defaultTable,o=r&&r.disableKeywords;d=n&&s(n),x=e(t),n&&!d&&(d=v(n,t)),d=d||[],d.columns&&(d=d.columns);var a,u,f,c=t.getCursor(),g=[],A=t.getTokenAt(c);return A.end>c.ch&&(A.end=c.ch,A.string=A.string.slice(0,c.ch-A.start)),A.string.match(/^[.`\w@]\w*$/)?(f=A.string,a=A.start,u=A.end):(a=u=c.ch,f=""),"."==f.charAt(0)||"`"==f.charAt(0)?a=p(c,A,g,t):(l(g,f,h,function(t){return t}),l(g,f,d,function(t){return t}),o||l(g,f,x,function(t){return t.toUpperCase()})),{list:g,from:y(c.line,a),to:y(c.line,u)}})});
//# sourceMappingURL=../../sourcemaps/addon/hint/sql-hint.js.map