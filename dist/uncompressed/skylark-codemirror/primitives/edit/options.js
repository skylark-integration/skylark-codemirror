define([
    '../display/focus',
    '../display/gutters',
    '../display/line_numbers',
    '../display/mode_state',
    '../display/scrollbars',
    '../display/selection',
    '../display/view_tracking',
    '../input/keymap',
    '../line/line_data',
    '../line/pos',
    '../line/spans',
    '../measurement/position_measurement',
    '../model/changes',
    '../util/browser',
    '../util/dom',
    '../util/event',
    './utils'
], function (focus, gutters, line_numbers, mode_state, scrollbars, selection, view_tracking, keymap, line_data, posit, spans, measurement, changes, browser, dom, event, utils) {
    'use strict';
    let Init = {
        toString: function () {
            return 'CodeMirror.Init';
        }
    };
    let defaults = {};
    let optionHandlers = {};
    function defineOptions(CodeMirror) {
        let optionHandlers = CodeMirror.optionHandlers;
        function option(name, deflt, handle, notOnInit) {
            CodeMirror.defaults[name] = deflt;
            if (handle)
                optionHandlers[name] = notOnInit ? (cm, val, old) => {
                    if (old != Init)
                        handle(cm, val, old);
                } : handle;
        }
        CodeMirror.defineOption = option;
        CodeMirror.Init = Init;
        option('value', '', (cm, val) => cm.setValue(val), true);
        option('mode', null, (cm, val) => {
            cm.doc.modeOption = val;
            mode_state.loadMode(cm);
        }, true);
        option('indentUnit', 2, mode_state.loadMode, true);
        option('indentWithTabs', false);
        option('smartIndent', true);
        option('tabSize', 4, cm => {
            mode_state.resetModeState(cm);
            measurement.clearCaches(cm);
            view_tracking.regChange(cm);
        }, true);
        option('lineSeparator', null, (cm, val) => {
            cm.doc.lineSep = val;
            if (!val)
                return;
            let newBreaks = [], lineNo = cm.doc.first;
            cm.doc.iter(line => {
                for (let pos = 0;;) {
                    let found = line.text.indexOf(val, pos);
                    if (found == -1)
                        break;
                    pos = found + val.length;
                    newBreaks.push(posit.Pos(lineNo, found));
                }
                lineNo++;
            });
            for (let i = newBreaks.length - 1; i >= 0; i--)
                changes.replaceRange(cm.doc, val, newBreaks[i], posit.Pos(newBreaks[i].line, newBreaks[i].ch + val.length));
        });
        option('specialChars', /[\u0000-\u001f\u007f-\u009f\u00ad\u061c\u200b-\u200f\u2028\u2029\ufeff]/g, (cm, val, old) => {
            cm.state.specialChars = new RegExp(val.source + (val.test('\t') ? '' : '|\t'), 'g');
            if (old != Init)
                cm.refresh();
        });
        option('specialCharPlaceholder', line_data.defaultSpecialCharPlaceholder, cm => cm.refresh(), true);
        option('electricChars', true);
        option('inputStyle', browser.mobile ? 'contenteditable' : 'textarea', () => {
            throw new Error('inputStyle can not (yet) be changed in a running editor');
        }, true);
        option('spellcheck', false, (cm, val) => cm.getInputField().spellcheck = val, true);
        option('autocorrect', false, (cm, val) => cm.getInputField().autocorrect = val, true);
        option('autocapitalize', false, (cm, val) => cm.getInputField().autocapitalize = val, true);
        option('rtlMoveVisually', !browser.windows);
        option('wholeLineUpdateBefore', true);
        option('theme', 'default', cm => {
            utils.themeChanged(cm);
            guttersChanged(cm);
        }, true);
        option('keyMap', 'default', (cm, val, old) => {
            let next = keymap.getKeyMap(val);
            let prev = old != Init && keymap.getKeyMap(old);
            if (prev && prev.detach)
                prev.detach(cm, next);
            if (next.attach)
                next.attach(cm, prev || null);
        });
        option('extraKeys', null);
        option('configureMouse', null);
        option('lineWrapping', false, wrappingChanged, true);
        option('gutters', [], cm => {
            gutters.setGuttersForLineNumbers(cm.options);
            guttersChanged(cm);
        }, true);
        option('fixedGutter', true, (cm, val) => {
            cm.display.gutters.style.left = val ? measurement.compensateForHScroll(cm.display) + 'px' : '0';
            cm.refresh();
        }, true);
        option('coverGutterNextToScrollbar', false, cm => scrollbars.updateScrollbars(cm), true);
        option('scrollbarStyle', 'native', cm => {
            scrollbars.initScrollbars(cm);
            scrollbars.updateScrollbars(cm);
            cm.display.scrollbars.setScrollTop(cm.doc.scrollTop);
            cm.display.scrollbars.setScrollLeft(cm.doc.scrollLeft);
        }, true);
        option('lineNumbers', false, cm => {
            gutters.setGuttersForLineNumbers(cm.options);
            guttersChanged(cm);
        }, true);
        option('firstLineNumber', 1, guttersChanged, true);
        option('lineNumberFormatter', integer => integer, guttersChanged, true);
        option('showCursorWhenSelecting', false, selection.updateSelection, true);
        option('resetSelectionOnContextMenu', true);
        option('lineWiseCopyCut', true);
        option('pasteLinesPerSelection', true);
        option('selectionsMayTouch', false);
        option('readOnly', false, (cm, val) => {
            if (val == 'nocursor') {
                focus.onBlur(cm);
                cm.display.input.blur();
            }
            cm.display.input.readOnlyChanged(val);
        });
        option('disableInput', false, (cm, val) => {
            if (!val)
                cm.display.input.reset();
        }, true);
        option('dragDrop', true, dragDropChanged);
        option('allowDropFileTypes', null);
        option('cursorBlinkRate', 530);
        option('cursorScrollMargin', 0);
        option('cursorHeight', 1, selection.updateSelection, true);
        option('singleCursorHeightPerLine', true, selection.updateSelection, true);
        option('workTime', 100);
        option('workDelay', 100);
        option('flattenSpans', true, mode_state.resetModeState, true);
        option('addModeClass', false, mode_state.resetModeState, true);
        option('pollInterval', 100);
        option('undoDepth', 200, (cm, val) => cm.doc.history.undoDepth = val);
        option('historyEventDelay', 1250);
        option('viewportMargin', 10, cm => cm.refresh(), true);
        option('maxHighlightLength', 10000, mode_state.resetModeState, true);
        option('moveInputWithCursor', true, (cm, val) => {
            if (!val)
                cm.display.input.resetPosition();
        });
        option('tabindex', null, (cm, val) => cm.display.input.getField().tabIndex = val || '');
        option('autofocus', null);
        option('direction', 'ltr', (cm, val) => cm.doc.setDirection(val), true);
        option('phrases', null);
    }
    function guttersChanged(cm) {
        gutters.updateGutters(cm);
        view_tracking.regChange(cm);
        line_numbers.alignHorizontally(cm);
    }
    function dragDropChanged(cm, value, old) {
        let wasOn = old && old != Init;
        if (!value != !wasOn) {
            let funcs = cm.display.dragFunctions;
            let toggle = value ? event.on : event.off;
            toggle(cm.display.scroller, 'dragstart', funcs.start);
            toggle(cm.display.scroller, 'dragenter', funcs.enter);
            toggle(cm.display.scroller, 'dragover', funcs.over);
            toggle(cm.display.scroller, 'dragleave', funcs.leave);
            toggle(cm.display.scroller, 'drop', funcs.drop);
        }
    }
    function wrappingChanged(cm) {
        if (cm.options.lineWrapping) {
            dom.addClass(cm.display.wrapper, 'CodeMirror-wrap');
            cm.display.sizer.style.minWidth = '';
            cm.display.sizerWidth = null;
        } else {
            dom.rmClass(cm.display.wrapper, 'CodeMirror-wrap');
            spans.findMaxLine(cm);
        }
        measurement.estimateLineHeights(cm);
        view_tracking.regChange(cm);
        measurement.clearCaches(cm);
        setTimeout(() => scrollbars.updateScrollbars(cm), 100);
    }
    return {
        Init: Init,
        defaults: defaults,
        optionHandlers: optionHandlers,
        defineOptions: defineOptions
    };
});