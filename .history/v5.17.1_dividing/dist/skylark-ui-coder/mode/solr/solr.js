/**
 * skylark-ui-coder - The skylark coder widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylarkui/skylark-ui-coder/
 * @license MIT
 */
define(["../../Coder"],function(e){"use strict";e.defineMode("solr",function(){function e(e){return parseFloat(e,10).toString()===e}function t(e){return function(t,n){for(var r,i=!1;null!=(r=t.next())&&(r!=e||i);)i=!i&&"\\"==r;return i||(n.tokenize=o),"string"}}function n(e){return function(t,n){var r="operator";return"+"==e?r+=" positive":"-"==e?r+=" negative":"|"==e?t.eat(/\|/):"&"==e?t.eat(/\&/):"^"==e&&(r+=" boost"),n.tokenize=o,r}}function r(t){return function(n,r){for(var u=t;(t=n.peek())&&null!=t.match(i);)u+=n.next();return r.tokenize=o,f.test(u)?"operator":e(u)?"number":":"==n.peek()?"field":"string"}}function o(e,f){var a=e.next();return'"'==a?f.tokenize=t(a):u.test(a)?f.tokenize=n(a):i.test(a)&&(f.tokenize=r(a)),f.tokenize!=o?f.tokenize(e,f):null}var i=/[^\s\|\!\+\-\*\?\~\^\&\:\(\)\[\]\{\}\^\"\\]/,u=/[\|\!\+\-\*\?\~\^\&]/,f=/^(OR|AND|NOT|TO)$/i;return{startState:function(){return{tokenize:o}},token:function(e,t){return e.eatSpace()?null:t.tokenize(e,t)}}}),e.defineMIME("text/x-solr","solr")});
//# sourceMappingURL=../../sourcemaps/mode/solr/solr.js.map
