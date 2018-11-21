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

    describe("getHistory", function() {
        beforeEach(function() {
            this.sm = createStateMachine1();
            return Promise.resolve()
                .then(() => this.sm.transition("break"))
                .then(() => this.sm.transition("break"))
                .then(() => this.sm.transition("fix"))
                .then(() => this.sm.transition("break"))
                .then(() => this.sm.transition("fix"));
        });

        it("returns an array of history items", function() {
            const history = this.sm.getHistory();
            expect(history).to.be.an("array");
            expect(history).to.have.length.above(0);
            history.forEach(item => {
                expect(item)
                    .to.have.property("ts")
                    .that.is.a("number");
                expect(item)
                    .to.have.property("state")
                    .that.is.a("string");
                expect(item)
                    .to.have.property("previous")
                    .that.is.a("string");
                expect(item)
                    .to.have.property("transition")
                    .that.is.a("string");
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

        it("fires correct event properties for 'before' event", function(done) {
            const sm = createStateMachine1();
            sm.once("before", "break", info => {
                expect(info).to.have.property("from", "ok");
                expect(info).to.have.property("to", "damaged");
                expect(info).to.have.property("transition", "break");
                done();
            });
            sm.transition("break");
        });

        it("fires correct event properties for 'after' event", function(done) {
            const sm = createStateMachine1();
            sm.once("after", "break", info => {
                expect(info).to.have.property("from", "ok");
                expect(info).to.have.property("to", "damaged");
                expect(info).to.have.property("transition", "break");
                done();
            });
            sm.transition("break");
        });

        it("fires correct event properties for 'leave' event", function(done) {
            const sm = createStateMachine1();
            sm.once("leave", "ok", info => {
                expect(info).to.have.property("from", "ok");
                expect(info).to.have.property("to", "damaged");
                expect(info).to.have.property("transition", "break");
                done();
            });
            sm.transition("break");
        });

        it("fires correct event properties for 'enter' event", function(done) {
            const sm = createStateMachine1();
            sm.once("enter", "damaged", info => {
                expect(info).to.have.property("from", "ok");
                expect(info).to.have.property("to", "damaged");
                expect(info).to.have.property("transition", "break");
                done();
            });
            sm.transition("break");
        });
    });
});
