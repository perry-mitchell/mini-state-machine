const { getState } = require("./state.js");
const { find } = require("./array.js");

const ERR_CODE_TRANSITION_CANCELLED = "TRANSITION_CANCELLED";

function generatePaths(transitions) {
    const allStates = transitions.reduce((states, transition) => {
        const { from: fromState, to: toState } = transition;
        const newStates = [];
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

function getPath(context, action) {
    const state = getState(context);
    return find(context.paths, statePath => statePath.name === action && statePath.from === state);
}

function transition(context, action) {
    const state = getState(context);
    const errorPrefix = "Failed transitioning";
    if (context.pending) {
        throw new Error(`${errorPrefix}: Currently pending a transition from state: ${state}`);
    }
    const path = getPath(context, action);
    if (!path) {
        const state = getState(context);
        throw new Error(
            `${errorPrefix}: No transition path found for action '${action}' (state: ${state})`
        );
    }
    const { name: transitionName, from: fromState, to: toState } = path;
    const transErrorMsg = `${transitionName} (${fromState} => ${toState})`;
    context.pending = true;
    return context.events
        .execute("before", transitionName, {
            from: fromState,
            to: toState,
            transition: transitionName
        })
        .then(result => {
            if (result === false) {
                const err = new Error(
                    `${errorPrefix}: before event handler cancelled transition: ${transErrorMsg}`
                );
                err.code = ERR_CODE_TRANSITION_CANCELLED;
                throw err;
            }
            return context.events.execute("leave", fromState, {
                from: fromState,
                to: toState,
                transition: transitionName
            });
        })
        .then(result => {
            if (result === false) {
                const err = new Error(
                    `${errorPrefix}: leave event handler cancelled transition: ${transErrorMsg}`
                );
                err.code = ERR_CODE_TRANSITION_CANCELLED;
                throw err;
            }
            // state change now
            context.state = toState;
            context.pending = false;
        })
        .then(() =>
            context.events.execute("enter", toState, {
                parallel: true,
                from: fromState,
                to: toState,
                transition: transitionName
            })
        )
        .then(() =>
            context.events.execute("after", transitionName, {
                parallel: true,
                from: fromState,
                to: toState,
                transition: transitionName
            })
        )
        .then(() => true)
        .catch(err => {
            context.pending = false;
            if (err.code === ERR_CODE_TRANSITION_CANCELLED) {
                return false;
            }
            throw err;
        });
}

function verifyTransitions(transitions) {
    if (!Array.isArray(transitions) || transitions.length <= 0) {
        throw new Error("Transitions must be a non-empty array");
    }
    transitions.forEach(transition => {
        ["name", "from", "to"].forEach(strKey => {
            if (typeof transition[strKey] !== "string" || transition[strKey].length <= 0) {
                throw new Error(
                    `Invalid transition value for '${strKey}': Must be a non-empty string`
                );
            }
        });
    });
}

module.exports = {
    generatePaths,
    getPath,
    transition,
    verifyTransitions
};
