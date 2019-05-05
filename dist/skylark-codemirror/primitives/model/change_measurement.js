/**
 * skylark-codemirror - A version of codemirror 5.45  that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-codemirror/
 * @license MIT
 */
define(["../line/pos","../util/misc","./selection"],function(e,n,t){"use strict";function l(t){return t.text?e.Pos(t.from.line+t.text.length-1,n.lst(t.text).length+(1==t.text.length?t.from.ch:0)):t.to}function r(n,t){if(e.cmp(n,t.from)<0)return n;if(e.cmp(n,t.to)<=0)return l(t);let r=n.line+t.text.length-(t.to.line-t.from.line)-1,o=n.ch;return n.line==t.to.line&&(o+=l(t).ch-t.to.ch),e.Pos(r,o)}function o(n,t,l){return n.line==t.line?e.Pos(l.line,n.ch-t.ch+l.ch):e.Pos(l.line+(n.line-t.line),n.ch)}return{changeEnd:l,computeSelAfterChange:function(e,n){let l=[];for(let o=0;o<e.sel.ranges.length;o++){let i=e.sel.ranges[o];l.push(new t.Range(r(i.anchor,n),r(i.head,n)))}return t.normalizeSelection(e.cm,l,e.sel.primIndex)},computeReplacedSel:function(n,r,i){let c=[],s=e.Pos(n.first,0),h=s;for(let u=0;u<r.length;u++){let f=r[u],a=o(f.from,s,h),m=o(l(f),s,h);if(s=f.to,h=m,"around"==i){let l=n.sel.ranges[u],r=e.cmp(l.head,l.anchor)<0;c[u]=new t.Range(r?m:a,r?a:m)}else c[u]=new t.Range(a,a)}return new t.Selection(c,n.sel.primIndex)}}});
//# sourceMappingURL=../../sourcemaps/primitives/model/change_measurement.js.map
