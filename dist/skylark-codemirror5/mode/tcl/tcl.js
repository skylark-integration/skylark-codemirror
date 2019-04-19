/**
 * skylark-codemirror5 - A version of codemirror 5.17.1  that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-codemirror5/
 * @license MIT
 */
define(["../../CodeMirror"],function(e){"use strict";e.defineMode("tcl",function(){function e(e){for(var r={},t=e.split(" "),n=0;n<t.length;++n)r[t[n]]=!0;return r}var r=e("Tcl safe after append array auto_execok auto_import auto_load auto_mkindex auto_mkindex_old auto_qualify auto_reset bgerror binary break catch cd close concat continue dde eof encoding error eval exec exit expr fblocked fconfigure fcopy file fileevent filename filename flush for foreach format gets glob global history http if incr info interp join lappend lindex linsert list llength load lrange lreplace lsearch lset lsort memory msgcat namespace open package parray pid pkg::create pkg_mkIndex proc puts pwd re_syntax read regex regexp registry regsub rename resource return scan seek set socket source split string subst switch tcl_endOfWord tcl_findLibrary tcl_startOfNextWord tcl_wordBreakAfter tcl_startOfPreviousWord tcl_wordBreakBefore tcltest tclvars tell time trace unknown unset update uplevel upvar variable vwait"),t=e("if elseif else and not or eq ne in ni for foreach while switch"),n=/[+\-*&%=<>!?^\/\|]/;function a(e,r,t){return r.tokenize=t,t(e,r)}function o(e,f){var c=f.beforeParams;f.beforeParams=!1;var u,s=e.next();if('"'!=s&&"'"!=s||!f.inParams){if(/[\[\]{}\(\),;\.]/.test(s))return"("==s&&c?f.inParams=!0:")"==s&&(f.inParams=!1),null;if(/\d/.test(s))return e.eatWhile(/[\w\.]/),"number";if("#"==s)return e.eat("*")?a(e,f,i):"#"==s&&e.match(/ *\[ *\[/)?a(e,f,l):(e.skipToEnd(),"comment");if('"'==s)return e.skipTo(/"/),"comment";if("$"==s)return e.eatWhile(/[$_a-z0-9A-Z\.{:]/),e.eatWhile(/}/),f.beforeParams=!0,"builtin";if(n.test(s))return e.eatWhile(n),"comment";e.eatWhile(/[\w\$_{}\xa1-\uffff]/);var d=e.current().toLowerCase();return r&&r.propertyIsEnumerable(d)?"keyword":t&&t.propertyIsEnumerable(d)?(f.beforeParams=!0,"keyword"):null}return a(e,f,(u=s,function(e,r){for(var t,n=!1,a=!1;null!=(t=e.next());){if(t==u&&!n){a=!0;break}n=!n&&"\\"==t}return a&&(r.tokenize=o),"string"}))}function i(e,r){for(var t,n=!1;t=e.next();){if("#"==t&&n){r.tokenize=o;break}n="*"==t}return"comment"}function l(e,r){for(var t,n=0;t=e.next();){if("#"==t&&2==n){r.tokenize=o;break}"]"==t?n++:" "!=t&&(n=0)}return"meta"}return{startState:function(){return{tokenize:o,beforeParams:!1,inParams:!1}},token:function(e,r){return e.eatSpace()?null:r.tokenize(e,r)}}}),e.defineMIME("text/x-tcl","tcl")});
//# sourceMappingURL=../../sourcemaps/mode/tcl/tcl.js.map
