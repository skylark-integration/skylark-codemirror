define([
    '../line/highlight',
    '../line/pos',
    '../line/utils_line',
    '../model/changes',
    '../model/selection',
    '../model/selection_updates',
    '../util/misc'
], function (a, b, c, d, e, f, g) {
    'use strict';
    function indentLine(cm, n, how, aggressive) {
        let doc = cm.doc, state;
        if (how == null)
            how = 'add';
        if (how == 'smart') {
            if (!doc.mode.indent)
                how = 'prev';
            else
                state = a.getContextBefore(cm, n).state;
        }
        let tabSize = cm.options.tabSize;
        let line = c.getLine(doc, n), curSpace = g.countColumn(line.text, null, tabSize);
        if (line.stateAfter)
            line.stateAfter = null;
        let curSpaceString = line.text.match(/^\s*/)[0], indentation;
        if (!aggressive && !/\S/.test(line.text)) {
            indentation = 0;
            how = 'not';
        } else if (how == 'smart') {
            indentation = doc.mode.indent(state, line.text.slice(curSpaceString.length), line.text);
            if (indentation == g.Pass || indentation > 150) {
                if (!aggressive)
                    return;
                how = 'prev';
            }
        }
        if (how == 'prev') {
            if (n > doc.first)
                indentation = g.countColumn(c.getLine(doc, n - 1).text, null, tabSize);
            else
                indentation = 0;
        } else if (how == 'add') {
            indentation = curSpace + cm.options.indentUnit;
        } else if (how == 'subtract') {
            indentation = curSpace - cm.options.indentUnit;
        } else if (typeof how == 'number') {
            indentation = curSpace + how;
        }
        indentation = Math.max(0, indentation);
        let indentString = '', pos = 0;
        if (cm.options.indentWithTabs)
            for (let i = Math.floor(indentation / tabSize); i; --i) {
                pos += tabSize;
                indentString += '\t';
            }
        if (pos < indentation)
            indentString += g.spaceStr(indentation - pos);
        if (indentString != curSpaceString) {
            d.replaceRange(doc, indentString, b.Pos(n, 0), b.Pos(n, curSpaceString.length), '+input');
            line.stateAfter = null;
            return true;
        } else {
            for (let i = 0; i < doc.sel.ranges.length; i++) {
                let range = doc.sel.ranges[i];
                if (range.head.line == n && range.head.ch < curSpaceString.length) {
                    let pos = b.Pos(n, curSpaceString.length);
                    f.replaceOneSelection(doc, i, new e.Range(pos, pos));
                    break;
                }
            }
        }
    }
    return { indentLine: indentLine };
});