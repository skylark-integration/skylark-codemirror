/**
 * skylark-ui-coder - The skylark coder widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylarkui/skylark-ui-coder/
 * @license MIT
 */
define(["../../Coder"],function(e){"use strict";function n(e,n){return e.line-n.line||e.ch-n.ch}function t(e,n,t,i){this.line=n,this.ch=t,this.cm=e,this.text=e.getLine(n),this.min=i?i.from:e.firstLine(),this.max=i?i.to-1:e.lastLine()}function i(e,n){var t=e.cm.getTokenTypeAt(h(e.line,n));return t&&/\btag\b/.test(t)}function r(e){if(!(e.line>=e.max))return e.ch=0,e.text=e.cm.getLine(++e.line),!0}function f(e){if(!(e.line<=e.min))return e.text=e.cm.getLine(--e.line),e.ch=e.text.length,!0}function u(e){for(;;){var n=e.text.indexOf(">",e.ch);if(n==-1){if(r(e))continue;return}{if(i(e,n+1)){var t=e.text.lastIndexOf("/",n),f=t>-1&&!/\S/.test(e.text.slice(t+1,n));return e.ch=n+1,f?"selfClose":"regular"}e.ch=n+1}}}function l(e){for(;;){var n=e.ch?e.text.lastIndexOf("<",e.ch-1):-1;if(n==-1){if(f(e))continue;return}if(i(e,n+1)){v.lastIndex=n,e.ch=n;var t=v.exec(e.text);if(t&&t.index==n)return t}else e.ch=n}}function c(e){for(;;){v.lastIndex=e.ch;var n=v.exec(e.text);if(!n){if(r(e))continue;return}{if(i(e,n.index+1))return e.ch=n.index+n[0].length,n;e.ch=n.index+1}}}function o(e){for(;;){var n=e.ch?e.text.lastIndexOf(">",e.ch-1):-1;if(n==-1){if(f(e))continue;return}{if(i(e,n+1)){var t=e.text.lastIndexOf("/",n),r=t>-1&&!/\S/.test(e.text.slice(t+1,n));return e.ch=n+1,r?"selfClose":"regular"}e.ch=n}}}function a(e,n){for(var t=[];;){var i,r=c(e),f=e.line,l=e.ch-(r?r[0].length:0);if(!r||!(i=u(e)))return;if("selfClose"!=i)if(r[1]){for(var o=t.length-1;o>=0;--o)if(t[o]==r[2]){t.length=o;break}if(o<0&&(!n||n==r[2]))return{tag:r[2],from:h(f,l),to:h(e.line,e.ch)}}else t.push(r[2])}}function s(e,n){for(var t=[];;){var i=o(e);if(!i)return;if("selfClose"!=i){var r=e.line,f=e.ch,u=l(e);if(!u)return;if(u[1])t.push(u[2]);else{for(var c=t.length-1;c>=0;--c)if(t[c]==u[2]){t.length=c;break}if(c<0&&(!n||n==u[2]))return{tag:u[2],from:h(e.line,e.ch),to:h(r,f)}}}else l(e)}}var h=e.Pos,x="A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD",g=x+"-:.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040",v=new RegExp("<(/?)(["+x+"]["+g+"]*)","g");e.registerHelper("fold","xml",function(e,n){for(var i=new t(e,n.line,0);;){var r,f=c(i);if(!f||i.line!=n.line||!(r=u(i)))return;if(!f[1]&&"selfClose"!=r){var l=h(i.line,i.ch),o=a(i,f[2]);return o&&{from:l,to:o.from}}}}),e.findMatchingTag=function(e,i,r){var f=new t(e,i.line,i.ch,r);if(f.text.indexOf(">")!=-1||f.text.indexOf("<")!=-1){var c=u(f),o=c&&h(f.line,f.ch),x=c&&l(f);if(c&&x&&!(n(f,i)>0)){var g={from:h(f.line,f.ch),to:o,tag:x[2]};return"selfClose"==c?{open:g,close:null,at:"open"}:x[1]?{open:s(f,x[2]),close:g,at:"close"}:(f=new t(e,o.line,o.ch,r),{open:g,close:a(f,x[2]),at:"open"})}}},e.findEnclosingTag=function(e,n,i){for(var r=new t(e,n.line,n.ch,i);;){var f=s(r);if(!f)break;var u=new t(e,n.line,n.ch,i),l=a(u,f.tag);if(l)return{open:f,close:l}}},e.scanForClosingTag=function(e,n,i,r){var f=new t(e,n.line,n.ch,r?{from:0,to:r}:null);return a(f,i)}});
//# sourceMappingURL=../../sourcemaps/addon/fold/xml-fold.js.map
