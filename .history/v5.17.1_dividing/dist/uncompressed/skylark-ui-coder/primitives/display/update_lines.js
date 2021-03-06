define([
  "../CoderCtor"
],function(CoderCtor) {
  CoderCtor.partial({
    // Read the actual heights of the rendered lines, and update their
    // stored heights to match.
    updateHeightsInViewport : function () {
      var cm = this;

      var display = cm.display;
      var prevBottom = display.lineDiv.offsetTop;
      for (var i = 0; i < display.view.length; i++) {
        var cur = display.view[i], height;
        if (cur.hidden) continue;
        if (ie && ie_version < 8) {
          var bot = cur.node.offsetTop + cur.node.offsetHeight;
          height = bot - prevBottom;
          prevBottom = bot;
        } else {
          var box = cur.node.getBoundingClientRect();
          height = box.bottom - box.top;
        }
        var diff = cur.line.height - height;
        if (height < 2) height = textHeight(display);
        if (diff > .001 || diff < -.001) {
          cm.updateLineHeight(cur.line, height);
          cm.updateWidgetHeight(cur.line);
          if (cur.rest) for (var j = 0; j < cur.rest.length; j++)
            cm.updateWidgetHeight(cur.rest[j]);
        }
      }
    },

    // Read and store the height of line widgets associated with the
    // given line.
    updateWidgetHeight : function (line) {
      if (line.widgets) {
        for (var i = 0; i < line.widgets.length; ++i) {
          line.widgets[i].height = line.widgets[i].node.parentNode.offsetHeight;
        }
      }
    },

    // Compute the lines that are visible in a given viewport (defaults
    // the the current scroll position). viewport may contain top,
    // height, and ensure (see op.scrollToPos) properties.
    visibleLines : function (display, doc, viewport) {
      var top = viewport && viewport.top != null ? Math.max(0, viewport.top) : display.scroller.scrollTop;
      top = Math.floor(top - paddingTop(display));
      var bottom = viewport && viewport.bottom != null ? viewport.bottom : top + display.wrapper.clientHeight;

      var from = this.lineAtHeight(doc, top), to = this.lineAtHeight(doc, bottom);
      // Ensure is a {from: {line, ch}, to: {line, ch}} object, and
      // forces those lines into the viewport (if possible).
      if (viewport && viewport.ensure) {
        var ensureFrom = viewport.ensure.from.line, ensureTo = viewport.ensure.to.line;
        if (ensureFrom < from) {
          from = ensureFrom;
          to = this.lineAtHeight(doc, this.heightAtLine(this.getLine(doc, ensureFrom)) + display.wrapper.clientHeight);
        } else if (Math.min(ensureTo, doc.lastLine()) >= to) {
          from = this.lineAtHeight(doc, this.heightAtLine(this.getLine(doc, ensureTo)) - display.wrapper.clientHeight);
          to = ensureTo;
        }
      }
      return {from: from, to: Math.max(to, from + 1)};
    }
  });

});
