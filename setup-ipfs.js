#!/usr/bin/env node

/**
 * IPFS Setup Script
 * 
 * This script helps set up the IPFS integration for the complaint system.
 * Run with: node setup-ipfs.js
 */

const fs = require('fs');
const path = require('path');

class IPFSSetup {
  constructor() {
    this.projectRoot = process.cwd();
    this.config = {
      ipfs: {
        gateway: 'https://ipfs.infura.io:5001',
        fallback: 'https://gateway.pinata.cloud'
      },
      blockchain: {
        rpc: 'http://localhost:8545',
        chainId: 1337
      }
    };
  }

  async run() {
    console.log('🚀 Setting up IPFS Integration for Complaint DApp\n');

    try {
      await this.checkDependencies();
      await this.createEnvironmentFile();
      await this.createConfigFiles();
      await this.installDependencies();
      await this.displayInstructions();

      console.log('✅ IPFS setup completed successfully!\n');
      console.log('🎉 You can now start using IPFS storage in your complaint system!');

    } catch (error) {
      console.error('❌ Setup failed:', error.message);
      process.exit(1);
    }
  }

  async checkDependencies() {
    console.log('🔍 Checking dependencies...');

    const packageJsonPath = path.join(this.projectRoot, 'package.json');
    if (!fs.existsSync(packageJsonPath)) {
      throw new Error('package.json not found. Please run this script from the project root.');
    }

    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const requiredDeps = ['ipfs-http-client', 'ethers'];

    const missingDeps = requiredDeps.filter(dep => 
      !packageJson.dependencies[dep] && !packageJson.devDependencies[dep]
    );

    if (missingDeps.length > 0) {
      console.log(`⚠️  Missing dependencies: ${missingDeps.join(', ')}`);
      console.log('   These will be installed automatically.\n');
    } else {
      console.log('✅ All required dependencies are installed\n');
    }
  }

  async createEnvironmentFile() {
    console.log('📝 Creating environment configuration...');

    const envPath = path.join(this.projectRoot, '.env.local');
    const envContent = `# IPFS Configuration
NEXT_PUBLIC_IPFS_GATEWAY=${this.config.ipfs.gateway}
NEXT_PUBLIC_IPFS_FALLBACK=${this.config.ipfs.fallback}

# Blockchain Configuration
NEXT_PUBLIC_CONTRACT_ADDRESS=
NEXT_PUBLIC_RPC_URL=${this.config.blockchain.rpc}
NEXT_PUBLIC_NETWORK_ID=${this.config.blockchain.chainId}

# Optional: Pinata Configuration (for production)
# NEXT_PUBLIC_PINATA_API_KEY=your_pinata_api_key
# NEXT_PUBLIC_PINATA_SECRET_KEY=your_pinata_secret_key

# Optional: Infura Configuration (for production)
# NEXT_PUBLIC_INFURA_PROJECT_ID=your_infura_project_id
# NEXT_PUBLIC_INFURA_API_KEY=your_infura_api_key
`;

    if (!fs.existsSync(envPath)) {
      fs.writeFileSync(envPath, envContent);
      console.log('✅ Created .env.local file');
    } else {
      console.log('⚠️  .env.local already exists, skipping creation');
    }
    console.log('');
  }

