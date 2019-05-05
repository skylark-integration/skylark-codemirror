/**
 * skylark-codemirror - A version of codemirror 5.45  that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-codemirror/
 * @license MIT
 */
define(["../../CodeMirror"],function(n){"use strict";n.registerHelper("lint","json",function(r){var o=[];if(!window.jsonlint)return window.console&&window.console.error("Error: window.jsonlint not defined, CodeMirror JSON linting cannot run."),o;var i=window.jsonlint.parser||window.jsonlint;i.parseError=function(r,i){var e=i.loc;o.push({from:n.Pos(e.first_line-1,e.first_column),to:n.Pos(e.last_line-1,e.last_column),message:r})};try{i.parse(r)}catch(n){}return o})});
//# sourceMappingURL=../../sourcemaps/addon/lint/json-lint.js.map
