define([
    '../line/pos',
    '../measurement/position_measurement',
    '../util/bidi',
    '../util/misc'
], function (line_pos, position_measurement, bidi, misc) {
    'use strict';
    function moveCharLogically(line, ch, dir) {
        let target = misc.skipExtendingChars(line.text, ch + dir, dir);
        return target < 0 || target > line.text.length ? null : target;
    }
    function moveLogically(line, start, dir) {
        let ch = moveCharLogically(line, start.ch, dir);
        return ch == null ? null : new line_pos.Pos(start.line, ch, dir < 0 ? 'after' : 'before');
    }
    function endOfLine(visually, cm, lineObj, lineNo, dir) {
        if (visually) {
            let order = bidi.getOrder(lineObj, cm.doc.direction);
            if (order) {
                let part = dir < 0 ? misc.lst(order) : order[0];
                let moveInStorageOrder = dir < 0 == (part.level == 1);
                let sticky = moveInStorageOrder ? 'after' : 'before';
                let ch;
                if (part.level > 0 || cm.doc.direction == 'rtl') {
                    let prep = position_measurement.prepareMeasureForLine(cm, lineObj);
                    ch = dir < 0 ? lineObj.text.length - 1 : 0;
                    let targetTop = position_measurement.measureCharPrepared(cm, prep, ch).top;
                    ch = misc.findFirst(ch => position_measurement.measureCharPrepared(cm, prep, ch).top == targetTop, dir < 0 == (part.level == 1) ? part.from : part.to - 1, ch);
                    if (sticky == 'before')
                        ch = moveCharLogically(lineObj, ch, 1);
                } else
                    ch = dir < 0 ? part.to : part.from;
                return new line_pos.Pos(lineNo, ch, sticky);
            }
        }
        return new line_pos.Pos(lineNo, dir < 0 ? lineObj.text.length : 0, dir < 0 ? 'before' : 'after');
    }
    function moveVisually(cm, line, start, dir) {
        let bidi = bidi.getOrder(line, cm.doc.direction);
        if (!bidi)
            return moveLogically(line, start, dir);
        if (start.ch >= line.text.length) {
            start.ch = line.text.length;
            start.sticky = 'before';
        } else if (start.ch <= 0) {
            start.ch = 0;
            start.sticky = 'after';
        }
        let partPos = bidi.getBidiPartAt(bidi, start.ch, start.sticky), part = bidi[partPos];
        if (cm.doc.direction == 'ltr' && part.level % 2 == 0 && (dir > 0 ? part.to > start.ch : part.from < start.ch)) {
            return moveLogically(line, start, dir);
        }
        let mv = (pos, dir) => moveCharLogically(line, pos instanceof line_pos.Pos ? pos.ch : pos, dir);
        let prep;
        let getWrappedLineExtent = ch => {
            if (!cm.options.lineWrapping)
                return {
                    begin: 0,
                    end: line.text.length
                };
            prep = prep || position_measurement.prepareMeasureForLine(cm, line);
            return position_measurement.wrappedLineExtentChar(cm, line, prep, ch);
        };
        let wrappedLineExtent = getWrappedLineExtent(start.sticky == 'before' ? mv(start, -1) : start.ch);
        if (cm.doc.direction == 'rtl' || part.level == 1) {
            let moveInStorageOrder = part.level == 1 == dir < 0;
            let ch = mv(start, moveInStorageOrder ? 1 : -1);
            if (ch != null && (!moveInStorageOrder ? ch >= part.from && ch >= wrappedLineExtent.begin : ch <= part.to && ch <= wrappedLineExtent.end)) {
                let sticky = moveInStorageOrder ? 'before' : 'after';
                return new line_pos.Pos(start.line, ch, sticky);
            }
        }
        let searchInVisualLine = (partPos, dir, wrappedLineExtent) => {
            let getRes = (ch, moveInStorageOrder) => moveInStorageOrder ? new line_pos.Pos(start.line, mv(ch, 1), 'before') : new line_pos.Pos(start.line, ch, 'after');
            for (; partPos >= 0 && partPos < bidi.length; partPos += dir) {
                let part = bidi[partPos];
                let moveInStorageOrder = dir > 0 == (part.level != 1);
                let ch = moveInStorageOrder ? wrappedLineExtent.begin : mv(wrappedLineExtent.end, -1);
                if (part.from <= ch && ch < part.to)
                    return getRes(ch, moveInStorageOrder);
                ch = moveInStorageOrder ? part.from : mv(part.to, -1);
                if (wrappedLineExtent.begin <= ch && ch < wrappedLineExtent.end)
                    return getRes(ch, moveInStorageOrder);
            }
        };
        let res = searchInVisualLine(partPos + dir, dir, wrappedLineExtent);
        if (res)
            return res;
        let nextCh = dir > 0 ? wrappedLineExtent.end : mv(wrappedLineExtent.begin, -1);
        if (nextCh != null && !(dir > 0 && nextCh == line.text.length)) {
            res = searchInVisualLine(dir > 0 ? 0 : bidi.length - 1, dir, getWrappedLineExtent(nextCh));
            if (res)
                return res;
        }
        return null;
    }
    return {
        moveLogically: moveLogically,
        endOfLine: endOfLine,
        moveVisually: moveVisually
    };
});