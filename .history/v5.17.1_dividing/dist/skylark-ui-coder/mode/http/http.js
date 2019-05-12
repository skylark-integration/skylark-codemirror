/**
 * skylark-ui-coder - The skylark coder widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylarkui/skylark-ui-coder/
 * @license MIT
 */
define(["../../Coder"],function(r){"use strict";r.defineMode("http",function(){function r(r,t){return r.skipToEnd(),t.cur=o,"error"}function t(t,e){return t.match(/^HTTP\/\d\.\d/)?(e.cur=n,"keyword"):t.match(/^[A-Z]+/)&&/[ \t]/.test(t.peek())?(e.cur=u,"keyword"):r(t,e)}function n(t,n){var u=t.match(/^\d+/);if(!u)return r(t,n);n.cur=e;var i=Number(u[0]);return i>=100&&i<200?"positive informational":i>=200&&i<300?"positive success":i>=300&&i<400?"positive redirect":i>=400&&i<500?"negative client-error":i>=500&&i<600?"negative server-error":"error"}function e(r,t){return r.skipToEnd(),t.cur=o,null}function u(r,t){return r.eatWhile(/\S/),t.cur=i,"string-2"}function i(t,n){return t.match(/^HTTP\/\d\.\d$/)?(n.cur=o,"keyword"):r(t,n)}function o(r){return r.sol()&&!r.eat(/[ \t]/)?r.match(/^.*?:/)?"atom":(r.skipToEnd(),"error"):(r.skipToEnd(),"string")}function c(r){return r.skipToEnd(),null}return{token:function(r,t){var n=t.cur;return n!=o&&n!=c&&r.eatSpace()?null:n(r,t)},blankLine:function(r){r.cur=c},startState:function(){return{cur:t}}}}),r.defineMIME("message/http","http")});
//# sourceMappingURL=../../sourcemaps/mode/http/http.js.map
