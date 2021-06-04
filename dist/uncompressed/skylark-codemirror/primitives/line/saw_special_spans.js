define(function () {
    'use strict';
    let exports = {
        sawReadOnlySpans : false, 
        sawCollapsedSpans : false
    };
    
    exports.seeReadOnlySpans =  function seeReadOnlySpans() {
        exports.sawReadOnlySpans = true;
    };

    exports.seeCollapsedSpans = function seeCollapsedSpans() {
        exports.sawCollapsedSpans = true;
    };

    return exports;
});