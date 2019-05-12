/**
 * skylark-ui-coder - The skylark coder widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylarkui/skylark-ui-coder/
 * @license MIT
 */
define(["../../Coder"],function(e){"use strict";function t(e){for(var t=0;t<e.state.activeLines.length;t++)e.removeLineClass(e.state.activeLines[t],"wrap",r),e.removeLineClass(e.state.activeLines[t],"background",s),e.removeLineClass(e.state.activeLines[t],"gutter",o)}function n(e,t){if(e.length!=t.length)return!1;for(var n=0;n<e.length;n++)if(e[n]!=t[n])return!1;return!0}function i(e,i){for(var a=[],c=0;c<i.length;c++){var l=i[c];if(l.empty()){var v=e.getLineHandleVisualStart(l.head.line);a[a.length-1]!=v&&a.push(v)}}n(e.state.activeLines,a)||e.operation(function(){t(e);for(var n=0;n<a.length;n++)e.addLineClass(a[n],"wrap",r),e.addLineClass(a[n],"background",s),e.addLineClass(a[n],"gutter",o);e.state.activeLines=a})}function a(e,t){i(e,t.ranges)}var r="CodeMirror-activeline",s="CodeMirror-activeline-background",o="CodeMirror-activeline-gutter";e.defineOption("styleActiveLine",!1,function(n,r,s){var o=s&&s!=e.Init;r&&!o?(n.state.activeLines=[],i(n,n.listSelections()),n.on("beforeSelectionChange",a)):!r&&o&&(n.off("beforeSelectionChange",a),t(n),delete n.state.activeLines)})});
//# sourceMappingURL=../../sourcemaps/addon/selection/active-line.js.map
