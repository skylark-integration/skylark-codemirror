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
], function (a, b, c, d, e, f, g, h, i, j, k, Doc, l, m, n, o, p, q, r, s, t, u, v, m_options) {
    'use strict';
    function CodeMirror(place, options) {
        if (!(this instanceof CodeMirror))
            return new CodeMirror(place, options);
        this.options = options = options ? q.copyObj(options) : {};
        q.copyObj(m_options.defaults, options, false);
        c.setGuttersForLineNumbers(options);
        let doc = options.value;
        if (typeof doc == 'string')
            doc = new Doc(doc, options.mode, null, options.lineSeparator, options.direction);
        else if (options.mode)
            doc.modeOption = options.mode;
        this.doc = doc;
        let input = new CodeMirror.inputStyles[options.inputStyle](this);
        let display = this.display = new a.Display(place, doc, input);
        display.wrapper.CodeMirror = this;
        c.updateGutters(this);
        v.themeChanged(this);
        if (options.lineWrapping)
            this.display.wrapper.className += ' CodeMirror-wrap';
        f.initScrollbars(this);
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
            highlight: new q.Delayed(),
            keySeq: null,
            specialChars: null
        };
        if (options.autofocus && !o.mobile)
            display.input.focus();
        if (o.ie && o.ie_version < 11)
            setTimeout(() => this.display.input.reset(true), 20);
        registerEventHandlers(this);
        s.ensureGlobalHandlers();
        e.startOperation(this);
        this.curOp.forceUpdate = true;
        l.attachDoc(this, doc);
        if (options.autofocus && !o.mobile || this.hasFocus())
            setTimeout(q.bind(b.onFocus, this), 20);
        else
            b.onBlur(this);
        for (let opt in m_options.optionHandlers)
            if (m_options.optionHandlers.hasOwnProperty(opt))
                m_options.optionHandlers[opt](this, options[opt], m_options.Init);
        d.maybeUpdateLineNumberWidth(this);
        if (options.finishInit)
            options.finishInit(this);
        for (let i = 0; i < initHooks.length; ++i)
            initHooks[i](this);
        e.endOperation(this);
        if (o.webkit && options.lineWrapping && getComputedStyle(display.lineDiv).textRendering == 'optimizelegibility')
            display.lineDiv.style.textRendering = 'auto';
    }
    
    CodeMirror.defaults = m_options.defaults;
    CodeMirror.optionHandlers = m_options.optionHandlers;

    function registerEventHandlers(cm) {
        let d = cm.display;
        p.on(d.scroller, 'mousedown', e.operation(cm, u.onMouseDown));
        if (o.ie && o.ie_version < 11)
            p.on(d.scroller, 'dblclick', e.operation(cm, e => {
                if (p.signalDOMEvent(cm, e))
                    return;
                let pos = j.posFromMouse(cm, e);
                if (!pos || u.clickInGutter(cm, e) || k.eventInWidget(cm.display, e))
                    return;
                p.e_preventDefault(e);
                let word = cm.findWordAt(pos);
                n.extendSelection(cm.doc, word.anchor, word.head);
            }));
        else
            p.on(d.scroller, 'dblclick', e => p.signalDOMEvent(cm, e) || p.e_preventDefault(e));
        p.on(d.scroller, 'contextmenu', e => u.onContextMenu(cm, e));
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
        p.on(d.scroller, 'touchstart', e => {
            if (!p.signalDOMEvent(cm, e) && !isMouseLikeTouchEvent(e) && !u.clickInGutter(cm, e)) {
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
        p.on(d.scroller, 'touchmove', () => {
            if (d.activeTouch)
                d.activeTouch.moved = true;
        });
        p.on(d.scroller, 'touchend', e => {
            let touch = d.activeTouch;
            if (touch && !k.eventInWidget(d, e) && touch.left != null && !touch.moved && new Date() - touch.start < 300) {
                let pos = cm.coordsChar(d.activeTouch, 'page'), range;
                if (!touch.prev || farAway(touch, touch.prev))
                    range = new m.Range(pos, pos);
                else if (!touch.prev.prev || farAway(touch, touch.prev.prev))
                    range = cm.findWordAt(pos);
                else
                    range = new m.Range(i.Pos(pos.line, 0), i.clipPos(cm.doc, i.Pos(pos.line + 1, 0)));
                cm.setSelection(range.anchor, range.head);
                cm.focus();
                p.e_preventDefault(e);
            }
            finishTouch();
        });
        p.on(d.scroller, 'touchcancel', finishTouch);
        p.on(d.scroller, 'scroll', () => {
            if (d.scroller.clientHeight) {
                h.updateScrollTop(cm, d.scroller.scrollTop);
                h.setScrollLeft(cm, d.scroller.scrollLeft, true);
                p.signal(cm, 'scroll', cm);
            }
        });
        p.on(d.scroller, 'mousewheel', e => g.onScrollWheel(cm, e));
        p.on(d.scroller, 'DOMMouseScroll', e => g.onScrollWheel(cm, e));
        p.on(d.wrapper, 'scroll', () => d.wrapper.scrollTop = d.wrapper.scrollLeft = 0);
        d.dragFunctions = {
            enter: e => {
                if (!p.signalDOMEvent(cm, e))
                    p.e_stop(e);
            },
            over: e => {
                if (!p.signalDOMEvent(cm, e)) {
                    r.onDragOver(cm, e);
                    p.e_stop(e);
                }
            },
            start: e => r.onDragStart(cm, e),
            drop: e.operation(cm, r.onDrop),
            leave: e => {
                if (!p.signalDOMEvent(cm, e)) {
                    r.clearDragCursor(cm);
                }
            }
        };
        let inp = d.input.getField();
        p.on(inp, 'keyup', e => t.onKeyUp.call(cm, e));
        p.on(inp, 'keydown', e.operation(cm, t.onKeyDown));
        p.on(inp, 'keypress', e.operation(cm, t.onKeyPress));
        p.on(inp, 'focus', e => b.onFocus(cm, e));
        p.on(inp, 'blur', e => b.onBlur(cm, e));
    }
    let initHooks = [];
    CodeMirror.defineInitHook = f => initHooks.push(f);

    return CodeMirror;
});