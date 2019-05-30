/**
 * skylark-ui-coder - The skylark coder widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylarkui/skylark-ui-coder/
 * @license MIT
 */
define(["../../Coder"],function(e){function t(e,t,i,r){this.cm=e,this.node=t,this.options=i,this.height=r,this.cleared=!1}function i(e){var t=e.getWrapperElement(),i=window.getComputedStyle?window.getComputedStyle(t):t.currentStyle,r=parseInt(i.height),n=e.state.panels={setHeight:t.style.height,heightLeft:r,panels:0,wrapper:document.createElement("div")};t.parentNode.insertBefore(n.wrapper,t);var s=e.hasFocus();n.wrapper.appendChild(t),s&&e.focus(),e._setSize=e.setSize,null!=r&&(e.setSize=function(t,i){if(null==i)return this._setSize(t,i);if(n.setHeight=i,"number"!=typeof i){var s=/^(\d+\.?\d*)px$/.exec(i);s?i=Number(s[1]):(n.wrapper.style.height=i,i=n.wrapper.offsetHeight,n.wrapper.style.height="")}e._setSize(t,n.heightLeft+=i-r),r=i})}function r(e){var t=e.state.panels;e.state.panels=null;var i=e.getWrapperElement();t.wrapper.parentNode.replaceChild(i,t.wrapper),i.style.height=t.setHeight,e.setSize=e._setSize,e.setSize()}e.defineExtension("addPanel",function(e,r){r=r||{},this.state.panels||i(this);var n=this.state.panels,s=n.wrapper,a=this.getWrapperElement();r.after instanceof t&&!r.after.cleared?s.insertBefore(e,r.before.node.nextSibling):r.before instanceof t&&!r.before.cleared?s.insertBefore(e,r.before.node):r.replace instanceof t&&!r.replace.cleared?(s.insertBefore(e,r.replace.node),r.replace.clear()):"bottom"==r.position?s.appendChild(e):"before-bottom"==r.position?s.insertBefore(e,a.nextSibling):"after-top"==r.position?s.insertBefore(e,a):s.insertBefore(e,s.firstChild);var h=r&&r.height||e.offsetHeight;return this._setSize(null,n.heightLeft-=h),n.panels++,new t(this,e,r,h)}),t.prototype.clear=function(){if(!this.cleared){this.cleared=!0;var e=this.cm.state.panels;this.cm._setSize(null,e.heightLeft+=this.height),e.wrapper.removeChild(this.node),0==--e.panels&&r(this.cm)}},t.prototype.changed=function(e){var t=null==e?this.node.offsetHeight:e,i=this.cm.state.panels;this.cm._setSize(null,i.height+=t-this.height),this.height=t}});
//# sourceMappingURL=../../sourcemaps/addon/display/panel.js.map