define([
    './CodeMirror',
    '../util/dom',
    '../util/event',
    '../util/misc'
], function (a, b, c, d) {
    'use strict';
    function fromTextArea(textarea, options) {
        options = options ? d.copyObj(options) : {};
        options.value = textarea.value;
        if (!options.tabindex && textarea.tabIndex)
            options.tabindex = textarea.tabIndex;
        if (!options.placeholder && textarea.placeholder)
            options.placeholder = textarea.placeholder;
        if (options.autofocus == null) {
            let hasFocus = b.activeElt();
            options.autofocus = hasFocus == textarea || textarea.getAttribute('autofocus') != null && hasFocus == document.body;
        }
        function save() {
            textarea.value = cm.getValue();
        }
        let realSubmit;
        if (textarea.form) {
            c.on(textarea.form, 'submit', save);
            if (!options.leaveSubmitMethodAlone) {
                let form = textarea.form;
                realSubmit = form.submit;
                try {
                    let wrappedSubmit = form.submit = () => {
                        save();
                        form.submit = realSubmit;
                        form.submit();
                        form.submit = wrappedSubmit;
                    };
                } catch (e) {
                }
            }
        }
        options.finishInit = cm => {
            cm.save = save;
            cm.getTextArea = () => textarea;
            cm.toTextArea = () => {
                cm.toTextArea = isNaN;
                save();
                textarea.parentNode.removeChild(cm.getWrapperElement());
                textarea.style.display = '';
                if (textarea.form) {
                    c.off(textarea.form, 'submit', save);
                    if (typeof textarea.form.submit == 'function')
                        textarea.form.submit = realSubmit;
                }
            };
        };
        textarea.style.display = 'none';
        let cm = a.CodeMirror(node => textarea.parentNode.insertBefore(node, textarea.nextSibling), options);
        return cm;
    }
    return { fromTextArea: fromTextArea };
});