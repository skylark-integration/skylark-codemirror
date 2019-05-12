/**
 * skylark-ui-coder - The skylark coder widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylarkui/skylark-ui-coder/
 * @license MIT
 */
define(["../../Coder","../../mode/css/css"],function(e){"use strict";var t={link:1,visited:1,active:1,hover:1,focus:1,"first-letter":1,"first-line":1,"first-child":1,before:1,after:1,lang:1};e.registerHelper("hint","css",function(r){function s(e){for(var t in e)l&&0!=t.lastIndexOf(l,0)||f.push(t)}var i=r.getCursor(),o=r.getTokenAt(i),n=e.innerMode(r.getMode(),o.state);if("css"==n.mode.name){if("keyword"==o.type&&0=="!important".indexOf(o.string))return{list:["!important"],from:e.Pos(i.line,o.start),to:e.Pos(i.line,o.end)};var a=o.start,d=i.ch,l=o.string.slice(0,d-a);/[^\w$_-]/.test(l)&&(l="",a=d=i.ch);var c=e.resolveMode("text/css"),f=[],p=n.state.state;return"pseudo"==p||"variable-3"==o.type?s(t):"block"==p||"maybeprop"==p?s(c.propertyKeywords):"prop"==p||"parens"==p||"at"==p||"params"==p?(s(c.valueKeywords),s(c.colorKeywords)):"media"!=p&&"media_parens"!=p||(s(c.mediaTypes),s(c.mediaFeatures)),f.length?{list:f,from:e.Pos(i.line,a),to:e.Pos(i.line,d)}:void 0}})});
//# sourceMappingURL=../../sourcemaps/addon/hint/css-hint.js.map
