define([
    '../util/dom',
    '../util/event',
    '../display/operations',
    '../line/pos',
    '../line/utils_line',
    '../measurement/position_measurement',
    '../line/saw_special_spans',
    '../line/spans',
    '../util/misc',
    '../util/operation_group',
    '../measurement/widgets',
    '../display/view_tracking',
    './document_data',
    './history',
    './selection_updates'
], function (a, b, c, d, e, f, g, h, i, j, k, l, m, n, o) {
    'use strict';
    let nextMarkerId = 0;
    class TextMarker {
        constructor(doc, type) {
            this.lines = [];
            this.type = type;
            this.doc = doc;
            this.id = ++nextMarkerId;
        }
        clear() {
            if (this.explicitlyCleared)
                return;
            let cm = this.doc.cm, withOp = cm && !cm.curOp;
            if (withOp)
                c.startOperation(cm);
            if (b.hasHandler(this, 'clear')) {
                let found = this.find();
                if (found)
                    j.signalLater(this, 'clear', found.from, found.to);
            }
            let min = null, max = null;
            for (let i = 0; i < this.lines.length; ++i) {
                let line = this.lines[i];
                let span = h.getMarkedSpanFor(line.markedSpans, this);
                if (cm && !this.collapsed)
                    l.regLineChange(cm, e.lineNo(line), 'text');
                else if (cm) {
                    if (span.to != null)
                        max = e.lineNo(line);
                    if (span.from != null)
                        min = e.lineNo(line);
                }
                line.markedSpans = h.removeMarkedSpan(line.markedSpans, span);
                if (span.from == null && this.collapsed && !h.lineIsHidden(this.doc, line) && cm)
                    e.updateLineHeight(line, f.textHeight(cm.display));
            }
            if (cm && this.collapsed && !cm.options.lineWrapping)
                for (let i = 0; i < this.lines.length; ++i) {
                    let visual = h.visualLine(this.lines[i]), len = h.lineLength(visual);
                    if (len > cm.display.maxLineLength) {
                        cm.display.maxLine = visual;
                        cm.display.maxLineLength = len;
                        cm.display.maxLineChanged = true;
                    }
                }
            if (min != null && cm && this.collapsed)
                l.regChange(cm, min, max + 1);
            this.lines.length = 0;
            this.explicitlyCleared = true;
            if (this.atomic && this.doc.cantEdit) {
                this.doc.cantEdit = false;
                if (cm)
                    o.reCheckSelection(cm.doc);
            }
            if (cm)
                j.signalLater(cm, 'markerCleared', cm, this, min, max);
            if (withOp)
                c.endOperation(cm);
            if (this.parent)
                this.parent.clear();
        }
        find(side, lineObj) {
            if (side == null && this.type == 'bookmark')
                side = 1;
            let from, to;
            for (let i = 0; i < this.lines.length; ++i) {
                let line = this.lines[i];
                let span = h.getMarkedSpanFor(line.markedSpans, this);
                if (span.from != null) {
                    from = d.Pos(lineObj ? line : e.lineNo(line), span.from);
                    if (side == -1)
                        return from;
                }
                if (span.to != null) {
                    to = d.Pos(lineObj ? line : e.lineNo(line), span.to);
                    if (side == 1)
                        return to;
                }
            }
            return from && {
                from: from,
                to: to
            };
        }
        changed() {
            let pos = this.find(-1, true), widget = this, cm = this.doc.cm;
            if (!pos || !cm)
                return;
            c.runInOp(cm, () => {
                let line = pos.line, lineN = e.lineNo(pos.line);
                let view = f.findViewForLine(cm, lineN);
                if (view) {
                    f.clearLineMeasurementCacheFor(view);
                    cm.curOp.selectionChanged = cm.curOp.forceUpdate = true;
                }
                cm.curOp.updateMaxLine = true;
                if (!h.lineIsHidden(widget.doc, line) && widget.height != null) {
                    let oldHeight = widget.height;
                    widget.height = null;
                    let dHeight = k.widgetHeight(widget) - oldHeight;
                    if (dHeight)
                        e.updateLineHeight(line, line.height + dHeight);
                }
                j.signalLater(cm, 'markerChanged', cm, this);
            });
        }
        attachLine(line) {
            if (!this.lines.length && this.doc.cm) {
                let op = this.doc.cm.curOp;
                if (!op.maybeHiddenMarkers || i.indexOf(op.maybeHiddenMarkers, this) == -1)
                    (op.maybeUnhiddenMarkers || (op.maybeUnhiddenMarkers = [])).push(this);
            }
            this.lines.push(line);
        }
        detachLine(line) {
            this.lines.splice(i.indexOf(this.lines, line), 1);
            if (!this.lines.length && this.doc.cm) {
                let op = this.doc.cm.curOp;
                (op.maybeHiddenMarkers || (op.maybeHiddenMarkers = [])).push(this);
            }
        }
    }
    b.eventMixin(TextMarker);
    function markText(doc, from, to, options, type) {
        if (options && options.shared)
            return markTextShared(doc, from, to, options, type);
        if (doc.cm && !doc.cm.curOp)
            return c.operation(doc.cm, markText)(doc, from, to, options, type);
        let marker = new TextMarker(doc, type), diff = d.cmp(from, to);
        if (options)
            i.copyObj(options, marker, false);
        if (diff > 0 || diff == 0 && marker.clearWhenEmpty !== false)
            return marker;
        if (marker.replacedWith) {
            marker.collapsed = true;
            marker.widgetNode = a.eltP('span', [marker.replacedWith], 'CodeMirror-widget');
            if (!options.handleMouseEvents)
                marker.widgetNode.setAttribute('cm-ignore-events', 'true');
            if (options.insertLeft)
                marker.widgetNode.insertLeft = true;
        }
        if (marker.collapsed) {
            if (h.conflictingCollapsedRange(doc, from.line, from, to, marker) || from.line != to.line && h.conflictingCollapsedRange(doc, to.line, from, to, marker))
                throw new Error('Inserting collapsed marker partially overlapping an existing one');
            g.seeCollapsedSpans();
        }
        if (marker.addToHistory)
            n.addChangeToHistory(doc, {
                from: from,
                to: to,
                origin: 'markText'
            }, doc.sel, NaN);
        let curLine = from.line, cm = doc.cm, updateMaxLine;
        doc.iter(curLine, to.line + 1, line => {
            if (cm && marker.collapsed && !cm.options.lineWrapping && h.visualLine(line) == cm.display.maxLine)
                updateMaxLine = true;
            if (marker.collapsed && curLine != from.line)
                e.updateLineHeight(line, 0);
            h.addMarkedSpan(line, new h.MarkedSpan(marker, curLine == from.line ? from.ch : null, curLine == to.line ? to.ch : null));
            ++curLine;
        });
        if (marker.collapsed)
            doc.iter(from.line, to.line + 1, line => {
                if (h.lineIsHidden(doc, line))
                    e.updateLineHeight(line, 0);
            });
        if (marker.clearOnEnter)
            b.on(marker, 'beforeCursorEnter', () => marker.clear());
        if (marker.readOnly) {
            g.seeReadOnlySpans();
            if (doc.history.done.length || doc.history.undone.length)
                doc.clearHistory();
        }
        if (marker.collapsed) {
            marker.id = ++nextMarkerId;
            marker.atomic = true;
        }
        if (cm) {
            if (updateMaxLine)
                cm.curOp.updateMaxLine = true;
            if (marker.collapsed)
                l.regChange(cm, from.line, to.line + 1);
            else if (marker.className || marker.startStyle || marker.endStyle || marker.css || marker.attributes || marker.title)
                for (let i = from.line; i <= to.line; i++)
                    l.regLineChange(cm, i, 'text');
            if (marker.atomic)
                o.reCheckSelection(cm.doc);
            j.signalLater(cm, 'markerAdded', cm, marker);
        }
        return marker;
    }
    class SharedTextMarker {
        constructor(markers, primary) {
            this.markers = markers;
            this.primary = primary;
            for (let i = 0; i < markers.length; ++i)
                markers[i].parent = this;
        }
        clear() {
            if (this.explicitlyCleared)
                return;
            this.explicitlyCleared = true;
            for (let i = 0; i < this.markers.length; ++i)
                this.markers[i].clear();
            j.signalLater(this, 'clear');
        }
        find(side, lineObj) {
            return this.primary.find(side, lineObj);
        }
    }
    b.eventMixin(SharedTextMarker);
    function markTextShared(doc, from, to, options, type) {
        options = i.copyObj(options);
        options.shared = false;
        let markers = [markText(doc, from, to, options, type)], primary = markers[0];
        let widget = options.widgetNode;
        m.linkedDocs(doc, doc => {
            if (widget)
                options.widgetNode = widget.cloneNode(true);
            markers.push(markText(doc, d.clipPos(doc, from), d.clipPos(doc, to), options, type));
            for (let i = 0; i < doc.linked.length; ++i)
                if (doc.linked[i].isParent)
                    return;
            primary = i.lst(markers);
        });
        return new SharedTextMarker(markers, primary);
    }
    function findSharedMarkers(doc) {
        return doc.findMarks(d.Pos(doc.first, 0), doc.clipPos(d.Pos(doc.lastLine())), m => m.parent);
    }
    function copySharedMarkers(doc, markers) {
        for (let i = 0; i < markers.length; i++) {
            let marker = markers[i], pos = marker.find();
            let mFrom = doc.clipPos(pos.from), mTo = doc.clipPos(pos.to);
            if (d.cmp(mFrom, mTo)) {
                let subMark = markText(doc, mFrom, mTo, marker.primary, marker.primary.type);
                marker.markers.push(subMark);
                subMark.parent = marker;
            }
        }
    }
    function detachSharedMarkers(markers) {
        for (let i = 0; i < markers.length; i++) {
            let marker = markers[i], linked = [marker.primary.doc];
            m.linkedDocs(marker.primary.doc, d => linked.push(d));
            for (let j = 0; j < marker.markers.length; j++) {
                let subMarker = marker.markers[j];
                if (i.indexOf(linked, subMarker.doc) == -1) {
                    subMarker.parent = null;
                    marker.markers.splice(j--, 1);
                }
            }
        }
    }
    return {
        TextMarker: TextMarker,
        markText: markText,
        SharedTextMarker: SharedTextMarker,
        findSharedMarkers: findSharedMarkers,
        copySharedMarkers: copySharedMarkers,
        detachSharedMarkers: detachSharedMarkers
    };
});