/**
 * skylark-codemirror - A version of codemirror 5.45  that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-codemirror/
 * @license MIT
 */
define(["./CodeMirror","../util/event","../util/misc","./options","./methods","../model/Doc","../input/ContentEditableInput","../input/TextareaInput","../modes","./fromTextArea","./legacy"],function(e,t,o,n,i,r,d,p,f,l,s){"use strict";n.defineOptions(e),i(e);let u="iter insert remove copy getEditor constructor".split(" ");for(let t in r.prototype)r.prototype.hasOwnProperty(t)&&o.indexOf(u,t)<0&&(e.prototype[t]=function(e){return function(){return e.apply(this.doc,arguments)}}(r.prototype[t]));return t.eventMixin(r),e.inputStyles={textarea:p,contenteditable:d},e.defineMode=function(t){e.defaults.mode||"null"==t||(e.defaults.mode=t),f.defineMode.apply(this,arguments)},e.defineMIME=f.defineMIME,e.defineMode("null",()=>({token:e=>e.skipToEnd()})),e.defineMIME("text/plain","null"),e.defineExtension=((t,o)=>{e.prototype[t]=o}),e.defineDocExtension=((e,t)=>{r.prototype[e]=t}),e.fromTextArea=l.fromTextArea,s.addLegacyProps(e),e.version="5.45.0",{CodeMirror:e}});
//# sourceMappingURL=../../sourcemaps/primitives/edit/main.js.map
