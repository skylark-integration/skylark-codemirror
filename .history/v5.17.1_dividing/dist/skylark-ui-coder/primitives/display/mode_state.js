/**
 * skylark-ui-coder - The skylark coder widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylarkui/skylark-ui-coder/
 * @license MIT
 */
define(["../CoderCtor"],function(t){t.partial({loadMode:function(){var t=this;t.doc.mode=CodeMirror.getMode(t.options,t.doc.modeOption),resetModeState(t)},resetModeState:function(){var t=this;t.doc.iter(function(t){t.stateAfter&&(t.stateAfter=null),t.styles&&(t.styles=null)}),t.doc.frontier=t.doc.first,startWorker(t,100),t.state.modeGen++,t.curOp&&t.regChange()}})});
//# sourceMappingURL=../../sourcemaps/primitives/display/mode_state.js.map
