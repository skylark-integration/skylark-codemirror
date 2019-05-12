/**
 * skylark-ui-coder - The skylark coder widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylarkui/skylark-ui-coder/
 * @license MIT
 */
define(["../util/dom","../CoderCtor"],function(t,e){e.partial({updateGutters:function(){var e=this,i=e.display.gutters,r=e.options.gutters;t.removeChildren(i);for(var d=0;d<r.length;++d){var l=r[d],a=i.appendChild(t.elt("div",null,"CodeMirror-gutter "+l));"CodeMirror-linenumbers"==l&&(e.display.lineGutter=a,a.style.width=(e.display.lineNumWidth||1)+"px")}i.style.display=d?"":"none",e.updateGutterSpace()},updateGutterSpace:function(){var t=this,e=t.display.gutters.offsetWidth;t.display.sizer.style.marginLeft=e+"px"}})});
//# sourceMappingURL=../../sourcemaps/primitives/display/gutters.js.map
