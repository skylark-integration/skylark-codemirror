define([
  "skylark-langx/klass",
  "../CoderCtor"
],function(klass, CoderCtor) {
  // POSITION OBJECT

  // A Pos instance represents a position within the text.
  var Pos = klass({
    _construct : function(line,ch) {
      this.line = line; 
      this.ch = ch;
    },
    compareTo : function(other) {
      return this.line - other.line || this.ch - other.ch; 
    },

    clone : function() {
      return new Pos(this.line,thie.ch);
    }
  });

  // Compare two positions, return 0 if they are the same, a negative
  // number when a is less, and a positive number otherwise.
  var cmp =  Pos.compare = function(a, b) { 
    return a.compareTo(b);
  };

  function copyPos(x) {
    return x.clone();
  }

  function maxPos(a, b) { 
    return cmp(a, b) < 0 ? b : a; 
  }

  function minPos(a, b) { 
    return cmp(a, b) < 0 ? a : b; 
  }

  // Most of the external API clips given positions to make sure they
  // actually exist within the document.
  function clipLine(doc, n) {
    return Math.max(doc.first, Math.min(n, doc.first + doc.size - 1));
  }
  
  function clipPos(doc, pos) {
    if (pos.line < doc.first) return Pos(doc.first, 0);
    var last = doc.first + doc.size - 1;
    if (pos.line > last) return Pos(last, getLine(doc, last).text.length);
    return clipToLen(pos, getLine(doc, pos.line).text.length);
  }

  function clipToLen(pos, linelen) {
    var ch = pos.ch;
    if (ch == null || ch > linelen) return Pos(pos.line, linelen);
    else if (ch < 0) return Pos(pos.line, 0);
    else return pos;
  }

  function isLine(doc, l) {
    return l >= doc.first && l < doc.first + doc.size;
  }
  
  function clipPosArray(doc, array) {
    for (var out = [], i = 0; i < array.length; i++) out[i] = clipPos(doc, array[i]);
    return out;
  }


});
