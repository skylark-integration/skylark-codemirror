/**
 * skylark-ui-coder - The skylark coder widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylarkui/skylark-ui-coder/
 * @license MIT
 */
!function(){function t(t){test.mode(t,e,Array.prototype.slice.call(arguments,1))}var e=CodeMirror.getMode({},"shell");t("var","text [def $var] text"),t("varBraces","text[def ${var}]text"),t("varVar","text [def $a$b] text"),t("varBracesVarBraces","text[def ${a}${b}]text"),t("singleQuotedVar","[string 'text $var text']"),t("singleQuotedVarBraces","[string 'text ${var} text']"),t("doubleQuotedVar",'[string "text ][def $var][string  text"]'),t("doubleQuotedVarBraces",'[string "text][def ${var}][string text"]'),t("doubleQuotedVarPunct",'[string "text ][def $@][string  text"]'),t("doubleQuotedVarVar",'[string "][def $a$b][string "]'),t("doubleQuotedVarBracesVarBraces",'[string "][def ${a}${b}][string "]'),t("notAString","text\\'text"),t("escapes",'outside\\\'\\"\\`\\\\[string "inside\\`\\\'\\"\\\\`\\$notAVar"]outside\\$\\(notASubShell\\)'),t("subshell","[builtin echo] [quote $(whoami)] s log, stardate [quote `date`]."),t("doubleQuotedSubshell",'[builtin echo] [string "][quote $(whoami)][string \'s log, stardate `date`."]'),t("hashbang","[meta #!/bin/bash]"),t("comment","text [comment # Blurb]"),t("numbers","[number 0] [number 1] [number 2]"),t("keywords","[keyword while] [atom true]; [keyword do]","  [builtin sleep] [number 3]","[keyword done]"),t("options","[builtin ls] [attribute -l] [attribute --human-readable]"),t("operator","[def var][operator =]value")}();
//# sourceMappingURL=../../sourcemaps/mode/shell/test.js.map
