/**
 * skylark-codemirror5 - A version of codemirror 5.17.1  that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-codemirror5/
 * @license MIT
 */
define(["./CodeMirror","../util/dom","../util/event","../util/misc"],function(e,t,o,i){"use strict";return{fromTextArea:function(r,l){if((l=l?i.copyObj(l):{}).value=r.value,!l.tabindex&&r.tabIndex&&(l.tabindex=r.tabIndex),!l.placeholder&&r.placeholder&&(l.placeholder=r.placeholder),null==l.autofocus){let e=t.activeElt();l.autofocus=e==r||null!=r.getAttribute("autofocus")&&e==document.body}function u(){r.value=a.getValue()}let n;if(r.form&&(o.on(r.form,"submit",u),!l.leaveSubmitMethodAlone)){let e=r.form;n=e.submit;try{let t=e.submit=(()=>{u(),e.submit=n,e.submit(),e.submit=t})}catch(e){}}l.finishInit=(e=>{e.save=u,e.getTextArea=(()=>r),e.toTextArea=(()=>{e.toTextArea=isNaN,u(),r.parentNode.removeChild(e.getWrapperElement()),r.style.display="",r.form&&(o.off(r.form,"submit",u),"function"==typeof r.form.submit&&(r.form.submit=n))})}),r.style.display="none";let a=e.CodeMirror(e=>r.parentNode.insertBefore(e,r.nextSibling),l);return a}}});
//# sourceMappingURL=../../sourcemaps/lib/edit/fromTextArea.js.map
