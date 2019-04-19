define([
    '../line/pos',
    '../util/misc'
], function (a, b) {
    'use strict';
    class Selection {
        constructor(ranges, primIndex) {
            this.ranges = ranges;
            this.primIndex = primIndex;
        }
        primary() {
            return this.ranges[this.primIndex];
        }
        equals(other) {
            if (other == this)
                return true;
            if (other.primIndex != this.primIndex || other.ranges.length != this.ranges.length)
                return false;
            for (let i = 0; i < this.ranges.length; i++) {
                let here = this.ranges[i], there = other.ranges[i];
                if (!a.equalCursorPos(here.anchor, there.anchor) || !a.equalCursorPos(here.head, there.head))
                    return false;
            }
            return true;
        }
        deepCopy() {
            let out = [];
            for (let i = 0; i < this.ranges.length; i++)
                out[i] = new Range(a.copyPos(this.ranges[i].anchor), a.copyPos(this.ranges[i].head));
            return new Selection(out, this.primIndex);
        }
        somethingSelected() {
            for (let i = 0; i < this.ranges.length; i++)
                if (!this.ranges[i].empty())
                    return true;
            return false;
        }
        contains(pos, end) {
            if (!end)
                end = pos;
            for (let i = 0; i < this.ranges.length; i++) {
                let range = this.ranges[i];
                if (a.cmp(end, range.from()) >= 0 && a.cmp(pos, range.to()) <= 0)
                    return i;
            }
            return -1;
        }
    }
    class Range {
        constructor(anchor, head) {
            this.anchor = anchor;
            this.head = head;
        }
        from() {
            return a.minPos(this.anchor, this.head);
        }
        to() {
            return a.maxPos(this.anchor, this.head);
        }
        empty() {
            return this.head.line == this.anchor.line && this.head.ch == this.anchor.ch;
        }
    }
    function normalizeSelection(cm, ranges, primIndex) {
        let mayTouch = cm && cm.options.selectionsMayTouch;
        let prim = ranges[primIndex];
        ranges.sort((a, b) => a.cmp(a.from(), b.from()));
        primIndex = b.indexOf(ranges, prim);
        for (let i = 1; i < ranges.length; i++) {
            let cur = ranges[i], prev = ranges[i - 1];
            let diff = a.cmp(prev.to(), cur.from());
            if (mayTouch && !cur.empty() ? diff > 0 : diff >= 0) {
                let from = a.minPos(prev.from(), cur.from()), to = a.maxPos(prev.to(), cur.to());
                let inv = prev.empty() ? cur.from() == cur.head : prev.from() == prev.head;
                if (i <= primIndex)
                    --primIndex;
                ranges.splice(--i, 2, new Range(inv ? to : from, inv ? from : to));
            }
        }
        return new Selection(ranges, primIndex);
    }
    function simpleSelection(anchor, head) {
        return new Selection([new Range(anchor, head || anchor)], 0);
    }
    return {
        Selection: Selection,
        Range: Range,
        normalizeSelection: normalizeSelection,
        simpleSelection: simpleSelection
    };
});