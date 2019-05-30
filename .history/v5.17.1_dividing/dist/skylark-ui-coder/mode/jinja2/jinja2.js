/**
 * skylark-ui-coder - The skylark coder widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylarkui/skylark-ui-coder/
 * @license MIT
 */
define(["../../Coder"],function(e){"use strict";e.defineMode("jinja2",function(){function e(e,o){var c=e.peek();if(o.incomment)return e.skipTo("#}")?(e.eatWhile(/\#|}/),o.incomment=!1):e.skipToEnd(),"comment";if(o.intag){if(o.operator){if(o.operator=!1,e.match(r))return"atom";if(e.match(a))return"number"}if(o.sign){if(o.sign=!1,e.match(r))return"atom";if(e.match(a))return"number"}if(o.instring)return c==o.instring&&(o.instring=!1),e.next(),"string";if("'"==c||'"'==c)return o.instring=c,e.next(),"string";if(e.match(o.intag+"}")||e.eat("-")&&e.match(o.intag+"}"))return o.intag=!1,"tag";if(e.match(t))return o.operator=!0,"operator";if(e.match(i))o.sign=!0;else if(e.eat(" ")||e.sol()){if(e.match(n))return"keyword";if(e.match(r))return"atom";if(e.match(a))return"number";e.sol()&&e.next()}else e.next();return"variable"}if(e.eat("{")){if(c=e.eat("#"))return o.incomment=!0,e.skipTo("#}")?(e.eatWhile(/\#|}/),o.incomment=!1):e.skipToEnd(),"comment";if(c=e.eat(/\{|%/))return o.intag=c,"{"==c&&(o.intag="}"),e.eat("-"),"tag"}e.next()}var n=["and","as","block","endblock","by","cycle","debug","else","elif","extends","filter","endfilter","firstof","for","endfor","if","endif","ifchanged","endifchanged","ifequal","endifequal","ifnotequal","endifnotequal","in","include","load","not","now","or","parsed","regroup","reversed","spaceless","endspaceless","ssi","templatetag","openblock","closeblock","openvariable","closevariable","openbrace","closebrace","opencomment","closecomment","widthratio","url","with","endwith","get_current_language","trans","endtrans","noop","blocktrans","endblocktrans","get_available_languages","get_current_language_bidi","plural"],t=/^[+\-*&%=<>!?|~^]/,i=/^[:\[\(\{]/,r=["true","false"],a=/^(\d[+\-\*\/])?\d+(\.\d+)?/;return n=new RegExp("(("+n.join(")|(")+"))\\b"),r=new RegExp("(("+r.join(")|(")+"))\\b"),{startState:function(){return{tokenize:e}},token:function(e,n){return n.tokenize(e,n)}}})});
//# sourceMappingURL=../../sourcemaps/mode/jinja2/jinja2.js.map