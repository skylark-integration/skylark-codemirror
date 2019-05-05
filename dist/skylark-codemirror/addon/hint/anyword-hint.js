/**
 * skylark-codemirror - A version of codemirror 5.45  that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-codemirror/
 * @license MIT
 */
define(["../../CodeMirror"],function(e){"use strict";var r=/[\w$]+/;e.registerHelper("hint","anyword",function(t,n){for(var i=n&&n.word||r,o=n&&n.range||500,s=t.getCursor(),a=t.getLine(s.line),l=s.ch,c=l;c&&i.test(a.charAt(c-1));)--c;for(var f=c!=l&&a.slice(c,l),g=n&&n.list||[],h={},u=new RegExp(i.source,"g"),p=-1;p<=1;p+=2)for(var d=s.line,v=Math.min(Math.max(d+p*o,t.firstLine()),t.lastLine())+p;d!=v;d+=p)for(var w,x=t.getLine(d);w=u.exec(x);)d==s.line&&w[0]===f||f&&0!=w[0].lastIndexOf(f,0)||Object.prototype.hasOwnProperty.call(h,w[0])||(h[w[0]]=!0,g.push(w[0]));return{list:g,from:e.Pos(s.line,c),to:e.Pos(s.line,l)}})});
//# sourceMappingURL=../../sourcemaps/addon/hint/anyword-hint.js.map
