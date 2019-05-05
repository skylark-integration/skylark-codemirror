define([
    '../util/dom',
    '../util/misc',
    './update_display'
], function (a, b, c) {
    'use strict';
    function updateGutters(cm) {
        let gutters = cm.display.gutters, specs = cm.options.gutters;
        a.removeChildren(gutters);
        let i = 0;
        for (; i < specs.length; ++i) {
            let gutterClass = specs[i];
            let gElt = gutters.appendChild(a.elt('div', null, 'CodeMirror-gutter ' + gutterClass));
            if (gutterClass == 'CodeMirror-linenumbers') {
                cm.display.lineGutter = gElt;
                gElt.style.width = (cm.display.lineNumWidth || 1) + 'px';
            }
        }
        gutters.style.display = i ? '' : 'none';
        c.updateGutterSpace(cm);
    }
    function setGuttersForLineNumbers(options) {
        let found = b.indexOf(options.gutters, 'CodeMirror-linenumbers');
        if (found == -1 && options.lineNumbers) {
            options.gutters = options.gutters.concat(['CodeMirror-linenumbers']);
        } else if (found > -1 && !options.lineNumbers) {
            options.gutters = options.gutters.slice(0);
            options.gutters.splice(found, 1);
        }
    }
    return {
        updateGutters: updateGutters,
        setGuttersForLineNumbers: setGuttersForLineNumbers
    };
});