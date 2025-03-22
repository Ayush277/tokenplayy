const { expect } = require("chai");

const NAME = "TokenMaster";
const SYMBOL = "TM";

describe("TokenMaster", () => {
  let tokenMaster;
  let deployer, buyer;

  beforeEach(async () => {
    [deployer, buyer] = await ethers.getSigners();
    const TokenMaster = await ethers.getContractFactory("TokenMaster");
    tokenMaster = await TokenMaster.deploy(NAME, SYMBOL);
  })
  describe("Deployment", () => {
    it("Sets the name", async () => {
      const name = await tokenMaster.name();
      expect(name).to.equal(NAME);
    });

    it("Sets the symbol", async () => {
      const symbol = await tokenMaster.symbol();
      expect(symbol).to.equal(SYMBOL);
    });

    it("Sets the owner", async () => {
      const owner = await tokenMaster.owner();
      expect(owner).to.equal(deployer.address);
    });
  })
describe("Ocassions", () => {

  it(updates occasions count)
})
})
