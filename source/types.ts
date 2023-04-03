export enum ErrorCode {
    NoTransition = "NO_TRANSITION",
    TransitionCancelled = "TRANSITION_CANCELLED",
    TransitionPending = "TRANSITION_PENDING"
}

export interface HistoryItem {
    /**
     * The starting timestamp
     */
    tsStart: number;
    /**
     * The ending timestamp
     */
    tsEnd: number;
    /**
     * The state that was transitioned to
     */
    state: string;
    /**
     * The previous state
     */
    previous: string;
    /**
     * The transition name that was invoked
     */
    transition: string;
}

export interface StateMachineConfiguration {
    /**
     * The initial state
     */
    initial: string;
    /**
     * All of the possible transition paths
     */
    transitions: Array<Transition>;
}

export interface Transition {
    /**
     * The name of the transition, or "action"
     */
    name: string;
    /**
     * The state that the transition should originate from. Can be
     *  set to "*" to indicate all states.
     */
    from: string;
    /**
     * The state that the transition should transition to
     */
    to: string;
}
