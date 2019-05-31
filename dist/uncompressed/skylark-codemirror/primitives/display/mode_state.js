define([
    '../modes',
    //'./highlight_worker',// dependence cycle 
    './view_tracking'
], function (
    models, 
    //highlight_worker, 
    view_tracking
) {
    'use strict';
    function loadMode(cm) {
        cm.doc.mode = models.getMode(cm.options, cm.doc.modeOption);
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
        cm.startWorker(cm, 100); // highlight_worker.startWorker(cm, 100);
        cm.state.modeGen++;
        if (cm.curOp)
            view_tracking.regChange(cm);
    }
    return {
        loadMode: loadMode,
        resetModeState: resetModeState
    };
});