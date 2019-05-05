define([
    '../line/pos',
    '../line/spans',
    '../line/utils_line',
    '../util/event',
    '../util/misc',
    './change_measurement',
    './document_data',
    './selection'
], function (a, b, c, d, e, f, g, h) {
    'use strict';
    function History(startGen) {
        this.done = [];
        this.undone = [];
        this.undoDepth = Infinity;
        this.lastModTime = this.lastSelTime = 0;
        this.lastOp = this.lastSelOp = null;
        this.lastOrigin = this.lastSelOrigin = null;
        this.generation = this.maxGeneration = startGen || 1;
    }
    function historyChangeFromChange(doc, change) {
        let histChange = {
            from: a.copyPos(change.from),
            to: f.changeEnd(change),
            text: c.getBetween(doc, change.from, change.to)
        };
        attachLocalSpans(doc, histChange, change.from.line, change.to.line + 1);
        g.linkedDocs(doc, doc => attachLocalSpans(doc, histChange, change.from.line, change.to.line + 1), true);
        return histChange;
    }
    function clearSelectionEvents(array) {
        while (array.length) {
            let last = e.lst(array);
            if (last.ranges)
                array.pop();
            else
                break;
        }
    }
    function lastChangeEvent(hist, force) {
        if (force) {
            clearSelectionEvents(hist.done);
            return e.lst(hist.done);
        } else if (hist.done.length && !e.lst(hist.done).ranges) {
            return e.lst(hist.done);
        } else if (hist.done.length > 1 && !hist.done[hist.done.length - 2].ranges) {
            hist.done.pop();
            return e.lst(hist.done);
        }
    }
    function addChangeToHistory(doc, change, selAfter, opId) {
        let hist = doc.history;
        hist.undone.length = 0;
        let time = +new Date(), cur;
        let last;
        if ((hist.lastOp == opId || hist.lastOrigin == change.origin && change.origin && (change.origin.charAt(0) == '+' && hist.lastModTime > time - (doc.cm ? doc.cm.options.historyEventDelay : 500) || change.origin.charAt(0) == '*')) && (cur = lastChangeEvent(hist, hist.lastOp == opId))) {
            last = e.lst(cur.changes);
            if (a.cmp(change.from, change.to) == 0 && a.cmp(change.from, last.to) == 0) {
                last.to = f.changeEnd(change);
            } else {
                cur.changes.push(historyChangeFromChange(doc, change));
            }
        } else {
            let before = e.lst(hist.done);
            if (!before || !before.ranges)
                pushSelectionToHistory(doc.sel, hist.done);
            cur = {
                changes: [historyChangeFromChange(doc, change)],
                generation: hist.generation
            };
            hist.done.push(cur);
            while (hist.done.length > hist.undoDepth) {
                hist.done.shift();
                if (!hist.done[0].ranges)
                    hist.done.shift();
            }
        }
        hist.done.push(selAfter);
        hist.generation = ++hist.maxGeneration;
        hist.lastModTime = hist.lastSelTime = time;
        hist.lastOp = hist.lastSelOp = opId;
        hist.lastOrigin = hist.lastSelOrigin = change.origin;
        if (!last)
            d.signal(doc, 'historyAdded');
    }
    function selectionEventCanBeMerged(doc, origin, prev, sel) {
        let ch = origin.charAt(0);
        return ch == '*' || ch == '+' && prev.ranges.length == sel.ranges.length && prev.somethingSelected() == sel.somethingSelected() && new Date() - doc.history.lastSelTime <= (doc.cm ? doc.cm.options.historyEventDelay : 500);
    }
    function addSelectionToHistory(doc, sel, opId, options) {
        let hist = doc.history, origin = options && options.origin;
        if (opId == hist.lastSelOp || origin && hist.lastSelOrigin == origin && (hist.lastModTime == hist.lastSelTime && hist.lastOrigin == origin || selectionEventCanBeMerged(doc, origin, e.lst(hist.done), sel)))
            hist.done[hist.done.length - 1] = sel;
        else
            pushSelectionToHistory(sel, hist.done);
        hist.lastSelTime = +new Date();
        hist.lastSelOrigin = origin;
        hist.lastSelOp = opId;
        if (options && options.clearRedo !== false)
            clearSelectionEvents(hist.undone);
    }
    function pushSelectionToHistory(sel, dest) {
        let top = e.lst(dest);
        if (!(top && top.ranges && top.equals(sel)))
            dest.push(sel);
    }
    function attachLocalSpans(doc, change, from, to) {
        let existing = change['spans_' + doc.id], n = 0;
        doc.iter(Math.max(doc.first, from), Math.min(doc.first + doc.size, to), line => {
            if (line.markedSpans)
                (existing || (existing = change['spans_' + doc.id] = {}))[n] = line.markedSpans;
            ++n;
        });
    }
    function removeClearedSpans(spans) {
        if (!spans)
            return null;
        let out;
        for (let i = 0; i < spans.length; ++i) {
            if (spans[i].marker.explicitlyCleared) {
                if (!out)
                    out = spans.slice(0, i);
            } else if (out)
                out.push(spans[i]);
        }
        return !out ? spans : out.length ? out : null;
    }
    function getOldSpans(doc, change) {
        let found = change['spans_' + doc.id];
        if (!found)
            return null;
        let nw = [];
        for (let i = 0; i < change.text.length; ++i)
            nw.push(removeClearedSpans(found[i]));
        return nw;
    }
    function mergeOldSpans(doc, change) {
        let old = getOldSpans(doc, change);
        let stretched = b.stretchSpansOverChange(doc, change);
        if (!old)
            return stretched;
        if (!stretched)
            return old;
        for (let i = 0; i < old.length; ++i) {
            let oldCur = old[i], stretchCur = stretched[i];
            if (oldCur && stretchCur) {
                spans:
                    for (let j = 0; j < stretchCur.length; ++j) {
                        let span = stretchCur[j];
                        for (let k = 0; k < oldCur.length; ++k)
                            if (oldCur[k].marker == span.marker)
                                continue spans;
                        oldCur.push(span);
                    }
            } else if (stretchCur) {
                old[i] = stretchCur;
            }
        }
        return old;
    }
    function copyHistoryArray(events, newGroup, instantiateSel) {
        let copy = [];
        for (let i = 0; i < events.length; ++i) {
            let event = events[i];
            if (event.ranges) {
                copy.push(instantiateSel ? h.Selection.prototype.deepCopy.call(event) : event);
                continue;
            }
            let changes = event.changes, newChanges = [];
            copy.push({ changes: newChanges });
            for (let j = 0; j < changes.length; ++j) {
                let change = changes[j], m;
                newChanges.push({
                    from: change.from,
                    to: change.to,
                    text: change.text
                });
                if (newGroup)
                    for (var prop in change)
                        if (m = prop.match(/^spans_(\d+)$/)) {
                            if (e.indexOf(newGroup, Number(m[1])) > -1) {
                                e.lst(newChanges)[prop] = change[prop];
                                delete change[prop];
                            }
                        }
            }
        }
        return copy;
    }
    return {
        History: History,
        historyChangeFromChange: historyChangeFromChange,
        addChangeToHistory: addChangeToHistory,
        addSelectionToHistory: addSelectionToHistory,
        pushSelectionToHistory: pushSelectionToHistory,
        mergeOldSpans: mergeOldSpans,
        copyHistoryArray: copyHistoryArray
    };
});