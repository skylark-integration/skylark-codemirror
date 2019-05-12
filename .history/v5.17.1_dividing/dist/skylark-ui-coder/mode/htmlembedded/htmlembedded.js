/**
 * skylark-ui-coder - The skylark coder widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylarkui/skylark-ui-coder/
 * @license MIT
 */
define(["../../Coder","../htmlmixed/htmlmixed","../../addon/mode/multiplex"],function(e){"use strict";e.defineMode("htmlembedded",function(d,i){return e.multiplexingMode(e.getMode(d,"htmlmixed"),{open:i.open||i.scriptStartRegex||"<%",close:i.close||i.scriptEndRegex||"%>",mode:e.getMode(d,i.scriptingModeSpec)})},"htmlmixed"),e.defineMIME("application/x-ejs",{name:"htmlembedded",scriptingModeSpec:"javascript"}),e.defineMIME("application/x-aspx",{name:"htmlembedded",scriptingModeSpec:"text/x-csharp"}),e.defineMIME("application/x-jsp",{name:"htmlembedded",scriptingModeSpec:"text/x-java"}),e.defineMIME("application/x-erb",{name:"htmlembedded",scriptingModeSpec:"ruby"})});
//# sourceMappingURL=../../sourcemaps/mode/htmlembedded/htmlembedded.js.map
