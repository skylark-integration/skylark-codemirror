define([
    '../display/scrollbars',
    '../display/scroll_events',
    '../input/keymap',
    '../input/keynames',
    '../line/line_data',
    '../line/pos',
    '../model/change_measurement',
    '../model/Doc',
    '../model/line_widget',
    '../model/mark_text',
    '../modes',
    '../util/dom',
    '../util/event',
    '../util/feature_detection',
    '../util/misc',
    '../util/StringStream',
    './commands'
], function (a, b, c, d, e, f, g, Doc, h, i, j, k, l, m, n, StringStream, o) {
    'use strict';
    function addLegacyProps(CodeMirror) {
        CodeMirror.off = l.off;
        CodeMirror.on = l.on;
        CodeMirror.wheelEventPixels = b.wheelEventPixels;
        CodeMirror.Doc = Doc;
        CodeMirror.splitLines = m.splitLinesAuto;
        CodeMirror.countColumn = n.countColumn;
        CodeMirror.findColumn = n.findColumn;
        CodeMirror.isWordChar = n.isWordCharBasic;
        CodeMirror.Pass = n.Pass;
        CodeMirror.signal = l.signal;
        CodeMirror.Line = e.Line;
        CodeMirror.changeEnd = g.changeEnd;
        CodeMirror.scrollbarModel = a.scrollbarModel;
        CodeMirror.Pos = f.Pos;
        CodeMirror.cmpPos = f.cmp;
        CodeMirror.modes = j.modes;
        CodeMirror.mimeModes = j.mimeModes;
        CodeMirror.resolveMode = j.resolveMode;
        CodeMirror.getMode = j.getMode;
        CodeMirror.modeExtensions = j.modeExtensions;
        CodeMirror.extendMode = j.extendMode;
        CodeMirror.copyState = j.copyState;
        CodeMirror.startState = j.startState;
        CodeMirror.innerMode = j.innerMode;
        CodeMirror.commands = o.commands;
        CodeMirror.keyMap = c.keyMap;
        CodeMirror.keyName = c.keyName;
        CodeMirror.isModifierKey = c.isModifierKey;
        CodeMirror.lookupKey = c.lookupKey;
        CodeMirror.normalizeKeyMap = c.normalizeKeyMap;
        CodeMirror.StringStream = StringStream;
        CodeMirror.SharedTextMarker = i.SharedTextMarker;
        CodeMirror.TextMarker = i.TextMarker;
        CodeMirror.LineWidget = h.LineWidget;
        CodeMirror.e_preventDefault = l.e_preventDefault;
        CodeMirror.e_stopPropagation = l.e_stopPropagation;
        CodeMirror.e_stop = l.e_stop;
        CodeMirror.addClass = k.addClass;
        CodeMirror.contains = k.contains;
        CodeMirror.rmClass = k.rmClass;
        CodeMirror.keyNames = d.keyNames;
    }
    return { addLegacyProps: addLegacyProps };
});