import dotenv from 'dotenv'
import path from 'path'
import { ethers } from 'ethers';
import { abi as CrowdfundingABI } from '../artifacts/contracts/Crowdfunding.sol/Crowdfunding.json'

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Connect to the Ethereum network
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL); // e.g., Infura URL
const signer = new ethers.Wallet(process.env.PRIVATE_KEY || '', provider);

// Contract details
const contractAddress = process.env.CROWDFUNDING_CONTRACT_ADDRESS || '';

// Create a contract instance
const crowdfundingContract = new ethers.Contract(contractAddress, CrowdfundingABI, signer);

// Add a creator
async function addCreator(creatorAddress: string) {
    try {
        const tx = await crowdfundingContract.addCreator(creatorAddress);
        await tx.wait();
        console.log(`Creator added: ${creatorAddress}`);
    } catch (error) {
        console.error(`Error adding creator: ${error}`);
    }
}

// Example usage
addCreator(process.env.ETH_ADDRESS || '');
