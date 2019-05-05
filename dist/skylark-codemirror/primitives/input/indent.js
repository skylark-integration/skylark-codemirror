/**
 * skylark-codemirror - A version of codemirror 5.45  that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-codemirror/
 * @license MIT
 */
define(["../line/highlight","../line/pos","../line/utils_line","../model/changes","../model/selection","../model/selection_updates","../util/misc"],function(e,t,n,l,i,s,o){"use strict";return{indentLine:function(a,r,u,d){let c,f=a.doc;null==u&&(u="add"),"smart"==u&&(f.mode.indent?c=e.getContextBefore(a,r).state:u="prev");let h=a.options.tabSize,g=n.getLine(f,r),p=o.countColumn(g.text,null,h);g.stateAfter&&(g.stateAfter=null);let m,x=g.text.match(/^\s*/)[0];if(d||/\S/.test(g.text)){if("smart"==u&&((m=f.mode.indent(c,g.text.slice(x.length),g.text))==o.Pass||m>150)){if(!d)return;u="prev"}}else m=0,u="not";"prev"==u?m=r>f.first?o.countColumn(n.getLine(f,r-1).text,null,h):0:"add"==u?m=p+a.options.indentUnit:"subtract"==u?m=p-a.options.indentUnit:"number"==typeof u&&(m=p+u),m=Math.max(0,m);let b="",P=0;if(a.options.indentWithTabs)for(let e=Math.floor(m/h);e;--e)P+=h,b+="\t";if(P<m&&(b+=o.spaceStr(m-P)),b!=x)return l.replaceRange(f,b,t.Pos(r,0),t.Pos(r,x.length),"+input"),g.stateAfter=null,!0;for(let e=0;e<f.sel.ranges.length;e++){let n=f.sel.ranges[e];if(n.head.line==r&&n.head.ch<x.length){let n=t.Pos(r,x.length);s.replaceOneSelection(f,e,new i.Range(n,n));break}}}}});
//# sourceMappingURL=../../sourcemaps/primitives/input/indent.js.map
