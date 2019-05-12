/**
 * skylark-ui-coder - The skylark coder widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylarkui/skylark-ui-coder/
 * @license MIT
 */
define(["../../Coder"],function(e){"use strict";e.overlayMode=function(a,o,r){return{startState:function(){return{base:e.startState(a),overlay:e.startState(o),basePos:0,baseCur:null,overlayPos:0,overlayCur:null,streamSeen:null}},copyState:function(r){return{base:e.copyState(a,r.base),overlay:e.copyState(o,r.overlay),basePos:r.basePos,baseCur:null,overlayPos:r.overlayPos,overlayCur:null}},token:function(e,n){return(e!=n.streamSeen||Math.min(n.basePos,n.overlayPos)<e.start)&&(n.streamSeen=e,n.basePos=n.overlayPos=e.start),e.start==n.basePos&&(n.baseCur=a.token(e,n.base),n.basePos=e.pos),e.start==n.overlayPos&&(e.pos=e.start,n.overlayCur=o.token(e,n.overlay),n.overlayPos=e.pos),e.pos=Math.min(n.basePos,n.overlayPos),null==n.overlayCur?n.baseCur:null!=n.baseCur&&n.overlay.combineTokens||r&&null==n.overlay.combineTokens?n.baseCur+" "+n.overlayCur:n.overlayCur},indent:a.indent&&function(e,o){return a.indent(e.base,o)},electricChars:a.electricChars,innerMode:function(e){return{state:e.base,mode:a}},blankLine:function(e){a.blankLine&&a.blankLine(e.base),o.blankLine&&o.blankLine(e.overlay)}}}});
//# sourceMappingURL=../../sourcemaps/addon/mode/overlay.js.map
