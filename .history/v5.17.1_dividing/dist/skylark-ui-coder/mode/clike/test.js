/**
 * skylark-ui-coder - The skylark coder widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylarkui/skylark-ui-coder/
 * @license MIT
 */
!function(){function e(e){test.mode(e,a,Array.prototype.slice.call(arguments,1))}function r(e){test.mode(e,o,Array.prototype.slice.call(arguments,1))}var a=CodeMirror.getMode({indentUnit:2},"text/x-c");e("indent","[variable-3 void] [def foo]([variable-3 void*] [variable a], [variable-3 int] [variable b]) {","  [variable-3 int] [variable c] [operator =] [variable b] [operator +]","    [number 1];","  [keyword return] [operator *][variable a];","}"),e("indent_switch","[keyword switch] ([variable x]) {","  [keyword case] [number 10]:","    [keyword return] [number 20];","  [keyword default]:",'    [variable printf]([string "foo %c"], [variable x]);',"}"),e("def","[variable-3 void] [def foo]() {}","[keyword struct] [def bar]{}","[variable-3 int] [variable-3 *][def baz]() {}"),e("def_new_line","::[variable std]::[variable SomeTerribleType][operator <][variable T][operator >]","[def SomeLongMethodNameThatDoesntFitIntoOneLine]([keyword const] [variable MyType][operator &] [variable param]) {}"),e("double_block","[keyword for] (;;)","  [keyword for] (;;)","    [variable x][operator ++];","[keyword return];"),e("preprocessor","[meta #define FOO 3]","[variable-3 int] [variable foo];","[meta #define BAR\\]","[meta 4]","[variable-3 unsigned] [variable-3 int] [variable bar] [operator =] [number 8];","[meta #include <baz> ][comment // comment]");var o=CodeMirror.getMode({indentUnit:2},"text/x-c++src");r("cpp14_literal","[number 10'000];","[number 0b10'000];","[number 0x10'000];","[string '100000'];")}();
//# sourceMappingURL=../../sourcemaps/mode/clike/test.js.map
