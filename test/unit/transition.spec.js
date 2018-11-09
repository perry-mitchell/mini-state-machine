const { generatePaths, getPath } = require("../../source/transition.js");

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
});
