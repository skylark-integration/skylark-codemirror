/**
 * skylark-codemirror - A version of codemirror 5.45  that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-codemirror/
 * @license MIT
 */
define(["./util/misc"],function(e){"use strict";let t={},n={};function r(t){if("string"==typeof t&&n.hasOwnProperty(t))t=n[t];else if(t&&"string"==typeof t.name&&n.hasOwnProperty(t.name)){let r=n[t.name];"string"==typeof r&&(r={name:r}),(t=e.createObj(r,t)).name=r.name}else{if("string"==typeof t&&/^[\w\-]+\/[\w\-]+\+xml$/.test(t))return r("application/xml");if("string"==typeof t&&/^[\w\-]+\/[\w\-]+\+json$/.test(t))return r("application/json")}return"string"==typeof t?{name:t}:t||{name:"null"}}let o={};return{modes:t,mimeModes:n,defineMode:function(e,n){arguments.length>2&&(n.dependencies=Array.prototype.slice.call(arguments,2)),t[e]=n},defineMIME:function(e,t){n[e]=t},resolveMode:r,getMode:function e(n,i){i=r(i);let a=t[i.name];if(!a)return e(n,"text/plain");let s=a(n,i);if(o.hasOwnProperty(i.name)){let e=o[i.name];for(let t in e)e.hasOwnProperty(t)&&(s.hasOwnProperty(t)&&(s["_"+t]=s[t]),s[t]=e[t])}if(s.name=i.name,i.helperType&&(s.helperType=i.helperType),i.modeProps)for(let e in i.modeProps)s[e]=i.modeProps[e];return s},modeExtensions:o,extendMode:function(t,n){let r=o.hasOwnProperty(t)?o[t]:o[t]={};e.copyObj(n,r)},copyState:function(e,t){if(!0===t)return t;if(e.copyState)return e.copyState(t);let n={};for(let e in t){let r=t[e];r instanceof Array&&(r=r.concat([])),n[e]=r}return n},innerMode:function(e,t){let n;for(;e.innerMode&&(n=e.innerMode(t))&&n.mode!=e;)t=n.state,e=n.mode;return n||{mode:e,state:t}},startState:function(e,t,n){return!e.startState||e.startState(t,n)}}});
//# sourceMappingURL=../sourcemaps/primitives/modes.js.map
