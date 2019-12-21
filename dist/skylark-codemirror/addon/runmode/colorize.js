/**
 * skylark-codemirror - A version of codemirror 5.45  that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-codemirror/
 * @license MIT
 */
define(["../../CodeMirror","./runmode"],function(e){"use strict";var n=/^(p|li|div|h\\d|pre|blockquote|td)$/;function t(e,r){if(3==e.nodeType)return r.push(e.nodeValue);for(var o=e.firstChild;o;o=o.nextSibling)t(o,r),n.test(e.nodeType)&&r.push("\n")}e.colorize=function(n,r){n||(n=document.body.getElementsByTagName("pre"));for(var o=0;o<n.length;++o){var i=n[o],d=i.getAttribute("data-lang")||r;if(d){var a=[];t(i,a),i.innerHTML="",e.runMode(a.join(""),d,i),i.className+=" cm-s-default"}}}});
//# sourceMappingURL=../../sourcemaps/addon/runmode/colorize.js.map
