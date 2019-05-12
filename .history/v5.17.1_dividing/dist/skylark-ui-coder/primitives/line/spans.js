/**
 * skylark-ui-coder - The skylark coder widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylarkui/skylark-ui-coder/
 * @license MIT
 */
define(["skylark-langx/Evented","skylark-utils-text/Line","../CoderCtor"],function(a,e,t){e.partial({detachMarkedSpans:function(){var a=this,e=a.markedSpans;if(e){for(var t=0;t<e.length;++t)e[t].marker.detachLine(a);a.markedSpans=null}},attachMarkedSpans:function(a){var e=this;if(a){for(var t=0;t<a.length;++t)a[t].marker.attachLine(e);e.markedSpans=a}},updateLineHeight:function(a){var e=this,t=a-e.height;if(t)for(var n=e;n;n=n.parent)n.height+=t}})});
//# sourceMappingURL=../../sourcemaps/primitives/line/spans.js.map
