define([
    '../display/Display',
    '../display/focus',
    '../display/gutters',
    '../display/line_numbers',
    '../display/operations',
    '../display/scrollbars',
    '../display/scroll_events',
    '../display/scrolling',
    '../line/pos',
    '../measurement/position_measurement',
    '../measurement/widgets',
    '../model/Doc',
    '../model/document_data',
    '../model/selection',
    '../model/selection_updates',
    '../util/browser',
    '../util/event',
    '../util/misc',
    './drop_events',
    './global_events',
    './key_events',
    './mouse_events',
    './utils',
    './options'
], function (m_display, focuses, gutters, line_numbers, operations, scrollbars, scroll_events, scrolling, line_pos, position_measurement, widgets, Doc, document_data, selection, selection_updates, browser, events, misc, drop_events, global_events, key_events, mouse_events, utils, m_options) {
    'use strict';
    function CodeMirror(place, options) {
        if (!(this instanceof CodeMirror))
            return new CodeMirror(place, options);
        this.options = options = options ? misc.copyObj(options) : {};
        misc.copyObj(m_options.defaults, options, false);
        gutters.setGuttersForLineNumbers(options);
        let doc = options.value;
        if (typeof doc == 'string')
            doc = new Doc(doc, options.mode, null, options.lineSeparator, options.direction);
        else if (options.mode)
            doc.modeOption = options.mode;
        this.doc = doc;
        let input = new CodeMirror.inputStyles[options.inputStyle](this);
        let display = this.display = new m_display.Display(place, doc, input);
        display.wrapper.CodeMirror = this;
        gutters.updateGutters(this);
        utils.themeChanged(this);
        if (options.lineWrapping)
            this.display.wrapper.className += ' CodeMirror-wrap';
        scrollbars.initScrollbars(this);
        this.state = {
            keyMaps: [],
            overlays: [],
            modeGen: 0,
            overwrite: false,
            delayingBlurEvent: false,
            focused: false,
            suppressEdits: false,
            pasteIncoming: -1,
            cutIncoming: -1,
            selectingText: false,
            draggingText: false,
            highlight: new misc.Delayed(),
            keySeq: null,
            specialChars: null
        };
        if (options.autofocus && !browser.mobile)
            display.input.focus();
        if (browser.ie && browser.ie_version < 11)
            setTimeout(() => this.display.input.reset(true), 20);
        registerEventHandlers(this);
        global_events.ensureGlobalHandlers();
        operations.startOperation(this);
        this.curOp.forceUpdate = true;
        document_data.attachDoc(this, doc);
        if (options.autofocus && !browser.mobile || this.hasFocus())
            setTimeout(misc.bind(focuses.onFocus, this), 20);
        else
            focuses.onBlur(this);
        for (let opt in m_options.optionHandlers)
            if (m_options.optionHandlers.hasOwnProperty(opt))
                m_options.optionHandlers[opt](this, options[opt], m_options.Init);
        line_numbers.maybeUpdateLineNumberWidth(this);
        if (options.finishInit)
            options.finishInit(this);
        for (let i = 0; i < initHooks.length; ++i)
            initHooks[i](this);
        operations.endOperation(this);
        if (browser.webkit && options.lineWrapping && getComputedStyle(display.lineDiv).textRendering == 'optimizelegibility')
            display.lineDiv.style.textRendering = 'auto';
    }
    
    CodeMirror.defaults = m_options.defaults;
    CodeMirror.optionHandlers = m_options.optionHandlers;

    function registerEventHandlers(cm) {
        let d = cm.display;
        events.on(d.scroller, 'mousedown', operations.operation(cm, mouse_events.onMouseDown));
        if (browser.ie && browser.ie_version < 11)
            events.on(d.scroller, 'dblclick', operations.operation(cm, e => {
                if (events.signalDOMEvent(cm, e))
                    return;
                let pos = position_measurement.posFromMouse(cm, e);
                if (!pos || mouse_events.clickInGutter(cm, e) || widgets.eventInWidget(cm.display, e))
                    return;
                events.e_preventDefault(e);
                let word = cm.findWordAt(pos);
                selection_updates.extendSelection(cm.doc, word.anchor, word.head);
            }));
        else
            events.on(d.scroller, 'dblclick', e => events.signalDOMEvent(cm, e) || events.e_preventDefault(e));
        events.on(d.scroller, 'contextmenu', e => mouse_events.onContextMenu(cm, e));
        let touchFinished, prevTouch = { end: 0 };
        function finishTouch() {
            if (d.activeTouch) {
                touchFinished = setTimeout(() => d.activeTouch = null, 1000);
                prevTouch = d.activeTouch;
                prevTouch.end = +new Date();
            }
        }
        function isMouseLikeTouchEvent(e) {
            if (e.touches.length != 1)
                return false;
            let touch = e.touches[0];
            return touch.radiusX <= 1 && touch.radiusY <= 1;
        }
        function farAway(touch, other) {
            if (other.left == null)
                return true;
            let dx = other.left - touch.left, dy = other.top - touch.top;
            return dx * dx + dy * dy > 20 * 20;
        }
        events.on(d.scroller, 'touchstart', e => {
            if (!events.signalDOMEvent(cm, e) && !isMouseLikeTouchEvent(e) && !mouse_events.clickInGutter(cm, e)) {
                d.input.ensurePolled();
                clearTimeout(touchFinished);
                let now = +new Date();
                d.activeTouch = {
                    start: now,
                    moved: false,
                    prev: now - prevTouch.end <= 300 ? prevTouch : null
                };
                if (e.touches.length == 1) {
                    d.activeTouch.left = e.touches[0].pageX;
                    d.activeTouch.top = e.touches[0].pageY;
                }
            }
        });
        events.on(d.scroller, 'touchmove', () => {
            if (d.activeTouch)
                d.activeTouch.moved = true;
        });
        events.on(d.scroller, 'touchend', e => {
            let touch = d.activeTouch;
            if (touch && !widgets.eventInWidget(d, e) && touch.left != null && !touch.moved && new Date() - touch.start < 300) {
                let pos = cm.coordsChar(d.activeTouch, 'page'), range;
                if (!touch.prev || farAway(touch, touch.prev))
                    range = new selection.Range(pos, pos);
                else if (!touch.prev.prev || farAway(touch, touch.prev.prev))
                    range = cm.findWordAt(pos);
                else
                    range = new selection.Range(line_pos.Pos(pos.line, 0), line_pos.clipPos(cm.doc, line_pos.Pos(pos.line + 1, 0)));
                cm.setSelection(range.anchor, range.head);
                cm.focus();
                events.e_preventDefault(e);
            }
            finishTouch();
        });
        events.on(d.scroller, 'touchcancel', finishTouch);
        events.on(d.scroller, 'scroll', () => {
            if (d.scroller.clientHeight) {
                scrolling.updateScrollTop(cm, d.scroller.scrollTop);
                scrolling.setScrollLeft(cm, d.scroller.scrollLeft, true);
                events.signal(cm, 'scroll', cm);
            }
        });
        events.on(d.scroller, 'mousewheel', e => scroll_events.onScrollWheel(cm, e));
        events.on(d.scroller, 'DOMMouseScroll', e => scroll_events.onScrollWheel(cm, e));
        events.on(d.wrapper, 'scroll', () => d.wrapper.scrollTop = d.wrapper.scrollLeft = 0);
        d.dragFunctions = {
            enter: e => {
                if (!events.signalDOMEvent(cm, e))
                    events.e_stop(e);
            },
            over: e => {
                if (!events.signalDOMEvent(cm, e)) {
                    drop_events.onDragOver(cm, e);
                    events.e_stop(e);
                }
            },
            start: e => drop_events.onDragStart(cm, e),
            drop: operations.operation(cm, drop_events.onDrop),
            leave: e => {
                if (!events.signalDOMEvent(cm, e)) {
                    drop_events.clearDragCursor(cm);
                }
            }
        };
        let inp = d.input.getField();
        events.on(inp, 'keyup', e => key_events.onKeyUp.call(cm, e));
        events.on(inp, 'keydown', operations.operation(cm, key_events.onKeyDown));
        events.on(inp, 'keypress', operations.operation(cm, key_events.onKeyPress));
        events.on(inp, 'focus', e => focuses.onFocus(cm, e));
        events.on(inp, 'blur', e => focuses.onBlur(cm, e));
    }
    let initHooks = [];
    CodeMirror.defineInitHook = f => initHooks.push(f);

    return CodeMirror;
});