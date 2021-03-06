/**
 * skylark-ui-coder - The skylark coder widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylarkui/skylark-ui-coder/
 * @license MIT
 */
!function(e){"object"==typeof exports&&"object"==typeof module?e(require("../../Coder"),require("../htmlmixed/htmlmixed"),require("../../addon/mode/overlay")):"function"==typeof define&&define.amd?define(["../../Coder","../htmlmixed/htmlmixed","../../addon/mode/overlay"],e):e(CodeMirror)}(function(e){"use strict";e.defineMode("tornado:inner",function(){function e(e,n){e.eatWhile(/[^\{]/);var o=e.next();if("{"==o&&(o=e.eat(/\{|%|#/)))return n.tokenize=t(o),"tag"}function t(t){return"{"==t&&(t="}"),function(o,r){var i=o.next();return i==t&&o.eat("}")?(r.tokenize=e,"tag"):o.match(n)?"keyword":"#"==t?"comment":"string"}}var n=["and","as","assert","autoescape","block","break","class","comment","context","continue","datetime","def","del","elif","else","end","escape","except","exec","extends","false","finally","for","from","global","if","import","in","include","is","json_encode","lambda","length","linkify","load","module","none","not","or","pass","print","put","raise","raw","return","self","set","squeeze","super","true","try","url_escape","while","with","without","xhtml_escape","yield"];return n=new RegExp("^(("+n.join(")|(")+"))\\b"),{startState:function(){return{tokenize:e}},token:function(e,t){return t.tokenize(e,t)}}}),e.defineMode("tornado",function(t){var n=e.getMode(t,"text/html"),o=e.getMode(t,"tornado:inner");return e.overlayMode(n,o)}),e.defineMIME("text/x-tornado","tornado")});
//# sourceMappingURL=../../sourcemaps/mode/tornado/tornado.js.map
