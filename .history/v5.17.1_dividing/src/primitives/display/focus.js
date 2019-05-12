define([
  "../util/dom",
  "../CoderCtor"
],function(dom, CoderCtor) {

  // FOCUS/BLUR EVENTS
  CoderCtor.partial({
    ensureFocus : function () {
      var cm = this;

      if (!cm.state.focused) { 
        cm.display.input.focus(); 
        cm.onFocus(); 
      }
    },

    delayBlurEvent : function () {
      var cm = this;

      cm.state.delayingBlurEvent = true;
      setTimeout(function() {
        if (cm.state.delayingBlurEvent) {
          cm.state.delayingBlurEvent = false;
          cm.onBlur();
        }
      }, 100);
    },

    onFocus : function () {
      var cm = this;
      if (cm.state.delayingBlurEvent) {
        cm.state.delayingBlurEvent = false;
      }

      if (cm.options.readOnly == "nocursor") return;
      if (!cm.state.focused) {
        cm.signal("focus", cm);
        cm.state.focused = true;
        dom.addClass(cm.display.wrapper, "CodeMirror-focused");
        // This test prevents this from firing when a context
        // menu is closed (since the input reset would kill the
        // select-all detection hack)
        if (!cm.curOp && cm.display.selForContextMenu != cm.doc.sel) {
          cm.display.input.reset();
          if (webkit) setTimeout(function() { 
            cm.display.input.reset(true); 
          }, 20); // Issue #1730
        }
        cm.display.input.receivedFocus();
      }
      cm.restartBlink();
    },
    
    onBlur : function () {
      var cm = this;
      if (cm.state.delayingBlurEvent) {
        return;
      }

      if (cm.state.focused) {
        signal(cm, "blur", cm);
        cm.state.focused = false;
        dom.rmClass(cm.display.wrapper, "CodeMirror-focused");
      }
      clearInterval(cm.display.blinker);
      setTimeout(function() {
        if (!cm.state.focused) cm.display.shift = false;
      }, 150);
    }

  });

});
