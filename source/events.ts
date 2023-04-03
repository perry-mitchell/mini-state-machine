import { find } from "./array.js";

interface AddEventOptions {
    /**
     * Listen for only 1 event emission
     */
    once?: boolean;
}

interface AddEventHandler {
    /**
     * Remove the event handler
     */
    remove: () => void;
}

type EventCallback = (...args: Array<any>) => boolean | void | Promise<boolean | void>;

enum EventType {
    State = "s",
    Transition = "t"
}

export interface EventsInterface {
    "@@handlers": Array<any>;
    add: (event: string, stateOrTransition: string, callback: () => void, options?: AddEventOptions) => AddEventHandler;
    execute: (event: string, stateOrTransition: string, options?: ExecuteOptions) => Promise<boolean>;
    remove: (event: string, stateOrTransition: string, callback: () => void) => void;
}

interface ExecuteOptions {
    from: string;
    to: string;
    transition: string;
}

const EVENT_TYPE_STATE_REXP = /^(enter|leave)/;
const EVENT_TYPE_TRANSITION_REXP = /^(before|after)/;

function callbackToPromise(callback: EventCallback, ...args: Array<any>): Promise<boolean | void> {
    let output: boolean | void | Promise<boolean | void>,
        uncaught: null | Error = null;
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

export function createEventsInterface(): EventsInterface {
    const handlers = [];
    const events: EventsInterface = {
        "@@handlers": handlers,
        add: (event, stateOrTransition, callback, { once = false } = {}) => {
            handlers.push({
                event,
                type: resolveEventType(event),
                value: stateOrTransition,
                callback,
                once
            });
            return {
                remove: () => events.remove(event, stateOrTransition, callback)
            };
        },
        execute: (event, stateOrTransition, options: ExecuteOptions) => {
            const type = resolveEventType(event);
            const work = handlers.filter(
                item =>
                    item.type === type &&
                    item.event === event &&
                    (item.value === stateOrTransition || item.value === "*")
            );
            return (function doNext() {
                const item = work.shift();
                if (!item) {
                    return Promise.resolve();
                }
                return callbackToPromise(item.callback, options).then(result => {
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
                        (item.value === stateOrTransition || item.value === "*") &&
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

function resolveEventType(event: string): EventType {
    if (EVENT_TYPE_STATE_REXP.test(event)) {
        return EventType.State;
    } else if (EVENT_TYPE_TRANSITION_REXP.test(event)) {
        return EventType.Transition;
    }
    throw new Error(`Failed resolving event type: unrecognised prefix: ${event}`);
}

