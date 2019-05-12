define([
    "skylark-langx/klass",
    "../util/browser",
    "../util/dom",
    "../CoderCtor"
],function(klass, browser, dom, CoderCtor) {

  var measureText;

  // DISPLAY CONSTRUCTOR

  // The display handles the DOM integration, both for input reading
  // and content drawing. It holds references to DOM nodes and
  // display-related state.

    var Display = klass({
        klassName : "Display",

        _construct :   function (place, doc, input) {
            var d = this;
            this.input = input;

            // Covers bottom-right square when both scrollbars are present.
            d.scrollbarFiller = dom.elt("div", null, "CodeMirror-scrollbar-filler");
            d.scrollbarFiller.setAttribute("cm-not-content", "true");
            // Covers bottom of gutter when coverGutterNextToScrollbar is on
            // and h scrollbar is present.
            d.gutterFiller = dom.elt("div", null, "CodeMirror-gutter-filler");
            d.gutterFiller.setAttribute("cm-not-content", "true");
            // Will contain the actual code, positioned to cover the viewport.
            d.lineDiv = dom.elt("div", null, "CodeMirror-code");
            // Elements are added to these to represent selection and cursors.
            d.selectionDiv = dom.elt("div", null, null, "position: relative; z-index: 1");
            d.cursorDiv = dom.elt("div", null, "CodeMirror-cursors");
            // A visibility: hidden element used to find the size of things.
            d.measure = dom.elt("div", null, "CodeMirror-measure");
            // When lines outside of the viewport are measured, they are drawn in this.
            d.lineMeasure = dom.elt("div", null, "CodeMirror-measure");
            // Wraps everything that needs to exist inside the vertically-padded coordinate system
            d.lineSpace = dom.elt("div", [d.measure, d.lineMeasure, d.selectionDiv, d.cursorDiv, d.lineDiv],
                              null, "position: relative; outline: none");
            // Moved around its parent to cover visible view.
            d.mover = dom.elt("div", [dom.elt("div", [d.lineSpace], "CodeMirror-lines")], null, "position: relative");
            // Set to the height of the document, allowing scrolling.
            d.sizer = dom.elt("div", [d.mover], "CodeMirror-sizer");
            d.sizerWidth = null;
            // Behavior of dom.elts with overflow: auto and padding is
            // inconsistent across browsers. This is used to ensure the
            // scrollable area is big enough.
            d.heightForcer = dom.elt("div", null, null, "position: absolute; height: " + scrollerGap + "px; width: 1px;");
            // Will contain the gutters, if any.
            d.gutters = dom.elt("div", null, "CodeMirror-gutters");
            d.lineGutter = null;
            // Actual scrollable element.
            d.scroller = dom.elt("div", [d.sizer, d.heightForcer, d.gutters], "CodeMirror-scroll");
            d.scroller.setAttribute("tabIndex", "-1");
            // The element in which the editor lives.
            d.wrapper = dom.elt("div", [d.scrollbarFiller, d.gutterFiller, d.scroller], "CodeMirror");

            // Work around IE7 z-index bug (not perfect, hence IE7 not really being supported)
            if (ie && ie_version < 8) { d.gutters.style.zIndex = -1; d.scroller.style.paddingRight = 0; }
            if (!webkit && !(gecko && mobile)) d.scroller.draggable = true;

            if (place) {
              if (place.appendChild) {
                place.appendChild(d.wrapper);
              } else {
                place(d.wrapper);
              }
            }

            // Current rendered range (may be bigger than the view window).
            d.viewFrom = d.viewTo = doc.first;
            d.reportedViewFrom = d.reportedViewTo = doc.first;
            // Information about the rendered lines.
            d.view = [];
            d.renderedView = null;
            // Holds info about a single rendered line when it was rendered
            // for measurement, while not in view.
            d.externalMeasured = null;
            // Empty space (in pixels) above the view
            d.viewOffset = 0;
            d.lastWrapHeight = d.lastWrapWidth = 0;
            d.updateLineNumbers = null;

            d.nativeBarWidth = d.barHeight = d.barWidth = 0;
            d.scrollbarsClipped = false;

            // Used to only resize the line number gutter when necessary (when
            // the amount of lines crosses a boundary that makes its width change)
            d.lineNumWidth = d.lineNumInnerWidth = d.lineNumChars = null;
            // Set to true when a non-horizontal-scrolling line widget is
            // added. As an optimization, line widget aligning is skipped when
            // this is false.
            d.alignWidgets = false;

            d.cachedCharWidth = d.cachedTextHeight = d.cachedPaddingH = null;

            // Tracks the maximum line length so that the horizontal scrollbar
            // can be kept static when scrolling.
            d.maxLine = null;
            d.maxLineLength = 0;
            d.maxLineChanged = false;

            // Used for measuring wheel scrolling granularity
            d.wheelDX = d.wheelDY = d.wheelStartX = d.wheelStartY = null;

            // True when shift is held down.
            d.shift = false;

            // Used to track whether anything happened since the context menu
            // was opened.
            d.selForContextMenu = null;

            d.activeTouch = null;

            input.init(d);
        },

        // Return true when the given mouse event happened in a widget
        eventInWidget : function (e) {
            var display = this;
            for (var n = e_target(e); n != display.wrapper; n = n.parentNode) {
              if (!n || (n.nodeType == 1 && n.getAttribute("cm-ignore-events") == "true") ||
                  (n.parentNode == display.sizer && n != display.mover))
                return true;
            }
        },

        paddingTop : function () {
            var display = this;

            return display.lineSpace.offsetTop;
        },

        paddingVert : function () {
            var display = this;

            return display.mover.offsetHeight - display.lineSpace.offsetHeight;
        },

        paddingH : function () {
            var display = this;

            if (display.cachedPaddingH) return display.cachedPaddingH;
            var e = dom.removeChildrenAndAdd(display.measure, dom.elt("pre", "x"));
            var style = window.getComputedStyle ? window.getComputedStyle(e) : e.currentStyle;
            var data = {left: parseInt(style.paddingLeft), right: parseInt(style.paddingRight)};
            if (!isNaN(data.left) && !isNaN(data.right)) display.cachedPaddingH = data;
            return data;
        },

        // Compute the default text height.
        textHeight : function () {
            var display = this;

            if (display.cachedTextHeight != null) return display.cachedTextHeight;
            if (measureText == null) {
              measureText = dom.elt("pre");
              // Measure a bunch of lines, for browsers that compute
              // fractional heights.
              for (var i = 0; i < 49; ++i) {
                measureText.appendChild(document.createTextNode("x"));
                measureText.appendChild(dom.elt("br"));
              }
              measureText.appendChild(document.createTextNode("x"));
            }
            dom.removeChildrenAndAdd(display.measure, measureText);
            var height = measureText.offsetHeight / 50;
            if (height > 3) display.cachedTextHeight = height;
            removeChildren(display.measure);
            return height || 1;
        },

        // Compute the default character width.
        charWidth : function () {
            var display = this;

            if (display.cachedCharWidth != null) return display.cachedCharWidth;
            
            var anchor = dom.elt("span", "xxxxxxxxxx");
            var pre = dom.elt("pre", [anchor]);
            dom.removeChildrenAndAdd(display.measure, pre);
            var rect = anchor.getBoundingClientRect(), width = (rect.right - rect.left) / 10;
            if (width > 2) display.cachedCharWidth = width;
            return width || 10;
        }
            
    });

    return Display;

});
