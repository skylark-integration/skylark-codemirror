/**
 * skylark-codemirror - A version of codemirror 5.45  that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-codemirror/
 * @license MIT
 */
define(["./CodeMirror","../util/dom","../util/event","../util/misc"],function(e,t,o,i){"use strict";return{fromTextArea:function(l,u){if((u=u?i.copyObj(u):{}).value=l.value,!u.tabindex&&l.tabIndex&&(u.tabindex=l.tabIndex),!u.placeholder&&l.placeholder&&(u.placeholder=l.placeholder),null==u.autofocus){let e=t.activeElt();u.autofocus=e==l||null!=l.getAttribute("autofocus")&&e==document.body}function r(){l.value=a.getValue()}let n;if(l.form&&(o.on(l.form,"submit",r),!u.leaveSubmitMethodAlone)){let e=l.form;n=e.submit;try{let t=e.submit=(()=>{r(),e.submit=n,e.submit(),e.submit=t})}catch(e){}}u.finishInit=(e=>{e.save=r,e.getTextArea=(()=>l),e.toTextArea=(()=>{e.toTextArea=isNaN,r(),l.parentNode.removeChild(e.getWrapperElement()),l.style.display="",l.form&&(o.off(l.form,"submit",r),"function"==typeof l.form.submit&&(l.form.submit=n))})}),l.style.display="none";let a=e(e=>l.parentNode.insertBefore(e,l.nextSibling),u);return a}}});
//# sourceMappingURL=../../sourcemaps/primitives/edit/fromTextArea.js.map
