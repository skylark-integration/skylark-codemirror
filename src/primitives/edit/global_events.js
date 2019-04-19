define([
    '../display/focus',
    '../util/event'
], function (a, b) {
    'use strict';
    function forEachCodeMirror(f) {
        if (!document.getElementsByClassName)
            return;
        let byClass = document.getElementsByClassName('CodeMirror'), editors = [];
        for (let i = 0; i < byClass.length; i++) {
            let cm = byClass[i].CodeMirror;
            if (cm)
                editors.push(cm);
        }
        if (editors.length)
            editors[0].operation(() => {
                for (let i = 0; i < editors.length; i++)
                    f(editors[i]);
            });
    }
    let globalsRegistered = false;
    function ensureGlobalHandlers() {
        if (globalsRegistered)
            return;
        registerGlobalHandlers();
        globalsRegistered = true;
    }
    function registerGlobalHandlers() {
        let resizeTimer;
        b.on(window, 'resize', () => {
            if (resizeTimer == null)
                resizeTimer = setTimeout(() => {
                    resizeTimer = null;
                    forEachCodeMirror(onResize);
                }, 100);
        });
        b.on(window, 'blur', () => forEachCodeMirror(a.onBlur));
    }
    function onResize(cm) {
        let d = cm.display;
        d.cachedCharWidth = d.cachedTextHeight = d.cachedPaddingH = null;
        d.scrollbarsClipped = false;
        cm.setSize();
    }
    return { ensureGlobalHandlers: ensureGlobalHandlers };
});