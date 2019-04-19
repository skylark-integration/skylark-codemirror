define([
    '../display/selection',
    '../display/operations',
    '../line/pos',
    '../measurement/position_measurement',
    '../measurement/widgets',
    '../model/changes',
    '../model/change_measurement',
    '../model/selection',
    '../model/selection_updates',
    '../util/browser',
    '../util/dom',
    '../util/event',
    '../util/misc'
], function (a, b, c, d, e, f, g, h, i, j, k, l, m) {
    'use strict';
    let lastDrop = 0;
    function onDrop(e) {
        let cm = this;
        clearDragCursor(cm);
        if (l.signalDOMEvent(cm, e) || e.eventInWidget(cm.display, e))
            return;
        l.e_preventDefault(e);
        if (j.ie)
            lastDrop = +new Date();
        let pos = d.posFromMouse(cm, e, true), files = e.dataTransfer.files;
        if (!pos || cm.isReadOnly())
            return;
        if (files && files.length && window.FileReader && window.File) {
            let n = files.length, text = Array(n), read = 0;
            let loadFile = (file, i) => {
                if (cm.options.allowDropFileTypes && m.indexOf(cm.options.allowDropFileTypes, file.type) == -1)
                    return;
                let reader = new FileReader();
                reader.onload = b.operation(cm, () => {
                    let content = reader.result;
                    if (/[\x00-\x08\x0e-\x1f]{2}/.test(content))
                        content = '';
                    text[i] = content;
                    if (++read == n) {
                        pos = c.clipPos(cm.doc, pos);
                        let change = {
                            from: pos,
                            to: pos,
                            text: cm.doc.splitLines(text.join(cm.doc.lineSeparator())),
                            origin: 'paste'
                        };
                        f.makeChange(cm.doc, change);
                        i.setSelectionReplaceHistory(cm.doc, h.simpleSelection(pos, g.changeEnd(change)));
                    }
                });
                reader.readAsText(file);
            };
            for (let i = 0; i < n; ++i)
                loadFile(files[i], i);
        } else {
            if (cm.state.draggingText && cm.doc.sel.contains(pos) > -1) {
                cm.state.draggingText(e);
                setTimeout(() => cm.display.input.focus(), 20);
                return;
            }
            try {
                let text = e.dataTransfer.getData('Text');
                if (text) {
                    let selected;
                    if (cm.state.draggingText && !cm.state.draggingText.copy)
                        selected = cm.listSelections();
                    i.setSelectionNoUndo(cm.doc, h.simpleSelection(pos, pos));
                    if (selected)
                        for (let i = 0; i < selected.length; ++i)
                            f.replaceRange(cm.doc, '', selected[i].anchor, selected[i].head, 'drag');
                    cm.replaceSelection(text, 'around', 'paste');
                    cm.display.input.focus();
                }
            } catch (e) {
            }
        }
    }
    function onDragStart(cm, e) {
        if (j.ie && (!cm.state.draggingText || +new Date() - lastDrop < 100)) {
            l.e_stop(e);
            return;
        }
        if (l.signalDOMEvent(cm, e) || e.eventInWidget(cm.display, e))
            return;
        e.dataTransfer.setData('Text', cm.getSelection());
        e.dataTransfer.effectAllowed = 'copyMove';
        if (e.dataTransfer.setDragImage && !j.safari) {
            let img = k.elt('img', null, null, 'position: fixed; left: 0; top: 0;');
            img.src = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
            if (j.presto) {
                img.width = img.height = 1;
                cm.display.wrapper.appendChild(img);
                img._top = img.offsetTop;
            }
            e.dataTransfer.setDragImage(img, 0, 0);
            if (j.presto)
                img.parentNode.removeChild(img);
        }
    }
    function onDragOver(cm, e) {
        let pos = d.posFromMouse(cm, e);
        if (!pos)
            return;
        let frag = document.createDocumentFragment();
        a.drawSelectionCursor(cm, pos, frag);
        if (!cm.display.dragCursor) {
            cm.display.dragCursor = k.elt('div', null, 'CodeMirror-cursors CodeMirror-dragcursors');
            cm.display.lineSpace.insertBefore(cm.display.dragCursor, cm.display.cursorDiv);
        }
        k.removeChildrenAndAdd(cm.display.dragCursor, frag);
    }
    function clearDragCursor(cm) {
        if (cm.display.dragCursor) {
            cm.display.lineSpace.removeChild(cm.display.dragCursor);
            cm.display.dragCursor = null;
        }
    }
    return {
        onDrop: onDrop,
        onDragStart: onDragStart,
        onDragOver: onDragOver,
        clearDragCursor: clearDragCursor
    };
});