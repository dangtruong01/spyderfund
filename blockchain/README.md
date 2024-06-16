# Blockchain

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a script that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.ts
```

## Current status

Have not build the contract

```bash
npx hardhat compile
npx hardhat test
```

## Add creator

Add in your public metamask to the env of `ETH_ADDRESS`

```bash
npx hardhat run scripts/addCreator.ts
```

## Add donor

Add in your public metamask to the env of `ETH_ADDRESS`

```bash
npx hardhat run scripts/addDonor.ts
```