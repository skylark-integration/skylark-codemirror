/**
 * skylark-ui-coder - The skylark coder widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylarkui/skylark-ui-coder/
 * @license MIT
 */
define(["../CoderCtor"],function(n){(function(){if(ie&&ie_version<9)return!1;var n=elt("div");return"draggable"in n||"dragDrop"in n})(),CodeMirror.splitLines=3!="\n\nb".split(/\n/).length?function(n){for(var t=0,e=[],r=n.length;t<=r;){var i=n.indexOf("\n",t);i==-1&&(i=n.length);var o=n.slice(t,"\r"==n.charAt(i-1)?i-1:i),c=o.indexOf("\r");c!=-1?(e.push(o.slice(0,c)),t+=c+1):(e.push(o),t=i+1)}return e}:function(n){return n.split(/\r\n?|\n/)},window.getSelection?function(n){try{return n.selectionStart!=n.selectionEnd}catch(t){return!1}}:function(n){try{var t=n.ownerDocument.selection.createRange()}catch(e){}return!(!t||t.parentElement()!=n)&&0!=t.compareEndPoints("StartToEnd",t)},function(){var n=elt("div");return"oncopy"in n||(n.setAttribute("oncopy","return;"),"function"==typeof n.oncopy)}()});
//# sourceMappingURL=../../sourcemaps/primitives/util/feature_detection.js.map
