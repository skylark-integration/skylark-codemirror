/**
 * skylark-codemirror - A version of codemirror 5.45  that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-codemirror/
 * @license MIT
 */
define(["../../CodeMirror"],function(e){"use strict";e.runMode=function(t,n,r,a){var d=e.getMode(e.defaults,n),i=/MSIE \d/.test(navigator.userAgent)&&(null==document.documentMode||document.documentMode<9);if(r.appendChild){var o=a&&a.tabSize||e.defaults.tabSize,c=r,l=0;c.innerHTML="",r=function(e,t){if("\n"==e)return c.appendChild(document.createTextNode(i?"\r":e)),void(l=0);for(var n="",r=0;;){var a=e.indexOf("\t",r);if(-1==a){n+=e.slice(r),l+=e.length-r;break}l+=a-r,n+=e.slice(r,a);var d=o-l%o;l+=d;for(var s=0;s<d;++s)n+=" ";r=a+1}if(t){var u=c.appendChild(document.createElement("span"));u.className="cm-"+t.replace(/ +/g," cm-"),u.appendChild(document.createTextNode(n))}else c.appendChild(document.createTextNode(n))}}for(var s=e.splitLines(t),u=a&&a.state||e.startState(d),f=0,p=s.length;f<p;++f){f&&r("\n");var m=new e.StringStream(s[f]);for(!m.string&&d.blankLine&&d.blankLine(u);!m.eol();){var v=d.token(m,u);r(m.current(),v,f,m.start,u),m.start=m.pos}}}});
//# sourceMappingURL=../../sourcemaps/addon/runmode/runmode.js.map
