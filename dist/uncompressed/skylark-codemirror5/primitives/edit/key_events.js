define([
    '../util/operation_group',
    '../display/selection',
    '../input/keymap',
    '../measurement/widgets',
    '../util/browser',
    '../util/dom',
    '../util/event',
    '../util/feature_detection',
    '../util/misc',
    './commands'
], function (a, b, c, d, e, f, g, h, i, j) {
    'use strict';
    function doHandleBinding(cm, bound, dropShift) {
        if (typeof bound == 'string') {
            bound = j.commands[bound];
            if (!bound)
                return false;
        }
        cm.display.input.ensurePolled();
        let prevShift = cm.display.shift, done = false;
        try {
            if (cm.isReadOnly())
                cm.state.suppressEdits = true;
            if (dropShift)
                cm.display.shift = false;
            done = bound(cm) != i.Pass;
        } finally {
            cm.display.shift = prevShift;
            cm.state.suppressEdits = false;
        }
        return done;
    }
    function lookupKeyForEditor(cm, name, handle) {
        for (let i = 0; i < cm.state.keyMaps.length; i++) {
            let result = c.lookupKey(name, cm.state.keyMaps[i], handle, cm);
            if (result)
                return result;
        }
        return cm.options.extraKeys && c.lookupKey(name, cm.options.extraKeys, handle, cm) || c.lookupKey(name, cm.options.keyMap, handle, cm);
    }
    let stopSeq = new i.Delayed();
    function dispatchKey(cm, name, e, handle) {
        let seq = cm.state.keySeq;
        if (seq) {
            if (c.isModifierKey(name))
                return 'handled';
            if (/\'$/.test(name))
                cm.state.keySeq = null;
            else
                stopSeq.set(50, () => {
                    if (cm.state.keySeq == seq) {
                        cm.state.keySeq = null;
                        cm.display.input.reset();
                    }
                });
            if (dispatchKeyInner(cm, seq + ' ' + name, e, handle))
                return true;
        }
        return dispatchKeyInner(cm, name, e, handle);
    }
    function dispatchKeyInner(cm, name, e, handle) {
        let result = lookupKeyForEditor(cm, name, handle);
        if (result == 'multi')
            cm.state.keySeq = name;
        if (result == 'handled')
            a.signalLater(cm, 'keyHandled', cm, name, e);
        if (result == 'handled' || result == 'multi') {
            g.e_preventDefault(e);
            b.restartBlink(cm);
        }
        return !!result;
    }
    function handleKeyBinding(cm, e) {
        let name = c.keyName(e, true);
        if (!name)
            return false;
        if (e.shiftKey && !cm.state.keySeq) {
            return dispatchKey(cm, 'Shift-' + name, e, b => doHandleBinding(cm, b, true)) || dispatchKey(cm, name, e, b => {
                if (typeof b == 'string' ? /^go[A-Z]/.test(b) : b.motion)
                    return doHandleBinding(cm, b);
            });
        } else {
            return dispatchKey(cm, name, e, b => doHandleBinding(cm, b));
        }
    }
    function handleCharBinding(cm, e, ch) {
        return dispatchKey(cm, "'" + ch + "'", e, b => doHandleBinding(cm, b, true));
    }
    let lastStoppedKey = null;
    function onKeyDown(e) {
        let cm = this;
        cm.curOp.focus = f.activeElt();
        if (g.signalDOMEvent(cm, e))
            return;
        if (e.ie && e.ie_version < 11 && e.keyCode == 27)
            e.returnValue = false;
        let code = e.keyCode;
        cm.display.shift = code == 16 || e.shiftKey;
        let handled = handleKeyBinding(cm, e);
        if (e.presto) {
            lastStoppedKey = handled ? code : null;
            if (!handled && code == 88 && !h.hasCopyEvent && (e.mac ? e.metaKey : e.ctrlKey))
                cm.replaceSelection('', null, 'cut');
        }
        if (code == 18 && !/\bCodeMirror-crosshair\b/.test(cm.display.lineDiv.className))
            showCrossHair(cm);
    }
    function showCrossHair(cm) {
        let lineDiv = cm.display.lineDiv;
        f.addClass(lineDiv, 'CodeMirror-crosshair');
        function up(e) {
            if (e.keyCode == 18 || !e.altKey) {
                f.rmClass(lineDiv, 'CodeMirror-crosshair');
                g.off(document, 'keyup', up);
                g.off(document, 'mouseover', up);
            }
        }
        g.on(document, 'keyup', up);
        g.on(document, 'mouseover', up);
    }
    function onKeyUp(e) {
        if (e.keyCode == 16)
            this.doc.sel.shift = false;
        g.signalDOMEvent(this, e);
    }
    function onKeyPress(e) {
        let cm = this;
        if (d.eventInWidget(cm.display, e) || g.signalDOMEvent(cm, e) || e.ctrlKey && !e.altKey || e.mac && e.metaKey)
            return;
        let keyCode = e.keyCode, charCode = e.charCode;
        if (e.presto && keyCode == lastStoppedKey) {
            lastStoppedKey = null;
            g.e_preventDefault(e);
            return;
        }
        if (e.presto && (!e.which || e.which < 10) && handleKeyBinding(cm, e))
            return;
        let ch = String.fromCharCode(charCode == null ? keyCode : charCode);
        if (ch == '\b')
            return;
        if (handleCharBinding(cm, e, ch))
            return;
        cm.display.input.onKeyPress(e);
    }
    return {
        dispatchKey: dispatchKey,
        onKeyDown: onKeyDown,
        onKeyUp: onKeyUp,
        onKeyPress: onKeyPress
    };
});