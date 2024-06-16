import { ethers } from 'hardhat';
import { expect } from 'chai';
import { HardhatEthersSigner } from '@nomicfoundation/hardhat-ethers/signers';
import { Project, Crowdfunding } from '../typechain-types';

describe('Crowdfunding', () => {
  let crowdfunding: Crowdfunding;
  let signers: HardhatEthersSigner[];
  let projectAddress: string; // Store project address for use in each test
  let project: Project;

  before(async () => {
    const CrowdfundingFactory = await ethers.getContractFactory('Crowdfunding');
    crowdfunding = (await CrowdfundingFactory.deploy()) as Crowdfunding;
    signers = await ethers.getSigners();
    console.log(`Crowdfunding Contract Address: ${crowdfunding.getAddress}`);
  });

  it('should allow the owner to add a creator', async () => {
    const owner = signers[0];
    const creator = signers[1];
    await crowdfunding.connect(owner).addCreator(creator.address);
    const isCreator = await crowdfunding.creators(creator.address);
    expect(isCreator).to.be.true;
  });

  it('should allow the owner to add a donor', async () => {
    const owner = signers[0];
    const creator = signers[1];
    const donor = signers[2];
    await crowdfunding.connect(owner).addDonor(donor.address);
    expect(await crowdfunding.donors(donor.address)).to.be.true;
  });

  it('should add creator by owner', async () => {
    // Common setup for each test: creating a new project
    const owner = signers[0];
    const creator = signers[1];

    await crowdfunding.connect(owner).addCreator(creator.address);
    // Verify if the creator was added
    const isCreatorAdded = await crowdfunding.creators(creator.address);
    expect(isCreatorAdded).to.be.true;
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
      .createProject(
        minContribution, deadline, targetContribution, projectTitle, projectDesc
      );
    await projectTx.wait();

    const [event] = await crowdfunding.queryFilter(crowdfunding.filters.ProjectStarted());
    projectAddress = event.args[0];

    expect(projectAddress).to.be.properAddress;

    const ProjectFactory = await ethers.getContractFactory('Project');
    project = (ProjectFactory.attach(projectAddress)) as Project;

    const projectDetails = await project.getProjectDetails();
    expect(projectDetails.title).to.equal(projectTitle);
    expect(projectDetails.desc).to.equal(projectDesc);
    expect(projectDetails.projectStarter).to.equal(creator.address);
    expect(projectDetails.minContribution).to.equal(minContribution);
    expect(projectDetails.projectDeadline).to.equal(deadline);
    expect(projectDetails.goalAmount).to.equal(targetContribution);
  });

  it('should retrieve project details correctly', async () => {
    // Retrieve project details
    const [projectStarter, minimumContribution, projectDeadline, goalAmount, completedTime, currentAmount, title, desc, currentState, balance] = await project.getProjectDetails();

    // Assertions
    const creator = signers[1];
    expect(title).to.equal('My Project'); // Assuming projectTitle is 'My Project' in beforeEach
    expect(desc).to.equal('Description of the project'); // Assuming projectDesc is 'Description of the project' in beforeEach
    expect(projectStarter).to.equal(creator.address);
    expect(minimumContribution).to.equal(ethers.parseEther('0.1')); // Assuming minContribution is 0.1 ETH in beforeEach
  });

  it('should return all projects', async () => {
    // Call returnAllProjects to get the list of projects
    const allProjects = await crowdfunding.returnAllProjects();

    // Check the number of projects returned
    expect(allProjects.length).to.equal(1);
  });

  it('should allow a donor to contribute to a fundraising project', async () => {
    const owner = signers[0];
    const creator = signers[1];
    const donor = signers[2];

    // Get the project's minimum contribution amount
    const [projectStarter, minimumContribution, projectDeadline, goalAmount, completedTime, currentAmount, title, desc, currentState, balance] = await project.getProjectDetails();

    // Connect the donor to the contract and make a contribution
    const contributionAmount = minimumContribution;
    const contributeTx = await crowdfunding.connect(donor).contribute(projectAddress, { value: contributionAmount });

    // Wait for the contribution transaction to be mined
    await contributeTx.wait();

    // Verify that the ContributionReceived event was emitted
    const [contributionEvent] = await crowdfunding.queryFilter(crowdfunding.filters.ContributionReceived());
    expect(contributionEvent.args[0]).to.equal(projectAddress);
    expect(contributionEvent.args[1]).to.equal(contributionAmount);
    expect(contributionEvent.args[2]).to.equal(donor.address);

    // Verify that the contribution was successful
    const [updatedProjectStarter, updatedMinimumContribution, updatedProjectDeadline, updatedGoalAmount, updatedCompletedTime, updatedCurrentAmount, updatedTitle, updatedDesc, updatedCurrentState, updatedBalance] = await project.getProjectDetails();
    expect(updatedCurrentAmount).to.equal(contributionAmount);
  });

});
