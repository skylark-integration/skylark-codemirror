/**
 * skylark-codemirror - A version of codemirror 5.45  that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-codemirror/
 * @license MIT
 */
!function(){var t=CodeMirror.getMode({tabSize:4,indentUnit:2},"cypher");function n(n){test.mode(n,t,Array.prototype.slice.call(arguments,1))}n("unbalancedDoubledQuotedString",'[string "a\'b"][variable c]'),n("unbalancedSingleQuotedString","[string 'a\"b'][variable c]"),n("doubleQuotedString",'[string "a"][variable b]'),n("singleQuotedString","[string 'a'][variable b]"),n("single attribute (with content)","[node {][atom a:][string 'a'][node }]"),n("multiple attribute, singleQuotedString (with content)","[node {][atom a:][string 'a'][node ,][atom b:][string 'b'][node }]"),n("multiple attribute, doubleQuotedString (with content)",'[node {][atom a:][string "a"][node ,][atom b:][string "b"][node }]'),n("single attribute (without content)","[node {][atom a:][string 'a'][node }]"),n("multiple attribute, singleQuotedString (without content)","[node {][atom a:][string ''][node ,][atom b:][string ''][node }]"),n("multiple attribute, doubleQuotedString (without content)",'[node {][atom a:][string ""][node ,][atom b:][string ""][node }]')}();
//# sourceMappingURL=../../sourcemaps/mode/cypher/test.js.map
