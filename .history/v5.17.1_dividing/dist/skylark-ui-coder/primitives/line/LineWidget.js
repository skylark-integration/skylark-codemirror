/**
 * skylark-ui-coder - The skylark coder widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylarkui/skylark-ui-coder/
 * @license MIT
 */
define(["skylark-langx/Evented","../CoderCtor"],function(e,i){function t(e,i,t){heightAtLine(i)<(e.curOp&&e.curOp.scrollTop||e.doc.scrollTop)&&addToScrollPos(e,null,t)}function n(e){if(null!=e.height)return e.height;var i=e.doc.cm;if(!i)return 0;if(!contains(document.body,e.node)){var t="position: relative;";e.coverGutter&&(t+="margin-left: -"+i.display.gutters.offsetWidth+"px;"),e.noHScroll&&(t+="width: "+i.display.wrapper.clientWidth+"px;"),removeChildrenAndAdd(i.display.measure,elt("div",[e.node],null,t))}return e.height=e.node.parentNode.offsetHeight}e.inherit({_construct:function(e,i,t){if(t)for(var n in t)t.hasOwnProperty(n)&&(this[n]=t[n]);this.doc=e,this.node=i},clear:function(){var e=this.doc.cm,i=this.line.widgets,t=this.line,r=lineNo(t);if(null!=r&&i){for(var o=0;o<i.length;++o)i[o]==this&&i.splice(o--,1);i.length||(t.widgets=null);var h=n(this);updateLineHeight(t,Math.max(0,t.height-h)),e&&runInOp(e,function(){e.adjustScrollWhenAboveVisible(t,-h),e.regLineChange(r,"widget")})}},changed:function(){var e=this.height,i=this.doc.cm,r=this.line;this.height=null;var o=n(this)-e;o&&(updateLineHeight(r,r.height+o),i&&runInOp(i,function(){i.curOp.forceUpdate=!0,t(i,r,o)}))}})});
//# sourceMappingURL=../../sourcemaps/primitives/line/LineWidget.js.map
