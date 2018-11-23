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
 * @typedef {Object} HistoryItem
 * @property {Number} tsStart - The starting timestamp
 * @property {Number} tsEnd - The ending timestamp
 * @property {String} state - The state that was transitioned to
 * @property {String} previous - The previous state
 * @property {String} transition - The transition name that was invoked
 */

/**
 * @typedef {Object} StateMachineConfiguration
 * @property {String} initial - The initial state
 * @property {Array.<Transition>} transitions - An array of transitions
 */

// /**
//  * @typedef {Object} StateMachine
//  * @property {Boolean} pending - Whether a transition is currently pending or not
//  * @property {String} state - The current state the machine is in
//  * @property {Function} can - Check if a transition is possible
//  * @property {Function} cannot - Check if a transition is not possible
//  * @property {Function} getHistory - Get the full transition history
//  * @property {Function} is - Check if the machine is in a state
//  * @property {Function} off - Turn a event listener off (remove)
//  * @property {Function} on - Attach an event listener
//  * @property {Function} once - Attach a single-use event listener
//  * @property {Function} transition - Transition the machine to another state
//  */

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
        state: initial,
        next: null,
        history: []
    };
    /**
     * @class StateMachine
     */
    const sm = {
        /**
         * Whether the machine is currently transitioning or not
         * @type {Boolean}
         * @memberof StateMachine
         */
        get pending() {
            return context.pending;
        },
        /**
         * The current state the machine is in
         * @type {String}
         * @memberof StateMachine
         */
        get state() {
            return getState(context);
        },
        /**
         * Check if the state machine can perform a transition
         * @param {String} transition The transition name to check
         * @returns {Boolean} True if the transition can be performed, false otherwise
         * @memberof StateMachine
         */
        can: transition => !!getPath(context, transition),
        /**
         * Check if the state machine cannot perform a transition
         * @param {String} transition The transition name to check
         * @returns {Boolean} True if it cannot be performed, false if it can
         * @memberof StateMachine
         */
        cannot: transition => !sm.can(transition),
        /**
         * Get the state machine's history
         * @returns {Array.<HistoryItem>} An array of history entries
         * @memberof StateMachine
         */
        getHistory: () => JSON.parse(JSON.stringify(context.history)),
        /**
         * Test if the state machine is in a particular state
         * @param {String} state The state to check
         * @returns {Boolean} True if it is in the mentioned state
         * @memberof StateMachine
         */
        is: state => sm.state === state,
        /**
         * Turn off an event listener
         * @param {String} event The event type to turn off (before/after etc.)
         * @param {String} stateOrTransition The state or transition name to turn off the listener for
         * @param {Function} cb The calback that was passed to `on` or `once`
         * @memberof StateMachine
         */
        off: (event, stateOrTransition, cb) => context.events.remove(event, stateOrTransition, cb),
        /**
         * Attach (turn on) an event listener for a particular event
         * @param {String} event The event type to attach to (before/after etc.)
         * @param {String} stateOrTransition The state or transition name to attach a listener on
         * @param {Function} cb The callback to attach
         * @returns {AttachedEventHandlerResult} An event handler control adapter
         * @memberof StateMachine
         */
        on: (event, stateOrTransition, cb) => context.events.add(event, stateOrTransition, cb),
        /**
         * Attach a single-use event listener for a particular event
         * This event, once caught, will clear the attached handler.
         * @param {String} event The event type to attach to (before/after etc.)
         * @param {String} stateOrTransition The state or transition name to attach a listener on
         * @param {Function} cb The callback to attach
         * @returns {AttachedEventHandlerResult} An event handler control adapter
         * @memberof StateMachine
         */
        once: (event, stateOrTransition, cb) =>
            context.events.add(event, stateOrTransition, cb, { once: true }),
        /**
         * Perform a state transition
         * @param {String} action The action to perform which will result in a transition
         * @returns {Promise} A promise that resolves once the transition is complete
         * @memberof StateMachine
         */
        transition: action => transition(context, action)
    };
    return sm;
}

module.exports = {
    createStateMachine
};
