function generatePaths(transitions) {

}

function transitionStateMachine(context, newState) {

}

function verifyTransitions(transitions) {
    if (!Array.isArray(transitions) || transitions.length <= 0) {
        throw new Error("Transitions must be a non-empty array");
    }
    transitions.forEach(transition => {
        ["name", "from", "to"].forEach(strKey => {
            if (typeof transition[strKey] !== "string" || transition[strKey].length <= 0) {
                throw new Error(`Invalid transition value for '${strKey}': Must be a non-empty string`);
            }
        });
    });
}

module.exports = {
    generatePaths,
    transitionStateMachine,
    verifyTransitions
};
