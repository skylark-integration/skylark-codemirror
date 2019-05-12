/**
 * skylark-ui-coder - The skylark coder widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylarkui/skylark-ui-coder/
 * @license MIT
 */
define(["../../Coder"],function(t){function e(t,e,i,r){var a=t.getLineHandle(e.line),l=e.ch-1,f=l>=0&&c[a.text.charAt(l)]||c[a.text.charAt(++l)];if(!f)return null;var h=">"==f.charAt(1)?1:-1;if(i&&h>0!=(l==e.ch))return null;var s=t.getTokenTypeAt(o(e.line,l+1)),u=n(t,o(e.line,l+(h>0?1:0)),h,s||null,r);return null==u?null:{from:o(e.line,l),to:u&&u.pos,match:u&&u.ch==f.charAt(0),forward:h>0}}function n(t,e,n,i,r){for(var a=r&&r.maxScanLineLength||1e4,l=r&&r.maxScanLines||1e3,f=[],h=r&&r.bracketRegex?r.bracketRegex:/[(){}[\]]/,s=n>0?Math.min(e.line+l,t.lastLine()+1):Math.max(t.firstLine()-1,e.line-l),u=e.line;u!=s;u+=n){var m=t.getLine(u);if(m){var g=n>0?0:m.length-1,d=n>0?m.length:-1;if(!(m.length>a))for(u==e.line&&(g=e.ch-(n<0?1:0));g!=d;g+=n){var v=m.charAt(g);if(h.test(v)&&(void 0===i||t.getTokenTypeAt(o(u,g+1))==i)){var k=c[v];if(">"==k.charAt(1)==n>0)f.push(v);else{if(!f.length)return{pos:o(u,g),ch:v};f.pop()}}}}}return u-n!=(n>0?t.lastLine():t.firstLine())&&null}function i(t,n,i){for(var r=t.state.matchBrackets.maxHighlightLineLength||1e3,c=[],l=t.listSelections(),f=0;f<l.length;f++){var h=l[f].empty()&&e(t,l[f].head,!1,i);if(h&&t.getLine(h.from.line).length<=r){var s=h.match?"CodeMirror-matchingbracket":"CodeMirror-nonmatchingbracket";c.push(t.markText(h.from,o(h.from.line,h.from.ch+1),{className:s})),h.to&&t.getLine(h.to.line).length<=r&&c.push(t.markText(h.to,o(h.to.line,h.to.ch+1),{className:s}))}}if(c.length){a&&t.state.focused&&t.focus();var u=function(){t.operation(function(){for(var t=0;t<c.length;t++)c[t].clear()})};if(!n)return u;setTimeout(u,800)}}function r(t){t.operation(function(){l&&(l(),l=null),l=i(t,!1,t.state.matchBrackets)})}var a=/MSIE \d/.test(navigator.userAgent)&&(null==document.documentMode||document.documentMode<8),o=t.Pos,c={"(":")>",")":"(<","[":"]>","]":"[<","{":"}>","}":"{<"},l=null;t.defineOption("matchBrackets",!1,function(e,n,i){i&&i!=t.Init&&e.off("cursorActivity",r),n&&(e.state.matchBrackets="object"==typeof n?n:{},e.on("cursorActivity",r))}),t.defineExtension("matchBrackets",function(){i(this,!0)}),t.defineExtension("findMatchingBracket",function(t,n,i){return e(this,t,n,i)}),t.defineExtension("scanForBracket",function(t,e,i,r){return n(this,t,e,i,r)})});
//# sourceMappingURL=../../sourcemaps/addon/edit/matchbrackets.js.map
