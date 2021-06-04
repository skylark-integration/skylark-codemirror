define([
    '../line/line_data',
    '../util/misc',
    '../util/operation_group'
], function (m_line_data, b, c) {
    'use strict';
    function LeafChunk(lines) {
        this.lines = lines;
        this.parent = null;
        let height = 0;
        for (let i = 0; i < lines.length; ++i) {
            lines[i].parent = this;
            height += lines[i].height;
        }
        this.height = height;
    }
    LeafChunk.prototype = {
        chunkSize() {
            return this.lines.length;
        },
        removeInner(at, n) {
            for (let i = at, e = at + n; i < e; ++i) {
                let line = this.lines[i];
                this.height -= line.height;
                m_line_data.cleanUpLine(line);
                c.signalLater(line, 'delete');
            }
            this.lines.splice(at, n);
        },
        collapse(lines) {
            lines.push.apply(lines, this.lines);
        },
        insertInner(at, lines, height) {
            this.height += height;
            this.lines = this.lines.slice(0, at).concat(lines).concat(this.lines.slice(at));
            for (let i = 0; i < lines.length; ++i)
                lines[i].parent = this;
        },
        iterN(at, n, op) {
            for (let e = at + n; at < e; ++at)
                if (op(this.lines[at]))
                    return true;
        }
    };
    function BranchChunk(children) {
        this.children = children;
        let size = 0, height = 0;
        for (let i = 0; i < children.length; ++i) {
            let ch = children[i];
            size += ch.chunkSize();
            height += ch.height;
            ch.parent = this;
        }
        this.size = size;
        this.height = height;
        this.parent = null;
    }
    BranchChunk.prototype = {
        chunkSize() {
            return this.size;
        },
        removeInner(at, n) {
            this.size -= n;
            for (let i = 0; i < this.children.length; ++i) {
                let child = this.children[i], sz = child.chunkSize();
                if (at < sz) {
                    let rm = Math.min(n, sz - at), oldHeight = child.height;
                    child.removeInner(at, rm);
                    this.height -= oldHeight - child.height;
                    if (sz == rm) {
                        this.children.splice(i--, 1);
                        child.parent = null;
                    }
                    if ((n -= rm) == 0)
                        break;
                    at = 0;
                } else
                    at -= sz;
            }
            if (this.size - n < 25 && (this.children.length > 1 || !(this.children[0] instanceof LeafChunk))) {
                let lines = [];
                this.collapse(lines);
                this.children = [new LeafChunk(lines)];
                this.children[0].parent = this;
            }
        },
        collapse(lines) {
            for (let i = 0; i < this.children.length; ++i)
                this.children[i].collapse(lines);
        },
        insertInner(at, lines, height) {
            this.size += lines.length;
            this.height += height;
            for (let i = 0; i < this.children.length; ++i) {
                let child = this.children[i], sz = child.chunkSize();
                if (at <= sz) {
                    child.insertInner(at, lines, height);
                    if (child.lines && child.lines.length > 50) {
                        let remaining = child.lines.length % 25 + 25;
                        for (let pos = remaining; pos < child.lines.length;) {
                            let leaf = new LeafChunk(child.lines.slice(pos, pos += 25));
                            child.height -= leaf.height;
                            this.children.splice(++i, 0, leaf);
                            leaf.parent = this;
                        }
                        child.lines = child.lines.slice(0, remaining);
                        this.maybeSpill();
                    }
                    break;
                }
                at -= sz;
            }
        },
        maybeSpill() {
            if (this.children.length <= 10)
                return;
            let me = this;
            do {
                let spilled = me.children.splice(me.children.length - 5, 5);
                let sibling = new BranchChunk(spilled);
                if (!me.parent) {
                    let copy = new BranchChunk(me.children);
                    copy.parent = me;
                    me.children = [
                        copy,
                        sibling
                    ];
                    me = copy;
                } else {
                    me.size -= sibling.size;
                    me.height -= sibling.height;
                    let myIndex = b.indexOf(me.parent.children, me);
                    me.parent.children.splice(myIndex + 1, 0, sibling);
                }
                sibling.parent = me.parent;
            } while (me.children.length > 10);
            me.parent.maybeSpill();
        },
        iterN(at, n, op) {
            for (let i = 0; i < this.children.length; ++i) {
                let child = this.children[i], sz = child.chunkSize();
                if (at < sz) {
                    let used = Math.min(n, sz - at);
                    if (child.iterN(at, used, op))
                        return true;
                    if ((n -= used) == 0)
                        break;
                    at = 0;
                } else
                    at -= sz;
            }
        }
    };
    return {
        LeafChunk: LeafChunk,
        BranchChunk: BranchChunk
    };
});