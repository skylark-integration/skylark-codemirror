/**
 * skylark-ui-coder - The skylark coder widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylarkui/skylark-ui-coder/
 * @license MIT
 */
define(["../../Coder"],function(e){"use strict";var n="><+-.,[]".split("");e.defineMode("brainfuck",function(){return{startState:function(){return{commentLine:!1,left:0,right:0,commentLoop:!1}},token:function(e,t){if(e.eatSpace())return null;e.sol()&&(t.commentLine=!1);var o=e.next().toString();return n.indexOf(o)===-1?(t.commentLine=!0,e.eol()&&(t.commentLine=!1),"comment"):t.commentLine===!0?(e.eol()&&(t.commentLine=!1),"comment"):"]"===o||"["===o?("["===o?t.left++:t.right++,"bracket"):"+"===o||"-"===o?"keyword":"<"===o||">"===o?"atom":"."===o||","===o?"def":void(e.eol()&&(t.commentLine=!1))}}}),e.defineMIME("text/x-brainfuck","brainfuck")});
//# sourceMappingURL=../../sourcemaps/mode/brainfuck/brainfuck.js.map
