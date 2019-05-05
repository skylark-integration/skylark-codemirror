define(['../measurement/position_measurement'], function (a) {
    'use strict';
    function themeChanged(cm) {
        cm.display.wrapper.className = cm.display.wrapper.className.replace(/\s*cm-s-\S+/g, '') + cm.options.theme.replace(/(^|\s)\s*/g, ' cm-s-');
        a.clearCaches(cm);
    }
    return { themeChanged: themeChanged };
});