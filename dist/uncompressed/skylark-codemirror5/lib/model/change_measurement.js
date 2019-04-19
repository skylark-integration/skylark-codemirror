define([
    '../line/pos',
    '../util/misc',
    './selection'
], function (a, b, c) {
    'use strict';
    function changeEnd(change) {
        if (!change.text)
            return change.to;
        return a.Pos(change.from.line + change.text.length - 1, b.lst(change.text).length + (change.text.length == 1 ? change.from.ch : 0));
    }
    function adjustForChange(pos, change) {
        if (a.cmp(pos, change.from) < 0)
            return pos;
        if (a.cmp(pos, change.to) <= 0)
            return changeEnd(change);
        let line = pos.line + change.text.length - (change.to.line - change.from.line) - 1, ch = pos.ch;
        if (pos.line == change.to.line)
            ch += changeEnd(change).ch - change.to.ch;
        return a.Pos(line, ch);
    }
    function computeSelAfterChange(doc, change) {
        let out = [];
        for (let i = 0; i < doc.sel.ranges.length; i++) {
            let range = doc.sel.ranges[i];
            out.push(new c.Range(adjustForChange(range.anchor, change), adjustForChange(range.head, change)));
        }
        return c.normalizeSelection(doc.cm, out, doc.sel.primIndex);
    }
    function offsetPos(pos, old, nw) {
        if (pos.line == old.line)
            return a.Pos(nw.line, pos.ch - old.ch + nw.ch);
        else
            return a.Pos(nw.line + (pos.line - old.line), pos.ch);
    }
    function computeReplacedSel(doc, changes, hint) {
        let out = [];
        let oldPrev = a.Pos(doc.first, 0), newPrev = oldPrev;
        for (let i = 0; i < changes.length; i++) {
            let change = changes[i];
            let from = offsetPos(change.from, oldPrev, newPrev);
            let to = offsetPos(changeEnd(change), oldPrev, newPrev);
            oldPrev = change.to;
            newPrev = to;
            if (hint == 'around') {
                let range = doc.sel.ranges[i], inv = a.cmp(range.head, range.anchor) < 0;
                out[i] = new c.Range(inv ? to : from, inv ? from : to);
            } else {
                out[i] = new c.Range(from, from);
            }
        }
        return new c.Selection(out, doc.sel.primIndex);
    }
    return {
        changeEnd: changeEnd,
        computeSelAfterChange: computeSelAfterChange,
        computeReplacedSel: computeReplacedSel
    };
});