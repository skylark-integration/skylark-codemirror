define([
  "../util/dom",
  "../CoderCtor"
],function(dom,CoderCtor) {
  var elt = dom.elt;

  CoderCtor.partial({
    // When an aspect of a line changes, a string is added to
    // lineView.changes. This updates the relevant part of the line's
    // DOM structure.
    updateLineForChanges : function (lineView, lineN, dims) {
      var cm = this;
      for (var j = 0; j < lineView.changes.length; j++) {
        var type = lineView.changes[j];
        if (type == "text") {
          cm.updateLineText(lineView);
        } else if (type == "gutter") {
          cm.updateLineGutter(lineView, lineN, dims);
        } else if (type == "class") {
          cm.updateLineClasses(lineView);
        } else if (type == "widget") {
          cm.updateLineWidgets(lineView, dims);
        }
      }
      lineView.changes = null;
    },

    // Lines with gutter elements, widgets or a background class need to
    // be wrapped, and have the extra elements added to the wrapper div
   ensureLineWrapped :function (lineView) {
      if (lineView.node == lineView.text) {
        lineView.node = elt("div", null, null, "position: relative");
        if (lineView.text.parentNode)
          lineView.text.parentNode.replaceChild(lineView.node, lineView.text);
        lineView.node.appendChild(lineView.text);
        if (ie && ie_version < 8) lineView.node.style.zIndex = 2;
      }
      return lineView.node;
    },

    updateLineBackground : function (lineView) {
      var cls = lineView.bgClass ? lineView.bgClass + " " + (lineView.line.bgClass || "") : lineView.line.bgClass;
      if (cls) cls += " CodeMirror-linebackground";
      if (lineView.background) {
        if (cls) lineView.background.className = cls;
        else { lineView.background.parentNode.removeChild(lineView.background); lineView.background = null; }
      } else if (cls) {
        var wrap = this.ensureLineWrapped(lineView);
        lineView.background = wrap.insertBefore(elt("div", null, cls), wrap.firstChild);
      }
    },

    // Wrapper around buildLineContent which will reuse the structure
    // in display.externalMeasured when possible.
    getLineContent : function (lineView) {
      var cm = this;
      var ext = cm.display.externalMeasured;
      if (ext && ext.line == lineView.line) {
        cm.display.externalMeasured = null;
        lineView.measure = ext.measure;
        return ext.built;
      }
      return cm.buildLineContent(lineView);
    },

    // Redraw the line's text. Interacts with the background and text
    // classes because the mode may output tokens that influence these
    // classes.
    updateLineText : function (lineView) {
      var cm = this;
      var cls = lineView.text.className;
      var built = getLineContent(cm, lineView);
      if (lineView.text == lineView.node) lineView.node = built.pre;
      lineView.text.parentNode.replaceChild(built.pre, lineView.text);
      lineView.text = built.pre;
      if (built.bgClass != lineView.bgClass || built.textClass != lineView.textClass) {
        lineView.bgClass = built.bgClass;
        lineView.textClass = built.textClass;
        this.updateLineClasses(lineView);
      } else if (cls) {
        lineView.text.className = cls;
      }
    },

    updateLineClasses :function (lineView) {
      updateLineBackground(lineView);
      if (lineView.line.wrapClass)
        ensureLineWrapped(lineView).className = lineView.line.wrapClass;
      else if (lineView.node != lineView.text)
        lineView.node.className = "";
      var textClass = lineView.textClass ? lineView.textClass + " " + (lineView.line.textClass || "") : lineView.line.textClass;
      lineView.text.className = textClass || "";
    },

    updateLineGutter : function (lineView, lineN, dims) {
      var cm = this;
      if (lineView.gutter) {
        lineView.node.removeChild(lineView.gutter);
        lineView.gutter = null;
      }
      if (lineView.gutterBackground) {
        lineView.node.removeChild(lineView.gutterBackground);
        lineView.gutterBackground = null;
      }
      if (lineView.line.gutterClass) {
        var wrap = ensureLineWrapped(lineView);
        lineView.gutterBackground = elt("div", null, "CodeMirror-gutter-background " + lineView.line.gutterClass,
                                        "left: " + (cm.options.fixedGutter ? dims.fixedPos : -dims.gutterTotalWidth) +
                                        "px; width: " + dims.gutterTotalWidth + "px");
        wrap.insertBefore(lineView.gutterBackground, lineView.text);
      }
      var markers = lineView.line.gutterMarkers;
      if (cm.options.lineNumbers || markers) {
        var wrap = ensureLineWrapped(lineView);
        var gutterWrap = lineView.gutter = elt("div", null, "CodeMirror-gutter-wrapper", "left: " +
                                               (cm.options.fixedGutter ? dims.fixedPos : -dims.gutterTotalWidth) + "px");
        cm.display.input.setUneditable(gutterWrap);
        wrap.insertBefore(gutterWrap, lineView.text);
        if (lineView.line.gutterClass)
          gutterWrap.className += " " + lineView.line.gutterClass;
        if (cm.options.lineNumbers && (!markers || !markers["CodeMirror-linenumbers"]))
          lineView.lineNumber = gutterWrap.appendChild(
            elt("div", cm.lineNumberFor(cm.options, lineN),
                "CodeMirror-linenumber CodeMirror-gutter-elt",
                "left: " + dims.gutterLeft["CodeMirror-linenumbers"] + "px; width: "
                + cm.display.lineNumInnerWidth + "px"));
        if (markers) for (var k = 0; k < cm.options.gutters.length; ++k) {
          var id = cm.options.gutters[k], found = markers.hasOwnProperty(id) && markers[id];
          if (found)
            gutterWrap.appendChild(elt("div", [found], "CodeMirror-gutter-elt", "left: " +
                                       dims.gutterLeft[id] + "px; width: " + dims.gutterWidth[id] + "px"));
        }
      }
    },

    updateLineWidgets : function (lineView, dims) {
      var cm = this;
      if (lineView.alignable) lineView.alignable = null;
      for (var node = lineView.node.firstChild, next; node; node = next) {
        var next = node.nextSibling;
        if (node.className == "CodeMirror-linewidget")
          lineView.node.removeChild(node);
      }
      cm.insertLineWidgets(lineView, dims);
    },

    // Build a line's DOM representation from scratch
    buildLineElement : function (lineView, lineN, dims) {
      var cm = this;
      var built = cm.getLineContent(lineView);
      lineView.text = lineView.node = built.pre;
      if (built.bgClass) lineView.bgClass = built.bgClass;
      if (built.textClass) lineView.textClass = built.textClass;

      cm.updateLineClasses(lineView);
      cm.updateLineGutter(lineView, lineN, dims);
      cm.insertLineWidgets(lineView, dims);
      return lineView.node;
    },

    // A lineView may contain multiple logical lines (when merged by
    // collapsed spans). The widgets for all of them need to be drawn.
    insertLineWidgets : function (lineView, dims) {
      var cm = this;
      cm.insertLineWidgetsFor(lineView.line, lineView, dims, true);
      if (lineView.rest) for (var i = 0; i < lineView.rest.length; i++)
        cm.insertLineWidgetsFor(cm, lineView.rest[i], lineView, dims, false);
    },

    insertLineWidgetsFor : function (line, lineView, dims, allowAbove) {
      var cm = this;
      if (!line.widgets) return;
      var wrap = cm.ensureLineWrapped(lineView);
      for (var i = 0, ws = line.widgets; i < ws.length; ++i) {
        var widget = ws[i], node = elt("div", [widget.node], "CodeMirror-linewidget");
        if (!widget.handleMouseEvents) node.setAttribute("cm-ignore-events", "true");
        cm.positionLineWidget(widget, node, lineView, dims);
        cm.display.input.setUneditable(node);
        if (allowAbove && widget.above)
          wrap.insertBefore(node, lineView.gutter || lineView.text);
        else
          wrap.appendChild(node);
        cm.signalLater(widget, "redraw");
      }
    },

    positionLineWidget : function (widget, node, lineView, dims) {
      if (widget.noHScroll) {
        (lineView.alignable || (lineView.alignable = [])).push(node);
        var width = dims.wrapperWidth;
        node.style.left = dims.fixedPos + "px";
        if (!widget.coverGutter) {
          width -= dims.gutterTotalWidth;
          node.style.paddingLeft = dims.gutterTotalWidth + "px";
        }
        node.style.width = width + "px";
      }
      if (widget.coverGutter) {
        node.style.zIndex = 5;
        node.style.position = "relative";
        if (!widget.noHScroll) node.style.marginLeft = -dims.gutterTotalWidth + "px";
      }
    }
  });

});
