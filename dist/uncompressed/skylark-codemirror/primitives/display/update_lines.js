define([
    '../line/spans',
    '../line/utils_line',
    '../measurement/position_measurement',
    '../util/browser'
], function (spans, utils_line, position_measurement, browser) {
    'use strict';


    // Read the actual heights of the rendered lines, and update their
    // stored heights to match.
    function updateHeightsInViewport(cm) {
        let display = cm.display;
        let prevBottom = display.lineDiv.offsetTop;
        for (let i = 0; i < display.view.length; i++) {
            let cur = display.view[i], wrapping = cm.options.lineWrapping;
            let height, width = 0;
            if (cur.hidden)
                continue;
            if (browser.ie && browser.ie_version < 8) {
                let bot = cur.node.offsetTop + cur.node.offsetHeight;
                height = bot - prevBottom;
                prevBottom = bot;
            } else {
                let box = cur.node.getBoundingClientRect();
                height = box.bottom - box.top;
                if (!wrapping && cur.text.firstChild)
                    width = cur.text.firstChild.getBoundingClientRect().right - box.left - 1;
            }
            let diff = cur.line.height - height;
            if (diff > 0.005 || diff < -0.005) {
                utils_line.updateLineHeight(cur.line, height);
                updateWidgetHeight(cur.line);
                if (cur.rest)
                    for (let j = 0; j < cur.rest.length; j++)
                        updateWidgetHeight(cur.rest[j]);
            }
            if (width > cm.display.sizerWidth) {
                let chWidth = Math.ceil(width / position_measurement.charWidth(cm.display));
                if (chWidth > cm.display.maxLineLength) {
                    cm.display.maxLineLength = chWidth;
                    cm.display.maxLine = cur.line;
                    cm.display.maxLineChanged = true;
                }
            }
        }
    }

    // Read and store the height of line widgets associated with the
    // given line.
    function updateWidgetHeight(line) {
        if (line.widgets)
            for (let i = 0; i < line.widgets.length; ++i) {
                let w = line.widgets[i], parent = w.node.parentNode;
                if (parent)
                    w.height = parent.offsetHeight;
            }
    }

    // Compute the lines that are visible in a given viewport (defaults
    // the the current scroll position). viewport may contain top,
    // height, and ensure (see op.scrollToPos) properties.
    function visibleLines(display, doc, viewport) {
        let top = viewport && viewport.top != null ? Math.max(0, viewport.top) : display.scroller.scrollTop;
        top = Math.floor(top - position_measurement.paddingTop(display));
        let bottom = viewport && viewport.bottom != null ? viewport.bottom : top + display.wrapper.clientHeight;
        let from = utils_line.lineAtHeight(doc, top), to = utils_line.lineAtHeight(doc, bottom);
        if (viewport && viewport.ensure) {
            let ensureFrom = viewport.ensure.from.line, ensureTo = viewport.ensure.to.line;
            if (ensureFrom < from) {
                from = ensureFrom;
                to = utils_line.lineAtHeight(doc, spans.heightAtLine(utils_line.getLine(doc, ensureFrom)) + display.wrapper.clientHeight);
            } else if (Math.min(ensureTo, doc.lastLine()) >= to) {
                from = utils_line.lineAtHeight(doc, spans.heightAtLine(utils_line.getLine(doc, ensureTo)) - display.wrapper.clientHeight);
                to = ensureTo;
            }
        }
        return {
            from: from,
            to: Math.max(to, from + 1)
        };
    }
    return {
        updateHeightsInViewport: updateHeightsInViewport,
        visibleLines: visibleLines
    };
});