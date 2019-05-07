/**
 * skylark-codemirror - A version of codemirror 5.45  that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-codemirror/
 * @license MIT
 */
define(["../../CodeMirror","../htmlmixed/htmlmixed","../../addon/mode/overlay"],function(e){"use strict";e.defineMode("tornado:inner",function(){var e=["and","as","assert","autoescape","block","break","class","comment","context","continue","datetime","def","del","elif","else","end","escape","except","exec","extends","false","finally","for","from","global","if","import","in","include","is","json_encode","lambda","length","linkify","load","module","none","not","or","pass","print","put","raise","raw","return","self","set","squeeze","super","true","try","url_escape","while","with","without","xhtml_escape","yield"];function t(n,o){n.eatWhile(/[^\{]/);var r=n.next();if("{"==r&&(r=n.eat(/\{|%|#/)))return o.tokenize=function(n){"{"==n&&(n="}");return function(o,r){var i=o.next();return i==n&&o.eat("}")?(r.tokenize=t,"tag"):o.match(e)?"keyword":"#"==n?"comment":"string"}}(r),"tag"}return e=new RegExp("^(("+e.join(")|(")+"))\\b"),{startState:function(){return{tokenize:t}},token:function(e,t){return t.tokenize(e,t)}}}),e.defineMode("tornado",function(t){var n=e.getMode(t,"text/html"),o=e.getMode(t,"tornado:inner");return e.overlayMode(n,o)}),e.defineMIME("text/x-tornado","tornado")});
//# sourceMappingURL=../../sourcemaps/mode/tornado/tornado.js.map
