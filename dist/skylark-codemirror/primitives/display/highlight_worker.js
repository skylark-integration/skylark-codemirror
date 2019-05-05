/**
 * skylark-codemirror - A version of codemirror 5.45  that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-codemirror/
 * @license MIT
 */
define(["../line/highlight","../modes","../util/misc","./operations","./view_tracking"],function(e,t,i,s,l){"use strict";function n(e,t){e.doc.highlightFrontier<e.display.viewTo&&e.state.highlight.set(t,i.bind(h,e))}function h(i){let h=i.doc;if(h.highlightFrontier>=i.display.viewTo)return;let o=+new Date+i.options.workTime,r=e.getContextBefore(i,h.highlightFrontier),g=[];h.iter(r.line,Math.min(h.first+h.size,i.display.viewTo+500),s=>{if(r.line>=i.display.viewFrom){let l=s.styles,n=s.text.length>i.options.maxHighlightLength?t.copyState(h.mode,r.state):null,o=e.highlightLine(i,s,r,!0);n&&(r.state=n),s.styles=o.styles;let a=s.styleClasses,y=o.classes;y?s.styleClasses=y:a&&(s.styleClasses=null);let f=!l||l.length!=s.styles.length||a!=y&&(!a||!y||a.bgClass!=y.bgClass||a.textClass!=y.textClass);for(let e=0;!f&&e<l.length;++e)f=l[e]!=s.styles[e];f&&g.push(r.line),s.stateAfter=r.save(),r.nextLine()}else s.text.length<=i.options.maxHighlightLength&&e.processLine(i,s.text,r),s.stateAfter=r.line%5==0?r.save():null,r.nextLine();if(+new Date>o)return n(i,i.options.workDelay),!0}),h.highlightFrontier=r.line,h.modeFrontier=Math.max(h.modeFrontier,r.line),g.length&&s.runInOp(i,()=>{for(let e=0;e<g.length;e++)l.regLineChange(i,g[e],"text")})}return{startWorker:n}});
//# sourceMappingURL=../../sourcemaps/primitives/display/highlight_worker.js.map
