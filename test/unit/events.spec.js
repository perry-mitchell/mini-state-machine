import { expect } from "chai";
import sinon from "sinon";
import { createEventsInterface } from "../../dist/events.js";

describe("events", function () {
    describe("createEventsInterface", function () {
        beforeEach(function () {
            this.events = createEventsInterface();
            this.handlers = this.events["@@handlers"];
        });

        describe("add", function () {
            it("adds handlers", function () {
                expect(this.handlers).to.have.lengthOf(0);
                this.events.add("after", "action", () => {});
                expect(this.handlers).to.have.lengthOf(1);
            });

            it("returns expected payload", function () {
                const result = this.events.add("after", "action", () => {});
                expect(result).to.have.property("remove").that.is.a("function");
            });

            it("supports removing handlers by calling 'remove'", function () {
                const result = this.events.add("after", "action", () => {});
                expect(result.remove).to.not.throw();
                expect(this.handlers).to.have.lengthOf(0);
            });

            it("does not throw when 'remove' called multiple times", function () {
                const result = this.events.add("after", "action", () => {});
                expect(result.remove).to.not.throw();
                expect(result.remove).to.not.throw();
            });
        });

        describe("execute", function () {
            it("executes correct handlers", function () {
                const one = sinon.spy();
                const two = sinon.spy();
                const three = sinon.spy();
                const four = sinon.spy();
                this.events.add("after", "action", one);
                this.events.add("after", "action", two);
                this.events.add("before", "action", three);
                this.events.add("after", "action2", four);
                return this.events.execute("after", "action").then(() => {
                    expect(one.calledOnce).to.be.true;
                    expect(two.calledOnce).to.be.true;
                    expect(three.notCalled).to.be.true;
                    expect(four.notCalled).to.be.true;
                });
            });

            it("provides expected information to callbacks", function () {
                const cb = sinon.spy();
                this.events.add("before", "action", cb);
                return this.events
                    .execute("before", "action", { from: "a", to: "b", transition: "action" })
                    .then(() => {
                        expect(cb.calledOnce).to.be.true;
                        expect(cb.calledWithExactly({ from: "a", to: "b", transition: "action" }))
                            .to.be.true;
                    });
            });
        });

        describe("remove", function () {
            it("removes listeners", function () {
                const cb = sinon.spy();
                this.events.add("after", "action", cb);
                this.events.remove("after", "action", cb);
                expect(this.handlers).to.have.lengthOf(0);
                return this.events.execute("after", "action").then(() => {
                    expect(cb.notCalled).to.be.true;
                });
            });
        });
    });
});
