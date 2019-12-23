/**
 * skylark-codemirror - A version of codemirror 5.45  that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-codemirror/
 * @license MIT
 */
define(["skylark-langx/langx","../../CodeMirror"],function(t,e){"use strict";var n=e.Pos,i={initialBeautify:!0,autoBeautify:!0,javascript:{beautifyFunc:null,completionFunc:function(t,e){return-1!==["}","]",";"].indexOf(e.text[0])}},css:{beautifyFunc:null,completionFunc:function(t,e){return-1!==["}",";"].indexOf(e.text[0])}},html:{beautifyFunc:null,completionFunc:function(t,e){return-1!==[">"].indexOf(e.text[0])}}};function a(t){if(t&&t.doc&&t.doc.mode&&t.state)return"javascript"===t.doc.mode.name?t.state.beautify.javascript:"css"===t.doc.mode.name?t.state.beautify.css:"htmlmixed"===t.doc.mode.name?t.state.beautify.html:void 0}function u(t){var e=a(t);e&&e.beautifyFunc&&t.setValue(e.beautifyFunc(t.getValue(),e))}function o(t,e){if((!t.state.beautify||t.state.beautify.autoBeautify)&&function(t,e){var n=a(t);return!!n.completionFunc&&n.completionFunc(t,e)}(t,e)){var i=e.text[0],o=t.getRange(new n(0,0),e.to).split(i).length;u(t);for(var f=0,c=0;c<t.lineCount();c++){for(var s=-1,r=t.getLine(c);-1!==(s=r.indexOf(i,s+1));)if(o===++f){t.setCursor(new n(c,s+1));break}if(o===f)break}}}e.defineOption("beautify",!1,function(n,a,f){if(f&&f!==e.Init&&n.off("change",o),a){var c=n.getOption("indentUnit"),s={javascript:{indent_size:c},css:{indent_size:c},html:{indent_size:c}};n.state.beautify="object"==typeof a?t.mixin({},i,s,a,!0):t.mixin({},i,s,!0),n.state.beautify.initialBeautify&&u(n),n.on("change",o)}}),e.defineExtension("beautify",function(){u(this)})});
//# sourceMappingURL=../../sourcemaps/addon/beautify/beautify.js.map
