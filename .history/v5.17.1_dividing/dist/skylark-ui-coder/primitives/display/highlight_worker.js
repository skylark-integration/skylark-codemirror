/**
 * skylark-ui-coder - The skylark coder widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylarkui/skylark-ui-coder/
 * @license MIT
 */
define(["../CoderCtor"],function(t){t.partial({startWorker:function(t){var e=this;e.doc.mode.startState&&e.doc.frontier<e.display.viewTo&&e.state.highlight.set(t,function(){e.highlightWorker()})},highlightWorker:function(){var t=this,e=t.doc;if(e.frontier<e.first&&(e.frontier=e.first),!(e.frontier>=t.display.viewTo)){var r=+new Date+t.options.workTime,s=copyState(e.mode,getStateBefore(t,e.frontier)),i=[];e.iter(e.frontier,Math.min(e.first+e.size,t.display.viewTo+500),function(o){if(e.frontier>=t.display.viewFrom){var n=o.styles,a=o.text.length>t.options.maxHighlightLength,l=t.ighlightLine(o,a?copyState(e.mode,s):s,!0);o.styles=l.styles;var h=o.styleClasses,f=l.classes;f?o.styleClasses=f:h&&(o.styleClasses=null);for(var g=!n||n.length!=o.styles.length||h!=f&&(!h||!f||h.bgClass!=f.bgClass||h.textClass!=f.textClass),y=0;!g&&y<n.length;++y)g=n[y]!=o.styles[y];g&&i.push(e.frontier),o.stateAfter=a?s:copyState(e.mode,s)}else o.text.length<=t.options.maxHighlightLength&&processLine(t,o.text,s),o.stateAfter=e.frontier%5==0?copyState(e.mode,s):null;if(++e.frontier,+new Date>r)return t.startWorker(t.options.workDelay),!0}),i.length&&runInOp(t,function(){for(var e=0;e<i.length;e++)t.regLineChange(i[e],"text")})}}})});
//# sourceMappingURL=../../sourcemaps/primitives/display/highlight_worker.js.map
