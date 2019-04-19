define([
    './selection',
    '../util/browser',
    '../util/dom',
    '../util/event'
], function (a, b, c, d) {
    'use strict';
    function ensureFocus(cm) {
        if (!cm.state.focused) {
            cm.display.input.focus();
            onFocus(cm);
        }
    }
    function delayBlurEvent(cm) {
        cm.state.delayingBlurEvent = true;
        setTimeout(() => {
            if (cm.state.delayingBlurEvent) {
                cm.state.delayingBlurEvent = false;
                onBlur(cm);
            }
        }, 100);
    }
    function onFocus(cm, e) {
        if (cm.state.delayingBlurEvent)
            cm.state.delayingBlurEvent = false;
        if (cm.options.readOnly == 'nocursor')
            return;
        if (!cm.state.focused) {
            d.signal(cm, 'focus', cm, e);
            cm.state.focused = true;
            c.addClass(cm.display.wrapper, 'CodeMirror-focused');
            if (!cm.curOp && cm.display.selForContextMenu != cm.doc.sel) {
                cm.display.input.reset();
                if (b.webkit)
                    setTimeout(() => cm.display.input.reset(true), 20);
            }
            cm.display.input.receivedFocus();
        }
        a.restartBlink(cm);
    }
    function onBlur(cm, e) {
        if (cm.state.delayingBlurEvent)
            return;
        if (cm.state.focused) {
            d.signal(cm, 'blur', cm, e);
            cm.state.focused = false;
            c.rmClass(cm.display.wrapper, 'CodeMirror-focused');
        }
        clearInterval(cm.display.blinker);
        setTimeout(() => {
            if (!cm.state.focused)
                cm.display.shift = false;
        }, 150);
    }
    return {
        ensureFocus: ensureFocus,
        delayBlurEvent: delayBlurEvent,
        onFocus: onFocus,
        onBlur: onBlur
    };
});