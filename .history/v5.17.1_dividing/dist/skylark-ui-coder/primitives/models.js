/**
 * skylark-ui-coder - The skylark coder widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylarkui/skylark-ui-coder/
 * @license MIT
 */
define(["../CoderCtor"],function(e){var n=e.modes={},t=e.mimeModes={};e.defineMode=function(t,r){e.defaults.mode||"null"==t||(e.defaults.mode=t),arguments.length>2&&(r.dependencies=Array.prototype.slice.call(arguments,2)),n[t]=r},e.defineMIME=function(e,n){t[e]=n},e.resolveMode=function(n){if("string"==typeof n&&t.hasOwnProperty(n))n=t[n];else if(n&&"string"==typeof n.name&&t.hasOwnProperty(n.name)){var r=t[n.name];"string"==typeof r&&(r={name:r}),n=createObj(r,n),n.name=r.name}else if("string"==typeof n&&/^[\w\-]+\/[\w\-]+\+xml$/.test(n))return e.resolveMode("application/xml");return"string"==typeof n?{name:n}:n||{name:"null"}},e.getMode=function(t,o){var o=e.resolveMode(o),a=n[o.name];if(!a)return e.getMode(t,"text/plain");var i=a(t,o);if(r.hasOwnProperty(o.name)){var f=r[o.name];for(var p in f)f.hasOwnProperty(p)&&(i.hasOwnProperty(p)&&(i["_"+p]=i[p]),i[p]=f[p])}if(i.name=o.name,o.helperType&&(i.helperType=o.helperType),o.modeProps)for(var p in o.modeProps)i[p]=o.modeProps[p];return i},e.defineMode("null",function(){return{token:function(e){e.skipToEnd()}}}),e.defineMIME("text/plain","null");var r=e.modeExtensions={};e.extendMode=function(e,n){var t=r.hasOwnProperty(e)?r[e]:r[e]={};copyObj(n,t)},e.defineExtension=function(n,t){e.prototype[n]=t},e.defineDocExtension=function(e,n){Doc.prototype[e]=n},e.defineOption=option;var o=[];e.defineInitHook=function(e){o.push(e)};var a=e.helpers={};e.registerHelper=function(n,t,r){a.hasOwnProperty(n)||(a[n]=e[n]={_global:[]}),a[n][t]=r},e.registerGlobalHelper=function(n,t,r,o){e.registerHelper(n,t,o),a[n]._global.push({pred:r,val:o})};e.copyState=function(e,n){if(n===!0)return n;if(e.copyState)return e.copyState(n);var t={};for(var r in n){var o=n[r];o instanceof Array&&(o=o.concat([])),t[r]=o}return t},e.startState=function(e,n,t){return!e.startState||e.startState(n,t)};e.innerMode=function(e,n){for(;e.innerMode;){var t=e.innerMode(n);if(!t||t.mode==e)break;n=t.state,e=t.mode}return t||{mode:e,state:n}}});
//# sourceMappingURL=../sourcemaps/primitives/models.js.map