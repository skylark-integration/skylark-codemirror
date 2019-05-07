define([
    '../display/operations',
    '../display/selection',
    './input',
    '../measurement/position_measurement',
    '../measurement/widgets',
    '../model/selection',
    '../model/selection_updates',
    '../util/browser',
    '../util/dom',
    '../util/event',
    '../util/feature_detection',
    '../util/misc'
], function (a, b, c, d, e, f, g, h, i, j, k, l) {
    'use strict';
    class TextareaInput {
        constructor(cm) {
            this.cm = cm;
            this.prevInput = '';
            this.pollingFast = false;
            this.polling = new l.Delayed();
            this.hasSelection = false;
            this.composing = null;
        }
        init(display) {
            let input = this, cm = this.cm;
            this.createField(display);
            const te = this.textarea;
            display.wrapper.insertBefore(this.wrapper, display.wrapper.firstChild);
            if (h.ios)
                te.style.width = '0px';
            j.on(te, 'input', () => {
                if (h.ie && h.ie_version >= 9 && this.hasSelection)
                    this.hasSelection = null;
                input.poll();
            });
            j.on(te, 'paste', e => {
                if (j.signalDOMEvent(cm, e) || c.handlePaste(e, cm))
                    return;
                cm.state.pasteIncoming = +new Date();
                input.fastPoll();
            });
            function prepareCopyCut(e) {
                if (j.signalDOMEvent(cm, e))
                    return;
                if (cm.somethingSelected()) {
                    c.setLastCopied({
                        lineWise: false,
                        text: cm.getSelections()
                    });
                } else if (!cm.options.lineWiseCopyCut) {
                    return;
                } else {
                    let ranges = c.copyableRanges(cm);
                    c.setLastCopied({
                        lineWise: true,
                        text: ranges.text
                    });
                    if (e.type == 'cut') {
                        cm.setSelections(ranges.ranges, null, l.sel_dontScroll);
                    } else {
                        input.prevInput = '';
                        te.value = ranges.text.join('\n');
                        i.selectInput(te);
                    }
                }
                if (e.type == 'cut')
                    cm.state.cutIncoming = +new Date();
            }
            j.on(te, 'cut', prepareCopyCut);
            j.on(te, 'copy', prepareCopyCut);
            j.on(display.scroller, 'paste', e => {
                if (e.eventInWidget(display, e) || j.signalDOMEvent(cm, e))
                    return;
                if (!te.dispatchEvent) {
                    cm.state.pasteIncoming = +new Date();
                    input.focus();
                    return;
                }
                const event = new Event('paste');
                event.clipboardData = e.clipboardData;
                te.dispatchEvent(event);
            });
            j.on(display.lineSpace, 'selectstart', e => {
                if (!e.eventInWidget(display, e))
                    j.e_preventDefault(e);
            });
            j.on(te, 'compositionstart', () => {
                let start = cm.getCursor('from');
                if (input.composing)
                    input.composing.range.clear();
                input.composing = {
                    start: start,
                    range: cm.markText(start, cm.getCursor('to'), { className: 'CodeMirror-composing' })
                };
            });
            j.on(te, 'compositionend', () => {
                if (input.composing) {
                    input.poll();
                    input.composing.range.clear();
                    input.composing = null;
                }
            });
        }
        createField(_display) {
            this.wrapper = c.hiddenTextarea();
            this.textarea = this.wrapper.firstChild;
        }
        prepareSelection() {
            let cm = this.cm, display = cm.display, doc = cm.doc;
            let result = b.prepareSelection(cm);
            if (cm.options.moveInputWithCursor) {
                let headPos = d.cursorCoords(cm, doc.sel.primary().head, 'div');
                let wrapOff = display.wrapper.getBoundingClientRect(), lineOff = display.lineDiv.getBoundingClientRect();
                result.teTop = Math.max(0, Math.min(display.wrapper.clientHeight - 10, headPos.top + lineOff.top - wrapOff.top));
                result.teLeft = Math.max(0, Math.min(display.wrapper.clientWidth - 10, headPos.left + lineOff.left - wrapOff.left));
            }
            return result;
        }
        showSelection(drawn) {
            let cm = this.cm, display = cm.display;
            i.removeChildrenAndAdd(display.cursorDiv, drawn.cursors);
            i.removeChildrenAndAdd(display.selectionDiv, drawn.selection);
            if (drawn.teTop != null) {
                this.wrapper.style.top = drawn.teTop + 'px';
                this.wrapper.style.left = drawn.teLeft + 'px';
            }
        }
        reset(typing) {
            if (this.contextMenuPending || this.composing)
                return;
            let cm = this.cm;
            if (cm.somethingSelected()) {
                this.prevInput = '';
                let content = cm.getSelection();
                this.textarea.value = content;
                if (cm.state.focused)
                    i.selectInput(this.textarea);
                if (h.ie && h.ie_version >= 9)
                    this.hasSelection = content;
            } else if (!typing) {
                this.prevInput = this.textarea.value = '';
                if (h.ie && h.ie_version >= 9)
                    this.hasSelection = null;
            }
        }
        getField() {
            return this.textarea;
        }
        supportsTouch() {
            return false;
        }
        focus() {
            if (this.cm.options.readOnly != 'nocursor' && (!h.mobile || i.activeElt() != this.textarea)) {
                try {
                    this.textarea.focus();
                } catch (e) {
                }
            }
        }
        blur() {
            this.textarea.blur();
        }
        resetPosition() {
            this.wrapper.style.top = this.wrapper.style.left = 0;
        }
        receivedFocus() {
            this.slowPoll();
        }
        slowPoll() {
            if (this.pollingFast)
                return;
            this.polling.set(this.cm.options.pollInterval, () => {
                this.poll();
                if (this.cm.state.focused)
                    this.slowPoll();
            });
        }
        fastPoll() {
            let missed = false, input = this;
            input.pollingFast = true;
            function p() {
                let changed = input.poll();
                if (!changed && !missed) {
                    missed = true;
                    input.polling.set(60, p);
                } else {
                    input.pollingFast = false;
                    input.slowPoll();
                }
            }
            input.polling.set(20, p);
        }
        poll() {
            let cm = this.cm, input = this.textarea, prevInput = this.prevInput;
            if (this.contextMenuPending || !cm.state.focused || k.hasSelection(input) && !prevInput && !this.composing || cm.isReadOnly() || cm.options.disableInput || cm.state.keySeq)
                return false;
            let text = input.value;
            if (text == prevInput && !cm.somethingSelected())
                return false;
            if (h.ie && h.ie_version >= 9 && this.hasSelection === text || h.mac && /[\uf700-\uf7ff]/.test(text)) {
                cm.display.input.reset();
                return false;
            }
            if (cm.doc.sel == cm.display.selForContextMenu) {
                let first = text.charCodeAt(0);
                if (first == 8203 && !prevInput)
                    prevInput = '\u200B';
                if (first == 8666) {
                    this.reset();
                    return this.cm.execCommand('undo');
                }
            }
            let same = 0, l = Math.min(prevInput.length, text.length);
            while (same < l && prevInput.charCodeAt(same) == text.charCodeAt(same))
                ++same;
            a.runInOp(cm, () => {
                c.applyTextInput(cm, text.slice(same), prevInput.length - same, null, this.composing ? '*compose' : null);
                if (text.length > 1000 || text.indexOf('\n') > -1)
                    input.value = this.prevInput = '';
                else
                    this.prevInput = text;
                if (this.composing) {
                    this.composing.range.clear();
                    this.composing.range = cm.markText(this.composing.start, cm.getCursor('to'), { className: 'CodeMirror-composing' });
                }
            });
            return true;
        }
        ensurePolled() {
            if (this.pollingFast && this.poll())
                this.pollingFast = false;
        }
        onKeyPress() {
            if (h.ie && h.ie_version >= 9)
                this.hasSelection = null;
            this.fastPoll();
        }
        onContextMenu(e) {
            let input = this, cm = input.cm, display = cm.display, te = input.textarea;
            if (input.contextMenuPending)
                input.contextMenuPending();
            let pos = d.posFromMouse(cm, e), scrollPos = display.scroller.scrollTop;
            if (!pos || h.presto)
                return;
            let reset = cm.options.resetSelectionOnContextMenu;
            if (reset && cm.doc.sel.contains(pos) == -1)
                a.operation(cm, g.setSelection)(cm.doc, f.simpleSelection(pos), l.sel_dontScroll);
            let oldCSS = te.style.cssText, oldWrapperCSS = input.wrapper.style.cssText;
            let wrapperBox = input.wrapper.offsetParent.getBoundingClientRect();
            input.wrapper.style.cssText = 'position: static';
            te.style.cssText = `position: absolute; width: 30px; height: 30px;
      top: ${ e.clientY - wrapperBox.top - 5 }px; left: ${ e.clientX - wrapperBox.left - 5 }px;
      z-index: 1000; background: ${ h.ie ? 'rgba(255, 255, 255, .05)' : 'transparent' };
      outline: none; border-width: 0; outline: none; overflow: hidden; opacity: .05; filter: alpha(opacity=5);`;
            let oldScrollY;
            if (h.webkit)
                oldScrollY = window.scrollY;
            display.input.focus();
            if (h.webkit)
                window.scrollTo(null, oldScrollY);
            display.input.reset();
            if (!cm.somethingSelected())
                te.value = input.prevInput = ' ';
            input.contextMenuPending = rehide;
            display.selForContextMenu = cm.doc.sel;
            clearTimeout(display.detectingSelectAll);
            function prepareSelectAllHack() {
                if (te.selectionStart != null) {
                    let selected = cm.somethingSelected();
                    let extval = '\u200B' + (selected ? te.value : '');
                    te.value = '\u21DA';
                    te.value = extval;
                    input.prevInput = selected ? '' : '\u200B';
                    te.selectionStart = 1;
                    te.selectionEnd = extval.length;
                    display.selForContextMenu = cm.doc.sel;
                }
            }
            function rehide() {
                if (input.contextMenuPending != rehide)
                    return;
                input.contextMenuPending = false;
                input.wrapper.style.cssText = oldWrapperCSS;
                te.style.cssText = oldCSS;
                if (h.ie && h.ie_version < 9)
                    display.scrollbars.setScrollTop(display.scroller.scrollTop = scrollPos);
                if (te.selectionStart != null) {
                    if (!h.ie || h.ie && h.ie_version < 9)
                        prepareSelectAllHack();
                    let i = 0, poll = () => {
                            if (display.selForContextMenu == cm.doc.sel && te.selectionStart == 0 && te.selectionEnd > 0 && input.prevInput == '\u200B') {
                                a.operation(cm, g.selectAll)(cm);
                            } else if (i++ < 10) {
                                display.detectingSelectAll = setTimeout(poll, 500);
                            } else {
                                display.selForContextMenu = null;
                                display.input.reset();
                            }
                        };
                    display.detectingSelectAll = setTimeout(poll, 200);
                }
            }
            if (h.ie && h.ie_version >= 9)
                prepareSelectAllHack();
            if (h.captureRightClick) {
                j.e_stop(e);
                let mouseup = () => {
                    j.off(window, 'mouseup', mouseup);
                    setTimeout(rehide, 20);
                };
                j.on(window, 'mouseup', mouseup);
            } else {
                setTimeout(rehide, 50);
            }
        }
        readOnlyChanged(val) {
            if (!val)
                this.reset();
            this.textarea.disabled = val == 'nocursor';
        }
        setUneditable() {
        }
    };
    TextareaInput.prototype.needsContentAttribute = false;

    return TextareaInput;

});