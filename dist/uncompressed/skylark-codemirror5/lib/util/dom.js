define(['./browser'], function (a) {
    'use strict';
    function classTest(cls) {
        return new RegExp('(^|\\s)' + cls + '(?:$|\\s)\\s*');
    }
    let rmClass = function (node, cls) {
        let current = node.className;
        let match = classTest(cls).exec(current);
        if (match) {
            let after = current.slice(match.index + match[0].length);
            node.className = current.slice(0, match.index) + (after ? match[1] + after : '');
        }
    };
    function removeChildren(e) {
        for (let count = e.childNodes.length; count > 0; --count)
            e.removeChild(e.firstChild);
        return e;
    }
    function removeChildrenAndAdd(parent, e) {
        return removeChildren(parent).appendChild(e);
    }
    function elt(tag, content, className, style) {
        let e = document.createElement(tag);
        if (className)
            e.className = className;
        if (style)
            e.style.cssText = style;
        if (typeof content == 'string')
            e.appendChild(document.createTextNode(content));
        else if (content)
            for (let i = 0; i < content.length; ++i)
                e.appendChild(content[i]);
        return e;
    }
    function eltP(tag, content, className, style) {
        let e = elt(tag, content, className, style);
        e.setAttribute('role', 'presentation');
        return e;
    }
    let range;
    if (document.createRange)
        range = function (node, start, end, endNode) {
            let r = document.createRange();
            r.setEnd(endNode || node, end);
            r.setStart(node, start);
            return r;
        };
    else
        range = function (node, start, end) {
            let r = document.body.createTextRange();
            try {
                r.moveToElementText(node.parentNode);
            } catch (e) {
                return r;
            }
            r.collapse(true);
            r.moveEnd('character', end);
            r.moveStart('character', start);
            return r;
        };
    function contains(parent, child) {
        if (child.nodeType == 3)
            child = child.parentNode;
        if (parent.contains)
            return parent.contains(child);
        do {
            if (child.nodeType == 11)
                child = child.host;
            if (child == parent)
                return true;
        } while (child = child.parentNode);
    }
    function activeElt() {
        let activeElement;
        try {
            activeElement = document.activeElement;
        } catch (e) {
            activeElement = document.body || null;
        }
        while (activeElement && activeElement.shadowRoot && activeElement.shadowRoot.activeElement)
            activeElement = activeElement.shadowRoot.activeElement;
        return activeElement;
    }
    function addClass(node, cls) {
        let current = node.className;
        if (!classTest(cls).test(current))
            node.className += (current ? ' ' : '') + cls;
    }
    function joinClasses(a, b) {
        let as = a.split(' ');
        for (let i = 0; i < as.length; i++)
            if (as[i] && !classTest(as[i]).test(b))
                b += ' ' + as[i];
        return b;
    }
    let selectInput = function (node) {
        node.select();
    };
    if (a.ios)
        selectInput = function (node) {
            node.selectionStart = 0;
            node.selectionEnd = node.value.length;
        };
    else if (a.ie)
        selectInput = function (node) {
            try {
                node.select();
            } catch (_e) {
            }
        };
    return {
        classTest: classTest,
        rmClass: rmClass,
        removeChildren: removeChildren,
        removeChildrenAndAdd: removeChildrenAndAdd,
        elt: elt,
        eltP: eltP,
        range: range,
        contains: contains,
        activeElt: activeElt,
        addClass: addClass,
        joinClasses: joinClasses,
        selectInput: selectInput
    };
});