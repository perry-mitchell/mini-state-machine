import { expect } from "chai";
import { createStateMachine } from "../../dist/factory.js";

describe("factory", function() {
    describe("createStateMachine", function() {
        beforeEach(function() {
            this.sm = createStateMachine({
                initial: "ready",
                transitions: [
                    { name: "work", from: "ready", to: "working" },
                    { name: "finish", from: "working", to: "finished" },
                    { name: "prepare", from: "finished", to: "ready" }
                ]
            });
        });

        it("returns an interface that has a state", function() {
            expect(this.sm.state).to.equal("ready");
        });

        it("returns an interface that has a pending state", function() {
            expect(this.sm.pending).to.be.a("boolean");
        });

        it("returns an interface that has a transition method", function() {
            expect(this.sm)
                .to.have.property("transition")
                .that.is.a("function");
        });
    });
});
