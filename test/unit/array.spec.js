const { find } = require("../../source/array.js");

describe("array", function() {
    describe("find", function() {
        it("returns the found value", function() {
            const item = find(
                [{ name: "one" }, { name: "two" }, { name: "three" }],
                target => target.name === "two"
            );
            expect(item).to.deep.equal({ name: "two" });
        });

        it("returns the found value's index", function() {
            const ind = find(
                [{ name: "one" }, { name: "two" }, { name: "three" }],
                target => target.name === "three",
                { index: true }
            );
            expect(ind).to.equal(2);
        });

        it("returns undefined when no item found", function() {
            const item = find([{ name: "one" }], target => target.name === "two");
            expect(item).to.be.undefined;
        });

        it("returns -1 when the index is not found", function() {
            const ind = find([{ name: "one" }], target => target.name === "three", { index: true });
            expect(ind).to.equal(-1);
        });
    });
});
