define(['../util/misc'], function (a) {
    'use strict';
    function getLine(doc, n) {
        n -= doc.first;
        if (n < 0 || n >= doc.size)
            throw new Error('There is no line ' + (n + doc.first) + ' in the document.');
        let chunk = doc;
        while (!chunk.lines) {
            for (let i = 0;; ++i) {
                let child = chunk.children[i], sz = child.chunkSize();
                if (n < sz) {
                    chunk = child;
                    break;
                }
                n -= sz;
            }
        }
        return chunk.lines[n];
    }
    function getBetween(doc, start, end) {
        let out = [], n = start.line;
        doc.iter(start.line, end.line + 1, line => {
            let text = line.text;
            if (n == end.line)
                text = text.slice(0, end.ch);
            if (n == start.line)
                text = text.slice(start.ch);
            out.push(text);
            ++n;
        });
        return out;
    }
    function getLines(doc, from, to) {
        let out = [];
        doc.iter(from, to, line => {
            out.push(line.text);
        });
        return out;
    }
    function updateLineHeight(line, height) {
        let diff = height - line.height;
        if (diff)
            for (let n = line; n; n = n.parent)
                n.height += diff;
    }
    function lineNo(line) {
        if (line.parent == null)
            return null;
        let cur = line.parent, no = a.indexOf(cur.lines, line);
        for (let chunk = cur.parent; chunk; cur = chunk, chunk = chunk.parent) {
            for (let i = 0;; ++i) {
                if (chunk.children[i] == cur)
                    break;
                no += chunk.children[i].chunkSize();
            }
        }
        return no + cur.first;
    }
    function lineAtHeight(chunk, h) {
        let n = chunk.first;
        outer:
            do {
                for (let i = 0; i < chunk.children.length; ++i) {
                    let child = chunk.children[i], ch = child.height;
                    if (h < ch) {
                        chunk = child;
                        continue outer;
                    }
                    h -= ch;
                    n += child.chunkSize();
                }
                return n;
            } while (!chunk.lines);
        let i = 0;
        for (; i < chunk.lines.length; ++i) {
            let line = chunk.lines[i], lh = line.height;
            if (h < lh)
                break;
            h -= lh;
        }
        return n + i;
    }
    function isLine(doc, l) {
        return l >= doc.first && l < doc.first + doc.size;
    }
    function lineNumberFor(options, i) {
        return String(options.lineNumberFormatter(i + options.firstLineNumber));
    }
    return {
        getLine: getLine,
        getBetween: getBetween,
        getLines: getLines,
        updateLineHeight: updateLineHeight,
        lineNo: lineNo,
        lineAtHeight: lineAtHeight,
        isLine: isLine,
        lineNumberFor: lineNumberFor
    };
});