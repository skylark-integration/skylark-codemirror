define([
  "../CoderCtor"
],function(CoderCtor) {
  // INPUT HANDLING

    function disableBrowserMagic(field) {
      field.setAttribute("autocorrect", "off");
      field.setAttribute("autocapitalize", "off");
      field.setAttribute("spellcheck", "false");
    }


  // This will be set to a {lineWise: bool, text: [string]} object, so
  // that, when pasting, we know what kind of selections the copied
  // text was made out of.
  var lastCopied = null;

  CoderCtor.partial({
    applyTextInput : function(inserted, deleted, sel, origin) {
      var cm = this;

      var doc = cm.doc;
      cm.display.shift = false;
      if (!sel) sel = doc.sel;

      var paste = cm.state.pasteIncoming || origin == "paste";
      var textLines = doc.splitLines(inserted), multiPaste = null
      // When pasing N lines into N selections, insert one line per selection
      if (paste && sel.ranges.length > 1) {
        if (lastCopied && lastCopied.text.join("\n") == inserted) {
          if (sel.ranges.length % lastCopied.text.length == 0) {
            multiPaste = [];
            for (var i = 0; i < lastCopied.text.length; i++)
              multiPaste.push(doc.splitLines(lastCopied.text[i]));
          }
        } else if (textLines.length == sel.ranges.length) {
          multiPaste = map(textLines, function(l) { return [l]; });
        }
      }

      // Normal behavior is to insert the new text into every selection
      for (var i = sel.ranges.length - 1; i >= 0; i--) {
        var range = sel.ranges[i];
        var from = range.from(), to = range.to();
        if (range.empty()) {
          if (deleted && deleted > 0) // Handle deletion
            from = Pos(from.line, from.ch - deleted);
          else if (cm.state.overwrite && !paste) // Handle overwrite
            to = Pos(to.line, Math.min(getLine(doc, to.line).text.length, to.ch + lst(textLines).length));
          else if (lastCopied && lastCopied.lineWise && lastCopied.text.join("\n") == inserted)
            from = to = Pos(from.line, 0)
        }
        var updateInput = cm.curOp.updateInput;
        var changeEvent = {from: from, to: to, text: multiPaste ? multiPaste[i % multiPaste.length] : textLines,
                           origin: origin || (paste ? "paste" : cm.state.cutIncoming ? "cut" : "+input")};
        makeChange(cm.doc, changeEvent);
        cm.signalLater("inputRead", cm, changeEvent);
      }
      if (inserted && !paste)
        cm.triggerElectric(inserted);

      cm.ensureCursorVisible();
      cm.curOp.updateInput = updateInput;
      cm.curOp.typing = true;
      cm.state.pasteIncoming = cm.state.cutIncoming = false;
    },

    handlePaste : function (e) {
      var cm = this;

      var pasted = e.clipboardData && e.clipboardData.getData("text/plain");
      if (pasted) {
        e.preventDefault();
        if (!cm.isReadOnly() && !cm.options.disableInput)
          cm.runInOp(function() { cm.applyTextInput(pasted, 0, null, "paste"); });
        return true;
      }
    },

    triggerElectric : function (inserted) {
      var cm = this;

      // When an 'electric' character is inserted, immediately trigger a reindent
      if (!cm.options.electricChars || !cm.options.smartIndent) return;
      var sel = cm.doc.sel;

      for (var i = sel.ranges.length - 1; i >= 0; i--) {
        var range = sel.ranges[i];
        if (range.head.ch > 100 || (i && sel.ranges[i - 1].head.line == range.head.line)) continue;
        var mode = cm.getModeAt(range.head);
        var indented = false;
        if (mode.electricChars) {
          for (var j = 0; j < mode.electricChars.length; j++)
            if (inserted.indexOf(mode.electricChars.charAt(j)) > -1) {
              indented = cm.indentLine(range.head.line, "smart");
              break;
            }
        } else if (mode.electricInput) {
          if (mode.electricInput.test(cm.doc.getLine(range.head.line).text.slice(0, range.head.ch)))
            indented = cm.indentLine(range.head.line, "smart");
        }
        if (indented) cm.signalLater("electricInput", cm, range.head.line);
      }
    },

    copyableRanges : function () {
      var cm = this;

      var text = [], ranges = [];
      for (var i = 0; i < cm.doc.sel.ranges.length; i++) {
        var line = cm.doc.sel.ranges[i].head.line;
        var lineRange = {anchor: Pos(line, 0), head: Pos(line + 1, 0)};
        ranges.push(lineRange);
        text.push(cm.getRange(lineRange.anchor, lineRange.head));
      }
      return {text: text, ranges: ranges};
    },

    posToDOM : function (pos) {
      var cm = this;

      var view = cm.findViewForLine(pos.line);
      if (!view || view.hidden) return null;
      var line = cm.doc.getLine(pos.line);
      var info = mapFromLineView(view, line, pos.line);

      var order = getOrder(line), side = "left";
      if (order) {
        var partPos = getBidiPartAt(order, pos.ch);
        side = partPos % 2 ? "right" : "left";
      }
      var result = nodeAndOffsetInLineMap(info.map, pos.ch, side);
      result.offset = result.collapse == "right" ? result.end : result.start;
      return result;
    },

    domToPos : function (node, offset) {
      var cm = this;

      var lineNode;
      if (node == cm.display.lineDiv) {
        lineNode = cm.display.lineDiv.childNodes[offset];
        if (!lineNode) return badPos(cm.clipPos(Pos(cm.display.viewTo - 1)), true);
        node = null; offset = 0;
      } else {
        for (lineNode = node;; lineNode = lineNode.parentNode) {
          if (!lineNode || lineNode == cm.display.lineDiv) return null;
          if (lineNode.parentNode && lineNode.parentNode == cm.display.lineDiv) break;
        }
      }
      for (var i = 0; i < cm.display.view.length; i++) {
        var lineView = cm.display.view[i];
        if (lineView.node == lineNode)
          return lineView.locateNodeInLineView(node, offset);
      }
    },

    domTextBetween : function (from, to, fromLine, toLine) {
      var cm = this;

      var text = "", closing = false, lineSep = cm.doc.lineSeparator();
      function recognizeMarker(id) { return function(marker) { return marker.id == id; }; }
      function walk(node) {
        if (node.nodeType == 1) {
          var cmText = node.getAttribute("cm-text");
          if (cmText != null) {
            if (cmText == "") cmText = node.textContent.replace(/\u200b/g, "");
            text += cmText;
            return;
          }
          var markerID = node.getAttribute("cm-marker"), range;
          if (markerID) {
            var found = cm.findMarks(Pos(fromLine, 0), Pos(toLine + 1, 0), recognizeMarker(+markerID));
            if (found.length && (range = found[0].find()))
              text += getBetween(cm.doc, range.from, range.to).join(lineSep);
            return;
          }
          if (node.getAttribute("contenteditable") == "false") return;
          for (var i = 0; i < node.childNodes.length; i++)
            walk(node.childNodes[i]);
          if (/^(pre|div|p)$/i.test(node.nodeName))
            closing = true;
        } else if (node.nodeType == 3) {
          var val = node.nodeValue;
          if (!val) return;
          if (closing) {
            text += lineSep;
            closing = false;
          }
          text += val;
        }
      }
      for (;;) {
        walk(from);
        if (from == to) break;
        from = from.nextSibling;
      }
      return text;
    }


  });

});
