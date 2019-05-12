/**
 * skylark-ui-coder - The skylark coder widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylarkui/skylark-ui-coder/
 * @license MIT
 */
define(["../../Coder"],function(e){"use strict";e.registerGlobalHelper("fold","comment",function(e){return e.blockCommentStart&&e.blockCommentEnd},function(t,n){var o=t.getModeAt(n),r=o.blockCommentStart,i=o.blockCommentEnd;if(r&&i){for(var l,f=n.line,a=t.getLine(f),m=n.ch,c=0;;){var s=m<=0?-1:a.lastIndexOf(r,m-1);if(s!=-1){if(1==c&&s<n.ch)return;if(/comment/.test(t.getTokenTypeAt(e.Pos(f,s+1)))&&(0==s||a.slice(s-i.length,s)==i||!/comment/.test(t.getTokenTypeAt(e.Pos(f,s))))){l=s+r.length;break}m=s-1}else{if(1==c)return;c=1,m=a.length}}var g,d,h=1,k=t.lastLine();e:for(var u=f;u<=k;++u)for(var b=t.getLine(u),v=u==f?l:0;;){var C=b.indexOf(r,v),P=b.indexOf(i,v);if(C<0&&(C=b.length),P<0&&(P=b.length),v=Math.min(C,P),v==b.length)break;if(v==C)++h;else if(!--h){g=u,d=v;break e}++v}if(null!=g&&(f!=g||d!=l))return{from:e.Pos(f,l),to:e.Pos(g,d)}}})});
//# sourceMappingURL=../../sourcemaps/addon/fold/comment-fold.js.map
