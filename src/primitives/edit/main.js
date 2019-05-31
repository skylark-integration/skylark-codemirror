define([
    './CodeMirror',
    '../util/event',
    '../util/misc',
    './options',
    './methods',
    '../model/Doc',
    '../input/ContentEditableInput',
    '../input/TextareaInput',
    '../modes',
    './fromTextArea',
    './legacy'
], function (CodeMirror, events, misc, options, addEditorMethods, Doc, ContentEditableInput, TextareaInput, modes, m_fromTextArea, legacy) {
    'use strict';
    options.defineOptions(CodeMirror);

    addEditorMethods(CodeMirror);

    let dontDelegate = 'iter insert remove copy getEditor constructor'.split(' ');
    for (let prop in Doc.prototype)
        if (Doc.prototype.hasOwnProperty(prop) && misc.indexOf(dontDelegate, prop) < 0)
            CodeMirror.prototype[prop] = function (method) {
                return function () {
                    return method.apply(this.doc, arguments);
                };
            }(Doc.prototype[prop]);

    events.eventMixin(Doc);

    CodeMirror.inputStyles = {
        'textarea': TextareaInput,
        'contenteditable': ContentEditableInput
    };

    CodeMirror.defineMode = function (name) {
        if (!CodeMirror.defaults.mode && name != 'null')
            CodeMirror.defaults.mode = name;
        modes.defineMode.apply(this, arguments);
    };

    CodeMirror.defineMIME = modes.defineMIME;

    CodeMirror.defineMode('null', () => ({ token: stream => stream.skipToEnd() }));

    CodeMirror.defineMIME('text/plain', 'null');

    CodeMirror.defineExtension = (name, func) => {
        CodeMirror.prototype[name] = func;
    };

    CodeMirror.defineDocExtension = (name, func) => {
        Doc.prototype[name] = func;
    };

    CodeMirror.fromTextArea = m_fromTextArea.fromTextArea;

    legacy.addLegacyProps(CodeMirror);
    CodeMirror.version = '5.45.0';
    return { 
        CodeMirror : CodeMirror 
    };
});