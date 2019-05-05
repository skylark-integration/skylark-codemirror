/**
 * skylark-codemirror - A version of codemirror 5.45  that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-codemirror/
 * @license MIT
 */
!function(e){"object"==typeof exports&&"object"==typeof module?e(require("../../lib/codemirror")):"function"==typeof define&&define.amd?define(["../../lib/codemirror"],e):e(CodeMirror)}(function(e){"use strict";function t(e){for(var t={},n=0;n<e.length;n++)t[e[n]]=!0;return t}var n=t(["_","var","let","class","enum","extension","import","protocol","struct","func","typealias","associatedtype","open","public","internal","fileprivate","private","deinit","init","new","override","self","subscript","super","convenience","dynamic","final","indirect","lazy","required","static","unowned","unowned(safe)","unowned(unsafe)","weak","as","is","break","case","continue","default","else","fallthrough","for","guard","if","in","repeat","switch","where","while","defer","return","inout","mutating","nonmutating","catch","do","rethrows","throw","throws","try","didSet","get","set","willSet","assignment","associativity","infix","left","none","operator","postfix","precedence","precedencegroup","prefix","right","Any","AnyObject","Type","dynamicType","Self","Protocol","__COLUMN__","__FILE__","__FUNCTION__","__LINE__"]),r=t(["var","let","class","enum","extension","import","protocol","struct","func","typealias","associatedtype","for"]),i=t(["true","false","nil","self","super","_"]),o=t(["Array","Bool","Character","Dictionary","Double","Float","Int","Int8","Int16","Int32","Int64","Never","Optional","Set","String","UInt8","UInt16","UInt32","UInt64","Void"]),a="+-/*%=|&<>~^?!",u=":;,.(){}[]",c=/^\-?0b[01][01_]*/,f=/^\-?0o[0-7][0-7_]*/,d=/^\-?0x[\dA-Fa-f][\dA-Fa-f_]*(?:(?:\.[\dA-Fa-f][\dA-Fa-f_]*)?[Pp]\-?\d[\d_]*)?/,l=/^\-?\d[\d_]*(?:\.\d[\d_]*)?(?:[Ee]\-?\d[\d_]*)?/,s=/^\$\d+|(`?)[_A-Za-z][_A-Za-z$0-9]*\1/,p=/^\.(?:\$\d+|(`?)[_A-Za-z][_A-Za-z$0-9]*\1)/,m=/^\#[A-Za-z]+/,h=/^@(?:\$\d+|(`?)[_A-Za-z][_A-Za-z$0-9]*\1)/;function v(e,t,v){if(e.sol()&&(t.indented=e.indentation()),e.eatSpace())return null;var y,k,b=e.peek();if("/"==b){if(e.match("//"))return e.skipToEnd(),"comment";if(e.match("/*"))return t.tokenize.push(x),x(e,t)}if(e.match(m))return"builtin";if(e.match(h))return"attribute";if(e.match(c))return"number";if(e.match(f))return"number";if(e.match(d))return"number";if(e.match(l))return"number";if(e.match(p))return"property";if(a.indexOf(b)>-1)return e.next(),"operator";if(u.indexOf(b)>-1)return e.next(),e.match(".."),"punctuation";if(b=e.match(/("{3}|"|')/)){var w=(y=b[0],k=1==y.length,function(e,t){for(var n,r=!1;n=e.next();)if(r){if("("==n)return t.tokenize.push(_()),"string";r=!1}else{if(e.match(y))return t.tokenize.pop(),"string";r="\\"==n}return k&&t.tokenize.pop(),"string"});return t.tokenize.push(w),w(e,t)}if(e.match(s)){var z=e.current();return o.hasOwnProperty(z)?"variable-2":i.hasOwnProperty(z)?"atom":n.hasOwnProperty(z)?(r.hasOwnProperty(z)&&(t.prev="define"),"keyword"):"define"==v?"def":"variable"}return e.next(),null}function _(){var e=0;return function(t,n,r){var i=v(t,n,r);if("punctuation"==i)if("("==t.current())++e;else if(")"==t.current()){if(0==e)return t.backUp(1),n.tokenize.pop(),n.tokenize[n.tokenize.length-1](t,n);--e}return i}}function x(e,t){for(var n;e.match(/^[^/*]+/,!0),n=e.next();)"/"===n&&e.eat("*")?t.tokenize.push(x):"*"===n&&e.eat("/")&&t.tokenize.pop();return"comment"}e.defineMode("swift",function(e){return{startState:function(){return{prev:null,context:null,indented:0,tokenize:[]}},token:function(e,t){var n=t.prev;t.prev=null;var r=(t.tokenize[t.tokenize.length-1]||v)(e,t,n);if(r&&"comment"!=r?t.prev||(t.prev=r):t.prev=n,"punctuation"==r){var i=/[\(\[\{]|([\]\)\}])/.exec(e.current());i&&(i[1]?function(e){e.context&&(e.indented=e.context.indented,e.context=e.context.prev)}:function(e,t){var n=t.match(/^\s*($|\/[\/\*])/,!1)?null:t.column()+1;e.context=new function(e,t,n){this.prev=e,this.align=t,this.indented=n}(e.context,n,e.indented)})(t,e)}return r},indent:function(t,n){var r=t.context;if(!r)return 0;var i=/^[\]\}\)]/.test(n);return null!=r.align?r.align-(i?1:0):r.indented+(i?0:e.indentUnit)},electricInput:/^\s*[\)\}\]]$/,lineComment:"//",blockCommentStart:"/*",blockCommentEnd:"*/",fold:"brace",closeBrackets:"()[]{}''\"\"``"}}),e.defineMIME("text/x-swift","swift")});
//# sourceMappingURL=../../sourcemaps/mode/swift/swift.js.map