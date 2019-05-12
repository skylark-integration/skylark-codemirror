/**
 * skylark-ui-coder - The skylark coder widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylarkui/skylark-ui-coder/
 * @license MIT
 */
define(["../CoderCtor"],function(e){e.partial({onResize:function(){var e=this,i=e.display;i.lastWrapHeight==i.wrapper.clientHeight&&i.lastWrapWidth==i.wrapper.clientWidth||(i.cachedCharWidth=i.cachedTextHeight=i.cachedPaddingH=null,i.scrollbarsClipped=!1,e.setSize())}})});
//# sourceMappingURL=../../sourcemaps/primitives/edit/global_event.js.map
