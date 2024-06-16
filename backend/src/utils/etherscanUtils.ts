import axios from 'axios';
import { ethers } from 'ethers';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const etherscanApiKey = process.env.ETHERSCAN_API_KEY;
const etherscanApiUrl = 'https://api-goerli.etherscan.io/api';

interface Transaction {
    blockNumber: string;
    timeStamp: string;
    hash: string;
    nonce: string;
    blockHash: string;
    transactionIndex: string;
    from: string;
    to: string;
    value: string;
    gas: string;
    gasPrice: string;
    isError: string;
    txreceipt_status: string;
    input: string;
    contractAddress: string;
    cumulativeGasUsed: string;
    gasUsed: string;
    confirmations: string;
}

interface EtherscanResponse {
    status: string;
    message: string;
    result: Transaction[];
}


interface EtherscanBalanceResponse {
    status: string;
    message: string;
    result: string; // Balance will be returned as a string representing the balance in Wei
}


// Normal transactions
async function getNormalTransactions(address: string): Promise<{ transactions: Transaction[], numberOfCreatedContracts: number }> {
    const response = await axios.get<EtherscanResponse>(`${etherscanApiUrl}`, {
        params: {
            module: 'account',
            action: 'txlist',
            address: address,
            startblock: 0,
            endblock: 99999999,
            page: 1,
            offset: 10,
            sort: 'asc',
            apikey: etherscanApiKey,
        },
    });

    const contractCreations = response.data.result.filter(tx => tx.to === null || tx.to === '0x0');

    return { transactions: response.data.result, numberOfCreatedContracts: contractCreations.length };
}

// Internal transactions
async function getInteralTransactions(address: string): Promise<Transaction[]> {
    const response = await axios.get<EtherscanResponse>(`${etherscanApiUrl}`, {
        params: {
            module: 'account',
            action: 'txlistinternal',
            address: address,
            startblock: 0,
            endblock: 99999999,
            page: 1,
            offset: 10,
            sort: 'asc',
            apikey: etherscanApiKey,
        },
    });

    return response.data.result;
}

// ERC20 token transactions
async function getTokenTransactions(address: string): Promise<Transaction[]> {
    const response = await axios.get<EtherscanResponse>(`${etherscanApiUrl}`, {
        params: {
            module: 'account',
            action: 'tokentx',
            address: address,
            startblock: 0,
            endblock: 99999999,
            page: 1,
            offset: 10,
            sort: 'asc',
            apikey: etherscanApiKey,
        },
    });

    return response.data.result;
}

async function getEtherBalance(address: string): Promise<string> {
    const response = await axios.get<EtherscanBalanceResponse>(`${etherscanApiUrl}`, {
        params: {
            module: 'account',
            action: 'balance',
            address: address,
            tag: 'latest',
            apikey: etherscanApiKey,
        },
    });

    // The balance is returned in Wei, convert it to Ether
    const balanceInWei = ethers.BigNumber.from(response.data.result);
    const balanceInEther = ethers.utils.formatEther(balanceInWei);
    return balanceInEther;
}

// Contract execution status
async function getExecutedContracts(address: string): Promise<Transaction[]> {
    const response = await axios.get<EtherscanResponse>(`${etherscanApiUrl}`, {
        params: {
            module: 'transaction',
            action: 'getstatus',
            address: address,
            startblock: 0,
            endblock: 99999999,
            page: 1,
            offset: 10,
            sort: 'asc',
            apikey: etherscanApiKey,
        },
    });

    return response.data.result;
}

function calculateAverageTimeBetweenSentTransactions(transactions: Transaction[], address: string): number {
    const sentTransactions = transactions.filter(tx => tx.from.toLowerCase() === address.toLowerCase());

    // Ensure there are at least two transactions to compare
    if (sentTransactions.length < 2) {
        return 0;
    }

    // Sort transactions by timestamp
    const sortedTransactions = sentTransactions.sort((a, b) => parseInt(a.timeStamp) - parseInt(b.timeStamp));

    // Calculate time differences between consecutive transactions
    let totalMinutes = 0;
    for (let i = 1; i < sortedTransactions.length; i++) {
        const previousTime = parseInt(sortedTransactions[i - 1].timeStamp);
        const currentTime = parseInt(sortedTransactions[i].timeStamp);
        const timeDiff = currentTime - previousTime;
        totalMinutes += timeDiff / 60; // Convert seconds to minutes
    }

    // Calculate average time in minutes between transactions
    const averageMinutes = totalMinutes / (sortedTransactions.length - 1);
    return averageMinutes;
}

