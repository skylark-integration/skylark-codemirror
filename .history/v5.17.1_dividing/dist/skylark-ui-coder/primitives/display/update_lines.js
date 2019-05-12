/**
 * skylark-ui-coder - The skylark coder widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylarkui/skylark-ui-coder/
 * @license MIT
 */
define(["../CoderCtor"],function(e){e.partial({updateHeightsInViewport:function(){for(var e=this,t=e.display,i=t.lineDiv.offsetTop,n=0;n<t.view.length;n++){var o,h=t.view[n];if(!h.hidden){if(ie&&ie_version<8){var r=h.node.offsetTop+h.node.offsetHeight;o=r-i,i=r}else{var g=h.node.getBoundingClientRect();o=g.bottom-g.top}var s=h.line.height-o;if(o<2&&(o=textHeight(t)),(s>.001||s<-.001)&&(e.updateLineHeight(h.line,o),e.updateWidgetHeight(h.line),h.rest))for(var l=0;l<h.rest.length;l++)e.updateWidgetHeight(h.rest[l])}}},updateWidgetHeight:function(e){if(e.widgets)for(var t=0;t<e.widgets.length;++t)e.widgets[t].height=e.widgets[t].node.parentNode.offsetHeight},visibleLines:function(e,t,i){var n=i&&null!=i.top?Math.max(0,i.top):e.scroller.scrollTop;n=Math.floor(n-paddingTop(e));var o=i&&null!=i.bottom?i.bottom:n+e.wrapper.clientHeight,h=this.lineAtHeight(t,n),r=this.lineAtHeight(t,o);if(i&&i.ensure){var g=i.ensure.from.line,s=i.ensure.to.line;g<h?(h=g,r=this.lineAtHeight(t,this.heightAtLine(this.getLine(t,g))+e.wrapper.clientHeight)):Math.min(s,t.lastLine())>=r&&(h=this.lineAtHeight(t,this.heightAtLine(this.getLine(t,s))-e.wrapper.clientHeight),r=s)}return{from:h,to:Math.max(r,h+1)}}})});
//# sourceMappingURL=../../sourcemaps/primitives/display/update_lines.js.map
