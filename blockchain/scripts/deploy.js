    const hre = require("hardhat");

    async function main() {
    const [deployer] = await hre.ethers.getSigners();
    
    console.log("Deploying contracts with the account:", deployer.address);
    console.log("Account balance:", (await deployer.provider.getBalance(deployer.address)).toString());

    const ComplaintSystem = await hre.ethers.getContractFactory("ComplaintSystem");

    console.log("Deploying ComplaintSystem contract...");

    const complaintSystem = await ComplaintSystem.deploy();

    await complaintSystem.waitForDeployment();

    const contractAddress = await complaintSystem.getAddress();

    console.log(`ComplaintSystem deployed successfully!`);
    console.log(`Contract Address: ${contractAddress}`);
    console.log(`Network: ${hre.network.name}`);
    console.log(`Explorer: https://sepolia.etherscan.io/address/${contractAddress}`);
    
    // Save contract address to a file for frontend
    const fs = require('fs');
    const contractInfo = {
        address: contractAddress,
        network: hre.network.name,
        chainId: hre.network.config.chainId,
        timestamp: new Date().toISOString(),
        deployer: deployer.address
    };
    
    // Create config directory if it doesn't exist
    const configDir = '../src/config';
    if (!fs.existsSync(configDir)) {
        fs.mkdirSync(configDir, { recursive: true });
    }
    
    fs.writeFileSync(
        '../src/config/contract-address.json', 
        JSON.stringify(contractInfo, null, 2)
    );
    
    console.log('Contract address saved to src/config/contract-address.json');
    
    // Update environment file
    const envContent = `NEXT_PUBLIC_CONTRACT_ADDRESS=${contractAddress}\nNEXT_PUBLIC_NETWORK_ID=${hre.network.config.chainId}\nNEXT_PUBLIC_RPC_URL=${hre.network.config.url}`;
    fs.writeFileSync('../.env.local', envContent);
    console.log('Environment variables updated in .env.local');
    }

    main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Deployment failed:", error);
        process.exit(1);
    });
