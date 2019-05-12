define([
  "../CoderCtor"
],function(CoderCtor) {
  CoderCtor.partial({
    // Helper for deleting text near the selection(s), used to implement
    // backspace, delete, and similar functionality.
    deleteNearSelection : function (cm, compute) {
      var cm = this;
      
      var ranges = cm.doc.sel.ranges, kill = [];
      // Build up a set of ranges to kill first, merging overlapping
      // ranges.
      for (var i = 0; i < ranges.length; i++) {
        var toKill = compute(ranges[i]);
        while (kill.length && cmp(toKill.from, lst(kill).to) <= 0) {
          var replaced = kill.pop();
          if (cmp(replaced.from, toKill.from) < 0) {
            toKill.from = replaced.from;
            break;
          }
        }
        kill.push(toKill);
      }
      // Next, remove those actual ranges.
      runInOp(cm, function() {
        for (var i = kill.length - 1; i >= 0; i--)
          replaceRange(cm.doc, "", kill[i].from, kill[i].to, "+delete");
        ensureCursorVisible(cm);
      });
    }
  });

});
