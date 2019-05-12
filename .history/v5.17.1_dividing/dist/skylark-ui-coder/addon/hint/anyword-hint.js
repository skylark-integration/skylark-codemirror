/**
 * skylark-ui-coder - The skylark coder widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylarkui/skylark-ui-coder/
 * @license MIT
 */
define(["../../Coder"],function(e){"use strict";var r=/[\w$]+/,t=500;e.registerHelper("hint","anyword",function(n,i){for(var o=i&&i.word||r,s=i&&i.range||t,a=n.getCursor(),l=n.getLine(a.line),c=a.ch,f=c;f&&o.test(l.charAt(f-1));)--f;for(var g=f!=c&&l.slice(f,c),h=i&&i.list||[],u={},p=new RegExp(o.source,"g"),d=-1;d<=1;d+=2)for(var v=a.line,w=Math.min(Math.max(v+d*s,n.firstLine()),n.lastLine())+d;v!=w;v+=d)for(var x,L=n.getLine(v);x=p.exec(L);)v==a.line&&x[0]===g||g&&0!=x[0].lastIndexOf(g,0)||Object.prototype.hasOwnProperty.call(u,x[0])||(u[x[0]]=!0,h.push(x[0]));return{list:h,from:e.Pos(a.line,f),to:e.Pos(a.line,c)}})});
//# sourceMappingURL=../../sourcemaps/addon/hint/anyword-hint.js.map
