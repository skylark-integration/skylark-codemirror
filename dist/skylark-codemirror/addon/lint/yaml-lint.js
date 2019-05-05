/**
 * skylark-codemirror - A version of codemirror 5.45  that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-codemirror/
 * @license MIT
 */
define(["../../CodeMirror"],function(r){"use strict";r.registerHelper("lint","yaml",function(o){var n=[];if(!window.jsyaml)return window.console&&window.console.error("Error: window.jsyaml not defined, CodeMirror YAML linting cannot run."),n;try{jsyaml.loadAll(o)}catch(o){var e=o.mark,i=e?r.Pos(e.line,e.column):r.Pos(0,0),s=i;n.push({from:i,to:s,message:o.message})}return n})});
//# sourceMappingURL=../../sourcemaps/addon/lint/yaml-lint.js.map
