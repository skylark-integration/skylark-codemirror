/**
 * skylark-ui-coder - The skylark coder widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylarkui/skylark-ui-coder/
 * @license MIT
 */
define(["../../Coder"],function(e){function r(e){e.state.placeholder&&(e.state.placeholder.parentNode.removeChild(e.state.placeholder),e.state.placeholder=null)}function a(e){r(e);var a=e.state.placeholder=document.createElement("pre");a.style.cssText="height: 0; overflow: visible",a.className="CodeMirror-placeholder";var o=e.getOption("placeholder");"string"==typeof o&&(o=document.createTextNode(o)),a.appendChild(o),e.display.lineSpace.insertBefore(a,e.display.lineSpace.firstChild)}function o(e){l(e)&&a(e)}function t(e){var o=e.getWrapperElement(),t=l(e);o.className=o.className.replace(" CodeMirror-empty","")+(t?" CodeMirror-empty":""),t?a(e):r(e)}function l(e){return 1===e.lineCount()&&""===e.getLine(0)}e.defineOption("placeholder","",function(a,l,n){var c=n&&n!=e.Init;if(l&&!c)a.on("blur",o),a.on("change",t),a.on("swapDoc",t),t(a);else if(!l&&c){a.off("blur",o),a.off("change",t),a.off("swapDoc",t),r(a);var i=a.getWrapperElement();i.className=i.className.replace(" CodeMirror-empty","")}l&&!a.hasFocus()&&o(a)})});
//# sourceMappingURL=../../sourcemaps/addon/display/placeholder.js.map
