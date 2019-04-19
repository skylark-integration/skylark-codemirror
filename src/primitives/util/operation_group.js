define(['./event'], function (a) {
    'use strict';
    let operationGroup = null;
    function pushOperation(op) {
        if (operationGroup) {
            operationGroup.ops.push(op);
        } else {
            op.ownsGroup = operationGroup = {
                ops: [op],
                delayedCallbacks: []
            };
        }
    }
    function fireCallbacksForOps(group) {
        let callbacks = group.delayedCallbacks, i = 0;
        do {
            for (; i < callbacks.length; i++)
                callbacks[i].call(null);
            for (let j = 0; j < group.ops.length; j++) {
                let op = group.ops[j];
                if (op.cursorActivityHandlers)
                    while (op.cursorActivityCalled < op.cursorActivityHandlers.length)
                        op.cursorActivityHandlers[op.cursorActivityCalled++].call(null, op.cm);
            }
        } while (i < callbacks.length);
    }
    function finishOperation(op, endCb) {
        let group = op.ownsGroup;
        if (!group)
            return;
        try {
            fireCallbacksForOps(group);
        } finally {
            operationGroup = null;
            endCb(group);
        }
    }
    let orphanDelayedCallbacks = null;
    function signalLater(emitter, type) {
        let arr = a.getHandlers(emitter, type);
        if (!arr.length)
            return;
        let args = Array.prototype.slice.call(arguments, 2), list;
        if (operationGroup) {
            list = operationGroup.delayedCallbacks;
        } else if (orphanDelayedCallbacks) {
            list = orphanDelayedCallbacks;
        } else {
            list = orphanDelayedCallbacks = [];
            setTimeout(fireOrphanDelayed, 0);
        }
        for (let i = 0; i < arr.length; ++i)
            list.push(() => arr[i].apply(null, args));
    }
    function fireOrphanDelayed() {
        let delayed = orphanDelayedCallbacks;
        orphanDelayedCallbacks = null;
        for (let i = 0; i < delayed.length; ++i)
            delayed[i]();
    }
    return {
        pushOperation: pushOperation,
        finishOperation: finishOperation,
        signalLater: signalLater
    };
});