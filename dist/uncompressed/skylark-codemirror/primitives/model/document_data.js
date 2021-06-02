define([
    '../display/mode_state',
    '../display/operations',
    '../display/view_tracking',
    '../line/line_data',
    '../line/spans',
    '../line/utils_line',
    '../measurement/position_measurement',
    '../util/dom',
    '../util/misc',
    '../util/operation_group'
], function (mode_state, operations, view_tracking, line_data, e, f, g, h, i, j) {
    'use strict';
    function isWholeLineUpdate(doc, change) {
        return change.from.ch == 0 && change.to.ch == 0 && i.lst(change.text) == '' && (!doc.cm || doc.cm.options.wholeLineUpdateBefore);
    }
    function updateDoc(doc, change, markedSpans, estimateHeight) {
        function spansFor(n) {
            return markedSpans ? markedSpans[n] : null;
        }
        function update(line, text, spans) {
            line_data.updateLine(line, text, spans, estimateHeight);
            j.signalLater(line, 'change', line, change);
        }
        function linesFor(start, end) {
            let result = [];
            for (let i = start; i < end; ++i)
                result.push(new line_data.Line(text[i], spansFor(i), estimateHeight));
            return result;
        }
        let from = change.from, to = change.to, text = change.text;
        let firstLine = f.getLine(doc, from.line), lastLine = f.getLine(doc, to.line);
        let lastText = i.lst(text), lastSpans = spansFor(text.length - 1), nlines = to.line - from.line;
        if (change.full) {
            doc.insert(0, linesFor(0, text.length));
            doc.remove(text.length, doc.size - text.length);
        } else if (isWholeLineUpdate(doc, change)) {
            let added = linesFor(0, text.length - 1);
            update(lastLine, lastLine.text, lastSpans);
            if (nlines)
                doc.remove(from.line, nlines);
            if (added.length)
                doc.insert(from.line, added);
        } else if (firstLine == lastLine) {
            if (text.length == 1) {
                update(firstLine, firstLine.text.slice(0, from.ch) + lastText + firstLine.text.slice(to.ch), lastSpans);
            } else {
                let added = linesFor(1, text.length - 1);
                added.push(new line_data.Line(lastText + firstLine.text.slice(to.ch), lastSpans, estimateHeight));
                update(firstLine, firstLine.text.slice(0, from.ch) + text[0], spansFor(0));
                doc.insert(from.line + 1, added);
            }
        } else if (text.length == 1) {
            update(firstLine, firstLine.text.slice(0, from.ch) + text[0] + lastLine.text.slice(to.ch), spansFor(0));
            doc.remove(from.line + 1, nlines);
        } else {
            update(firstLine, firstLine.text.slice(0, from.ch) + text[0], spansFor(0));
            update(lastLine, lastText + lastLine.text.slice(to.ch), lastSpans);
            let added = linesFor(1, text.length - 1);
            if (nlines > 1)
                doc.remove(from.line + 1, nlines - 1);
            doc.insert(from.line + 1, added);
        }
        j.signalLater(doc, 'change', doc, change);
    }
    function linkedDocs(doc, f, sharedHistOnly) {
        function propagate(doc, skip, sharedHist) {
            if (doc.linked)
                for (let i = 0; i < doc.linked.length; ++i) {
                    let rel = doc.linked[i];
                    if (rel.doc == skip)
                        continue;
                    let shared = sharedHist && rel.sharedHist;
                    if (sharedHistOnly && !shared)
                        continue;
                    f(rel.doc, shared);
                    propagate(rel.doc, doc, shared);
                }
        }
        propagate(doc, null, true);
    }
    function attachDoc(cm, doc) {
        if (doc.cm)
            throw new Error('This document is already in use.');
        cm.doc = doc;
        doc.cm = cm;
        g.estimateLineHeights(cm);
        mode_state.loadMode(cm);
        setDirectionClass(cm);
        if (!cm.options.lineWrapping)
            e.findMaxLine(cm);
        cm.options.mode = doc.modeOption;
        view_tracking.regChange(cm);
    }
    function setDirectionClass(cm) {
        ;
        (cm.doc.direction == 'rtl' ? h.addClass : h.rmClass)(cm.display.lineDiv, 'CodeMirror-rtl');
    }
    function directionChanged(cm) {
        operations.runInOp(cm, () => {
            setDirectionClass(cm);
            view_tracking.regChange(cm);
        });
    }
    return {
        isWholeLineUpdate: isWholeLineUpdate,
        updateDoc: updateDoc,
        linkedDocs: linkedDocs,
        attachDoc: attachDoc,
        directionChanged: directionChanged
    };
});