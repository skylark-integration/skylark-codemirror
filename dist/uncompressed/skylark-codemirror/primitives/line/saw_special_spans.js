define(function () {
    'use strict';
    let sawReadOnlySpans = false, sawCollapsedSpans = false;
    function seeReadOnlySpans() {
        sawReadOnlySpans = true;
    }
    function seeCollapsedSpans() {
        sawCollapsedSpans = true;
    }
    return {
        sawReadOnlySpans: sawReadOnlySpans,
        sawCollapsedSpans: sawCollapsedSpans,
        seeReadOnlySpans: seeReadOnlySpans,
        seeCollapsedSpans: seeCollapsedSpans
    };
});