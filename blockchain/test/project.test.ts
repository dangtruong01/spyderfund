import { ethers } from 'hardhat';
import { expect } from 'chai';
import { HardhatEthersSigner } from '@nomicfoundation/hardhat-ethers/signers';
import { Project, Crowdfunding } from '../typechain-types';

describe('Project Contract', () => {
  let crowdfunding: Crowdfunding;
  let signers: HardhatEthersSigner[];
  let projectAddress: string; // Store project address for use in each test
  let project: Project;

  before(async () => {
    const CrowdfundingFactory = await ethers.getContractFactory('Crowdfunding');
    crowdfunding = (await CrowdfundingFactory.deploy()) as Crowdfunding;
    signers = await ethers.getSigners();
    console.log(`Crowdfunding Contract Address: ${crowdfunding.getAddress}`);

    const owner = signers[0];
    const creator = signers[1];
    const donor = signers[2];
    await crowdfunding.connect(owner).addCreator(creator.address);
    await crowdfunding.connect(owner).addDonor(donor.address);
  });

  it('should allow creator to create a new project', async () => {
    // Common setup for each test: creating a new project
    const owner = signers[0];
    const creator = signers[1];
    const projectTitle = 'My Project';
    const projectDesc = 'Description of the project';
    const minContribution = ethers.parseEther('0.1');
    const deadline = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
    const targetContribution = ethers.parseEther('1');

    const projectTx = await crowdfunding
      .connect(creator)
      .createProject(minContribution, deadline, targetContribution, projectTitle, projectDesc);
    await projectTx.wait();

    // Get the event from transaction receipt
    const [event] = await crowdfunding.queryFilter(crowdfunding.filters.ProjectStarted());
    projectAddress = event.args[0];

    expect(projectAddress).to.be.properAddress; // Check if the project address is valid

    // Attach the Project contract
    const ProjectFactory = await ethers.getContractFactory('Project');
    project = (ProjectFactory.attach(projectAddress)) as Project;

    // Verify project details
    const projectDetails = await project.getProjectDetails();
    expect(projectDetails.title).to.equal(projectTitle);
    expect(projectDetails.desc).to.equal(projectDesc);
    expect(projectDetails.projectStarter).to.equal(creator.address);
    expect(projectDetails.minContribution).to.equal(minContribution);
    expect(projectDetails.projectDeadline).to.equal(deadline);
    expect(projectDetails.goalAmount).to.equal(targetContribution);
  });


  it('should allow donations', async () => {
    const donor = signers[2];

    // Record donor's balance before the contribution
    const donorBalanceBefore = await ethers.provider.getBalance(donor.address);

    const contributeAmount = ethers.parseEther('0.2');
    const contributeTx = await crowdfunding.connect(donor).contribute(projectAddress, { value: contributeAmount });
    const receipt = await contributeTx.wait();

    if (!receipt) {
      throw new Error("Transaction receipt is null");
    }

    // Calculate the expected donor's balance after the contribution
    // taking into account the gas used in the transaction
    const gasUsed = receipt.cumulativeGasUsed * receipt.gasPrice;
    const expectedBalance = donorBalanceBefore - contributeAmount - gasUsed;

    // Check the donor's balance after the transaction
    const donorBalanceAfter = await ethers.provider.getBalance(donor.address);
    expect(donorBalanceAfter).to.equal(expectedBalance);

    // Check the project's state
    const projectState = await project.state();
    expect(projectState).to.equal(0); // Assuming 0 represents the correct state

    // Optionally, check the project's raised amount
    const raisedAmount = await project.raisedAmount();
    expect(raisedAmount).to.be.at.least(contributeAmount);
  });

});
