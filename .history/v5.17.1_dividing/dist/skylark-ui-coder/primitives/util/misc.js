/**
 * skylark-ui-coder - The skylark coder widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylarkui/skylark-ui-coder/
 * @license MIT
 */
define(["../CoderCtor"],function(t){function r(){this.id=null}CodeMirror.Pass={toString:function(){return"CodeMirror.Pass"}};r.prototype.set=function(t,r){clearTimeout(this.id),this.id=setTimeout(r,t)};var e=(CodeMirror.countColumn=function(t,r,e,n,u){null==r&&(r=t.search(/[^\s\u00a0]/),r==-1&&(r=t.length));for(var o=n||0,i=u||0;;){var f=t.indexOf("\t",o);if(f<0||f>=r)return i+(r-o);i+=f-o,i+=e-i%e,o=f+1}},CodeMirror.findColumn=function(t,r,e){for(var n=0,u=0;;){var o=t.indexOf("\t",n);o==-1&&(o=t.length);var i=o-n;if(o==t.length||u+i>=r)return n+Math.min(i,r-u);if(u+=o-n,u+=e-u%e,n=o+1,u>=r)return n}},function(t){t.select()});ios?e=function(t){t.selectionStart=0,t.selectionEnd=t.value.length}:ie&&(e=function(t){try{t.select()}catch(r){}});var n=/[\u00df\u0587\u0590-\u05f4\u0600-\u06ff\u3040-\u309f\u30a0-\u30ff\u3400-\u4db5\u4e00-\u9fcc\uac00-\ud7af]/;CodeMirror.isWordChar=function(t){return/\w/.test(t)||t>""&&(t.toUpperCase()!=t.toLowerCase()||n.test(t))}});
//# sourceMappingURL=../../sourcemaps/primitives/util/misc.js.map
