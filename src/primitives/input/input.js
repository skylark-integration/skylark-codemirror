define([
    '../display/operations',
    '../display/scrolling',
    '../line/pos',
    '../line/utils_line',
    '../model/changes',
    '../util/browser',
    '../util/dom',
    '../util/misc',
    '../util/operation_group',
    '../util/feature_detection',
    './indent'
], function (operations, scrolling, line_pos, utils_line, changes, browser, dom, misc, operation_group, feature_detection, indent) {
    'use strict';
    let lastCopied = null;
    function setLastCopied(newLastCopied) {
        lastCopied = newLastCopied;
    }
    function applyTextInput(cm, inserted, deleted, sel, origin) {
        let doc = cm.doc;
        cm.display.shift = false;
        if (!sel)
            sel = doc.sel;
        let recent = +new Date() - 200;
        let paste = origin == 'paste' || cm.state.pasteIncoming > recent;
        let textLines = feature_detection.splitLinesAuto(inserted), multiPaste = null;
        if (paste && sel.ranges.length > 1) {
            if (lastCopied && lastCopied.text.join('\n') == inserted) {
                if (sel.ranges.length % lastCopied.text.length == 0) {
                    multiPaste = [];
                    for (let i = 0; i < lastCopied.text.length; i++)
                        multiPaste.push(doc.splitLines(lastCopied.text[i]));
                }
            } else if (textLines.length == sel.ranges.length && cm.options.pasteLinesPerSelection) {
                multiPaste = misc.map(textLines, l => [l]);
            }
        }
        let updateInput = cm.curOp.updateInput;
        for (let i = sel.ranges.length - 1; i >= 0; i--) {
            let range = sel.ranges[i];
            let from = range.from(), to = range.to();
            if (range.empty()) {
                if (deleted && deleted > 0)
                    from = line_pos.Pos(from.line, from.ch - deleted);
                else if (cm.state.overwrite && !paste)
                    to = line_pos.Pos(to.line, Math.min(utils_line.getLine(doc, to.line).text.length, to.ch + misc.lst(textLines).length));
                else if (paste && lastCopied && lastCopied.lineWise && lastCopied.text.join('\n') == inserted)
                    from = to = line_pos.Pos(from.line, 0);
            }
            let changeEvent = {
                from: from,
                to: to,
                text: multiPaste ? multiPaste[i % multiPaste.length] : textLines,
                origin: origin || (paste ? 'paste' : cm.state.cutIncoming > recent ? 'cut' : '+input')
            };
            changes.makeChange(cm.doc, changeEvent);
            operation_group.signalLater(cm, 'inputRead', cm, changeEvent);
        }
        if (inserted && !paste)
            triggerElectric(cm, inserted);
        scrolling.ensureCursorVisible(cm);
        if (cm.curOp.updateInput < 2)
            cm.curOp.updateInput = updateInput;
        cm.curOp.typing = true;
        cm.state.pasteIncoming = cm.state.cutIncoming = -1;
    }
    function handlePaste(e, cm) {
        let pasted = e.clipboardData && e.clipboardData.getData('Text');
        if (pasted) {
            e.preventDefault();
            if (!cm.isReadOnly() && !cm.options.disableInput)
                operations.runInOp(cm, () => applyTextInput(cm, pasted, 0, null, 'paste'));
            return true;
        }
    }
    function triggerElectric(cm, inserted) {
        if (!cm.options.electricChars || !cm.options.smartIndent)
            return;
        let sel = cm.doc.sel;
        for (let i = sel.ranges.length - 1; i >= 0; i--) {
            let range = sel.ranges[i];
            if (range.head.ch > 100 || i && sel.ranges[i - 1].head.line == range.head.line)
                continue;
            let mode = cm.getModeAt(range.head);
            let indented = false;
            if (mode.electricChars) {
                for (let j = 0; j < mode.electricChars.length; j++)
                    if (inserted.indexOf(mode.electricChars.charAt(j)) > -1) {
                        indented = indent.indentLine(cm, range.head.line, 'smart');
                        break;
                    }
            } else if (mode.electricInput) {
                if (mode.electricInput.test(utils_line.getLine(cm.doc, range.head.line).text.slice(0, range.head.ch)))
                    indented = indent.indentLine(cm, range.head.line, 'smart');
            }
            if (indented)
                operation_group.signalLater(cm, 'electricInput', cm, range.head.line);
        }
    }
    function copyableRanges(cm) {
        let text = [], ranges = [];
        for (let i = 0; i < cm.doc.sel.ranges.length; i++) {
            let line = cm.doc.sel.ranges[i].head.line;
            let lineRange = {
                anchor: line_pos.Pos(line, 0),
                head: line_pos.Pos(line + 1, 0)
            };
            ranges.push(lineRange);
            text.push(cm.getRange(lineRange.anchor, lineRange.head));
        }
        return {
            text: text,
            ranges: ranges
        };
    }
    function disableBrowserMagic(field, spellcheck, autocorrect, autocapitalize) {
        field.setAttribute('autocorrect', !!autocorrect);
        field.setAttribute('autocapitalize', !!autocapitalize);
        field.setAttribute('spellcheck', !!spellcheck);
    }
    function hiddenTextarea() {
        let te = dom.elt('textarea', null, null, 'position: absolute; bottom: -1em; padding: 0; width: 1px; height: 1em; outline: none');
        let div = dom.elt('div', [te], null, 'overflow: hidden; position: relative; width: 3px; height: 0px;');
        if (browser.webkit)
            te.style.width = '1000px';
        else
            te.setAttribute('wrap', 'off');
        if (browser.ios)
            te.style.border = '1px solid black';
        disableBrowserMagic(te);
        return div;
    }
    return {
        lastCopied: lastCopied,
        setLastCopied: setLastCopied,
        applyTextInput: applyTextInput,
        handlePaste: handlePaste,
        triggerElectric: triggerElectric,
        copyableRanges: copyableRanges,
        disableBrowserMagic: disableBrowserMagic,
        hiddenTextarea: hiddenTextarea
    };
});