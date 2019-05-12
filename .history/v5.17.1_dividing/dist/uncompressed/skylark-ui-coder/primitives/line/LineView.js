define([
  "skylark-langx/Evented",
],function(Evented){
  // These objects are used to represent the visible (currently drawn)
  // part of the document. A LineView may correspond to multiple
  // logical lines, if those are connected by collapsed ranges.
  var LineView = Evented.iherit({
  	klassName : "LineView",
  	
    _construct : function(doc, line, lineN) {
      // The starting line
      this.line = line;
      // Continuing lines, if any
      this.rest = visualLineContinued(line);
      // Number of logical lines in this visual line
      this.size = this.rest ? lineNo(lst(this.rest)) - lineN + 1 : 1;
      this.node = this.text = null;
      this.hidden = lineIsHidden(doc, line);      
    },

    locateNodeInLineView : function (node, offset) {
      var lineView = this;
      
      var wrapper = lineView.text.firstChild, bad = false;
      if (!node || !contains(wrapper, node)) return badPos(Pos(lineNo(lineView.line), 0), true);
      if (node == wrapper) {
        bad = true;
        node = wrapper.childNodes[offset];
        offset = 0;
        if (!node) {
          var line = lineView.rest ? lst(lineView.rest) : lineView.line;
          return badPos(Pos(lineNo(line), line.text.length), bad);
        }
      }

      var textNode = node.nodeType == 3 ? node : null, topNode = node;
      if (!textNode && node.childNodes.length == 1 && node.firstChild.nodeType == 3) {
        textNode = node.firstChild;
        if (offset) offset = textNode.nodeValue.length;
      }
      while (topNode.parentNode != wrapper) topNode = topNode.parentNode;
      var measure = lineView.measure, maps = measure.maps;

      function find(textNode, topNode, offset) {
        for (var i = -1; i < (maps ? maps.length : 0); i++) {
          var map = i < 0 ? measure.map : maps[i];
          for (var j = 0; j < map.length; j += 3) {
            var curNode = map[j + 2];
            if (curNode == textNode || curNode == topNode) {
              var line = lineNo(i < 0 ? lineView.line : lineView.rest[i]);
              var ch = map[j] + offset;
              if (offset < 0 || curNode != textNode) ch = map[j + (offset ? 1 : 0)];
              return Pos(line, ch);
            }
          }
        }
      }
      var found = find(textNode, topNode, offset);
      if (found) return badPos(found, bad);

      // FIXME this is all really shaky. might handle the few cases it needs to handle, but likely to cause problems
      for (var after = topNode.nextSibling, dist = textNode ? textNode.nodeValue.length - offset : 0; after; after = after.nextSibling) {
        found = find(after, after.firstChild, 0);
        if (found)
          return badPos(Pos(found.line, found.ch - dist), bad);
        else
          dist += after.textContent.length;
      }
      for (var before = topNode.previousSibling, dist = offset; before; before = before.previousSibling) {
        found = find(before, before.firstChild, -1);
        if (found)
          return badPos(Pos(found.line, found.ch + dist), bad);
        else
          dist += after.textContent.length;
      }
    }
   
  });
});