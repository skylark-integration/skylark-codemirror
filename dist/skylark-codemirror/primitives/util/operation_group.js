/**
 * skylark-codemirror - A version of codemirror 5.45  that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-codemirror/
 * @license MIT
 */
define(["./event"],function(l){"use strict";let t=null;let e=null;function n(){let l=e;e=null;for(let t=0;t<l.length;++t)l[t]()}return{pushOperation:function(l){t?t.ops.push(l):l.ownsGroup=t={ops:[l],delayedCallbacks:[]}},finishOperation:function(l,e){let n=l.ownsGroup;if(n)try{!function(l){let t=l.delayedCallbacks,e=0;do{for(;e<t.length;e++)t[e].call(null);for(let t=0;t<l.ops.length;t++){let e=l.ops[t];if(e.cursorActivityHandlers)for(;e.cursorActivityCalled<e.cursorActivityHandlers.length;)e.cursorActivityHandlers[e.cursorActivityCalled++].call(null,e.cm)}}while(e<t.length)}(n)}finally{t=null,e(n)}},signalLater:function(r,i){let o=l.getHandlers(r,i);if(!o.length)return;let s,u=Array.prototype.slice.call(arguments,2);t?s=t.delayedCallbacks:e?s=e:(s=e=[],setTimeout(n,0));for(let l=0;l<o.length;++l)s.push(()=>o[l].apply(null,u))}}});
//# sourceMappingURL=../../sourcemaps/primitives/util/operation_group.js.map
