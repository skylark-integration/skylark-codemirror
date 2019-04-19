/**
 * skylark-codemirror5 - A version of codemirror 5.17.1  that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-codemirror5/
 * @license MIT
 */
define(["../../CodeMirror"],function(e){function t(e,t,i,r){this.cm=e,this.node=t,this.options=i,this.height=r,this.cleared=!1}function i(e,t){for(var i=t.nextSibling;i;i=i.nextSibling)if(i==e.getWrapperElement())return!0;return!1}e.defineExtension("addPanel",function(e,r){r=r||{},this.state.panels||function(e){var t=e.getWrapperElement(),i=window.getComputedStyle?window.getComputedStyle(t):t.currentStyle,r=parseInt(i.height),n=e.state.panels={setHeight:t.style.height,heightLeft:r,panels:0,wrapper:document.createElement("div")};t.parentNode.insertBefore(n.wrapper,t);var s=e.hasFocus();n.wrapper.appendChild(t),s&&e.focus();e._setSize=e.setSize,null!=r&&(e.setSize=function(t,i){if(null==i)return this._setSize(t,i);if(n.setHeight=i,"number"!=typeof i){var s=/^(\d+\.?\d*)px$/.exec(i);s?i=Number(s[1]):(n.wrapper.style.height=i,i=n.wrapper.offsetHeight,n.wrapper.style.height="")}e._setSize(t,n.heightLeft+=i-r),r=i})}(this);var n=this.state.panels,s=n.wrapper,h=this.getWrapperElement(),o=r.replace instanceof t&&!r.replace.cleared;r.after instanceof t&&!r.after.cleared?s.insertBefore(e,r.before.node.nextSibling):r.before instanceof t&&!r.before.cleared?s.insertBefore(e,r.before.node):o?(s.insertBefore(e,r.replace.node),n.panels++,r.replace.clear()):"bottom"==r.position?s.appendChild(e):"before-bottom"==r.position?s.insertBefore(e,h.nextSibling):"after-top"==r.position?s.insertBefore(e,h):s.insertBefore(e,s.firstChild);var l=r&&r.height||e.offsetHeight;return this._setSize(null,n.heightLeft-=l),o||n.panels++,r.stable&&i(this,e)&&this.scrollTo(null,this.getScrollInfo().top+l),new t(this,e,r,l)}),t.prototype.clear=function(){if(!this.cleared){this.cleared=!0;var e=this.cm.state.panels;this.cm._setSize(null,e.heightLeft+=this.height),this.options.stable&&i(this.cm,this.node)&&this.cm.scrollTo(null,this.cm.getScrollInfo().top-this.height),e.wrapper.removeChild(this.node),0==--e.panels&&function(e){var t=e.state.panels;e.state.panels=null;var i=e.getWrapperElement();t.wrapper.parentNode.replaceChild(i,t.wrapper),i.style.height=t.setHeight,e.setSize=e._setSize,e.setSize()}(this.cm)}},t.prototype.changed=function(e){var t=null==e?this.node.offsetHeight:e,i=this.cm.state.panels;this.cm._setSize(null,i.heightLeft-=t-this.height),this.height=t}});
//# sourceMappingURL=../../sourcemaps/addon/display/panel.js.map
