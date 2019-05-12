define([
  "../CoderCtor"
],function(CoderCtor) {
 
  CoderCtor.partial({
    // Finds the line to start with when starting a parse. Tries to
    // find a line with a stateAfter, so that it can start with a
    // valid state. If that fails, it returns the line with the
    // smallest indentation, which tends to need the least context to
    // parse correctly.
    findStartLine : function(n, precise) {
      var cm = this;

      var minindent, minline, doc = cm.doc;
      var lim = precise ? -1 : n - (cm.doc.mode.innerMode ? 1000 : 100);
      for (var search = n; search > lim; --search) {
        if (search <= doc.first) return doc.first;
        var line = getLine(doc, search - 1);
        if (line.stateAfter && (!precise || search <= doc.frontier)) return search;
        var indented = countColumn(line.text, null, cm.options.tabSize);
        if (minline == null || minindent > indented) {
          minline = search - 1;
          minindent = indented;
        }
      }
      return minline;
    },


    // Compute a style array (an array starting with a mode generation
    // -- for invalidation -- followed by pairs of end positions and
    // style strings), which is used to highlight the tokens on the
    // line.
    highlightLine : function (line, state, forceToEnd) {
      var cm = this;

      // A styles array always starts with a number identifying the
      // mode/overlays that it is based on (for easy invalidation).
      var st = [cm.state.modeGen], lineClasses = {};
      // Compute the base array of styles
      runMode(cm, line.text, cm.doc.mode, state, function(end, style) {
        st.push(end, style);
      }, lineClasses, forceToEnd);

      // Run overlays, adjust style array.
      for (var o = 0; o < cm.state.overlays.length; ++o) {
        var overlay = cm.state.overlays[o], i = 1, at = 0;
        runMode(cm, line.text, overlay.mode, true, function(end, style) {
          var start = i;
          // Ensure there's a token end at the current position, and that i points at it
          while (at < end) {
            var i_end = st[i];
            if (i_end > end)
              st.splice(i, 1, end, st[i+1], i_end);
            i += 2;
            at = Math.min(end, i_end);
          }
          if (!style) return;
          if (overlay.opaque) {
            st.splice(start, i - start, end, "cm-overlay " + style);
            i = start + 2;
          } else {
            for (; start < i; start += 2) {
              var cur = st[start+1];
              st[start+1] = (cur ? cur + " " : "") + "cm-overlay " + style;
            }
          }
        }, lineClasses);
      }

      return {styles: st, classes: lineClasses.bgClass || lineClasses.textClass ? lineClasses : null};
    },


    getLineStyles : function (line, updateFrontier) {
      var cm = this;

      if (!line.styles || line.styles[0] != cm.state.modeGen) {
        var state = cm.getStateBefore(lineNo(line));
        var result = cm.highlightLine(line, line.text.length > cm.options.maxHighlightLength ? copyState(cm.doc.mode, state) : state);
        line.stateAfter = state;
        line.styles = result.styles;
        if (result.classes) line.styleClasses = result.classes;
        else if (line.styleClasses) line.styleClasses = null;
        if (updateFrontier === cm.doc.frontier) cm.doc.frontier++;
      }
      return line.styles;
    },

    // Lightweight form of highlight -- proceed over this line and
    // update state, but don't save a style array. Used for lines that
    // aren't currently visible.
    processLine : function (text, state, startAt) {
      var cm = this;

      var mode = cm.doc.mode;
      var stream = new StringStream(text, cm.options.tabSize);
      stream.start = stream.pos = startAt || 0;
      if (text == "") {
        callBlankLine(mode, state);
      }
      while (!stream.eol()) {
        readToken(mode, stream, state);
        stream.start = stream.pos;
      }
    }
  });

  function readToken(mode, stream, state, inner) {
    for (var i = 0; i < 10; i++) {
      if (inner) inner[0] = CodeMirror.innerMode(mode, state).mode;
      var style = mode.token(stream, state);
      if (stream.pos > stream.start) return style;
    }
    throw new Error("Mode " + mode.name + " failed to advance stream.");
  }

  // Utility for getTokenAt and getLineTokens
  function takeToken(cm, pos, precise, asArray) {
    function getObj(copy) {
      return {start: stream.start, end: stream.pos,
              string: stream.current(),
              type: style || null,
              state: copy ? copyState(doc.mode, state) : state};
    }

    var doc = cm.doc, mode = doc.mode, style;
    pos = clipPos(doc, pos);
    var line = getLine(doc, pos.line), state = getStateBefore(cm, pos.line, precise);
    var stream = new StringStream(line.text, cm.options.tabSize), tokens;
    if (asArray) tokens = [];
    while ((asArray || stream.pos < pos.ch) && !stream.eol()) {
      stream.start = stream.pos;
      style = readToken(mode, stream, state);
      if (asArray) tokens.push(getObj(true));
    }
    return asArray ? tokens : getObj();
  }

 // Run the given mode's parser over a line, calling f for each token.
  function runMode(cm, text, mode, state, f, lineClasses, forceToEnd) {
    var flattenSpans = mode.flattenSpans;
    if (flattenSpans == null) flattenSpans = cm.options.flattenSpans;
    var curStart = 0, curStyle = null;
    var stream = new StringStream(text, cm.options.tabSize), style;
    var inner = cm.options.addModeClass && [null];
    if (text == "") extractLineClasses(callBlankLine(mode, state), lineClasses);
    while (!stream.eol()) {
      if (stream.pos > cm.options.maxHighlightLength) {
        flattenSpans = false;
        if (forceToEnd) processLine(cm, text, state, stream.pos);
        stream.pos = text.length;
        style = null;
      } else {
        style = extractLineClasses(readToken(mode, stream, state, inner), lineClasses);
      }
      if (inner) {
        var mName = inner[0].name;
        if (mName) style = "m-" + (style ? mName + " " + style : mName);
      }
      if (!flattenSpans || curStyle != style) {
        while (curStart < stream.start) {
          curStart = Math.min(stream.start, curStart + 50000);
          f(curStart, curStyle);
        }
        curStyle = style;
      }
      stream.start = stream.pos;
    }
    while (curStart < stream.pos) {
      // Webkit seems to refuse to render text nodes longer than 57444 characters
      var pos = Math.min(stream.pos, curStart + 50000);
      f(pos, curStyle);
      curStart = pos;
    }
  }


});
