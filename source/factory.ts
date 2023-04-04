import { cloneArray } from "./clone.js";
import { EventsInterface, createEventsInterface, AddEventHandler } from "./events.js";
import { getState } from "./state.js";
import { generatePaths, getPath, transition, verifyTransitions } from "./transition.js";
import { HistoryItem, StateMachineConfiguration } from "./types.js";

export interface StateMachine {
    /**
     * Whether the machine is currently transitioning or not
     */
    readonly pending: boolean;
    /**
     * The current state the machine is in
     */
    readonly state: string;
    /**
     * Check if the state machine can perform a transition
     * @param transition The transition name to check
     * @returns True if the transition can be performed, false otherwise
     * @example
     *  if (sm.can("show")) {
     *      console.log("About to show!");
     *      sm.transition("show");
     *  }
     */
    can: (transition: string) => boolean;
    /**
     * Check if the state machine cannot perform a transition
     * @param transition The transition name to check
     * @returns True if it cannot be performed, false if it can
     */
    cannot: (transition: string) => boolean;
    /**
     * Get the state machine's history
     * @returns An array of history entries
     */
    getHistory: () => Array<HistoryItem>;
    /**
     * Test if the state machine is in a particular state
     * @param state The state to check
     * @returns True if it is in the mentioned state
     * @example
     *  if (sm.is("shown")) {
     *      sm.transition("prepare");
     *  } else {
     *      sm.transition("show");
     *  }
     */
    is: (state: string) => boolean;
    /**
     * Turn off an event listener
     * @param event The event type to turn off (before/after etc.)
     * @param stateOrTransition The state or transition name to turn off the listener for
     * @param cb The calback that was passed to `on` or `once`
     * @example
     *  // Earlier:
     *  const callback = () => {};
     *  sm.on("leave", "hidden", callback);
     *  // Later:
     *  sm.off("leave", "hidden", callback);
     */
    off: (event: string, stateOrTransition: string, cb: () => void) => void;
    /**
     * Attach (turn on) an event listener for a particular event
     * @param event The event type to attach to (before/after etc.)
     * @param stateOrTransition The state or transition name to attach a listener on
     * @param cb The callback to attach
     * @returns An event handler control adapter
     * @example
     *  // Attach an event listener, and record the return value for later use
     *  const handler = sm.on("before", "show", () => {});
     *  // Attached handler can also be removed later:
     *  handler.remove();
     */
    on: (event: string, stateOrTransition: string, cb: () => void) => AddEventHandler;
    /**
     * Attach a single-use event listener for a particular event
     * This event, once caught, will clear the attached handler.
     * @param event The event type to attach to (before/after etc.)
     * @param stateOrTransition The state or transition name to attach a listener on
     * @param cb The callback to attach
     * @returns An event handler control adapter
     * @see StateMachine#on
     */
    once: (event: string, stateOrTransition: string, cb: () => void) => AddEventHandler;
    /**
     * Perform a state transition
     * @param action The action to perform which will result in a transition
     * @returns A promise that resolves once the transition is complete
     * @example
     *  await sm.transition("hide");
     */
    transition: (action: string) => Promise<void>;
}

export interface StateMachineContext {
    events: EventsInterface;
    paths: any;
    pending: boolean;
    state: string;
    next: string | null;
    history: Array<HistoryItem>;
}

/**
 * Create a state machine instance
 * @param config Configuration for the new state machine
 * @returns A state machine instance
 */
export function createStateMachine({
    initial,
    transitions
}: StateMachineConfiguration): StateMachine {
    if (!initial || initial.length <= 0) {
        throw new Error(`Invalid initial state: ${initial}`);
    }
    verifyTransitions(transitions);
    const context: StateMachineContext = {
        events: createEventsInterface(),
        paths: generatePaths(transitions),
        pending: false,
        state: initial,
        next: null,
        history: []
    };
    const sm: StateMachine = {
        get pending() {
            return context.pending;
        },
        get state() {
            return getState(context);
        },
        can: transition => !!getPath(context, transition),
        cannot: transition => !sm.can(transition),
        getHistory: () => cloneArray<Array<HistoryItem>>(context.history),
        is: state => sm.state === state,
        off: (event, stateOrTransition, cb) => context.events.remove(event, stateOrTransition, cb),
        on: (event, stateOrTransition, cb) => context.events.add(event, stateOrTransition, cb),
        once: (event, stateOrTransition, cb) =>
            context.events.add(event, stateOrTransition, cb, { once: true }),
        transition: action => transition(context, action)
    };
    return sm;
}
