/**
 * skylark-codemirror - A version of codemirror 5.45  that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-codemirror/
 * @license MIT
 */
define(["./CodeMirror","../util/event","../util/misc","./options","./methods","../model/Doc","../input/ContentEditableInput","../input/TextareaInput","../modes","./fromTextArea","./legacy"],function(e,r,o,t,i,n,d,p,M,f,l){"use strict";t.defineOptions(e.CodeMirror),i(e.CodeMirror);let s="iter insert remove copy getEditor constructor".split(" ");for(let r in n.prototype)n.prototype.hasOwnProperty(r)&&o.indexOf(s,r)<0&&(e.CodeMirror.prototype[r]=function(e){return function(){return e.apply(this.doc,arguments)}}(n.prototype[r]));return r.eventMixin(n),e.CodeMirror.inputStyles={textarea:p,contenteditable:d},e.CodeMirror.defineMode=function(r){e.CodeMirror.defaults.mode||"null"==r||(e.CodeMirror.defaults.mode=r),M.defineMode.apply(this,arguments)},e.CodeMirror.defineMIME=M.defineMIME,e.CodeMirror.defineMode("null",()=>({token:e=>e.skipToEnd()})),e.CodeMirror.defineMIME("text/plain","null"),e.CodeMirror.defineExtension=((r,o)=>{e.CodeMirror.prototype[r]=o}),e.CodeMirror.defineDocExtension=((e,r)=>{n.prototype[e]=r}),e.CodeMirror.fromTextArea=f.fromTextArea,l.addLegacyProps(e.CodeMirror),e.CodeMirror.version="5.45.0",{CodeMirror:CodeMirror}});
//# sourceMappingURL=../../sourcemaps/primitives/edit/main.js.map
