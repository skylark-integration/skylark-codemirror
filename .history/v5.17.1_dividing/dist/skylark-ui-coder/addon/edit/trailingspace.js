/**
 * skylark-ui-coder - The skylark coder widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylarkui/skylark-ui-coder/
 * @license MIT
 */
define(["../../Coder"],function(n){n.defineOption("showTrailingSpace",!1,function(e,i,t){t==n.Init&&(t=!1),t&&!i?e.removeOverlay("trailingspace"):!t&&i&&e.addOverlay({token:function(n){for(var e=n.string.length,i=e;i&&/\s/.test(n.string.charAt(i-1));--i);return i>n.pos?(n.pos=i,null):(n.pos=e,"trailingspace")},name:"trailingspace"})})});
//# sourceMappingURL=../../sourcemaps/addon/edit/trailingspace.js.map
