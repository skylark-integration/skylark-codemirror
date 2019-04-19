define([
  "skylark-langx/skylark",
  "skylark-langx/langx",
  "skylark-utils-dom/browser",
  "skylark-utils-dom/datax",
  "skylark-utils-dom/eventer",
  "skylark-utils-dom/noder",
  "skylark-utils-dom/geom",
  "skylark-utils-dom/velm",
  "skylark-utils-dom/query",
  "skylark-utils-dom/plugins" ,
  "./primitives/codemirror5/lib/codemirror"
],function(skylark,langx,browser,datax,eventer,noder,geom,velm,$,plugins,codemirror){

    'use strict';
    var ui = skylark.ui = skylark.ui || {};

    var Coder = ui.Coder = plugins.Plugin.inherit({
        klassName: "Coder",

        init :   function ( element, options ){
           codemirror.fromTextArea();
        }
    });

    Object.defineProperty(Coder,"keyMap",{
      get : function() {
        return codemirror.keyMap;
      }
    });

    return Coder;
});
