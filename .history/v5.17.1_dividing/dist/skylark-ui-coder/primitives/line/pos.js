/**
 * skylark-ui-coder - The skylark coder widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylarkui/skylark-ui-coder/
 * @license MIT
 */
define(["skylark-langx/klass","../CoderCtor"],function(n,t){var e=n({_construct:function(n,t){this.line=n,this.ch=t},compareTo:function(n){return this.line-n.line||this.ch-n.ch},clone:function(){return new e(this.line,thie.ch)}});e.compare=function(n,t){return n.compareTo(t)}});
//# sourceMappingURL=../../sourcemaps/primitives/line/pos.js.map
