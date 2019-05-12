/**
 * skylark-ui-coder - The skylark coder widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylarkui/skylark-ui-coder/
 * @license MIT
 */
define(["../../Coder","./runmode"],function(e){"use strict";function n(e,r){if(3==e.nodeType)return r.push(e.nodeValue);for(var o=e.firstChild;o;o=o.nextSibling)n(o,r),t.test(e.nodeType)&&r.push("\n")}var t=/^(p|li|div|h\\d|pre|blockquote|td)$/;e.colorize=function(t,r){t||(t=document.body.getElementsByTagName("pre"));for(var o=0;o<t.length;++o){var i=t[o],d=i.getAttribute("data-lang")||r;if(d){var a=[];n(i,a),i.innerHTML="",e.runMode(a.join(""),d,i),i.className+=" cm-s-default"}}}});
//# sourceMappingURL=../../sourcemaps/addon/runmode/colorize.js.map