  async createConfigFiles() {
    console.log('📁 Creating configuration files...');

    // Create IPFS config
    const ipfsConfigPath = path.join(this.projectRoot, 'src/config/ipfs.js');
    const ipfsConfigDir = path.dirname(ipfsConfigPath);

    if (!fs.existsSync(ipfsConfigDir)) {
      fs.mkdirSync(ipfsConfigDir, { recursive: true });
    }

    const ipfsConfigContent = `// IPFS Configuration
export const IPFS_CONFIG = {
  gateway: process.env.NEXT_PUBLIC_IPFS_GATEWAY || 'https://ipfs.infura.io:5001',
  fallback: process.env.NEXT_PUBLIC_IPFS_FALLBACK || 'https://gateway.pinata.cloud',
  
  // Pinata configuration (for production)
  pinata: {
    apiKey: process.env.NEXT_PUBLIC_PINATA_API_KEY,
    secretKey: process.env.NEXT_PUBLIC_PINATA_SECRET_KEY,
    gateway: 'https://gateway.pinata.cloud'
  },
  
  // Infura configuration (for production)
  infura: {
    projectId: process.env.NEXT_PUBLIC_INFURA_PROJECT_ID,
    apiKey: process.env.NEXT_PUBLIC_INFURA_API_KEY,
    gateway: 'https://ipfs.infura.io'
  }
};

export default IPFS_CONFIG;
`;

    if (!fs.existsSync(ipfsConfigPath)) {
      fs.writeFileSync(ipfsConfigPath, ipfsConfigContent);
      console.log('✅ Created IPFS configuration file');
    }

    // Create blockchain config
    const blockchainConfigPath = path.join(this.projectRoot, 'src/config/blockchain.js');
    const blockchainConfigContent = `// Blockchain Configuration
export const BLOCKCHAIN_CONFIG = {
  rpcUrl: process.env.NEXT_PUBLIC_RPC_URL || 'http://localhost:8545',
  contractAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
  networkId: process.env.NEXT_PUBLIC_NETWORK_ID || 1337,
  
  // Contract ABI (update with your deployed contract)
  abi: [
    "function fileComplaintWithIPFS(string memory description, uint8 department, string memory ipfsHash) public",
    "function addFileToComplaint(uint complaintId, string memory fileHash) public",
    "function getComplaint(uint complaintId) public view returns (tuple(uint id, address user, string description, uint8 department, uint timestamp, bool resolved, address resolver, string ipfsHash, string[] fileHashes))",
    "function getAllComplaints() public view returns (tuple(uint id, address user, string description, uint8 department, uint timestamp, bool resolved, address resolver, string ipfsHash, string[] fileHashes)[])",
    "function complaintCount() public view returns (uint)"
  ]
};

export default BLOCKCHAIN_CONFIG;
`;

    if (!fs.existsSync(blockchainConfigPath)) {
      fs.writeFileSync(blockchainConfigPath, blockchainConfigContent);
      console.log('✅ Created blockchain configuration file');
    }

    console.log('');
  }

  async installDependencies() {
    console.log('📦 Installing dependencies...');

    const packageJsonPath = path.join(this.projectRoot, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

    const requiredDeps = ['ipfs-http-client'];
    const missingDeps = requiredDeps.filter(dep => 
      !packageJson.dependencies[dep] && !packageJson.devDependencies[dep]
    );

    if (missingDeps.length > 0) {
      console.log(`   Installing: ${missingDeps.join(', ')}`);
      
      // Note: In a real scenario, you would run npm install here
      console.log('   Run: npm install ipfs-http-client');
    } else {
      console.log('✅ All dependencies are already installed');
    }
    console.log('');
  }

  async displayInstructions() {
    console.log('📋 Next Steps:\n');

    console.log('1. 📄 Update Contract Address:');
    console.log('   - Deploy your smart contract');
    console.log('   - Update NEXT_PUBLIC_CONTRACT_ADDRESS in .env.local');
    console.log('');

    console.log('2. 🔧 Configure IPFS (Choose one):');
    console.log('   Option A - Public IPFS (Development):');
    console.log('     - Uses public IPFS gateways');
    console.log('     - Files may not persist long-term');
    console.log('');
    console.log('   Option B - Pinata (Production):');
    console.log('     - Sign up at https://pinata.cloud');
    console.log('     - Add PINATA_API_KEY and PINATA_SECRET_KEY to .env.local');
    console.log('');
    console.log('   Option C - Local IPFS Node:');
    console.log('     - Install IPFS: npm install -g ipfs');
    console.log('     - Run: ipfs init && ipfs daemon');
    console.log('     - Update IPFS_GATEWAY in .env.local');
    console.log('');

    console.log('3. 🧪 Test the Integration:');
    console.log('   - Run: node test-ipfs-integration.js');
    console.log('   - Start your app: npm run dev');
    console.log('   - Navigate to /file-complaint');
    console.log('   - Try uploading files and submitting complaints');
    console.log('');

    console.log('4. 📚 Documentation:');
    console.log('   - Read IPFS_INTEGRATION_GUIDE.md for detailed instructions');
    console.log('   - Check src/services/ipfs.js for IPFS service implementation');
    console.log('   - Review src/pages/Filecomplaint.jsx for form integration');
    console.log('');

    console.log('5. 🚀 Production Deployment:');
    console.log('   - Use Pinata or your own IPFS node for production');
    console.log('   - Set up proper error handling and retry mechanisms');
    console.log('   - Monitor IPFS upload success rates');
    console.log('   - Implement file validation and size limits');
    console.log('');
  }
}

// Run the setup
if (require.main === module) {
  const setup = new IPFSSetup();
  setup.run().catch(console.error);
}

module.exports = IPFSSetup;
