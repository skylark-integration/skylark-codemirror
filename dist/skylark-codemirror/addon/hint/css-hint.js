/**
 * skylark-codemirror - A version of codemirror 5.45  that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-codemirror/
 * @license MIT
 */
define(["../../CodeMirror","../../mode/css/css"],function(e){"use strict";var t={link:1,visited:1,active:1,hover:1,focus:1,"first-letter":1,"first-line":1,"first-child":1,before:1,after:1,lang:1};e.registerHelper("hint","css",function(r){var s=r.getCursor(),i=r.getTokenAt(s),o=e.innerMode(r.getMode(),i.state);if("css"==o.mode.name){if("keyword"==i.type&&0=="!important".indexOf(i.string))return{list:["!important"],from:e.Pos(s.line,i.start),to:e.Pos(s.line,i.end)};var n=i.start,a=s.ch,d=i.string.slice(0,a-n);/[^\w$_-]/.test(d)&&(d="",n=a=s.ch);var l=e.resolveMode("text/css"),c=[],f=o.state.state;return"pseudo"==f||"variable-3"==i.type?p(t):"block"==f||"maybeprop"==f?p(l.propertyKeywords):"prop"==f||"parens"==f||"at"==f||"params"==f?(p(l.valueKeywords),p(l.colorKeywords)):"media"!=f&&"media_parens"!=f||(p(l.mediaTypes),p(l.mediaFeatures)),c.length?{list:c,from:e.Pos(s.line,n),to:e.Pos(s.line,a)}:void 0}function p(e){for(var t in e)d&&0!=t.lastIndexOf(d,0)||c.push(t)}})});
//# sourceMappingURL=../../sourcemaps/addon/hint/css-hint.js.map
