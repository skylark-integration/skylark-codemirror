/**
 * skylark-codemirror - A version of codemirror 5.45  that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-codemirror/
 * @license MIT
 */
define(["../../CodeMirror","../htmlmixed/htmlmixed","../../addon/mode/multiplex"],function(e){"use strict";e.defineMode("htmlembedded",function(t,d){var i=d.closeComment||"--%>";return e.multiplexingMode(e.getMode(t,"htmlmixed"),{open:d.openComment||"<%--",close:i,delimStyle:"comment",mode:{token:function(e){return e.skipTo(i)||e.skipToEnd(),"comment"}}},{open:d.open||d.scriptStartRegex||"<%",close:d.close||d.scriptEndRegex||"%>",mode:e.getMode(t,d.scriptingModeSpec)})},"htmlmixed"),e.defineMIME("application/x-ejs",{name:"htmlembedded",scriptingModeSpec:"javascript"}),e.defineMIME("application/x-aspx",{name:"htmlembedded",scriptingModeSpec:"text/x-csharp"}),e.defineMIME("application/x-jsp",{name:"htmlembedded",scriptingModeSpec:"text/x-java"}),e.defineMIME("application/x-erb",{name:"htmlembedded",scriptingModeSpec:"ruby"})});
//# sourceMappingURL=../../sourcemaps/mode/htmlembedded/htmlembedded.js.map
