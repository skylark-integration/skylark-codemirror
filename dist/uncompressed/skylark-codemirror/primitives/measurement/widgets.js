define([
    '../util/dom',
    '../util/event'
], function (dom, events) {
    'use strict';
    function widgetHeight(widget) {
        if (widget.height != null)
            return widget.height;
        let cm = widget.doc.cm;
        if (!cm)
            return 0;
        if (!dom.contains(document.body, widget.node)) {
            let parentStyle = 'position: relative;';
            if (widget.coverGutter)
                parentStyle += 'margin-left: -' + cm.display.gutters.offsetWidth + 'px;';
            if (widget.noHScroll)
                parentStyle += 'width: ' + cm.display.wrapper.clientWidth + 'px;';
            dom.removeChildrenAndAdd(cm.display.measure, dom.elt('div', [widget.node], null, parentStyle));
        }
        return widget.height = widget.node.parentNode.offsetHeight;
    }
    function eventInWidget(display, e) {
        for (let n = events.e_target(e); n != display.wrapper; n = n.parentNode) {
            if (!n || n.nodeType == 1 && n.getAttribute('cm-ignore-events') == 'true' || n.parentNode == display.sizer && n != display.mover)
                return true;
        }
    }
    return {
        widgetHeight: widgetHeight,
        eventInWidget: eventInWidget
    };
});