function calculateAverageTimeBetweenReceivedTransactions(transactions: Transaction[], address: string): number {
    const receivedTransactions = transactions.filter(tx => tx.to.toLowerCase() === address.toLowerCase());

    // Ensure there are at least two transactions to compare
    if (receivedTransactions.length < 2) {
        return 0;
    }

    // Sort transactions by timestamp
    const sortedTransactions = receivedTransactions.sort((a, b) => parseInt(a.timeStamp) - parseInt(b.timeStamp));

    // Calculate time differences between consecutive transactions
    let totalMinutes = 0;
    for (let i = 1; i < sortedTransactions.length; i++) {
        const previousTime = parseInt(sortedTransactions[i - 1].timeStamp);
        const currentTime = parseInt(sortedTransactions[i].timeStamp);
        const timeDiff = currentTime - previousTime;
        totalMinutes += timeDiff / 60; // Convert seconds to minutes
    }

    // Calculate average time in minutes between transactions
    const averageMinutes = totalMinutes / (sortedTransactions.length - 1);
    return averageMinutes;
}

function calculateTimeDifferenceBetweenFirstAndLastTransactions(normalTransactions: Transaction[], tokenTransactions: Transaction[], internalTransactions: Transaction[], address: string): number {
    // Combine all transactions into a single array and filter by the specified address
    const allTransactions = [...normalTransactions, ...tokenTransactions, ...internalTransactions]
        .filter(tx => tx.from.toLowerCase() === address.toLowerCase());

    // Ensure there are at least two transactions to compare
    if (allTransactions.length < 2) {
        return 0;
    }

    // Sort combined transactions by timestamp
    const sortedTransactions = allTransactions.sort((a, b) => parseInt(a.timeStamp) - parseInt(b.timeStamp));

    // Get the timestamp of the first and last transactions
    const firstTransactionTime = parseInt(sortedTransactions[0].timeStamp);
    const lastTransactionTime = parseInt(sortedTransactions[sortedTransactions.length - 1].timeStamp);

    // Calculate the time difference in minutes
    const timeDiff = (lastTransactionTime - firstTransactionTime) / 60; // Convert seconds to minutes
    return timeDiff;
}

function countSentTransactions(transactions: Transaction[], address: string): number {
    let sent = 0;

    // Normalize the address to avoid case sensitivity issues
    const normalizedAddress = address.toLowerCase();

    transactions.forEach(tx => {
        // Check if the address is the sender
        if (tx.from.toLowerCase() === normalizedAddress) {
            sent++;
        }
    });

    return sent;
}

function countReceivedTransactions(transactions: Transaction[], address: string): number {
    let received = 0;

    // Normalize the address to avoid case sensitivity issues
    const normalizedAddress = address.toLowerCase();

    transactions.forEach(tx => {
        // Check if the address is the sender
        if (tx.to.toLowerCase() === normalizedAddress) {
            received++;
        }
    });

    return received;
}

function findUniqueAddressesReceived(transactions: Transaction[], address: string): number {
    const uniqueAddresses = new Set<string>();

    transactions
        .filter(x => x.to.toLowerCase() === address.toLowerCase())
        .forEach(tx => {
            uniqueAddresses.add(tx.from.toLowerCase());
            uniqueAddresses.add(tx.to.toLowerCase());
        });

    return uniqueAddresses.size;
}

function findUniqueAddressesSent(transactions: Transaction[], address: string): number {
    const uniqueAddresses = new Set<string>();

    transactions
        .filter(x => x.from.toLowerCase() === address.toLowerCase())
        .forEach(tx => {
            uniqueAddresses.add(tx.from.toLowerCase());
            uniqueAddresses.add(tx.to.toLowerCase());
        });

    return uniqueAddresses.size;
}


function findMinMaxAvgValuesReceived(transactions: Transaction[], address: string): { min: string, max: string, avg: string } {
    let min = ethers.BigNumber.from("0");
    let max = ethers.BigNumber.from("0");
    let sum = ethers.BigNumber.from("0");
    let transactionCount = 0;

    transactions.forEach(tx => {
        // Assuming we're only interested in transactions where the address is the receiver
        if (tx.to.toLowerCase() === address.toLowerCase()) {
            const value = ethers.BigNumber.from(tx.value);

            // Update min and max values
            if (min.isZero() || value.lt(min)) {
                min = value;
            }
            if (value.gt(max)) {
                max = value;
            }

            // Add to sum and increment transaction count
            sum = sum.add(value);
            transactionCount++;
        }
    });

    // Calculate average value
    const avg = transactionCount > 0 ? sum.div(ethers.BigNumber.from(transactionCount)) : ethers.BigNumber.from("0")

    return {
        min: ethers.utils.formatEther(min.isZero() ? ethers.BigNumber.from("0") : min), // Return undefined if no transactions were received
        max: ethers.utils.formatEther(max.isZero() ? ethers.BigNumber.from("0") : max), // Return undefined if no transactions were received
        avg: ethers.utils.formatEther(avg) // Return zero if no transactions were received
    };
}

