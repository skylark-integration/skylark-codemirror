define([
    '../util/browser',
    '../util/dom',
    '../util/misc'
], function (a, b, c) {
    'use strict';
    function Display(place, doc, input) {
        let d = this;
        this.input = input;
        d.scrollbarFiller = b.elt('div', null, 'CodeMirror-scrollbar-filler');
        d.scrollbarFiller.setAttribute('cm-not-content', 'true');
        d.gutterFiller = b.elt('div', null, 'CodeMirror-gutter-filler');
        d.gutterFiller.setAttribute('cm-not-content', 'true');
        d.lineDiv = b.eltP('div', null, 'CodeMirror-code');
        d.selectionDiv = b.elt('div', null, null, 'position: relative; z-index: 1');
        d.cursorDiv = b.elt('div', null, 'CodeMirror-cursors');
        d.measure = b.elt('div', null, 'CodeMirror-measure');
        d.lineMeasure = b.elt('div', null, 'CodeMirror-measure');
        d.lineSpace = b.eltP('div', [
            d.measure,
            d.lineMeasure,
            d.selectionDiv,
            d.cursorDiv,
            d.lineDiv
        ], null, 'position: relative; outline: none');
        let lines = b.eltP('div', [d.lineSpace], 'CodeMirror-lines');
        d.mover = b.elt('div', [lines], null, 'position: relative');
        d.sizer = b.elt('div', [d.mover], 'CodeMirror-sizer');
        d.sizerWidth = null;
        d.heightForcer = b.elt('div', null, null, 'position: absolute; height: ' + c.scrollerGap + 'px; width: 1px;');
        d.gutters = b.elt('div', null, 'CodeMirror-gutters');
        d.lineGutter = null;
        d.scroller = b.elt('div', [
            d.sizer,
            d.heightForcer,
            d.gutters
        ], 'CodeMirror-scroll');
        d.scroller.setAttribute('tabIndex', '-1');
        d.wrapper = b.elt('div', [
            d.scrollbarFiller,
            d.gutterFiller,
            d.scroller
        ], 'CodeMirror');
        if (a.ie && a.ie_version < 8) {
            d.gutters.style.zIndex = -1;
            d.scroller.style.paddingRight = 0;
        }
        if (!a.webkit && !(a.gecko && a.mobile))
            d.scroller.draggable = true;
        if (place) {
            if (place.appendChild)
                place.appendChild(d.wrapper);
            else
                place(d.wrapper);
        }
        d.viewFrom = d.viewTo = doc.first;
        d.reportedViewFrom = d.reportedViewTo = doc.first;
        d.view = [];
        d.renderedView = null;
        d.externalMeasured = null;
        d.viewOffset = 0;
        d.lastWrapHeight = d.lastWrapWidth = 0;
        d.updateLineNumbers = null;
        d.nativeBarWidth = d.barHeight = d.barWidth = 0;
        d.scrollbarsClipped = false;
        d.lineNumWidth = d.lineNumInnerWidth = d.lineNumChars = null;
        d.alignWidgets = false;
        d.cachedCharWidth = d.cachedTextHeight = d.cachedPaddingH = null;
        d.maxLine = null;
        d.maxLineLength = 0;
        d.maxLineChanged = false;
        d.wheelDX = d.wheelDY = d.wheelStartX = d.wheelStartY = null;
        d.shift = false;
        d.selForContextMenu = null;
        d.activeTouch = null;
        input.init(d);
    }
    return { Display: Display };
});