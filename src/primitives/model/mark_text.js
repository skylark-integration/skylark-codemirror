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
], function (dom, m_event, operations, m_pos, utils_line, position_measurement, saw_special_spans, spans, misc, operation_group, widgets, view_tracking, document_data, m_history, selection_updates) {
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
                operations.startOperation(cm);
            if (m_event.hasHandler(this, 'clear')) {
                let found = this.find();
                if (found)
                    operation_group.signalLater(this, 'clear', found.from, found.to);
            }
            let min = null, max = null;
            for (let i = 0; i < this.lines.length; ++i) {
                let line = this.lines[i];
                let span = spans.getMarkedSpanFor(line.markedSpans, this);
                if (cm && !this.collapsed)
                    view_tracking.regLineChange(cm, utils_line.lineNo(line), 'text');
                else if (cm) {
                    if (span.to != null)
                        max = utils_line.lineNo(line);
                    if (span.from != null)
                        min = utils_line.lineNo(line);
                }
                line.markedSpans = spans.removeMarkedSpan(line.markedSpans, span);
                if (span.from == null && this.collapsed && !spans.lineIsHidden(this.doc, line) && cm)
                    utils_line.updateLineHeight(line, position_measurement.textHeight(cm.display));
            }
            if (cm && this.collapsed && !cm.options.lineWrapping)
                for (let i = 0; i < this.lines.length; ++i) {
                    let visual = spans.visualLine(this.lines[i]), len = spans.lineLength(visual);
                    if (len > cm.display.maxLineLength) {
                        cm.display.maxLine = visual;
                        cm.display.maxLineLength = len;
                        cm.display.maxLineChanged = true;
                    }
                }
            if (min != null && cm && this.collapsed)
                view_tracking.regChange(cm, min, max + 1);
            this.lines.length = 0;
            this.explicitlyCleared = true;
            if (this.atomic && this.doc.cantEdit) {
                this.doc.cantEdit = false;
                if (cm)
                    selection_updates.reCheckSelection(cm.doc);
            }
            if (cm)
                operation_group.signalLater(cm, 'markerCleared', cm, this, min, max);
            if (withOp)
                operations.endOperation(cm);
            if (this.parent)
                this.parent.clear();
        }
        find(side, lineObj) {
            if (side == null && this.type == 'bookmark')
                side = 1;
            let from, to;
            for (let i = 0; i < this.lines.length; ++i) {
                let line = this.lines[i];
                let span = spans.getMarkedSpanFor(line.markedSpans, this);
                if (span.from != null) {
                    from = m_pos.Pos(lineObj ? line : utils_line.lineNo(line), span.from);
                    if (side == -1)
                        return from;
                }
                if (span.to != null) {
                    to = m_pos.Pos(lineObj ? line : utils_line.lineNo(line), span.to);
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
            operations.runInOp(cm, () => {
                let line = pos.line, lineN = utils_line.lineNo(pos.line);
                let view = position_measurement.findViewForLine(cm, lineN);
                if (view) {
                    position_measurement.clearLineMeasurementCacheFor(view);
                    cm.curOp.selectionChanged = cm.curOp.forceUpdate = true;
                }
                cm.curOp.updateMaxLine = true;
                if (!spans.lineIsHidden(widget.doc, line) && widget.height != null) {
                    let oldHeight = widget.height;
                    widget.height = null;
                    let dHeight = widgets.widgetHeight(widget) - oldHeight;
                    if (dHeight)
                        utils_line.updateLineHeight(line, line.height + dHeight);
                }
                operation_group.signalLater(cm, 'markerChanged', cm, this);
            });
        }
        attachLine(line) {
            if (!this.lines.length && this.doc.cm) {
                let op = this.doc.cm.curOp;
                if (!op.maybeHiddenMarkers || misc.indexOf(op.maybeHiddenMarkers, this) == -1)
                    (op.maybeUnhiddenMarkers || (op.maybeUnhiddenMarkers = [])).push(this);
            }
            this.lines.push(line);
        }
        detachLine(line) {
            this.lines.splice(misc.indexOf(this.lines, line), 1);
            if (!this.lines.length && this.doc.cm) {
                let op = this.doc.cm.curOp;
                (op.maybeHiddenMarkers || (op.maybeHiddenMarkers = [])).push(this);
            }
        }
    }
    m_event.eventMixin(TextMarker);
    function markText(doc, from, to, options, type) {
        if (options && options.shared)
            return markTextShared(doc, from, to, options, type);
        if (doc.cm && !doc.cm.curOp)
            return operations.operation(doc.cm, markText)(doc, from, to, options, type);
        let marker = new TextMarker(doc, type), diff = m_pos.cmp(from, to);
        if (options)
            misc.copyObj(options, marker, false);
        if (diff > 0 || diff == 0 && marker.clearWhenEmpty !== false)
            return marker;
        if (marker.replacedWith) {
            marker.collapsed = true;
            marker.widgetNode = dom.eltP('span', [marker.replacedWith], 'CodeMirror-widget');
            if (!options.handleMouseEvents)
                marker.widgetNode.setAttribute('cm-ignore-events', 'true');
            if (options.insertLeft)
                marker.widgetNode.insertLeft = true;
        }
        if (marker.collapsed) {
            if (spans.conflictingCollapsedRange(doc, from.line, from, to, marker) || from.line != to.line && spans.conflictingCollapsedRange(doc, to.line, from, to, marker))
                throw new Error('Inserting collapsed marker partially overlapping an existing one');
            saw_special_spans.seeCollapsedSpans();
        }
        if (marker.addToHistory)
            m_history.addChangeToHistory(doc, {
                from: from,
                to: to,
                origin: 'markText'
            }, doc.sel, NaN);
        let curLine = from.line, cm = doc.cm, updateMaxLine;
        doc.iter(curLine, to.line + 1, line => {
            if (cm && marker.collapsed && !cm.options.lineWrapping && spans.visualLine(line) == cm.display.maxLine)
                updateMaxLine = true;
            if (marker.collapsed && curLine != from.line)
                utils_line.updateLineHeight(line, 0);
            spans.addMarkedSpan(line, new spans.MarkedSpan(marker, curLine == from.line ? from.ch : null, curLine == to.line ? to.ch : null));
            ++curLine;
        });
        if (marker.collapsed)
            doc.iter(from.line, to.line + 1, line => {
                if (spans.lineIsHidden(doc, line))
                    utils_line.updateLineHeight(line, 0);
            });
        if (marker.clearOnEnter)
            m_event.on(marker, 'beforeCursorEnter', () => marker.clear());
        if (marker.readOnly) {
            saw_special_spans.seeReadOnlySpans();
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
                view_tracking.regChange(cm, from.line, to.line + 1);
            else if (marker.className || marker.startStyle || marker.endStyle || marker.css || marker.attributes || marker.title)
                for (let i = from.line; i <= to.line; i++)
                    view_tracking.regLineChange(cm, i, 'text');
            if (marker.atomic)
                selection_updates.reCheckSelection(cm.doc);
            operation_group.signalLater(cm, 'markerAdded', cm, marker);
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
            operation_group.signalLater(this, 'clear');
        }
        find(side, lineObj) {
            return this.primary.find(side, lineObj);
        }
    }
    m_event.eventMixin(SharedTextMarker);
    function markTextShared(doc, from, to, options, type) {
        options = misc.copyObj(options);
        options.shared = false;
        let markers = [markText(doc, from, to, options, type)], primary = markers[0];
        let widget = options.widgetNode;
        document_data.linkedDocs(doc, doc => {
            if (widget)
                options.widgetNode = widget.cloneNode(true);
            markers.push(markText(doc, m_pos.clipPos(doc, from), m_pos.clipPos(doc, to), options, type));
            for (let i = 0; i < doc.linked.length; ++i)
                if (doc.linked[i].isParent)
                    return;
            primary = misc.lst(markers);
        });
        return new SharedTextMarker(markers, primary);
    }
    function findSharedMarkers(doc) {
        return doc.findMarks(m_pos.Pos(doc.first, 0), doc.clipPos(m_pos.Pos(doc.lastLine())), m => m.parent);
    }
    function copySharedMarkers(doc, markers) {
        for (let i = 0; i < markers.length; i++) {
            let marker = markers[i], pos = marker.find();
            let mFrom = doc.clipPos(pos.from), mTo = doc.clipPos(pos.to);
            if (m_pos.cmp(mFrom, mTo)) {
                let subMark = markText(doc, mFrom, mTo, marker.primary, marker.primary.type);
                marker.markers.push(subMark);
                subMark.parent = marker;
            }
        }
    }
    function detachSharedMarkers(markers) {
        for (let i = 0; i < markers.length; i++) {
            let marker = markers[i], linked = [marker.primary.doc];
            document_data.linkedDocs(marker.primary.doc, d => linked.push(d));
            for (let j = 0; j < marker.markers.length; j++) {
                let subMarker = marker.markers[j];
                if (misc.indexOf(linked, subMarker.doc) == -1) {
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