/**
 * skylark-codemirror - A version of codemirror 5.45  that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-codemirror/
 * @license MIT
 */
define(["../line/utils_line","../measurement/position_measurement","../util/dom","./update_display"],function(e,t,i,l){"use strict";return{alignHorizontally:function(e){let i=e.display,l=i.view;if(!(i.alignWidgets||i.gutters.firstChild&&e.options.fixedGutter))return;let r=t.compensateForHScroll(i)-i.scroller.scrollLeft+e.doc.scrollLeft,n=i.gutters.offsetWidth,u=r+"px";for(let t=0;t<l.length;t++)if(!l[t].hidden){e.options.fixedGutter&&(l[t].gutter&&(l[t].gutter.style.left=u),l[t].gutterBackground&&(l[t].gutterBackground.style.left=u));let i=l[t].alignable;if(i)for(let e=0;e<i.length;e++)i[e].style.left=u}e.options.fixedGutter&&(i.gutters.style.left=r+n+"px")},maybeUpdateLineNumberWidth:function(t){if(!t.options.lineNumbers)return!1;let r=t.doc,n=e.lineNumberFor(t.options,r.first+r.size-1),u=t.display;if(n.length!=u.lineNumChars){let e=u.measure.appendChild(i.elt("div",[i.elt("div",n)],"CodeMirror-linenumber CodeMirror-gutter-elt")),r=e.firstChild.offsetWidth,s=e.offsetWidth-r;return u.lineGutter.style.width="",u.lineNumInnerWidth=Math.max(r,u.lineGutter.offsetWidth-s)+1,u.lineNumWidth=u.lineNumInnerWidth+s,u.lineNumChars=u.lineNumInnerWidth?n.length:-1,u.lineGutter.style.width=u.lineNumWidth+"px",l.updateGutterSpace(t),!0}return!1}}});
//# sourceMappingURL=../../sourcemaps/primitives/display/line_numbers.js.map
