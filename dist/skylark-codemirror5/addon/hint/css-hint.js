/**
 * skylark-codemirror5 - A version of codemirror 5.17.1  that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-codemirror5/
 * @license MIT
 */
!function(e){"object"==typeof exports&&"object"==typeof module?e(require("../../lib/codemirror"),require("../../mode/css/css")):"function"==typeof define&&define.amd?define(["../../lib/codemirror","../../mode/css/css"],e):e(CodeMirror)}(function(e){"use strict";var r={link:1,visited:1,active:1,hover:1,focus:1,"first-letter":1,"first-line":1,"first-child":1,before:1,after:1,lang:1};e.registerHelper("hint","css",function(t){var o=t.getCursor(),s=t.getTokenAt(o),i=e.innerMode(t.getMode(),s.state);if("css"==i.mode.name){if("keyword"==s.type&&0=="!important".indexOf(s.string))return{list:["!important"],from:e.Pos(o.line,s.start),to:e.Pos(o.line,s.end)};var n=s.start,a=o.ch,d=s.string.slice(0,a-n);/[^\w$_-]/.test(d)&&(d="",n=a=o.ch);var c=e.resolveMode("text/css"),f=[],l=i.state.state;return"pseudo"==l||"variable-3"==s.type?p(r):"block"==l||"maybeprop"==l?p(c.propertyKeywords):"prop"==l||"parens"==l||"at"==l||"params"==l?(p(c.valueKeywords),p(c.colorKeywords)):"media"!=l&&"media_parens"!=l||(p(c.mediaTypes),p(c.mediaFeatures)),f.length?{list:f,from:e.Pos(o.line,n),to:e.Pos(o.line,a)}:void 0}function p(e){for(var r in e)d&&0!=r.lastIndexOf(d,0)||f.push(r)}})});
//# sourceMappingURL=../../sourcemaps/addon/hint/css-hint.js.map
