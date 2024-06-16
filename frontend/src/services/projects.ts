import dotenv from 'dotenv';
import path from 'path';
import { BigNumber, ethers } from 'ethers';
import { abi as CrowdfundingABI } from '../../contracts/Crowdfunding.json';
import { abi as ProjectABI } from '../../contracts/Project.json';
import { ProjectDetails, ProjectDonation } from '@/types/ProjectTypes';
import { Crowdfunding, Project } from 'typechain-types';


export async function connectWallet() {
    if (window.ethereum) {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            console.log(accounts[0])
            return accounts[0]; // Returns the first account
        } catch (error) {
            console.error('Error connecting wallet:', error);
        }
    } else {
        console.error('MetaMask is not installed');
    }
}

export async function getAllProjects() {

    try {
        const contractAddress = import.meta.env.VITE_CROWDFUNDING_CONTRACT_ADDRESS;
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const crowdfundingContract = new ethers.Contract(contractAddress, CrowdfundingABI, signer);

        // Get the array of project addresses
        const projectAddresses = await crowdfundingContract.returnAllProjects();
        if (projectAddresses.length === 0) {
            console.log("No projects found")
            return [];
        }
        console.log('All project addresses:', projectAddresses);

        // Fetch details for each project
        const projectsDetails = await Promise.all(projectAddresses.map(async (address: string) => {
            const projectContract = new ethers.Contract(address, ProjectABI, signer);
            const details = await projectContract.getProjectDetails();

            return {
                address: address,
                projectStarter: details[0],
                minContribution: ethers.utils.formatEther(details[1]), // Convert BigNumber to a readable string
                deadline: new Date(details[2].toNumber() * 1000),
                goalAmount: ethers.utils.formatEther(details[3]), // Convert BigNumber to a readable string
                completedTime: details[4].toString(),
                currentAmount: ethers.utils.formatEther(details[5]), // Convert BigNumber to a readable string
                title: details[6],
                description: details[7],
                state: details[8].toString(),
                balance: ethers.utils.formatEther(details[9]), // Convert BigNumber to a readable string
            };
        }));

        console.log('All projects details:', projectsDetails);
        return projectsDetails;
    } catch (error) {
        console.error('Error fetching all projects:', error);
        return [];
    }
}


export async function createProject() {

}

export async function getAProjectDetail(projectAddress: string): Promise<ProjectDetails | null> {

    try {
        // Assuming your environment variables and provider are set up correctly
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const projectContract = new ethers.Contract(projectAddress, ProjectABI, signer);

        const details = await projectContract.getProjectDetails();

        return {
            address: projectAddress,
            projectStarter: details[0],
            minContribution: ethers.utils.formatEther(details[1]), // Convert BigNumber to a readable string
            deadline: new Date(details[2].toNumber() * 1000), // Convert timestamp to Date object
            goalAmount: ethers.utils.formatEther(details[3]), // Convert BigNumber to a readable string
            completedTime: new Date(details[4].toNumber() * 1000), // Convert timestamp to Date object
            currentAmount: ethers.utils.formatEther(details[5]), // Convert BigNumber to a readable string
            title: details[6],
            description: details[7],
            state: details[8].toString(), // You may want to map this to a readable state
            balance: ethers.utils.formatEther(details[9]), // Convert BigNumber to a readable string
        };
    } catch (error) {
        console.error('Error fetching project details:', error);
        return null; // Or handle the error as needed
    }
}

export async function donateToAProject(projectAddress: string, amount: number): Promise<Boolean> {
    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const projectContract = new ethers.Contract(projectAddress, ProjectABI, signer);

        const contributionAmount = ethers.utils.parseEther(amount.toString());
        console.log("hi", contributionAmount, amount)
        const tx = await projectContract.contribute(projectAddress, { value: contributionAmount });
        await tx.wait();

        return true;
    } catch (error) {
        console.error('Error donating:', error);
        return false;
    }
}

export async function getDonationTransactions(projectAddress: string): Promise<ProjectDonation[]> {
    try {
        // Fetch events from the contract
        const provider = new ethers.providers.JsonRpcProvider(import.meta.env.VITE_RPC_URL);
        const crowdfundingProject = new ethers.Contract(import.meta.env.VITE_CROWDFUNDING_CONTRACT_ADDRESS, CrowdfundingABI, provider) as Crowdfunding;

        const filter = crowdfundingProject.filters.ContributionReceived();
        const events = await crowdfundingProject.queryFilter(filter);
        const filteredEvents = events.filter(event =>
            event.args.projectAddress.toLowerCase() === projectAddress.toLowerCase()
        );

        return filteredEvents.map(event => ({
            projectAddress: event.args.projectAddress,
            contributedAmount: ethers.utils.formatEther(event.args.contributedAmount),
            contributor: event.args.contributor
        }));

    } catch (error) {
        console.error(`Error fetching donation transactions: ${error}`);
        return [];
    }
}

export async function getNoOfContributors(projectAddress: string): Promise<string> {
    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const project = new ethers.Contract(projectAddress, ProjectABI, provider);
        const noOfContributers = await project.noOfContributers();
        return noOfContributers.toString();
    } catch (error) {
        console.error(`Error fetching no of contributors: ${error}`);
        return '0';
    }
}