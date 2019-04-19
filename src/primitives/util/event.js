define([
    './browser',
    './misc'
], function (a, b) {
    'use strict';
    const noHandlers = [];
    let on = function (emitter, type, f) {
        if (emitter.addEventListener) {
            emitter.addEventListener(type, f, false);
        } else if (emitter.attachEvent) {
            emitter.attachEvent('on' + type, f);
        } else {
            let map = emitter._handlers || (emitter._handlers = {});
            map[type] = (map[type] || noHandlers).concat(f);
        }
    };
    function getHandlers(emitter, type) {
        return emitter._handlers && emitter._handlers[type] || noHandlers;
    }
    function off(emitter, type, f) {
        if (emitter.removeEventListener) {
            emitter.removeEventListener(type, f, false);
        } else if (emitter.detachEvent) {
            emitter.detachEvent('on' + type, f);
        } else {
            let map = emitter._handlers, arr = map && map[type];
            if (arr) {
                let index = b.indexOf(arr, f);
                if (index > -1)
                    map[type] = arr.slice(0, index).concat(arr.slice(index + 1));
            }
        }
    }
    function signal(emitter, type) {
        let handlers = getHandlers(emitter, type);
        if (!handlers.length)
            return;
        let args = Array.prototype.slice.call(arguments, 2);
        for (let i = 0; i < handlers.length; ++i)
            handlers[i].apply(null, args);
    }
    function signalDOMEvent(cm, e, override) {
        if (typeof e == 'string')
            e = {
                type: e,
                preventDefault: function () {
                    this.defaultPrevented = true;
                }
            };
        signal(cm, override || e.type, cm, e);
        return e_defaultPrevented(e) || e.codemirrorIgnore;
    }
    function signalCursorActivity(cm) {
        let arr = cm._handlers && cm._handlers.cursorActivity;
        if (!arr)
            return;
        let set = cm.curOp.cursorActivityHandlers || (cm.curOp.cursorActivityHandlers = []);
        for (let i = 0; i < arr.length; ++i)
            if (b.indexOf(set, arr[i]) == -1)
                set.push(arr[i]);
    }
    function hasHandler(emitter, type) {
        return getHandlers(emitter, type).length > 0;
    }
    function eventMixin(ctor) {
        ctor.prototype.on = function (type, f) {
            on(this, type, f);
        };
        ctor.prototype.off = function (type, f) {
            off(this, type, f);
        };
    }
    function e_preventDefault(e) {
        if (e.preventDefault)
            e.preventDefault();
        else
            e.returnValue = false;
    }
    function e_stopPropagation(e) {
        if (e.stopPropagation)
            e.stopPropagation();
        else
            e.cancelBubble = true;
    }
    function e_defaultPrevented(e) {
        return e.defaultPrevented != null ? e.defaultPrevented : e.returnValue == false;
    }
    function e_stop(e) {
        e_preventDefault(e);
        e_stopPropagation(e);
    }
    function e_target(e) {
        return e.target || e.srcElement;
    }
    function e_button(e) {
        let b = e.which;
        if (b == null) {
            if (e.button & 1)
                b = 1;
            else if (e.button & 2)
                b = 3;
            else if (e.button & 4)
                b = 2;
        }
        if (a.mac && e.ctrlKey && b == 1)
            b = 3;
        return b;
    }
    return {
        on: on,
        getHandlers: getHandlers,
        off: off,
        signal: signal,
        signalDOMEvent: signalDOMEvent,
        signalCursorActivity: signalCursorActivity,
        hasHandler: hasHandler,
        eventMixin: eventMixin,
        e_preventDefault: e_preventDefault,
        e_stopPropagation: e_stopPropagation,
        e_defaultPrevented: e_defaultPrevented,
        e_stop: e_stop,
        e_target: e_target,
        e_button: e_button
    };
});