/**
 * skylark-ui-coder - The skylark coder widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylarkui/skylark-ui-coder/
 * @license MIT
 */
define(["../../Coder"],function(e){"use strict";e.defineMode("pascal",function(){function e(e){for(var t={},n=e.split(" "),r=0;r<n.length;++r)t[n[r]]=!0;return t}function t(e,t){var u=e.next();if("#"==u&&t.startOfLine)return e.skipToEnd(),"meta";if('"'==u||"'"==u)return t.tokenize=n(u),t.tokenize(e,t);if("("==u&&e.eat("*"))return t.tokenize=r,r(e,t);if(/[\[\]{}\(\),;\:\.]/.test(u))return null;if(/\d/.test(u))return e.eatWhile(/[\w\.]/),"number";if("/"==u&&e.eat("/"))return e.skipToEnd(),"comment";if(a.test(u))return e.eatWhile(a),"operator";e.eatWhile(/[\w\$_]/);var l=e.current();return i.propertyIsEnumerable(l)?"keyword":o.propertyIsEnumerable(l)?"atom":"variable"}function n(e){return function(t,n){for(var r,i=!1,o=!1;null!=(r=t.next());){if(r==e&&!i){o=!0;break}i=!i&&"\\"==r}return!o&&i||(n.tokenize=null),"string"}}function r(e,t){for(var n,r=!1;n=e.next();){if(")"==n&&r){t.tokenize=null;break}r="*"==n}return"comment"}var i=e("and array begin case const div do downto else end file for forward integer boolean char function goto if in label mod nil not of or packed procedure program record repeat set string then to type until var while with"),o={"null":!0},a=/[+\-*&%=<>!?|\/]/;return{startState:function(){return{tokenize:null}},token:function(e,n){if(e.eatSpace())return null;var r=(n.tokenize||t)(e,n);return"comment"==r||"meta"==r?r:r},electricChars:"{}"}}),e.defineMIME("text/x-pascal","pascal")});
//# sourceMappingURL=../../sourcemaps/mode/pascal/pascal.js.map
