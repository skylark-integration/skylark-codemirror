define([
    '../display/operations',
    '../display/scrolling',
    '../line/pos',
    '../model/changes',
    '../util/misc'
], function (a, b, c, d, e) {
    'use strict';
    function deleteNearSelection(cm, compute) {
        let ranges = cm.doc.sel.ranges, kill = [];
        for (let i = 0; i < ranges.length; i++) {
            let toKill = compute(ranges[i]);
            while (kill.length && c.cmp(toKill.from, e.lst(kill).to) <= 0) {
                let replaced = kill.pop();
                if (c.cmp(replaced.from, toKill.from) < 0) {
                    toKill.from = replaced.from;
                    break;
                }
            }
            kill.push(toKill);
        }
        a.runInOp(cm, () => {
            for (let i = kill.length - 1; i >= 0; i--)
                d.replaceRange(cm.doc, '', kill[i].from, kill[i].to, '+delete');
            b.ensureCursorVisible(cm);
        });
    }
    return { deleteNearSelection: deleteNearSelection };
});