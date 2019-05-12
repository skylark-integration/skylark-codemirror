/**
 * skylark-ui-coder - The skylark coder widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylarkui/skylark-ui-coder/
 * @license MIT
 */
!function(e){"object"==typeof exports&&"object"==typeof module?e(require("../../Coder"),require("../../addon/mode/simple")):"function"==typeof define&&define.amd?define(["../../Coder","../../addon/mode/simple"],e):e(CodeMirror)}(function(e){"use strict";var n=["from","maintainer","run","cmd","expose","env","add","copy","entrypoint","volume","user","workdir","onbuild"],t="("+n.join("|")+")",o=new RegExp(t+"\\s*$","i"),r=new RegExp(t+"(\\s+)","i");e.defineSimpleMode("dockerfile",{start:[{regex:/#.*$/,token:"comment"},{regex:o,token:"variable-2"},{regex:r,token:["variable-2",null],next:"arguments"},{regex:/./,token:null}],arguments:[{regex:/#.*$/,token:"error",next:"start"},{regex:/[^#]+\\$/,token:null},{regex:/[^#]+/,token:null,next:"start"},{regex:/$/,token:null,next:"start"},{token:null,next:"start"}],meta:{lineComment:"#"}}),e.defineMIME("text/x-dockerfile","dockerfile")});
//# sourceMappingURL=../../sourcemaps/mode/dockerfile/dockerfile.js.map
