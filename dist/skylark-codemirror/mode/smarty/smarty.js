/**
 * skylark-codemirror - A version of codemirror 5.45  that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-codemirror/
 * @license MIT
 */
define(["../../CodeMirror"],function(e){"use strict";e.defineMode("smarty",function(t,r){var n,i=r.rightDelimiter||"}",a=r.leftDelimiter||"{",o=r.version||2,l=e.getMode(t,r.baseMode||"null"),u=["debug","extends","function","include","literal"],f={operatorChars:/[+\-*&%=<>!?]/,validIdentifier:/[a-zA-Z0-9_]/,stringChar:/['"]/};function s(e,t){return n=t,e}function d(e,t){return null==t&&(t=e.pos),3===o&&"{"==a&&(t==e.string.length||/\s/.test(e.string.charAt(t)))}function p(e,t){for(var r,o,u=e.string,f=e.pos;;){var s=u.indexOf(a,f);if(f=s+a.length,-1==s||!d(e,s+a.length))break}if(s==e.pos)return e.match(a),e.eat("*")?function(e,t,r){return t.tokenize=r,r(e,t)}(e,t,(r="comment",o="*"+i,function(e,t){for(;!e.eol();){if(e.match(o)){t.tokenize=p;break}e.next()}return r})):(t.depth++,t.tokenize=c,n="startTag","tag");s>-1&&(e.string=u.slice(0,s));var h=l.token(e,t.base);return s>-1&&(e.string=u),h}function c(e,t){if(e.match(i,!0))return 3===o?(t.depth--,t.depth<=0&&(t.tokenize=p)):t.tokenize=p,s("tag",null);if(e.match(a,!0))return t.depth++,s("tag","startTag");var r=e.next();if("$"==r)return e.eatWhile(f.validIdentifier),s("variable-2","variable");if("|"==r)return s("operator","pipe");if("."==r)return s("operator","property");if(f.stringChar.test(r))return t.tokenize=(l=r,function(e,t){for(var r=null,n=null;!e.eol();){if(n=e.peek(),e.next()==l&&"\\"!==r){t.tokenize=c;break}r=n}return"string"}),s("string","string");if(f.operatorChars.test(r))return e.eatWhile(f.operatorChars),s("operator","operator");if("["==r||"]"==r)return s("bracket","bracket");if("("==r||")"==r)return s("bracket","operator");if(/\d/.test(r))return e.eatWhile(/\d/),s("number","number");if("variable"==t.last){if("@"==r)return e.eatWhile(f.validIdentifier),s("property","property");if("|"==r)return e.eatWhile(f.validIdentifier),s("qualifier","modifier")}else{if("pipe"==t.last)return e.eatWhile(f.validIdentifier),s("qualifier","modifier");if("whitespace"==t.last)return e.eatWhile(f.validIdentifier),s("attribute","modifier")}if("property"==t.last)return e.eatWhile(f.validIdentifier),s("property",null);if(/\s/.test(r))return n="whitespace",null;var l,d="";"/"!=r&&(d+=r);for(var h=null;h=e.eat(f.validIdentifier);)d+=h;for(var k=0,g=u.length;k<g;k++)if(u[k]==d)return s("keyword","keyword");return/\s/.test(r)?null:s("tag","tag")}return{startState:function(){return{base:e.startState(l),tokenize:p,last:null,depth:0}},copyState:function(t){return{base:e.copyState(l,t.base),tokenize:t.tokenize,last:t.last,depth:t.depth}},innerMode:function(e){if(e.tokenize==p)return{mode:l,state:e.base}},token:function(e,t){var r=t.tokenize(e,t);return t.last=n,r},indent:function(t,r,n){return t.tokenize==p&&l.indent?l.indent(t.base,r,n):e.Pass},blockCommentStart:a+"*",blockCommentEnd:"*"+i}}),e.defineMIME("text/x-smarty","smarty")});
//# sourceMappingURL=../../sourcemaps/mode/smarty/smarty.js.map