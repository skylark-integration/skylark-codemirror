define([
    '../modes',
    './highlight_worker',
    './view_tracking'
], function (a, b, c) {
    'use strict';
    function loadMode(cm) {
        cm.doc.mode = a.getMode(cm.options, cm.doc.modeOption);
        resetModeState(cm);
    }
    function resetModeState(cm) {
        cm.doc.iter(line => {
            if (line.stateAfter)
                line.stateAfter = null;
            if (line.styles)
                line.styles = null;
        });
        cm.doc.modeFrontier = cm.doc.highlightFrontier = cm.doc.first;
        b.startWorker(cm, 100);
        cm.state.modeGen++;
        if (cm.curOp)
            c.regChange(cm);
    }
    return {
        loadMode: loadMode,
        resetModeState: resetModeState
    };
});