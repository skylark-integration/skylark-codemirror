/**
 * skylark-ui-coder - The skylark coder widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylarkui/skylark-ui-coder/
 * @license MIT
 */
define(["../../Coder"],function(e){"use strict";function t(e){return new RegExp("^(("+e.join(")|(")+"))\\b","i")}function n(e){if(e.eatSpace())return null;if(e.match("//"))return e.skipToEnd(),"comment";if(e.match(/^[0-9\.+-]/,!1)){if(e.match(/^[+-]?0x[0-9a-fA-F]+/))return"number";if(e.match(/^[+-]?\d*\.\d+([EeDd][+-]?\d+)?/))return"number";if(e.match(/^[+-]?\d+([EeDd][+-]?\d+)?/))return"number"}return e.match(/^"([^"]|(""))*"/)?"string":e.match(/^'([^']|(''))*'/)?"string":e.match(i)?"keyword":e.match(o)?"variable":(e.next(),null)}var r=["package","message","import","syntax","required","optional","repeated","reserved","default","extensions","packed","bool","bytes","double","enum","float","string","int32","int64","uint32","uint64","sint32","sint64","fixed32","fixed64","sfixed32","sfixed64"],i=t(r);e.registerHelper("hintWords","protobuf",r);var o=new RegExp("^[_A-Za-z¡-￿][_A-Za-z0-9¡-￿]*");e.defineMode("protobuf",function(){return{token:n}}),e.defineMIME("text/x-protobuf","protobuf")});
//# sourceMappingURL=../../sourcemaps/mode/protobuf/protobuf.js.map
