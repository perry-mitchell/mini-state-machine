const { getState } = require("./state.js");

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
        const toStates = toState === "*" ? allStates : [toState];
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
    return context.paths.find(statePath => statePath.name === action && statePath.from === state);
}

function transitionStateMachine(context, action) {
    const state = getState(context);
    if (context.pending) {
        throw new Error(
            `Failed transitioning: Currently pending a transition from state: ${state}`
        );
    }
    const path = getPath(context, action);
    if (!path) {
        const state = getState(context);
        throw new Error(
            `Failed transitioning: No transition path found for action '${action}' (state: ${state})`
        );
    }
    const { name: transitionName, from: fromState, to: toState } = path;
    const transErrorMsg = `${transitionName} (${fromState} => ${toState})`;
    context.pending = true;
    return context.events
        .executeHandlers("before", transitionName)
        .then(result => {
            if (result === false) {
                throw new Error(
                    `Failed transitioning: before event handler cancelled transition: ${transErrorMsg}`
                );
            }
            return context.events.executeHandlers("leave", fromState);
        })
        .then(result => {
            if (result === false) {
                throw new Error(
                    `Failed transitioning: leave event handler cancelled transition: ${transErrorMsg}`
                );
            }
            // state change now
            context.state = toState;
        })
        .then(() => context.events.executeHandlers("enter", toState))
        .then(() => context.events.executeHandlers("after", transitionName))
        .catch(err => {
            context.pending = false;
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
    transitionStateMachine,
    verifyTransitions
};
