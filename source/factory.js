const { generatePaths, transitionStateMachine, verifyTransitions } = require("./transition.js");
const { getState } = require("./state.js");

function createStateMachine({ initial, transitions } = {}) {
    verifyTransitions(transitions);
    const scope = {
        paths: generatePaths(transitions),
        pending: false,
        state: initial
    };
    return {
        get pending() { return scope.pending; },
        get state() { return getState(scope); },
        transition: newState => transitionStateMachine(scope, newState)
    };
}
