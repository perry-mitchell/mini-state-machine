const { generatePaths, getPath, transition, verifyTransitions } = require("./transition.js");
const { getState } = require("./state.js");
const { createInterface: createEventsInterface } = require("./events.js");

/**
 * @typedef {Object} Transition
 * @property {String} name - The name of the transition, or "action"
 * @property {String} from - The state that the transition should originate from. Can be
 *  set to "*" to indicate all states.
 * @property {String} to - The state that the transition should transition to
 */

/**
 * @typedef {Object} StateMachineConfiguration
 * @property {String} initial - The initial state
 * @property {Array.<Transition>} transitions - An array of transitions
 */

/**
 * @typedef {Object} StateMachine
 * @property {Boolean} pending - Whether a transition is currently pending or not
 * @property {String} state - The current state the machine is in
 * @property {Function} can - Check if a transition is possible
 * @property {Function} cannot - Check if a transition is not possible
 * @property {Function} is - Check if the machine is in a state
 * @property {Function} off - Turn a event listener off (remove)
 * @property {Function} on - Attach an event listener
 * @property {Function} once - Attach a single-use event listener
 * @property {Function} transition - Transition the machine to another state
 */

/**
 * Create a state machine instance
 * @param {StateMachineConfiguration} config Configuration for the new state machine
 * @returns {StateMachine} A state machine instance
 * @memberof module:MSM
 */
function createStateMachine({ initial, transitions } = {}) {
    if (!initial || initial.length <= 0) {
        throw new Error(`Invalid initial state: ${initial}`);
    }
    verifyTransitions(transitions);
    const context = {
        events: createEventsInterface(),
        paths: generatePaths(transitions),
        pending: false,
        state: initial
    };
    const sm = {
        get pending() {
            return context.pending;
        },
        get state() {
            return getState(context);
        },
        can: transition => !!getPath(context, transition),
        cannot: transition => !sm.can(transition),
        is: state => sm.state === state,
        off: (event, stateOrTransition, cb) => context.events.remove(event, stateOrTransition, cb),
        on: (event, stateOrTransition, cb) => context.events.add(event, stateOrTransition, cb),
        once: (event, stateOrTransition, cb) =>
            context.events.add(event, stateOrTransition, cb, { once: true }),
        transition: action => transition(context, action)
    };
    return sm;
}

module.exports = {
    createStateMachine
};
