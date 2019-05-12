/**
 * skylark-ui-coder - The skylark coder widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylarkui/skylark-ui-coder/
 * @license MIT
 */
define(["../util/dom","../CoderCtor"],function(e,t){t.partial({ensureFocus:function(){var e=this;e.state.focused||(e.display.input.focus(),e.onFocus())},delayBlurEvent:function(){var e=this;e.state.delayingBlurEvent=!0,setTimeout(function(){e.state.delayingBlurEvent&&(e.state.delayingBlurEvent=!1,e.onBlur())},100)},onFocus:function(){var t=this;t.state.delayingBlurEvent&&(t.state.delayingBlurEvent=!1),"nocursor"!=t.options.readOnly&&(t.state.focused||(t.signal("focus",t),t.state.focused=!0,e.addClass(t.display.wrapper,"CodeMirror-focused"),t.curOp||t.display.selForContextMenu==t.doc.sel||(t.display.input.reset(),webkit&&setTimeout(function(){t.display.input.reset(!0)},20)),t.display.input.receivedFocus()),t.restartBlink())},onBlur:function(){var t=this;t.state.delayingBlurEvent||(t.state.focused&&(signal(t,"blur",t),t.state.focused=!1,e.rmClass(t.display.wrapper,"CodeMirror-focused")),clearInterval(t.display.blinker),setTimeout(function(){t.state.focused||(t.display.shift=!1)},150))}})});
//# sourceMappingURL=../../sourcemaps/primitives/display/focus.js.map
