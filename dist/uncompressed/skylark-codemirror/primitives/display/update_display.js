define([
    '../line/saw_special_spans',
    '../line/spans',
    '../line/utils_line',
    '../measurement/position_measurement',
    '../util/browser',
    '../util/dom',
    '../util/event',
    '../util/misc',
    './update_line',
//    './highlight_worker', // dependence cycle 
//    './line_numbers',
//    './scrollbars',
    './selection',
    './update_lines',
    './view_tracking'
], function (
    a, 
    b, 
    c, 
    d, 
    e, 
    f, 
    g, 
    h, 
    m_update_line, 
//    j, 
//    k, 
//    l, 
    m, 
    n, 
    o
) {
    'use strict';
    class DisplayUpdate {
        constructor(cm, viewport, force) {
            let display = cm.display;
            this.viewport = viewport;
            this.visible = n.visibleLines(display, cm.doc, viewport);
            this.editorIsHidden = !display.wrapper.offsetWidth;
            this.wrapperHeight = display.wrapper.clientHeight;
            this.wrapperWidth = display.wrapper.clientWidth;
            this.oldDisplayWidth = d.displayWidth(cm);
            this.force = force;
            this.dims = d.getDimensions(cm);
            this.events = [];
        }
        signal(emitter, type) {
            if (g.hasHandler(emitter, type))
                this.events.push(arguments);
        }
        finish() {
            for (let i = 0; i < this.events.length; i++)
                g.signal.apply(null, this.events[i]);
        }
    }
    function maybeClipScrollbars(cm) {
        let display = cm.display;
        if (!display.scrollbarsClipped && display.scroller.offsetWidth) {
            display.nativeBarWidth = display.scroller.offsetWidth - display.scroller.clientWidth;
            display.heightForcer.style.height = d.scrollGap(cm) + 'px';
            display.sizer.style.marginBottom = -display.nativeBarWidth + 'px';
            display.sizer.style.borderRightWidth = d.scrollGap(cm) + 'px';
            display.scrollbarsClipped = true;
        }
    }
    function selectionSnapshot(cm) {
        if (cm.hasFocus())
            return null;
        let active = f.activeElt();
        if (!active || !f.contains(cm.display.lineDiv, active))
            return null;
        let result = { activeElt: active };
        if (window.getSelection) {
            let sel = window.getSelection();
            if (sel.anchorNode && sel.extend && f.contains(cm.display.lineDiv, sel.anchorNode)) {
                result.anchorNode = sel.anchorNode;
                result.anchorOffset = sel.anchorOffset;
                result.focusNode = sel.focusNode;
                result.focusOffset = sel.focusOffset;
            }
        }
        return result;
    }
    function restoreSelection(snapshot) {
        if (!snapshot || !snapshot.activeElt || snapshot.activeElt == f.activeElt())
            return;
        snapshot.activeElt.focus();
        if (snapshot.anchorNode && f.contains(document.body, snapshot.anchorNode) && f.contains(document.body, snapshot.focusNode)) {
            let sel = window.getSelection(), range = document.createRange();
            range.setEnd(snapshot.anchorNode, snapshot.anchorOffset);
            range.collapse(false);
            sel.removeAllRanges();
            sel.addRange(range);
            sel.extend(snapshot.focusNode, snapshot.focusOffset);
        }
    }
    function updateDisplayIfNeeded(cm, update) {
        let display = cm.display, doc = cm.doc;
        if (update.editorIsHidden) {
            o.resetView(cm);
            return false;
        }
        if (!update.force && update.visible.from >= display.viewFrom && update.visible.to <= display.viewTo && (display.updateLineNumbers == null || display.updateLineNumbers >= display.viewTo) && display.renderedView == display.view && o.countDirtyView(cm) == 0)
            return false;
        if (cm.maybeUpdateLineNumberWidth()) { //if (k.maybeUpdateLineNumberWidth(cm)) {
            o.resetView(cm);
            update.dims = d.getDimensions(cm);
        }
        let end = doc.first + doc.size;
        let from = Math.max(update.visible.from - cm.options.viewportMargin, doc.first);
        let to = Math.min(end, update.visible.to + cm.options.viewportMargin);
        if (display.viewFrom < from && from - display.viewFrom < 20)
            from = Math.max(doc.first, display.viewFrom);
        if (display.viewTo > to && display.viewTo - to < 20)
            to = Math.min(end, display.viewTo);
        if (a.sawCollapsedSpans) {
            from = b.visualLineNo(cm.doc, from);
            to = b.visualLineEndNo(cm.doc, to);
        }
        let different = from != display.viewFrom || to != display.viewTo || display.lastWrapHeight != update.wrapperHeight || display.lastWrapWidth != update.wrapperWidth;
        o.adjustView(cm, from, to);
        display.viewOffset = b.heightAtLine(c.getLine(cm.doc, display.viewFrom));
        cm.display.mover.style.top = display.viewOffset + 'px';
        let toUpdate = o.countDirtyView(cm);
        if (!different && toUpdate == 0 && !update.force && display.renderedView == display.view && (display.updateLineNumbers == null || display.updateLineNumbers >= display.viewTo))
            return false;
        let selSnapshot = selectionSnapshot(cm);
        if (toUpdate > 4)
            display.lineDiv.style.display = 'none';
        patchDisplay(cm, display.updateLineNumbers, update.dims);
        if (toUpdate > 4)
            display.lineDiv.style.display = '';
        display.renderedView = display.view;
        restoreSelection(selSnapshot);
        f.removeChildren(display.cursorDiv);
        f.removeChildren(display.selectionDiv);
        display.gutters.style.height = display.sizer.style.minHeight = 0;
        if (different) {
            display.lastWrapHeight = update.wrapperHeight;
            display.lastWrapWidth = update.wrapperWidth;
            cm.startWorker(400); // j.startWorker(cm, 400);
        }
        display.updateLineNumbers = null;
        return true;
    }
    function postUpdateDisplay(cm, update) {
        let viewport = update.viewport;
        for (let first = true;; first = false) {
            if (!first || !cm.options.lineWrapping || update.oldDisplayWidth == d.displayWidth(cm)) {
                if (viewport && viewport.top != null)
                    viewport = { top: Math.min(cm.doc.height + d.paddingVert(cm.display) - d.displayHeight(cm), viewport.top) };
                update.visible = n.visibleLines(cm.display, cm.doc, viewport);
                if (update.visible.from >= cm.display.viewFrom && update.visible.to <= cm.display.viewTo)
                    break;
            }
            if (!updateDisplayIfNeeded(cm, update))
                break;
            n.updateHeightsInViewport(cm);
            let barMeasure = cm.measureForScrollbars(); //l.measureForScrollbars(cm);
            m.updateSelection(cm);
            cm.updateScrollbars(barMeasure); //l.updateScrollbars(cm, barMeasure);
            setDocumentHeight(cm, barMeasure);
            update.force = false;
        }
        update.signal(cm, 'update', cm);
        if (cm.display.viewFrom != cm.display.reportedViewFrom || cm.display.viewTo != cm.display.reportedViewTo) {
            update.signal(cm, 'viewportChange', cm, cm.display.viewFrom, cm.display.viewTo);
            cm.display.reportedViewFrom = cm.display.viewFrom;
            cm.display.reportedViewTo = cm.display.viewTo;
        }
    }
    function updateDisplaySimple(cm, viewport) {
        let update = new DisplayUpdate(cm, viewport);
        if (updateDisplayIfNeeded(cm, update)) {
            n.updateHeightsInViewport(cm);
            postUpdateDisplay(cm, update);
            let barMeasure = cm.measureForScrollbars(); //l.measureForScrollbars(cm);
            m.updateSelection(cm);
            cm.updateScrollbars(barMeasure); // l.updateScrollbars(cm, barMeasure);
            setDocumentHeight(cm, barMeasure);
            update.finish();
        }
    }
    function patchDisplay(cm, updateNumbersFrom, dims) {
        let display = cm.display, lineNumbers = cm.options.lineNumbers;
        let container = display.lineDiv, cur = container.firstChild;
        function rm(node) {
            let next = node.nextSibling;
            if (e.webkit && e.mac && cm.display.currentWheelTarget == node)
                node.style.display = 'none';
            else
                node.parentNode.removeChild(node);
            return next;
        }
        let view = display.view, lineN = display.viewFrom;
        for (let i = 0; i < view.length; i++) {
            let lineView = view[i];
            if (lineView.hidden) {
            } else if (!lineView.node || lineView.node.parentNode != container) {
                let node = m_update_line.buildLineElement(cm, lineView, lineN, dims);
                container.insertBefore(node, cur);
            } else {
                while (cur != lineView.node)
                    cur = rm(cur);
                let updateNumber = lineNumbers && updateNumbersFrom != null && updateNumbersFrom <= lineN && lineView.lineNumber;
                if (lineView.changes) {
                    if (h.indexOf(lineView.changes, 'gutter') > -1)
                        updateNumber = false;
                    m_update_line.updateLineForChanges(cm, lineView, lineN, dims);
                }
                if (updateNumber) {
                    f.removeChildren(lineView.lineNumber);
                    lineView.lineNumber.appendChild(document.createTextNode(c.lineNumberFor(cm.options, lineN)));
                }
                cur = lineView.node.nextSibling;
            }
            lineN += lineView.size;
        }
        while (cur)
            cur = rm(cur);
    }
    function updateGutterSpace(cm) {
        let width = cm.display.gutters.offsetWidth;
        cm.display.sizer.style.marginLeft = width + 'px';
    }
    function setDocumentHeight(cm, measure) {
        cm.display.sizer.style.minHeight = measure.docHeight + 'px';
        cm.display.heightForcer.style.top = measure.docHeight + 'px';
        cm.display.gutters.style.height = measure.docHeight + cm.display.barHeight + d.scrollGap(cm) + 'px';
    }
    return {
        DisplayUpdate: DisplayUpdate,
        maybeClipScrollbars: maybeClipScrollbars,
        updateDisplayIfNeeded: updateDisplayIfNeeded,
        postUpdateDisplay: postUpdateDisplay,
        updateDisplaySimple: updateDisplaySimple,
        updateGutterSpace: updateGutterSpace,
        setDocumentHeight: setDocumentHeight
    };
});