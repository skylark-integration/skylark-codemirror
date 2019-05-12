define([
  "../util/dom",
  "../CoderCtor"
],function(dom,CoderCtor) {
  // Rebuild the gutter elements, ensure the margin to the left of the
  // code matches their width.
  CoderCtor.partial({
    updateGutters : function () {
      var cm = this;
      
      var gutters = cm.display.gutters, 
          specs = cm.options.gutters;
      
      dom.removeChildren(gutters);
      
      for (var i = 0; i < specs.length; ++i) {
        var gutterClass = specs[i];
        var gElt = gutters.appendChild(dom.elt("div", null, "CodeMirror-gutter " + gutterClass));
        if (gutterClass == "CodeMirror-linenumbers") {
          cm.display.lineGutter = gElt;
          gElt.style.width = (cm.display.lineNumWidth || 1) + "px";
        }
      }
      
      gutters.style.display = i ? "" : "none";
      
      cm.updateGutterSpace();
    },

    updateGutterSpace : function () {
      var cm = this;
      var width = cm.display.gutters.offsetWidth;
      cm.display.sizer.style.marginLeft = width + "px";
    }

  });

});
