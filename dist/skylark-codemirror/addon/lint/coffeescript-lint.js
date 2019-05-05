/**
 * skylark-codemirror - A version of codemirror 5.45  that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-codemirror/
 * @license MIT
 */
define(["../../CodeMirror"],function(e){"use strict";e.registerHelper("lint","coffeescript",function(o){var r=[];if(!window.coffeelint)return window.console&&window.console.error("Error: window.coffeelint not defined, CodeMirror CoffeeScript linting cannot run."),r;var n,i;try{for(var t=coffeelint.lint(o),s=0;s<t.length;s++)n=t[s],void 0,i=n.lineNumber,r.push({from:e.Pos(i-1,0),to:e.Pos(i,0),severity:n.level,message:n.message})}catch(o){r.push({from:e.Pos(o.location.first_line,0),to:e.Pos(o.location.last_line,o.location.last_column),severity:"error",message:o.message})}return r})});
//# sourceMappingURL=../../sourcemaps/addon/lint/coffeescript-lint.js.map
