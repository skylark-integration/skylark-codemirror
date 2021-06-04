define([
    '../line/line_data',
    '../line/saw_special_spans',
    '../line/spans',
    '../measurement/position_measurement',
    '../util/misc'
], function (m_line_data, m_saw_special_spans, m_spans, m_position_measurement, m_misc) {
    'use strict';
    function regChange(cm, from, to, lendiff) {
        if (from == null)
            from = cm.doc.first;
        if (to == null)
            to = cm.doc.first + cm.doc.size;
        if (!lendiff)
            lendiff = 0;
        let display = cm.display;
        if (lendiff && to < display.viewTo && (display.updateLineNumbers == null || display.updateLineNumbers > from))
            display.updateLineNumbers = from;
        cm.curOp.viewChanged = true;
        if (from >= display.viewTo) {
            if (m_saw_special_spans.sawCollapsedSpans && m_spans.visualLineNo(cm.doc, from) < display.viewTo)
                resetView(cm);
        } else if (to <= display.viewFrom) {
            if (m_saw_special_spans.sawCollapsedSpans && m_spans.visualLineEndNo(cm.doc, to + lendiff) > display.viewFrom) {
                resetView(cm);
            } else {
                display.viewFrom += lendiff;
                display.viewTo += lendiff;
            }
        } else if (from <= display.viewFrom && to >= display.viewTo) {
            resetView(cm);
        } else if (from <= display.viewFrom) {
            let cut = viewCuttingPoint(cm, to, to + lendiff, 1);
            if (cut) {
                display.view = display.view.slice(cut.index);
                display.viewFrom = cut.lineN;
                display.viewTo += lendiff;
            } else {
                resetView(cm);
            }
        } else if (to >= display.viewTo) {
            let cut = viewCuttingPoint(cm, from, from, -1);
            if (cut) {
                display.view = display.view.slice(0, cut.index);
                display.viewTo = cut.lineN;
            } else {
                resetView(cm);
            }
        } else {
            let cutTop = viewCuttingPoint(cm, from, from, -1);
            let cutBot = viewCuttingPoint(cm, to, to + lendiff, 1);
            if (cutTop && cutBot) {
                display.view = display.view.slice(0, cutTop.index).concat(m_line_data.buildViewArray(cm, cutTop.lineN, cutBot.lineN)).concat(display.view.slice(cutBot.index));
                display.viewTo += lendiff;
            } else {
                resetView(cm);
            }
        }
        let ext = display.externalMeasured;
        if (ext) {
            if (to < ext.lineN)
                ext.lineN += lendiff;
            else if (from < ext.lineN + ext.size)
                display.externalMeasured = null;
        }
    }
    function regLineChange(cm, line, type) {
        cm.curOp.viewChanged = true;
        let display = cm.display, ext = cm.display.externalMeasured;
        if (ext && line >= ext.lineN && line < ext.lineN + ext.size)
            display.externalMeasured = null;
        if (line < display.viewFrom || line >= display.viewTo)
            return;
        let lineView = display.view[m_position_measurement.findViewIndex(cm, line)];
        if (lineView.node == null)
            return;
        let arr = lineView.changes || (lineView.changes = []);
        if (m_misc.indexOf(arr, type) == -1)
            arr.push(type);
    }
    function resetView(cm) {
        cm.display.viewFrom = cm.display.viewTo = cm.doc.first;
        cm.display.view = [];
        cm.display.viewOffset = 0;
    }
    function viewCuttingPoint(cm, oldN, newN, dir) {
        let index = m_position_measurement.findViewIndex(cm, oldN), diff, view = cm.display.view;
        if (!m_saw_special_spans.sawCollapsedSpans || newN == cm.doc.first + cm.doc.size)
            return {
                index: index,
                lineN: newN
            };
        let n = cm.display.viewFrom;
        for (let i = 0; i < index; i++)
            n += view[i].size;
        if (n != oldN) {
            if (dir > 0) {
                if (index == view.length - 1)
                    return null;
                diff = n + view[index].size - oldN;
                index++;
            } else {
                diff = n - oldN;
            }
            oldN += diff;
            newN += diff;
        }
        while (m_spans.visualLineNo(cm.doc, newN) != newN) {
            if (index == (dir < 0 ? 0 : view.length - 1))
                return null;
            newN += dir * view[index - (dir < 0 ? 1 : 0)].size;
            index += dir;
        }
        return {
            index: index,
            lineN: newN
        };
    }
    function adjustView(cm, from, to) {
        let display = cm.display, view = display.view;
        if (view.length == 0 || from >= display.viewTo || to <= display.viewFrom) {
            display.view = m_line_data.buildViewArray(cm, from, to);
            display.viewFrom = from;
        } else {
            if (display.viewFrom > from)
                display.view = m_line_data.buildViewArray(cm, from, display.viewFrom).concat(display.view);
            else if (display.viewFrom < from)
                display.view = display.view.slice(m_position_measurement.findViewIndex(cm, from));
            display.viewFrom = from;
            if (display.viewTo < to)
                display.view = display.view.concat(m_line_data.buildViewArray(cm, display.viewTo, to));
            else if (display.viewTo > to)
                display.view = display.view.slice(0, m_position_measurement.findViewIndex(cm, to));
        }
        display.viewTo = to;
    }
    function countDirtyView(cm) {
        let view = cm.display.view, dirty = 0;
        for (let i = 0; i < view.length; i++) {
            let lineView = view[i];
            if (!lineView.hidden && (!lineView.node || lineView.changes))
                ++dirty;
        }
        return dirty;
    }
    return {
        regChange: regChange,
        regLineChange: regLineChange,
        resetView: resetView,
        adjustView: adjustView,
        countDirtyView: countDirtyView
    };
});