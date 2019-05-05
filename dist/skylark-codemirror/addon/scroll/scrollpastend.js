/**
 * skylark-codemirror - A version of codemirror 5.45  that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-codemirror/
 * @license MIT
 */
define(["../../CodeMirror"],function(e){"use strict";function n(n,i){e.changeEnd(i).line==n.lastLine()&&t(n)}function t(e){var n="";e.lineCount()>1&&(n=e.display.scroller.clientHeight-30-e.getLineHandle(e.lastLine()).height+"px");e.state.scrollPastEndPadding!=n&&(e.state.scrollPastEndPadding=n,e.display.lineSpace.parentNode.style.paddingBottom=n,e.off("refresh",t),e.setSize(),e.on("refresh",t))}e.defineOption("scrollPastEnd",!1,function(i,a,s){s&&s!=e.Init&&(i.off("change",n),i.off("refresh",t),i.display.lineSpace.parentNode.style.paddingBottom="",i.state.scrollPastEndPadding=null),a&&(i.on("change",n),i.on("refresh",t),t(i))})});
//# sourceMappingURL=../../sourcemaps/addon/scroll/scrollpastend.js.map
