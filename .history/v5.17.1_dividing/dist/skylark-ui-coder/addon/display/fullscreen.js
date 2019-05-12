/**
 * skylark-ui-coder - The skylark coder widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylarkui/skylark-ui-coder/
 * @license MIT
 */
define(["../../Coder"],function(e){"use strict";function t(e){var t=e.getWrapperElement();e.state.fullScreenRestore={scrollTop:window.pageYOffset,scrollLeft:window.pageXOffset,width:t.style.width,height:t.style.height},t.style.width="",t.style.height="auto",t.className+=" CodeMirror-fullscreen",document.documentElement.style.overflow="hidden",e.refresh()}function l(e){var t=e.getWrapperElement();t.className=t.className.replace(/\s*CodeMirror-fullscreen\b/,""),document.documentElement.style.overflow="";var l=e.state.fullScreenRestore;t.style.width=l.width,t.style.height=l.height,window.scrollTo(l.scrollLeft,l.scrollTop),e.refresh()}e.defineOption("fullScreen",!1,function(r,o,s){s==e.Init&&(s=!1),!s!=!o&&(o?t(r):l(r))})});
//# sourceMappingURL=../../sourcemaps/addon/display/fullscreen.js.map
