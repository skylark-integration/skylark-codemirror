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
    saw_special_spans, 
    m_spans, 
    m_utils_line, 
    m_position_measurement, 
    m_browser, 
    m_dom, 
    m_event, 
    m_misc, 
    m_update_line, 
//    j, 
//    k, 
//    l, 
    m_selection, 
    m_update_lines, 
    m_view_tracking
) {
    'use strict';
    class DisplayUpdate {
        constructor(cm, viewport, force) {
            let display = cm.display;
            this.viewport = viewport;
            this.visible = m_update_lines.visibleLines(display, cm.doc, viewport);
            this.editorIsHidden = !display.wrapper.offsetWidth;
            this.wrapperHeight = display.wrapper.clientHeight;
            this.wrapperWidth = display.wrapper.clientWidth;
            this.oldDisplayWidth = m_position_measurement.displayWidth(cm);
            this.force = force;
            this.dims = m_position_measurement.getDimensions(cm);
            this.events = [];
        }
        signal(emitter, type) {
            if (m_event.hasHandler(emitter, type))
                this.events.push(arguments);
        }
        finish() {
            for (let i = 0; i < this.events.length; i++)
                m_event.signal.apply(null, this.events[i]);
        }
    }
    function maybeClipScrollbars(cm) {
        let display = cm.display;
        if (!display.scrollbarsClipped && display.scroller.offsetWidth) {
            display.nativeBarWidth = display.scroller.offsetWidth - display.scroller.clientWidth;
            display.heightForcer.style.height = m_position_measurement.scrollGap(cm) + 'px';
            display.sizer.style.marginBottom = -display.nativeBarWidth + 'px';
            display.sizer.style.borderRightWidth = m_position_measurement.scrollGap(cm) + 'px';
            display.scrollbarsClipped = true;
        }
    }
    function selectionSnapshot(cm) {
        if (cm.hasFocus())
            return null;
        let active = m_dom.activeElt();
        if (!active || !m_dom.contains(cm.display.lineDiv, active))
            return null;
        let result = { activeElt: active };
        if (window.getSelection) {
            let sel = window.getSelection();
            if (sel.anchorNode && sel.extend && m_dom.contains(cm.display.lineDiv, sel.anchorNode)) {
                result.anchorNode = sel.anchorNode;
                result.anchorOffset = sel.anchorOffset;
                result.focusNode = sel.focusNode;
                result.focusOffset = sel.focusOffset;
            }
        }
        return result;
    }
    function restoreSelection(snapshot) {
        if (!snapshot || !snapshot.activeElt || snapshot.activeElt == m_dom.activeElt())
            return;
        snapshot.activeElt.focus();
        if (snapshot.anchorNode && m_dom.contains(document.body, snapshot.anchorNode) && m_dom.contains(document.body, snapshot.focusNode)) {
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
            m_view_tracking.resetView(cm);
            return false;
        }
        if (!update.force && update.visible.from >= display.viewFrom && update.visible.to <= display.viewTo && (display.updateLineNumbers == null || display.updateLineNumbers >= display.viewTo) && display.renderedView == display.view && m_view_tracking.countDirtyView(cm) == 0)
            return false;
        if (cm.maybeUpdateLineNumberWidth()) { //if (k.maybeUpdateLineNumberWidth(cm)) {
            m_view_tracking.resetView(cm);
            update.dims = m_position_measurement.getDimensions(cm);
        }
        let end = doc.first + doc.size;
        let from = Math.max(update.visible.from - cm.options.viewportMargin, doc.first);
        let to = Math.min(end, update.visible.to + cm.options.viewportMargin);
        if (display.viewFrom < from && from - display.viewFrom < 20)
            from = Math.max(doc.first, display.viewFrom);
        if (display.viewTo > to && display.viewTo - to < 20)
            to = Math.min(end, display.viewTo);
        if (saw_special_spans.sawCollapsedSpans) {
            from = m_spans.visualLineNo(cm.doc, from);
            to = m_spans.visualLineEndNo(cm.doc, to);
        }
        let different = from != display.viewFrom || to != display.viewTo || display.lastWrapHeight != update.wrapperHeight || display.lastWrapWidth != update.wrapperWidth;
        m_view_tracking.adjustView(cm, from, to);
        display.viewOffset = m_spans.heightAtLine(m_utils_line.getLine(cm.doc, display.viewFrom));
        cm.display.mover.style.top = display.viewOffset + 'px';
        let toUpdate = m_view_tracking.countDirtyView(cm);
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
        m_dom.removeChildren(display.cursorDiv);
        m_dom.removeChildren(display.selectionDiv);
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
            if (!first || !cm.options.lineWrapping || update.oldDisplayWidth == m_position_measurement.displayWidth(cm)) {
                if (viewport && viewport.top != null)
                    viewport = { top: Math.min(cm.doc.height + m_position_measurement.paddingVert(cm.display) - m_position_measurement.displayHeight(cm), viewport.top) };
                update.visible = m_update_lines.visibleLines(cm.display, cm.doc, viewport);
                if (update.visible.from >= cm.display.viewFrom && update.visible.to <= cm.display.viewTo)
                    break;
            }
            if (!updateDisplayIfNeeded(cm, update))
                break;
            m_update_lines.updateHeightsInViewport(cm);
            let barMeasure = cm.measureForScrollbars(); //l.measureForScrollbars(cm);
            m_selection.updateSelection(cm);
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
            m_update_lines.updateHeightsInViewport(cm);
            postUpdateDisplay(cm, update);
            let barMeasure = cm.measureForScrollbars(); //l.measureForScrollbars(cm);
            m_selection.updateSelection(cm);
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
            if (m_browser.webkit && m_browser.mac && cm.display.currentWheelTarget == node)
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
                    if (m_misc.indexOf(lineView.changes, 'gutter') > -1)
                        updateNumber = false;
                    m_update_line.updateLineForChanges(cm, lineView, lineN, dims);
                }
                if (updateNumber) {
                    m_dom.removeChildren(lineView.lineNumber);
                    lineView.lineNumber.appendChild(document.createTextNode(m_utils_line.lineNumberFor(cm.options, lineN)));
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
        cm.display.gutters.style.height = measure.docHeight + cm.display.barHeight + m_position_measurement.scrollGap(cm) + 'px';
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