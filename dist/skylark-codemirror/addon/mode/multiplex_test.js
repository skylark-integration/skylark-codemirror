/**
 * skylark-codemirror - A version of codemirror 5.45  that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-codemirror/
 * @license MIT
 */
!function(){CodeMirror.defineMode("markdown_with_stex",function(){var e=CodeMirror.getMode({},"stex"),o=CodeMirror.getMode({},"markdown"),r={open:"$",close:"$",mode:e,delimStyle:"delim",innerStyle:"inner"};return CodeMirror.multiplexingMode(o,r)});var e=CodeMirror.getMode({},"markdown_with_stex");!function(o){test.mode(o,e,Array.prototype.slice.call(arguments,1),"multiplexing")}("stexInsideMarkdown","[strong **Equation:**] [delim&delim-open $][inner&tag \\pi][delim&delim-close $]")}();
//# sourceMappingURL=../../sourcemaps/addon/mode/multiplex_test.js.map
