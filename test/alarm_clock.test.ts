import { expect } from "chai";
// import { use, project } from "hardhat/config";
import { ethers } from "hardhat";
import { AlarmClock } from "../typechain/AlarmClock";

// use(project.extendLibraries());

describe("AlarmClock", () => {
  let alarmClock: AlarmClock;
  let owner: string;

  beforeEach(async () => {
    // Deploy a new instance of the contract
    const alarmClockFactory = await ethers.getContractFactory("AlarmClock");
    const [ownerSigner] = await ethers.getSigners();
    alarmClock = await alarmClockFactory.deploy();
    alarmClock.connect(ownerSigner);

    // Get the contract owner
    owner = ownerSigner.address;
  });

  // Test the constructor
  describe("constructor", () => {
    it("should set the contract owner", async () => {
      // Expect the contract owner to be the first account
      expect(owner).to.equal(await ethers.provider.getSigner(0).getAddress());
    });

    it("should set the initial timeout", async () => {
      // Get the initial timeout
      const timeout = await alarmClock.timeout();

      // Expect the timeout to be 24 hours from now
      expect(timeout.toNumber()).to.be.closeTo(Date.now() / 1000 + 24 * 60 * 60, 10);
    });
  });

  // Test the removeFunds function
  describe("removeFunds", () => {
    it("should allow anyone to remove funds after the timeout", async () => {
      // Send some funds to the contract
      console.log(alarmClock.signer);
      await alarmClock.signer.sendTransaction({ to: alarmClock.address, value: ethers.utils.parseEther("1") });

      // Fast-forward to after the timeout
      await ethers.provider.send("evm_increaseTime", [24 * 60 * 60 + 1]);
      await ethers.provider.send("evm_mine", []);

      // Remove the funds from the contract
      await alarmClock.functions.removeFunds();

      // Get the contract balance after removing funds
      const balanceAfter = await ethers.provider.getBalance(alarmClock.address);

      // Expect the contract balance to be zero
      expect(balanceAfter.toNumber()).to.be.equal(0);
    });

    it("should not allow anyone to remove funds before the timeout", async () => {
      // Send some funds to the contract
      await alarmClock.signer.sendTransaction({ to: alarmClock.address, value: ethers.utils.parseEther("1") });

      // Try to remove the funds from the contract before the timeout
      try {
        await alarmClock.functions.removeFunds();
      } catch (error: any) {
        // Expect the transaction to fail
        expect(error.message).to.include("Timeout has not occurred");
      }

      // Get the contract balance after the failed transaction
      const balanceAfter = await ethers.provider.getBalance(alarmClock.address);

      // Expect the contract balance to be unchanged
      expect(balanceAfter.toNumber()).to.equal(ethers.utils.parseEther("1"));
    });
  });

  describe("postponeTimeout", () => {
    it("should allow the contract owner to postpone the timeout", async () => {
      // Get the initial timeout
      const timeoutBefore = await alarmClock.timeout();

      // Postpone the timeout
      await alarmClock.functions.postponeTimeout();

      // Get the postponed timeout
      const timeoutAfter = await alarmClock.timeout();

      // Expect the timeout to be postponed by 24 hours
      expect(timeoutAfter.toNumber()).to.be.closeTo(timeoutBefore.toNumber() + 24 * 60 * 60, 10);
    });

    it("should not allow anyone other than the contract owner to postpone the timeout", async () => {
      // Try to postpone the timeout as a different account
      try {
        await alarmClock.functions.postponeTimeout({ from: (await ethers.provider.listAccounts())[1] });
      } catch (error: any) {
        // Expect the transaction to fail
        expect(error.message).to.include("Only the contract owner can postpone the timeout");
      }

      // Get the timeout after the failed transaction
      const timeoutAfter = await alarmClock.timeout();

      // Expect the timeout to be unchanged
      expect(timeoutAfter.toNumber()).to.be.closeTo(Date.now() / 1000 + 24 * 60 * 60, 10);
    });
  });
  describe("setTimeout", () => {
    it("should allow the contract owner to set the timeout", async () => {
      // Set the timeout to one hour from now
      const tx = await alarmClock.functions.setTimeout(Math.round(Date.now() / 1000 + 1 * 60 * 60));

      // Expect the transaction to be successful
      // expect(tx.status).to.be.true;

      // Get the new timeout
      const timeout = await alarmClock.timeout();

      // Expect the timeout to be one hour from now
      expect(timeout.toNumber()).to.be.closeTo(Date.now() / 1000 + 1 * 60 * 60, 10);
    });

    it("should not allow anyone other than the contract owner to set the timeout", async () => {
      // Try to set the timeout as a different account
      try {
        await alarmClock.functions.setTimeout(Math.round(Date.now() / 1000 + 1 * 60 * 60), {
          from: (await ethers.provider.listAccounts())[1],
        });
      } catch (error: any) {
        // Expect the transaction to fail
        expect(error.message).to.include("Only the contract owner can set the timeout");
      }

      // Get the timeout after the failed transaction
      const timeoutAfter = await alarmClock.timeout();

      // Expect the timeout to be unchanged
      expect(timeoutAfter.toNumber()).to.be.closeTo(Date.now() / 1000 + 24 * 60 * 60, 10);
    });
  });
});
