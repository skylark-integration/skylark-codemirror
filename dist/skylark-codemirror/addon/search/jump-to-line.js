/**
 * skylark-codemirror - A version of codemirror 5.45  that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-codemirror/
 * @license MIT
 */
define(["../../CodeMirror","../dialog/dialog"],function(e){"use strict";function r(e,r){var s=Number(r);return/^[-+]/.test(r)?e.getCursor().line+s:s-1}e.commands.jumpToLine=function(e){var s=e.getCursor();!function(e,r,s,n,o){e.openDialog?e.openDialog(r,o,{value:n,selectValueOnOpen:!0}):o(prompt(s,n))}(e,function(e){return e.phrase("Jump to line:")+' <input type="text" style="width: 10em" class="CodeMirror-search-field"/> <span style="color: #888" class="CodeMirror-search-hint">'+e.phrase("(Use line:column or scroll% syntax)")+"</span>"}(e),e.phrase("Jump to line:"),s.line+1+":"+s.ch,function(n){var o;if(n)if(o=/^\s*([\+\-]?\d+)\s*\:\s*(\d+)\s*$/.exec(n))e.setCursor(r(e,o[1]),Number(o[2]));else if(o=/^\s*([\+\-]?\d+(\.\d+)?)\%\s*/.exec(n)){var t=Math.round(e.lineCount()*Number(o[1])/100);/^[-+]/.test(o[1])&&(t=s.line+t+1),e.setCursor(t-1,s.ch)}else(o=/^\s*\:?\s*([\+\-]?\d+)\s*/.exec(n))&&e.setCursor(r(e,o[1]),s.ch)})},e.keyMap.default["Alt-G"]="jumpToLine"});
//# sourceMappingURL=../../sourcemaps/addon/search/jump-to-line.js.map
