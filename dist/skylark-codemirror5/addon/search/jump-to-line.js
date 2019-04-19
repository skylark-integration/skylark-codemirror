/**
 * skylark-codemirror5 - A version of codemirror 5.17.1  that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-codemirror5/
 * @license MIT
 */
!function(e){"object"==typeof exports&&"object"==typeof module?e(require("../../lib/codemirror"),require("../dialog/dialog")):"function"==typeof define&&define.amd?define(["../../lib/codemirror","../dialog/dialog"],e):e(CodeMirror)}(function(e){"use strict";function r(e,r){var o=Number(r);return/^[-+]/.test(r)?e.getCursor().line+o:o-1}e.commands.jumpToLine=function(e){var o=e.getCursor();!function(e,r,o,t,i){e.openDialog?e.openDialog(r,i,{value:t,selectValueOnOpen:!0}):i(prompt(o,t))}(e,function(e){return e.phrase("Jump to line:")+' <input type="text" style="width: 10em" class="CodeMirror-search-field"/> <span style="color: #888" class="CodeMirror-search-hint">'+e.phrase("(Use line:column or scroll% syntax)")+"</span>"}(e),e.phrase("Jump to line:"),o.line+1+":"+o.ch,function(t){var i;if(t)if(i=/^\s*([\+\-]?\d+)\s*\:\s*(\d+)\s*$/.exec(t))e.setCursor(r(e,i[1]),Number(i[2]));else if(i=/^\s*([\+\-]?\d+(\.\d+)?)\%\s*/.exec(t)){var n=Math.round(e.lineCount()*Number(i[1])/100);/^[-+]/.test(i[1])&&(n=o.line+n+1),e.setCursor(n-1,o.ch)}else(i=/^\s*\:?\s*([\+\-]?\d+)\s*/.exec(t))&&e.setCursor(r(e,i[1]),o.ch)})},e.keyMap.default["Alt-G"]="jumpToLine"});
//# sourceMappingURL=../../sourcemaps/addon/search/jump-to-line.js.map
