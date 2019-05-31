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
], function (
    operations, 
    display_selection, 
    inputs, 
    position_measurement, 
    widgets, 
    model_selection, 
    selection_updates, 
    browser, 
    dom, 
    event, 
    feature_detection, 
    misc
) {
    'use strict';
    class TextareaInput {
        constructor(cm) {
            this.cm = cm;
            this.prevInput = '';
            this.pollingFast = false;
            this.polling = new misc.Delayed();
            this.hasSelection = false;
            this.composing = null;
        }
        init(display) {
            let self = this, cm = this.cm;
            this.createField(display);
            const te = this.textarea;
            display.wrapper.insertBefore(this.wrapper, display.wrapper.firstChild);
            if (browser.ios)
                te.style.width = '0px';
            event.on(te, 'input', () => {
                if (browser.ie && browser.ie_version >= 9 && this.hasSelection)
                    this.hasSelection = null;
                self.poll();
            });
            event.on(te, 'paste', e => {
                if (event.signalDOMEvent(cm, e) || inputs.handlePaste(e, cm))
                    return;
                cm.state.pasteIncoming = +new Date();
                self.fastPoll();
            });
            function prepareCopyCut(e) {
                if (event.signalDOMEvent(cm, e))
                    return;
                if (cm.somethingSelected()) {
                    inputs.setLastCopied({
                        lineWise: false,
                        text: cm.getSelections()
                    });
                } else if (!cm.options.lineWiseCopyCut) {
                    return;
                } else {
                    let ranges = inputs.copyableRanges(cm);
                    inputs.setLastCopied({
                        lineWise: true,
                        text: ranges.text
                    });
                    if (e.type == 'cut') {
                        cm.setSelections(ranges.ranges, null, misc.sel_dontScroll);
                    } else {
                        self.prevInput = '';
                        te.value = ranges.text.join('\n');
                        dom.selectInput(te);
                    }
                }
                if (e.type == 'cut')
                    cm.state.cutIncoming = +new Date();
            }
            event.on(te, 'cut', prepareCopyCut);
            event.on(te, 'copy', prepareCopyCut);
            event.on(display.scroller, 'paste', e => {
                if (widgets.eventInWidget(display, e) || event.signalDOMEvent(cm, e))
                    return;
                if (!te.dispatchEvent) {
                    cm.state.pasteIncoming = +new Date();
                    self.focus();
                    return;
                }
                const event = new Event('paste');
                event.clipboardData = e.clipboardData;
                te.dispatchEvent(event);
            });
            event.on(display.lineSpace, 'selectstart', e => {
                if (!widgets.eventInWidget(display, e))
                    event.e_preventDefault(e);
            });
            event.on(te, 'compositionstart', () => {
                let start = cm.getCursor('from');
                if (self.composing)
                    self.composing.range.clear();
                self.composing = {
                    start: start,
                    range: cm.markText(start, cm.getCursor('to'), { className: 'CodeMirror-composing' })
                };
            });
            event.on(te, 'compositionend', () => {
                if (self.composing) {
                    self.poll();
                    self.composing.range.clear();
                    self.composing = null;
                }
            });
        }
        createField(_display) {
            this.wrapper = inputs.hiddenTextarea();
            this.textarea = this.wrapper.firstChild;
        }
        prepareSelection() {
            let cm = this.cm, display = cm.display, doc = cm.doc;
            let result = display_selection.prepareSelection(cm);
            if (cm.options.moveInputWithCursor) {
                let headPos = position_measurement.cursorCoords(cm, doc.sel.primary().head, 'div');
                let wrapOff = display.wrapper.getBoundingClientRect(), lineOff = display.lineDiv.getBoundingClientRect();
                result.teTop = Math.max(0, Math.min(display.wrapper.clientHeight - 10, headPos.top + lineOff.top - wrapOff.top));
                result.teLeft = Math.max(0, Math.min(display.wrapper.clientWidth - 10, headPos.left + lineOff.left - wrapOff.left));
            }
            return result;
        }
        showSelection(drawn) {
            let cm = this.cm, display = cm.display;
            dom.removeChildrenAndAdd(display.cursorDiv, drawn.cursors);
            dom.removeChildrenAndAdd(display.selectionDiv, drawn.selection);
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
                    dom.selectInput(this.textarea);
                if (browser.ie && browser.ie_version >= 9)
                    this.hasSelection = content;
            } else if (!typing) {
                this.prevInput = this.textarea.value = '';
                if (browser.ie && browser.ie_version >= 9)
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
            if (this.cm.options.readOnly != 'nocursor' && (!browser.mobile || dom.activeElt() != this.textarea)) {
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
            let missed = false, self = this;
            self.pollingFast = true;
            function p() {
                let changed = self.poll();
                if (!changed && !missed) {
                    missed = true;
                    self.polling.set(60, p);
                } else {
                    self.pollingFast = false;
                    self.slowPoll();
                }
            }
            self.polling.set(20, p);
        }
        poll() {
            let cm = this.cm, input = this.textarea, prevInput = this.prevInput;
            if (this.contextMenuPending || !cm.state.focused || feature_detection.hasSelection(input) && !prevInput && !this.composing || cm.isReadOnly() || cm.options.disableInput || cm.state.keySeq)
                return false;
            let text = input.value;
            if (text == prevInput && !cm.somethingSelected())
                return false;
            if (browser.ie && browser.ie_version >= 9 && this.hasSelection === text || browser.mac && /[\uf700-\uf7ff]/.test(text)) {
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
            operations.runInOp(cm, () => {
                inputs.applyTextInput(cm, text.slice(same), prevInput.length - same, null, this.composing ? '*compose' : null);
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
            if (browser.ie && browser.ie_version >= 9)
                this.hasSelection = null;
            this.fastPoll();
        }
        onContextMenu(e) {
            let self = this, cm = self.cm, display = cm.display, te = self.textarea;
            if (self.contextMenuPending)
                self.contextMenuPending();
            let pos = position_measurement.posFromMouse(cm, e), scrollPos = display.scroller.scrollTop;
            if (!pos || browser.presto)
                return;
            let reset = cm.options.resetSelectionOnContextMenu;
            if (reset && cm.doc.sel.contains(pos) == -1)
                operations.operation(cm, selection_updates.setSelection)(cm.doc, model_selection.simpleSelection(pos), misc.sel_dontScroll);
            let oldCSS = te.style.cssText, oldWrapperCSS = self.wrapper.style.cssText;
            let wrapperBox = self.wrapper.offsetParent.getBoundingClientRect();
            self.wrapper.style.cssText = 'position: static';
            te.style.cssText = `position: absolute; width: 30px; height: 30px;
      top: ${ e.clientY - wrapperBox.top - 5 }px; left: ${ e.clientX - wrapperBox.left - 5 }px;
      z-index: 1000; background: ${ browser.ie ? 'rgba(255, 255, 255, .05)' : 'transparent' };
      outline: none; border-width: 0; outline: none; overflow: hidden; opacity: .05; filter: alpha(opacity=5);`;
            let oldScrollY;
            if (browser.webkit)
                oldScrollY = window.scrollY;
            display.input.focus();
            if (browser.webkit)
                window.scrollTo(null, oldScrollY);
            display.input.reset();
            if (!cm.somethingSelected())
                te.value = self.prevInput = ' ';
            self.contextMenuPending = rehide;
            display.selForContextMenu = cm.doc.sel;
            clearTimeout(display.detectingSelectAll);
            function prepareSelectAllHack() {
                if (te.selectionStart != null) {
                    let selected = cm.somethingSelected();
                    let extval = '\u200B' + (selected ? te.value : '');
                    te.value = '\u21DA';
                    te.value = extval;
                    self.prevInput = selected ? '' : '\u200B';
                    te.selectionStart = 1;
                    te.selectionEnd = extval.length;
                    display.selForContextMenu = cm.doc.sel;
                }
            }
            function rehide() {
                if (self.contextMenuPending != rehide)
                    return;
                self.contextMenuPending = false;
                self.wrapper.style.cssText = oldWrapperCSS;
                te.style.cssText = oldCSS;
                if (browser.ie && browser.ie_version < 9)
                    display.scrollbars.setScrollTop(display.scroller.scrollTop = scrollPos);
                if (te.selectionStart != null) {
                    if (!browser.ie || browser.ie && browser.ie_version < 9)
                        prepareSelectAllHack();
                    let i = 0, poll = () => {
                            if (display.selForContextMenu == cm.doc.sel && te.selectionStart == 0 && te.selectionEnd > 0 && self.prevInput == '\u200B') {
                                operations.operation(cm, selection_updates.selectAll)(cm);
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
            if (browser.ie && browser.ie_version >= 9)
                prepareSelectAllHack();
            if (browser.captureRightClick) {
                event.e_stop(e);
                let mouseup = () => {
                    event.off(window, 'mouseup', mouseup);
                    setTimeout(rehide, 20);
                };
                event.on(window, 'mouseup', mouseup);
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