/**
 * skylark-ui-coder - The skylark coder widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylarkui/skylark-ui-coder/
 * @license MIT
 */
!function(){function e(e){test.mode(e,o,Array.prototype.slice.call(arguments,1),"multiplexing")}CodeMirror.defineMode("markdown_with_stex",function(){var e=CodeMirror.getMode({},"stex"),o=CodeMirror.getMode({},"markdown"),r={open:"$",close:"$",mode:e,delimStyle:"delim",innerStyle:"inner"};return CodeMirror.multiplexingMode(o,r)});var o=CodeMirror.getMode({},"markdown_with_stex");e("stexInsideMarkdown","[strong **Equation:**] [delim&delim-open $][inner&tag \\pi][delim&delim-close $]")}();
//# sourceMappingURL=../../sourcemaps/addon/mode/multiplex_test.js.map
