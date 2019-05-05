/**
 * skylark-codemirror - A version of codemirror 5.45  that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-codemirror/
 * @license MIT
 */
define(["../util/misc"],function(e){"use strict";return{getLine:function(e,t){if((t-=e.first)<0||t>=e.size)throw new Error("There is no line "+(t+e.first)+" in the document.");let n=e;for(;!n.lines;)for(let e=0;;++e){let i=n.children[e],r=i.chunkSize();if(t<r){n=i;break}t-=r}return n.lines[t]},getBetween:function(e,t,n){let i=[],r=t.line;return e.iter(t.line,n.line+1,e=>{let l=e.text;r==n.line&&(l=l.slice(0,n.ch)),r==t.line&&(l=l.slice(t.ch)),i.push(l),++r}),i},getLines:function(e,t,n){let i=[];return e.iter(t,n,e=>{i.push(e.text)}),i},updateLineHeight:function(e,t){let n=t-e.height;if(n)for(let t=e;t;t=t.parent)t.height+=n},lineNo:function(t){if(null==t.parent)return null;let n=t.parent,i=e.indexOf(n.lines,t);for(let e=n.parent;e;n=e,e=e.parent)for(let t=0;e.children[t]!=n;++t)i+=e.children[t].chunkSize();return i+n.first},lineAtHeight:function(e,t){let n=e.first;e:do{for(let i=0;i<e.children.length;++i){let r=e.children[i],l=r.height;if(t<l){e=r;continue e}t-=l,n+=r.chunkSize()}return n}while(!e.lines);let i=0;for(;i<e.lines.length;++i){let n=e.lines[i].height;if(t<n)break;t-=n}return n+i},isLine:function(e,t){return t>=e.first&&t<e.first+e.size},lineNumberFor:function(e,t){return String(e.lineNumberFormatter(t+e.firstLineNumber))}}});
//# sourceMappingURL=../../sourcemaps/primitives/line/utils_line.js.map
