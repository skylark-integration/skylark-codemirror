define([
  "skylark-langx/langx",
  "../../CodeMirror"
], function(langx,CodeMirror) {
  'use strict';
  var Pos = CodeMirror.Pos;

  var defaultOptions = {
    initialBeautify: true,
    autoBeautify: true,
    javascript: {
      beautifyFunc: null,
      completionFunc: function (cm, change) {
        return ['}', ']', ';'].indexOf(change.text[0]) !== -1;
      }
    },
    css: {
      beautifyFunc: null,
      completionFunc: function (cm, change) {
        return ['}', ';'].indexOf(change.text[0]) !== -1;
      }
    },
    html: {
      beautifyFunc: null,
      completionFunc: function (cm, change) {
        return ['>'].indexOf(change.text[0]) !== -1;
      }
    }
  };

  function getOptions (cm) {
    if (!cm || !cm.doc || !cm.doc.mode || !cm.state)
      return;

    if (cm.doc.mode.name === 'javascript')
      return cm.state.beautify.javascript;
    else if (cm.doc.mode.name === 'css')
      return cm.state.beautify.css;
    else if (cm.doc.mode.name === 'htmlmixed')
      return cm.state.beautify.html;
  }

  function beautify (cm) {
    var options = getOptions(cm);

    if (options && options.beautifyFunc)
      cm.setValue(options.beautifyFunc(cm.getValue(), options));
  }

  function shouldComplete(cm, change) {
    var options = getOptions(cm);

    if (options.completionFunc)
      return options.completionFunc(cm, change);

    return false;
  }

  function onChange (cm, change) {
    if (cm.state.beautify && !cm.state.beautify.autoBeautify)
      return;

    if (shouldComplete(cm, change)) {
      var bracketChar = change.text[0];
      var bracketCount = cm.getRange(new Pos(0, 0), change.to).split(bracketChar).length;

      beautify(cm);

      var searchCount = 0;

      for (var i = 0; i < cm.lineCount(); i++) {
        var offset = -1;
        var lineText = cm.getLine(i);

        while ((offset = lineText.indexOf(bracketChar, offset + 1)) !== -1) {
          searchCount++;

          if (bracketCount === searchCount) {
            cm.setCursor(new Pos(i, offset + 1));
            break;
          }
        }

        if (bracketCount === searchCount)
          break;
      }
    }
  }

  CodeMirror.defineOption('beautify', false, function(cm, val, old) {
    if (old && old !== CodeMirror.Init)
      cm.off('change', onChange);
    if (val) {
      var indentUnit = cm.getOption('indentUnit');

      var cmOptions = {
        javascript: {
          indent_size: indentUnit
        },
        css: {
          indent_size: indentUnit
        },
        html: {
          indent_size: indentUnit
        }
      };

      if (typeof val === 'object')
        cm.state.beautify = langx.mixin({}, defaultOptions, cmOptions, val,true);
      else
        cm.state.beautify = langx.mixin({}, defaultOptions, cmOptions,true);

      if (cm.state.beautify.initialBeautify)
        beautify(cm);

      cm.on('change', onChange);
    }
  });

  CodeMirror.defineExtension('beautify', function () {
    beautify(this);
  });
});