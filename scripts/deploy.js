// Run: npx hardhat run scripts/deploy.js --network localhost
const fs = require('fs');
const { ethers } = require('hardhat');

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log(`Deploying contracts with the account: ${deployer.address}`);

    const balance = await deployer.getBalance();
    console.log(`Account balance: ${ethers.utils.formatEther(balance)} ETH`);


    const Library = await ethers.getContractFactory('Library');
    const library = await Library.deploy();
    console.log(`Library contract address: ${library.address}`);

    // Add real books
    await library.addBook("1984", "George Orwell");
    await library.addBook("The Great Gatsby", "F. Scott Fitzgerald");

    const data = {
        Library: {
            address: library.address,
            abi: JSON.parse(library.interface.format('json'))
        }
    };

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