function findMinMaxAvgValuesSent(transactions: Transaction[], address: string): { min: string, max: string, avg: string } {
    let min = ethers.BigNumber.from("0");
    let max = ethers.BigNumber.from("0");
    let sum = ethers.BigNumber.from("0");
    let transactionCount = 0;

    transactions.forEach(tx => {
        // Assuming we're only interested in transactions where the address is the receiver
        if (tx.from.toLowerCase() === address.toLowerCase()) {
            const value = ethers.BigNumber.from(tx.value);

            // Update min and max values
            if (min.isZero() || value.lt(min)) {
                min = value;
            }
            if (value.gt(max)) {
                max = value;
            }

            // Add to sum and increment transaction count
            sum = sum.add(value);
            transactionCount++;
        }
    });

    // Calculate average value
    const avg = transactionCount > 0 ? sum.div(ethers.BigNumber.from(transactionCount)) : ethers.BigNumber.from("0")

    return {
        min: ethers.utils.formatEther(min.isZero() ? ethers.BigNumber.from("0") : min), // Return undefined if no transactions were received
        max: ethers.utils.formatEther(max.isZero() ? ethers.BigNumber.from("0") : max), // Return undefined if no transactions were received
        avg: ethers.utils.formatEther(avg) // Return zero if no transactions were received
    };
}



function calculateTotalReceived(address: string, transactions: Transaction[]): string {
    let totalReceived = ethers.BigNumber.from(0);

    transactions.forEach(tx => {
        // Check if the transaction is a regular transfer and not an error
        if (tx.to.toLowerCase() === address.toLowerCase() && tx.isError === '0') {
            totalReceived = totalReceived.add(ethers.BigNumber.from(tx.value));
        }
    });

    return ethers.utils.formatEther(totalReceived);
}

function calculateTotalEtherSent(transactions: Transaction[], address: string): string {
    let totalSent = ethers.BigNumber.from(0);

    transactions.forEach(tx => {
        // Check if the transaction is a regular transfer and not an error
        if (tx.from.toLowerCase() === address.toLowerCase() && tx.isError === '0') {
            totalSent = totalSent.add(ethers.BigNumber.from(tx.value));
        }
    });

    return ethers.utils.formatEther(totalSent);
}


function calculateTotalSent(normalTransactions: Transaction[], tokenTransactions: Transaction[], internalTransactions: Transaction[], address: string): string {
    let totalSent = ethers.BigNumber.from(0);

    // Combine all transactions into a single array and filter by the specified address
    const allTransactions = [...normalTransactions, ...tokenTransactions, ...internalTransactions]
        .filter(tx => tx.from.toLowerCase() === address.toLowerCase());

    // Ensure there are at least two transactions to compare
    if (allTransactions.length < 2) {
        return "0"
    }

    allTransactions.forEach(tx => {
        // Check if the transaction is a regular transfer and not an error
        if (tx.from.toLowerCase() === address.toLowerCase() && tx.isError === '0') {
            totalSent = totalSent.add(ethers.BigNumber.from(tx.value));
        }
    });

    return ethers.utils.formatEther(totalSent);
}


export const fetchAndCalculate = async (address: string) => {
    try {
        const [{ transactions: normalTransactions, numberOfCreatedContracts: createdContracts }, tokenTransactions, internalTransactions, etherBalance] = await Promise.all([
            getNormalTransactions(address),
            getTokenTransactions(address),
            getInteralTransactions(address),
            getEtherBalance(address)
        ]);

        const numberOfUniqueERC20TokensReceived = findUniqueAddressesReceived(tokenTransactions, address);
        const timeDifferenceBetweenFirstAndLastTransactions = calculateTimeDifferenceBetweenFirstAndLastTransactions(normalTransactions, tokenTransactions, internalTransactions, address)
        const numberOfUnqiueAddressTokenTransactionsSent = findUniqueAddressesSent(tokenTransactions, address)
        const totalTokenSent = calculateTotalSent(normalTransactions, tokenTransactions, internalTransactions, address)
        const totalSentNormal = countSentTransactions(normalTransactions, address)
        const totalReceivedNormal = countReceivedTransactions(normalTransactions, address)
        const { min: minTokenReceived, max: maxTokenReceived, avg: averageTokenReceived } = findMinMaxAvgValuesReceived(tokenTransactions, address)
        const totalTokenReceived = calculateTotalReceived(address, tokenTransactions)
        const averageTimeBetweenReceivedNormalTransactions = calculateAverageTimeBetweenReceivedTransactions(normalTransactions, address)
        const { min: minTokenSent, max: maxTokenSent, avg: averageTokenSent } = findMinMaxAvgValuesSent(tokenTransactions, address)
        const averageTimeBetweenSentNormalTransactions = calculateAverageTimeBetweenSentTransactions(normalTransactions, address)
        const totalEtherSent = calculateTotalEtherSent(tokenTransactions, address)

        return {
            numberOfUniqueERC20TokensReceived,
            timeDifferenceBetweenFirstAndLastTransactions,
            numberOfUnqiueAddressTokenTransactionsSent,
            totalTokenSent,
            totalSentNormal,
            etherBalance,
            totalReceivedNormal,
            averageTokenReceived,
            createdContracts,
            totalTokenReceived,
            averageTimeBetweenReceivedNormalTransactions,
            averageTokenSent,
            averageTimeBetweenSentNormalTransactions,
            maxTokenReceived,
            totalEtherSent
        };
    } catch (error) {
        console.error('Error fetching and calculating data:', error);
        throw error;
    }
}
