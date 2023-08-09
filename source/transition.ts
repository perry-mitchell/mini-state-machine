import { Layerr } from "layerr";
import { find } from "./array.js";
import { StateMachineContext } from "./factory.js";
import { getState } from "./state.js";
import { ErrorCode, Transition } from "./types.js";

export function generatePaths(transitions: Array<Transition>): Array<Transition> {
    const allStates: Array<string> = transitions.reduce((states, transition) => {
        const { from: fromState, to: toState } = transition;
        const newStates: Array<string> = [];
        if (fromState !== "*" && states.indexOf(fromState) === -1) {
            newStates.push(fromState);
        }
        if (toState !== "*" && states.indexOf(toState) === -1) {
            newStates.push(toState);
        }
        return [...states, ...newStates];
    }, []);
    return transitions.reduce((paths, transition) => {
        const newPaths = [];
        const { name, from: fromState, to: toState } = transition;
        const fromStates = fromState === "*" ? allStates : [fromState];
        const toStates = [toState];
        fromStates.forEach(thisFrom => {
            toStates.forEach(thisTo => {
                newPaths.push({ name, from: thisFrom, to: thisTo });
            });
        });
        return [...paths, ...newPaths];
    }, []);
}

export function getPath(context: StateMachineContext, action: string): Transition {
    const state = getState(context);
    return find(context.paths, statePath => statePath.name === action && statePath.from === state);
}

export function transition(context: StateMachineContext, action: string): Promise<void> {
    const state = getState(context);
    const errorPrefix = `Failed transitioning (${action})`;
    const path = getPath(context, action);
    if (!path) {
        const state = getState(context);
        throw new Layerr(
            {
                info: {
                    code: ErrorCode.NoTransition,
                    state,
                    action
                }
            },
            `${errorPrefix}: No transition path found for action '${action}' (state: ${state})`
        );
    }
    const { name: transitionName, from: fromState, to: toState } = path;
    if (context.pending) {
        throw new Layerr(
            {
                info: {
                    code: ErrorCode.TransitionPending,
                    state,
                    action,
                    next: context.next
                }
            },
            `${errorPrefix}: Currently pending a transition: ${state} => ${context.next}`
        );
    }
    const transErrorMsg = `${transitionName} (${fromState} => ${toState})`;
    const tsStart = Date.now();
    context.pending = true;
    context.next = toState;
    return context.events
        .execute("before", transitionName, {
            from: fromState,
            to: toState,
            transition: transitionName
        })
        .then((result: boolean) => {
            if (result === false) {
                throw new Layerr(
                    {
                        info: {
                            code: ErrorCode.TransitionCancelled
                        }
                    },
                    `${errorPrefix}: before event handler cancelled transition: ${transErrorMsg}`
                );
            }
            return context.events.execute("leave", fromState, {
                from: fromState,
                to: toState,
                transition: transitionName
            });
        })
        .then((result: boolean) => {
            if (result === false) {
                throw new Layerr(
                    {
                        info: {
                            code: ErrorCode.TransitionCancelled
                        }
                    },
                    `${errorPrefix}: leave event handler cancelled transition: ${transErrorMsg}`
                );
            }
            // state change now
            context.state = toState;
            context.pending = false;
            context.next = null;
            context.history.push({
                tsStart,
                tsEnd: Date.now(),
                state: toState,
                previous: fromState,
                transition: transitionName
            });
        })
        .then(() =>
            context.events.execute("enter", toState, {
                from: fromState,
                to: toState,
                transition: transitionName
            })
        )
        .then(() =>
            context.events.execute("after", transitionName, {
                from: fromState,
                to: toState,
                transition: transitionName
            })
        )
        .then(() => context.events.emitIdle())
        .catch(err => {
            context.pending = false;
            const { code: errorCode } = Layerr.info(err);
            if (errorCode === ErrorCode.TransitionCancelled) {
                return false;
            }
            throw err;
        }) as Promise<void>;
}

export function verifyTransitions(transitions: Array<Transition>): void {
    if (!Array.isArray(transitions) || transitions.length <= 0) {
        throw new Error("Transitions must be a non-empty array");
    }
    transitions.forEach(transition => {
        ["name", "from", "to"].forEach(strKey => {
            if (typeof transition[strKey] !== "string" || transition[strKey].length <= 0) {
                throw new Layerr(
                    `Invalid transition value for '${strKey}': Must be a non-empty string`
                );
            }
        });
    });
}
