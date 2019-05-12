/**
 * skylark-ui-coder - The skylark coder widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylarkui/skylark-ui-coder/
 * @license MIT
 */
define(["../../Coder"],function(e){"use strict";e.registerHelper("lint","coffeescript",function(t){var o=[],s=function(t){var s=t.lineNumber;o.push({from:e.Pos(s-1,0),to:e.Pos(s,0),severity:t.level,message:t.message})};try{for(var r=coffeelint.lint(t),i=0;i<r.length;i++)s(r[i])}catch(n){o.push({from:e.Pos(n.location.first_line,0),to:e.Pos(n.location.last_line,n.location.last_column),severity:"error",message:n.message})}return o})});
//# sourceMappingURL=../../sourcemaps/addon/lint/coffeescript-lint.js.map
