/**
 * skylark-ui-coder - The skylark coder widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylarkui/skylark-ui-coder/
 * @license MIT
 */
define(["../CoderCtor"],function(t){t.partial({indentLine:function(t,e,n){var a,r=this,i=r.doc;null==e&&(e="add"),"smart"==e&&(i.mode.indent?a=getStateBefore(r,t):e="prev");var o=r.options.tabSize,l=getLine(i,t),s=countColumn(l.text,null,o);l.stateAfter&&(l.stateAfter=null);var f,d=l.text.match(/^\s*/)[0];if(n||/\S/.test(l.text)){if("smart"==e&&(f=i.mode.indent(a,l.text.slice(d.length),l.text),f==Pass||f>150)){if(!n)return;e="prev"}}else f=0,e="not";"prev"==e?f=t>i.first?countColumn(getLine(i,t-1).text,null,o):0:"add"==e?f=s+r.options.indentUnit:"subtract"==e?f=s-r.options.indentUnit:"number"==typeof e&&(f=s+e),f=Math.max(0,f);var u="",c=0;if(r.options.indentWithTabs)for(var h=Math.floor(f/o);h;--h)c+=o,u+="\t";if(c<f&&(u+=spaceStr(f-c)),u!=d)return replaceRange(i,u,Pos(t,0),Pos(t,d.length),"+input"),l.stateAfter=null,!0;for(var h=0;h<i.sel.ranges.length;h++){var p=i.sel.ranges[h];if(p.head.line==t&&p.head.ch<d.length){var c=Pos(t,d.length);replaceOneSelection(i,h,new Range(c,c));break}}}})});
//# sourceMappingURL=../../sourcemaps/primitives/input/indent.js.map
