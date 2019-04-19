define([
    '../display/operations',
    '../display/selection',
    '../display/view_tracking',
    './input',
    '../line/pos',
    '../line/utils_line',
    '../measurement/position_measurement',
    '../model/changes',
    '../model/selection',
    '../model/selection_updates',
    '../util/bidi',
    '../util/browser',
    '../util/dom',
    '../util/event',
    '../util/misc'
], function (a, b, c, d, e, f, g, h, i, j, k, l, m, n, o) {
    'use strict';
    class ContentEditableInput {
        constructor(cm) {
            this.cm = cm;
            this.lastAnchorNode = this.lastAnchorOffset = this.lastFocusNode = this.lastFocusOffset = null;
            this.polling = new o.Delayed();
            this.composing = null;
            this.gracePeriod = false;
            this.readDOMTimeout = null;
        }
        init(display) {
            let input = this, cm = input.cm;
            let div = input.div = display.lineDiv;
            d.disableBrowserMagic(div, cm.options.spellcheck, cm.options.autocorrect, cm.options.autocapitalize);
            n.on(div, 'paste', e => {
                if (n.signalDOMEvent(cm, e) || d.handlePaste(e, cm))
                    return;
                if (l.ie_version <= 11)
                    setTimeout(a.operation(cm, () => this.updateFromDOM()), 20);
            });
            n.on(div, 'compositionstart', e => {
                this.composing = {
                    data: e.data,
                    done: false
                };
            });
            n.on(div, 'compositionupdate', e => {
                if (!this.composing)
                    this.composing = {
                        data: e.data,
                        done: false
                    };
            });
            n.on(div, 'compositionend', e => {
                if (this.composing) {
                    if (e.data != this.composing.data)
                        this.readFromDOMSoon();
                    this.composing.done = true;
                }
            });
            n.on(div, 'touchstart', () => input.forceCompositionEnd());
            n.on(div, 'input', () => {
                if (!this.composing)
                    this.readFromDOMSoon();
            });
            function onCopyCut(e) {
                if (n.signalDOMEvent(cm, e))
                    return;
                if (cm.somethingSelected()) {
                    d.setLastCopied({
                        lineWise: false,
                        text: cm.getSelections()
                    });
                    if (e.type == 'cut')
                        cm.replaceSelection('', null, 'cut');
                } else if (!cm.options.lineWiseCopyCut) {
                    return;
                } else {
                    let ranges = d.copyableRanges(cm);
                    d.setLastCopied({
                        lineWise: true,
                        text: ranges.text
                    });
                    if (e.type == 'cut') {
                        cm.undefined(() => {
                            cm.setSelections(ranges.ranges, 0, o.sel_dontScroll);
                            cm.replaceSelection('', null, 'cut');
                        });
                    }
                }
                if (e.clipboardData) {
                    e.clipboardData.clearData();
                    let content = d.lastCopied.text.join('\n');
                    e.clipboardData.setData('Text', content);
                    if (e.clipboardData.getData('Text') == content) {
                        e.preventDefault();
                        return;
                    }
                }
                let kludge = d.hiddenTextarea(), te = kludge.firstChild;
                cm.display.lineSpace.insertBefore(kludge, cm.display.lineSpace.firstChild);
                te.value = d.lastCopied.text.join('\n');
                let hadFocus = document.activeElement;
                m.selectInput(te);
                setTimeout(() => {
                    cm.display.lineSpace.removeChild(kludge);
                    hadFocus.focus();
                    if (hadFocus == div)
                        input.showPrimarySelection();
                }, 50);
            }
            n.on(div, 'copy', onCopyCut);
            n.on(div, 'cut', onCopyCut);
        }
        prepareSelection() {
            let result = b.prepareSelection(this.cm, false);
            result.focus = this.cm.state.focused;
            return result;
        }
        showSelection(info, takeFocus) {
            if (!info || !this.cm.display.view.length)
                return;
            if (info.focus || takeFocus)
                this.showPrimarySelection();
            this.showMultipleSelections(info);
        }
        getSelection() {
            return this.cm.display.wrapper.ownerDocument.getSelection();
        }
        showPrimarySelection() {
            let sel = this.getSelection(), cm = this.cm, prim = cm.doc.sel.primary();
            let from = prim.from(), to = prim.to();
            if (cm.display.viewTo == cm.display.viewFrom || from.line >= cm.display.viewTo || to.line < cm.display.viewFrom) {
                sel.removeAllRanges();
                return;
            }
            let curAnchor = domToPos(cm, sel.anchorNode, sel.anchorOffset);
            let curFocus = domToPos(cm, sel.focusNode, sel.focusOffset);
            if (curAnchor && !curAnchor.bad && curFocus && !curFocus.bad && e.cmp(e.minPos(curAnchor, curFocus), from) == 0 && e.cmp(e.maxPos(curAnchor, curFocus), to) == 0)
                return;
            let view = cm.display.view;
            let start = from.line >= cm.display.viewFrom && posToDOM(cm, from) || {
                node: view[0].measure.map[2],
                offset: 0
            };
            let end = to.line < cm.display.viewTo && posToDOM(cm, to);
            if (!end) {
                let measure = view[view.length - 1].measure;
                let map = measure.maps ? measure.maps[measure.maps.length - 1] : measure.map;
                end = {
                    node: map[map.length - 1],
                    offset: map[map.length - 2] - map[map.length - 3]
                };
            }
            if (!start || !end) {
                sel.removeAllRanges();
                return;
            }
            let old = sel.rangeCount && sel.getRangeAt(0), rng;
            try {
                rng = m.range(start.node, start.offset, end.offset, end.node);
            } catch (e) {
            }
            if (rng) {
                if (!l.gecko && cm.state.focused) {
                    sel.collapse(start.node, start.offset);
                    if (!rng.collapsed) {
                        sel.removeAllRanges();
                        sel.addRange(rng);
                    }
                } else {
                    sel.removeAllRanges();
                    sel.addRange(rng);
                }
                if (old && sel.anchorNode == null)
                    sel.addRange(old);
                else if (l.gecko)
                    this.startGracePeriod();
            }
            this.rememberSelection();
        }
        startGracePeriod() {
            clearTimeout(this.gracePeriod);
            this.gracePeriod = setTimeout(() => {
                this.gracePeriod = false;
                if (this.selectionChanged())
                    this.cm.undefined(() => this.cm.curOp.selectionChanged = true);
            }, 20);
        }
        showMultipleSelections(info) {
            m.removeChildrenAndAdd(this.cm.display.cursorDiv, info.cursors);
            m.removeChildrenAndAdd(this.cm.display.selectionDiv, info.selection);
        }
        rememberSelection() {
            let sel = this.getSelection();
            this.lastAnchorNode = sel.anchorNode;
            this.lastAnchorOffset = sel.anchorOffset;
            this.lastFocusNode = sel.focusNode;
            this.lastFocusOffset = sel.focusOffset;
        }
        selectionInEditor() {
            let sel = this.getSelection();
            if (!sel.rangeCount)
                return false;
            let node = sel.getRangeAt(0).commonAncestorContainer;
            return m.contains(this.div, node);
        }
        focus() {
            if (this.cm.options.readOnly != 'nocursor') {
                if (!this.selectionInEditor())
                    this.showSelection(this.undefined(), true);
                this.div.focus();
            }
        }
        blur() {
            this.div.blur();
        }
        getField() {
            return this.div;
        }
        supportsTouch() {
            return true;
        }
        receivedFocus() {
            let input = this;
            if (this.selectionInEditor())
                this.pollSelection();
            else
                a.runInOp(this.cm, () => input.cm.curOp.selectionChanged = true);
            function poll() {
                if (input.cm.state.focused) {
                    input.pollSelection();
                    input.polling.set(input.cm.options.pollInterval, poll);
                }
            }
            this.polling.set(this.cm.options.pollInterval, poll);
        }
        selectionChanged() {
            let sel = this.getSelection();
            return sel.anchorNode != this.lastAnchorNode || sel.anchorOffset != this.lastAnchorOffset || sel.focusNode != this.lastFocusNode || sel.focusOffset != this.lastFocusOffset;
        }
        pollSelection() {
            if (this.readDOMTimeout != null || this.gracePeriod || !this.selectionChanged())
                return;
            let sel = this.getSelection(), cm = this.cm;
            if (l.android && l.chrome && this.cm.options.gutters.length && isInGutter(sel.anchorNode)) {
                this.cm.triggerOnKeyDown({
                    type: 'keydown',
                    keyCode: 8,
                    preventDefault: Math.abs
                });
                this.blur();
                this.focus();
                return;
            }
            if (this.composing)
                return;
            this.rememberSelection();
            let anchor = domToPos(cm, sel.anchorNode, sel.anchorOffset);
            let head = domToPos(cm, sel.focusNode, sel.focusOffset);
            if (anchor && head)
                a.runInOp(cm, () => {
                    j.setSelection(cm.doc, i.simpleSelection(anchor, head), o.sel_dontScroll);
                    if (anchor.bad || head.bad)
                        cm.curOp.selectionChanged = true;
                });
        }
        pollContent() {
            if (this.readDOMTimeout != null) {
                clearTimeout(this.readDOMTimeout);
                this.readDOMTimeout = null;
            }
            let cm = this.cm, display = cm.display, sel = cm.doc.sel.primary();
            let from = sel.from(), to = sel.to();
            if (from.ch == 0 && from.line > cm.firstLine())
                from = e.Pos(from.line - 1, f.getLine(cm.doc, from.line - 1).length);
            if (to.ch == f.getLine(cm.doc, to.line).text.length && to.line < cm.lastLine())
                to = e.Pos(to.line + 1, 0);
            if (from.line < display.viewFrom || to.line > display.viewTo - 1)
                return false;
            let fromIndex, fromLine, fromNode;
            if (from.line == display.viewFrom || (fromIndex = g.findViewIndex(cm, from.line)) == 0) {
                fromLine = f.lineNo(display.view[0].line);
                fromNode = display.view[0].node;
            } else {
                fromLine = f.lineNo(display.view[fromIndex].line);
                fromNode = display.view[fromIndex - 1].node.nextSibling;
            }
            let toIndex = g.findViewIndex(cm, to.line);
            let toLine, toNode;
            if (toIndex == display.view.length - 1) {
                toLine = display.viewTo - 1;
                toNode = display.lineDiv.lastChild;
            } else {
                toLine = f.lineNo(display.view[toIndex + 1].line) - 1;
                toNode = display.view[toIndex + 1].node.previousSibling;
            }
            if (!fromNode)
                return false;
            let newText = cm.doc.splitLines(domTextBetween(cm, fromNode, toNode, fromLine, toLine));
            let oldText = f.getBetween(cm.doc, e.Pos(fromLine, 0), e.Pos(toLine, f.getLine(cm.doc, toLine).text.length));
            while (newText.length > 1 && oldText.length > 1) {
                if (o.lst(newText) == o.lst(oldText)) {
                    newText.pop();
                    oldText.pop();
                    toLine--;
                } else if (newText[0] == oldText[0]) {
                    newText.shift();
                    oldText.shift();
                    fromLine++;
                } else
                    break;
            }
            let cutFront = 0, cutEnd = 0;
            let newTop = newText[0], oldTop = oldText[0], maxCutFront = Math.min(newTop.length, oldTop.length);
            while (cutFront < maxCutFront && newTop.charCodeAt(cutFront) == oldTop.charCodeAt(cutFront))
                ++cutFront;
            let newBot = o.lst(newText), oldBot = o.lst(oldText);
            let maxCutEnd = Math.min(newBot.length - (newText.length == 1 ? cutFront : 0), oldBot.length - (oldText.length == 1 ? cutFront : 0));
            while (cutEnd < maxCutEnd && newBot.charCodeAt(newBot.length - cutEnd - 1) == oldBot.charCodeAt(oldBot.length - cutEnd - 1))
                ++cutEnd;
            if (newText.length == 1 && oldText.length == 1 && fromLine == from.line) {
                while (cutFront && cutFront > from.ch && newBot.charCodeAt(newBot.length - cutEnd - 1) == oldBot.charCodeAt(oldBot.length - cutEnd - 1)) {
                    cutFront--;
                    cutEnd++;
                }
            }
            newText[newText.length - 1] = newBot.slice(0, newBot.length - cutEnd).replace(/^\u200b+/, '');
            newText[0] = newText[0].slice(cutFront).replace(/\u200b+$/, '');
            let chFrom = e.Pos(fromLine, cutFront);
            let chTo = e.Pos(toLine, oldText.length ? o.lst(oldText).length - cutEnd : 0);
            if (newText.length > 1 || newText[0] || e.cmp(chFrom, chTo)) {
                h.replaceRange(cm.doc, newText, chFrom, chTo, '+input');
                return true;
            }
        }
        ensurePolled() {
            this.forceCompositionEnd();
        }
        reset() {
            this.forceCompositionEnd();
        }
        forceCompositionEnd() {
            if (!this.composing)
                return;
            clearTimeout(this.readDOMTimeout);
            this.composing = null;
            this.updateFromDOM();
            this.div.blur();
            this.div.focus();
        }
        readFromDOMSoon() {
            if (this.readDOMTimeout != null)
                return;
            this.readDOMTimeout = setTimeout(() => {
                this.readDOMTimeout = null;
                if (this.composing) {
                    if (this.composing.done)
                        this.composing = null;
                    else
                        return;
                }
                this.updateFromDOM();
            }, 80);
        }
        updateFromDOM() {
            if (this.cm.isReadOnly() || !this.pollContent())
                a.runInOp(this.cm, () => c.regChange(this.cm));
        }
        setUneditable(node) {
            node.contentEditable = 'false';
        }
        onKeyPress(e) {
            if (e.charCode == 0 || this.composing)
                return;
            e.preventDefault();
            if (!this.cm.isReadOnly())
                a.operation(this.cm, d.applyTextInput)(this.cm, String.fromCharCode(e.charCode == null ? e.keyCode : e.charCode), 0);
        }
        readOnlyChanged(val) {
            this.div.contentEditable = String(val != 'nocursor');
        }
        onContextMenu() {
        }
        resetPosition() {
        }
    };
    ContentEditableInput.prototype.needsContentAttribute = true;
    function posToDOM(cm, pos) {
        let view = g.findViewForLine(cm, pos.line);
        if (!view || view.hidden)
            return null;
        let line = f.getLine(cm.doc, pos.line);
        let info = g.mapFromLineView(view, line, pos.line);
        let order = k.getOrder(line, cm.doc.direction), side = 'left';
        if (order) {
            let partPos = k.getBidiPartAt(order, pos.ch);
            side = partPos % 2 ? 'right' : 'left';
        }
        let result = g.nodeAndOffsetInLineMap(info.map, pos.ch, side);
        result.offset = result.collapse == 'right' ? result.end : result.start;
        return result;
    }
    function isInGutter(node) {
        for (let scan = node; scan; scan = scan.parentNode)
            if (/CodeMirror-gutter-wrapper/.test(scan.className))
                return true;
        return false;
    }
    function badPos(pos, bad) {
        if (bad)
            pos.bad = true;
        return pos;
    }
    function domTextBetween(cm, from, to, fromLine, toLine) {
        let text = '', closing = false, lineSep = cm.doc.lineSeparator(), extraLinebreak = false;
        function recognizeMarker(id) {
            return marker => marker.id == id;
        }
        function close() {
            if (closing) {
                text += lineSep;
                if (extraLinebreak)
                    text += lineSep;
                closing = extraLinebreak = false;
            }
        }
        function addText(str) {
            if (str) {
                close();
                text += str;
            }
        }
        function walk(node) {
            if (node.nodeType == 1) {
                let cmText = node.getAttribute('cm-text');
                if (cmText) {
                    addText(cmText);
                    return;
                }
                let markerID = node.getAttribute('cm-marker'), range;
                if (markerID) {
                    let found = cm.findMarks(e.Pos(fromLine, 0), e.Pos(toLine + 1, 0), recognizeMarker(+markerID));
                    if (found.length && (range = found[0].find(0)))
                        addText(f.getBetween(cm.doc, range.from, range.to).join(lineSep));
                    return;
                }
                if (node.getAttribute('contenteditable') == 'false')
                    return;
                let isBlock = /^(pre|div|p|li|table|br)$/i.test(node.nodeName);
                if (!/^br$/i.test(node.nodeName) && node.textContent.length == 0)
                    return;
                if (isBlock)
                    close();
                for (let i = 0; i < node.childNodes.length; i++)
                    walk(node.childNodes[i]);
                if (/^(pre|p)$/i.test(node.nodeName))
                    extraLinebreak = true;
                if (isBlock)
                    closing = true;
            } else if (node.nodeType == 3) {
                addText(node.nodeValue.replace(/\u200b/g, '').replace(/\u00a0/g, ' '));
            }
        }
        for (;;) {
            walk(from);
            if (from == to)
                break;
            from = from.nextSibling;
            extraLinebreak = false;
        }
        return text;
    }
    function domToPos(cm, node, offset) {
        let lineNode;
        if (node == cm.display.lineDiv) {
            lineNode = cm.display.lineDiv.childNodes[offset];
            if (!lineNode)
                return badPos(cm.clipPos(e.Pos(cm.display.viewTo - 1)), true);
            node = null;
            offset = 0;
        } else {
            for (lineNode = node;; lineNode = lineNode.parentNode) {
                if (!lineNode || lineNode == cm.display.lineDiv)
                    return null;
                if (lineNode.parentNode && lineNode.parentNode == cm.display.lineDiv)
                    break;
            }
        }
        for (let i = 0; i < cm.display.view.length; i++) {
            let lineView = cm.display.view[i];
            if (lineView.node == lineNode)
                return locateNodeInLineView(lineView, node, offset);
        }
    }
    function locateNodeInLineView(lineView, node, offset) {
        let wrapper = lineView.text.firstChild, bad = false;
        if (!node || !m.contains(wrapper, node))
            return badPos(e.Pos(f.lineNo(lineView.line), 0), true);
        if (node == wrapper) {
            bad = true;
            node = wrapper.childNodes[offset];
            offset = 0;
            if (!node) {
                let line = lineView.rest ? o.lst(lineView.rest) : lineView.line;
                return badPos(e.Pos(f.lineNo(line), line.text.length), bad);
            }
        }
        let textNode = node.nodeType == 3 ? node : null, topNode = node;
        if (!textNode && node.childNodes.length == 1 && node.firstChild.nodeType == 3) {
            textNode = node.firstChild;
            if (offset)
                offset = textNode.nodeValue.length;
        }
        while (topNode.parentNode != wrapper)
            topNode = topNode.parentNode;
        let measure = lineView.measure, maps = measure.maps;
        function find(textNode, topNode, offset) {
            for (let i = -1; i < (maps ? maps.length : 0); i++) {
                let map = i < 0 ? measure.map : maps[i];
                for (let j = 0; j < map.length; j += 3) {
                    let curNode = map[j + 2];
                    if (curNode == textNode || curNode == topNode) {
                        let line = f.lineNo(i < 0 ? lineView.line : lineView.rest[i]);
                        let ch = map[j] + offset;
                        if (offset < 0 || curNode != textNode)
                            ch = map[j + (offset ? 1 : 0)];
                        return e.Pos(line, ch);
                    }
                }
            }
        }
        let found = find(textNode, topNode, offset);
        if (found)
            return badPos(found, bad);
        for (let after = topNode.nextSibling, dist = textNode ? textNode.nodeValue.length - offset : 0; after; after = after.nextSibling) {
            found = find(after, after.firstChild, 0);
            if (found)
                return badPos(e.Pos(found.line, found.ch - dist), bad);
            else
                dist += after.textContent.length;
        }
        for (let before = topNode.previousSibling, dist = offset; before; before = before.previousSibling) {
            found = find(before, before.firstChild, -1);
            if (found)
                return badPos(e.Pos(found.line, found.ch + dist), bad);
            else
                dist += before.textContent.length;
        }
    }

    return ContentEditableInput;
});