function createStateMachine1() {
    return createStateMachine({
        initial: "ok",
        transitions: [
            { name: "break", from: "ok", to: "damaged" },
            { name: "break", from: "damaged", to: "broken" },
            { name: "fix", from: "*", to: "ok" },
            { name: "embue", from: "ok", to: "invulnerable" }
        ]
    });
}

describe("MSM", function() {
    it("can transfer from state to state", function() {
        const sm = createStateMachine1();
        expect(sm.state).to.equal("ok");
        return Promise.resolve()
            .then(() => sm.transition("break"))
            .then(() => {
                expect(sm.state).to.equal("damaged");
            })
            .then(() => sm.transition("break"))
            .then(() => {
                expect(sm.state).to.equal("broken");
            })
            .then(() => sm.transition("fix"))
            .then(() => {
                expect(sm.state).to.equal("ok");
            })
            .then(() => sm.transition("break"))
            .then(() => sm.transition("fix"))
            .then(() => {
                expect(sm.state).to.equal("ok");
            });
    });
});
