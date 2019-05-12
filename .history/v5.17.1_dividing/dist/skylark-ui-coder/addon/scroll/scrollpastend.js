/**
 * skylark-ui-coder - The skylark coder widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylarkui/skylark-ui-coder/
 * @license MIT
 */
define(["../../Coder"],function(e){"use strict";function n(n,i){e.changeEnd(i).line==n.lastLine()&&t(n)}function t(e){var n="";if(e.lineCount()>1){var i=e.display.scroller.clientHeight-30,a=e.getLineHandle(e.lastLine()).height;n=i-a+"px"}e.state.scrollPastEndPadding!=n&&(e.state.scrollPastEndPadding=n,e.display.lineSpace.parentNode.style.paddingBottom=n,e.off("refresh",t),e.setSize(),e.on("refresh",t))}e.defineOption("scrollPastEnd",!1,function(i,a,s){s&&s!=e.Init&&(i.off("change",n),i.off("refresh",t),i.display.lineSpace.parentNode.style.paddingBottom="",i.state.scrollPastEndPadding=null),a&&(i.on("change",n),i.on("refresh",t),t(i))})});
//# sourceMappingURL=../../sourcemaps/addon/scroll/scrollpastend.js.map
