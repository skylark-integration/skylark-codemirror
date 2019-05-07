define([
    './deleteNearSelection',
    './commands',
    '../model/document_data',
    '../util/dom',
    '../util/event',
    '../line/highlight',
    '../input/indent',
    '../input/input',
    './key_events',
    './mouse_events',
    '../input/keymap',
    '../input/movement',
    '../display/operations',
    '../line/pos',
    '../measurement/position_measurement',
    '../model/selection',
    '../model/selection_updates',
    '../display/scrolling',
    '../line/spans',
    '../display/update_display',
    '../util/misc',
    '../util/operation_group',
    '../line/utils_line',
    '../display/view_tracking'
], function (a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x) {
    'use strict';
    return function (CodeMirror) {
        let optionHandlers = CodeMirror.optionHandlers;
        let helpers = CodeMirror.helpers = {};
        CodeMirror.prototype = {
            constructor: CodeMirror,
            focus: function () {
                window.focus();
                this.display.input.focus();
            },
            setOption: function (option, value) {
                let options = this.options, old = options[option];
                if (options[option] == value && option != 'mode')
                    return;
                options[option] = value;
                if (optionHandlers.hasOwnProperty(option))
                    m.operation(this, optionHandlers[option])(this, value, old);
                e.signal(this, 'optionChange', this, option);
            },
            getOption: function (option) {
                return this.options[option];
            },
            getDoc: function () {
                return this.doc;
            },
            addKeyMap: function (map, bottom) {
                this.state.keyMaps[bottom ? 'push' : 'unshift'](k.getKeyMap(map));
            },
            removeKeyMap: function (map) {
                let maps = this.state.keyMaps;
                for (let i = 0; i < maps.length; ++i)
                    if (maps[i] == map || maps[i].name == map) {
                        maps.splice(i, 1);
                        return true;
                    }
            },
            addOverlay: m.methodOp(function (spec, options) {
                let mode = spec.token ? spec : CodeMirror.getMode(this.options, spec);
                if (mode.startState)
                    throw new Error('Overlays may not be stateful.');
                u.insertSorted(this.state.overlays, {
                    mode: mode,
                    modeSpec: spec,
                    opaque: options && options.opaque,
                    priority: options && options.priority || 0
                }, overlay => overlay.priority);
                this.state.modeGen++;
                x.regChange(this);
            }),
            removeOverlay: m.methodOp(function (spec) {
                let overlays = this.state.overlays;
                for (let i = 0; i < overlays.length; ++i) {
                    let cur = overlays[i].modeSpec;
                    if (cur == spec || typeof spec == 'string' && cur.name == spec) {
                        overlays.splice(i, 1);
                        this.state.modeGen++;
                        x.regChange(this);
                        return;
                    }
                }
            }),
            indentLine: m.methodOp(function (n, dir, aggressive) {
                if (typeof dir != 'string' && typeof dir != 'number') {
                    if (dir == null)
                        dir = this.options.smartIndent ? 'smart' : 'prev';
                    else
                        dir = dir ? 'add' : 'subtract';
                }
                if (w.isLine(this.doc, n))
                    g.indentLine(this, n, dir, aggressive);
            }),
            indentSelection: m.methodOp(function (how) {
                let ranges = this.doc.sel.ranges, end = -1;
                for (let i = 0; i < ranges.length; i++) {
                    let range = ranges[i];
                    if (!range.empty()) {
                        let from = range.from(), to = range.to();
                        let start = Math.max(end, from.line);
                        end = Math.min(this.lastLine(), to.line - (to.ch ? 0 : 1)) + 1;
                        for (let j = start; j < end; ++j)
                            g.indentLine(this, j, how);
                        let newRanges = this.doc.sel.ranges;
                        if (from.ch == 0 && ranges.length == newRanges.length && newRanges[i].from().ch > 0)
                            q.replaceOneSelection(this.doc, i, new p.Range(from, newRanges[i].to()), u.sel_dontScroll);
                    } else if (range.head.line > end) {
                        g.indentLine(this, range.head.line, how, true);
                        end = range.head.line;
                        if (i == this.doc.sel.primIndex)
                            r.ensureCursorVisible(this);
                    }
                }
            }),
            getTokenAt: function (pos, precise) {
                return f.takeToken(this, pos, precise);
            },
            getLineTokens: function (line, precise) {
                return f.takeToken(this, n.Pos(line), precise, true);
            },
            getTokenTypeAt: function (pos) {
                pos = n.clipPos(this.doc, pos);
                let styles = f.getLineStyles(this, w.getLine(this.doc, pos.line));
                let before = 0, after = (styles.length - 1) / 2, ch = pos.ch;
                let type;
                if (ch == 0)
                    type = styles[2];
                else
                    for (;;) {
                        let mid = before + after >> 1;
                        if ((mid ? styles[mid * 2 - 1] : 0) >= ch)
                            after = mid;
                        else if (styles[mid * 2 + 1] < ch)
                            before = mid + 1;
                        else {
                            type = styles[mid * 2 + 2];
                            break;
                        }
                    }
                let cut = type ? type.indexOf('overlay ') : -1;
                return cut < 0 ? type : cut == 0 ? null : type.slice(0, cut - 1);
            },
            getModeAt: function (pos) {
                let mode = this.doc.mode;
                if (!mode.innerMode)
                    return mode;
                return CodeMirror.innerMode(mode, this.getTokenAt(pos).state).mode;
            },
            getHelper: function (pos, type) {
                return this.getHelpers(pos, type)[0];
            },
            getHelpers: function (pos, type) {
                let found = [];
                if (!helpers.hasOwnProperty(type))
                    return found;
                let help = helpers[type], mode = this.getModeAt(pos);
                if (typeof mode[type] == 'string') {
                    if (help[mode[type]])
                        found.push(help[mode[type]]);
                } else if (mode[type]) {
                    for (let i = 0; i < mode[type].length; i++) {
                        let val = help[mode[type][i]];
                        if (val)
                            found.push(val);
                    }
                } else if (mode.helperType && help[mode.helperType]) {
                    found.push(help[mode.helperType]);
                } else if (help[mode.name]) {
                    found.push(help[mode.name]);
                }
                for (let i = 0; i < help._global.length; i++) {
                    let cur = help._global[i];
                    if (cur.pred(mode, this) && u.indexOf(found, cur.val) == -1)
                        found.push(cur.val);
                }
                return found;
            },
            getStateAfter: function (line, precise) {
                let doc = this.doc;
                line = n.clipLine(doc, line == null ? doc.first + doc.size - 1 : line);
                return f.getContextBefore(this, line + 1, precise).state;
            },
            cursorCoords: function (start, mode) {
                let pos, range = this.doc.sel.primary();
                if (start == null)
                    pos = range.head;
                else if (typeof start == 'object')
                    pos = n.clipPos(this.doc, start);
                else
                    pos = start ? range.from() : range.to();
                return o.cursorCoords(this, pos, mode || 'page');
            },
            charCoords: function (pos, mode) {
                return o.charCoords(this, n.clipPos(this.doc, pos), mode || 'page');
            },
            coordsChar: function (coords, mode) {
                coords = o.fromCoordSystem(this, coords, mode || 'page');
                return o.coordsChar(this, coords.left, coords.top);
            },
            lineAtHeight: function (height, mode) {
                height = o.fromCoordSystem(this, {
                    top: height,
                    left: 0
                }, mode || 'page').top;
                return w.lineAtHeight(this.doc, height + this.display.viewOffset);
            },
            heightAtLine: function (line, mode, includeWidgets) {
                let end = false, lineObj;
                if (typeof line == 'number') {
                    let last = this.doc.first + this.doc.size - 1;
                    if (line < this.doc.first)
                        line = this.doc.first;
                    else if (line > last) {
                        line = last;
                        end = true;
                    }
                    lineObj = w.getLine(this.doc, line);
                } else {
                    lineObj = line;
                }
                return o.intoCoordSystem(this, lineObj, {
                    top: 0,
                    left: 0
                }, mode || 'page', includeWidgets || end).top + (end ? this.doc.height - s.heightAtLine(lineObj) : 0);
            },
            defaultTextHeight: function () {
                return o.textHeight(this.display);
            },
            defaultCharWidth: function () {
                return o.charWidth(this.display);
            },
            getViewport: function () {
                return {
                    from: this.display.viewFrom,
                    to: this.display.viewTo
                };
            },
            addWidget: function (pos, node, scroll, vert, horiz) {
                let display = this.display;
                pos = o.cursorCoords(this, n.clipPos(this.doc, pos));
                let top = pos.bottom, left = pos.left;
                node.style.position = 'absolute';
                node.setAttribute('cm-ignore-events', 'true');
                this.display.input.setUneditable(node);
                display.sizer.appendChild(node);
                if (vert == 'over') {
                    top = pos.top;
                } else if (vert == 'above' || vert == 'near') {
                    let vspace = Math.max(display.wrapper.clientHeight, this.doc.height), hspace = Math.max(display.sizer.clientWidth, display.lineSpace.clientWidth);
                    if ((vert == 'above' || pos.bottom + node.offsetHeight > vspace) && pos.top > node.offsetHeight)
                        top = pos.top - node.offsetHeight;
                    else if (pos.bottom + node.offsetHeight <= vspace)
                        top = pos.bottom;
                    if (left + node.offsetWidth > hspace)
                        left = hspace - node.offsetWidth;
                }
                node.style.top = top + 'px';
                node.style.left = node.style.right = '';
                if (horiz == 'right') {
                    left = display.sizer.clientWidth - node.offsetWidth;
                    node.style.right = '0px';
                } else {
                    if (horiz == 'left')
                        left = 0;
                    else if (horiz == 'middle')
                        left = (display.sizer.clientWidth - node.offsetWidth) / 2;
                    node.style.left = left + 'px';
                }
                if (scroll)
                    r.scrollIntoView(this, {
                        left,
                        top,
                        right: left + node.offsetWidth,
                        bottom: top + node.offsetHeight
                    });
            },
            triggerOnKeyDown: m.methodOp(i.onKeyDown),
            triggerOnKeyPress: m.methodOp(i.onKeyPress),
            triggerOnKeyUp: i.onKeyUp,
            triggerOnMouseDown: m.methodOp(j.onMouseDown),
            execCommand: function (cmd) {
                if (b.commands.hasOwnProperty(cmd))
                    return b.commands[cmd].call(null, this);
            },
            triggerElectric: m.methodOp(function (text) {
                h.triggerElectric(this, text);
            }),
            findPosH: function (from, amount, unit, visually) {
                let dir = 1;
                if (amount < 0) {
                    dir = -1;
                    amount = -amount;
                }
                let cur = n.clipPos(this.doc, from);
                for (let i = 0; i < amount; ++i) {
                    cur = findPosH(this.doc, cur, dir, unit, visually);
                    if (cur.hitSide)
                        break;
                }
                return cur;
            },
            moveH: m.methodOp(function (dir, unit) {
                this.extendSelectionsBy(range => {
                    if (this.display.shift || this.doc.extend || range.empty())
                        return findPosH(this.doc, range.head, dir, unit, this.options.rtlMoveVisually);
                    else
                        return dir < 0 ? range.from() : range.to();
                }, u.sel_move);
            }),
            deleteH: m.methodOp(function (dir, unit) {
                let sel = this.doc.sel, doc = this.doc;
                if (sel.somethingSelected())
                    doc.replaceSelection('', null, '+delete');
                else
                    a.deleteNearSelection(this, range => {
                        let other = findPosH(doc, range.head, dir, unit, false);
                        return dir < 0 ? {
                            from: other,
                            to: range.head
                        } : {
                            from: range.head,
                            to: other
                        };
                    });
            }),
            findPosV: function (from, amount, unit, goalColumn) {
                let dir = 1, x = goalColumn;
                if (amount < 0) {
                    dir = -1;
                    amount = -amount;
                }
                let cur = n.clipPos(this.doc, from);
                for (let i = 0; i < amount; ++i) {
                    let coords = o.cursorCoords(this, cur, 'div');
                    if (x == null)
                        x = coords.left;
                    else
                        coords.left = x;
                    cur = findPosV(this, coords, dir, unit);
                    if (cur.hitSide)
                        break;
                }
                return cur;
            },
            moveV: m.methodOp(function (dir, unit) {
                let doc = this.doc, goals = [];
                let collapse = !this.display.shift && !doc.extend && doc.sel.somethingSelected();
                doc.extendSelectionsBy(range => {
                    if (collapse)
                        return dir < 0 ? range.from() : range.to();
                    let headPos = o.cursorCoords(this, range.head, 'div');
                    if (range.goalColumn != null)
                        headPos.left = range.goalColumn;
                    goals.push(headPos.left);
                    let pos = findPosV(this, headPos, dir, unit);
                    if (unit == 'page' && range == doc.sel.primary())
                        r.addToScrollTop(this, o.charCoords(this, pos, 'div').top - headPos.top);
                    return pos;
                }, u.sel_move);
                if (goals.length)
                    for (let i = 0; i < doc.sel.ranges.length; i++)
                        doc.sel.ranges[i].goalColumn = goals[i];
            }),
            findWordAt: function (pos) {
                let doc = this.doc, line = w.getLine(doc, pos.line).text;
                let start = pos.ch, end = pos.ch;
                if (line) {
                    let helper = this.getHelper(pos, 'wordChars');
                    if ((pos.sticky == 'before' || end == line.length) && start)
                        --start;
                    else
                        ++end;
                    let startChar = line.charAt(start);
                    let check = u.isWordChar(startChar, helper) ? ch => u.isWordChar(ch, helper) : /\s/.test(startChar) ? ch => /\s/.test(ch) : ch => !/\s/.test(ch) && !u.isWordChar(ch);
                    while (start > 0 && check(line.charAt(start - 1)))
                        --start;
                    while (end < line.length && check(line.charAt(end)))
                        ++end;
                }
                return new p.Range(n.Pos(pos.line, start), n.Pos(pos.line, end));
            },
            toggleOverwrite: function (value) {
                if (value != null && value == this.state.overwrite)
                    return;
                if (this.state.overwrite = !this.state.overwrite)
                    d.addClass(this.display.cursorDiv, 'CodeMirror-overwrite');
                else
                    d.rmClass(this.display.cursorDiv, 'CodeMirror-overwrite');
                e.signal(this, 'overwriteToggle', this, this.state.overwrite);
            },
            hasFocus: function () {
                return this.display.input.getField() == d.activeElt();
            },
            isReadOnly: function () {
                return !!(this.options.readOnly || this.doc.cantEdit);
            },
            scrollTo: m.methodOp(function (x, y) {
                r.scrollToCoords(this, x, y);
            }),
            getScrollInfo: function () {
                let scroller = this.display.scroller;
                return {
                    left: scroller.scrollLeft,
                    top: scroller.scrollTop,
                    height: scroller.scrollHeight - o.scrollGap(this) - this.display.barHeight,
                    width: scroller.scrollWidth - o.scrollGap(this) - this.display.barWidth,
                    clientHeight: o.displayHeight(this),
                    clientWidth: o.displayWidth(this)
                };
            },
            scrollIntoView: m.methodOp(function (range, margin) {
                if (range == null) {
                    range = {
                        from: this.doc.sel.primary().head,
                        to: null
                    };
                    if (margin == null)
                        margin = this.options.cursorScrollMargin;
                } else if (typeof range == 'number') {
                    range = {
                        from: n.Pos(range, 0),
                        to: null
                    };
                } else if (range.from == null) {
                    range = {
                        from: range,
                        to: null
                    };
                }
                if (!range.to)
                    range.to = range.from;
                range.margin = margin || 0;
                if (range.from.line != null) {
                    r.scrollToRange(this, range);
                } else {
                    r.scrollToCoordsRange(this, range.from, range.to, range.margin);
                }
            }),
            setSize: m.methodOp(function (width, height) {
                let interpret = val => typeof val == 'number' || /^\d+$/.test(String(val)) ? val + 'px' : val;
                if (width != null)
                    this.display.wrapper.style.width = interpret(width);
                if (height != null)
                    this.display.wrapper.style.height = interpret(height);
                if (this.options.lineWrapping)
                    o.clearLineMeasurementCache(this);
                let lineNo = this.display.viewFrom;
                this.doc.iter(lineNo, this.display.viewTo, line => {
                    if (line.widgets)
                        for (let i = 0; i < line.widgets.length; i++)
                            if (line.widgets[i].noHScroll) {
                                x.regLineChange(this, lineNo, 'widget');
                                break;
                            }
                    ++lineNo;
                });
                this.curOp.forceUpdate = true;
                e.signal(this, 'refresh', this);
            }),
            operation: function (f) {
                return m.runInOp(this, f);
            },
            startOperation: function () {
                return m.startOperation(this);
            },
            endOperation: function () {
                return m.endOperation(this);
            },
            refresh: m.methodOp(function () {
                let oldHeight = this.display.cachedTextHeight;
                x.regChange(this);
                this.curOp.forceUpdate = true;
                o.clearCaches(this);
                r.scrollToCoords(this, this.doc.scrollLeft, this.doc.scrollTop);
                t.updateGutterSpace(this);
                if (oldHeight == null || Math.abs(oldHeight - o.textHeight(this.display)) > 0.5)
                    o.estimateLineHeights(this);
                e.signal(this, 'refresh', this);
            }),
            swapDoc: m.methodOp(function (doc) {
                let old = this.doc;
                old.cm = null;
                c.attachDoc(this, doc);
                o.clearCaches(this);
                this.display.input.reset();
                r.scrollToCoords(this, doc.scrollLeft, doc.scrollTop);
                this.curOp.forceScroll = true;
                v.signalLater(this, 'swapDoc', this, old);
                return old;
            }),
            phrase: function (phraseText) {
                let phrases = this.options.phrases;
                return phrases && Object.prototype.hasOwnProperty.call(phrases, phraseText) ? phrases[phraseText] : phraseText;
            },
            getInputField: function () {
                return this.display.input.getField();
            },
            getWrapperElement: function () {
                return this.display.wrapper;
            },
            getScrollerElement: function () {
                return this.display.scroller;
            },
            getGutterElement: function () {
                return this.display.gutters;
            }
        };
        e.eventMixin(CodeMirror);
        CodeMirror.registerHelper = function (type, name, value) {
            if (!helpers.hasOwnProperty(type))
                helpers[type] = CodeMirror[type] = { _global: [] };
            helpers[type][name] = value;
        };
        CodeMirror.registerGlobalHelper = function (type, name, predicate, value) {
            CodeMirror.registerHelper(type, name, value);
            helpers[type]._global.push({
                pred: predicate,
                val: value
            });
        };
    };
    function findPosH(doc, pos, dir, unit, visually) {
        let oldPos = pos;
        let origDir = dir;
        let lineObj = w.getLine(doc, pos.line);
        function findNextLine() {
            let l = pos.line + dir;
            if (l < doc.first || l >= doc.first + doc.size)
                return false;
            pos = new n.Pos(l, pos.ch, pos.sticky);
            return lineObj = w.getLine(doc, l);
        }
        function moveOnce(boundToLine) {
            let next;
            if (visually) {
                next = l.moveVisually(doc.cm, lineObj, pos, dir);
            } else {
                next = l.moveLogically(lineObj, pos, dir);
            }
            if (next == null) {
                if (!boundToLine && findNextLine())
                    pos = l.endOfLine(visually, doc.cm, lineObj, pos.line, dir);
                else
                    return false;
            } else {
                pos = next;
            }
            return true;
        }
        if (unit == 'char') {
            moveOnce();
        } else if (unit == 'column') {
            moveOnce(true);
        } else if (unit == 'word' || unit == 'group') {
            let sawType = null, group = unit == 'group';
            let helper = doc.cm && doc.cm.getHelper(pos, 'wordChars');
            for (let first = true;; first = false) {
                if (dir < 0 && !moveOnce(!first))
                    break;
                let cur = lineObj.text.charAt(pos.ch) || '\n';
                let type = u.isWordChar(cur, helper) ? 'w' : group && cur == '\n' ? 'n' : !group || /\s/.test(cur) ? null : 'p';
                if (group && !first && !type)
                    type = 's';
                if (sawType && sawType != type) {
                    if (dir < 0) {
                        dir = 1;
                        moveOnce();
                        pos.sticky = 'after';
                    }
                    break;
                }
                if (type)
                    sawType = type;
                if (dir > 0 && !moveOnce(!first))
                    break;
            }
        }
        let result = q.skipAtomic(doc, pos, oldPos, origDir, true);
        if (n.equalCursorPos(oldPos, result))
            result.hitSide = true;
        return result;
    }
    function findPosV(cm, pos, dir, unit) {
        let doc = cm.doc, x = pos.left, y;
        if (unit == 'page') {
            let pageSize = Math.min(cm.display.wrapper.clientHeight, window.innerHeight || document.documentElement.clientHeight);
            let moveAmount = Math.max(pageSize - 0.5 * o.textHeight(cm.display), 3);
            y = (dir > 0 ? pos.bottom : pos.top) + dir * moveAmount;
        } else if (unit == 'line') {
            y = dir > 0 ? pos.bottom + 3 : pos.top - 3;
        }
        let target;
        for (;;) {
            target = o.coordsChar(cm, x, y);
            if (!target.outside)
                break;
            if (dir < 0 ? y <= 0 : y >= doc.height) {
                target.hitSide = true;
                break;
            }
            y += dir * 5;
        }
        return target;
    }
});