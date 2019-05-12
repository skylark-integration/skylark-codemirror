/**
 * skylark-ui-coder - The skylark coder widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylarkui/skylark-ui-coder/
 * @license MIT
 */
define(["../../Coder"],function(e){"use strict";var n=/^(\s*)(>[> ]*|[*+-]\s|(\d+)([.)]))(\s*)/,t=/^(\s*)(>[> ]*|[*+-]|(\d+)[.)])(\s*)$/,i=/[*+-]\s/;e.commands.newlineAndIndentContinueMarkdownList=function(s){if(s.getOption("disableInput"))return e.Pass;for(var l=s.listSelections(),r=[],a=0;a<l.length;a++){var d=l[a].head,c=s.getStateAfter(d.line),o=c.list!==!1,f=0!==c.quote,u=s.getLine(d.line),p=n.exec(u);if(!l[a].empty()||!o&&!f||!p)return void s.execCommand("newlineAndIndent");if(t.test(u))s.replaceRange("",{line:d.line,ch:0},{line:d.line,ch:d.ch+1}),r[a]="\n";else{var g=p[1],h=p[5],m=i.test(p[2])||p[2].indexOf(">")>=0?p[2]:parseInt(p[3],10)+1+p[4];r[a]="\n"+g+m+h}}s.replaceSelections(r)}});
//# sourceMappingURL=../../sourcemaps/addon/edit/continuelist.js.map
