/**
 * skylark-ui-coder - The skylark coder widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylarkui/skylark-ui-coder/
 * @license MIT
 */
define([],function(){function e(e,t,n,r){var a=document.createElement(e);if(n&&(a.className=n),r&&(a.style.cssText=r),"string"==typeof t)a.appendChild(document.createTextNode(t));else if(t)for(var o=0;o<t.length;++o)a.appendChild(t[o]);return a}function t(e){for(var t=e.childNodes.length;t>0;--t)e.removeChild(e.firstChild);return e}function n(e,n){return t(e).appendChild(n)}function r(e,t){if(3==t.nodeType&&(t=t.parentNode),e.contains)return e.contains(t);do if(11==t.nodeType&&(t=t.host),t==e)return!0;while(t=t.parentNode)}function a(){for(var e=document.activeElement;e&&e.root&&e.root.activeElement;)e=e.root.activeElement;return e}function o(e){return new RegExp("(^|\\s)"+e+"(?:$|\\s)\\s*")}function c(e,t){var n=e.className,r=o(t).exec(n);if(r){var a=n.slice(r.index+r[0].length);e.className=n.slice(0,r.index)+(a?r[1]+a:"")}}function i(e,t){var n=e.className;o(t).test(n)||(e.className+=(n?" ":"")+t)}function s(e,t){for(var n=e.split(" "),r=0;r<n.length;r++)n[r]&&!o(n[r]).test(t)&&(t+=" "+n[r]);return t}var d;return d=document.createRange?function(e,t,n,r){var a=document.createRange();return a.setEnd(r||e,n),a.setStart(e,t),a}:function(e,t,n){var r=document.body.createTextRange();try{r.moveToElementText(e.parentNode)}catch(a){return r}return r.collapse(!0),r.moveEnd("character",n),r.moveStart("character",t),r},ie&&ie_version<11&&(a=function(){try{return document.activeElement}catch(e){return document.body}}),{elt:e,range:d,removeChildren:t,removeChildrenAndAdd:n,contains:r,activeElt:a,rmClass:c,addClass:i,joinClasses:s}});
//# sourceMappingURL=../../sourcemaps/primitives/util/dom.js.map
