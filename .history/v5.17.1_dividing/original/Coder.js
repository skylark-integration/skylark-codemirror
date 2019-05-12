define([
  "skylark-langx/skylark",
  "skylark-utils/langx",
  "skylark-utils/browser",
  "skylark-utils/datax",
  "skylark-utils/eventer",
  "skylark-utils/noder",
  "skylark-utils/geom",
  "skylark-utils/velm",
  "skylark-utils/query",
  "skylark-utils/widgets" ,
  "./primitives/codemirror5/lib/codemirror"
],function(skylark,langx,browser,datax,eventer,noder,geom,velm,$,widgets,codemirror){

    'use strict';
    var ui = skylark.ui = skylark.ui || {};

    var Coder = ui.Coder = widgets.Widget.inherit({
        klassName: "Coder",

        pluginName: "rteditor",

        init :   function ( element, options ){
        }
    });

    Object.defineProperty(Coder,"keyMap",{
      get : function() {
        return codemirror.keyMap;
      }
    });

    return Coder;
});
