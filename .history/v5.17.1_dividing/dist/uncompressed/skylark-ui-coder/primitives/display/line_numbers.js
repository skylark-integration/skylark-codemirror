define([
  "../util/dom",
  "../CoderCtor"
],function(dom,CoderCtor) {
  // LINE NUMBERS

  CoderCtor.partial({
    // Re-align line numbers and gutter marks to compensate for
    // horizontal scrolling.
    alignHorizontally : function () {
      var cm = this;
      var display = cm.display, view = display.view;
      if (!display.alignWidgets && (!display.gutters.firstChild || !cm.options.fixedGutter)) return;
      var comp = cm.compensateForHScroll(display) - display.scroller.scrollLeft + cm.doc.scrollLeft;
      var gutterW = display.gutters.offsetWidth, left = comp + "px";
      for (var i = 0; i < view.length; i++) if (!view[i].hidden) {
        if (cm.options.fixedGutter) {
          if (view[i].gutter)
            view[i].gutter.style.left = left;
          if (view[i].gutterBackground)
            view[i].gutterBackground.style.left = left;
        }
        var align = view[i].alignable;
        if (align) for (var j = 0; j < align.length; j++)
          align[j].style.left = left;
      }
      if (cm.options.fixedGutter)
        display.gutters.style.left = (comp + gutterW) + "px";
    },

    // Used to ensure that the line number gutter is still the right
    // size for the current document size. Returns true when an update
    // is needed.
    maybeUpdateLineNumberWidth : function () {
      var cm = this;

      if (!cm.options.lineNumbers) return false;
      var doc = cm.doc, last = cm.lineNumberFor(cm.options, doc.first + doc.size - 1), display = cm.display;
      if (last.length != display.lineNumChars) {
        var test = display.measure.appendChild(elt("div", [elt("div", last)],
                                                   "CodeMirror-linenumber CodeMirror-gutter-elt"));
        var innerW = test.firstChild.offsetWidth, padding = test.offsetWidth - innerW;
        display.lineGutter.style.width = "";
        display.lineNumInnerWidth = Math.max(innerW, display.lineGutter.offsetWidth - padding) + 1;
        display.lineNumWidth = display.lineNumInnerWidth + padding;
        display.lineNumChars = display.lineNumInnerWidth ? last.length : -1;
        display.lineGutter.style.width = display.lineNumWidth + "px";
        updateGutterSpace(cm);
        return true;
      }
      return false;
    },

    lineNumberFor :function (options, i) {
      return String(options.lineNumberFormatter(i + options.firstLineNumber));
    },

    // Computes display.scroller.scrollLeft + display.gutters.offsetWidth,
    // but using getBoundingClientRect to get a sub-pixel-accurate
    // result.
    compensateForHScroll : function (display) {
      return display.scroller.getBoundingClientRect().left - display.sizer.getBoundingClientRect().left;
    }
  });

});
