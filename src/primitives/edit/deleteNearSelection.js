define([
    '../display/operations',
    '../display/scrolling',
    '../line/pos',
    '../model/changes',
    '../util/misc'
], function (operations, scrolling, line_pos, changes, misc) {
    'use strict';
    function deleteNearSelection(cm, compute) {
        let ranges = cm.doc.sel.ranges, kill = [];
        for (let i = 0; i < ranges.length; i++) {
            let toKill = compute(ranges[i]);
            while (kill.length && line_pos.cmp(toKill.from, misc.lst(kill).to) <= 0) {
                let replaced = kill.pop();
                if (line_pos.cmp(replaced.from, toKill.from) < 0) {
                    toKill.from = replaced.from;
                    break;
                }
            }
            kill.push(toKill);
        }
        operations.runInOp(cm, () => {
            for (let i = kill.length - 1; i >= 0; i--)
                changes.replaceRange(cm.doc, '', kill[i].from, kill[i].to, '+delete');
            scrolling.ensureCursorVisible(cm);
        });
    }
    return { deleteNearSelection: deleteNearSelection };
});