/**
 * skylark-codemirror5 - A version of codemirror 5.17.1  that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-codemirror5/
 * @license MIT
 */
!function(e){"object"==typeof exports&&"object"==typeof module?e(require("../../lib/codemirror"),require("../htmlmixed/htmlmixed"),require("../../addon/mode/multiplex")):"function"==typeof define&&define.amd?define(["../../lib/codemirror","../htmlmixed/htmlmixed","../../addon/mode/multiplex"],e):e(CodeMirror)}(function(e){"use strict";e.defineMode("htmlembedded",function(i,t){var d=t.closeComment||"--%>";return e.multiplexingMode(e.getMode(i,"htmlmixed"),{open:t.openComment||"<%--",close:d,delimStyle:"comment",mode:{token:function(e){return e.skipTo(d)||e.skipToEnd(),"comment"}}},{open:t.open||t.scriptStartRegex||"<%",close:t.close||t.scriptEndRegex||"%>",mode:e.getMode(i,t.scriptingModeSpec)})},"htmlmixed"),e.defineMIME("application/x-ejs",{name:"htmlembedded",scriptingModeSpec:"javascript"}),e.defineMIME("application/x-aspx",{name:"htmlembedded",scriptingModeSpec:"text/x-csharp"}),e.defineMIME("application/x-jsp",{name:"htmlembedded",scriptingModeSpec:"text/x-java"}),e.defineMIME("application/x-erb",{name:"htmlembedded",scriptingModeSpec:"ruby"})});
//# sourceMappingURL=../../sourcemaps/mode/htmlembedded/htmlembedded.js.map
