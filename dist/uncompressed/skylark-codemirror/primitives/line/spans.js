define([
    '../util/misc',
    './pos',
    './saw_special_spans',
    './utils_line'
], function (misc, pos, saw_special_spans, utils_line) {
    'use strict';
    function MarkedSpan(marker, from, to) {
        this.marker = marker;
        this.from = from;
        this.to = to;
    }
    function getMarkedSpanFor(spans, marker) {
        if (spans)
            for (let i = 0; i < spans.length; ++i) {
                let span = spans[i];
                if (span.marker == marker)
                    return span;
            }
    }
    function removeMarkedSpan(spans, span) {
        let r;
        for (let i = 0; i < spans.length; ++i)
            if (spans[i] != span)
                (r || (r = [])).push(spans[i]);
        return r;
    }
    function addMarkedSpan(line, span) {
        line.markedSpans = line.markedSpans ? line.markedSpans.concat([span]) : [span];
        span.marker.attachLine(line);
    }
    function markedSpansBefore(old, startCh, isInsert) {
        let nw;
        if (old)
            for (let i = 0; i < old.length; ++i) {
                let span = old[i], marker = span.marker;
                let startsBefore = span.from == null || (marker.inclusiveLeft ? span.from <= startCh : span.from < startCh);
                if (startsBefore || span.from == startCh && marker.type == 'bookmark' && (!isInsert || !span.marker.insertLeft)) {
                    let endsAfter = span.to == null || (marker.inclusiveRight ? span.to >= startCh : span.to > startCh);
                    (nw || (nw = [])).push(new MarkedSpan(marker, span.from, endsAfter ? null : span.to));
                }
            }
        return nw;
    }
    function markedSpansAfter(old, endCh, isInsert) {
        let nw;
        if (old)
            for (let i = 0; i < old.length; ++i) {
                let span = old[i], marker = span.marker;
                let endsAfter = span.to == null || (marker.inclusiveRight ? span.to >= endCh : span.to > endCh);
                if (endsAfter || span.from == endCh && marker.type == 'bookmark' && (!isInsert || span.marker.insertLeft)) {
                    let startsBefore = span.from == null || (marker.inclusiveLeft ? span.from <= endCh : span.from < endCh);
                    (nw || (nw = [])).push(new MarkedSpan(marker, startsBefore ? null : span.from - endCh, span.to == null ? null : span.to - endCh));
                }
            }
        return nw;
    }
    function stretchSpansOverChange(doc, change) {
        if (change.full)
            return null;
        let oldFirst = utils_line.isLine(doc, change.from.line) && utils_line.getLine(doc, change.from.line).markedSpans;
        let oldLast = utils_line.isLine(doc, change.to.line) && utils_line.getLine(doc, change.to.line).markedSpans;
        if (!oldFirst && !oldLast)
            return null;
        let startCh = change.from.ch, endCh = change.to.ch, isInsert = pos.cmp(change.from, change.to) == 0;
        let first = markedSpansBefore(oldFirst, startCh, isInsert);
        let last = markedSpansAfter(oldLast, endCh, isInsert);
        let sameLine = change.text.length == 1, offset = misc.lst(change.text).length + (sameLine ? startCh : 0);
        if (first) {
            for (let i = 0; i < first.length; ++i) {
                let span = first[i];
                if (span.to == null) {
                    let found = getMarkedSpanFor(last, span.marker);
                    if (!found)
                        span.to = startCh;
                    else if (sameLine)
                        span.to = found.to == null ? null : found.to + offset;
                }
            }
        }
        if (last) {
            for (let i = 0; i < last.length; ++i) {
                let span = last[i];
                if (span.to != null)
                    span.to += offset;
                if (span.from == null) {
                    let found = getMarkedSpanFor(first, span.marker);
                    if (!found) {
                        span.from = offset;
                        if (sameLine)
                            (first || (first = [])).push(span);
                    }
                } else {
                    span.from += offset;
                    if (sameLine)
                        (first || (first = [])).push(span);
                }
            }
        }
        if (first)
            first = clearEmptySpans(first);
        if (last && last != first)
            last = clearEmptySpans(last);
        let newMarkers = [first];
        if (!sameLine) {
            let gap = change.text.length - 2, gapMarkers;
            if (gap > 0 && first)
                for (let i = 0; i < first.length; ++i)
                    if (first[i].to == null)
                        (gapMarkers || (gapMarkers = [])).push(new MarkedSpan(first[i].marker, null, null));
            for (let i = 0; i < gap; ++i)
                newMarkers.push(gapMarkers);
            newMarkers.push(last);
        }
        return newMarkers;
    }
    function clearEmptySpans(spans) {
        for (let i = 0; i < spans.length; ++i) {
            let span = spans[i];
            if (span.from != null && span.from == span.to && span.marker.clearWhenEmpty !== false)
                spans.splice(i--, 1);
        }
        if (!spans.length)
            return null;
        return spans;
    }
    function removeReadOnlyRanges(doc, from, to) {
        let markers = null;
        doc.iter(from.line, to.line + 1, line => {
            if (line.markedSpans)
                for (let i = 0; i < line.markedSpans.length; ++i) {
                    let mark = line.markedSpans[i].marker;
                    if (mark.readOnly && (!markers || misc.indexOf(markers, mark) == -1))
                        (markers || (markers = [])).push(mark);
                }
        });
        if (!markers)
            return null;
        let parts = [{
                from: from,
                to: to
            }];
        for (let i = 0; i < markers.length; ++i) {
            let mk = markers[i], m = mk.find(0);
            for (let j = 0; j < parts.length; ++j) {
                let p = parts[j];
                if (pos.cmp(p.to, m.from) < 0 || pos.cmp(p.from, m.to) > 0)
                    continue;
                let newParts = [
                        j,
                        1
                    ], dfrom = pos.cmp(p.from, m.from), dto = pos.cmp(p.to, m.to);
                if (dfrom < 0 || !mk.inclusiveLeft && !dfrom)
                    newParts.push({
                        from: p.from,
                        to: m.from
                    });
                if (dto > 0 || !mk.inclusiveRight && !dto)
                    newParts.push({
                        from: m.to,
                        to: p.to
                    });
                parts.splice.apply(parts, newParts);
                j += newParts.length - 3;
            }
        }
        return parts;
    }
    function detachMarkedSpans(line) {
        let spans = line.markedSpans;
        if (!spans)
            return;
        for (let i = 0; i < spans.length; ++i)
            spans[i].marker.detachLine(line);
        line.markedSpans = null;
    }
    function attachMarkedSpans(line, spans) {
        if (!spans)
            return;
        for (let i = 0; i < spans.length; ++i)
            spans[i].marker.attachLine(line);
        line.markedSpans = spans;
    }
    function extraLeft(marker) {
        return marker.inclusiveLeft ? -1 : 0;
    }
    function extraRight(marker) {
        return marker.inclusiveRight ? 1 : 0;
    }
    function compareCollapsedMarkers(a, b) {
        let lenDiff = a.lines.length - b.lines.length;
        if (lenDiff != 0)
            return lenDiff;
        let aPos = a.find(), bPos = b.find();
        let fromCmp = pos.cmp(aPos.from, bPos.from) || extraLeft(a) - extraLeft(b);
        if (fromCmp)
            return -fromCmp;
        let toCmp = pos.cmp(aPos.to, bPos.to) || extraRight(a) - extraRight(b);
        if (toCmp)
            return toCmp;
        return b.id - a.id;
    }
    function collapsedSpanAtSide(line, start) {
        let sps = saw_special_spans.sawCollapsedSpans && line.markedSpans, found;
        if (sps)
            for (let sp, i = 0; i < sps.length; ++i) {
                sp = sps[i];
                if (sp.marker.collapsed && (start ? sp.from : sp.to) == null && (!found || compareCollapsedMarkers(found, sp.marker) < 0))
                    found = sp.marker;
            }
        return found;
    }
    function collapsedSpanAtStart(line) {
        return collapsedSpanAtSide(line, true);
    }
    function collapsedSpanAtEnd(line) {
        return collapsedSpanAtSide(line, false);
    }
    function collapsedSpanAround(line, ch) {
        let sps = saw_special_spans.sawCollapsedSpans && line.markedSpans, found;
        if (sps)
            for (let i = 0; i < sps.length; ++i) {
                let sp = sps[i];
                if (sp.marker.collapsed && (sp.from == null || sp.from < ch) && (sp.to == null || sp.to > ch) && (!found || compareCollapsedMarkers(found, sp.marker) < 0))
                    found = sp.marker;
            }
        return found;
    }
    function conflictingCollapsedRange(doc, lineNo, from, to, marker) {
        let line = utils_line.getLine(doc, lineNo);
        let sps = saw_special_spans.sawCollapsedSpans && line.markedSpans;
        if (sps)
            for (let i = 0; i < sps.length; ++i) {
                let sp = sps[i];
                if (!sp.marker.collapsed)
                    continue;
                let found = sp.marker.find(0);
                let fromCmp = pos.cmp(found.from, from) || extraLeft(sp.marker) - extraLeft(marker);
                let toCmp = pos.cmp(found.to, to) || extraRight(sp.marker) - extraRight(marker);
                if (fromCmp >= 0 && toCmp <= 0 || fromCmp <= 0 && toCmp >= 0)
                    continue;
                if (fromCmp <= 0 && (sp.marker.inclusiveRight && marker.inclusiveLeft ? pos.cmp(found.to, from) >= 0 : pos.cmp(found.to, from) > 0) || fromCmp >= 0 && (sp.marker.inclusiveRight && marker.inclusiveLeft ? pos.cmp(found.from, to) <= 0 : pos.cmp(found.from, to) < 0))
                    return true;
            }
    }
    function visualLine(line) {
        let merged;
        while (merged = collapsedSpanAtStart(line))
            line = merged.find(-1, true).line;
        return line;
    }
    function visualLineEnd(line) {
        let merged;
        while (merged = collapsedSpanAtEnd(line))
            line = merged.find(1, true).line;
        return line;
    }
    function visualLineContinued(line) {
        let merged, lines;
        while (merged = collapsedSpanAtEnd(line)) {
            line = merged.find(1, true).line;
            (lines || (lines = [])).push(line);
        }
        return lines;
    }
    function visualLineNo(doc, lineN) {
        let line = utils_line.getLine(doc, lineN), vis = visualLine(line);
        if (line == vis)
            return lineN;
        return utils_line.lineNo(vis);
    }
    function visualLineEndNo(doc, lineN) {
        if (lineN > doc.lastLine())
            return lineN;
        let line = utils_line.getLine(doc, lineN), merged;
        if (!lineIsHidden(doc, line))
            return lineN;
        while (merged = collapsedSpanAtEnd(line))
            line = merged.find(1, true).line;
        return utils_line.lineNo(line) + 1;
    }
    function lineIsHidden(doc, line) {
        let sps = saw_special_spans.sawCollapsedSpans && line.markedSpans;
        if (sps)
            for (let sp, i = 0; i < sps.length; ++i) {
                sp = sps[i];
                if (!sp.marker.collapsed)
                    continue;
                if (sp.from == null)
                    return true;
                if (sp.marker.widgetNode)
                    continue;
                if (sp.from == 0 && sp.marker.inclusiveLeft && lineIsHiddenInner(doc, line, sp))
                    return true;
            }
    }
    function lineIsHiddenInner(doc, line, span) {
        if (span.to == null) {
            let end = span.marker.find(1, true);
            return lineIsHiddenInner(doc, end.line, getMarkedSpanFor(end.line.markedSpans, span.marker));
        }
        if (span.marker.inclusiveRight && span.to == line.text.length)
            return true;
        for (let sp, i = 0; i < line.markedSpans.length; ++i) {
            sp = line.markedSpans[i];
            if (sp.marker.collapsed && !sp.marker.widgetNode && sp.from == span.to && (sp.to == null || sp.to != span.from) && (sp.marker.inclusiveLeft || span.marker.inclusiveRight) && lineIsHiddenInner(doc, line, sp))
                return true;
        }
    }
    function heightAtLine(lineObj) {
        lineObj = visualLine(lineObj);
        let h = 0, chunk = lineObj.parent;
        for (let i = 0; i < chunk.lines.length; ++i) {
            let line = chunk.lines[i];
            if (line == lineObj)
                break;
            else
                h += line.height;
        }
        for (let p = chunk.parent; p; chunk = p, p = chunk.parent) {
            for (let i = 0; i < p.children.length; ++i) {
                let cur = p.children[i];
                if (cur == chunk)
                    break;
                else
                    h += cur.height;
            }
        }
        return h;
    }
    function lineLength(line) {
        if (line.height == 0)
            return 0;
        let len = line.text.length, merged, cur = line;
        while (merged = collapsedSpanAtStart(cur)) {
            let found = merged.find(0, true);
            cur = found.from.line;
            len += found.from.ch - found.to.ch;
        }
        cur = line;
        while (merged = collapsedSpanAtEnd(cur)) {
            let found = merged.find(0, true);
            len -= cur.text.length - found.from.ch;
            cur = found.to.line;
            len += cur.text.length - found.to.ch;
        }
        return len;
    }
    function findMaxLine(cm) {
        let d = cm.display, doc = cm.doc;
        d.maxLine = utils_line.getLine(doc, doc.first);
        d.maxLineLength = lineLength(d.maxLine);
        d.maxLineChanged = true;
        doc.iter(line => {
            let len = lineLength(line);
            if (len > d.maxLineLength) {
                d.maxLineLength = len;
                d.maxLine = line;
            }
        });
    }
    return {
        MarkedSpan: MarkedSpan,
        getMarkedSpanFor: getMarkedSpanFor,
        removeMarkedSpan: removeMarkedSpan,
        addMarkedSpan: addMarkedSpan,
        stretchSpansOverChange: stretchSpansOverChange,
        removeReadOnlyRanges: removeReadOnlyRanges,
        detachMarkedSpans: detachMarkedSpans,
        attachMarkedSpans: attachMarkedSpans,
        compareCollapsedMarkers: compareCollapsedMarkers,
        collapsedSpanAtStart: collapsedSpanAtStart,
        collapsedSpanAtEnd: collapsedSpanAtEnd,
        collapsedSpanAround: collapsedSpanAround,
        conflictingCollapsedRange: conflictingCollapsedRange,
        visualLine: visualLine,
        visualLineEnd: visualLineEnd,
        visualLineContinued: visualLineContinued,
        visualLineNo: visualLineNo,
        visualLineEndNo: visualLineEndNo,
        lineIsHidden: lineIsHidden,
        heightAtLine: heightAtLine,
        lineLength: lineLength,
        findMaxLine: findMaxLine
    };
});