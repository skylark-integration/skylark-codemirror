/**
 * skylark-codemirror - A version of codemirror 5.45  that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-codemirror/
 * @license MIT
 */
define(["./selection","../util/browser","../util/dom","../util/event"],function(e,t,s,n){"use strict";function i(i,u){i.state.delayingBlurEvent&&(i.state.delayingBlurEvent=!1),"nocursor"!=i.options.readOnly&&(i.state.focused||(n.signal(i,"focus",i,u),i.state.focused=!0,s.addClass(i.display.wrapper,"CodeMirror-focused"),i.curOp||i.display.selForContextMenu==i.doc.sel||(i.display.input.reset(),t.webkit&&setTimeout(()=>i.display.input.reset(!0),20)),i.display.input.receivedFocus()),e.restartBlink(i))}function u(e,t){e.state.delayingBlurEvent||(e.state.focused&&(n.signal(e,"blur",e,t),e.state.focused=!1,s.rmClass(e.display.wrapper,"CodeMirror-focused")),clearInterval(e.display.blinker),setTimeout(()=>{e.state.focused||(e.display.shift=!1)},150))}return{ensureFocus:function(e){e.state.focused||(e.display.input.focus(),i(e))},delayBlurEvent:function(e){e.state.delayingBlurEvent=!0,setTimeout(()=>{e.state.delayingBlurEvent&&(e.state.delayingBlurEvent=!1,u(e))},100)},onFocus:i,onBlur:u}});
//# sourceMappingURL=../../sourcemaps/primitives/display/focus.js.map
