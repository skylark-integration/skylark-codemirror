/**
 * skylark-codemirror - A version of codemirror 5.45  that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-codemirror/
 * @license MIT
 */
define(["../display/operations","../display/scrolling","../line/pos","../model/changes","../util/misc"],function(e,o,l,r,t){"use strict";return{deleteNearSelection:function(n,s){let i=n.doc.sel.ranges,f=[];for(let e=0;e<i.length;e++){let o=s(i[e]);for(;f.length&&l.cmp(o.from,t.lst(f).to)<=0;){let e=f.pop();if(l.cmp(e.from,o.from)<0){o.from=e.from;break}}f.push(o)}e.runInOp(n,()=>{for(let e=f.length-1;e>=0;e--)r.replaceRange(n.doc,"",f[e].from,f[e].to,"+delete");o.ensureCursorVisible(n)})}}});
//# sourceMappingURL=../../sourcemaps/primitives/edit/deleteNearSelection.js.map
