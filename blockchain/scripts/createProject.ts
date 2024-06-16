import dotenv from 'dotenv'
import path from 'path'
import { ethers } from 'ethers';
import { abi as CrowdfundingABI } from '../artifacts/contracts/Crowdfunding.sol/Crowdfunding.json'

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const creator = process.env.ETH_ADDRESS;
const projectTitle = 'Green Future Initiative';
const projectDesc = 'A project focused on developing sustainable, eco-friendly urban solutions.';
const minContribution = ethers.parseEther('0.0001');
const oneYearInSeconds = 365 * 24 * 60 * 60; // Seconds in a standard year
const deadline = Math.floor(Date.now() / 1000) + oneYearInSeconds; // 1 year from now
const targetContribution = ethers.parseEther('1');

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL); // e.g., Infura URL
const signer = new ethers.Wallet(process.env.PRIVATE_KEY || '', provider);

// Contract details
const contractAddress = process.env.CROWDFUNDING_CONTRACT_ADDRESS || '';

// Create a contract instance
const crowdfundingContract = new ethers.Contract(contractAddress, CrowdfundingABI, signer);

async function createProject() {
    const projectTx = await crowdfundingContract
        .createProject(
            minContribution, deadline, targetContribution, projectTitle, projectDesc
        );
    await projectTx.wait();
}

createProject();