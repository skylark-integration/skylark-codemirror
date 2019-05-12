/**
 * skylark-ui-coder - The skylark coder widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylarkui/skylark-ui-coder/
 * @license MIT
 */
define(["../util/dom","../CoderCtor"],function(e,t){var n=e.elt;t.partial({updateLineForChanges:function(e,t,n){for(var i=this,r=0;r<e.changes.length;r++){var s=e.changes[r];"text"==s?i.updateLineText(e):"gutter"==s?i.updateLineGutter(e,t,n):"class"==s?i.updateLineClasses(e):"widget"==s&&i.updateLineWidgets(e,n)}e.changes=null},ensureLineWrapped:function(e){return e.node==e.text&&(e.node=n("div",null,null,"position: relative"),e.text.parentNode&&e.text.parentNode.replaceChild(e.node,e.text),e.node.appendChild(e.text),ie&&ie_version<8&&(e.node.style.zIndex=2)),e.node},updateLineBackground:function(e){var t=e.bgClass?e.bgClass+" "+(e.line.bgClass||""):e.line.bgClass;if(t&&(t+=" CodeMirror-linebackground"),e.background)t?e.background.className=t:(e.background.parentNode.removeChild(e.background),e.background=null);else if(t){var i=this.ensureLineWrapped(e);e.background=i.insertBefore(n("div",null,t),i.firstChild)}},getLineContent:function(e){var t=this,n=t.display.externalMeasured;return n&&n.line==e.line?(t.display.externalMeasured=null,e.measure=n.measure,n.built):t.buildLineContent(e)},updateLineText:function(e){var t=this,n=e.text.className,i=getLineContent(t,e);e.text==e.node&&(e.node=i.pre),e.text.parentNode.replaceChild(i.pre,e.text),e.text=i.pre,i.bgClass!=e.bgClass||i.textClass!=e.textClass?(e.bgClass=i.bgClass,e.textClass=i.textClass,this.updateLineClasses(e)):n&&(e.text.className=n)},updateLineClasses:function(e){updateLineBackground(e),e.line.wrapClass?ensureLineWrapped(e).className=e.line.wrapClass:e.node!=e.text&&(e.node.className="");var t=e.textClass?e.textClass+" "+(e.line.textClass||""):e.line.textClass;e.text.className=t||""},updateLineGutter:function(e,t,i){var r=this;if(e.gutter&&(e.node.removeChild(e.gutter),e.gutter=null),e.gutterBackground&&(e.node.removeChild(e.gutterBackground),e.gutterBackground=null),e.line.gutterClass){var s=ensureLineWrapped(e);e.gutterBackground=n("div",null,"CodeMirror-gutter-background "+e.line.gutterClass,"left: "+(r.options.fixedGutter?i.fixedPos:-i.gutterTotalWidth)+"px; width: "+i.gutterTotalWidth+"px"),s.insertBefore(e.gutterBackground,e.text)}var a=e.line.gutterMarkers;if(r.options.lineNumbers||a){var s=ensureLineWrapped(e),l=e.gutter=n("div",null,"CodeMirror-gutter-wrapper","left: "+(r.options.fixedGutter?i.fixedPos:-i.gutterTotalWidth)+"px");if(r.display.input.setUneditable(l),s.insertBefore(l,e.text),e.line.gutterClass&&(l.className+=" "+e.line.gutterClass),!r.options.lineNumbers||a&&a["CodeMirror-linenumbers"]||(e.lineNumber=l.appendChild(n("div",r.lineNumberFor(r.options,t),"CodeMirror-linenumber CodeMirror-gutter-elt","left: "+i.gutterLeft["CodeMirror-linenumbers"]+"px; width: "+r.display.lineNumInnerWidth+"px"))),a)for(var d=0;d<r.options.gutters.length;++d){var o=r.options.gutters[d],u=a.hasOwnProperty(o)&&a[o];u&&l.appendChild(n("div",[u],"CodeMirror-gutter-elt","left: "+i.gutterLeft[o]+"px; width: "+i.gutterWidth[o]+"px"))}}},updateLineWidgets:function(e,t){var n=this;e.alignable&&(e.alignable=null);for(var i,r=e.node.firstChild;r;r=i){var i=r.nextSibling;"CodeMirror-linewidget"==r.className&&e.node.removeChild(r)}n.insertLineWidgets(e,t)},buildLineElement:function(e,t,n){var i=this,r=i.getLineContent(e);return e.text=e.node=r.pre,r.bgClass&&(e.bgClass=r.bgClass),r.textClass&&(e.textClass=r.textClass),i.updateLineClasses(e),i.updateLineGutter(e,t,n),i.insertLineWidgets(e,n),e.node},insertLineWidgets:function(e,t){var n=this;if(n.insertLineWidgetsFor(e.line,e,t,!0),e.rest)for(var i=0;i<e.rest.length;i++)n.insertLineWidgetsFor(n,e.rest[i],e,t,!1)},insertLineWidgetsFor:function(e,t,i,r){var s=this;if(e.widgets)for(var a=s.ensureLineWrapped(t),l=0,d=e.widgets;l<d.length;++l){var o=d[l],u=n("div",[o.node],"CodeMirror-linewidget");o.handleMouseEvents||u.setAttribute("cm-ignore-events","true"),s.positionLineWidget(o,u,t,i),s.display.input.setUneditable(u),r&&o.above?a.insertBefore(u,t.gutter||t.text):a.appendChild(u),s.signalLater(o,"redraw")}},positionLineWidget:function(e,t,n,i){if(e.noHScroll){(n.alignable||(n.alignable=[])).push(t);var r=i.wrapperWidth;t.style.left=i.fixedPos+"px",e.coverGutter||(r-=i.gutterTotalWidth,t.style.paddingLeft=i.gutterTotalWidth+"px"),t.style.width=r+"px"}e.coverGutter&&(t.style.zIndex=5,t.style.position="relative",e.noHScroll||(t.style.marginLeft=-i.gutterTotalWidth+"px"))}})});
//# sourceMappingURL=../../sourcemaps/primitives/display/update_line.js.map
