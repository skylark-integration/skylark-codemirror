/**
 * skylark-ui-coder - The skylark coder widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylarkui/skylark-ui-coder/
 * @license MIT
 */
define(["../../Coder"],function(e){"use strict";e.registerHelper("lint","yaml",function(r){var n=[];try{jsyaml.load(r)}catch(s){var o=s.mark;n.push({from:e.Pos(o.line,o.column),to:e.Pos(o.line,o.column),message:s.message})}return n})});
//# sourceMappingURL=../../sourcemaps/addon/lint/yaml-lint.js.map
