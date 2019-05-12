/**
 * skylark-ui-coder - The skylark coder widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylarkui/skylark-ui-coder/
 * @license MIT
 */
define(["../../Coder"],function(n){"use strict";n.registerHelper("lint","json",function(r){var s=[];jsonlint.parseError=function(r,t){var e=t.loc;s.push({from:n.Pos(e.first_line-1,e.first_column),to:n.Pos(e.last_line-1,e.last_column),message:r})};try{jsonlint.parse(r)}catch(t){}return s})});
//# sourceMappingURL=../../sourcemaps/addon/lint/json-lint.js.map
