import { ethers } from "hardhat";

async function main() {
  const currentTimestampInSeconds = Math.round(Date.now() / 1000);
  const unlockTime = currentTimestampInSeconds + 60;

  const lockedAmount = ethers.parseEther("0.001");

  // // Deploy the CrowdFund contract
  // const crowdfundFactory = await ethers.getContractFactory('CrowdFund');
  // const crowdfund = await crowdfundFactory.deploy('0xA0b73E1Ff0B80914AB6fe0444E65848C4C34450b');

  //Deploy the Crowdfunding contract
  const crowdfundingFactory = await ethers.getContractFactory('Crowdfunding');
  const crowdfunding = await crowdfundingFactory.deploy();

  console.log(
    `Lock with ${ethers.formatEther(
      lockedAmount
    )}ETH and unlock timestamp ${unlockTime} deployed to ${crowdfunding.target}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
