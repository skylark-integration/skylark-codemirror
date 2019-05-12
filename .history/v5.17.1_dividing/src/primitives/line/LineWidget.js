define([
  "skylark-langx/Evented",
  "../CoderCtor"
],function(Evented,CoderCtor) {

  // Line widgets are block elements displayed above or below a line.

  var LineWidget = Evented.inherit({
    _construct : function(doc, node, options) {
      if (options) {
        for (var opt in options) {
          if (options.hasOwnProperty(opt)) {
            this[opt] = options[opt];
          }
        }
      }
      this.doc = doc;
      this.node = node;
    },

    clear : function() {
      var cm = this.doc.cm, 
          ws = this.line.widgets, 
          line = this.line, 
          no = lineNo(line);

      if (no == null || !ws) return;
      for (var i = 0; i < ws.length; ++i) if (ws[i] == this) ws.splice(i--, 1);
      if (!ws.length) line.widgets = null;
      var height = widgetHeight(this);

      updateLineHeight(line, Math.max(0, line.height - height));
      if (cm) runInOp(cm, function() {
        cm.adjustScrollWhenAboveVisible(line, -height);
        cm.regLineChange( no, "widget");
      });
    },

    changed : function() {
      var oldH = this.height, cm = this.doc.cm, line = this.line;
      this.height = null;
      var diff = widgetHeight(this) - oldH;
      if (!diff) return;
      updateLineHeight(line, line.height + diff);
      if (cm) runInOp(cm, function() {
        cm.curOp.forceUpdate = true;
        adjustScrollWhenAboveVisible(cm, line, diff);
      });
    }
  });

  function adjustScrollWhenAboveVisible(cm, line, diff) {
    if (heightAtLine(line) < ((cm.curOp && cm.curOp.scrollTop) || cm.doc.scrollTop))
      addToScrollPos(cm, null, diff);
  }

  function widgetHeight(widget) {
    if (widget.height != null) return widget.height;
    var cm = widget.doc.cm;
    if (!cm) return 0;
    if (!contains(document.body, widget.node)) {
      var parentStyle = "position: relative;";
      if (widget.coverGutter)
        parentStyle += "margin-left: -" + cm.display.gutters.offsetWidth + "px;";
      if (widget.noHScroll)
        parentStyle += "width: " + cm.display.wrapper.clientWidth + "px;";
      removeChildrenAndAdd(cm.display.measure, elt("div", [widget.node], null, parentStyle));
    }
    return widget.height = widget.node.parentNode.offsetHeight;
  }

  function addLineWidget(doc, handle, node, options) {
    var widget = new LineWidget(doc, node, options);
    var cm = doc.cm;
    if (cm && widget.noHScroll) cm.display.alignWidgets = true;
    changeLine(handle, "widget", function(line) {
      var widgets = line.widgets || (line.widgets = []);
      if (widget.insertAt == null) widgets.push(widget);
      else widgets.splice(Math.min(widgets.length - 1, Math.max(0, widget.insertAt)), 0, widget);
      widget.line = line;
      if (cm && !lineIsHidden(doc, line)) {
        var aboveVisible = heightAtLine(line) < doc.scrollTop;
        updateLineHeight(line, line.height + widgetHeight(widget));
        if (aboveVisible) addToScrollPos(cm, null, widget.height);
        cm.curOp.forceUpdate = true;
      }
      return true;
    });
    return widget;
  }


});
