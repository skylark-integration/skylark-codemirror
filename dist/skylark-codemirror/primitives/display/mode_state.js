/**
 * skylark-codemirror - A version of codemirror 5.45  that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-codemirror/
 * @license MIT
 */
define(["../modes","./highlight_worker","./view_tracking"],function(e,t,o){"use strict";function r(e){e.doc.iter(e=>{e.stateAfter&&(e.stateAfter=null),e.styles&&(e.styles=null)}),e.doc.modeFrontier=e.doc.highlightFrontier=e.doc.first,t.startWorker(e,100),e.state.modeGen++,e.curOp&&o.regChange(e)}return{loadMode:function(t){t.doc.mode=e.getMode(t.options,t.doc.modeOption),r(t)},resetModeState:r}});
//# sourceMappingURL=../../sourcemaps/primitives/display/mode_state.js.map
