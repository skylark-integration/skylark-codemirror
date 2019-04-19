/**
 * skylark-codemirror5 - A version of codemirror 5.17.1  that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-codemirror5/
 * @license MIT
 */
!function(e){"object"==typeof exports&&"object"==typeof module?e(require("../../lib/codemirror")):"function"==typeof define&&define.amd?define(["../../lib/codemirror"],e):e(CodeMirror)}(function(e){"use strict";function t(t,o){clearTimeout(o.timeout),e.off(window,"mouseup",o.hurry),e.off(window,"keyup",o.hurry)}e.defineOption("autoRefresh",!1,function(o,i){o.state.autoRefresh&&(t(o,o.state.autoRefresh),o.state.autoRefresh=null),i&&0==o.display.wrapper.offsetHeight&&function(o,i){function r(){o.display.wrapper.offsetHeight?(t(o,i),o.display.lastWrapHeight!=o.display.wrapper.clientHeight&&o.refresh()):i.timeout=setTimeout(r,i.delay)}i.timeout=setTimeout(r,i.delay),i.hurry=function(){clearTimeout(i.timeout),i.timeout=setTimeout(r,50)},e.on(window,"mouseup",i.hurry),e.on(window,"keyup",i.hurry)}(o,o.state.autoRefresh={delay:i.delay||250})})});
//# sourceMappingURL=../../sourcemaps/addon/display/autorefresh.js.map
