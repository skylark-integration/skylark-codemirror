/**
 * skylark-codemirror5 - A version of codemirror 5.17.1  that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-codemirror5/
 * @license MIT
 */
define(["./CodeMirror","../util/event","../util/misc","./options","./methods","../model/Doc","../input/ContentEditableInput","../input/TextareaInput","../modes","./fromTextArea","./legacy"],function(e,r,o,t,i,n,d,p,u,M,f){"use strict";t.defineOptions(e.CodeMirror),i(e.CodeMirror);let l="iter insert remove copy getEditor constructor".split(" ");for(let r in n.prototype)n.prototype.hasOwnProperty(r)&&o.indexOf(l,r)<0&&(e.CodeMirror.prototype[r]=function(e){return function(){return e.apply(this.doc,arguments)}}(n.prototype[r]));return r.eventMixin(n),e.CodeMirror.inputStyles={textarea:p,contenteditable:d},e.CodeMirror.undefined=function(r){e.CodeMirror.defaults.mode||"null"==r||(e.CodeMirror.defaults.mode=r),u.defineMode.apply(this,arguments)},e.CodeMirror.undefined=u.defineMIME,e.CodeMirror.undefined("null",()=>({token:e=>e.skipToEnd()})),e.CodeMirror.undefined("text/plain","null"),e.CodeMirror.defineExtension=((r,o)=>{e.CodeMirror.prototype[r]=o}),e.CodeMirror.defineDocExtension=((e,r)=>{n.prototype[e]=r}),e.CodeMirror.undefined=M.fromTextArea,f.addLegacyProps(e.CodeMirror),e.CodeMirror.version="5.45.0",{CodeMirror:CodeMirror}});
//# sourceMappingURL=../../sourcemaps/lib/edit/main.js.map
