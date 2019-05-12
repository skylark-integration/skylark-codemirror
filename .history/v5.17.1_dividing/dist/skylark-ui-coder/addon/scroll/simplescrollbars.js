/**
 * skylark-ui-coder - The skylark coder widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylarkui/skylark-ui-coder/
 * @license MIT
 */
define(["../../Coder"],function(t){"use strict";function e(e,o,i){function n(e){var o=t.wheelEventPixels(e)["horizontal"==s.orientation?"x":"y"],i=s.pos;s.moveTo(s.pos+o),s.pos!=i&&t.e_preventDefault(e)}this.orientation=o,this.scroll=i,this.screen=this.total=this.size=1,this.pos=0,this.node=document.createElement("div"),this.node.className=e+"-"+o,this.inner=this.node.appendChild(document.createElement("div"));var s=this;t.on(this.inner,"mousedown",function(e){function o(){t.off(document,"mousemove",i),t.off(document,"mouseup",o)}function i(t){return 1!=t.which?o():void s.moveTo(r+(t[n]-h)*(s.total/s.size))}if(1==e.which){t.e_preventDefault(e);var n="horizontal"==s.orientation?"pageX":"pageY",h=e[n],r=s.pos;t.on(document,"mousemove",i),t.on(document,"mouseup",o)}}),t.on(this.node,"click",function(e){t.e_preventDefault(e);var o,i=s.inner.getBoundingClientRect();o="horizontal"==s.orientation?e.clientX<i.left?-1:e.clientX>i.right?1:0:e.clientY<i.top?-1:e.clientY>i.bottom?1:0,s.moveTo(s.pos+o*s.screen)}),t.on(this.node,"mousewheel",n),t.on(this.node,"DOMMouseScroll",n)}function o(t,o,i){this.addClass=t,this.horiz=new e(t,"horizontal",i),o(this.horiz.node),this.vert=new e(t,"vertical",i),o(this.vert.node),this.width=null}e.prototype.setPos=function(t,e){return t<0&&(t=0),t>this.total-this.screen&&(t=this.total-this.screen),!(!e&&t==this.pos)&&(this.pos=t,this.inner.style["horizontal"==this.orientation?"left":"top"]=t*(this.size/this.total)+"px",!0)},e.prototype.moveTo=function(t){this.setPos(t)&&this.scroll(t,this.orientation)};var i=10;e.prototype.update=function(t,e,o){var n=this.screen!=e||this.total!=t||this.size!=o;n&&(this.screen=e,this.total=t,this.size=o);var s=this.screen*(this.size/this.total);s<i&&(this.size-=i-s,s=i),this.inner.style["horizontal"==this.orientation?"width":"height"]=s+"px",this.setPos(this.pos,n)},o.prototype.update=function(t){if(null==this.width){var e=window.getComputedStyle?window.getComputedStyle(this.horiz.node):this.horiz.node.currentStyle;e&&(this.width=parseInt(e.height))}var o=this.width||0,i=t.scrollWidth>t.clientWidth+1,n=t.scrollHeight>t.clientHeight+1;return this.vert.node.style.display=n?"block":"none",this.horiz.node.style.display=i?"block":"none",n&&(this.vert.update(t.scrollHeight,t.clientHeight,t.viewHeight-(i?o:0)),this.vert.node.style.bottom=i?o+"px":"0"),i&&(this.horiz.update(t.scrollWidth,t.clientWidth,t.viewWidth-(n?o:0)-t.barLeft),this.horiz.node.style.right=n?o+"px":"0",this.horiz.node.style.left=t.barLeft+"px"),{right:n?o:0,bottom:i?o:0}},o.prototype.setScrollTop=function(t){this.vert.setPos(t)},o.prototype.setScrollLeft=function(t){this.horiz.setPos(t)},o.prototype.clear=function(){var t=this.horiz.node.parentNode;t.removeChild(this.horiz.node),t.removeChild(this.vert.node)},t.scrollbarModel.simple=function(t,e){return new o("CodeMirror-simplescroll",t,e)},t.scrollbarModel.overlay=function(t,e){return new o("CodeMirror-overlayscroll",t,e)}});
//# sourceMappingURL=../../sourcemaps/addon/scroll/simplescrollbars.js.map
