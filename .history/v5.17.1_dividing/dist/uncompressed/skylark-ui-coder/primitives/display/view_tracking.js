define([
  "../CoderCtor"
],function(CoderCtor) {
  CoderCtor.partial({
    // Updates the display.view data structure for a given change to the
    // document. From and to are in pre-change coordinates. Lendiff is
    // the amount of lines added or subtracted by the change. This is
    // used for changes that span multiple lines, or change the way
    // lines are divided into visual lines. regLineChange (below)
    // registers single-line changes.
    regChange : function (from, to, lendiff) {
      var cm = this;
      if (from == null) from = cm.doc.first;
      if (to == null) to = cm.doc.first + cm.doc.size;
      if (!lendiff) lendiff = 0;

      var display = cm.display;
      if (lendiff && to < display.viewTo &&
          (display.updateLineNumbers == null || display.updateLineNumbers > from))
        display.updateLineNumbers = from;

      cm.curOp.viewChanged = true;

      if (from >= display.viewTo) { // Change after
        if (sawCollapsedSpans && cm.visualLineNo(cm.doc, from) < display.viewTo)
          resetView(cm);
      } else if (to <= display.viewFrom) { // Change before
        if (sawCollapsedSpans && cm.visualLineEndNo(cm.doc, to + lendiff) > display.viewFrom) {
          resetView(cm);
        } else {
          display.viewFrom += lendiff;
          display.viewTo += lendiff;
        }
      } else if (from <= display.viewFrom && to >= display.viewTo) { // Full overlap
        cm.resetView();
      } else if (from <= display.viewFrom) { // Top overlap
        var cut = cm.viewCuttingPoint(to, to + lendiff, 1);
        if (cut) {
          display.view = display.view.slice(cut.index);
          display.viewFrom = cut.lineN;
          display.viewTo += lendiff;
        } else {
          resetView(cm);
        }
      } else if (to >= display.viewTo) { // Bottom overlap
        var cut = cm.viewCuttingPoint(from, from, -1);
        if (cut) {
          display.view = display.view.slice(0, cut.index);
          display.viewTo = cut.lineN;
        } else {
          cm.resetView();
        }
      } else { // Gap in the middle
        var cutTop = cm.viewCuttingPoint(from, from, -1);
        var cutBot = cm.viewCuttingPoint(to, to + lendiff, 1);
        if (cutTop && cutBot) {
          display.view = display.view.slice(0, cutTop.index)
            .concat(cm.buildViewArray(cutTop.lineN, cutBot.lineN))
            .concat(display.view.slice(cutBot.index));
          display.viewTo += lendiff;
        } else {
          cm.resetView();
        }
      }

      var ext = display.externalMeasured;
      if (ext) {
        if (to < ext.lineN)
          ext.lineN += lendiff;
        else if (from < ext.lineN + ext.size)
          display.externalMeasured = null;
      }
    },

    // Register a change to a single line. Type must be one of "text",
    // "gutter", "class", "widget"
    regLineChange : function (line, type) {
      var cm = this;
      cm.curOp.viewChanged = true;
      var display = cm.display, ext = cm.display.externalMeasured;
      if (ext && line >= ext.lineN && line < ext.lineN + ext.size)
        display.externalMeasured = null;

      if (line < display.viewFrom || line >= display.viewTo) return;
      var lineView = display.view[findViewIndex(cm, line)];
      if (lineView.node == null) return;
      var arr = lineView.changes || (lineView.changes = []);
      if (indexOf(arr, type) == -1) arr.push(type);
    },

    // Clear the view.
    resetView : function () {
      var cm = this;

      cm.display.viewFrom = cm.display.viewTo = cm.doc.first;
      cm.display.view = [];
      cm.display.viewOffset = 0;
    },

    // Find the view element corresponding to a given line. Return null
    // when the line isn't visible.
    findViewIndex : function (n) {
      var cm = this;

      if (n >= cm.display.viewTo) return null;
      n -= cm.display.viewFrom;
      if (n < 0) return null;
      var view = cm.display.view;
      for (var i = 0; i < view.length; i++) {
        n -= view[i].size;
        if (n < 0) return i;
      }
    },

    viewCuttingPoint : function (oldN, newN, dir) {
      var cm = this;

      var index = cm.findViewIndex(oldN), diff, view = cm.display.view;
      if (!sawCollapsedSpans || newN == cm.doc.first + cm.doc.size)
        return {index: index, lineN: newN};
      for (var i = 0, n = cm.display.viewFrom; i < index; i++)
        n += view[i].size;
      if (n != oldN) {
        if (dir > 0) {
          if (index == view.length - 1) return null;
          diff = (n + view[index].size) - oldN;
          index++;
        } else {
          diff = n - oldN;
        }
        oldN += diff; newN += diff;
      }
      while (cm.visualLineNo(cm.doc, newN) != newN) {
        if (index == (dir < 0 ? 0 : view.length - 1)) return null;
        newN += dir * view[index - (dir < 0 ? 1 : 0)].size;
        index += dir;
      }
      return {index: index, lineN: newN};
    },

    // Force the view to cover a given range, adding empty view element
    // or clipping off existing ones as needed.
    adjustView : function (from, to) {
      var cm = this;

      var display = cm.display, view = display.view;
      if (view.length == 0 || from >= display.viewTo || to <= display.viewFrom) {
        display.view = cm.buildViewArray(from, to);
        display.viewFrom = from;
      } else {
        if (display.viewFrom > from)
          display.view = cm.buildViewArray(from, display.viewFrom).concat(display.view);
        else if (display.viewFrom < from)
          display.view = display.view.slice(cm.findViewIndex(from));
        display.viewFrom = from;
        if (display.viewTo < to)
          display.view = display.view.concat(cm.buildViewArray(display.viewTo, to));
        else if (display.viewTo > to)
          display.view = display.view.slice(0, cm.findViewIndex(to));
      }
      display.viewTo = to;
    },

    // Count the number of lines in the view whose DOM representation is
    // out of date (or nonexistent).
    countDirtyView : function () {
      var cm = this;

      var view = cm.display.view, dirty = 0;
      for (var i = 0; i < view.length; i++) {
        var lineView = view[i];
        if (!lineView.hidden && (!lineView.node || lineView.changes)) ++dirty;
      }
      return dirty;
    }
  });

});
