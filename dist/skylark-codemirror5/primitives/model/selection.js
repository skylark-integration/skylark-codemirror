/**
 * skylark-codemirror5 - A version of codemirror 5.17.1  that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-codemirror5/
 * @license MIT
 */
define(["../line/pos","../util/misc"],function(e,t){"use strict";class r{constructor(e,t){this.ranges=e,this.primIndex=t}primary(){return this.ranges[this.primIndex]}equals(t){if(t==this)return!0;if(t.primIndex!=this.primIndex||t.ranges.length!=this.ranges.length)return!1;for(let r=0;r<this.ranges.length;r++){let n=this.ranges[r],s=t.ranges[r];if(!e.equalCursorPos(n.anchor,s.anchor)||!e.equalCursorPos(n.head,s.head))return!1}return!0}deepCopy(){let t=[];for(let r=0;r<this.ranges.length;r++)t[r]=new n(e.copyPos(this.ranges[r].anchor),e.copyPos(this.ranges[r].head));return new r(t,this.primIndex)}somethingSelected(){for(let e=0;e<this.ranges.length;e++)if(!this.ranges[e].empty())return!0;return!1}contains(t,r){r||(r=t);for(let n=0;n<this.ranges.length;n++){let s=this.ranges[n];if(e.cmp(r,s.from())>=0&&e.cmp(t,s.to())<=0)return n}return-1}}class n{constructor(e,t){this.anchor=e,this.head=t}from(){return e.minPos(this.anchor,this.head)}to(){return e.maxPos(this.anchor,this.head)}empty(){return this.head.line==this.anchor.line&&this.head.ch==this.anchor.ch}}return{Selection:r,Range:n,normalizeSelection:function(s,i,o){let h=s&&s.options.selectionsMayTouch,a=i[o];i.sort((e,t)=>e.cmp(e.from(),t.from())),o=t.indexOf(i,a);for(let t=1;t<i.length;t++){let r=i[t],s=i[t-1],a=e.cmp(s.to(),r.from());if(h&&!r.empty()?a>0:a>=0){let h=e.minPos(s.from(),r.from()),a=e.maxPos(s.to(),r.to()),c=s.empty()?r.from()==r.head:s.from()==s.head;t<=o&&--o,i.splice(--t,2,new n(c?a:h,c?h:a))}}return new r(i,o)},simpleSelection:function(e,t){return new r([new n(e,t||e)],0)}}});
//# sourceMappingURL=../../sourcemaps/primitives/model/selection.js.map