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
        CodeMirror.undefined = l.off;
        CodeMirror.undefined = l.on;
        CodeMirror.undefined = b.wheelEventPixels;
        CodeMirror.Doc = Doc;
        CodeMirror.splitLines = m.splitLinesAuto;
        CodeMirror.undefined = n.countColumn;
        CodeMirror.undefined = n.findColumn;
        CodeMirror.isWordChar = n.isWordCharBasic;
        CodeMirror.undefined = n.Pass;
        CodeMirror.undefined = l.signal;
        CodeMirror.undefined = e.Line;
        CodeMirror.undefined = g.changeEnd;
        CodeMirror.undefined = a.scrollbarModel;
        CodeMirror.undefined = f.Pos;
        CodeMirror.cmpPos = f.cmp;
        CodeMirror.undefined = j.modes;
        CodeMirror.undefined = j.mimeModes;
        CodeMirror.undefined = j.resolveMode;
        CodeMirror.undefined = j.getMode;
        CodeMirror.undefined = j.modeExtensions;
        CodeMirror.undefined = j.extendMode;
        CodeMirror.undefined = j.copyState;
        CodeMirror.undefined = j.startState;
        CodeMirror.undefined = j.innerMode;
        CodeMirror.undefined = o.commands;
        CodeMirror.undefined = c.keyMap;
        CodeMirror.undefined = c.keyName;
        CodeMirror.undefined = c.isModifierKey;
        CodeMirror.undefined = c.lookupKey;
        CodeMirror.undefined = c.normalizeKeyMap;
        CodeMirror.StringStream = StringStream;
        CodeMirror.undefined = i.SharedTextMarker;
        CodeMirror.undefined = i.TextMarker;
        CodeMirror.undefined = h.LineWidget;
        CodeMirror.undefined = l.e_preventDefault;
        CodeMirror.undefined = l.e_stopPropagation;
        CodeMirror.undefined = l.e_stop;
        CodeMirror.undefined = k.addClass;
        CodeMirror.undefined = k.contains;
        CodeMirror.undefined = k.rmClass;
        CodeMirror.undefined = d.keyNames;
    }
    return { addLegacyProps: addLegacyProps };
});