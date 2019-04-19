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
], function (a, b, c, d, addEditorMethods, Doc, ContentEditableInput, TextareaInput, e, f, g) {
    'use strict';
    d.defineOptions(a.CodeMirror);
    addEditorMethods(a.CodeMirror);
    let dontDelegate = 'iter insert remove copy getEditor constructor'.split(' ');
    for (let prop in Doc.prototype)
        if (Doc.prototype.hasOwnProperty(prop) && c.indexOf(dontDelegate, prop) < 0)
            a.CodeMirror.prototype[prop] = function (method) {
                return function () {
                    return method.apply(this.doc, arguments);
                };
            }(Doc.prototype[prop]);
    b.eventMixin(Doc);
    a.CodeMirror.inputStyles = {
        'textarea': TextareaInput,
        'contenteditable': ContentEditableInput
    };
    a.CodeMirror.undefined = function (name) {
        if (!a.CodeMirror.defaults.mode && name != 'null')
            a.CodeMirror.defaults.mode = name;
        e.defineMode.apply(this, arguments);
    };
    a.CodeMirror.undefined = e.defineMIME;
    a.CodeMirror.undefined('null', () => ({ token: stream => stream.skipToEnd() }));
    a.CodeMirror.undefined('text/plain', 'null');
    a.CodeMirror.defineExtension = (name, func) => {
        a.CodeMirror.prototype[name] = func;
    };
    a.CodeMirror.defineDocExtension = (name, func) => {
        Doc.prototype[name] = func;
    };
    a.CodeMirror.undefined = f.fromTextArea;
    g.addLegacyProps(a.CodeMirror);
    a.CodeMirror.version = '5.45.0';
    return { 
        CodeMirror : CodeMirror };
});