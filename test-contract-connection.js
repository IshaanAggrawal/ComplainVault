// Test script to debug contract connection and admin function
const { ethers } = require('ethers');

// Contract ABI - minimal version for testing
const COMPLAINT_SYSTEM_ABI = [
    "function admin() public view returns (address)",
    "function complaintCount() public view returns (uint)",
    "function getAllComplaints() public view returns (tuple(uint id, address user, string description, uint8 department, uint timestamp, bool resolved, address resolver, string ipfsHash, string[] fileHashes)[])"
];

const CONTRACT_ADDRESS = "0x98786De8245380dd40AA16c1c1C102CBeD84CDC2";
const RPC_URL = "https://sepolia.infura.io/v3/YOUR_INFURA_KEY"; // Replace with your RPC URL

async function testContractConnection() {
    console.log('🧪 Testing Contract Connection...\n');
    
    try {
        // Create provider
        const provider = new ethers.JsonRpcProvider(RPC_URL);
        console.log('✅ Provider created');
        
        // Create contract instance
        const contract = new ethers.Contract(CONTRACT_ADDRESS, COMPLAINT_SYSTEM_ABI, provider);
        console.log('✅ Contract instance created');
        
        // Test basic contract functions
        console.log('\n📋 Testing Contract Functions:');
        
        // Test complaintCount
        try {
            const count = await contract.complaintCount();
            console.log('✅ complaintCount():', count.toString());
        } catch (error) {
            console.error('❌ complaintCount() failed:', error.message);
        }
        
        // Test admin function
        try {
            const admin = await contract.admin();
            console.log('✅ admin():', admin);
        } catch (error) {
            console.error('❌ admin() failed:', error.message);
            console.log('This might be due to:');
            console.log('1. Contract not deployed at this address');
            console.log('2. ABI mismatch');
            console.log('3. Network issues');
        }
        
        // Test getAllComplaints
        try {
            const complaints = await contract.getAllComplaints();
            console.log('✅ getAllComplaints():', complaints.length, 'complaints found');
        } catch (error) {
            console.error('❌ getAllComplaints() failed:', error.message);
        }
        
        // Test network info
        try {
            const network = await provider.getNetwork();
            console.log('✅ Network:', network.name, 'Chain ID:', network.chainId.toString());
        } catch (error) {
            console.error('❌ Network info failed:', error.message);
        }
        
        console.log('\n🎯 Recommendations:');
        console.log('1. Verify contract address is correct');
        console.log('2. Check if contract is deployed on Sepolia');
        console.log('3. Ensure RPC URL is working');
        console.log('4. Verify ABI matches deployed contract');
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

// Run the test
testContractConnection();
