const { find } = require("./array.js");

const EVENT_TYPE_STATE = "s";
const EVENT_TYPE_STATE_REXP = /^(enter|leave)/;
const EVENT_TYPE_TRANSITION = "t";
const EVENT_TYPE_TRANSITION_REXP = /^(before|after)/;

function callbackToPromise(callback, ...args) {
    let output,
        uncaught = null;
    try {
        output = callback(...args);
    } catch (err) {
        uncaught = err;
        output = false;
    }
    return Promise.resolve(output)
        .catch(err => {
            uncaught = err;
            return false;
        })
        .then(result => {
            if (uncaught !== null) {
                setTimeout(function __throwUnhandledException() {
                    throw uncaught;
                }, 0);
            }
            return result;
        });
}

function createInterface() {
    const handlers = [];
    const events = {
        "@@handlers": handlers,
        add: (event, stateOrTransition, callback, { once = false } = {}) => {
            handlers.push({
                event,
                type: resolveEventType(event),
                value: stateOrTransition,
                callback,
                once
            });
            /**
             * @class AttachedEventHandlerResult
             */
            return {
                /**
                 * Remove the event handler
                 * @memberof AttachedEventHandlerResult
                 */
                remove: () => events.remove(event, stateOrTransition, callback)
            };
        },
        execute: (event, stateOrTransition, { parallel = false, from, to, transition } = {}) => {
            const type = resolveEventType(event);
            const work = handlers.filter(
                item =>
                    item.type === type && item.event === event && item.value === stateOrTransition
            );
            if (parallel) {
                return Promise.all(
                    work.map(item => callbackToPromise(item.callback, { from, to, transition }))
                );
            }
            return (function doNext() {
                const item = work.shift();
                if (!item) {
                    return Promise.resolve();
                }
                return callbackToPromise(item.callback, { from, to, transition }).then(result => {
                    if (item.once === true) {
                        events.remove(event, stateOrTransition, item.callback);
                    }
                    if (result === false) {
                        // cancel transition
                        return false;
                    }
                    return doNext();
                });
            })();
        },
        remove: (event, stateOrTransition, callback) => {
            const type = resolveEventType(event);
            const handerInd = find(
                handlers,
                item => {
                    return (
                        item.event === event &&
                        item.type === type &&
                        item.value === stateOrTransition &&
                        item.callback === callback
                    );
                },
                { index: true }
            );
            if (handerInd >= 0) {
                handlers.splice(handerInd, 1);
            }
        }
    };
    return events;
}

function resolveEventType(event) {
    if (EVENT_TYPE_STATE_REXP.test(event)) {
        return EVENT_TYPE_STATE;
    } else if (EVENT_TYPE_TRANSITION_REXP.test(event)) {
        return EVENT_TYPE_TRANSITION;
    }
    throw new Error(`Failed resolving event type: unrecognised prefix: ${event}`);
}

module.exports = {
    createInterface
};
