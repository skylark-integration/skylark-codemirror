/**
 * skylark-codemirror5 - A version of codemirror 5.17.1  that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-codemirror5/
 * @license MIT
 */
!function(e){"object"==typeof exports&&"object"==typeof module?e(require("../../lib/codemirror"),require("../clike/clike")):"function"==typeof define&&define.amd?define(["../../lib/codemirror","../clike/clike"],e):e(CodeMirror)}(function(e){"use strict";var t="this super static final const abstract class extends external factory implements mixin get native set typedef with enum throw rethrow assert break case continue default in return new deferred async await covariant try catch finally do else for if switch while import library export part of show hide is as".split(" "),n="try catch finally do else for if switch while".split(" "),i="true false null".split(" "),r="void bool num int double dynamic var String".split(" ");function o(e){for(var t={},n=0;n<e.length;++n)t[e[n]]=!0;return t}function a(e){(e.interpolationStack||(e.interpolationStack=[])).push(e.tokenize)}function c(e){return(e.interpolationStack||(e.interpolationStack=[])).pop()}function l(e,t,n,i){var r=!1;if(t.eat(e)){if(!t.eat(e))return"string";r=!0}function o(t,n){for(var o=!1;!t.eol();){if(!i&&!o&&"$"==t.peek())return a(n),n.tokenize=u,"string";var c=t.next();if(c==e&&!o&&(!r||t.match(e+e))){n.tokenize=null;break}o=!i&&!o&&"\\"==c}return"string"}return n.tokenize=o,o(t,n)}function u(e,t){return e.eat("$"),e.eat("{")?t.tokenize=null:t.tokenize=f,null}function f(e,t){return e.eatWhile(/[\w_]/),t.tokenize=c(t),"variable"}e.defineMIME("application/dart",{name:"clike",keywords:o(t),blockKeywords:o(n),builtin:o(r),atoms:o(i),hooks:{"@":function(e){return e.eatWhile(/[\w\$_\.]/),"meta"},"'":function(e,t){return l("'",e,t,!1)},'"':function(e,t){return l('"',e,t,!1)},r:function(e,t){var n=e.peek();return("'"==n||'"'==n)&&l(e.next(),e,t,!0)},"}":function(e,t){return function(e){return e.interpolationStack?e.interpolationStack.length:0}(t)>0&&(t.tokenize=c(t),null)},"/":function(e,t){return!!e.eat("*")&&(t.tokenize=function e(t){return function(n,i){for(var r;r=n.next();){if("*"==r&&n.eat("/")){if(1==t){i.tokenize=null;break}return i.tokenize=e(t-1),i.tokenize(n,i)}if("/"==r&&n.eat("*"))return i.tokenize=e(t+1),i.tokenize(n,i)}return"comment"}}(1),t.tokenize(e,t))}}}),e.registerHelper("hintWords","application/dart",t.concat(i).concat(r)),e.defineMode("dart",function(t){return e.getMode(t,"application/dart")},"clike")});
//# sourceMappingURL=../../sourcemaps/mode/dart/dart.js.map
