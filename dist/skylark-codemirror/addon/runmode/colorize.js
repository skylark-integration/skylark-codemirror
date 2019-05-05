/**
 * skylark-codemirror - A version of codemirror 5.45  that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-codemirror/
 * @license MIT
 */
!function(e){"object"==typeof exports&&"object"==typeof module?e(require("../../lib/codemirror"),require("./runmode")):"function"==typeof define&&define.amd?define(["../../lib/codemirror","./runmode"],e):e(CodeMirror)}(function(e){"use strict";var o=/^(p|li|div|h\\d|pre|blockquote|td)$/;function r(e,n){if(3==e.nodeType)return n.push(e.nodeValue);for(var t=e.firstChild;t;t=t.nextSibling)r(t,n),o.test(e.nodeType)&&n.push("\n")}e.colorize=function(o,n){o||(o=document.body.getElementsByTagName("pre"));for(var t=0;t<o.length;++t){var i=o[t],d=i.getAttribute("data-lang")||n;if(d){var u=[];r(i,u),i.innerHTML="",e.runMode(u.join(""),d,i),i.className+=" cm-s-default"}}}});
//# sourceMappingURL=../../sourcemaps/addon/runmode/colorize.js.map