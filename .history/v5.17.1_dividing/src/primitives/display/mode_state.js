define([
  "../CoderCtor"
],function(CoderCtor) {
  // Used to get the editor into a consistent state again when options change.

  CoderCtor.partial({
    loadMode : function () {
      var cm = this;
      cm.doc.mode = CodeMirror.getMode(cm.options, cm.doc.modeOption);
      resetModeState(cm);
    },
    resetModeState : function () {
      var cm = this;

      cm.doc.iter(function(line) {
        if (line.stateAfter) line.stateAfter = null;
        if (line.styles) line.styles = null;
      });
      cm.doc.frontier = cm.doc.first;
      startWorker(cm, 100);
      cm.state.modeGen++;
      if (cm.curOp) {
        cm.regChange();
      }
    }
  });

});

