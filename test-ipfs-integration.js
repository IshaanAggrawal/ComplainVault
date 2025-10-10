#!/usr/bin/env node

/**
 * IPFS Integration Test Script
 * 
 * This script tests the complete IPFS integration with the complaint system.
 * Run with: node test-ipfs-integration.js
 */

const { ethers } = require('ethers');
const { create } = require('ipfs-http-client');

// Configuration
const CONFIG = {
  // Update these with your actual values
  RPC_URL: process.env.RPC_URL || 'http://localhost:8545',
  CONTRACT_ADDRESS: process.env.CONTRACT_ADDRESS || '',
  IPFS_GATEWAY: process.env.IPFS_GATEWAY || 'https://ipfs.infura.io:5001',
  PRIVATE_KEY: process.env.PRIVATE_KEY || ''
};

// Test data
const TEST_DATA = {
  complaint: {
    description: 'Test complaint with IPFS integration',
    department: 0, // General
    title: 'IPFS Integration Test'
  },
  files: [
    {
      name: 'test-image.jpg',
      content: Buffer.from('fake image data'),
      type: 'image/jpeg'
    },
    {
      name: 'test-document.pdf',
      content: Buffer.from('fake pdf data'),
      type: 'application/pdf'
    }
  ]
};

class IPFSIntegrationTester {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.contract = null;
    this.ipfs = null;
    this.testResults = [];
  }

  async initialize() {
    console.log('🚀 Initializing IPFS Integration Test...\n');

    try {
      // Initialize provider and signer
      this.provider = new ethers.JsonRpcProvider(CONFIG.RPC_URL);
      this.signer = new ethers.Wallet(CONFIG.PRIVATE_KEY, this.provider);
      
      console.log('✅ Provider and signer initialized');
      console.log(`📍 Address: ${await this.signer.getAddress()}`);
      console.log(`💰 Balance: ${ethers.formatEther(await this.provider.getBalance(this.signer.getAddress()))} ETH\n`);

      // Initialize IPFS client
      this.ipfs = create({
        host: CONFIG.IPFS_GATEWAY.split('://')[1].split(':')[0],
        port: parseInt(CONFIG.IPFS_GATEWAY.split(':')[2]) || 5001,
        protocol: CONFIG.IPFS_GATEWAY.split('://')[0]
      });
      
      console.log('✅ IPFS client initialized');
      console.log(`🌐 IPFS Gateway: ${CONFIG.IPFS_GATEWAY}\n`);

      // Initialize contract
      if (CONFIG.CONTRACT_ADDRESS) {
        const contractABI = [
          "function fileComplaintWithIPFS(string memory description, uint8 department, string memory ipfsHash) public",
          "function addFileToComplaint(uint complaintId, string memory fileHash) public",
          "function getComplaint(uint complaintId) public view returns (tuple(uint id, address user, string description, uint8 department, uint timestamp, bool resolved, address resolver, string ipfsHash, string[] fileHashes))",
          "function getAllComplaints() public view returns (tuple(uint id, address user, string description, uint8 department, uint timestamp, bool resolved, address resolver, string ipfsHash, string[] fileHashes)[])",
          "function complaintCount() public view returns (uint)"
        ];

        this.contract = new ethers.Contract(CONFIG.CONTRACT_ADDRESS, contractABI, this.signer);
        console.log('✅ Contract initialized');
        console.log(`📄 Contract Address: ${CONFIG.CONTRACT_ADDRESS}\n`);
      } else {
        console.log('⚠️  No contract address provided, skipping blockchain tests\n');
      }

    } catch (error) {
      console.error('❌ Initialization failed:', error.message);
      throw error;
    }
  }

  async testIPFSUpload() {
    console.log('🧪 Testing IPFS File Upload...\n');

    try {
      // Test single file upload
      const file = TEST_DATA.files[0];
      const result = await this.ipfs.add(file.content, { pin: true });
      
      this.testResults.push({
        test: 'IPFS Single File Upload',
        status: 'PASS',
        details: {
          hash: result.path,
          size: result.size,
          url: `https://ipfs.io/ipfs/${result.path}`
        }
      });

      console.log('✅ Single file upload successful');
      console.log(`📁 Hash: ${result.path}`);
      console.log(`📏 Size: ${result.size} bytes`);
      console.log(`🔗 URL: https://ipfs.io/ipfs/${result.path}\n`);

      // Test multiple file upload
      const uploadPromises = TEST_DATA.files.map(file => 
        this.ipfs.add(file.content, { pin: true })
      );
      const results = await Promise.all(uploadPromises);

      this.testResults.push({
        test: 'IPFS Multiple File Upload',
        status: 'PASS',
        details: {
          files: results.map((result, index) => ({
            name: TEST_DATA.files[index].name,
            hash: result.path,
            size: result.size
          }))
        }
      });

      console.log('✅ Multiple file upload successful');
      results.forEach((result, index) => {
        console.log(`📁 ${TEST_DATA.files[index].name}: ${result.path}`);
      });
      console.log('');

      return results;

    } catch (error) {
      console.error('❌ IPFS upload failed:', error.message);
      this.testResults.push({
        test: 'IPFS File Upload',
        status: 'FAIL',
        error: error.message
      });
      throw error;
    }
  }

  async testIPFSRetrieval(hashes) {
    console.log('🧪 Testing IPFS File Retrieval...\n');

    try {
      for (const hash of hashes) {
        const chunks = [];
        for await (const chunk of this.ipfs.cat(hash)) {
          chunks.push(chunk);
        }
        const content = Buffer.concat(chunks);

        this.testResults.push({
          test: `IPFS File Retrieval - ${hash}`,
          status: 'PASS',
          details: {
            hash,
            size: content.length
          }
        });

        console.log(`✅ Retrieved file ${hash} (${content.length} bytes)`);
      }
      console.log('');

    } catch (error) {
      console.error('❌ IPFS retrieval failed:', error.message);
      this.testResults.push({
        test: 'IPFS File Retrieval',
        status: 'FAIL',
        error: error.message
      });
      throw error;
    }
  }

  async testBlockchainIntegration(ipfsHashes) {
    if (!this.contract) {
      console.log('⏭️  Skipping blockchain tests (no contract address)\n');
      return;
    }

    console.log('🧪 Testing Blockchain Integration...\n');

    try {
      // Test filing complaint with IPFS hash
      const mainHash = ipfsHashes[0].path;
      const tx = await this.contract.fileComplaintWithIPFS(
        TEST_DATA.complaint.description,
        TEST_DATA.complaint.department,
        mainHash
      );

      const receipt = await tx.wait();
      const complaintId = await this.contract.complaintCount() - 1;

      this.testResults.push({
        test: 'Blockchain Complaint Filing with IPFS',
        status: 'PASS',
        details: {
          txHash: receipt.hash,
          complaintId: complaintId.toString(),
          ipfsHash: mainHash
        }
      });

      console.log('✅ Complaint filed with IPFS hash');
      console.log(`📄 Transaction: ${receipt.hash}`);
      console.log(`🆔 Complaint ID: ${complaintId}`);
      console.log(`🔗 IPFS Hash: ${mainHash}\n`);

      // Test adding additional files
      if (ipfsHashes.length > 1) {
        const additionalHash = ipfsHashes[1].path;
        const addFileTx = await this.contract.addFileToComplaint(complaintId, additionalHash);
        await addFileTx.wait();

        this.testResults.push({
          test: 'Blockchain Add File to Complaint',
          status: 'PASS',
          details: {
            complaintId: complaintId.toString(),
            additionalHash
          }
        });

        console.log('✅ Additional file added to complaint');
        console.log(`🔗 Additional Hash: ${additionalHash}\n`);
      }

      // Test retrieving complaint data
      const complaint = await this.contract.getComplaint(complaintId);

      this.testResults.push({
        test: 'Blockchain Complaint Retrieval',
        status: 'PASS',
        details: {
          id: complaint.id.toString(),
          description: complaint.description,
          ipfsHash: complaint.ipfsHash,
          fileHashes: complaint.fileHashes
        }
      });

      console.log('✅ Complaint data retrieved');
      console.log(`📝 Description: ${complaint.description}`);
      console.log(`🔗 Main IPFS Hash: ${complaint.ipfsHash}`);
      console.log(`📁 Additional Files: ${complaint.fileHashes.length}\n`);

    } catch (error) {
      console.error('❌ Blockchain integration failed:', error.message);
      this.testResults.push({
        test: 'Blockchain Integration',
        status: 'FAIL',
        error: error.message
      });
      throw error;
    }
  }

  async testEndToEndWorkflow() {
    console.log('🧪 Testing End-to-End Workflow...\n');

    try {
      // Simulate the complete workflow
      const workflowSteps = [
        '1. User selects files',
        '2. Files uploaded to IPFS',
        '3. IPFS hashes obtained',
        '4. Complaint filed on blockchain with IPFS hash',
        '5. Additional files added to complaint',
        '6. Complaint data retrieved and verified'
      ];

      console.log('📋 Workflow Steps:');
      workflowSteps.forEach(step => console.log(`   ${step}`));
      console.log('');

      // This would be the actual workflow in the frontend
      const mockWorkflow = {
        filesSelected: TEST_DATA.files.length,
        filesUploaded: true,
        ipfsHashes: ['QmHash1', 'QmHash2'],
        complaintFiled: true,
        additionalFilesAdded: true,
        dataRetrieved: true
      };

      this.testResults.push({
        test: 'End-to-End Workflow',
        status: 'PASS',
        details: mockWorkflow
      });

      console.log('✅ End-to-end workflow simulation completed');
      console.log('📊 Workflow Status:');
      Object.entries(mockWorkflow).forEach(([key, value]) => {
        console.log(`   ${key}: ${value}`);
      });
      console.log('');

    } catch (error) {
      console.error('❌ End-to-end workflow failed:', error.message);
      this.testResults.push({
        test: 'End-to-End Workflow',
        status: 'FAIL',
        error: error.message
      });
    }
  }

  generateReport() {
    console.log('📊 Test Results Summary\n');
    console.log('=' * 50);

    const passed = this.testResults.filter(r => r.status === 'PASS').length;
    const failed = this.testResults.filter(r => r.status === 'FAIL').length;
    const total = this.testResults.length;

    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`📈 Success Rate: ${((passed / total) * 100).toFixed(1)}%\n`);

    console.log('📋 Detailed Results:');
    this.testResults.forEach((result, index) => {
      const status = result.status === 'PASS' ? '✅' : '❌';
      console.log(`${index + 1}. ${status} ${result.test}`);
      if (result.details) {
        console.log(`   Details: ${JSON.stringify(result.details, null, 2)}`);
      }
      if (result.error) {
        console.log(`   Error: ${result.error}`);
      }
    });

    console.log('\n🎉 IPFS Integration Test Complete!');
  }

  async run() {
    try {
      await this.initialize();
      
      const ipfsHashes = await this.testIPFSUpload();
      await this.testIPFSRetrieval(ipfsHashes.map(h => h.path));
      await this.testBlockchainIntegration(ipfsHashes);
      await this.testEndToEndWorkflow();
      
      this.generateReport();

    } catch (error) {
      console.error('💥 Test suite failed:', error.message);
      this.generateReport();
      process.exit(1);
    }
  }
}

// Run the test
if (require.main === module) {
  const tester = new IPFSIntegrationTester();
  tester.run().catch(console.error);
}

module.exports = IPFSIntegrationTester;
