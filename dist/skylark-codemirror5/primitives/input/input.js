/**
 * skylark-codemirror5 - A version of codemirror 5.17.1  that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-codemirror5/
 * @license MIT
 */
define(["../display/operations","../display/scrolling","../line/pos","../line/utils_line","../model/changes","../util/browser","../util/dom","../util/misc","../util/operation_group","../util/feature_detection","./indent"],function(e,t,n,i,l,a,s,r,o,c,u){"use strict";let p=null;function d(e,a,s,o,u){let d=e.doc;e.display.shift=!1,o||(o=d.sel);let g=+new Date-200,f="paste"==u||e.state.pasteIncoming>g,m=c.splitLinesAuto(a),x=null;if(f&&o.ranges.length>1)if(p&&p.text.join("\n")==a){if(o.ranges.length%p.text.length==0){x=[];for(let e=0;e<p.text.length;e++)x.push(d.splitLines(p.text[e]))}}else m.length==o.ranges.length&&e.options.pasteLinesPerSelection&&(x=r.map(m,e=>[e]));let b=e.curOp.updateInput;for(let t=o.ranges.length-1;t>=0;t--){let c=o.ranges[t],h=c.from(),b=c.to();c.empty()&&(s&&s>0?h=n.Pos(h.line,h.ch-s):e.state.overwrite&&!f?b=n.Pos(b.line,Math.min(i.getLine(d,b.line).text.length,b.ch+r.lst(m).length)):f&&p&&p.lineWise&&p.text.join("\n")==a&&(h=b=n.Pos(h.line,0)));let I={from:h,to:b,text:x?x[t%x.length]:m,origin:u||(f?"paste":e.state.cutIncoming>g?"cut":"+input")};l.makeChange(e.doc,I),t.signalLater(e,"inputRead",e,I)}a&&!f&&h(e,a),t.ensureCursorVisible(e),e.curOp.updateInput<2&&(e.curOp.updateInput=b),e.curOp.typing=!0,e.state.pasteIncoming=e.state.cutIncoming=-1}function h(e,t){if(!e.options.electricChars||!e.options.smartIndent)return;let n=e.doc.sel;for(let l=n.ranges.length-1;l>=0;l--){let a=n.ranges[l];if(a.head.ch>100||l&&n.ranges[l-1].head.line==a.head.line)continue;let s=e.getModeAt(a.head),r=!1;if(s.electricChars){for(let n=0;n<s.electricChars.length;n++)if(t.indexOf(s.electricChars.charAt(n))>-1){r=u.indentLine(e,a.head.line,"smart");break}}else s.electricInput&&s.electricInput.test(i.getLine(e.doc,a.head.line).text.slice(0,a.head.ch))&&(r=u.indentLine(e,a.head.line,"smart"));r&&l.signalLater(e,"electricInput",e,a.head.line)}}function g(e,t,n,i){e.setAttribute("autocorrect",!!n),e.setAttribute("autocapitalize",!!i),e.setAttribute("spellcheck",!!t)}return{lastCopied:p,setLastCopied:function(e){p=e},applyTextInput:d,handlePaste:function(t,n){let i=t.clipboardData&&t.clipboardData.getData("Text");if(i)return t.preventDefault(),n.isReadOnly()||n.options.disableInput||e.runInOp(n,()=>d(n,i,0,null,"paste")),!0},triggerElectric:h,copyableRanges:function(e){let t=[],i=[];for(let l=0;l<e.doc.sel.ranges.length;l++){let a=e.doc.sel.ranges[l].head.line,s={anchor:n.Pos(a,0),head:n.Pos(a+1,0)};i.push(s),t.push(e.getRange(s.anchor,s.head))}return{text:t,ranges:i}},disableBrowserMagic:g,hiddenTextarea:function(){let e=s.elt("textarea",null,null,"position: absolute; bottom: -1em; padding: 0; width: 1px; height: 1em; outline: none"),t=s.elt("div",[e],null,"overflow: hidden; position: relative; width: 3px; height: 0px;");return a.webkit?e.style.width="1000px":e.setAttribute("wrap","off"),a.ios&&(e.style.border="1px solid black"),g(e),t}}});
//# sourceMappingURL=../../sourcemaps/primitives/input/input.js.map