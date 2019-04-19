define([
    './dom',
    './browser'
], function (a, b) {
    'use strict';
    let dragAndDrop = function () {
        if (b.ie && b.ie_version < 9)
            return false;
        let div = a.elt('div');
        return 'draggable' in div || 'dragDrop' in div;
    }();
    let zwspSupported;
    function zeroWidthElement(measure) {
        if (zwspSupported == null) {
            let test = a.elt('span', '\u200B');
            a.removeChildrenAndAdd(measure, a.elt('span', [
                test,
                document.createTextNode('x')
            ]));
            if (measure.firstChild.offsetHeight != 0)
                zwspSupported = test.offsetWidth <= 1 && test.offsetHeight > 2 && !(b.ie && b.ie_version < 8);
        }
        let node = zwspSupported ? a.elt('span', '\u200B') : a.elt('span', '\xA0', null, 'display: inline-block; width: 1px; margin-right: -1px');
        node.setAttribute('cm-text', '');
        return node;
    }
    let badBidiRects;
    function hasBadBidiRects(measure) {
        if (badBidiRects != null)
            return badBidiRects;
        let txt = a.removeChildrenAndAdd(measure, document.createTextNode('AخA'));
        let r0 = a.range(txt, 0, 1).getBoundingClientRect();
        let r1 = a.range(txt, 1, 2).getBoundingClientRect();
        a.removeChildren(measure);
        if (!r0 || r0.left == r0.right)
            return false;
        return badBidiRects = r1.right - r0.right < 3;
    }
    let splitLinesAuto = '\n\nb'.split(/\n/).length != 3 ? string => {
        let pos = 0, result = [], l = string.length;
        while (pos <= l) {
            let nl = string.indexOf('\n', pos);
            if (nl == -1)
                nl = string.length;
            let line = string.slice(pos, string.charAt(nl - 1) == '\r' ? nl - 1 : nl);
            let rt = line.indexOf('\r');
            if (rt != -1) {
                result.push(line.slice(0, rt));
                pos += rt + 1;
            } else {
                result.push(line);
                pos = nl + 1;
            }
        }
        return result;
    } : string => string.split(/\r\n?|\n/);
    let hasSelection = window.getSelection ? te => {
        try {
            return te.selectionStart != te.selectionEnd;
        } catch (e) {
            return false;
        }
    } : te => {
        let range;
        try {
            range = te.ownerDocument.selection.createRange();
        } catch (e) {
        }
        if (!range || range.parentElement() != te)
            return false;
        return range.compareEndPoints('StartToEnd', range) != 0;
    };
    let hasCopyEvent = (() => {
        let e = a.elt('div');
        if ('oncopy' in e)
            return true;
        e.setAttribute('oncopy', 'return;');
        return typeof e.oncopy == 'function';
    })();
    let badZoomedRects = null;
    function hasBadZoomedRects(measure) {
        if (badZoomedRects != null)
            return badZoomedRects;
        let node = a.removeChildrenAndAdd(measure, a.elt('span', 'x'));
        let normal = node.getBoundingClientRect();
        let fromRange = a.range(node, 0, 1).getBoundingClientRect();
        return badZoomedRects = Math.abs(normal.left - fromRange.left) > 1;
    }
    return {
        dragAndDrop: dragAndDrop,
        zeroWidthElement: zeroWidthElement,
        hasBadBidiRects: hasBadBidiRects,
        splitLinesAuto: splitLinesAuto,
        hasSelection: hasSelection,
        hasCopyEvent: hasCopyEvent,
        hasBadZoomedRects: hasBadZoomedRects
    };
});