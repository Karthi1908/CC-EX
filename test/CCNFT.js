const { time,  loadFixture,} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("CCNFT", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function ccNFTFixture() {

    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const CCNFT = await ethers.getContractFactory("CCNFT");
    const ccnft = await CCNFT.deploy();

    return { ccnft, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("Issue NFT", async function () {
      const { ccnft,owner, otherAccount } = await loadFixture(ccNFTFixture);
      console.log(owner.address);
      const oaddress = otherAccount.address
      await ccnft.mintVillage(oaddress)
      const balance = await ccnft.balanceOf(oaddress,0)
      expect(1).to.equal(Number(balance.toString()));
      });
    
  });

});
