define([
    '../line/pos',
    '../line/spans',
    '../line/utils_line',
    '../measurement/position_measurement',
    '../util/bidi',
    '../util/dom'
], function (m_pos, spans, utils_line, position_measurement, bidi, dom) {
    'use strict';
    function updateSelection(cm) {
        cm.display.input.showSelection(cm.display.input.prepareSelection());
    }
    function prepareSelection(cm, primary = true) {
        let doc = cm.doc, result = {};
        let curFragment = result.cursors = document.createDocumentFragment();
        let selFragment = result.selection = document.createDocumentFragment();
        for (let i = 0; i < doc.sel.ranges.length; i++) {
            if (!primary && i == doc.sel.primIndex)
                continue;
            let range = doc.sel.ranges[i];
            if (range.from().line >= cm.display.viewTo || range.to().line < cm.display.viewFrom)
                continue;
            let collapsed = range.empty();
            if (collapsed || cm.options.showCursorWhenSelecting)
                drawSelectionCursor(cm, range.head, curFragment);
            if (!collapsed)
                drawSelectionRange(cm, range, selFragment);
        }
        return result;
    }
    function drawSelectionCursor(cm, head, output) {
        let pos = position_measurement.cursorCoords(cm, head, 'div', null, null, !cm.options.singleCursorHeightPerLine);
        let cursor = output.appendChild(dom.elt('div', '\xA0', 'CodeMirror-cursor'));
        cursor.style.left = pos.left + 'px';
        cursor.style.top = pos.top + 'px';
        cursor.style.height = Math.max(0, pos.bottom - pos.top) * cm.options.cursorHeight + 'px';
        if (pos.other) {
            let otherCursor = output.appendChild(dom.elt('div', '\xA0', 'CodeMirror-cursor CodeMirror-secondarycursor'));
            otherCursor.style.display = '';
            otherCursor.style.left = pos.other.left + 'px';
            otherCursor.style.top = pos.other.top + 'px';
            otherCursor.style.height = (pos.other.bottom - pos.other.top) * 0.85 + 'px';
        }
    }
    function cmpCoords(a, b) {
        return a.top - b.top || a.left - b.left;
    }
    function drawSelectionRange(cm, range, output) {
        let display = cm.display, doc = cm.doc;
        let fragment = document.createDocumentFragment();
        let padding = position_measurement.paddingH(cm.display), leftSide = padding.left;
        let rightSide = Math.max(display.sizerWidth, position_measurement.displayWidth(cm) - display.sizer.offsetLeft) - padding.right;
        let docLTR = doc.direction == 'ltr';
        function add(left, top, width, bottom) {
            if (top < 0)
                top = 0;
            top = Math.round(top);
            bottom = Math.round(bottom);
            fragment.appendChild(dom.elt('div', null, 'CodeMirror-selected', `position: absolute; left: ${ left }px;
                             top: ${ top }px; width: ${ width == null ? rightSide - left : width }px;
                             height: ${ bottom - top }px`));
        }
        function drawForLine(line, fromArg, toArg) {
            let lineObj = utils_line.getLine(doc, line);
            let lineLen = lineObj.text.length;
            let start, end;
            function coords(ch, bias) {
                return position_measurement.charCoords(cm, m_pos.Pos(line, ch), 'div', lineObj, bias);
            }
            function wrapX(pos, dir, side) {
                let extent = position_measurement.wrappedLineExtentChar(cm, lineObj, null, pos);
                let prop = dir == 'ltr' == (side == 'after') ? 'left' : 'right';
                let ch = side == 'after' ? extent.begin : extent.end - (/\s/.test(lineObj.text.charAt(extent.end - 1)) ? 2 : 1);
                return coords(ch, prop)[prop];
            }
            let order = bidi.getOrder(lineObj, doc.direction);
            bidi.iterateBidiSections(order, fromArg || 0, toArg == null ? lineLen : toArg, (from, to, dir, i) => {
                let ltr = dir == 'ltr';
                let fromPos = coords(from, ltr ? 'left' : 'right');
                let toPos = coords(to - 1, ltr ? 'right' : 'left');
                let openStart = fromArg == null && from == 0, openEnd = toArg == null && to == lineLen;
                let first = i == 0, last = !order || i == order.length - 1;
                if (toPos.top - fromPos.top <= 3) {
                    let openLeft = (docLTR ? openStart : openEnd) && first;
                    let openRight = (docLTR ? openEnd : openStart) && last;
                    let left = openLeft ? leftSide : (ltr ? fromPos : toPos).left;
                    let right = openRight ? rightSide : (ltr ? toPos : fromPos).right;
                    add(left, fromPos.top, right - left, fromPos.bottom);
                } else {
                    let topLeft, topRight, botLeft, botRight;
                    if (ltr) {
                        topLeft = docLTR && openStart && first ? leftSide : fromPos.left;
                        topRight = docLTR ? rightSide : wrapX(from, dir, 'before');
                        botLeft = docLTR ? leftSide : wrapX(to, dir, 'after');
                        botRight = docLTR && openEnd && last ? rightSide : toPos.right;
                    } else {
                        topLeft = !docLTR ? leftSide : wrapX(from, dir, 'before');
                        topRight = !docLTR && openStart && first ? rightSide : fromPos.right;
                        botLeft = !docLTR && openEnd && last ? leftSide : toPos.left;
                        botRight = !docLTR ? rightSide : wrapX(to, dir, 'after');
                    }
                    add(topLeft, fromPos.top, topRight - topLeft, fromPos.bottom);
                    if (fromPos.bottom < toPos.top)
                        add(leftSide, fromPos.bottom, null, toPos.top);
                    add(botLeft, toPos.top, botRight - botLeft, toPos.bottom);
                }
                if (!start || cmpCoords(fromPos, start) < 0)
                    start = fromPos;
                if (cmpCoords(toPos, start) < 0)
                    start = toPos;
                if (!end || cmpCoords(fromPos, end) < 0)
                    end = fromPos;
                if (cmpCoords(toPos, end) < 0)
                    end = toPos;
            });
            return {
                start: start,
                end: end
            };
        }
        let sFrom = range.from(), sTo = range.to();
        if (sFrom.line == sTo.line) {
            drawForLine(sFrom.line, sFrom.ch, sTo.ch);
        } else {
            let fromLine = utils_line.getLine(doc, sFrom.line), toLine = utils_line.getLine(doc, sTo.line);
            let singleVLine = spans.visualLine(fromLine) == spans.visualLine(toLine);
            let leftEnd = drawForLine(sFrom.line, sFrom.ch, singleVLine ? fromLine.text.length + 1 : null).end;
            let rightStart = drawForLine(sTo.line, singleVLine ? 0 : null, sTo.ch).start;
            if (singleVLine) {
                if (leftEnd.top < rightStart.top - 2) {
                    add(leftEnd.right, leftEnd.top, null, leftEnd.bottom);
                    add(leftSide, rightStart.top, rightStart.left, rightStart.bottom);
                } else {
                    add(leftEnd.right, leftEnd.top, rightStart.left - leftEnd.right, leftEnd.bottom);
                }
            }
            if (leftEnd.bottom < rightStart.top)
                add(leftSide, leftEnd.bottom, null, rightStart.top);
        }
        output.appendChild(fragment);
    }
    function restartBlink(cm) {
        if (!cm.state.focused)
            return;
        let display = cm.display;
        clearInterval(display.blinker);
        let on = true;
        display.cursorDiv.style.visibility = '';
        if (cm.options.cursorBlinkRate > 0)
            display.blinker = setInterval(() => display.cursorDiv.style.visibility = (on = !on) ? '' : 'hidden', cm.options.cursorBlinkRate);
        else if (cm.options.cursorBlinkRate < 0)
            display.cursorDiv.style.visibility = 'hidden';
    }
    return {
        updateSelection: updateSelection,
        prepareSelection: prepareSelection,
        drawSelectionCursor: drawSelectionCursor,
        restartBlink: restartBlink
    };
});