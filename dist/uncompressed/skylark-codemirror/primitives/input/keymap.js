define([
    '../util/browser',
    '../util/misc',
    './keynames'
], function (browser, misc, keynames) {
    'use strict';
    let keyMap = {};
    keyMap.basic = {
        'Left': 'goCharLeft',
        'Right': 'goCharRight',
        'Up': 'goLineUp',
        'Down': 'goLineDown',
        'End': 'goLineEnd',
        'Home': 'goLineStartSmart',
        'PageUp': 'goPageUp',
        'PageDown': 'goPageDown',
        'Delete': 'delCharAfter',
        'Backspace': 'delCharBefore',
        'Shift-Backspace': 'delCharBefore',
        'Tab': 'defaultTab',
        'Shift-Tab': 'indentAuto',
        'Enter': 'newlineAndIndent',
        'Insert': 'toggleOverwrite',
        'Esc': 'singleSelection'
    };
    keyMap.pcDefault = {
        'Ctrl-A': 'selectAll',
        'Ctrl-D': 'deleteLine',
        'Ctrl-Z': 'undo',
        'Shift-Ctrl-Z': 'redo',
        'Ctrl-Y': 'redo',
        'Ctrl-Home': 'goDocStart',
        'Ctrl-End': 'goDocEnd',
        'Ctrl-Up': 'goLineUp',
        'Ctrl-Down': 'goLineDown',
        'Ctrl-Left': 'goGroupLeft',
        'Ctrl-Right': 'goGroupRight',
        'Alt-Left': 'goLineStart',
        'Alt-Right': 'goLineEnd',
        'Ctrl-Backspace': 'delGroupBefore',
        'Ctrl-Delete': 'delGroupAfter',
        'Ctrl-S': 'save',
        'Ctrl-F': 'find',
        'Ctrl-G': 'findNext',
        'Shift-Ctrl-G': 'findPrev',
        'Shift-Ctrl-F': 'replace',
        'Shift-Ctrl-R': 'replaceAll',
        'Ctrl-[': 'indentLess',
        'Ctrl-]': 'indentMore',
        'Ctrl-U': 'undoSelection',
        'Shift-Ctrl-U': 'redoSelection',
        'Alt-U': 'redoSelection',
        'fallthrough': 'basic'
    };
    keyMap.emacsy = {
        'Ctrl-F': 'goCharRight',
        'Ctrl-B': 'goCharLeft',
        'Ctrl-P': 'goLineUp',
        'Ctrl-N': 'goLineDown',
        'Alt-F': 'goWordRight',
        'Alt-B': 'goWordLeft',
        'Ctrl-A': 'goLineStart',
        'Ctrl-E': 'goLineEnd',
        'Ctrl-V': 'goPageDown',
        'Shift-Ctrl-V': 'goPageUp',
        'Ctrl-D': 'delCharAfter',
        'Ctrl-H': 'delCharBefore',
        'Alt-D': 'delWordAfter',
        'Alt-Backspace': 'delWordBefore',
        'Ctrl-K': 'killLine',
        'Ctrl-T': 'transposeChars',
        'Ctrl-O': 'openLine'
    };
    keyMap.macDefault = {
        'Cmd-A': 'selectAll',
        'Cmd-D': 'deleteLine',
        'Cmd-Z': 'undo',
        'Shift-Cmd-Z': 'redo',
        'Cmd-Y': 'redo',
        'Cmd-Home': 'goDocStart',
        'Cmd-Up': 'goDocStart',
        'Cmd-End': 'goDocEnd',
        'Cmd-Down': 'goDocEnd',
        'Alt-Left': 'goGroupLeft',
        'Alt-Right': 'goGroupRight',
        'Cmd-Left': 'goLineLeft',
        'Cmd-Right': 'goLineRight',
        'Alt-Backspace': 'delGroupBefore',
        'Ctrl-Alt-Backspace': 'delGroupAfter',
        'Alt-Delete': 'delGroupAfter',
        'Cmd-S': 'save',
        'Cmd-F': 'find',
        'Cmd-G': 'findNext',
        'Shift-Cmd-G': 'findPrev',
        'Cmd-Alt-F': 'replace',
        'Shift-Cmd-Alt-F': 'replaceAll',
        'Cmd-[': 'indentLess',
        'Cmd-]': 'indentMore',
        'Cmd-Backspace': 'delWrappedLineLeft',
        'Cmd-Delete': 'delWrappedLineRight',
        'Cmd-U': 'undoSelection',
        'Shift-Cmd-U': 'redoSelection',
        'Ctrl-Up': 'goDocStart',
        'Ctrl-Down': 'goDocEnd',
        'fallthrough': [
            'basic',
            'emacsy'
        ]
    };
    keyMap['default'] = browser.mac ? keyMap.macDefault : keyMap.pcDefault;
    function normalizeKeyName(name) {
        let parts = name.split(/-(?!$)/);
        name = parts[parts.length - 1];
        let alt, ctrl, shift, cmd;
        for (let i = 0; i < parts.length - 1; i++) {
            let mod = parts[i];
            if (/^(cmd|meta|m)$/i.test(mod))
                cmd = true;
            else if (/^a(lt)?$/i.test(mod))
                alt = true;
            else if (/^(c|ctrl|control)$/i.test(mod))
                ctrl = true;
            else if (/^s(hift)?$/i.test(mod))
                shift = true;
            else
                throw new Error('Unrecognized modifier name: ' + mod);
        }
        if (alt)
            name = 'Alt-' + name;
        if (ctrl)
            name = 'Ctrl-' + name;
        if (cmd)
            name = 'Cmd-' + name;
        if (shift)
            name = 'Shift-' + name;
        return name;
    }
    function normalizeKeyMap(keymap) {
        let copy = {};
        for (let keyname in keymap)
            if (keymap.hasOwnProperty(keyname)) {
                let value = keymap[keyname];
                if (/^(name|fallthrough|(de|at)tach)$/.test(keyname))
                    continue;
                if (value == '...') {
                    delete keymap[keyname];
                    continue;
                }
                let keys = misc.map(keyname.split(' '), normalizeKeyName);
                for (let i = 0; i < keys.length; i++) {
                    let val, name;
                    if (i == keys.length - 1) {
                        name = keys.join(' ');
                        val = value;
                    } else {
                        name = keys.slice(0, i + 1).join(' ');
                        val = '...';
                    }
                    let prev = copy[name];
                    if (!prev)
                        copy[name] = val;
                    else if (prev != val)
                        throw new Error('Inconsistent bindings for ' + name);
                }
                delete keymap[keyname];
            }
        for (let prop in copy)
            keymap[prop] = copy[prop];
        return keymap;
    }
    function lookupKey(key, map, handle, context) {
        map = getKeyMap(map);
        let found = map.call ? map.call(key, context) : map[key];
        if (found === false)
            return 'nothing';
        if (found === '...')
            return 'multi';
        if (found != null && handle(found))
            return 'handled';
        if (map.fallthrough) {
            if (Object.prototype.toString.call(map.fallthrough) != '[object Array]')
                return lookupKey(key, map.fallthrough, handle, context);
            for (let i = 0; i < map.fallthrough.length; i++) {
                let result = lookupKey(key, map.fallthrough[i], handle, context);
                if (result)
                    return result;
            }
        }
    }
    function isModifierKey(value) {
        let name = typeof value == 'string' ? value : keynames.keyNames[value.keyCode];
        return name == 'Ctrl' || name == 'Alt' || name == 'Shift' || name == 'Mod';
    }
    function addModifierNames(name, event, noShift) {
        let base = name;
        if (event.altKey && base != 'Alt')
            name = 'Alt-' + name;
        if ((browser.flipCtrlCmd ? event.metaKey : event.ctrlKey) && base != 'Ctrl')
            name = 'Ctrl-' + name;
        if ((browser.flipCtrlCmd ? event.ctrlKey : event.metaKey) && base != 'Cmd')
            name = 'Cmd-' + name;
        if (!noShift && event.shiftKey && base != 'Shift')
            name = 'Shift-' + name;
        return name;
    }
    function keyName(event, noShift) {
        if (browser.presto && event.keyCode == 34 && event['char'])
            return false;
        let name = keynames.keyNames[event.keyCode];
        if (name == null || event.altGraphKey)
            return false;
        if (event.keyCode == 3 && event.code)
            name = event.code;
        return addModifierNames(name, event, noShift);
    }
    function getKeyMap(val) {
        return typeof val == 'string' ? keyMap[val] : val;
    }
    return {
        keyMap: keyMap,
        normalizeKeyMap: normalizeKeyMap,
        lookupKey: lookupKey,
        isModifierKey: isModifierKey,
        addModifierNames: addModifierNames,
        keyName: keyName,
        getKeyMap: getKeyMap
    };
});