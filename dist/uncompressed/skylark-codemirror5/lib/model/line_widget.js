define([
    '../display/operations',
    '../display/scrolling',
    '../display/view_tracking',
    '../line/spans',
    '../line/utils_line',
    '../measurement/widgets',
    './changes',
    '../util/event',
    '../util/operation_group'
], function (a, b, c, d, e, f, g, h, i) {
    'use strict';
    class LineWidget {
        constructor(doc, node, options) {
            if (options)
                for (let opt in options)
                    if (options.hasOwnProperty(opt))
                        this[opt] = options[opt];
            this.doc = doc;
            this.node = node;
        }
        clear() {
            let cm = this.doc.cm, ws = this.line.widgets, line = this.line, no = e.lineNo(line);
            if (no == null || !ws)
                return;
            for (let i = 0; i < ws.length; ++i)
                if (ws[i] == this)
                    ws.splice(i--, 1);
            if (!ws.length)
                line.widgets = null;
            let height = f.widgetHeight(this);
            e.updateLineHeight(line, Math.max(0, line.height - height));
            if (cm) {
                a.runInOp(cm, () => {
                    adjustScrollWhenAboveVisible(cm, line, -height);
                    c.regLineChange(cm, no, 'widget');
                });
                i.signalLater(cm, 'lineWidgetCleared', cm, this, no);
            }
        }
        changed() {
            let oldH = this.height, cm = this.doc.cm, line = this.line;
            this.height = null;
            let diff = f.widgetHeight(this) - oldH;
            if (!diff)
                return;
            if (!d.lineIsHidden(this.doc, line))
                e.updateLineHeight(line, line.height + diff);
            if (cm) {
                a.runInOp(cm, () => {
                    cm.curOp.forceUpdate = true;
                    adjustScrollWhenAboveVisible(cm, line, diff);
                    i.signalLater(cm, 'lineWidgetChanged', cm, this, e.lineNo(line));
                });
            }
        }
    }
    h.eventMixin(LineWidget);
    function adjustScrollWhenAboveVisible(cm, line, diff) {
        if (d.heightAtLine(line) < (cm.curOp && cm.curOp.scrollTop || cm.doc.scrollTop))
            b.addToScrollTop(cm, diff);
    }
    function addLineWidget(doc, handle, node, options) {
        let widget = new LineWidget(doc, node, options);
        let cm = doc.cm;
        if (cm && widget.noHScroll)
            cm.display.alignWidgets = true;
        g.changeLine(doc, handle, 'widget', line => {
            let widgets = line.widgets || (line.widgets = []);
            if (widget.insertAt == null)
                widgets.push(widget);
            else
                widgets.splice(Math.min(widgets.length - 1, Math.max(0, widget.insertAt)), 0, widget);
            widget.line = line;
            if (cm && !d.lineIsHidden(doc, line)) {
                let aboveVisible = d.heightAtLine(line) < doc.scrollTop;
                e.updateLineHeight(line, line.height + f.widgetHeight(widget));
                if (aboveVisible)
                    b.addToScrollTop(cm, widget.height);
                cm.curOp.forceUpdate = true;
            }
            return true;
        });
        if (cm)
            i.signalLater(cm, 'lineWidgetAdded', cm, widget, typeof handle == 'number' ? handle : e.lineNo(handle));
        return widget;
    }
    return {
        LineWidget: LineWidget,
        addLineWidget: addLineWidget
    };
});