define([
    '../util/dom',
    '../util/misc',
    './update_display'
], function (dom, misc, update_display) {
    'use strict';
    function updateGutters(cm) {
        let gutters = cm.display.gutters, specs = cm.options.gutters;
        dom.removeChildren(gutters);
        let i = 0;
        for (; i < specs.length; ++i) {
            let gutterClass = specs[i];
            let gElt = gutters.appendChild(dom.elt('div', null, 'CodeMirror-gutter ' + gutterClass));
            if (gutterClass == 'CodeMirror-linenumbers') {
                cm.display.lineGutter = gElt;
                gElt.style.width = (cm.display.lineNumWidth || 1) + 'px';
            }
        }
        gutters.style.display = i ? '' : 'none';
        update_display.updateGutterSpace(cm);
    }
    function setGuttersForLineNumbers(options) {
        let found = misc.indexOf(options.gutters, 'CodeMirror-linenumbers');
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