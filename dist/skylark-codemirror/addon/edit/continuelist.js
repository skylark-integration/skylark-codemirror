/**
 * skylark-codemirror - A version of codemirror 5.45  that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-codemirror/
 * @license MIT
 */
define(["../../CodeMirror"],function(e){"use strict";var n=/^(\s*)(>[> ]*|[*+-] \[[x ]\]\s|[*+-]\s|(\d+)([.)]))(\s*)/,t=/^(\s*)(>[> ]*|[*+-] \[[x ]\]|[*+-]|(\d+)[.)])(\s*)$/,i=/[*+-]\s/;function r(e,t){var i=t.line,r=0,l=0,s=n.exec(e.getLine(i)),a=s[1];do{var c=i+(r+=1),d=e.getLine(c),o=n.exec(d);if(o){var f=o[1],g=parseInt(s[3],10)+r-l,h=parseInt(o[3],10),u=h;if(a!==f||isNaN(h)){if(a.length>f.length)return;if(a.length<f.length&&1===r)return;l+=1}else g===h&&(u=h+1),g>h&&(u=g+1),e.replaceRange(d.replace(n,f+u+o[4]+o[5]),{line:c,ch:0},{line:c,ch:d.length})}}while(o)}e.commands.newlineAndIndentContinueMarkdownList=function(l){if(l.getOption("disableInput"))return e.Pass;for(var s=l.listSelections(),a=[],c=0;c<s.length;c++){var d=s[c].head,o=l.getStateAfter(d.line),f=l.getMode().innerMode(o);if("markdown"!==f.mode.name)return void l.execCommand("newlineAndIndent");var g=!1!==(o=f.state).list,h=0!==o.quote,u=l.getLine(d.line),p=n.exec(u),m=/^\s*$/.test(u.slice(0,d.ch));if(!s[c].empty()||!g&&!h||!p||m)return void l.execCommand("newlineAndIndent");if(t.test(u))/>\s*$/.test(u)||l.replaceRange("",{line:d.line,ch:0},{line:d.line,ch:d.ch+1}),a[c]="\n";else{var v=p[1],x=p[5],I=!(i.test(p[2])||p[2].indexOf(">")>=0),w=I?parseInt(p[3],10)+1+p[4]:p[2].replace("x"," ");a[c]="\n"+v+w+x,I&&r(l,d)}}l.replaceSelections(a)}});
//# sourceMappingURL=../../sourcemaps/addon/edit/continuelist.js.map
