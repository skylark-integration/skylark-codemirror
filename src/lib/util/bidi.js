define(['./misc'], function (a) {
    'use strict';
    function iterateBidiSections(order, from, to, f) {
        if (!order)
            return f(from, to, 'ltr', 0);
        let found = false;
        for (let i = 0; i < order.length; ++i) {
            let part = order[i];
            if (part.from < to && part.to > from || from == to && part.to == from) {
                f(Math.max(part.from, from), Math.min(part.to, to), part.level == 1 ? 'rtl' : 'ltr', i);
                found = true;
            }
        }
        if (!found)
            f(from, to, 'ltr');
    }
    let bidiOther = null;
    function getBidiPartAt(order, ch, sticky) {
        let found;
        bidiOther = null;
        for (let i = 0; i < order.length; ++i) {
            let cur = order[i];
            if (cur.from < ch && cur.to > ch)
                return i;
            if (cur.to == ch) {
                if (cur.from != cur.to && sticky == 'before')
                    found = i;
                else
                    bidiOther = i;
            }
            if (cur.from == ch) {
                if (cur.from != cur.to && sticky != 'before')
                    found = i;
                else
                    bidiOther = i;
            }
        }
        return found != null ? found : bidiOther;
    }
    let bidiOrdering = function () {
        let lowTypes = 'bbbbbbbbbtstwsbbbbbbbbbbbbbbssstwNN%%%NNNNNN,N,N1111111111NNNNNNNLLLLLLLLLLLLLLLLLLLLLLLLLLNNNNNNLLLLLLLLLLLLLLLLLLLLLLLLLLNNNNbbbbbbsbbbbbbbbbbbbbbbbbbbbbbbbbb,N%%%%NNNNLNNNNN%%11NLNNN1LNNNNNLLLLLLLLLLLLLLLLLLLLLLLNLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLN';
        let arabicTypes = 'nnnnnnNNr%%r,rNNmmmmmmmmmmmrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrmmmmmmmmmmmmmmmmmmmmmnnnnnnnnnn%nnrrrmrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrmmmmmmmnNmmmmmmrrmmNmmmmrr1111111111';
        function charType(code) {
            if (code <= 247)
                return lowTypes.charAt(code);
            else if (1424 <= code && code <= 1524)
                return 'R';
            else if (1536 <= code && code <= 1785)
                return arabicTypes.charAt(code - 1536);
            else if (1774 <= code && code <= 2220)
                return 'r';
            else if (8192 <= code && code <= 8203)
                return 'w';
            else if (code == 8204)
                return 'b';
            else
                return 'L';
        }
        let bidiRE = /[\u0590-\u05f4\u0600-\u06ff\u0700-\u08ac]/;
        let isNeutral = /[stwN]/, isStrong = /[LRr]/, countsAsLeft = /[Lb1n]/, countsAsNum = /[1n]/;
        function BidiSpan(level, from, to) {
            this.level = level;
            this.from = from;
            this.to = to;
        }
        return function (str, direction) {
            let outerType = direction == 'ltr' ? 'L' : 'R';
            if (str.length == 0 || direction == 'ltr' && !bidiRE.test(str))
                return false;
            let len = str.length, types = [];
            for (let i = 0; i < len; ++i)
                types.push(charType(str.charCodeAt(i)));
            for (let i = 0, prev = outerType; i < len; ++i) {
                let type = types[i];
                if (type == 'm')
                    types[i] = prev;
                else
                    prev = type;
            }
            for (let i = 0, cur = outerType; i < len; ++i) {
                let type = types[i];
                if (type == '1' && cur == 'r')
                    types[i] = 'n';
                else if (isStrong.test(type)) {
                    cur = type;
                    if (type == 'r')
                        types[i] = 'R';
                }
            }
            for (let i = 1, prev = types[0]; i < len - 1; ++i) {
                let type = types[i];
                if (type == '+' && prev == '1' && types[i + 1] == '1')
                    types[i] = '1';
                else if (type == ',' && prev == types[i + 1] && (prev == '1' || prev == 'n'))
                    types[i] = prev;
                prev = type;
            }
            for (let i = 0; i < len; ++i) {
                let type = types[i];
                if (type == ',')
                    types[i] = 'N';
                else if (type == '%') {
                    let end;
                    for (end = i + 1; end < len && types[end] == '%'; ++end) {
                    }
                    let replace = i && types[i - 1] == '!' || end < len && types[end] == '1' ? '1' : 'N';
                    for (let j = i; j < end; ++j)
                        types[j] = replace;
                    i = end - 1;
                }
            }
            for (let i = 0, cur = outerType; i < len; ++i) {
                let type = types[i];
                if (cur == 'L' && type == '1')
                    types[i] = 'L';
                else if (isStrong.test(type))
                    cur = type;
            }
            for (let i = 0; i < len; ++i) {
                if (isNeutral.test(types[i])) {
                    let end;
                    for (end = i + 1; end < len && isNeutral.test(types[end]); ++end) {
                    }
                    let before = (i ? types[i - 1] : outerType) == 'L';
                    let after = (end < len ? types[end] : outerType) == 'L';
                    let replace = before == after ? before ? 'L' : 'R' : outerType;
                    for (let j = i; j < end; ++j)
                        types[j] = replace;
                    i = end - 1;
                }
            }
            let order = [], m;
            for (let i = 0; i < len;) {
                if (countsAsLeft.test(types[i])) {
                    let start = i;
                    for (++i; i < len && countsAsLeft.test(types[i]); ++i) {
                    }
                    order.push(new BidiSpan(0, start, i));
                } else {
                    let pos = i, at = order.length;
                    for (++i; i < len && types[i] != 'L'; ++i) {
                    }
                    for (let j = pos; j < i;) {
                        if (countsAsNum.test(types[j])) {
                            if (pos < j)
                                order.splice(at, 0, new BidiSpan(1, pos, j));
                            let nstart = j;
                            for (++j; j < i && countsAsNum.test(types[j]); ++j) {
                            }
                            order.splice(at, 0, new BidiSpan(2, nstart, j));
                            pos = j;
                        } else
                            ++j;
                    }
                    if (pos < i)
                        order.splice(at, 0, new BidiSpan(1, pos, i));
                }
            }
            if (direction == 'ltr') {
                if (order[0].level == 1 && (m = str.match(/^\s+/))) {
                    order[0].from = m[0].length;
                    order.unshift(new BidiSpan(0, 0, m[0].length));
                }
                if (a.lst(order).level == 1 && (m = str.match(/\s+$/))) {
                    a.lst(order).to -= m[0].length;
                    order.push(new BidiSpan(0, len - m[0].length, len));
                }
            }
            return direction == 'rtl' ? order.reverse() : order;
        };
    }();
    function getOrder(line, direction) {
        let order = line.order;
        if (order == null)
            order = line.order = bidiOrdering(line.text, direction);
        return order;
    }
    return {
        iterateBidiSections: iterateBidiSections,
        bidiOther: bidiOther,
        getBidiPartAt: getBidiPartAt,
        getOrder: getOrder
    };
});