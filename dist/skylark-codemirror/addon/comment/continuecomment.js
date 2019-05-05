/**
 * skylark-codemirror - A version of codemirror 5.45  that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-codemirror/
 * @license MIT
 */
define(["../../CodeMirror"],function(e){function n(n){if(n.getOption("disableInput"))return e.Pass;for(var o,i=n.listSelections(),l=[],m=0;m<i.length;m++){var r=i[m].head;if(!/\bcomment\b/.test(n.getTokenTypeAt(r)))return e.Pass;var c=n.getModeAt(r);if(o){if(o!=c)return e.Pass}else o=c;var s=null;if(o.blockCommentStart&&o.blockCommentContinue){var f,a,u=(f=n.getLine(r.line).slice(0,r.ch)).lastIndexOf(o.blockCommentEnd);if(-1!=u&&u==r.ch-o.blockCommentEnd.length);else if((a=f.lastIndexOf(o.blockCommentStart))>-1&&a>u){if(s=f.slice(0,a),/\S/.test(s)){s="";for(var C=0;C<a;++C)s+=" "}}else(a=f.indexOf(o.blockCommentContinue))>-1&&!/\S/.test(f.slice(0,a))&&(s=f.slice(0,a));null!=s&&(s+=o.blockCommentContinue)}if(null==s&&o.lineComment&&t(n))(a=(f=n.getLine(r.line)).indexOf(o.lineComment))>-1&&(s=f.slice(0,a),/\S/.test(s)?s=null:s+=o.lineComment+f.slice(a+o.lineComment.length).match(/^\s*/)[0]);if(null==s)return e.Pass;l[m]="\n"+s}n.operation(function(){for(var e=i.length-1;e>=0;e--)n.replaceRange(l[e],i[e].from(),i[e].to(),"+insert")})}function t(e){var n=e.getOption("continueComments");return!n||"object"!=typeof n||!1!==n.continueLineComment}e.defineOption("continueComments",null,function(t,o,i){if(i&&i!=e.Init&&t.removeKeyMap("continueComment"),o){var l="Enter";"string"==typeof o?l=o:"object"==typeof o&&o.key&&(l=o.key);var m={name:"continueComment"};m[l]=n,t.addKeyMap(m)}})});
//# sourceMappingURL=../../sourcemaps/addon/comment/continuecomment.js.map
