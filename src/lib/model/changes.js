define([
    '../line/highlight',
    '../display/highlight_worker',
    '../display/operations',
    '../display/view_tracking',
    '../line/pos',
    '../line/saw_special_spans',
    '../line/spans',
    '../line/utils_line',
    '../measurement/position_measurement',
    '../util/event',
    '../util/misc',
    '../util/operation_group',
    './change_measurement',
    './document_data',
    './history',
    './selection',
    './selection_updates'
], function (a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q) {
    'use strict';
    function filterChange(doc, change, update) {
        let obj = {
            canceled: false,
            from: change.from,
            to: change.to,
            text: change.text,
            origin: change.origin,
            cancel: () => obj.canceled = true
        };
        if (update)
            obj.update = (from, to, text, origin) => {
                if (from)
                    obj.from = e.clipPos(doc, from);
                if (to)
                    obj.to = e.clipPos(doc, to);
                if (text)
                    obj.text = text;
                if (origin !== undefined)
                    obj.origin = origin;
            };
        j.signal(doc, 'beforeChange', doc, obj);
        if (doc.cm)
            j.signal(doc.cm, 'beforeChange', doc.cm, obj);
        if (obj.canceled) {
            if (doc.cm)
                doc.cm.curOp.updateInput = 2;
            return null;
        }
        return {
            from: obj.from,
            to: obj.to,
            text: obj.text,
            origin: obj.origin
        };
    }
    function makeChange(doc, change, ignoreReadOnly) {
        if (doc.cm) {
            if (!doc.cm.curOp)
                return c.operation(doc.cm, makeChange)(doc, change, ignoreReadOnly);
            if (doc.cm.state.suppressEdits)
                return;
        }
        if (j.hasHandler(doc, 'beforeChange') || doc.cm && j.hasHandler(doc.cm, 'beforeChange')) {
            change = filterChange(doc, change, true);
            if (!change)
                return;
        }
        let split = f.sawReadOnlySpans && !ignoreReadOnly && g.removeReadOnlyRanges(doc, change.from, change.to);
        if (split) {
            for (let i = split.length - 1; i >= 0; --i)
                makeChangeInner(doc, {
                    from: split[i].from,
                    to: split[i].to,
                    text: i ? [''] : change.text,
                    origin: change.origin
                });
        } else {
            makeChangeInner(doc, change);
        }
    }
    function makeChangeInner(doc, change) {
        if (change.text.length == 1 && change.text[0] == '' && e.cmp(change.from, change.to) == 0)
            return;
        let selAfter = m.computeSelAfterChange(doc, change);
        o.addChangeToHistory(doc, change, selAfter, doc.cm ? doc.cm.curOp.id : NaN);
        makeChangeSingleDoc(doc, change, selAfter, g.stretchSpansOverChange(doc, change));
        let rebased = [];
        n.linkedDocs(doc, (doc, sharedHist) => {
            if (!sharedHist && k.indexOf(rebased, doc.history) == -1) {
                rebaseHist(doc.history, change);
                rebased.push(doc.history);
            }
            makeChangeSingleDoc(doc, change, null, g.stretchSpansOverChange(doc, change));
        });
    }
    function makeChangeFromHistory(doc, type, allowSelectionOnly) {
        let suppress = doc.cm && doc.cm.state.suppressEdits;
        if (suppress && !allowSelectionOnly)
            return;
        let hist = doc.history, event, selAfter = doc.sel;
        let source = type == 'undo' ? hist.done : hist.undone, dest = type == 'undo' ? hist.undone : hist.done;
        let i = 0;
        for (; i < source.length; i++) {
            event = source[i];
            if (allowSelectionOnly ? event.ranges && !event.equals(doc.sel) : !event.ranges)
                break;
        }
        if (i == source.length)
            return;
        hist.lastOrigin = hist.lastSelOrigin = null;
        for (;;) {
            event = source.pop();
            if (event.ranges) {
                o.pushSelectionToHistory(event, dest);
                if (allowSelectionOnly && !event.equals(doc.sel)) {
                    q.setSelection(doc, event, { clearRedo: false });
                    return;
                }
                selAfter = event;
            } else if (suppress) {
                source.push(event);
                return;
            } else
                break;
        }
        let antiChanges = [];
        o.pushSelectionToHistory(selAfter, dest);
        dest.push({
            changes: antiChanges,
            generation: hist.generation
        });
        hist.generation = event.generation || ++hist.maxGeneration;
        let filter = j.hasHandler(doc, 'beforeChange') || doc.cm && j.hasHandler(doc.cm, 'beforeChange');
        for (let i = event.changes.length - 1; i >= 0; --i) {
            let change = event.changes[i];
            change.origin = type;
            if (filter && !filterChange(doc, change, false)) {
                source.length = 0;
                return;
            }
            antiChanges.push(o.historyChangeFromChange(doc, change));
            let after = i ? m.computeSelAfterChange(doc, change) : k.lst(source);
            makeChangeSingleDoc(doc, change, after, o.mergeOldSpans(doc, change));
            if (!i && doc.cm)
                doc.cm.scrollIntoView({
                    from: change.from,
                    to: m.changeEnd(change)
                });
            let rebased = [];
            n.linkedDocs(doc, (doc, sharedHist) => {
                if (!sharedHist && k.indexOf(rebased, doc.history) == -1) {
                    rebaseHist(doc.history, change);
                    rebased.push(doc.history);
                }
                makeChangeSingleDoc(doc, change, null, o.mergeOldSpans(doc, change));
            });
        }
    }
    function shiftDoc(doc, distance) {
        if (distance == 0)
            return;
        doc.first += distance;
        doc.sel = new p.Selection(k.map(doc.sel.ranges, range => new p.Range(e.Pos(range.anchor.line + distance, range.anchor.ch), e.Pos(range.head.line + distance, range.head.ch))), doc.sel.primIndex);
        if (doc.cm) {
            d.regChange(doc.cm, doc.first, doc.first - distance, distance);
            for (let d = doc.cm.display, l = d.viewFrom; l < d.viewTo; l++)
                d.regLineChange(doc.cm, l, 'gutter');
        }
    }
    function makeChangeSingleDoc(doc, change, selAfter, spans) {
        if (doc.cm && !doc.cm.curOp)
            return c.operation(doc.cm, makeChangeSingleDoc)(doc, change, selAfter, spans);
        if (change.to.line < doc.first) {
            shiftDoc(doc, change.text.length - 1 - (change.to.line - change.from.line));
            return;
        }
        if (change.from.line > doc.lastLine())
            return;
        if (change.from.line < doc.first) {
            let shift = change.text.length - 1 - (doc.first - change.from.line);
            shiftDoc(doc, shift);
            change = {
                from: e.Pos(doc.first, 0),
                to: e.Pos(change.to.line + shift, change.to.ch),
                text: [k.lst(change.text)],
                origin: change.origin
            };
        }
        let last = doc.lastLine();
        if (change.to.line > last) {
            change = {
                from: change.from,
                to: e.Pos(last, h.getLine(doc, last).text.length),
                text: [change.text[0]],
                origin: change.origin
            };
        }
        change.removed = h.getBetween(doc, change.from, change.to);
        if (!selAfter)
            selAfter = m.computeSelAfterChange(doc, change);
        if (doc.cm)
            makeChangeSingleDocInEditor(doc.cm, change, spans);
        else
            n.updateDoc(doc, change, spans);
        q.setSelectionNoUndo(doc, selAfter, k.sel_dontScroll);
    }
    function makeChangeSingleDocInEditor(cm, change, spans) {
        let doc = cm.doc, display = cm.display, from = change.from, to = change.to;
        let recomputeMaxLength = false, checkWidthStart = from.line;
        if (!cm.options.lineWrapping) {
            checkWidthStart = h.lineNo(g.visualLine(h.getLine(doc, from.line)));
            doc.iter(checkWidthStart, to.line + 1, line => {
                if (line == display.maxLine) {
                    recomputeMaxLength = true;
                    return true;
                }
            });
        }
        if (doc.sel.contains(change.from, change.to) > -1)
            j.signalCursorActivity(cm);
        n.updateDoc(doc, change, spans, i.estimateHeight(cm));
        if (!cm.options.lineWrapping) {
            doc.iter(checkWidthStart, from.line + change.text.length, line => {
                let len = g.lineLength(line);
                if (len > display.maxLineLength) {
                    display.maxLine = line;
                    display.maxLineLength = len;
                    display.maxLineChanged = true;
                    recomputeMaxLength = false;
                }
            });
            if (recomputeMaxLength)
                cm.curOp.updateMaxLine = true;
        }
        a.retreatFrontier(doc, from.line);
        b.startWorker(cm, 400);
        let lendiff = change.text.length - (to.line - from.line) - 1;
        if (change.full)
            d.regChange(cm);
        else if (from.line == to.line && change.text.length == 1 && !n.isWholeLineUpdate(cm.doc, change))
            d.regLineChange(cm, from.line, 'text');
        else
            d.regChange(cm, from.line, to.line + 1, lendiff);
        let changesHandler = j.hasHandler(cm, 'changes'), changeHandler = j.hasHandler(cm, 'change');
        if (changeHandler || changesHandler) {
            let obj = {
                from: from,
                to: to,
                text: change.text,
                removed: change.removed,
                origin: change.origin
            };
            if (changeHandler)
                l.signalLater(cm, 'change', cm, obj);
            if (changesHandler)
                (cm.curOp.changeObjs || (cm.curOp.changeObjs = [])).push(obj);
        }
        cm.display.selForContextMenu = null;
    }
    function replaceRange(doc, code, from, to, origin) {
        if (!to)
            to = from;
        if (e.cmp(to, from) < 0)
            [from, to] = [
                to,
                from
            ];
        if (typeof code == 'string')
            code = doc.splitLines(code);
        makeChange(doc, {
            from,
            to,
            text: code,
            origin
        });
    }
    function rebaseHistSelSingle(pos, from, to, diff) {
        if (to < pos.line) {
            pos.line += diff;
        } else if (from < pos.line) {
            pos.line = from;
            pos.ch = 0;
        }
    }
    function rebaseHistArray(array, from, to, diff) {
        for (let i = 0; i < array.length; ++i) {
            let sub = array[i], ok = true;
            if (sub.ranges) {
                if (!sub.copied) {
                    sub = array[i] = sub.deepCopy();
                    sub.copied = true;
                }
                for (let j = 0; j < sub.ranges.length; j++) {
                    rebaseHistSelSingle(sub.ranges[j].anchor, from, to, diff);
                    rebaseHistSelSingle(sub.ranges[j].head, from, to, diff);
                }
                continue;
            }
            for (let j = 0; j < sub.changes.length; ++j) {
                let cur = sub.changes[j];
                if (to < cur.from.line) {
                    cur.from = e.Pos(cur.from.line + diff, cur.from.ch);
                    cur.to = e.Pos(cur.to.line + diff, cur.to.ch);
                } else if (from <= cur.to.line) {
                    ok = false;
                    break;
                }
            }
            if (!ok) {
                array.splice(0, i + 1);
                i = 0;
            }
        }
    }
    function rebaseHist(hist, change) {
        let from = change.from.line, to = change.to.line, diff = change.text.length - (to - from) - 1;
        rebaseHistArray(hist.done, from, to, diff);
        rebaseHistArray(hist.undone, from, to, diff);
    }
    function changeLine(doc, handle, changeType, op) {
        let no = handle, line = handle;
        if (typeof handle == 'number')
            line = h.getLine(doc, e.clipLine(doc, handle));
        else
            no = h.lineNo(handle);
        if (no == null)
            return null;
        if (op(line, no) && doc.cm)
            d.regLineChange(doc.cm, no, changeType);
        return line;
    }
    return {
        makeChange: makeChange,
        makeChangeFromHistory: makeChangeFromHistory,
        replaceRange: replaceRange,
        changeLine: changeLine
    };
});