/**
 * skylark-codemirror - A version of codemirror 5.45  that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-codemirror/
 * @license MIT
 */
define(["../display/focus","../util/event"],function(e,t){"use strict";function n(e){if(!document.getElementsByClassName)return;let t=document.getElementsByClassName("CodeMirror"),n=[];for(let e=0;e<t.length;e++){let l=t[e].CodeMirror;l&&n.push(l)}n.length&&n[0].operation(()=>{for(let t=0;t<n.length;t++)e(n[t])})}let l=!1;function o(e){let t=e.display;t.cachedCharWidth=t.cachedTextHeight=t.cachedPaddingH=null,t.scrollbarsClipped=!1,e.setSize()}return{ensureGlobalHandlers:function(){l||(function(){let l;t.on(window,"resize",()=>{null==l&&(l=setTimeout(()=>{l=null,n(o)},100))}),t.on(window,"blur",()=>n(e.onBlur))}(),l=!0)}}});
//# sourceMappingURL=../../sourcemaps/primitives/edit/global_events.js.map
