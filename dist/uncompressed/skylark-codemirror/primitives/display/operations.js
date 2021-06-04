define([
    '../line/pos',
    '../line/spans',
    '../measurement/position_measurement',
    '../util/event',
    '../util/dom',
    '../util/operation_group',
    './focus',
    './scrollbars',
    './selection',
    './scrolling',
    './update_display',
    './update_lines'
], function (m_pos, m_spans, position_measurement, m_event, m_dom, m_operation_group, m_focus, m_scrollbars, m_selection, m_scrolling, m_update_display, m_update_lines) {
    'use strict';
    let nextOpId = 0;
    function startOperation(cm) {
        cm.curOp = {
            cm: cm,
            viewChanged: false,
            startHeight: cm.doc.height,
            forceUpdate: false,
            updateInput: 0,
            typing: false,
            changeObjs: null,
            cursorActivityHandlers: null,
            cursorActivityCalled: 0,
            selectionChanged: false,
            updateMaxLine: false,
            scrollLeft: null,
            scrollTop: null,
            scrollToPos: null,
            focus: false,
            id: ++nextOpId
        };
        m_operation_group.pushOperation(cm.curOp);
    }
    function endOperation(cm) {
        let op = cm.curOp;
        if (op)
            m_operation_group.finishOperation(op, group => {
                for (let i = 0; i < group.ops.length; i++)
                    group.ops[i].cm.curOp = null;
                endOperations(group);
            });
    }
    function endOperations(group) {
        let ops = group.ops;
        for (let i = 0; i < ops.length; i++)
            endOperation_R1(ops[i]);
        for (let i = 0; i < ops.length; i++)
            endOperation_W1(ops[i]);
        for (let i = 0; i < ops.length; i++)
            endOperation_R2(ops[i]);
        for (let i = 0; i < ops.length; i++)
            endOperation_W2(ops[i]);
        for (let i = 0; i < ops.length; i++)
            endOperation_finish(ops[i]);
    }
    function endOperation_R1(op) {
        let cm = op.cm, display = cm.display;
        m_update_display.maybeClipScrollbars(cm);
        if (op.updateMaxLine)
            m_spans.findMaxLine(cm);
        op.mustUpdate = op.viewChanged || op.forceUpdate || op.scrollTop != null || op.scrollToPos && (op.scrollToPos.from.line < display.viewFrom || op.scrollToPos.to.line >= display.viewTo) || display.maxLineChanged && cm.options.lineWrapping;
        op.update = op.mustUpdate && new m_update_display.DisplayUpdate(cm, op.mustUpdate && {
            top: op.scrollTop,
            ensure: op.scrollToPos
        }, op.forceUpdate);
    }
    function endOperation_W1(op) {
        op.updatedDisplay = op.mustUpdate && m_update_display.updateDisplayIfNeeded(op.cm, op.update);
    }
    function endOperation_R2(op) {
        let cm = op.cm, display = cm.display;
        if (op.updatedDisplay)
            m_update_lines.updateHeightsInViewport(cm);
        op.barMeasure = m_scrollbars.measureForScrollbars(cm);
        if (display.maxLineChanged && !cm.options.lineWrapping) {
            op.adjustWidthTo = position_measurement.measureChar(cm, display.maxLine, display.maxLine.text.length).left + 3;
            cm.display.sizerWidth = op.adjustWidthTo;
            op.barMeasure.scrollWidth = Math.max(display.scroller.clientWidth, display.sizer.offsetLeft + op.adjustWidthTo + position_measurement.scrollGap(cm) + cm.display.barWidth);
            op.maxScrollLeft = Math.max(0, display.sizer.offsetLeft + op.adjustWidthTo - position_measurement.displayWidth(cm));
        }
        if (op.updatedDisplay || op.selectionChanged)
            op.preparedSelection = display.input.prepareSelection();
    }
    function endOperation_W2(op) {
        let cm = op.cm;
        if (op.adjustWidthTo != null) {
            cm.display.sizer.style.minWidth = op.adjustWidthTo + 'px';
            if (op.maxScrollLeft < cm.doc.scrollLeft)
                m_scrolling.setScrollLeft(cm, Math.min(cm.display.scroller.scrollLeft, op.maxScrollLeft), true);
            cm.display.maxLineChanged = false;
        }
        let takeFocus = op.focus && op.focus == m_dom.activeElt();
        if (op.preparedSelection)
            cm.display.input.showSelection(op.preparedSelection, takeFocus);
        if (op.updatedDisplay || op.startHeight != cm.doc.height)
            m_scrollbars.updateScrollbars(cm, op.barMeasure);
        if (op.updatedDisplay)
            m_update_display.setDocumentHeight(cm, op.barMeasure);
        if (op.selectionChanged)
            m_selection.restartBlink(cm);
        if (cm.state.focused && op.updateInput)
            cm.display.input.reset(op.typing);
        if (takeFocus)
            m_focus.ensureFocus(op.cm);
    }
    function endOperation_finish(op) {
        let cm = op.cm, display = cm.display, doc = cm.doc;
        if (op.updatedDisplay)
            m_update_display.postUpdateDisplay(cm, op.update);
        if (display.wheelStartX != null && (op.scrollTop != null || op.scrollLeft != null || op.scrollToPos))
            display.wheelStartX = display.wheelStartY = null;
        if (op.scrollTop != null)
            m_scrolling.setScrollTop(cm, op.scrollTop, op.forceScroll);
        if (op.scrollLeft != null)
            m_scrolling.setScrollLeft(cm, op.scrollLeft, true, true);
        if (op.scrollToPos) {
            let rect = m_scrolling.scrollPosIntoView(cm, m_pos.clipPos(doc, op.scrollToPos.from), m_pos.clipPos(doc, op.scrollToPos.to), op.scrollToPos.margin);
            m_scrolling.maybeScrollWindow(cm, rect);
        }
        let hidden = op.maybeHiddenMarkers, unhidden = op.maybeUnhiddenMarkers;
        if (hidden)
            for (let i = 0; i < hidden.length; ++i)
                if (!hidden[i].lines.length)
                    m_event.signal(hidden[i], 'hide');
        if (unhidden)
            for (let i = 0; i < unhidden.length; ++i)
                if (unhidden[i].lines.length)
                    m_event.signal(unhidden[i], 'unhide');
        if (display.wrapper.offsetHeight)
            doc.scrollTop = cm.display.scroller.scrollTop;
        if (op.changeObjs)
            m_event.signal(cm, 'changes', cm, op.changeObjs);
        if (op.update)
            op.update.finish();
    }
    function runInOp(cm, f) {
        if (cm.curOp)
            return f();
        startOperation(cm);
        try {
            return f();
        } finally {
            endOperation(cm);
        }
    }
    function operation(cm, f) {
        return function () {
            if (cm.curOp)
                return f.apply(cm, arguments);
            startOperation(cm);
            try {
                return f.apply(cm, arguments);
            } finally {
                endOperation(cm);
            }
        };
    }
    function methodOp(f) {
        return function () {
            if (this.curOp)
                return f.apply(this, arguments);
            startOperation(this);
            try {
                return f.apply(this, arguments);
            } finally {
                endOperation(this);
            }
        };
    }
    function docMethodOp(f) {
        return function () {
            let cm = this.cm;
            if (!cm || cm.curOp)
                return f.apply(this, arguments);
            startOperation(cm);
            try {
                return f.apply(this, arguments);
            } finally {
                endOperation(cm);
            }
        };
    }
    return {
        startOperation: startOperation,
        endOperation: endOperation,
        runInOp: runInOp,
        operation: operation,
        methodOp: methodOp,
        docMethodOp: docMethodOp
    };
});