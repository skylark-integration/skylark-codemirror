define([
    '../util/browser',
    '../util/event',
    './update_display',
    './scrolling'
], function (m_browser, m_event, m_update_display, m_scrolling) {
    'use strict';
    let wheelSamples = 0, wheelPixelsPerUnit = null;
    if (m_browser.ie)
        wheelPixelsPerUnit = -0.53;
    else if (m_browser.gecko)
        wheelPixelsPerUnit = 15;
    else if (m_browser.chrome)
        wheelPixelsPerUnit = -0.7;
    else if (m_browser.safari)
        wheelPixelsPerUnit = -1 / 3;
    function wheelEventDelta(e) {
        let dx = e.wheelDeltaX, dy = e.wheelDeltaY;
        if (dx == null && e.detail && e.axis == e.HORIZONTAL_AXIS)
            dx = e.detail;
        if (dy == null && e.detail && e.axis == e.VERTICAL_AXIS)
            dy = e.detail;
        else if (dy == null)
            dy = e.wheelDelta;
        return {
            x: dx,
            y: dy
        };
    }
    function wheelEventPixels(e) {
        let delta = wheelEventDelta(e);
        delta.x *= wheelPixelsPerUnit;
        delta.y *= wheelPixelsPerUnit;
        return delta;
    }
    function onScrollWheel(cm, e) {
        let delta = wheelEventDelta(e), dx = delta.x, dy = delta.y;
        let display = cm.display, scroll = display.scroller;
        let canScrollX = scroll.scrollWidth > scroll.clientWidth;
        let canScrollY = scroll.scrollHeight > scroll.clientHeight;
        if (!(dx && canScrollX || dy && canScrollY))
            return;
        if (dy && m_browser.mac && m_browser.webkit) {
            outer:
                for (let cur = e.target, view = display.view; cur != scroll; cur = cur.parentNode) {
                    for (let i = 0; i < view.length; i++) {
                        if (view[i].node == cur) {
                            cm.display.currentWheelTarget = cur;
                            break outer;
                        }
                    }
                }
        }
        if (dx && !m_browser.gecko && !m_browser.presto && wheelPixelsPerUnit != null) {
            if (dy && canScrollY)
                m_scrolling.updateScrollTop(cm, Math.max(0, scroll.scrollTop + dy * wheelPixelsPerUnit));
            m_scrolling.setScrollLeft(cm, Math.max(0, scroll.scrollLeft + dx * wheelPixelsPerUnit));
            if (!dy || dy && canScrollY)
                m_event.e_preventDefault(e);
            display.wheelStartX = null;
            return;
        }
        if (dy && wheelPixelsPerUnit != null) {
            let pixels = dy * wheelPixelsPerUnit;
            let top = cm.doc.scrollTop, bot = top + display.wrapper.clientHeight;
            if (pixels < 0)
                top = Math.max(0, top + pixels - 50);
            else
                bot = Math.min(cm.doc.height, bot + pixels + 50);
            m_update_display.updateDisplaySimple(cm, {
                top: top,
                bottom: bot
            });
        }
        if (wheelSamples < 20) {
            if (display.wheelStartX == null) {
                display.wheelStartX = scroll.scrollLeft;
                display.wheelStartY = scroll.scrollTop;
                display.wheelDX = dx;
                display.wheelDY = dy;
                setTimeout(() => {
                    if (display.wheelStartX == null)
                        return;
                    let movedX = scroll.scrollLeft - display.wheelStartX;
                    let movedY = scroll.scrollTop - display.wheelStartY;
                    let sample = movedY && display.wheelDY && movedY / display.wheelDY || movedX && display.wheelDX && movedX / display.wheelDX;
                    display.wheelStartX = display.wheelStartY = null;
                    if (!sample)
                        return;
                    wheelPixelsPerUnit = (wheelPixelsPerUnit * wheelSamples + sample) / (wheelSamples + 1);
                    ++wheelSamples;
                }, 200);
            } else {
                display.wheelDX += dx;
                display.wheelDY += dy;
            }
        }
    }
    return {
        wheelEventPixels: wheelEventPixels,
        onScrollWheel: onScrollWheel
    };
});