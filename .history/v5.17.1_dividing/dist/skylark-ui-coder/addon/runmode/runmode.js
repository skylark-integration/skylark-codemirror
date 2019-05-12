/**
 * skylark-ui-coder - The skylark coder widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylarkui/skylark-ui-coder/
 * @license MIT
 */
define(["../../Coder"],function(e){"use strict";e.runMode=function(t,n,a,r){var d=e.getMode(e.defaults,n),i=/MSIE \d/.test(navigator.userAgent),o=i&&(null==document.documentMode||document.documentMode<9);if(a.appendChild){var c=r&&r.tabSize||e.defaults.tabSize,l=a,s=0;l.innerHTML="",a=function(e,t){if("\n"==e)return l.appendChild(document.createTextNode(o?"\r":e)),void(s=0);for(var n="",a=0;;){var r=e.indexOf("\t",a);if(r==-1){n+=e.slice(a),s+=e.length-a;break}s+=r-a,n+=e.slice(a,r);var d=c-s%c;s+=d;for(var i=0;i<d;++i)n+=" ";a=r+1}if(t){var u=l.appendChild(document.createElement("span"));u.className="cm-"+t.replace(/ +/g," cm-"),u.appendChild(document.createTextNode(n))}else l.appendChild(document.createTextNode(n))}}for(var u=e.splitLines(t),f=r&&r.state||e.startState(d),p=0,m=u.length;p<m;++p){p&&a("\n");var v=new e.StringStream(u[p]);for(!v.string&&d.blankLine&&d.blankLine(f);!v.eol();){var g=d.token(v,f);a(v.current(),g,p,v.start,f),v.start=v.pos}}}});
//# sourceMappingURL=../../sourcemaps/addon/runmode/runmode.js.map
