/**
 * skylark-ui-coder - The skylark coder widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylarkui/skylark-ui-coder/
 * @license MIT
 */
define(["../../Coder"],function(e){"use strict";function n(e){return"Subject"===e?"header":"string"}function r(e,r){if(e.sol()){if(r.inSeparator=!1,r.inHeader&&e.match(i))return null;if(r.inHeader=!1,r.header=null,e.match(o))return r.inHeaders=!0,r.inSeparator=!0,"atom";var t,a=!1;return(t=e.match(m))||(a=!0)&&(t=e.match(d))?(r.inHeaders=!0,r.inHeader=!0,r.emailPermitted=a,r.header=t[1],"atom"):r.inHeaders&&(t=e.match(s))?(r.inHeader=!0,r.emailPermitted=!0,r.header=t[1],"atom"):(r.inHeaders=!1,e.skipToEnd(),null)}if(r.inSeparator)return e.match(c)?"link":e.match(u)?"atom":(e.skipToEnd(),"atom");if(r.inHeader){var h=n(r.header);if(r.emailPermitted){if(e.match(l))return h+" link";if(e.match(f))return h}return e.skipToEnd(),h}return e.skipToEnd(),null}var t=["From","Sender","Reply-To","To","Cc","Bcc","Message-ID","In-Reply-To","References","Resent-From","Resent-Sender","Resent-To","Resent-Cc","Resent-Bcc","Resent-Message-ID","Return-Path","Received"],a=["Date","Subject","Comments","Keywords","Resent-Date"];e.registerHelper("hintWords","mbox",t.concat(a));var i=/^[ \t]/,o=/^From /,d=new RegExp("^("+t.join("|")+"): "),m=new RegExp("^("+a.join("|")+"): "),s=/^[^:]+:/,c=/^[^ ]+@[^ ]+/,u=/^.*?(?=[^ ]+?@[^ ]+)/,l=/^<.*?>/,f=/^.*?(?=<.*>)/;e.defineMode("mbox",function(){return{startState:function(){return{inSeparator:!1,inHeader:!1,emailPermitted:!1,header:null,inHeaders:!1}},token:r,blankLine:function(e){e.inHeaders=e.inSeparator=e.inHeader=!1}}}),e.defineMIME("application/mbox","mbox")});
//# sourceMappingURL=../../sourcemaps/mode/mbox/mbox.js.map
