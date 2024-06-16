# spydercube

## How to set up

Do it in this order

Set up MetaMask
1. Go to Chrome and install MetaMask extension
1. Login in to your account and change the network to Goerli

Run frontend
1. Run `cd frontend`
1. Run `npm install`
1. Run `npm run dev`

Add yourself as a creator and donor
1. Run `cd blockchain`
1. Add your public key to `.env` in `ETH_ADDRESS`
1. Run `npx hardhat run scripts/addDonor.ts`
1. Run `npx hardhat run scripts/addCreator.ts`