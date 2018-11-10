const {
    generatePaths,
    getPath,
    transition,
    verifyTransitions
} = require("../../source/transition.js");

describe("transition", function() {
    describe("generatePaths", function() {
        beforeEach(function() {
            this.transitions = [
                { name: "break", from: "ok", to: "damaged" },
                { name: "break", from: "damaged", to: "broken" },
                { name: "fix", from: "*", to: "ok" }
            ];
        });

        it("returns an array with at least as many items as provided", function() {
            const paths = generatePaths(this.transitions);
            expect(paths).to.have.lengthOf.at.least(this.transitions.length);
        });

        it("expands asterisks", function() {
            const paths = generatePaths(this.transitions);
            const fixPaths = paths
                .filter(path => path.name === "fix")
                .map(path => `${path.from},${path.to}`);
            expect(fixPaths).to.contain("broken,ok");
            expect(fixPaths).to.contain("damaged,ok");
            expect(fixPaths).to.contain("ok,ok");
        });
    });

    describe("getPath", function() {
        beforeEach(function() {
            this.transitions = [
                { name: "break", from: "ok", to: "damaged" },
                { name: "break", from: "damaged", to: "broken" },
                { name: "fix", from: "*", to: "ok" }
            ];
            this.paths = generatePaths(this.transitions);
        });

        it("returns the correct path", function() {
            const path = getPath({ state: "damaged", paths: this.paths }, "break");
            expect(path).to.deep.equal({ name: "break", from: "damaged", to: "broken" });
        });

        it("returns undefined if the path isn't found", function() {
            const path = getPath({ state: "broken", paths: this.paths }, "break");
            expect(path).to.be.undefined;
        });
    });

    describe("transition", function() {
        beforeEach(function() {
            this.context = {
                paths: generatePaths([
                    { name: "break", from: "ok", to: "damaged" },
                    { name: "break", from: "damaged", to: "broken" },
                    { name: "fix", from: "*", to: "ok" },
                    { name: "fix", from: "ok", to: "invulnerable" }
                ]),
                events: {
                    execute: sinon.stub().callsFake(() => Promise.resolve())
                },
                pending: false,
                state: "ok"
            };
        });

        it("performs transitions", function() {
            return transition(this.context, "break").then(() => {
                expect(this.context.state).to.equal("damaged");
                expect(this.context.pending).to.be.false;
            });
        });

        it("calls all event handlers in the correct order", function() {
            return transition(this.context, "break").then(() => {
                expect(this.context.events.execute.calledWithExactly("before", "break")).to.be.true;
                expect(this.context.events.execute.calledWithExactly("after", "break")).to.be.true;
                expect(this.context.events.execute.calledWithExactly("leave", "ok")).to.be.true;
                expect(this.context.events.execute.calledWithExactly("enter", "damaged")).to.be
                    .true;
                expect(this.context.events.execute.getCall(0).args).to.deep.equal([
                    "before",
                    "break"
                ]);
                expect(this.context.events.execute.getCall(1).args).to.deep.equal(["leave", "ok"]);
                expect(this.context.events.execute.getCall(2).args).to.deep.equal([
                    "enter",
                    "damaged"
                ]);
                expect(this.context.events.execute.getCall(3).args).to.deep.equal([
                    "after",
                    "break"
                ]);
            });
        });

        it("fails immediately if the machine is in pending state", function() {
            this.context.pending = true;
            expect(() => {
                transition(this.context, "break");
            }).to.throw(/Currently pending a transition from state: ok/i);
        });

        it("fails immediately if a path is requested that doesn't exist", function() {
            this.context.state = "invulnerable";
            expect(() => {
                transition(this.context, "break");
            }).to.throw(/No transition path found for action 'break' \(state: invulnerable\)/i);
        });

        it("supports cancellations in 'before' event callbacks (return value)", function() {
            this.context.events.execute.callsFake((type, target) => {
                if (type === "before") {
                    return Promise.resolve(false);
                }
                return Promise.resolve();
            });
            return expect(transition(this.context, "break"))
                .to.eventually.equal(false)
                .then(() => {
                    expect(this.context.state).to.equal("ok");
                });
        });

        it("supports cancellations in 'before' event callbacks (rejection)", function() {
            this.context.events.execute.callsFake((type, target) => {
                if (type === "before") {
                    return Promise.reject(new Error("Some internal error"));
                }
                return Promise.resolve();
            });
            return expect(transition(this.context, "break"))
                .to.be.rejectedWith(/Some internal error/)
                .then(() => {
                    expect(this.context.state).to.equal("ok");
                });
        });

        it("supports cancellations in 'leave' event callbacks (return value)", function() {
            this.context.events.execute.callsFake((type, target) => {
                if (type === "leave") {
                    return Promise.resolve(false);
                }
                return Promise.resolve();
            });
            return expect(transition(this.context, "break"))
                .to.eventually.equal(false)
                .then(() => {
                    expect(this.context.state).to.equal("ok");
                });
        });

        it("supports cancellations in 'leave' event callbacks (rejection)", function() {
            this.context.events.execute.callsFake((type, target) => {
                if (type === "leave") {
                    return Promise.reject(new Error("Some internal error"));
                }
                return Promise.resolve();
            });
            return expect(transition(this.context, "break"))
                .to.be.rejectedWith(/Some internal error/)
                .then(() => {
                    expect(this.context.state).to.equal("ok");
                });
        });
    });

    describe("verifyTransitions", function() {
        it("verifies transitions successfully", function() {
            expect(() =>
                verifyTransitions([
                    { name: "break", from: "ok", to: "damaged" },
                    { name: "break", from: "damaged", to: "broken" },
                    { name: "fix", from: "*", to: "ok" }
                ])
            ).to.not.throw();
        });

        it("verifies transitions and throws if 'name' missing", function() {
            expect(() =>
                verifyTransitions([
                    { name: "", from: "ok", to: "damaged" },
                    { name: "break", from: "damaged", to: "broken" },
                    { name: "fix", from: "*", to: "ok" }
                ])
            ).to.throw(/Invalid transition value for 'name'/i);
        });

        it("verifies transitions and throws if 'from' missing", function() {
            expect(() =>
                verifyTransitions([
                    { name: "break", from: "ok", to: "damaged" },
                    { name: "break", to: "broken" },
                    { name: "fix", from: "*", to: "ok" }
                ])
            ).to.throw(/Invalid transition value for 'from'/i);
        });

        it("verifies transitions and throws if 'to' missing", function() {
            expect(() =>
                verifyTransitions([
                    { name: "break", from: "ok", to: "damaged" },
                    { name: "break", from: "damaged", to: "broken" },
                    { name: "fix", from: "*" }
                ])
            ).to.throw(/Invalid transition value for 'to'/i);
        });

        it("throws if the transitions array is empty", function() {
            expect(() => verifyTransitions([])).to.throw(/Transitions must be a non-empty array/i);
        });
    });
});
