/**
 * skylark-ui-coder - The skylark coder widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylarkui/skylark-ui-coder/
 * @license MIT
 */
define(["../../Coder"],function(e){"use strict";e.defineMode("properties",function(){return{token:function(e,t){var i=e.sol()||t.afterSection,n=e.eol();if(t.afterSection=!1,i&&(t.nextMultiline?(t.inMultiline=!0,t.nextMultiline=!1):t.position="def"),n&&!t.nextMultiline&&(t.inMultiline=!1,t.position="def"),i)for(;e.eatSpace(););var o=e.next();return!i||"#"!==o&&"!"!==o&&";"!==o?i&&"["===o?(t.afterSection=!0,e.skipTo("]"),e.eat("]"),"header"):"="===o||":"===o?(t.position="quote",null):("\\"===o&&"quote"===t.position&&e.eol()&&(t.nextMultiline=!0),t.position):(t.position="comment",e.skipToEnd(),"comment")},startState:function(){return{position:"def",nextMultiline:!1,inMultiline:!1,afterSection:!1}}}}),e.defineMIME("text/x-properties","properties"),e.defineMIME("text/x-ini","properties")});
//# sourceMappingURL=../../sourcemaps/mode/properties/properties.js.map
