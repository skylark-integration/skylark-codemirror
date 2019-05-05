/**
 * skylark-codemirror - A version of codemirror 5.45  that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-codemirror/
 * @license MIT
 */
define(["../util/dom","../util/misc","./update_display"],function(e,t,r){"use strict";return{updateGutters:function(t){let i=t.display.gutters,u=t.options.gutters;e.removeChildren(i);let s=0;for(;s<u.length;++s){let r=u[s],l=i.appendChild(e.elt("div",null,"CodeMirror-gutter "+r));"CodeMirror-linenumbers"==r&&(t.display.lineGutter=l,l.style.width=(t.display.lineNumWidth||1)+"px")}i.style.display=s?"":"none",r.updateGutterSpace(t)},setGuttersForLineNumbers:function(e){let r=t.indexOf(e.gutters,"CodeMirror-linenumbers");-1==r&&e.lineNumbers?e.gutters=e.gutters.concat(["CodeMirror-linenumbers"]):r>-1&&!e.lineNumbers&&(e.gutters=e.gutters.slice(0),e.gutters.splice(r,1))}}});
//# sourceMappingURL=../../sourcemaps/primitives/display/gutters.js.map
