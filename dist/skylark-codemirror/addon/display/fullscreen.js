/**
 * skylark-codemirror - A version of codemirror 5.45  that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-codemirror/
 * @license MIT
 */
define(["../../CodeMirror"],function(e){"use strict";e.defineOption("fullScreen",!1,function(t,l,r){r==e.Init&&(r=!1),!r!=!l&&(l?function(e){var t=e.getWrapperElement();e.state.fullScreenRestore={scrollTop:window.pageYOffset,scrollLeft:window.pageXOffset,width:t.style.width,height:t.style.height},t.style.width="",t.style.height="auto",t.className+=" CodeMirror-fullscreen",document.documentElement.style.overflow="hidden",e.refresh()}(t):function(e){var t=e.getWrapperElement();t.className=t.className.replace(/\s*CodeMirror-fullscreen\b/,""),document.documentElement.style.overflow="";var l=e.state.fullScreenRestore;t.style.width=l.width,t.style.height=l.height,window.scrollTo(l.scrollLeft,l.scrollTop),e.refresh()}(t))})});
//# sourceMappingURL=../../sourcemaps/addon/display/fullscreen.js.map
