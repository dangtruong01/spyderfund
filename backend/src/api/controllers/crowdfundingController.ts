import { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { ethers } from 'ethers';

import CrowdfundingContractABI from '../../../../blockchain/artifacts/contracts/Crowdfunding.sol/Crowdfunding.json';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
const contractAddress = process.env.CROWDFUNDING_CONTRACT_ADDRESS || "";
const contractABI = CrowdfundingContractABI.abi;

const contract = new ethers.Contract(
    contractAddress,
    contractABI,
    provider
);

export const createProject = async (req: Request, res: Response) => {
    const { minimumContribution, deadline, targetContribution, projectTitle, projectDesc } = req.body;
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY || "", provider);
    const contractWithSigner = contract.connect(wallet);

    try {
        const tx = await contractWithSigner.createProject(
            ethers.utils.parseUnits(minimumContribution.toString(), 'ether'),
            deadline,
            ethers.utils.parseUnits(targetContribution.toString(), 'ether'),
            projectTitle,
            projectDesc
        );
        await tx.wait();
        res.status(200).json({ message: 'Project created successfully', tx });
    } catch (error) {
        const err = error as Error;
        res.status(500).json({ error: err.message });
    }
}

export const getAllProjects = async (req: Request, res: Response) => {
    try {
        const projects = await contract.returnAllProjects();
        res.status(200).json({ projects });
    } catch (error) {
        const err = error as Error;
        res.status(500).json({ error: err.message });
    }
};

export const contributeToProject = async (req: Request, res: Response) => {
    const { projectAddress, contributorAddress, amount } = req.body;
    // donor
    const wallet = new ethers.Wallet(contributorAddress, provider);
    const contractWithSigner = contract.connect(wallet);

    try {
        const tx = await contractWithSigner.contribute(projectAddress, {
            value: ethers.utils.parseUnits(amount.toString(), 'ether')
        });
        await tx.wait();
        res.status(200).json({ message: 'Contribution made successfully', tx });
    } catch (error) {
        const err = error as Error;
        res.status(500).json({ error: err.message });
    }
}