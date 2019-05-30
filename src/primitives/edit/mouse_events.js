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
], function (focus, operations, update_lines, line_pos, utils_line, position_measurement, widgets, selection, selection_updates, browser, bidi, dom, events, n, o, p, q, r) {
    'use strict';
    const DOUBLECLICK_DELAY = 400;
    class PastClick {
        constructor(time, pos, button) {
            this.time = time;
            this.pos = pos;
            this.button = button;
        }
        compare(time, pos, button) {
            return this.time + DOUBLECLICK_DELAY > time && line_pos.cmp(pos, this.pos) == 0 && button == this.button;
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
        if (events.signalDOMEvent(cm, e) || display.activeTouch && display.input.supportsTouch())
            return;
        display.input.ensurePolled();
        display.shift = e.shiftKey;
        if (widgets.eventInWidget(display, e)) {
            if (!browser.webkit) {
                display.scroller.draggable = false;
                setTimeout(() => display.scroller.draggable = true, 100);
            }
            return;
        }
        if (clickInGutter(cm, e))
            return;
        let pos = position_measurement.posFromMouse(cm, e), button = events.e_button(e), repeat = pos ? clickRepeat(pos, button) : 'single';
        window.focus();
        if (button == 1 && cm.state.selectingText)
            cm.state.selectingText(e);
        if (pos && handleMappedButton(cm, button, pos, repeat, e))
            return;
        if (button == 1) {
            if (pos)
                leftButtonDown(cm, pos, repeat, e);
            else if (events.e_target(e) == display.scroller)
                events.e_preventDefault(e);
        } else if (button == 2) {
            if (pos)
                selection_updates.extendSelection(cm.doc, pos);
            setTimeout(() => display.input.focus(), 20);
        } else if (button == 3) {
            if (browser.captureRightClick)
                cm.display.input.onContextMenu(e);
            else
                focus.delayBlurEvent(cm);
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
            let rect = browser.chromeOS ? event.shiftKey && event.metaKey : event.altKey;
            value.unit = rect ? 'rectangle' : repeat == 'single' ? 'char' : repeat == 'double' ? 'word' : 'line';
        }
        if (value.extend == null || cm.doc.extend)
            value.extend = cm.doc.extend || event.shiftKey;
        if (value.addNew == null)
            value.addNew = browser.mac ? event.metaKey : event.ctrlKey;
        if (value.moveOnDrag == null)
            value.moveOnDrag = !(browser.mac ? event.altKey : event.ctrlKey);
        return value;
    }
    function leftButtonDown(cm, pos, repeat, event) {
        if (browser.ie)
            setTimeout(o.bind(focus.ensureFocus, cm), 0);
        else
            cm.curOp.focus = dom.activeElt();
        let behavior = configureMouse(cm, repeat, event);
        let sel = cm.doc.sel, contained;
        if (cm.options.dragDrop && n.dragAndDrop && !cm.isReadOnly() && repeat == 'single' && (contained = sel.contains(pos)) > -1 && (line_pos.cmp((contained = sel.ranges[contained]).from(), pos) < 0 || pos.xRel > 0) && (line_pos.cmp(contained.to(), pos) > 0 || pos.xRel < 0))
            leftButtonStartDrag(cm, event, pos, behavior);
        else
            leftButtonSelect(cm, event, pos, behavior);
    }
    function leftButtonStartDrag(cm, event, pos, behavior) {
        let display = cm.display, moved = false;
        let dragEnd = operations.operation(cm, e => {
            if (browser.webkit)
                display.scroller.draggable = false;
            cm.state.draggingText = false;
            events.off(display.wrapper.ownerDocument, 'mouseup', dragEnd);
            events.off(display.wrapper.ownerDocument, 'mousemove', mouseMove);
            events.off(display.scroller, 'dragstart', dragStart);
            events.off(display.scroller, 'drop', dragEnd);
            if (!moved) {
                events.e_preventDefault(e);
                if (!behavior.addNew)
                    selection_updates.extendSelection(cm.doc, pos, null, null, behavior.extend);
                if (browser.webkit || browser.ie && browser.ie_version == 9)
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
        if (browser.webkit)
            display.scroller.draggable = true;
        cm.state.draggingText = dragEnd;
        dragEnd.copy = !behavior.moveOnDrag;
        if (display.scroller.dragDrop)
            display.scroller.dragDrop();
        events.on(display.wrapper.ownerDocument, 'mouseup', dragEnd);
        events.on(display.wrapper.ownerDocument, 'mousemove', mouseMove);
        events.on(display.scroller, 'dragstart', dragStart);
        events.on(display.scroller, 'drop', dragEnd);
        focus.delayBlurEvent(cm);
        setTimeout(() => display.input.focus(), 20);
    }
    function rangeForUnit(cm, pos, unit) {
        if (unit == 'char')
            return new selection.Range(pos, pos);
        if (unit == 'word')
            return cm.findWordAt(pos);
        if (unit == 'line')
            return new selection.Range(line_pos.Pos(pos.line, 0), line_pos.clipPos(cm.doc, line_pos.Pos(pos.line + 1, 0)));
        let result = unit(cm, pos);
        return new selection.Range(result.from, result.to);
    }
    function leftButtonSelect(cm, event, start, behavior) {
        let display = cm.display, doc = cm.doc;
        events.e_preventDefault(event);
        let ourRange, ourIndex, startSel = doc.sel, ranges = startSel.ranges;
        if (behavior.addNew && !behavior.extend) {
            ourIndex = doc.sel.contains(start);
            if (ourIndex > -1)
                ourRange = ranges[ourIndex];
            else
                ourRange = new selection.Range(start, start);
        } else {
            ourRange = doc.sel.primary();
            ourIndex = doc.sel.primIndex;
        }
        if (behavior.unit == 'rectangle') {
            if (!behavior.addNew)
                ourRange = new selection.Range(start, start);
            start = position_measurement.posFromMouse(cm, event, true, true);
            ourIndex = -1;
        } else {
            let range = rangeForUnit(cm, start, behavior.unit);
            if (behavior.extend)
                ourRange = selection_updates.extendRange(ourRange, range.anchor, range.head, behavior.extend);
            else
                ourRange = range;
        }
        if (!behavior.addNew) {
            ourIndex = 0;
            selection_updates.setSelection(doc, new selection.Selection([ourRange], 0), o.sel_mouse);
            startSel = doc.sel;
        } else if (ourIndex == -1) {
            ourIndex = ranges.length;
            selection_updates.setSelection(doc, selection.normalizeSelection(cm, ranges.concat([ourRange]), ourIndex), {
                scroll: false,
                origin: '*mouse'
            });
        } else if (ranges.length > 1 && ranges[ourIndex].empty() && behavior.unit == 'char' && !behavior.extend) {
            selection_updates.setSelection(doc, selection.normalizeSelection(cm, ranges.slice(0, ourIndex).concat(ranges.slice(ourIndex + 1)), 0), {
                scroll: false,
                origin: '*mouse'
            });
            startSel = doc.sel;
        } else {
            selection_updates.replaceOneSelection(doc, ourIndex, ourRange, o.sel_mouse);
        }
        let lastPos = start;
        function extendTo(pos) {
            if (line_pos.cmp(lastPos, pos) == 0)
                return;
            lastPos = pos;
            if (behavior.unit == 'rectangle') {
                let ranges = [], tabSize = cm.options.tabSize;
                let startCol = o.countColumn(utils_line.getLine(doc, start.line).text, start.ch, tabSize);
                let posCol = o.countColumn(utils_line.getLine(doc, pos.line).text, pos.ch, tabSize);
                let left = Math.min(startCol, posCol), right = Math.max(startCol, posCol);
                for (let line = Math.min(start.line, pos.line), end = Math.min(cm.lastLine(), Math.max(start.line, pos.line)); line <= end; line++) {
                    let text = utils_line.getLine(doc, line).text, leftPos = o.findColumn(text, left, tabSize);
                    if (left == right)
                        ranges.push(new selection.Range(line_pos.Pos(line, leftPos), line_pos.Pos(line, leftPos)));
                    else if (text.length > leftPos)
                        ranges.push(new selection.Range(line_pos.Pos(line, leftPos), line_pos.Pos(line, o.findColumn(text, right, tabSize))));
                }
                if (!ranges.length)
                    ranges.push(new selection.Range(start, start));
                selection_updates.setSelection(doc, selection.normalizeSelection(cm, startSel.ranges.slice(0, ourIndex).concat(ranges), ourIndex), {
                    origin: '*mouse',
                    scroll: false
                });
                cm.scrollIntoView(pos);
            } else {
                let oldRange = ourRange;
                let range = rangeForUnit(cm, pos, behavior.unit);
                let anchor = oldRange.anchor, head;
                if (line_pos.cmp(range.anchor, anchor) > 0) {
                    head = range.head;
                    anchor = line_pos.minPos(oldRange.from(), range.anchor);
                } else {
                    head = range.anchor;
                    anchor = line_pos.maxPos(oldRange.to(), range.head);
                }
                let ranges = startSel.ranges.slice(0);
                ranges[ourIndex] = bidiSimplify(cm, new selection.Range(line_pos.clipPos(doc, anchor), head));
                selection_updates.setSelection(doc, selection.normalizeSelection(cm, ranges, ourIndex), o.sel_mouse);
            }
        }
        let editorSize = display.wrapper.getBoundingClientRect();
        let counter = 0;
        function extend(e) {
            let curCount = ++counter;
            let cur = position_measurement.posFromMouse(cm, e, true, behavior.unit == 'rectangle');
            if (!cur)
                return;
            if (line_pos.cmp(cur, lastPos) != 0) {
                cm.curOp.focus = dom.activeElt();
                extendTo(cur);
                let visible = update_lines.visibleLines(display, doc);
                if (cur.line >= visible.to || cur.line < visible.from)
                    setTimeout(operations.operation(cm, () => {
                        if (counter == curCount)
                            extend(e);
                    }), 150);
            } else {
                let outside = e.clientY < editorSize.top ? -20 : e.clientY > editorSize.bottom ? 20 : 0;
                if (outside)
                    setTimeout(operations.operation(cm, () => {
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
            events.e_preventDefault(e);
            display.input.focus();
            events.off(display.wrapper.ownerDocument, 'mousemove', move);
            events.off(display.wrapper.ownerDocument, 'mouseup', up);
            doc.history.lastSelOrigin = null;
        }
        let move = operations.operation(cm, e => {
            if (e.buttons === 0 || !events.e_button(e))
                done(e);
            else
                extend(e);
        });
        let up = operations.operation(cm, done);
        cm.state.selectingText = up;
        events.on(display.wrapper.ownerDocument, 'mousemove', move);
        events.on(display.wrapper.ownerDocument, 'mouseup', up);
    }
    function bidiSimplify(cm, range) {
        let {anchor, head} = range, anchorLine = utils_line.getLine(cm.doc, anchor.line);
        if (line_pos.cmp(anchor, head) == 0 && anchor.sticky == head.sticky)
            return range;
        let order = bidi.getOrder(anchorLine);
        if (!order)
            return range;
        let index = bidi.getBidiPartAt(order, anchor.ch, anchor.sticky), part = order[index];
        if (part.from != anchor.ch && part.to != anchor.ch)
            return range;
        let boundary = index + (part.from == anchor.ch == (part.level != 1) ? 0 : 1);
        if (boundary == 0 || boundary == order.length)
            return range;
        let leftSide;
        if (head.line != anchor.line) {
            leftSide = (head.line - anchor.line) * (cm.doc.direction == 'ltr' ? 1 : -1) > 0;
        } else {
            let headIndex = bidi.getBidiPartAt(order, head.ch, head.sticky);
            let dir = headIndex - index || (head.ch - anchor.ch) * (part.level == 1 ? -1 : 1);
            if (headIndex == boundary - 1 || headIndex == boundary)
                leftSide = dir < 0;
            else
                leftSide = dir > 0;
        }
        let usePart = order[boundary + (leftSide ? -1 : 0)];
        let from = leftSide == (usePart.level == 1);
        let ch = from ? usePart.from : usePart.to, sticky = from ? 'after' : 'before';
        return anchor.ch == ch && anchor.sticky == sticky ? range : new selection.Range(new line_pos.Pos(anchor.line, ch, sticky), head);
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
            events.e_preventDefault(e);
        let display = cm.display;
        let lineBox = display.lineDiv.getBoundingClientRect();
        if (mY > lineBox.bottom || !events.hasHandler(cm, type))
            return events.e_defaultPrevented(e);
        mY -= lineBox.top - display.viewOffset;
        for (let i = 0; i < cm.options.gutters.length; ++i) {
            let g = display.gutters.childNodes[i];
            if (g && g.getBoundingClientRect().right >= mX) {
                let line = utils_line.lineAtHeight(cm.doc, mY);
                let gutter = cm.options.gutters[i];
                events.signal(cm, type, cm, line, gutter, e);
                return events.e_defaultPrevented(e);
            }
        }
    }
    function clickInGutter(cm, e) {
        return gutterEvent(cm, e, 'gutterClick', true);
    }
    function onContextMenu(cm, e) {
        if (widgets.eventInWidget(cm.display, e) || contextMenuInGutter(cm, e))
            return;
        if (events.signalDOMEvent(cm, e, 'contextmenu'))
            return;
        if (!browser.captureRightClick)
            cm.display.input.onContextMenu(e);
    }
    function contextMenuInGutter(cm, e) {
        if (!events.hasHandler(cm, 'gutterContextMenu'))
            return false;
        return gutterEvent(cm, e, 'gutterContextMenu', false);
    }
    return {
        onMouseDown: onMouseDown,
        clickInGutter: clickInGutter,
        onContextMenu: onContextMenu
    };
});