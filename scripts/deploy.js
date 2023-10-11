// deploy.js
const fs = require('fs');
const { ethers } = require('hardhat');

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log(`Deploying contracts with the account: ${deployer.address}`);

    const balance = await deployer.getBalance();
    console.log(`Account balance: ${ethers.utils.formatEther(balance)} ETH`);

    // Deploy Library contract
    const Library = await ethers.getContractFactory('Library');
    const library = await Library.deploy();
    console.log(`Library contract address: ${library.address}`);

    await library.addBook("Title1", "Author1");
    await library.addBook("Title2", "Author2");
    await library.addBook("Title3", "Author3");

    // Prepare contract data
    const data = {
        Library: {
            address: library.address,
            abi: JSON.parse(library.interface.format('json'))
        }
    };

    // Write contract data to file
    const path = './client/src/contracts/contracts.json';

    fs.writeFileSync(path, JSON.stringify(data, null, 2));
    console.log(`Successfully wrote contract addresses and ABIs to ${path}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
