/**
 * skylark-ui-coder - The skylark coder widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylarkui/skylark-ui-coder/
 * @license MIT
 */
define(["skylark-langx/Evented"],function(e){e.iherit({klassName:"LineView",_construct:function(e,i,n){this.line=i,this.rest=visualLineContinued(i),this.size=this.rest?lineNo(lst(this.rest))-n+1:1,this.node=this.text=null,this.hidden=lineIsHidden(e,i)},locateNodeInLineView:function(e,i){function n(e,i,n){for(var r=-1;r<(h?h.length:0);r++)for(var s=r<0?d.map:h[r],l=0;l<s.length;l+=3){var o=s[l+2];if(o==e||o==i){var a=lineNo(r<0?t.line:t.rest[r]),f=s[l]+n;return(n<0||o!=e)&&(f=s[l+(n?1:0)]),Pos(a,f)}}}var t=this,r=t.text.firstChild,s=!1;if(!e||!contains(r,e))return badPos(Pos(lineNo(t.line),0),!0);if(e==r&&(s=!0,e=r.childNodes[i],i=0,!e)){var l=t.rest?lst(t.rest):t.line;return badPos(Pos(lineNo(l),l.text.length),s)}var o=3==e.nodeType?e:null,a=e;for(o||1!=e.childNodes.length||3!=e.firstChild.nodeType||(o=e.firstChild,i&&(i=o.nodeValue.length));a.parentNode!=r;)a=a.parentNode;var d=t.measure,h=d.maps,f=n(o,a,i);if(f)return badPos(f,s);for(var u=a.nextSibling,v=o?o.nodeValue.length-i:0;u;u=u.nextSibling){if(f=n(u,u.firstChild,0))return badPos(Pos(f.line,f.ch-v),s);v+=u.textContent.length}for(var g=a.previousSibling,v=i;g;g=g.previousSibling){if(f=n(g,g.firstChild,-1))return badPos(Pos(f.line,f.ch+v),s);v+=u.textContent.length}}})});
//# sourceMappingURL=../../sourcemaps/primitives/line/LineView.js.map
