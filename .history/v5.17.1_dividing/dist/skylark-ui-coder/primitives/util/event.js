/**
 * skylark-ui-coder - The skylark coder widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylarkui/skylark-ui-coder/
 * @license MIT
 */
define(["../CoderCtor"],function(e){function r(e,r,n){var t=e._handlers&&e._handlers[r];return n?t&&t.length>0?t.slice():o:t||o}var n=CodeMirror.e_preventDefault=function(e){e.preventDefault?e.preventDefault():e.returnValue=!1},t=CodeMirror.e_stopPropagation=function(e){e.stopPropagation?e.stopPropagation():e.cancelBubble=!0},o=(CodeMirror.e_stop=function(e){n(e),t(e)},CodeMirror.on=function(e,r,n){if(e.addEventListener)e.addEventListener(r,n,!1);else if(e.attachEvent)e.attachEvent("on"+r,n);else{var t=e._handlers||(e._handlers={}),o=t[r]||(t[r]=[]);o.push(n)}},[]);CodeMirror.off=function(e,n,t){if(e.removeEventListener)e.removeEventListener(n,t,!1);else if(e.detachEvent)e.detachEvent("on"+n,t);else for(var o=r(e,n,!1),a=0;a<o.length;++a)if(o[a]==t){o.splice(a,1);break}},CodeMirror.signal=function(e,n){var t=r(e,n,!0);if(t.length)for(var o=Array.prototype.slice.call(arguments,2),a=0;a<t.length;++a)t[a].apply(null,o)}});
//# sourceMappingURL=../../sourcemaps/primitives/util/event.js.map
