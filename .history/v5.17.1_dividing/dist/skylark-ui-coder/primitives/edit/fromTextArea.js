/**
 * skylark-ui-coder - The skylark coder widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylarkui/skylark-ui-coder/
 * @license MIT
 */
define(["../CoderCtor"],function(e){CodeMirror.fromTextArea=function(e,t){function o(){e.value=f.getValue()}if(t=t?copyObj(t):{},t.value=e.value,!t.tabindex&&e.tabIndex&&(t.tabindex=e.tabIndex),!t.placeholder&&e.placeholder&&(t.placeholder=e.placeholder),null==t.autofocus){var r=activeElt();t.autofocus=r==e||null!=e.getAttribute("autofocus")&&r==document.body}if(e.form&&(on(e.form,"submit",o),!t.leaveSubmitMethodAlone)){var n=e.form,i=n.submit;try{var u=n.submit=function(){o(),n.submit=i,n.submit(),n.submit=u}}catch(a){}}t.finishInit=function(t){t.save=o,t.getTextArea=function(){return e},t.toTextArea=function(){t.toTextArea=isNaN,o(),e.parentNode.removeChild(t.getWrapperElement()),e.style.display="",e.form&&(off(e.form,"submit",o),"function"==typeof e.form.submit&&(e.form.submit=i))}},e.style.display="none";var f=CodeMirror(function(t){e.parentNode.insertBefore(t,e.nextSibling)},t);return f}});
//# sourceMappingURL=../../sourcemaps/primitives/edit/fromTextArea.js.map
