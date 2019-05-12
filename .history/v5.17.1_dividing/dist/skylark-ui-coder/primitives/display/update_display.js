/**
 * skylark-ui-coder - The skylark coder widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylarkui/skylark-ui-coder/
 * @license MIT
 */
define(["skylark-langx/klass","../CoderCtor"],function(i,t){function s(i,t,s){var e=i.display;this.viewport=t,this.visible=visibleLines(e,i.doc,t),this.editorIsHidden=!e.wrapper.offsetWidth,this.wrapperHeight=e.wrapper.clientHeight,this.wrapperWidth=e.wrapper.clientWidth,this.oldDisplayWidth=i.displayWidth(),this.force=s,this.dims=getDimensions(i),this.events=[]}s.prototype.signal=function(i,t){hasHandler(i,t)&&this.events.push(arguments)},s.prototype.finish=function(){for(var i=0;i<this.events.length;i++)signal.apply(null,this.events[i])}});
//# sourceMappingURL=../../sourcemaps/primitives/display/update_display.js.map
