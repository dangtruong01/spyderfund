const dotenv = require('dotenv');
const path = require('path');
const ethers = require('ethers');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });
const PRIVATE_ETH_KEY = process.env.PRIVATE_ETH_KEY || ""
const NONCE_RECEIVED = process.env.NONCE_RECEIVED || ""

// Replace with your actual Ethereum private key for testing
const privateKey = PRIVATE_ETH_KEY;
const wallet = new ethers.Wallet(privateKey);

// Replace with the actual nonce received from your application
const nonce = NONCE_RECEIVED;

async function signNonce(nonce) {
    try {
        const signature = await wallet.signMessage(nonce);
        console.log('Nonce:', nonce);
        console.log('Signature:', signature);
        return signature;
    } catch (error) {
        console.error('Error signing the nonce:', error);
    }
}

// Only run signNonce if the script is run directly from the command line
if (require.main === module) {
    if (!privateKey || !nonce) {
        console.error('Private key and nonce are required');
        process.exit(1);
    }

    signNonce(nonce);
}

module.exports = signNonce;
