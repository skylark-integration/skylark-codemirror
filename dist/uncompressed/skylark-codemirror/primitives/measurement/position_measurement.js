define([
    '../line/line_data',
    '../line/pos',
    '../line/spans',
    '../line/utils_line',
    '../util/bidi',
    '../util/browser',
    '../util/dom',
    '../util/event',
    '../util/feature_detection',
    '../util/misc',
    '../display/update_line',
    './widgets'
], function (line_data, line_pos, spans, utils_line, bidi, browser, dom, events, feature_detection, misc, update_line, widgets) {
    'use strict';
    function paddingTop(display) {
        return display.lineSpace.offsetTop;
    }
    function paddingVert(display) {
        return display.mover.offsetHeight - display.lineSpace.offsetHeight;
    }
    function paddingH(display) {
        if (display.cachedPaddingH)
            return display.cachedPaddingH;
        let e = dom.removeChildrenAndAdd(display.measure, dom.elt('pre', 'x'));
        let style = window.getComputedStyle ? window.getComputedStyle(e) : e.currentStyle;
        let data = {
            left: parseInt(style.paddingLeft),
            right: parseInt(style.paddingRight)
        };
        if (!isNaN(data.left) && !isNaN(data.right))
            display.cachedPaddingH = data;
        return data;
    }
    function scrollGap(cm) {
        return misc.scrollerGap - cm.display.nativeBarWidth;
    }
    function displayWidth(cm) {
        return cm.display.scroller.clientWidth - scrollGap(cm) - cm.display.barWidth;
    }
    function displayHeight(cm) {
        return cm.display.scroller.clientHeight - scrollGap(cm) - cm.display.barHeight;
    }
    function ensureLineHeights(cm, lineView, rect) {
        let wrapping = cm.options.lineWrapping;
        let curWidth = wrapping && displayWidth(cm);
        if (!lineView.measure.heights || wrapping && lineView.measure.width != curWidth) {
            let heights = lineView.measure.heights = [];
            if (wrapping) {
                lineView.measure.width = curWidth;
                let rects = lineView.text.firstChild.getClientRects();
                for (let i = 0; i < rects.length - 1; i++) {
                    let cur = rects[i], next = rects[i + 1];
                    if (Math.abs(cur.bottom - next.bottom) > 2)
                        heights.push((cur.bottom + next.top) / 2 - rect.top);
                }
            }
            heights.push(rect.bottom - rect.top);
        }
    }
    function mapFromLineView(lineView, line, lineN) {
        if (lineView.line == line)
            return {
                map: lineView.measure.map,
                cache: lineView.measure.cache
            };
        for (let i = 0; i < lineView.rest.length; i++)
            if (lineView.rest[i] == line)
                return {
                    map: lineView.measure.maps[i],
                    cache: lineView.measure.caches[i]
                };
        for (let i = 0; i < lineView.rest.length; i++)
            if (utils_line.lineNo(lineView.rest[i]) > lineN)
                return {
                    map: lineView.measure.maps[i],
                    cache: lineView.measure.caches[i],
                    before: true
                };
    }
    function updateExternalMeasurement(cm, line) {
        line = spans.visualLine(line);
        let lineN = utils_line.lineNo(line);
        let view = cm.display.externalMeasured = new line_data.LineView(cm.doc, line, lineN);
        view.lineN = lineN;
        let built = view.built = line_data.buildLineContent(cm, view);
        view.text = built.pre;
        dom.removeChildrenAndAdd(cm.display.lineMeasure, built.pre);
        return view;
    }
    function measureChar(cm, line, ch, bias) {
        return measureCharPrepared(cm, prepareMeasureForLine(cm, line), ch, bias);
    }
    function findViewForLine(cm, lineN) {
        if (lineN >= cm.display.viewFrom && lineN < cm.display.viewTo)
            return cm.display.view[findViewIndex(cm, lineN)];
        let ext = cm.display.externalMeasured;
        if (ext && lineN >= ext.lineN && lineN < ext.lineN + ext.size)
            return ext;
    }
    function prepareMeasureForLine(cm, line) {
        let lineN = utils_line.lineNo(line);
        let view = findViewForLine(cm, lineN);
        if (view && !view.text) {
            view = null;
        } else if (view && view.changes) {
            update_line.updateLineForChanges(cm, view, lineN, getDimensions(cm));
            cm.curOp.forceUpdate = true;
        }
        if (!view)
            view = updateExternalMeasurement(cm, line);
        let info = mapFromLineView(view, line, lineN);
        return {
            line: line,
            view: view,
            rect: null,
            map: info.map,
            cache: info.cache,
            before: info.before,
            hasHeights: false
        };
    }
    function measureCharPrepared(cm, prepared, ch, bias, varHeight) {
        if (prepared.before)
            ch = -1;
        let key = ch + (bias || ''), found;
        if (prepared.cache.hasOwnProperty(key)) {
            found = prepared.cache[key];
        } else {
            if (!prepared.rect)
                prepared.rect = prepared.view.text.getBoundingClientRect();
            if (!prepared.hasHeights) {
                ensureLineHeights(cm, prepared.view, prepared.rect);
                prepared.hasHeights = true;
            }
            found = measureCharInner(cm, prepared, ch, bias);
            if (!found.bogus)
                prepared.cache[key] = found;
        }
        return {
            left: found.left,
            right: found.right,
            top: varHeight ? found.rtop : found.top,
            bottom: varHeight ? found.rbottom : found.bottom
        };
    }
    let nullRect = {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
    };
    function nodeAndOffsetInLineMap(map, ch, bias) {
        let node, start, end, collapse, mStart, mEnd;
        for (let i = 0; i < map.length; i += 3) {
            mStart = map[i];
            mEnd = map[i + 1];
            if (ch < mStart) {
                start = 0;
                end = 1;
                collapse = 'left';
            } else if (ch < mEnd) {
                start = ch - mStart;
                end = start + 1;
            } else if (i == map.length - 3 || ch == mEnd && map[i + 3] > ch) {
                end = mEnd - mStart;
                start = end - 1;
                if (ch >= mEnd)
                    collapse = 'right';
            }
            if (start != null) {
                node = map[i + 2];
                if (mStart == mEnd && bias == (node.insertLeft ? 'left' : 'right'))
                    collapse = bias;
                if (bias == 'left' && start == 0)
                    while (i && map[i - 2] == map[i - 3] && map[i - 1].insertLeft) {
                        node = map[(i -= 3) + 2];
                        collapse = 'left';
                    }
                if (bias == 'right' && start == mEnd - mStart)
                    while (i < map.length - 3 && map[i + 3] == map[i + 4] && !map[i + 5].insertLeft) {
                        node = map[(i += 3) + 2];
                        collapse = 'right';
                    }
                break;
            }
        }
        return {
            node: node,
            start: start,
            end: end,
            collapse: collapse,
            coverStart: mStart,
            coverEnd: mEnd
        };
    }
    function getUsefulRect(rects, bias) {
        let rect = nullRect;
        if (bias == 'left')
            for (let i = 0; i < rects.length; i++) {
                if ((rect = rects[i]).left != rect.right)
                    break;
            }
        else
            for (let i = rects.length - 1; i >= 0; i--) {
                if ((rect = rects[i]).left != rect.right)
                    break;
            }
        return rect;
    }
    function measureCharInner(cm, prepared, ch, bias) {
        let place = nodeAndOffsetInLineMap(prepared.map, ch, bias);
        let node = place.node, start = place.start, end = place.end, collapse = place.collapse;
        let rect;
        if (node.nodeType == 3) {
            for (let i = 0; i < 4; i++) {
                while (start && misc.isExtendingChar(prepared.line.text.charAt(place.coverStart + start)))
                    --start;
                while (place.coverStart + end < place.coverEnd && misc.isExtendingChar(prepared.line.text.charAt(place.coverStart + end)))
                    ++end;
                if (browser.ie && browser.ie_version < 9 && start == 0 && end == place.coverEnd - place.coverStart)
                    rect = node.parentNode.getBoundingClientRect();
                else
                    rect = getUsefulRect(dom.range(node, start, end).getClientRects(), bias);
                if (rect.left || rect.right || start == 0)
                    break;
                end = start;
                start = start - 1;
                collapse = 'right';
            }
            if (browser.ie && browser.ie_version < 11)
                rect = maybeUpdateRectForZooming(cm.display.measure, rect);
        } else {
            if (start > 0)
                collapse = bias = 'right';
            let rects;
            if (cm.options.lineWrapping && (rects = node.getClientRects()).length > 1)
                rect = rects[bias == 'right' ? rects.length - 1 : 0];
            else
                rect = node.getBoundingClientRect();
        }
        if (browser.ie && browser.ie_version < 9 && !start && (!rect || !rect.left && !rect.right)) {
            let rSpan = node.parentNode.getClientRects()[0];
            if (rSpan)
                rect = {
                    left: rSpan.left,
                    right: rSpan.left + charWidth(cm.display),
                    top: rSpan.top,
                    bottom: rSpan.bottom
                };
            else
                rect = nullRect;
        }
        let rtop = rect.top - prepared.rect.top, rbot = rect.bottom - prepared.rect.top;
        let mid = (rtop + rbot) / 2;
        let heights = prepared.view.measure.heights;
        let i = 0;
        for (; i < heights.length - 1; i++)
            if (mid < heights[i])
                break;
        let top = i ? heights[i - 1] : 0, bot = heights[i];
        let result = {
            left: (collapse == 'right' ? rect.right : rect.left) - prepared.rect.left,
            right: (collapse == 'left' ? rect.left : rect.right) - prepared.rect.left,
            top: top,
            bottom: bot
        };
        if (!rect.left && !rect.right)
            result.bogus = true;
        if (!cm.options.singleCursorHeightPerLine) {
            result.rtop = rtop;
            result.rbottom = rbot;
        }
        return result;
    }
    function maybeUpdateRectForZooming(measure, rect) {
        if (!window.screen || screen.logicalXDPI == null || screen.logicalXDPI == screen.deviceXDPI || !feature_detection.hasBadZoomedRects(measure))
            return rect;
        let scaleX = screen.logicalXDPI / screen.deviceXDPI;
        let scaleY = screen.logicalYDPI / screen.deviceYDPI;
        return {
            left: rect.left * scaleX,
            right: rect.right * scaleX,
            top: rect.top * scaleY,
            bottom: rect.bottom * scaleY
        };
    }
    function clearLineMeasurementCacheFor(lineView) {
        if (lineView.measure) {
            lineView.measure.cache = {};
            lineView.measure.heights = null;
            if (lineView.rest)
                for (let i = 0; i < lineView.rest.length; i++)
                    lineView.measure.caches[i] = {};
        }
    }
    function clearLineMeasurementCache(cm) {
        cm.display.externalMeasure = null;
        dom.removeChildren(cm.display.lineMeasure);
        for (let i = 0; i < cm.display.view.length; i++)
            clearLineMeasurementCacheFor(cm.display.view[i]);
    }
    function clearCaches(cm) {
        clearLineMeasurementCache(cm);
        cm.display.cachedCharWidth = cm.display.cachedTextHeight = cm.display.cachedPaddingH = null;
        if (!cm.options.lineWrapping)
            cm.display.maxLineChanged = true;
        cm.display.lineNumChars = null;
    }
    function pageScrollX() {
        if (browser.chrome && browser.android)
            return -(document.body.getBoundingClientRect().left - parseInt(getComputedStyle(document.body).marginLeft));
        return window.pageXOffset || (document.documentElement || document.body).scrollLeft;
    }
    function pageScrollY() {
        if (browser.chrome && browser.android)
            return -(document.body.getBoundingClientRect().top - parseInt(getComputedStyle(document.body).marginTop));
        return window.pageYOffset || (document.documentElement || document.body).scrollTop;
    }
    function widgetTopHeight(lineObj) {
        let height = 0;
        if (lineObj.widgets)
            for (let i = 0; i < lineObj.widgets.length; ++i)
                if (lineObj.widgets[i].above)
                    height += widgets.widgetHeight(lineObj.widgets[i]);
        return height;
    }
    function intoCoordSystem(cm, lineObj, rect, context, includeWidgets) {
        if (!includeWidgets) {
            let height = widgetTopHeight(lineObj);
            rect.top += height;
            rect.bottom += height;
        }
        if (context == 'line')
            return rect;
        if (!context)
            context = 'local';
        let yOff = spans.heightAtLine(lineObj);
        if (context == 'local')
            yOff += paddingTop(cm.display);
        else
            yOff -= cm.display.viewOffset;
        if (context == 'page' || context == 'window') {
            let lOff = cm.display.lineSpace.getBoundingClientRect();
            yOff += lOff.top + (context == 'window' ? 0 : pageScrollY());
            let xOff = lOff.left + (context == 'window' ? 0 : pageScrollX());
            rect.left += xOff;
            rect.right += xOff;
        }
        rect.top += yOff;
        rect.bottom += yOff;
        return rect;
    }
    function fromCoordSystem(cm, coords, context) {
        if (context == 'div')
            return coords;
        let left = coords.left, top = coords.top;
        if (context == 'page') {
            left -= pageScrollX();
            top -= pageScrollY();
        } else if (context == 'local' || !context) {
            let localBox = cm.display.sizer.getBoundingClientRect();
            left += localBox.left;
            top += localBox.top;
        }
        let lineSpaceBox = cm.display.lineSpace.getBoundingClientRect();
        return {
            left: left - lineSpaceBox.left,
            top: top - lineSpaceBox.top
        };
    }
    function charCoords(cm, pos, context, lineObj, bias) {
        if (!lineObj)
            lineObj = utils_line.getLine(cm.doc, pos.line);
        return intoCoordSystem(cm, lineObj, measureChar(cm, lineObj, pos.ch, bias), context);
    }
    function cursorCoords(cm, pos, context, lineObj, preparedMeasure, varHeight) {
        lineObj = lineObj || utils_line.getLine(cm.doc, pos.line);
        if (!preparedMeasure)
            preparedMeasure = prepareMeasureForLine(cm, lineObj);
        function get(ch, right) {
            let m = measureCharPrepared(cm, preparedMeasure, ch, right ? 'right' : 'left', varHeight);
            if (right)
                m.left = m.right;
            else
                m.right = m.left;
            return intoCoordSystem(cm, lineObj, m, context);
        }
        let order = bidi.getOrder(lineObj, cm.doc.direction), ch = pos.ch, sticky = pos.sticky;
        if (ch >= lineObj.text.length) {
            ch = lineObj.text.length;
            sticky = 'before';
        } else if (ch <= 0) {
            ch = 0;
            sticky = 'after';
        }
        if (!order)
            return get(sticky == 'before' ? ch - 1 : ch, sticky == 'before');
        function getBidi(ch, partPos, invert) {
            let part = order[partPos], right = part.level == 1;
            return get(invert ? ch - 1 : ch, right != invert);
        }
        let partPos = bidi.getBidiPartAt(order, ch, sticky);
        let other = bidi.bidiOther;
        let val = getBidi(ch, partPos, sticky == 'before');
        if (other != null)
            val.other = getBidi(ch, other, sticky != 'before');
        return val;
    }
    function estimateCoords(cm, pos) {
        let left = 0;
        pos = line_pos.clipPos(cm.doc, pos);
        if (!cm.options.lineWrapping)
            left = charWidth(cm.display) * pos.ch;
        let lineObj = utils_line.getLine(cm.doc, pos.line);
        let top = spans.heightAtLine(lineObj) + paddingTop(cm.display);
        return {
            left: left,
            right: left,
            top: top,
            bottom: top + lineObj.height
        };
    }
    function PosWithInfo(line, ch, sticky, outside, xRel) {
        let pos = line_pos.Pos(line, ch, sticky);
        pos.xRel = xRel;
        if (outside)
            pos.outside = true;
        return pos;
    }
    function coordsChar(cm, x, y) {
        let doc = cm.doc;
        y += cm.display.viewOffset;
        if (y < 0)
            return PosWithInfo(doc.first, 0, null, true, -1);
        let lineN = utils_line.lineAtHeight(doc, y), last = doc.first + doc.size - 1;
        if (lineN > last)
            return PosWithInfo(doc.first + doc.size - 1, utils_line.getLine(doc, last).text.length, null, true, 1);
        if (x < 0)
            x = 0;
        let lineObj = utils_line.getLine(doc, lineN);
        for (;;) {
            let found = coordsCharInner(cm, lineObj, lineN, x, y);
            let collapsed = spans.collapsedSpanAround(lineObj, found.ch + (found.xRel > 0 ? 1 : 0));
            if (!collapsed)
                return found;
            let rangeEnd = collapsed.find(1);
            if (rangeEnd.line == lineN)
                return rangeEnd;
            lineObj = utils_line.getLine(doc, lineN = rangeEnd.line);
        }
    }
    function wrappedLineExtent(cm, lineObj, preparedMeasure, y) {
        y -= widgetTopHeight(lineObj);
        let end = lineObj.text.length;
        let begin = misc.findFirst(ch => measureCharPrepared(cm, preparedMeasure, ch - 1).bottom <= y, end, 0);
        end = misc.findFirst(ch => measureCharPrepared(cm, preparedMeasure, ch).top > y, begin, end);
        return {
            begin,
            end
        };
    }
    function wrappedLineExtentChar(cm, lineObj, preparedMeasure, target) {
        if (!preparedMeasure)
            preparedMeasure = prepareMeasureForLine(cm, lineObj);
        let targetTop = intoCoordSystem(cm, lineObj, measureCharPrepared(cm, preparedMeasure, target), 'line').top;
        return wrappedLineExtent(cm, lineObj, preparedMeasure, targetTop);
    }
    function boxIsAfter(box, x, y, left) {
        return box.bottom <= y ? false : box.top > y ? true : (left ? box.left : box.right) > x;
    }
    function coordsCharInner(cm, lineObj, lineNo, x, y) {
        y -= spans.heightAtLine(lineObj);
        let preparedMeasure = prepareMeasureForLine(cm, lineObj);
        let widgetHeight = widgetTopHeight(lineObj);
        let begin = 0, end = lineObj.text.length, ltr = true;
        let order = bidi.getOrder(lineObj, cm.doc.direction);
        if (order) {
            let part = (cm.options.lineWrapping ? coordsBidiPartWrapped : coordsBidiPart)(cm, lineObj, lineNo, preparedMeasure, order, x, y);
            ltr = part.level != 1;
            begin = ltr ? part.from : part.to - 1;
            end = ltr ? part.to : part.from - 1;
        }
        let chAround = null, boxAround = null;
        let ch = misc.findFirst(ch => {
            let box = measureCharPrepared(cm, preparedMeasure, ch);
            box.top += widgetHeight;
            box.bottom += widgetHeight;
            if (!boxIsAfter(box, x, y, false))
                return false;
            if (box.top <= y && box.left <= x) {
                chAround = ch;
                boxAround = box;
            }
            return true;
        }, begin, end);
        let baseX, sticky, outside = false;
        if (boxAround) {
            let atLeft = x - boxAround.left < boxAround.right - x, atStart = atLeft == ltr;
            ch = chAround + (atStart ? 0 : 1);
            sticky = atStart ? 'after' : 'before';
            baseX = atLeft ? boxAround.left : boxAround.right;
        } else {
            if (!ltr && (ch == end || ch == begin))
                ch++;
            sticky = ch == 0 ? 'after' : ch == lineObj.text.length ? 'before' : measureCharPrepared(cm, preparedMeasure, ch - (ltr ? 1 : 0)).bottom + widgets.widgetHeight <= y == ltr ? 'after' : 'before';
            let coords = cursorCoords(cm, line_pos.Pos(lineNo, ch, sticky), 'line', lineObj, preparedMeasure);
            baseX = coords.left;
            outside = y < coords.top || y >= coords.bottom;
        }
        ch = misc.skipExtendingChars(lineObj.text, ch, 1);
        return PosWithInfo(lineNo, ch, sticky, outside, x - baseX);
    }
    function coordsBidiPart(cm, lineObj, lineNo, preparedMeasure, order, x, y) {
        let index = misc.findFirst(i => {
            let part = order[i], ltr = part.level != 1;
            return boxIsAfter(cursorCoords(cm, line_pos.Pos(lineNo, ltr ? part.to : part.from, ltr ? 'before' : 'after'), 'line', lineObj, preparedMeasure), x, y, true);
        }, 0, order.length - 1);
        let part = order[index];
        if (index > 0) {
            let ltr = part.level != 1;
            let start = cursorCoords(cm, line_pos.Pos(lineNo, ltr ? part.from : part.to, ltr ? 'after' : 'before'), 'line', lineObj, preparedMeasure);
            if (boxIsAfter(start, x, y, true) && start.top > y)
                part = order[index - 1];
        }
        return part;
    }
    function coordsBidiPartWrapped(cm, lineObj, _lineNo, preparedMeasure, order, x, y) {
        let {begin, end} = wrappedLineExtent(cm, lineObj, preparedMeasure, y);
        if (/\s/.test(lineObj.text.charAt(end - 1)))
            end--;
        let part = null, closestDist = null;
        for (let i = 0; i < order.length; i++) {
            let p = order[i];
            if (p.from >= end || p.to <= begin)
                continue;
            let ltr = p.level != 1;
            let endX = measureCharPrepared(cm, preparedMeasure, ltr ? Math.min(end, p.to) - 1 : Math.max(begin, p.from)).right;
            let dist = endX < x ? x - endX + 1000000000 : endX - x;
            if (!part || closestDist > dist) {
                part = p;
                closestDist = dist;
            }
        }
        if (!part)
            part = order[order.length - 1];
        if (part.from < begin)
            part = {
                from: begin,
                to: part.to,
                level: part.level
            };
        if (part.to > end)
            part = {
                from: part.from,
                to: end,
                level: part.level
            };
        return part;
    }
    let measureText;
    function textHeight(display) {
        if (display.cachedTextHeight != null)
            return display.cachedTextHeight;
        if (measureText == null) {
            measureText = dom.elt('pre');
            for (let i = 0; i < 49; ++i) {
                measureText.appendChild(document.createTextNode('x'));
                measureText.appendChild(dom.elt('br'));
            }
            measureText.appendChild(document.createTextNode('x'));
        }
        dom.removeChildrenAndAdd(display.measure, measureText);
        let height = measureText.offsetHeight / 50;
        if (height > 3)
            display.cachedTextHeight = height;
        dom.removeChildren(display.measure);
        return height || 1;
    }
    function charWidth(display) {
        if (display.cachedCharWidth != null)
            return display.cachedCharWidth;
        let anchor = dom.elt('span', 'xxxxxxxxxx');
        let pre = dom.elt('pre', [anchor]);
        dom.removeChildrenAndAdd(display.measure, pre);
        let rect = anchor.getBoundingClientRect(), width = (rect.right - rect.left) / 10;
        if (width > 2)
            display.cachedCharWidth = width;
        return width || 10;
    }
    function getDimensions(cm) {
        let utils_line = cm.display, left = {}, width = {};
        let gutterLeft = utils_line.gutters.clientLeft;
        for (let n = utils_line.gutters.firstChild, i = 0; n; n = n.nextSibling, ++i) {
            left[cm.options.gutters[i]] = n.offsetLeft + n.clientLeft + gutterLeft;
            width[cm.options.gutters[i]] = n.clientWidth;
        }
        return {
            fixedPos: compensateForHScroll(utils_line),
            gutterTotalWidth: utils_line.gutters.offsetWidth,
            gutterLeft: left,
            gutterWidth: width,
            wrapperWidth: utils_line.wrapper.clientWidth
        };
    }
    function compensateForHScroll(display) {
        return display.scroller.getBoundingClientRect().left - display.sizer.getBoundingClientRect().left;
    }
    function estimateHeight(cm) {
        let th = textHeight(cm.display), wrapping = cm.options.lineWrapping;
        let perLine = wrapping && Math.max(5, cm.display.scroller.clientWidth / charWidth(cm.display) - 3);
        return line => {
            if (spans.lineIsHidden(cm.doc, line))
                return 0;
            let widgetsHeight = 0;
            if (line.widgets)
                for (let i = 0; i < line.widgets.length; i++) {
                    if (line.widgets[i].height)
                        widgetsHeight += line.widgets[i].height;
                }
            if (wrapping)
                return widgetsHeight + (Math.ceil(line.text.length / perLine) || 1) * th;
            else
                return widgetsHeight + th;
        };
    }
    function estimateLineHeights(cm) {
        let doc = cm.doc, est = estimateHeight(cm);
        doc.iter(line => {
            let estHeight = est(line);
            if (estHeight != line.height)
                utils_line.updateLineHeight(line, estHeight);
        });
    }
    function posFromMouse(cm, e, liberal, forRect) {
        let display = cm.display;
        if (!liberal && events.e_target(e).getAttribute('cm-not-content') == 'true')
            return null;
        let x, y, space = display.lineSpace.getBoundingClientRect();
        try {
            x = e.clientX - space.left;
            y = e.clientY - space.top;
        } catch (e) {
            return null;
        }
        let coords = coordsChar(cm, x, y), line;
        if (forRect && coords.xRel == 1 && (line = utils_line.getLine(cm.doc, coords.line).text).length == coords.ch) {
            let colDiff = misc.countColumn(line, line.length, cm.options.tabSize) - line.length;
            coords = line_pos.Pos(coords.line, Math.max(0, Math.round((x - paddingH(cm.display).left) / charWidth(cm.display)) - colDiff));
        }
        return coords;
    }
    function findViewIndex(cm, n) {
        if (n >= cm.display.viewTo)
            return null;
        n -= cm.display.viewFrom;
        if (n < 0)
            return null;
        let view = cm.display.view;
        for (let i = 0; i < view.length; i++) {
            n -= view[i].size;
            if (n < 0)
                return i;
        }
    }
    return {
        paddingTop: paddingTop,
        paddingVert: paddingVert,
        paddingH: paddingH,
        scrollGap: scrollGap,
        displayWidth: displayWidth,
        displayHeight: displayHeight,
        mapFromLineView: mapFromLineView,
        measureChar: measureChar,
        findViewForLine: findViewForLine,
        prepareMeasureForLine: prepareMeasureForLine,
        measureCharPrepared: measureCharPrepared,
        nodeAndOffsetInLineMap: nodeAndOffsetInLineMap,
        clearLineMeasurementCacheFor: clearLineMeasurementCacheFor,
        clearLineMeasurementCache: clearLineMeasurementCache,
        clearCaches: clearCaches,
        intoCoordSystem: intoCoordSystem,
        fromCoordSystem: fromCoordSystem,
        charCoords: charCoords,
        cursorCoords: cursorCoords,
        estimateCoords: estimateCoords,
        coordsChar: coordsChar,
        wrappedLineExtentChar: wrappedLineExtentChar,
        textHeight: textHeight,
        charWidth: charWidth,
        getDimensions: getDimensions,
        compensateForHScroll: compensateForHScroll,
        estimateHeight: estimateHeight,
        estimateLineHeights: estimateLineHeights,
        posFromMouse: posFromMouse,
        findViewIndex: findViewIndex
    };
});