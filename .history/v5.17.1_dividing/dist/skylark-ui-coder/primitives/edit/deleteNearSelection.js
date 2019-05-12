/**
 * skylark-ui-coder - The skylark coder widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylarkui/skylark-ui-coder/
 * @license MIT
 */
define(["../CoderCtor"],function(e){e.partial({deleteNearSelection:function(e,r){for(var e=this,o=e.doc.sel.ranges,n=[],t=0;t<o.length;t++){for(var f=r(o[t]);n.length&&cmp(f.from,lst(n).to)<=0;){var a=n.pop();if(cmp(a.from,f.from)<0){f.from=a.from;break}}n.push(f)}runInOp(e,function(){for(var r=n.length-1;r>=0;r--)replaceRange(e.doc,"",n[r].from,n[r].to,"+delete");ensureCursorVisible(e)})}})});
//# sourceMappingURL=../../sourcemaps/primitives/edit/deleteNearSelection.js.map
