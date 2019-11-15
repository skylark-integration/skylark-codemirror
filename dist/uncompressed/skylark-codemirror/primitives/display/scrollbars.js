define([
    '../util/dom',
    '../util/event',
    '../measurement/position_measurement',
    '../util/browser',
    './update_lines',
    '../util/misc',
    './scrolling'
], function (dom, event, position_measurement, browser, update_lines, misc, scrolling) {
    'use strict';
    function measureForScrollbars(cm) {
        let d = cm.display, gutterW = d.gutters.offsetWidth;
        let docH = Math.round(cm.doc.height + position_measurement.paddingVert(cm.display));
        return {
            clientHeight: d.scroller.clientHeight,
            viewHeight: d.wrapper.clientHeight,
            scrollWidth: d.scroller.scrollWidth,
            clientWidth: d.scroller.clientWidth,
            viewWidth: d.wrapper.clientWidth,
            barLeft: cm.options.fixedGutter ? gutterW : 0,
            docHeight: docH,
            scrollHeight: docH + position_measurement.scrollGap(cm) + d.barHeight,
            nativeBarWidth: d.nativeBarWidth,
            gutterWidth: gutterW
        };
    }
    class NativeScrollbars {
        constructor(place, scroll, cm) {
            this.cm = cm;
            let vert = this.vert = dom.elt('div', [dom.elt('div', null, null, 'min-width: 1px')], 'CodeMirror-vscrollbar');
            let horiz = this.horiz = dom.elt('div', [dom.elt('div', null, null, 'height: 100%; min-height: 1px')], 'CodeMirror-hscrollbar');
            vert.tabIndex = horiz.tabIndex = -1;
            place(vert);
            place(horiz);
            event.on(vert, 'scroll', () => {
                if (vert.clientHeight)
                    scroll(vert.scrollTop, 'vertical');
            });
            event.on(horiz, 'scroll', () => {
                if (horiz.clientWidth)
                    scroll(horiz.scrollLeft, 'horizontal');
            });
            this.checkedZeroWidth = false;
            if (browser.ie && browser.ie_version < 8)
                this.horiz.style.minHeight = this.vert.style.minWidth = '18px';
        }
        update(measure) {
            let needsH = measure.scrollWidth > measure.clientWidth + 1;
            let needsV = measure.scrollHeight > measure.clientHeight + 1;
            let sWidth = measure.nativeBarWidth;
            if (needsV) {
                this.vert.style.display = 'block';
                this.vert.style.bottom = needsH ? sWidth + 'px' : '0';
                let totalHeight = measure.viewHeight - (needsH ? sWidth : 0);
                this.vert.firstChild.style.height = Math.max(0, measure.scrollHeight - measure.clientHeight + totalHeight) + 'px';
            } else {
                this.vert.style.display = '';
                this.vert.firstChild.style.height = '0';
            }
            if (needsH) {
                this.horiz.style.display = 'block';
                this.horiz.style.right = needsV ? sWidth + 'px' : '0';
                this.horiz.style.left = measure.barLeft + 'px';
                let totalWidth = measure.viewWidth - measure.barLeft - (needsV ? sWidth : 0);
                this.horiz.firstChild.style.width = Math.max(0, measure.scrollWidth - measure.clientWidth + totalWidth) + 'px';
            } else {
                this.horiz.style.display = '';
                this.horiz.firstChild.style.width = '0';
            }
            if (!this.checkedZeroWidth && measure.clientHeight > 0) {
                if (sWidth == 0)
                    this.zeroWidthHack();
                this.checkedZeroWidth = true;
            }
            return {
                right: needsV ? sWidth : 0,
                bottom: needsH ? sWidth : 0
            };
        }
        setScrollLeft(pos) {
            if (this.horiz.scrollLeft != pos)
                this.horiz.scrollLeft = pos;
            if (this.disableHoriz)
                this.enableZeroWidthBar(this.horiz, this.disableHoriz, 'horiz');
        }
        setScrollTop(pos) {
            if (this.vert.scrollTop != pos)
                this.vert.scrollTop = pos;
            if (this.disableVert)
                this.enableZeroWidthBar(this.vert, this.disableVert, 'vert');
        }
        zeroWidthHack() {
            let w = browser.mac && !browser.mac_geMountainLion ? '12px' : '18px';
            this.horiz.style.height = this.vert.style.width = w;
            this.horiz.style.pointerEvents = this.vert.style.pointerEvents = 'none';
            this.disableHoriz = new misc.Delayed();
            this.disableVert = new misc.Delayed();
        }
        enableZeroWidthBar(bar, delay, type) {
            bar.style.pointerEvents = 'auto';
            function maybeDisable() {
                let box = bar.getBoundingClientRect();
                let elt = type == 'vert' ? document.elementFromPoint(box.right - 1, (box.top + box.bottom) / 2) : document.elementFromPoint((box.right + box.left) / 2, box.bottom - 1);
                if (elt != bar)
                    bar.style.pointerEvents = 'none';
                else
                    delay.set(1000, maybeDisable);
            }
            delay.set(1000, maybeDisable);
        }
        clear() {
            let parent = this.horiz.parentNode;
            parent.removeChild(this.horiz);
            parent.removeChild(this.vert);
        }
    }
    class NullScrollbars {
        update() {
            return {
                bottom: 0,
                right: 0
            };
        }
        setScrollLeft() {
        }
        setScrollTop() {
        }
        clear() {
        }
    }
    function updateScrollbars(cm, measure) {
        if (!measure)
            measure = measureForScrollbars(cm);
        let startWidth = cm.display.barWidth, startHeight = cm.display.barHeight;
        updateScrollbarsInner(cm, measure);
        for (let i = 0; i < 4 && startWidth != cm.display.barWidth || startHeight != cm.display.barHeight; i++) {
            if (startWidth != cm.display.barWidth && cm.options.lineWrapping)
                update_lines.updateHeightsInViewport(cm);
            updateScrollbarsInner(cm, measureForScrollbars(cm));
            startWidth = cm.display.barWidth;
            startHeight = cm.display.barHeight;
        }
    }
    function updateScrollbarsInner(cm, measure) {
        let d = cm.display;
        let sizes = d.scrollbars.update(measure);
        d.sizer.style.paddingRight = (d.barWidth = sizes.right) + 'px';
        d.sizer.style.paddingBottom = (d.barHeight = sizes.bottom) + 'px';
        d.heightForcer.style.borderBottom = sizes.bottom + 'px solid transparent';
        if (sizes.right && sizes.bottom) {
            d.scrollbarFiller.style.display = 'block';
            d.scrollbarFiller.style.height = sizes.bottom + 'px';
            d.scrollbarFiller.style.width = sizes.right + 'px';
        } else
            d.scrollbarFiller.style.display = '';
        if (sizes.bottom && cm.options.coverGutterNextToScrollbar && cm.options.fixedGutter) {
            d.gutterFiller.style.display = 'block';
            d.gutterFiller.style.height = sizes.bottom + 'px';
            d.gutterFiller.style.width = measure.gutterWidth + 'px';
        } else
            d.gutterFiller.style.display = '';
    }
    let scrollbarModel = {
        'native': NativeScrollbars,
        'null': NullScrollbars
    };
    function initScrollbars(cm) {
        if (cm.display.scrollbars) {
            cm.display.scrollbars.clear();
            if (cm.display.scrollbars.undefined)
                dom.rmClass(cm.display.wrapper, cm.display.scrollbars.undefined);
        }
        cm.display.scrollbars = new scrollbarModel[cm.options.scrollbarStyle](node => {
            cm.display.wrapper.insertBefore(node, cm.display.scrollbarFiller);
            event.on(node, 'mousedown', () => {
                if (cm.state.focused)
                    setTimeout(() => cm.display.input.focus(), 0);
            });
            node.setAttribute('cm-not-content', 'true');
        }, (pos, axis) => {
            if (axis == 'horizontal')
                scrolling.setScrollLeft(cm, pos);
            else
                scrolling.updateScrollTop(cm, pos);
        }, cm);
        if (cm.display.scrollbars.undefined)
            dom.addClass(cm.display.wrapper, cm.display.scrollbars.undefined);
    }
    return {
        measureForScrollbars: measureForScrollbars,
        updateScrollbars: updateScrollbars,
        scrollbarModel: scrollbarModel,
        initScrollbars: initScrollbars
    };
});