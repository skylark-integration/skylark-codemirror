/**
 * skylark-ui-coder - The skylark coder widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylarkui/skylark-ui-coder/
 * @license MIT
 */
define(["../../Coder"],function(e){"use strict";function r(r){r.state.rulerDiv.textContent="";var t=r.getOption("rulers"),l=r.defaultCharWidth(),i=r.charCoords(e.Pos(r.firstLine(),0),"div").left;r.state.rulerDiv.style.minHeight=r.display.scroller.offsetHeight+30+"px";for(var s=0;s<t.length;s++){var o=document.createElement("div");o.className="CodeMirror-ruler";var a,n=t[s];"number"==typeof n?a=n:(a=n.column,n.className&&(o.className+=" "+n.className),n.color&&(o.style.borderColor=n.color),n.lineStyle&&(o.style.borderLeftStyle=n.lineStyle),n.width&&(o.style.borderLeftWidth=n.width)),o.style.left=i+a*l+"px",r.state.rulerDiv.appendChild(o)}}e.defineOption("rulers",!1,function(e,t){e.state.rulerDiv&&(e.display.lineSpace.removeChild(e.state.rulerDiv),e.state.rulerDiv=null,e.off("refresh",r)),t&&t.length&&(e.state.rulerDiv=e.display.lineSpace.insertBefore(document.createElement("div"),e.display.cursorDiv),e.state.rulerDiv.className="CodeMirror-rulers",r(e),e.on("refresh",r))})});
//# sourceMappingURL=../../sourcemaps/addon/display/rulers.js.map
