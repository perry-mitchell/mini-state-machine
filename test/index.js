const chai = require("chai");
const sinon = require("sinon");
const chaiAsPromised = require("chai-as-promised");

const { expect } = chai;

chai.use(chaiAsPromised);
Object.assign(global, {
    expect,
    sinon
});
