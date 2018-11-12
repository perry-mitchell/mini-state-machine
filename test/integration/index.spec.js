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
    describe("is", function() {
        it("detects current state correctly", function() {
            const sm = createStateMachine1();
            expect(sm.is("ok")).to.be.true;
            return sm.transition("break").then(() => {
                expect(sm.is("damaged")).to.be.true;
                expect(sm.is("ok")).to.be.false;
            });
        });
    });

    describe("can", function() {
        it("detects possible transitions correctly", function() {
            const sm = createStateMachine1();
            expect(sm.can("break")).to.be.true;
            expect(sm.can("fix")).to.be.true;
            expect(sm.can("embue")).to.be.true;
            return sm
                .transition("break")
                .then(() => sm.transition("break"))
                .then(() => {
                    expect(sm.is("broken")).to.be.true;
                    expect(sm.can("break")).to.be.false;
                    expect(sm.can("embue")).to.be.false;
                });
        });
    });

    describe("cannot", function() {
        it("detects impossible transitions correctly", function() {
            const sm = createStateMachine1();
            expect(sm.cannot("break")).to.be.false;
            expect(sm.cannot("fix")).to.be.false;
            expect(sm.cannot("embue")).to.be.false;
            return sm
                .transition("break")
                .then(() => sm.transition("break"))
                .then(() => {
                    expect(sm.is("broken")).to.be.true;
                    expect(sm.cannot("break")).to.be.true;
                    expect(sm.cannot("embue")).to.be.true;
                });
        });
    });

    describe("transition", function() {
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
});
