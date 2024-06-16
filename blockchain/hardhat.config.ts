import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-ethers";
import dotenv from "dotenv";
import path from 'path';

// Load environment variables from the .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const projectID = process.env.INFURA_ETHEREUM_PROJECT_ID;
const privateKey = process.env.PRIVATE_KEY || "";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.20",
  },
  networks: {
    hardhat: {
      chainId: 1337
    },
    goerli: {
      url: `https://goerli.infura.io/v3/${projectID}`,
      accounts: [privateKey]
    },
    development: {
      url: "http://localhost:8545",
      accounts: [privateKey],
    },
    testnet: {
      url: "https://evm-t3.cronos.org/",
      accounts: [privateKey],
    }
  }
};

export default config;
