/**
 * skylark-codemirror - A version of codemirror 5.45  that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-codemirror/
 * @license MIT
 */
define(["../util/dom","../util/event"],function(e,t){"use strict";return{widgetHeight:function(t){if(null!=t.height)return t.height;let i=t.doc.cm;if(!i)return 0;if(!e.contains(document.body,t.node)){let n="position: relative;";t.coverGutter&&(n+="margin-left: -"+i.display.gutters.offsetWidth+"px;"),t.noHScroll&&(n+="width: "+i.display.wrapper.clientWidth+"px;"),e.removeChildrenAndAdd(i.display.measure,e.elt("div",[t.node],null,n))}return t.height=t.node.parentNode.offsetHeight},eventInWidget:function(e,i){for(let n=t.e_target(i);n!=e.wrapper;n=n.parentNode)if(!n||1==n.nodeType&&"true"==n.getAttribute("cm-ignore-events")||n.parentNode==e.sizer&&n!=e.mover)return!0}}});
//# sourceMappingURL=../../sourcemaps/primitives/measurement/widgets.js.map
