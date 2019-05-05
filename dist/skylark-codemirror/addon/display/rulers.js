/**
 * skylark-codemirror - A version of codemirror 5.45  that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-codemirror/
 * @license MIT
 */
define(["../../CodeMirror"],function(e){"use strict";function r(r){r.state.rulerDiv.textContent="";var t=r.getOption("rulers"),l=r.defaultCharWidth(),i=r.charCoords(e.Pos(r.firstLine(),0),"div").left;r.state.rulerDiv.style.minHeight=r.display.scroller.offsetHeight+30+"px";for(var s=0;s<t.length;s++){var a=document.createElement("div");a.className="CodeMirror-ruler";var o,n=t[s];"number"==typeof n?o=n:(o=n.column,n.className&&(a.className+=" "+n.className),n.color&&(a.style.borderColor=n.color),n.lineStyle&&(a.style.borderLeftStyle=n.lineStyle),n.width&&(a.style.borderLeftWidth=n.width)),a.style.left=i+o*l+"px",r.state.rulerDiv.appendChild(a)}}e.defineOption("rulers",!1,function(e,t){e.state.rulerDiv&&(e.state.rulerDiv.parentElement.removeChild(e.state.rulerDiv),e.state.rulerDiv=null,e.off("refresh",r)),t&&t.length&&(e.state.rulerDiv=e.display.lineSpace.parentElement.insertBefore(document.createElement("div"),e.display.lineSpace),e.state.rulerDiv.className="CodeMirror-rulers",r(e),e.on("refresh",r))})});
//# sourceMappingURL=../../sourcemaps/addon/display/rulers.js.map
