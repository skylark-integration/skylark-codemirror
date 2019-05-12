/**
 * skylark-ui-coder - The skylark coder widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylarkui/skylark-ui-coder/
 * @license MIT
 */
define(["../../Coder"],function(e){"use strict";function n(e){var n=e.search(l);return n==-1?0:n}function t(e,n,t){return/\bstring\b/.test(e.getTokenTypeAt(o(n.line,0)))&&!/^[\'\"`]/.test(t)}var i={},l=/[^\s\u00a0]/,o=e.Pos;e.commands.toggleComment=function(e){e.toggleComment()},e.defineExtension("toggleComment",function(e){e||(e=i);for(var n=this,t=1/0,l=this.listSelections(),a=null,r=l.length-1;r>=0;r--){var m=l[r].from(),c=l[r].to();m.line>=t||(c.line>=t&&(c=o(t,0)),t=m.line,null==a?n.uncomment(m,c,e)?a="un":(n.lineComment(m,c,e),a="line"):"un"==a?n.uncomment(m,c,e):n.lineComment(m,c,e))}}),e.defineExtension("lineComment",function(e,a,r){r||(r=i);var m=this,c=m.getModeAt(e),g=m.getLine(e.line);if(null!=g&&!t(m,e,g)){var f=r.lineComment||c.lineComment;if(!f)return void((r.blockCommentStart||c.blockCommentStart)&&(r.fullLines=!0,m.blockComment(e,a,r)));var s=Math.min(0!=a.ch||a.line==e.line?a.line+1:a.line,m.lastLine()+1),d=null==r.padding?" ":r.padding,u=r.commentBlankLines||e.line==a.line;m.operation(function(){if(r.indent){for(var t=null,i=e.line;i<s;++i){var a=m.getLine(i),c=a.slice(0,n(a));(null==t||t.length>c.length)&&(t=c)}for(var i=e.line;i<s;++i){var a=m.getLine(i),g=t.length;(u||l.test(a))&&(a.slice(0,g)!=t&&(g=n(a)),m.replaceRange(t+f+d,o(i,0),o(i,g)))}}else for(var i=e.line;i<s;++i)(u||l.test(m.getLine(i)))&&m.replaceRange(f+d,o(i,0))})}}),e.defineExtension("blockComment",function(e,n,t){t||(t=i);var a=this,r=a.getModeAt(e),m=t.blockCommentStart||r.blockCommentStart,c=t.blockCommentEnd||r.blockCommentEnd;if(!m||!c)return void((t.lineComment||r.lineComment)&&0!=t.fullLines&&a.lineComment(e,n,t));var g=Math.min(n.line,a.lastLine());g!=e.line&&0==n.ch&&l.test(a.getLine(g))&&--g;var f=null==t.padding?" ":t.padding;e.line>g||a.operation(function(){if(0!=t.fullLines){var i=l.test(a.getLine(g));a.replaceRange(f+c,o(g)),a.replaceRange(m+f,o(e.line,0));var s=t.blockCommentLead||r.blockCommentLead;if(null!=s)for(var d=e.line+1;d<=g;++d)(d!=g||i)&&a.replaceRange(s+f,o(d,0))}else a.replaceRange(c,n),a.replaceRange(m,e)})}),e.defineExtension("uncomment",function(e,n,t){t||(t=i);var a,r=this,m=r.getModeAt(e),c=Math.min(0!=n.ch||n.line==e.line?n.line:n.line-1,r.lastLine()),g=Math.min(e.line,c),f=t.lineComment||m.lineComment,s=[],d=null==t.padding?" ":t.padding;e:if(f){for(var u=g;u<=c;++u){var h=r.getLine(u),v=h.indexOf(f);if(v>-1&&!/comment/.test(r.getTokenTypeAt(o(u,v+1)))&&(v=-1),v==-1&&(u!=c||u==g)&&l.test(h))break e;if(v>-1&&l.test(h.slice(0,v)))break e;s.push(h)}if(r.operation(function(){for(var e=g;e<=c;++e){var n=s[e-g],t=n.indexOf(f),i=t+f.length;t<0||(n.slice(i,i+d.length)==d&&(i+=d.length),a=!0,r.replaceRange("",o(e,t),o(e,i)))}}),a)return!0}var C=t.blockCommentStart||m.blockCommentStart,p=t.blockCommentEnd||m.blockCommentEnd;if(!C||!p)return!1;var k=t.blockCommentLead||m.blockCommentLead,L=r.getLine(g),b=c==g?L:r.getLine(c),x=L.indexOf(C),R=b.lastIndexOf(p);if(R==-1&&g!=c&&(b=r.getLine(--c),R=b.lastIndexOf(p)),x==-1||R==-1||!/comment/.test(r.getTokenTypeAt(o(g,x+1)))||!/comment/.test(r.getTokenTypeAt(o(c,R+1))))return!1;var O=L.lastIndexOf(C,e.ch),E=O==-1?-1:L.slice(0,e.ch).indexOf(p,O+C.length);if(O!=-1&&E!=-1&&E+p.length!=e.ch)return!1;E=b.indexOf(p,n.ch);var T=b.slice(n.ch).lastIndexOf(C,E-n.ch);return O=E==-1||T==-1?-1:n.ch+T,(E==-1||O==-1||O==n.ch)&&(r.operation(function(){r.replaceRange("",o(c,R-(d&&b.slice(R-d.length,R)==d?d.length:0)),o(c,R+p.length));var e=x+C.length;if(d&&L.slice(e,e+d.length)==d&&(e+=d.length),r.replaceRange("",o(g,x),o(g,e)),k)for(var n=g+1;n<=c;++n){var t=r.getLine(n),i=t.indexOf(k);if(i!=-1&&!l.test(t.slice(0,i))){var a=i+k.length;d&&t.slice(a,a+d.length)==d&&(a+=d.length),r.replaceRange("",o(n,i),o(n,a))}}}),!0)})});
//# sourceMappingURL=../../sourcemaps/addon/comment/comment.js.map
