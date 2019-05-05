/**
 * skylark-codemirror - A version of codemirror 5.45  that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-codemirror/
 * @license MIT
 */
define(["../../CodeMirror"],function(e){"use strict";e.overlayMode=function(a,r,o){return{startState:function(){return{base:e.startState(a),overlay:e.startState(r),basePos:0,baseCur:null,overlayPos:0,overlayCur:null,streamSeen:null}},copyState:function(o){return{base:e.copyState(a,o.base),overlay:e.copyState(r,o.overlay),basePos:o.basePos,baseCur:null,overlayPos:o.overlayPos,overlayCur:null}},token:function(e,n){return(e!=n.streamSeen||Math.min(n.basePos,n.overlayPos)<e.start)&&(n.streamSeen=e,n.basePos=n.overlayPos=e.start),e.start==n.basePos&&(n.baseCur=a.token(e,n.base),n.basePos=e.pos),e.start==n.overlayPos&&(e.pos=e.start,n.overlayCur=r.token(e,n.overlay),n.overlayPos=e.pos),e.pos=Math.min(n.basePos,n.overlayPos),null==n.overlayCur?n.baseCur:null!=n.baseCur&&n.overlay.combineTokens||o&&null==n.overlay.combineTokens?n.baseCur+" "+n.overlayCur:n.overlayCur},indent:a.indent&&function(e,r,o){return a.indent(e.base,r,o)},electricChars:a.electricChars,innerMode:function(e){return{state:e.base,mode:a}},blankLine:function(e){var n,t;return a.blankLine&&(n=a.blankLine(e.base)),r.blankLine&&(t=r.blankLine(e.overlay)),null==t?n:o&&null!=n?n+" "+t:t}}}});
//# sourceMappingURL=../../sourcemaps/addon/mode/overlay.js.map
