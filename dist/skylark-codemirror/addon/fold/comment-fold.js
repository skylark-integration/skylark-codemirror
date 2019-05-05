/**
 * skylark-codemirror - A version of codemirror 5.45  that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-codemirror/
 * @license MIT
 */
define(["../../CodeMirror"],function(e){"use strict";e.registerGlobalHelper("fold","comment",function(e){return e.blockCommentStart&&e.blockCommentEnd},function(t,n){var r=t.getModeAt(n),o=r.blockCommentStart,i=r.blockCommentEnd;if(o&&i){for(var l,f=n.line,a=t.getLine(f),m=n.ch,c=0;;){var s=m<=0?-1:a.lastIndexOf(o,m-1);if(-1!=s){if(1==c&&s<n.ch)return;if(/comment/.test(t.getTokenTypeAt(e.Pos(f,s+1)))&&(0==s||a.slice(s-i.length,s)==i||!/comment/.test(t.getTokenTypeAt(e.Pos(f,s))))){l=s+o.length;break}m=s-1}else{if(1==c)return;c=1,m=a.length}}var g,d,h=1,k=t.lastLine();e:for(var u=f;u<=k;++u)for(var b=t.getLine(u),v=u==f?l:0;;){var C=b.indexOf(o,v),P=b.indexOf(i,v);if(C<0&&(C=b.length),P<0&&(P=b.length),(v=Math.min(C,P))==b.length)break;if(v==C)++h;else if(!--h){g=u,d=v;break e}++v}if(null!=g&&(f!=g||d!=l))return{from:e.Pos(f,l),to:e.Pos(g,d)}}})});
//# sourceMappingURL=../../sourcemaps/addon/fold/comment-fold.js.map
