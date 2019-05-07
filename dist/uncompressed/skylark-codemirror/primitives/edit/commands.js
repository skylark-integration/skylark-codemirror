define([
    './deleteNearSelection',
    '../display/operations',
    '../display/scrolling',
    '../input/movement',
    '../line/pos',
    '../line/spans',
    '../line/utils_line',
    '../model/selection',
    '../model/selection_updates',
    '../util/misc',
    '../util/bidi'
], function (a, b, c, d, e, f, g, h, i, j, k) {
    'use strict';
    let commands = {
        selectAll: i.selectAll,
        singleSelection: cm => cm.setSelection(cm.getCursor('anchor'), cm.getCursor('head'), j.sel_dontScroll),
        killLine: cm => a.deleteNearSelection(cm, range => {
            if (range.empty()) {
                let len = g.getLine(cm.doc, range.head.line).text.length;
                if (range.head.ch == len && range.head.line < cm.lastLine())
                    return {
                        from: range.head,
                        to: e.Pos(range.head.line + 1, 0)
                    };
                else
                    return {
                        from: range.head,
                        to: e.Pos(range.head.line, len)
                    };
            } else {
                return {
                    from: range.from(),
                    to: range.to()
                };
            }
        }),
        deleteLine: cm => a.deleteNearSelection(cm, range => ({
            from: e.Pos(range.from().line, 0),
            to: e.clipPos(cm.doc, e.Pos(range.to().line + 1, 0))
        })),
        delLineLeft: cm => a.deleteNearSelection(cm, range => ({
            from: e.Pos(range.from().line, 0),
            to: range.from()
        })),
        delWrappedLineLeft: cm => a.deleteNearSelection(cm, range => {
            let top = cm.charCoords(range.head, 'div').top + 5;
            let leftPos = cm.coordsChar({
                left: 0,
                top: top
            }, 'div');
            return {
                from: leftPos,
                to: range.from()
            };
        }),
        delWrappedLineRight: cm => a.deleteNearSelection(cm, range => {
            let top = cm.charCoords(range.head, 'div').top + 5;
            let rightPos = cm.coordsChar({
                left: cm.display.lineDiv.offsetWidth + 100,
                top: top
            }, 'div');
            return {
                from: range.from(),
                to: rightPos
            };
        }),
        undo: cm => cm.undo(),
        redo: cm => cm.redo(),
        undoSelection: cm => cm.undoSelection(),
        redoSelection: cm => cm.redoSelection(),
        goDocStart: cm => cm.extendSelection(e.Pos(cm.firstLine(), 0)),
        goDocEnd: cm => cm.extendSelection(e.Pos(cm.lastLine())),
        goLineStart: cm => cm.extendSelectionsBy(range => lineStart(cm, range.head.line), {
            origin: '+move',
            bias: 1
        }),
        goLineStartSmart: cm => cm.extendSelectionsBy(range => lineStartSmart(cm, range.head), {
            origin: '+move',
            bias: 1
        }),
        goLineEnd: cm => cm.extendSelectionsBy(range => lineEnd(cm, range.head.line), {
            origin: '+move',
            bias: -1
        }),
        goLineRight: cm => cm.extendSelectionsBy(range => {
            let top = cm.cursorCoords(range.head, 'div').top + 5;
            return cm.coordsChar({
                left: cm.display.lineDiv.offsetWidth + 100,
                top: top
            }, 'div');
        }, j.sel_move),
        goLineLeft: cm => cm.extendSelectionsBy(range => {
            let top = cm.cursorCoords(range.head, 'div').top + 5;
            return cm.coordsChar({
                left: 0,
                top: top
            }, 'div');
        }, j.sel_move),
        goLineLeftSmart: cm => cm.extendSelectionsBy(range => {
            let top = cm.cursorCoords(range.head, 'div').top + 5;
            let pos = cm.coordsChar({
                left: 0,
                top: top
            }, 'div');
            if (pos.ch < cm.getLine(pos.line).search(/\S/))
                return lineStartSmart(cm, range.head);
            return pos;
        }, j.sel_move),
        goLineUp: cm => cm.moveV(-1, 'line'),
        goLineDown: cm => cm.moveV(1, 'line'),
        goPageUp: cm => cm.moveV(-1, 'page'),
        goPageDown: cm => cm.moveV(1, 'page'),
        goCharLeft: cm => cm.moveH(-1, 'char'),
        goCharRight: cm => cm.moveH(1, 'char'),
        goColumnLeft: cm => cm.moveH(-1, 'column'),
        goColumnRight: cm => cm.moveH(1, 'column'),
        goWordLeft: cm => cm.moveH(-1, 'word'),
        goGroupRight: cm => cm.moveH(1, 'group'),
        goGroupLeft: cm => cm.moveH(-1, 'group'),
        goWordRight: cm => cm.moveH(1, 'word'),
        delCharBefore: cm => cm.deleteH(-1, 'char'),
        delCharAfter: cm => cm.deleteH(1, 'char'),
        delWordBefore: cm => cm.deleteH(-1, 'word'),
        delWordAfter: cm => cm.deleteH(1, 'word'),
        delGroupBefore: cm => cm.deleteH(-1, 'group'),
        delGroupAfter: cm => cm.deleteH(1, 'group'),
        indentAuto: cm => cm.indentSelection('smart'),
        indentMore: cm => cm.indentSelection('add'),
        indentLess: cm => cm.indentSelection('subtract'),
        insertTab: cm => cm.replaceSelection('\t'),
        insertSoftTab: cm => {
            let spaces = [], ranges = cm.listSelections(), tabSize = cm.options.tabSize;
            for (let i = 0; i < ranges.length; i++) {
                let pos = ranges[i].from();
                let col = j.countColumn(cm.getLine(pos.line), pos.ch, tabSize);
                spaces.push(j.spaceStr(tabSize - col % tabSize));
            }
            cm.replaceSelections(spaces);
        },
        defaultTab: cm => {
            if (cm.somethingSelected())
                cm.indentSelection('add');
            else
                cm.execCommand('insertTab');
        },
        transposeChars: cm => b.runInOp(cm, () => {
            let ranges = cm.listSelections(), newSel = [];
            for (let i = 0; i < ranges.length; i++) {
                if (!ranges[i].empty())
                    continue;
                let cur = ranges[i].head, line = g.getLine(cm.doc, cur.line).text;
                if (line) {
                    if (cur.ch == line.length)
                        cur = new e.Pos(cur.line, cur.ch - 1);
                    if (cur.ch > 0) {
                        cur = new e.Pos(cur.line, cur.ch + 1);
                        cm.replaceRange(line.charAt(cur.ch - 1) + line.charAt(cur.ch - 2), e.Pos(cur.line, cur.ch - 2), cur, '+transpose');
                    } else if (cur.line > cm.doc.first) {
                        let prev = g.getLine(cm.doc, cur.line - 1).text;
                        if (prev) {
                            cur = new e.Pos(cur.line, 1);
                            cm.replaceRange(line.charAt(0) + cm.doc.lineSeparator() + prev.charAt(prev.length - 1), e.Pos(cur.line - 1, prev.length - 1), cur, '+transpose');
                        }
                    }
                }
                newSel.push(new h.Range(cur, cur));
            }
            cm.setSelections(newSel);
        }),
        newlineAndIndent: cm => b.runInOp(cm, () => {
            let sels = cm.listSelections();
            for (let i = sels.length - 1; i >= 0; i--)
                cm.replaceRange(cm.doc.lineSeparator(), sels[i].anchor, sels[i].head, '+input');
            sels = cm.listSelections();
            for (let i = 0; i < sels.length; i++)
                cm.indentLine(sels[i].from().line, null, true);
            c.ensureCursorVisible(cm);
        }),
        openLine: cm => cm.replaceSelection('\n', 'start'),
        toggleOverwrite: cm => cm.toggleOverwrite()
    };
    function lineStart(cm, lineN) {
        let line = g.getLine(cm.doc, lineN);
        let visual = f.visualLine(line);
        if (visual != line)
            lineN = g.lineNo(visual);
        return d.endOfLine(true, cm, visual, lineN, 1);
    }
    function lineEnd(cm, lineN) {
        let line = g.getLine(cm.doc, lineN);
        let visual = f.visualLineEnd(line);
        if (visual != line)
            lineN = g.lineNo(visual);
        return d.endOfLine(true, cm, line, lineN, -1);
    }
    function lineStartSmart(cm, pos) {
        let start = lineStart(cm, pos.line);
        let line = g.getLine(cm.doc, start.line);
        let order = k.getOrder(line, cm.doc.direction);
        if (!order || order[0].level == 0) {
            let firstNonWS = Math.max(0, line.text.search(/\S/));
            let inWS = pos.line == start.line && pos.ch <= firstNonWS && pos.ch;
            return e.Pos(start.line, inWS ? 0 : firstNonWS, start.sticky);
        }
        return start;
    }
    return { commands: commands };
});