define([
    '../line/highlight',
    '../modes',
    '../util/misc',
    './operations',
    './view_tracking'
], function (highlight, models, misc, operations, view_tracking) {
    'use strict';
    function startWorker(cm, time) {
        if (cm.doc.highlightFrontier < cm.display.viewTo)
            cm.state.highlight.set(time, misc.bind(highlightWorker, cm));
    }
    function highlightWorker(cm) {
        let doc = cm.doc;
        if (doc.highlightFrontier >= cm.display.viewTo)
            return;
        let end = +new Date() + cm.options.workTime;
        let context = highlight.getContextBefore(cm, doc.highlightFrontier);
        let changedLines = [];
        doc.iter(context.line, Math.min(doc.first + doc.size, cm.display.viewTo + 500), line => {
            if (context.line >= cm.display.viewFrom) {
                let oldStyles = line.styles;
                let resetState = line.text.length > cm.options.maxHighlightLength ? models.copyState(doc.mode, context.state) : null;
                let highlighted = highlight.highlightLine(cm, line, context, true);
                if (resetState)
                    context.state = resetState;
                line.styles = highlighted.styles;
                let oldCls = line.styleClasses, newCls = highlighted.classes;
                if (newCls)
                    line.styleClasses = newCls;
                else if (oldCls)
                    line.styleClasses = null;
                let ischange = !oldStyles || oldStyles.length != line.styles.length || oldCls != newCls && (!oldCls || !newCls || oldCls.bgClass != newCls.bgClass || oldCls.textClass != newCls.textClass);
                for (let i = 0; !ischange && i < oldStyles.length; ++i)
                    ischange = oldStyles[i] != line.styles[i];
                if (ischange)
                    changedLines.push(context.line);
                line.stateAfter = context.save();
                context.nextLine();
            } else {
                if (line.text.length <= cm.options.maxHighlightLength)
                    highlight.processLine(cm, line.text, context);
                line.stateAfter = context.line % 5 == 0 ? context.save() : null;
                context.nextLine();
            }
            if (+new Date() > end) {
                startWorker(cm, cm.options.workDelay);
                return true;
            }
        });
        doc.highlightFrontier = context.line;
        doc.modeFrontier = Math.max(doc.modeFrontier, context.line);
        if (changedLines.length)
            operations.runInOp(cm, () => {
                for (let i = 0; i < changedLines.length; i++)
                    view_tracking.regLineChange(cm, changedLines[i], 'text');
            });
    }
    return { startWorker: startWorker };
});