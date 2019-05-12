/**
 * skylark-ui-coder - The skylark coder widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylarkui/skylark-ui-coder/
 * @license MIT
 */
define(["../util/dom","../CoderCtor"],function(t,e){e.partial({alignHorizontally:function(){var t=this,e=t.display,i=e.view;if(e.alignWidgets||e.gutters.firstChild&&t.options.fixedGutter){for(var r=t.compensateForHScroll(e)-e.scroller.scrollLeft+t.doc.scrollLeft,n=e.gutters.offsetWidth,l=r+"px",o=0;o<i.length;o++)if(!i[o].hidden){t.options.fixedGutter&&(i[o].gutter&&(i[o].gutter.style.left=l),i[o].gutterBackground&&(i[o].gutterBackground.style.left=l));var u=i[o].alignable;if(u)for(var d=0;d<u.length;d++)u[d].style.left=l}t.options.fixedGutter&&(e.gutters.style.left=r+n+"px")}},maybeUpdateLineNumberWidth:function(){var t=this;if(!t.options.lineNumbers)return!1;var e=t.doc,i=t.lineNumberFor(t.options,e.first+e.size-1),r=t.display;if(i.length!=r.lineNumChars){var n=r.measure.appendChild(elt("div",[elt("div",i)],"CodeMirror-linenumber CodeMirror-gutter-elt")),l=n.firstChild.offsetWidth,o=n.offsetWidth-l;return r.lineGutter.style.width="",r.lineNumInnerWidth=Math.max(l,r.lineGutter.offsetWidth-o)+1,r.lineNumWidth=r.lineNumInnerWidth+o,r.lineNumChars=r.lineNumInnerWidth?i.length:-1,r.lineGutter.style.width=r.lineNumWidth+"px",updateGutterSpace(t),!0}return!1},lineNumberFor:function(t,e){return String(t.lineNumberFormatter(e+t.firstLineNumber))},compensateForHScroll:function(t){return t.scroller.getBoundingClientRect().left-t.sizer.getBoundingClientRect().left}})});
//# sourceMappingURL=../../sourcemaps/primitives/display/line_numbers.js.map
