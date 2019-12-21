/**
 * skylark-codemirror - A version of codemirror 5.45  that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-codemirror/
 * @license MIT
 */
define(["../../CodeMirror"],function(e){"use strict";function t(t,o){clearTimeout(o.timeout),e.off(window,"mouseup",o.hurry),e.off(window,"keyup",o.hurry)}e.defineOption("autoRefresh",!1,function(o,i){o.state.autoRefresh&&(t(o,o.state.autoRefresh),o.state.autoRefresh=null),i&&0==o.display.wrapper.offsetHeight&&function(o,i){function u(){o.display.wrapper.offsetHeight?(t(o,i),o.display.lastWrapHeight!=o.display.wrapper.clientHeight&&o.refresh()):i.timeout=setTimeout(u,i.delay)}i.timeout=setTimeout(u,i.delay),i.hurry=function(){clearTimeout(i.timeout),i.timeout=setTimeout(u,50)},e.on(window,"mouseup",i.hurry),e.on(window,"keyup",i.hurry)}(o,o.state.autoRefresh={delay:i.delay||250})})});
//# sourceMappingURL=../../sourcemaps/addon/display/autorefresh.js.map
