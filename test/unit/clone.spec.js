import { expect } from "chai";
import { cloneArray, cloneObject } from "../../dist/clone.js";

describe("clone", function () {
    describe("cloneArray", function () {
        it("it returns an array with the same contents", function () {
            expect(cloneArray([1, "2", false])).to.deep.equal([1, "2", false]);
        });

        it("returns an array with a difference reference", function () {
            const arr1 = [1, 2];
            const arr2 = cloneArray(arr1);
            arr1.push(3);
            expect(arr2).to.deep.equal([1, 2]);
        });

        it("returns different references for nested objects", function () {
            const arr1 = [1, { two: 2 }];
            const arr2 = cloneArray(arr1);
            arr1[1].three = 3;
            expect(arr2).to.deep.equal([1, { two: 2 }]);
        });
    });

    describe("cloneObject", function () {
        it("it returns an object with the same contents", function () {
            expect(cloneObject({ one: 1, two: "2" })).to.deep.equal({ one: 1, two: "2" });
        });

        it("returns an object with a difference reference", function () {
            const obj1 = { one: 1, two: "2" };
            const obj2 = cloneObject(obj1);
            obj1.two = "3";
            expect(obj2).to.deep.equal({ one: 1, two: "2" });
        });

        it("returns different references for nested objects", function () {
            const obj1 = { one: 1, two: { three: 3 } };
            const obj2 = cloneObject(obj1);
            obj1.two.three = "4";
            expect(obj2).to.deep.equal({ one: 1, two: { three: 3 } });
        });

        it("doesn't clone complex objects", function () {
            class Test {}
            const obj1 = { test: new Test() };
            const obj2 = cloneObject(obj1);
            expect(obj1).to.not.equal(obj2);
            expect(obj1.test).to.equal(obj2.test);
        });
    });
});
