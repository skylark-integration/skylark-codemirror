/**
 * skylark-codemirror - A version of codemirror 5.45  that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-codemirror/
 * @license MIT
 */
define(["../modes","./view_tracking"],function(e,t){"use strict";function o(e){e.doc.iter(e=>{e.stateAfter&&(e.stateAfter=null),e.styles&&(e.styles=null)}),e.doc.modeFrontier=e.doc.highlightFrontier=e.doc.first,e.startWorker(e,100),e.state.modeGen++,e.curOp&&t.regChange(e)}return{loadMode:function(t){t.doc.mode=e.getMode(t.options,t.doc.modeOption),o(t)},resetModeState:o}});
//# sourceMappingURL=../../sourcemaps/primitives/display/mode_state.js.map
