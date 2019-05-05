/**
 * skylark-codemirror - A version of codemirror 5.45  that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-codemirror/
 * @license MIT
 */
define(["../../CodeMirror"],function(e){"use strict";e.defineMode("solr",function(){var e=/[^\s\|\!\+\-\*\?\~\^\&\:\(\)\[\]\{\}\"\\]/,t=/[\|\!\+\-\*\?\~\^\&]/,n=/^(OR|AND|NOT|TO)$/i;function r(t){return function(r,i){for(var u=t;(t=r.peek())&&null!=t.match(e);)u+=r.next();return i.tokenize=o,n.test(u)?"operator":function(e){return parseFloat(e).toString()===e}(u)?"number":":"==r.peek()?"field":"string"}}function o(n,i){var u,a,f=n.next();return'"'==f?i.tokenize=(a=f,function(e,t){for(var n,r=!1;null!=(n=e.next())&&(n!=a||r);)r=!r&&"\\"==n;return r||(t.tokenize=o),"string"}):t.test(f)?i.tokenize=(u=f,function(e,t){var n="operator";return"+"==u?n+=" positive":"-"==u?n+=" negative":"|"==u?e.eat(/\|/):"&"==u?e.eat(/\&/):"^"==u&&(n+=" boost"),t.tokenize=o,n}):e.test(f)&&(i.tokenize=r(f)),i.tokenize!=o?i.tokenize(n,i):null}return{startState:function(){return{tokenize:o}},token:function(e,t){return e.eatSpace()?null:t.tokenize(e,t)}}}),e.defineMIME("text/x-solr","solr")});
//# sourceMappingURL=../../sourcemaps/mode/solr/solr.js.map
