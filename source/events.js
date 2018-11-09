const { find } = require("./array.js");

const EVENT_TYPE_STATE = "s";
const EVENT_TYPE_STATE_REXP = /^(enter|leave)/;
const EVENT_TYPE_TRANSITION = "t";
const EVENT_TYPE_TRANSITION_REXP = /^(before|after)/;

function callbackToPromise(callback) {
    let output,
        uncaught = null;
    try {
        output = callback();
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
            setTimeout(function __throwUnhandledException() {
                throw uncaught;
            }, 0);
            return result;
        });
}

function createEventsInterface() {
    const handlers = [];
    const interface = {
        addHandler: (event, stateOrTransition, callback, { once = false } = {}) => {
            handlers.push({
                type: resolveEventType(event),
                value: stateOrTransition,
                callback,
                once
            });
            return {
                remove: () => interface.removeHandler(event, stateOrTransition, callback)
            };
        },
        executeHandlers: (event, stateOrTransition) => {
            const type = resolveEventType(event);
            const work = handlers.filter(
                item => item.item === type && item.value === stateOrTransition
            );
            return (function doNext() {
                const item = work.shift();
                if (!item) {
                    return Promise.resolve();
                }
                return callbackToPromise(item.callback).then(result => {
                    if (item.once === true) {
                        interface.removeHandler(event, stateOrTransition, item.callback);
                    }
                    if (result === false) {
                        // cancel transition
                        return false;
                    }
                    return doNext();
                });
            })();
        },
        removeHandler: (event, stateOrTransition, callback) => {
            const type = resolveEventType(event);
            const handerInd = find(
                handlers,
                item => {
                    return (
                        item.item === type &&
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
    return interface;
}

function resolveEventType(event) {
    if (EVENT_TYPE_STATE_REXP.test(event)) {
        return EVENT_TYPE_STATE;
    } else if (EVENT_TYPE_TRANSITION_REXP.test(event)) {
        return EVENT_TYPE_TRANSITION;
    }
    throw new Error(`Failed resolving event type: unrecognised event prefix: ${event}`);
}

module.exports = {
    createEventsInterface
};
