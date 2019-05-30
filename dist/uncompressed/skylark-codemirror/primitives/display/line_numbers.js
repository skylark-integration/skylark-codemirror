define([
    '../line/utils_line',
    '../measurement/position_measurement',
    '../util/dom',
    './update_display'
], function (utils_line, position_measurement, dom, update_display) {
    'use strict';
    function alignHorizontally(cm) {
        let display = cm.display, view = display.view;
        if (!display.alignWidgets && (!display.gutters.firstChild || !cm.options.fixedGutter))
            return;
        let comp = position_measurement.compensateForHScroll(display) - display.scroller.scrollLeft + cm.doc.scrollLeft;
        let gutterW = display.gutters.offsetWidth, left = comp + 'px';
        for (let i = 0; i < view.length; i++)
            if (!view[i].hidden) {
                if (cm.options.fixedGutter) {
                    if (view[i].gutter)
                        view[i].gutter.style.left = left;
                    if (view[i].gutterBackground)
                        view[i].gutterBackground.style.left = left;
                }
                let align = view[i].alignable;
                if (align)
                    for (let j = 0; j < align.length; j++)
                        align[j].style.left = left;
            }
        if (cm.options.fixedGutter)
            display.gutters.style.left = comp + gutterW + 'px';
    }
    function maybeUpdateLineNumberWidth(cm) {
        if (!cm.options.lineNumbers)
            return false;
        let doc = cm.doc, last = utils_line.lineNumberFor(cm.options, doc.first + doc.size - 1), display = cm.display;
        if (last.length != display.lineNumChars) {
            let test = display.measure.appendChild(dom.elt('div', [dom.elt('div', last)], 'CodeMirror-linenumber CodeMirror-gutter-elt'));
            let innerW = test.firstChild.offsetWidth, padding = test.offsetWidth - innerW;
            display.lineGutter.style.width = '';
            display.lineNumInnerWidth = Math.max(innerW, display.lineGutter.offsetWidth - padding) + 1;
            display.lineNumWidth = display.lineNumInnerWidth + padding;
            display.lineNumChars = display.lineNumInnerWidth ? last.length : -1;
            display.lineGutter.style.width = display.lineNumWidth + 'px';
            update_display.updateGutterSpace(cm);
            return true;
        }
        return false;
    }
    return {
        alignHorizontally: alignHorizontally,
        maybeUpdateLineNumberWidth: maybeUpdateLineNumberWidth
    };
});