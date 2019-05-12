/**
 * skylark-ui-coder - The skylark coder widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylarkui/skylark-ui-coder/
 * @license MIT
 */
define(["../../Coder"],function(e){"use strict";function t(e,t,r,o){if(this.atOccurrence=!1,this.doc=e,null==o&&"string"==typeof t&&(o=!1),r=r?e.clipPos(r):i(0,0),this.pos={from:r,to:r},"string"!=typeof t)t.global||(t=new RegExp(t.source,t.ignoreCase?"ig":"g")),this.matches=function(n,r){if(n){t.lastIndex=0;for(var o,s,l=e.getLine(r.line).slice(0,r.ch),h=0;;){t.lastIndex=h;var f=t.exec(l);if(!f)break;if(o=f,s=o.index,h=o.index+(o[0].length||1),h==l.length)break}var c=o&&o[0].length||0;c||(0==s&&0==l.length?o=void 0:s!=e.getLine(r.line).length&&c++)}else{t.lastIndex=r.ch;var l=e.getLine(r.line),o=t.exec(l),c=o&&o[0].length||0,s=o&&o.index;s+c==l.length||c||(c=1)}if(o&&c)return{from:i(r.line,s),to:i(r.line,s+c),match:o}};else{var s=t;o&&(t=t.toLowerCase());var l=o?function(e){return e.toLowerCase()}:function(e){return e},h=t.split("\n");if(1==h.length)t.length?this.matches=function(r,o){if(r){var h=e.getLine(o.line).slice(0,o.ch),f=l(h),c=f.lastIndexOf(t);if(c>-1)return c=n(h,f,c),{from:i(o.line,c),to:i(o.line,c+s.length)}}else{var h=e.getLine(o.line).slice(o.ch),f=l(h),c=f.indexOf(t);if(c>-1)return c=n(h,f,c)+o.ch,{from:i(o.line,c),to:i(o.line,c+s.length)}}}:this.matches=function(){};else{var f=s.split("\n");this.matches=function(t,n){var r=h.length-1;if(t){if(n.line-(h.length-1)<e.firstLine())return;if(l(e.getLine(n.line).slice(0,f[r].length))!=h[h.length-1])return;for(var o=i(n.line,f[r].length),s=n.line-1,c=r-1;c>=1;--c,--s)if(h[c]!=l(e.getLine(s)))return;var u=e.getLine(s),g=u.length-f[0].length;if(l(u.slice(g))!=h[0])return;return{from:i(s,g),to:o}}if(!(n.line+(h.length-1)>e.lastLine())){var u=e.getLine(n.line),g=u.length-f[0].length;if(l(u.slice(g))==h[0]){for(var a=i(n.line,g),s=n.line+1,c=1;c<r;++c,++s)if(h[c]!=l(e.getLine(s)))return;if(l(e.getLine(s).slice(0,f[r].length))==h[r])return{from:a,to:i(s,f[r].length)}}}}}}}function n(e,t,n){if(e.length==t.length)return n;for(var i=Math.min(n,e.length);;){var r=e.slice(0,i).toLowerCase().length;if(r<n)++i;else{if(!(r>n))return i;--i}}}var i=e.Pos;t.prototype={findNext:function(){return this.find(!1)},findPrevious:function(){return this.find(!0)},find:function(e){function t(e){var t=i(e,0);return n.pos={from:t,to:t},n.atOccurrence=!1,!1}for(var n=this,r=this.doc.clipPos(e?this.pos.from:this.pos.to);;){if(this.pos=this.matches(e,r))return this.atOccurrence=!0,this.pos.match||!0;if(e){if(!r.line)return t(0);r=i(r.line-1,this.doc.getLine(r.line-1).length)}else{var o=this.doc.lineCount();if(r.line==o-1)return t(o);r=i(r.line+1,0)}}},from:function(){if(this.atOccurrence)return this.pos.from},to:function(){if(this.atOccurrence)return this.pos.to},replace:function(t,n){if(this.atOccurrence){var r=e.splitLines(t);this.doc.replaceRange(r,this.pos.from,this.pos.to,n),this.pos.to=i(this.pos.from.line+r.length-1,r[r.length-1].length+(1==r.length?this.pos.from.ch:0))}}},e.defineExtension("getSearchCursor",function(e,n,i){return new t(this.doc,e,n,i)}),e.defineDocExtension("getSearchCursor",function(e,n,i){return new t(this,e,n,i)}),e.defineExtension("selectMatches",function(t,n){for(var i=[],r=this.getSearchCursor(t,this.getCursor("from"),n);r.findNext()&&!(e.cmpPos(r.to(),this.getCursor("to"))>0);)i.push({anchor:r.from(),head:r.to()});i.length&&this.setSelections(i,0)})});
//# sourceMappingURL=../../sourcemaps/addon/search/searchcursor.js.map
