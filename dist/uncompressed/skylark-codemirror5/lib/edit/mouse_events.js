define([
    '../display/focus',
    '../display/operations',
    '../display/update_lines',
    '../line/pos',
    '../line/utils_line',
    '../measurement/position_measurement',
    '../measurement/widgets',
    '../model/selection',
    '../model/selection_updates',
    '../util/browser',
    '../util/bidi',
    '../util/dom',
    '../util/event',
    '../util/feature_detection',
    '../util/misc',
    '../input/keymap',
    './key_events',
    './commands'
], function (a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r) {
    'use strict';
    const DOUBLECLICK_DELAY = 400;
    class PastClick {
        constructor(time, pos, button) {
            this.time = time;
            this.pos = pos;
            this.button = button;
        }
        compare(time, pos, button) {
            return this.time + DOUBLECLICK_DELAY > time && d.cmp(pos, this.pos) == 0 && button == this.button;
        }
    }
    let lastClick, lastDoubleClick;
    function clickRepeat(pos, button) {
        let now = +new Date();
        if (lastDoubleClick && lastDoubleClick.compare(now, pos, button)) {
            lastClick = lastDoubleClick = null;
            return 'triple';
        } else if (lastClick && lastClick.compare(now, pos, button)) {
            lastDoubleClick = new PastClick(now, pos, button);
            lastClick = null;
            return 'double';
        } else {
            lastClick = new PastClick(now, pos, button);
            lastDoubleClick = null;
            return 'single';
        }
    }
    function onMouseDown(e) {
        let cm = this, display = cm.display;
        if (m.signalDOMEvent(cm, e) || display.activeTouch && display.input.supportsTouch())
            return;
        display.input.ensurePolled();
        display.shift = e.shiftKey;
        if (g.eventInWidget(display, e)) {
            if (!j.webkit) {
                display.scroller.draggable = false;
                setTimeout(() => display.scroller.draggable = true, 100);
            }
            return;
        }
        if (clickInGutter(cm, e))
            return;
        let pos = f.posFromMouse(cm, e), button = m.e_button(e), repeat = pos ? clickRepeat(pos, button) : 'single';
        window.focus();
        if (button == 1 && cm.state.selectingText)
            cm.state.selectingText(e);
        if (pos && handleMappedButton(cm, button, pos, repeat, e))
            return;
        if (button == 1) {
            if (pos)
                leftButtonDown(cm, pos, repeat, e);
            else if (m.e_target(e) == display.scroller)
                m.e_preventDefault(e);
        } else if (button == 2) {
            if (pos)
                i.extendSelection(cm.doc, pos);
            setTimeout(() => display.input.focus(), 20);
        } else if (button == 3) {
            if (j.captureRightClick)
                cm.display.input.onContextMenu(e);
            else
                a.delayBlurEvent(cm);
        }
    }
    function handleMappedButton(cm, button, pos, repeat, event) {
        let name = 'Click';
        if (repeat == 'double')
            name = 'Double' + name;
        else if (repeat == 'triple')
            name = 'Triple' + name;
        name = (button == 1 ? 'Left' : button == 2 ? 'Middle' : 'Right') + name;
        return q.dispatchKey(cm, p.addModifierNames(name, event), event, bound => {
            if (typeof bound == 'string')
                bound = r.commands[bound];
            if (!bound)
                return false;
            let done = false;
            try {
                if (cm.isReadOnly())
                    cm.state.suppressEdits = true;
                done = bound(cm, pos) != o.Pass;
            } finally {
                cm.state.suppressEdits = false;
            }
            return done;
        });
    }
    function configureMouse(cm, repeat, event) {
        let option = cm.getOption('configureMouse');
        let value = option ? option(cm, repeat, event) : {};
        if (value.unit == null) {
            let rect = j.chromeOS ? event.shiftKey && event.metaKey : event.altKey;
            value.unit = rect ? 'rectangle' : repeat == 'single' ? 'char' : repeat == 'double' ? 'word' : 'line';
        }
        if (value.extend == null || cm.doc.extend)
            value.extend = cm.doc.extend || event.shiftKey;
        if (value.addNew == null)
            value.addNew = j.mac ? event.metaKey : event.ctrlKey;
        if (value.moveOnDrag == null)
            value.moveOnDrag = !(j.mac ? event.altKey : event.ctrlKey);
        return value;
    }
    function leftButtonDown(cm, pos, repeat, event) {
        if (j.ie)
            setTimeout(o.bind(a.ensureFocus, cm), 0);
        else
            cm.curOp.focus = l.activeElt();
        let behavior = configureMouse(cm, repeat, event);
        let sel = cm.doc.sel, contained;
        if (cm.options.dragDrop && n.dragAndDrop && !cm.isReadOnly() && repeat == 'single' && (contained = sel.contains(pos)) > -1 && (d.cmp((contained = sel.ranges[contained]).from(), pos) < 0 || pos.xRel > 0) && (d.cmp(contained.to(), pos) > 0 || pos.xRel < 0))
            leftButtonStartDrag(cm, event, pos, behavior);
        else
            leftButtonSelect(cm, event, pos, behavior);
    }
    function leftButtonStartDrag(cm, event, pos, behavior) {
        let display = cm.display, moved = false;
        let dragEnd = b.operation(cm, e => {
            if (j.webkit)
                display.scroller.draggable = false;
            cm.state.draggingText = false;
            m.off(display.wrapper.ownerDocument, 'mouseup', dragEnd);
            m.off(display.wrapper.ownerDocument, 'mousemove', mouseMove);
            m.off(display.scroller, 'dragstart', dragStart);
            m.off(display.scroller, 'drop', dragEnd);
            if (!moved) {
                m.e_preventDefault(e);
                if (!behavior.addNew)
                    i.extendSelection(cm.doc, pos, null, null, behavior.extend);
                if (j.webkit || j.ie && j.ie_version == 9)
                    setTimeout(() => {
                        display.wrapper.ownerDocument.body.focus();
                        display.input.focus();
                    }, 20);
                else
                    display.input.focus();
            }
        });
        let mouseMove = function (e2) {
            moved = moved || Math.abs(event.clientX - e2.clientX) + Math.abs(event.clientY - e2.clientY) >= 10;
        };
        let dragStart = () => moved = true;
        if (j.webkit)
            display.scroller.draggable = true;
        cm.state.draggingText = dragEnd;
        dragEnd.copy = !behavior.moveOnDrag;
        if (display.scroller.dragDrop)
            display.scroller.dragDrop();
        m.on(display.wrapper.ownerDocument, 'mouseup', dragEnd);
        m.on(display.wrapper.ownerDocument, 'mousemove', mouseMove);
        m.on(display.scroller, 'dragstart', dragStart);
        m.on(display.scroller, 'drop', dragEnd);
        a.delayBlurEvent(cm);
        setTimeout(() => display.input.focus(), 20);
    }
    function rangeForUnit(cm, pos, unit) {
        if (unit == 'char')
            return new h.Range(pos, pos);
        if (unit == 'word')
            return cm.findWordAt(pos);
        if (unit == 'line')
            return new h.Range(d.Pos(pos.line, 0), d.clipPos(cm.doc, d.Pos(pos.line + 1, 0)));
        let result = unit(cm, pos);
        return new h.Range(result.from, result.to);
    }
    function leftButtonSelect(cm, event, start, behavior) {
        let display = cm.display, doc = cm.doc;
        m.e_preventDefault(event);
        let ourRange, ourIndex, startSel = doc.sel, ranges = startSel.ranges;
        if (behavior.addNew && !behavior.extend) {
            ourIndex = doc.sel.contains(start);
            if (ourIndex > -1)
                ourRange = ranges[ourIndex];
            else
                ourRange = new h.Range(start, start);
        } else {
            ourRange = doc.sel.primary();
            ourIndex = doc.sel.primIndex;
        }
        if (behavior.unit == 'rectangle') {
            if (!behavior.addNew)
                ourRange = new h.Range(start, start);
            start = f.posFromMouse(cm, event, true, true);
            ourIndex = -1;
        } else {
            let range = rangeForUnit(cm, start, behavior.unit);
            if (behavior.extend)
                ourRange = i.extendRange(ourRange, range.anchor, range.head, behavior.extend);
            else
                ourRange = range;
        }
        if (!behavior.addNew) {
            ourIndex = 0;
            i.setSelection(doc, new h.Selection([ourRange], 0), o.sel_mouse);
            startSel = doc.sel;
        } else if (ourIndex == -1) {
            ourIndex = ranges.length;
            i.setSelection(doc, h.normalizeSelection(cm, ranges.concat([ourRange]), ourIndex), {
                scroll: false,
                origin: '*mouse'
            });
        } else if (ranges.length > 1 && ranges[ourIndex].empty() && behavior.unit == 'char' && !behavior.extend) {
            i.setSelection(doc, h.normalizeSelection(cm, ranges.slice(0, ourIndex).concat(ranges.slice(ourIndex + 1)), 0), {
                scroll: false,
                origin: '*mouse'
            });
            startSel = doc.sel;
        } else {
            i.replaceOneSelection(doc, ourIndex, ourRange, o.sel_mouse);
        }
        let lastPos = start;
        function extendTo(pos) {
            if (d.cmp(lastPos, pos) == 0)
                return;
            lastPos = pos;
            if (behavior.unit == 'rectangle') {
                let ranges = [], tabSize = cm.options.tabSize;
                let startCol = o.countColumn(e.getLine(doc, start.line).text, start.ch, tabSize);
                let posCol = o.countColumn(e.getLine(doc, pos.line).text, pos.ch, tabSize);
                let left = Math.min(startCol, posCol), right = Math.max(startCol, posCol);
                for (let line = Math.min(start.line, pos.line), end = Math.min(cm.lastLine(), Math.max(start.line, pos.line)); line <= end; line++) {
                    let text = e.getLine(doc, line).text, leftPos = o.findColumn(text, left, tabSize);
                    if (left == right)
                        ranges.push(new h.Range(d.Pos(line, leftPos), d.Pos(line, leftPos)));
                    else if (text.length > leftPos)
                        ranges.push(new h.Range(d.Pos(line, leftPos), d.Pos(line, o.findColumn(text, right, tabSize))));
                }
                if (!ranges.length)
                    ranges.push(new h.Range(start, start));
                i.setSelection(doc, h.normalizeSelection(cm, startSel.ranges.slice(0, ourIndex).concat(ranges), ourIndex), {
                    origin: '*mouse',
                    scroll: false
                });
                cm.scrollIntoView(pos);
            } else {
                let oldRange = ourRange;
                let range = rangeForUnit(cm, pos, behavior.unit);
                let anchor = oldRange.anchor, head;
                if (d.cmp(range.anchor, anchor) > 0) {
                    head = range.head;
                    anchor = d.minPos(oldRange.from(), range.anchor);
                } else {
                    head = range.anchor;
                    anchor = d.maxPos(oldRange.to(), range.head);
                }
                let ranges = startSel.ranges.slice(0);
                ranges[ourIndex] = bidiSimplify(cm, new h.Range(d.clipPos(doc, anchor), head));
                i.setSelection(doc, h.normalizeSelection(cm, ranges, ourIndex), o.sel_mouse);
            }
        }
        let editorSize = display.wrapper.getBoundingClientRect();
        let counter = 0;
        function extend(e) {
            let curCount = ++counter;
            let cur = f.posFromMouse(cm, e, true, behavior.unit == 'rectangle');
            if (!cur)
                return;
            if (d.cmp(cur, lastPos) != 0) {
                cm.curOp.focus = l.activeElt();
                extendTo(cur);
                let visible = c.visibleLines(display, doc);
                if (cur.line >= visible.to || cur.line < visible.from)
                    setTimeout(b.operation(cm, () => {
                        if (counter == curCount)
                            extend(e);
                    }), 150);
            } else {
                let outside = e.clientY < editorSize.top ? -20 : e.clientY > editorSize.bottom ? 20 : 0;
                if (outside)
                    setTimeout(b.operation(cm, () => {
                        if (counter != curCount)
                            return;
                        display.scroller.scrollTop += outside;
                        extend(e);
                    }), 50);
            }
        }
        function done(e) {
            cm.state.selectingText = false;
            counter = Infinity;
            m.e_preventDefault(e);
            display.input.focus();
            m.off(display.wrapper.ownerDocument, 'mousemove', move);
            m.off(display.wrapper.ownerDocument, 'mouseup', up);
            doc.history.lastSelOrigin = null;
        }
        let move = b.operation(cm, e => {
            if (e.buttons === 0 || !m.e_button(e))
                done(e);
            else
                extend(e);
        });
        let up = b.operation(cm, done);
        cm.state.selectingText = up;
        m.on(display.wrapper.ownerDocument, 'mousemove', move);
        m.on(display.wrapper.ownerDocument, 'mouseup', up);
    }
    function bidiSimplify(cm, range) {
        let {anchor, head} = range, anchorLine = e.getLine(cm.doc, anchor.line);
        if (d.cmp(anchor, head) == 0 && anchor.sticky == head.sticky)
            return range;
        let order = k.getOrder(anchorLine);
        if (!order)
            return range;
        let index = k.getBidiPartAt(order, anchor.ch, anchor.sticky), part = order[index];
        if (part.from != anchor.ch && part.to != anchor.ch)
            return range;
        let boundary = index + (part.from == anchor.ch == (part.level != 1) ? 0 : 1);
        if (boundary == 0 || boundary == order.length)
            return range;
        let leftSide;
        if (head.line != anchor.line) {
            leftSide = (head.line - anchor.line) * (cm.doc.direction == 'ltr' ? 1 : -1) > 0;
        } else {
            let headIndex = k.getBidiPartAt(order, head.ch, head.sticky);
            let dir = headIndex - index || (head.ch - anchor.ch) * (part.level == 1 ? -1 : 1);
            if (headIndex == boundary - 1 || headIndex == boundary)
                leftSide = dir < 0;
            else
                leftSide = dir > 0;
        }
        let usePart = order[boundary + (leftSide ? -1 : 0)];
        let from = leftSide == (usePart.level == 1);
        let ch = from ? usePart.from : usePart.to, sticky = from ? 'after' : 'before';
        return anchor.ch == ch && anchor.sticky == sticky ? range : new h.Range(new d.Pos(anchor.line, ch, sticky), head);
    }
    function gutterEvent(cm, e, type, prevent) {
        let mX, mY;
        if (e.touches) {
            mX = e.touches[0].clientX;
            mY = e.touches[0].clientY;
        } else {
            try {
                mX = e.clientX;
                mY = e.clientY;
            } catch (e) {
                return false;
            }
        }
        if (mX >= Math.floor(cm.display.gutters.getBoundingClientRect().right))
            return false;
        if (prevent)
            m.e_preventDefault(e);
        let display = cm.display;
        let lineBox = display.lineDiv.getBoundingClientRect();
        if (mY > lineBox.bottom || !m.hasHandler(cm, type))
            return m.e_defaultPrevented(e);
        mY -= lineBox.top - display.viewOffset;
        for (let i = 0; i < cm.options.gutters.length; ++i) {
            let g = display.gutters.childNodes[i];
            if (g && g.getBoundingClientRect().right >= mX) {
                let line = e.lineAtHeight(cm.doc, mY);
                let gutter = cm.options.gutters[i];
                m.signal(cm, type, cm, line, gutter, e);
                return m.e_defaultPrevented(e);
            }
        }
    }
    function clickInGutter(cm, e) {
        return gutterEvent(cm, e, 'gutterClick', true);
    }
    function onContextMenu(cm, e) {
        if (g.eventInWidget(cm.display, e) || contextMenuInGutter(cm, e))
            return;
        if (m.signalDOMEvent(cm, e, 'contextmenu'))
            return;
        if (!j.captureRightClick)
            cm.display.input.onContextMenu(e);
    }
    function contextMenuInGutter(cm, e) {
        if (!m.hasHandler(cm, 'gutterContextMenu'))
            return false;
        return gutterEvent(cm, e, 'gutterContextMenu', false);
    }
    return {
        onMouseDown: onMouseDown,
        clickInGutter: clickInGutter,
        onContextMenu: onContextMenu
    };
});