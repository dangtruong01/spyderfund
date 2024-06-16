import { ethers } from 'ethers';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

// You might use environment variables for provider URLs or API keys
const provider = new ethers.providers.JsonRpcProvider(process.env.ETH_PROVIDER_URL);

/**
 * Gets the balance of the given Ethereum address.
 * @param address The Ethereum address to fetch the balance for.
 * @returns The balance in ether.
 */
export async function getBalance(address: string): Promise<string> {
    const balance = await provider.getBalance(address);
    return ethers.utils.formatEther(balance);
}

/**
 * Fetches the transaction count (nonce) for the given Ethereum address.
 * @param address The Ethereum address to fetch the transaction count for.
 * @returns The transaction count as a number.
 */
export async function getTransactionCount(address: string): Promise<number> {
    return await provider.getTransactionCount(address);
}

/**
 * Converts a hexadecimal string to a decimal number.
 * @param hexString The hexadecimal string to convert.
 * @returns The decimal number.
 */
export function hexToDecimal(hexString: string): number {
    return parseInt(hexString, 16);
}

/**
 * Signs a message using the wallet's private key.
 * This is a utility function that could be used when you need the backend to sign messages.
 * Ensure the private key is stored securely and not exposed.
 * @param message The message to sign.
 * @param privateKey The private key to sign the message with.
 * @returns The signature as a string.
 */
export async function signMessage(message: string, privateKey: string): Promise<string> {
    const wallet = new ethers.Wallet(privateKey);
    return await wallet.signMessage(message);
}


