/**
 * skylark-codemirror - A version of codemirror 5.45  that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-codemirror/
 * @license MIT
 */
define(["./utils_line"],function(n){"use strict";function t(n,i,e=null){if(!(this instanceof t))return new t(n,i,e);this.line=n,this.ch=i,this.sticky=e}function i(n,t){return n.line-t.line||n.ch-t.ch}function e(i,e){if(e.line<i.first)return t(i.first,0);let r=i.first+i.size-1;return e.line>r?t(r,n.getLine(i,r).text.length):function(n,i){let e=n.ch;return null==e||e>i?t(n.line,i):e<0?t(n.line,0):n}(e,n.getLine(i,e.line).text.length)}return{Pos:t,cmp:i,equalCursorPos:function(n,t){return n.sticky==t.sticky&&0==i(n,t)},copyPos:function(n){return t(n.line,n.ch)},maxPos:function(n,t){return i(n,t)<0?t:n},minPos:function(n,t){return i(n,t)<0?n:t},clipLine:function(n,t){return Math.max(n.first,Math.min(t,n.first+n.size-1))},clipPos:e,clipPosArray:function(n,t){let i=[];for(let r=0;r<t.length;r++)i[r]=e(n,t[r]);return i}}});
//# sourceMappingURL=../../sourcemaps/primitives/line/pos.js.map
