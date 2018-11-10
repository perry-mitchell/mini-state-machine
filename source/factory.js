const { generatePaths, transitionStateMachine, verifyTransitions } = require("./transition.js");
const { getState } = require("./state.js");
const { createEventsInterface } = require("./events.js");

function createStateMachine({ initial, transitions } = {}) {
    verifyTransitions(transitions);
    const scope = {
        events: createEventsInterface(),
        paths: generatePaths(transitions),
        pending: false,
        state: initial
    };
    return {
        get pending() {
            return scope.pending;
        },
        get state() {
            return getState(scope);
        },
        off: (event, stateOrTransition, cb) => events.removeHandler(event, stateOrTransition, cb),
        on: (event, stateOrTransition, cb) => events.addHandler(event, stateOrTransition, cb),
        once: (event, stateOrTransition, cb) =>
            events.addHandler(event, stateOrTransition, cb, { once: true }),
        transition: action => transitionStateMachine(scope, action)
    };
}

module.exports = {
    createStateMachine
};
