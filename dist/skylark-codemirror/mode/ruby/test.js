/**
 * skylark-codemirror - A version of codemirror 5.45  that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-codemirror/
 * @license MIT
 */
!function(){var r=CodeMirror.getMode({indentUnit:2},"ruby");function e(e){test.mode(e,r,Array.prototype.slice.call(arguments,1))}e("divide_equal_operator","[variable bar] [operator /=] [variable foo]"),e("divide_equal_operator_no_spacing","[variable foo][operator /=][number 42]"),e("complex_regexp","[keyword if] [variable cr] [operator =~] [string-2 /(?: \\( #{][tag RE_NOT][string-2 }\\( | #{][tag RE_NOT_PAR_OR][string-2 }* #{][tag RE_OPA_OR][string-2 } )/][variable x]"),e("indented_heredoc","[keyword def] [def x]","  [variable y] [operator =] [string <<-FOO]","[string     bar]","[string   FOO]","[keyword end]")}();
//# sourceMappingURL=../../sourcemaps/mode/ruby/test.js.map
