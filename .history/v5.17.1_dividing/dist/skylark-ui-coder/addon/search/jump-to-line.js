/**
 * skylark-ui-coder - The skylark coder widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylarkui/skylark-ui-coder/
 * @license MIT
 */
define(["../../Coder","../dialog/dialog"],function(e){"use strict";function s(e,s,r,n,o){e.openDialog?e.openDialog(s,o,{value:n,selectValueOnOpen:!0}):o(prompt(r,n))}function r(e,s){var r=Number(s);return/^[-+]/.test(s)?e.getCursor().line+r:r-1}var n='Jump to line: <input type="text" style="width: 10em" class="CodeMirror-search-field"/> <span style="color: #888" class="CodeMirror-search-hint">(Use line:column or scroll% syntax)</span>';e.commands.jumpToLine=function(e){var o=e.getCursor();s(e,n,"Jump to line:",o.line+1+":"+o.ch,function(s){if(s){var n;if(n=/^\s*([\+\-]?\d+)\s*\:\s*(\d+)\s*$/.exec(s))e.setCursor(r(e,n[1]),Number(n[2]));else if(n=/^\s*([\+\-]?\d+(\.\d+)?)\%\s*/.exec(s)){var t=Math.round(e.lineCount()*Number(n[1])/100);/^[-+]/.test(n[1])&&(t=o.line+t+1),e.setCursor(t-1,o.ch)}else(n=/^\s*\:?\s*([\+\-]?\d+)\s*/.exec(s))&&e.setCursor(r(e,n[1]),o.ch)}})},e.keyMap["default"]["Alt-G"]="jumpToLine"});
//# sourceMappingURL=../../sourcemaps/addon/search/jump-to-line.js.map
