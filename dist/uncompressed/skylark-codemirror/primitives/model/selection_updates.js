define([
    '../util/operation_group',
    '../display/scrolling',
    '../line/pos',
    '../line/utils_line',
    '../util/event',
    '../util/misc',
    './history',
    './selection'
], function (operation_group, scrolling, m_pos, utils_line, m_event, misc, m_history, m_selection) {
    'use strict';
    function extendRange(range, head, other, extend) {
        if (extend) {
            let anchor = range.anchor;
            if (other) {
                let posBefore = m_pos.cmp(head, anchor) < 0;
                if (posBefore != m_pos.cmp(other, anchor) < 0) {
                    anchor = head;
                    head = other;
                } else if (posBefore != m_pos.cmp(head, other) < 0) {
                    head = other;
                }
            }
            return new m_selection.Range(anchor, head);
        } else {
            return new m_selection.Range(other || head, head);
        }
    }
    function extendSelection(doc, head, other, options, extend) {
        if (extend == null)
            extend = doc.cm && (doc.cm.display.shift || doc.extend);
        setSelection(doc, new m_selection.Selection([extendRange(doc.sel.primary(), head, other, extend)], 0), options);
    }
    function extendSelections(doc, heads, options) {
        let out = [];
        let extend = doc.cm && (doc.cm.display.shift || doc.extend);
        for (let i = 0; i < doc.sel.ranges.length; i++)
            out[i] = extendRange(doc.sel.ranges[i], heads[i], null, extend);
        let newSel = m_selection.normalizeSelection(doc.cm, out, doc.sel.primIndex);
        setSelection(doc, newSel, options);
    }
    function replaceOneSelection(doc, i, range, options) {
        let ranges = doc.sel.ranges.slice(0);
        ranges[i] = range;
        setSelection(doc, m_selection.normalizeSelection(doc.cm, ranges, doc.sel.primIndex), options);
    }
    function setSimpleSelection(doc, anchor, head, options) {
        setSelection(doc, m_selection.simpleSelection(anchor, head), options);
    }
    function filterSelectionChange(doc, sel, options) {
        let obj = {
            ranges: sel.ranges,
            update: function (ranges) {
                this.ranges = [];
                for (let i = 0; i < ranges.length; i++)
                    this.ranges[i] = new m_selection.Range(m_pos.clipPos(doc, ranges[i].anchor), m_pos.clipPos(doc, ranges[i].head));
            },
            origin: options && options.origin
        };
        m_event.signal(doc, 'beforeSelectionChange', doc, obj);
        if (doc.cm)
            m_event.signal(doc.cm, 'beforeSelectionChange', doc.cm, obj);
        if (obj.ranges != sel.ranges)
            return m_selection.normalizeSelection(doc.cm, obj.ranges, obj.ranges.length - 1);
        else
            return sel;
    }
    function setSelectionReplaceHistory(doc, sel, options) {
        let done = doc.history.done, last = misc.lst(done);
        if (last && last.ranges) {
            done[done.length - 1] = sel;
            setSelectionNoUndo(doc, sel, options);
        } else {
            setSelection(doc, sel, options);
        }
    }
    function setSelection(doc, sel, options) {
        setSelectionNoUndo(doc, sel, options);
        m_history.addSelectionToHistory(doc, doc.sel, doc.cm ? doc.cm.curOp.id : NaN, options);
    }
    function setSelectionNoUndo(doc, sel, options) {
        if (m_event.hasHandler(doc, 'beforeSelectionChange') || doc.cm && m_event.hasHandler(doc.cm, 'beforeSelectionChange'))
            sel = filterSelectionChange(doc, sel, options);
        let bias = options && options.bias || (m_pos.cmp(sel.primary().head, doc.sel.primary().head) < 0 ? -1 : 1);
        setSelectionInner(doc, skipAtomicInSelection(doc, sel, bias, true));
        if (!(options && options.scroll === false) && doc.cm)
            scrolling.ensureCursorVisible(doc.cm);
    }
    function setSelectionInner(doc, sel) {
        if (sel.equals(doc.sel))
            return;
        doc.sel = sel;
        if (doc.cm) {
            doc.cm.curOp.updateInput = 1;
            doc.cm.curOp.selectionChanged = true;
            m_event.signalCursorActivity(doc.cm);
        }
        operation_group.signalLater(doc, 'cursorActivity', doc);
    }
    function reCheckSelection(doc) {
        setSelectionInner(doc, skipAtomicInSelection(doc, doc.sel, null, false));
    }
    function skipAtomicInSelection(doc, sel, bias, mayClear) {
        let out;
        for (let i = 0; i < sel.ranges.length; i++) {
            let range = sel.ranges[i];
            let old = sel.ranges.length == doc.sel.ranges.length && doc.sel.ranges[i];
            let newAnchor = skipAtomic(doc, range.anchor, old && old.anchor, bias, mayClear);
            let newHead = skipAtomic(doc, range.head, old && old.head, bias, mayClear);
            if (out || newAnchor != range.anchor || newHead != range.head) {
                if (!out)
                    out = sel.ranges.slice(0, i);
                out[i] = new m_selection.Range(newAnchor, newHead);
            }
        }
        return out ? m_selection.normalizeSelection(doc.cm, out, sel.primIndex) : sel;
    }
    function skipAtomicInner(doc, pos, oldPos, dir, mayClear) {
        let line = utils_line.getLine(doc, pos.line);
        if (line.markedSpans)
            for (let i = 0; i < line.markedSpans.length; ++i) {
                let sp = line.markedSpans[i], m = sp.marker;
                if ((sp.from == null || (m.inclusiveLeft ? sp.from <= pos.ch : sp.from < pos.ch)) && (sp.to == null || (m.inclusiveRight ? sp.to >= pos.ch : sp.to > pos.ch))) {
                    if (mayClear) {
                        m_event.signal(m, 'beforeCursorEnter');
                        if (m.explicitlyCleared) {
                            if (!line.markedSpans)
                                break;
                            else {
                                --i;
                                continue;
                            }
                        }
                    }
                    if (!m.atomic)
                        continue;
                    if (oldPos) {
                        let near = m.find(dir < 0 ? 1 : -1), diff;
                        if (dir < 0 ? m.inclusiveRight : m.inclusiveLeft)
                            near = movePos(doc, near, -dir, near && near.line == pos.line ? line : null);
                        if (near && near.line == pos.line && (diff = m_pos.cmp(near, oldPos)) && (dir < 0 ? diff < 0 : diff > 0))
                            return skipAtomicInner(doc, near, pos, dir, mayClear);
                    }
                    let far = m.find(dir < 0 ? -1 : 1);
                    if (dir < 0 ? m.inclusiveLeft : m.inclusiveRight)
                        far = movePos(doc, far, dir, far.line == pos.line ? line : null);
                    return far ? skipAtomicInner(doc, far, pos, dir, mayClear) : null;
                }
            }
        return pos;
    }
    function skipAtomic(doc, pos, oldPos, bias, mayClear) {
        let dir = bias || 1;
        let found = skipAtomicInner(doc, pos, oldPos, dir, mayClear) || !mayClear && skipAtomicInner(doc, pos, oldPos, dir, true) || skipAtomicInner(doc, pos, oldPos, -dir, mayClear) || !mayClear && skipAtomicInner(doc, pos, oldPos, -dir, true);
        if (!found) {
            doc.cantEdit = true;
            return m_pos.Pos(doc.first, 0);
        }
        return found;
    }
    function movePos(doc, pos, dir, line) {
        if (dir < 0 && pos.ch == 0) {
            if (pos.line > doc.first)
                return m_pos.clipPos(doc, m_pos.Pos(pos.line - 1));
            else
                return null;
        } else if (dir > 0 && pos.ch == (line || utils_line.getLine(doc, pos.line)).text.length) {
            if (pos.line < doc.first + doc.size - 1)
                return m_pos.Pos(pos.line + 1, 0);
            else
                return null;
        } else {
            return new m_pos.Pos(pos.line, pos.ch + dir);
        }
    }
    function selectAll(cm) {
        cm.setSelection(m_pos.Pos(cm.firstLine(), 0), m_pos.Pos(cm.lastLine()), misc.sel_dontScroll);
    }
    return {
        extendRange: extendRange,
        extendSelection: extendSelection,
        extendSelections: extendSelections,
        replaceOneSelection: replaceOneSelection,
        setSimpleSelection: setSimpleSelection,
        setSelectionReplaceHistory: setSelectionReplaceHistory,
        setSelection: setSelection,
        setSelectionNoUndo: setSelectionNoUndo,
        reCheckSelection: reCheckSelection,
        skipAtomic: skipAtomic,
        selectAll: selectAll
    };
});