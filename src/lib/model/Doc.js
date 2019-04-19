define([
    '../edit/CodeMirror',
    '../display/operations',
    '../line/line_data',
    '../line/pos',
    '../line/spans',
    '../line/utils_line',
    '../util/dom',
    '../util/feature_detection',
    '../util/misc',
    '../display/scrolling',
    './changes',
    './change_measurement',
    './chunk',
    './document_data',
    './history',
    './line_widget',
    './mark_text',
    './selection',
    './selection_updates'
], function (CodeMirror, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r) {
    'use strict';
    let nextDocId = 0;
    let Doc = function (text, mode, firstLine, lineSep, direction) {
        if (!(this instanceof Doc))
            return new Doc(text, mode, firstLine, lineSep, direction);
        if (firstLine == null)
            firstLine = 0;
        l.BranchChunk.call(this, [new l.LeafChunk([new b.Line('', null)])]);
        this.first = firstLine;
        this.scrollTop = this.scrollLeft = 0;
        this.cantEdit = false;
        this.cleanGeneration = 1;
        this.modeFrontier = this.highlightFrontier = firstLine;
        let start = c.Pos(firstLine, 0);
        this.sel = q.simpleSelection(start);
        this.history = new n.History(null);
        this.id = ++nextDocId;
        this.modeOption = mode;
        this.lineSep = lineSep;
        this.direction = direction == 'rtl' ? 'rtl' : 'ltr';
        this.extend = false;
        if (typeof text == 'string')
            text = this.splitLines(text);
        m.updateDoc(this, {
            from: start,
            to: start,
            text: text
        });
        r.setSelection(this, q.simpleSelection(start), h.sel_dontScroll);
    };
    Doc.prototype = h.createObj(l.BranchChunk.prototype, {
        constructor: Doc,
        iter: function (from, to, op) {
            if (op)
                this.iterN(from - this.first, to - from, op);
            else
                this.iterN(this.first, this.first + this.size, from);
        },
        insert: function (at, lines) {
            let height = 0;
            for (let i = 0; i < lines.length; ++i)
                height += lines[i].height;
            this.insertInner(at - this.first, lines, height);
        },
        remove: function (at, n) {
            this.removeInner(at - this.first, n);
        },
        getValue: function (lineSep) {
            let lines = e.getLines(this, this.first, this.first + this.size);
            if (lineSep === false)
                return lines;
            return lines.join(lineSep || this.lineSeparator());
        },
        setValue: a.docMethodOp(function (code) {
            let top = c.Pos(this.first, 0), last = this.first + this.size - 1;
            j.makeChange(this, {
                from: top,
                to: c.Pos(last, e.getLine(this, last).text.length),
                text: this.splitLines(code),
                origin: 'setValue',
                full: true
            }, true);
            if (this.cm)
                i.scrollToCoords(this.cm, 0, 0);
            r.setSelection(this, q.simpleSelection(top), h.sel_dontScroll);
        }),
        replaceRange: function (code, from, to, origin) {
            from = c.clipPos(this, from);
            to = to ? c.clipPos(this, to) : from;
            j.replaceRange(this, code, from, to, origin);
        },
        getRange: function (from, to, lineSep) {
            let lines = e.getBetween(this, c.clipPos(this, from), c.clipPos(this, to));
            if (lineSep === false)
                return lines;
            return lines.join(lineSep || this.lineSeparator());
        },
        getLine: function (line) {
            let l = this.getLineHandle(line);
            return l && l.text;
        },
        getLineHandle: function (line) {
            if (e.isLine(this, line))
                return e.getLine(this, line);
        },
        getLineNumber: function (line) {
            return e.lineNo(line);
        },
        getLineHandleVisualStart: function (line) {
            if (typeof line == 'number')
                line = e.getLine(this, line);
            return d.visualLine(line);
        },
        lineCount: function () {
            return this.size;
        },
        firstLine: function () {
            return this.first;
        },
        lastLine: function () {
            return this.first + this.size - 1;
        },
        clipPos: function (pos) {
            return c.clipPos(this, pos);
        },
        getCursor: function (start) {
            let range = this.sel.primary(), pos;
            if (start == null || start == 'head')
                pos = range.head;
            else if (start == 'anchor')
                pos = range.anchor;
            else if (start == 'end' || start == 'to' || start === false)
                pos = range.to();
            else
                pos = range.from();
            return pos;
        },
        listSelections: function () {
            return this.sel.ranges;
        },
        somethingSelected: function () {
            return this.sel.somethingSelected();
        },
        setCursor: a.docMethodOp(function (line, ch, options) {
            r.setSimpleSelection(this, c.clipPos(this, typeof line == 'number' ? c.Pos(line, ch || 0) : line), null, options);
        }),
        setSelection: a.docMethodOp(function (anchor, head, options) {
            r.setSimpleSelection(this, c.clipPos(this, anchor), c.clipPos(this, head || anchor), options);
        }),
        extendSelection: a.docMethodOp(function (head, other, options) {
            r.extendSelection(this, c.clipPos(this, head), other && c.clipPos(this, other), options);
        }),
        extendSelections: a.docMethodOp(function (heads, options) {
            r.extendSelections(this, c.clipPosArray(this, heads), options);
        }),
        extendSelectionsBy: a.docMethodOp(function (f, options) {
            let heads = h.map(this.sel.ranges, f);
            r.extendSelections(this, c.clipPosArray(this, heads), options);
        }),
        setSelections: a.docMethodOp(function (ranges, primary, options) {
            if (!ranges.length)
                return;
            let out = [];
            for (let i = 0; i < ranges.length; i++)
                out[i] = new q.Range(c.clipPos(this, ranges[i].anchor), c.clipPos(this, ranges[i].head));
            if (primary == null)
                primary = Math.min(ranges.length - 1, this.sel.primIndex);
            r.setSelection(this, q.normalizeSelection(this.cm, out, primary), options);
        }),
        addSelection: a.docMethodOp(function (anchor, head, options) {
            let ranges = this.sel.ranges.slice(0);
            ranges.push(new q.Range(c.clipPos(this, anchor), c.clipPos(this, head || anchor)));
            r.setSelection(this, q.normalizeSelection(this.cm, ranges, ranges.length - 1), options);
        }),
        getSelection: function (lineSep) {
            let ranges = this.sel.ranges, lines;
            for (let i = 0; i < ranges.length; i++) {
                let sel = e.getBetween(this, ranges[i].from(), ranges[i].to());
                lines = lines ? lines.concat(sel) : sel;
            }
            if (lineSep === false)
                return lines;
            else
                return lines.join(lineSep || this.lineSeparator());
        },
        getSelections: function (lineSep) {
            let parts = [], ranges = this.sel.ranges;
            for (let i = 0; i < ranges.length; i++) {
                let sel = e.getBetween(this, ranges[i].from(), ranges[i].to());
                if (lineSep !== false)
                    sel = sel.join(lineSep || this.lineSeparator());
                parts[i] = sel;
            }
            return parts;
        },
        replaceSelection: function (code, collapse, origin) {
            let dup = [];
            for (let i = 0; i < this.sel.ranges.length; i++)
                dup[i] = code;
            this.replaceSelections(dup, collapse, origin || '+input');
        },
        replaceSelections: a.docMethodOp(function (code, collapse, origin) {
            let changes = [], sel = this.sel;
            for (let i = 0; i < sel.ranges.length; i++) {
                let range = sel.ranges[i];
                changes[i] = {
                    from: range.from(),
                    to: range.to(),
                    text: this.splitLines(code[i]),
                    origin: origin
                };
            }
            let newSel = collapse && collapse != 'end' && k.computeReplacedSel(this, changes, collapse);
            for (let i = changes.length - 1; i >= 0; i--)
                j.makeChange(this, changes[i]);
            if (newSel)
                r.setSelectionReplaceHistory(this, newSel);
            else if (this.cm)
                i.ensureCursorVisible(this.cm);
        }),
        undo: a.docMethodOp(function () {
            j.makeChangeFromHistory(this, 'undo');
        }),
        redo: a.docMethodOp(function () {
            j.makeChangeFromHistory(this, 'redo');
        }),
        undoSelection: a.docMethodOp(function () {
            j.makeChangeFromHistory(this, 'undo', true);
        }),
        redoSelection: a.docMethodOp(function () {
            j.makeChangeFromHistory(this, 'redo', true);
        }),
        setExtending: function (val) {
            this.extend = val;
        },
        getExtending: function () {
            return this.extend;
        },
        historySize: function () {
            let hist = this.history, done = 0, undone = 0;
            for (let i = 0; i < hist.done.length; i++)
                if (!hist.done[i].ranges)
                    ++done;
            for (let i = 0; i < hist.undone.length; i++)
                if (!hist.undone[i].ranges)
                    ++undone;
            return {
                undo: done,
                redo: undone
            };
        },
        clearHistory: function () {
            this.history = new n.History(this.history.maxGeneration);
        },
        markClean: function () {
            this.cleanGeneration = this.changeGeneration(true);
        },
        changeGeneration: function (forceSplit) {
            if (forceSplit)
                this.history.lastOp = this.history.lastSelOp = this.history.lastOrigin = null;
            return this.history.generation;
        },
        isClean: function (gen) {
            return this.history.generation == (gen || this.cleanGeneration);
        },
        getHistory: function () {
            return {
                done: n.copyHistoryArray(this.history.done),
                undone: n.copyHistoryArray(this.history.undone)
            };
        },
        setHistory: function (histData) {
            let hist = this.history = new n.History(this.history.maxGeneration);
            hist.done = n.copyHistoryArray(histData.done.slice(0), null, true);
            hist.undone = n.copyHistoryArray(histData.undone.slice(0), null, true);
        },
        setGutterMarker: a.docMethodOp(function (line, gutterID, value) {
            return j.changeLine(this, line, 'gutter', line => {
                let markers = line.gutterMarkers || (line.gutterMarkers = {});
                markers[gutterID] = value;
                if (!value && h.isEmpty(markers))
                    line.gutterMarkers = null;
                return true;
            });
        }),
        clearGutter: a.docMethodOp(function (gutterID) {
            this.iter(line => {
                if (line.gutterMarkers && line.gutterMarkers[gutterID]) {
                    j.changeLine(this, line, 'gutter', () => {
                        line.gutterMarkers[gutterID] = null;
                        if (h.isEmpty(line.gutterMarkers))
                            line.gutterMarkers = null;
                        return true;
                    });
                }
            });
        }),
        lineInfo: function (line) {
            let n;
            if (typeof line == 'number') {
                if (!e.isLine(this, line))
                    return null;
                n = line;
                line = e.getLine(this, line);
                if (!line)
                    return null;
            } else {
                n = e.lineNo(line);
                if (n == null)
                    return null;
            }
            return {
                line: n,
                handle: line,
                text: line.text,
                gutterMarkers: line.gutterMarkers,
                textClass: line.textClass,
                bgClass: line.bgClass,
                wrapClass: line.wrapClass,
                widgets: line.widgets
            };
        },
        addLineClass: a.docMethodOp(function (handle, where, cls) {
            return j.changeLine(this, handle, where == 'gutter' ? 'gutter' : 'class', line => {
                let prop = where == 'text' ? 'textClass' : where == 'background' ? 'bgClass' : where == 'gutter' ? 'gutterClass' : 'wrapClass';
                if (!line[prop])
                    line[prop] = cls;
                else if (f.classTest(cls).test(line[prop]))
                    return false;
                else
                    line[prop] += ' ' + cls;
                return true;
            });
        }),
        removeLineClass: a.docMethodOp(function (handle, where, cls) {
            return j.changeLine(this, handle, where == 'gutter' ? 'gutter' : 'class', line => {
                let prop = where == 'text' ? 'textClass' : where == 'background' ? 'bgClass' : where == 'gutter' ? 'gutterClass' : 'wrapClass';
                let cur = line[prop];
                if (!cur)
                    return false;
                else if (cls == null)
                    line[prop] = null;
                else {
                    let found = cur.match(f.classTest(cls));
                    if (!found)
                        return false;
                    let end = found.index + found[0].length;
                    line[prop] = cur.slice(0, found.index) + (!found.index || end == cur.length ? '' : ' ') + cur.slice(end) || null;
                }
                return true;
            });
        }),
        addLineWidget: a.docMethodOp(function (handle, node, options) {
            return o.addLineWidget(this, handle, node, options);
        }),
        removeLineWidget: function (widget) {
            widget.clear();
        },
        markText: function (from, to, options) {
            return p.markText(this, c.clipPos(this, from), c.clipPos(this, to), options, options && options.type || 'range');
        },
        setBookmark: function (pos, options) {
            let realOpts = {
                replacedWith: options && (options.nodeType == null ? options.widget : options),
                insertLeft: options && options.insertLeft,
                clearWhenEmpty: false,
                shared: options && options.shared,
                handleMouseEvents: options && options.handleMouseEvents
            };
            pos = c.clipPos(this, pos);
            return p.markText(this, pos, pos, realOpts, 'bookmark');
        },
        findMarksAt: function (pos) {
            pos = c.clipPos(this, pos);
            let markers = [], spans = e.getLine(this, pos.line).markedSpans;
            if (spans)
                for (let i = 0; i < spans.length; ++i) {
                    let span = spans[i];
                    if ((span.from == null || span.from <= pos.ch) && (span.to == null || span.to >= pos.ch))
                        markers.push(span.marker.parent || span.marker);
                }
            return markers;
        },
        findMarks: function (from, to, filter) {
            from = c.clipPos(this, from);
            to = c.clipPos(this, to);
            let found = [], lineNo = from.line;
            this.iter(from.line, to.line + 1, line => {
                let spans = line.markedSpans;
                if (spans)
                    for (let i = 0; i < spans.length; i++) {
                        let span = spans[i];
                        if (!(span.to != null && lineNo == from.line && from.ch >= span.to || span.from == null && lineNo != from.line || span.from != null && lineNo == to.line && span.from >= to.ch) && (!filter || filter(span.marker)))
                            found.push(span.marker.parent || span.marker);
                    }
                ++lineNo;
            });
            return found;
        },
        getAllMarks: function () {
            let markers = [];
            this.iter(line => {
                let sps = line.markedSpans;
                if (sps)
                    for (let i = 0; i < sps.length; ++i)
                        if (sps[i].from != null)
                            markers.push(sps[i].marker);
            });
            return markers;
        },
        posFromIndex: function (off) {
            let ch, lineNo = this.first, sepSize = this.lineSeparator().length;
            this.iter(line => {
                let sz = line.text.length + sepSize;
                if (sz > off) {
                    ch = off;
                    return true;
                }
                off -= sz;
                ++lineNo;
            });
            return c.clipPos(this, c.Pos(lineNo, ch));
        },
        indexFromPos: function (coords) {
            coords = c.clipPos(this, coords);
            let index = coords.ch;
            if (coords.line < this.first || coords.ch < 0)
                return 0;
            let sepSize = this.lineSeparator().length;
            this.iter(this.first, coords.line, line => {
                index += line.text.length + sepSize;
            });
            return index;
        },
        copy: function (copyHistory) {
            let doc = new Doc(e.getLines(this, this.first, this.first + this.size), this.modeOption, this.first, this.lineSep, this.direction);
            doc.scrollTop = this.scrollTop;
            doc.scrollLeft = this.scrollLeft;
            doc.sel = this.sel;
            doc.extend = false;
            if (copyHistory) {
                doc.history.undoDepth = this.history.undoDepth;
                doc.setHistory(this.getHistory());
            }
            return doc;
        },
        linkedDoc: function (options) {
            if (!options)
                options = {};
            let from = this.first, to = this.first + this.size;
            if (options.from != null && options.from > from)
                from = options.from;
            if (options.to != null && options.to < to)
                to = options.to;
            let copy = new Doc(e.getLines(this, from, to), options.mode || this.modeOption, from, this.lineSep, this.direction);
            if (options.sharedHist)
                copy.history = this.history;
            (this.linked || (this.linked = [])).push({
                doc: copy,
                sharedHist: options.sharedHist
            });
            copy.linked = [{
                    doc: this,
                    isParent: true,
                    sharedHist: options.sharedHist
                }];
            p.copySharedMarkers(copy, p.findSharedMarkers(this));
            return copy;
        },
        unlinkDoc: function (other) {
            if (other instanceof CodeMirror)
                other = other.doc;
            if (this.linked)
                for (let i = 0; i < this.linked.length; ++i) {
                    let link = this.linked[i];
                    if (link.doc != other)
                        continue;
                    this.linked.splice(i, 1);
                    other.unlinkDoc(this);
                    p.detachSharedMarkers(p.findSharedMarkers(this));
                    break;
                }
            if (other.history == this.history) {
                let splitIds = [other.id];
                m.linkedDocs(other, doc => splitIds.push(doc.id), true);
                other.history = new n.History(null);
                other.history.done = n.copyHistoryArray(this.history.done, splitIds);
                other.history.undone = n.copyHistoryArray(this.history.undone, splitIds);
            }
        },
        iterLinkedDocs: function (f) {
            m.linkedDocs(this, f);
        },
        getMode: function () {
            return this.mode;
        },
        getEditor: function () {
            return this.cm;
        },
        splitLines: function (str) {
            if (this.lineSep)
                return str.split(this.lineSep);
            return g.splitLinesAuto(str);
        },
        lineSeparator: function () {
            return this.lineSep || '\n';
        },
        setDirection: a.docMethodOp(function (dir) {
            if (dir != 'rtl')
                dir = 'ltr';
            if (dir == this.direction)
                return;
            this.direction = dir;
            this.iter(line => line.order = null);
            if (this.cm)
                m.directionChanged(this.cm);
        })
    });
    Doc.prototype.eachLine = Doc.prototype.iter;
    return Doc;
});