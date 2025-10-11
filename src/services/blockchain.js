import { ethers } from 'ethers';
import { ipfsService } from './ipfs';
import contractConfig from '../config/contract-address.json';

// Contract ABI - This should match your deployed contract
const COMPLAINT_SYSTEM_ABI = [
    "function fileComplaint(string memory description, uint8 department) public",
    "function fileComplaintWithIPFS(string memory description, uint8 department, string memory ipfsHash) public",
    "function addFileToComplaint(uint complaintId, string memory fileHash) public",
    "function resolveComplaint(uint complaintId) public",
    "function getComplaint(uint complaintId) public view returns (tuple(uint id, address user, string description, uint8 department, uint timestamp, bool resolved, address resolver, string ipfsHash, string[] fileHashes))",
    "function getAllComplaints() public view returns (tuple(uint id, address user, string description, uint8 department, uint timestamp, bool resolved, address resolver, string ipfsHash, string[] fileHashes)[])",
    "function complaintCount() public view returns (uint)",
    "function admin() public view returns (address)",
    "function changeAdmin(address newAdmin) public",
    "event ComplaintFiled(uint id, address indexed user, uint8 department, string description, uint timestamp, string ipfsHash)",
    "event ComplaintResolved(uint id, address indexed resolver, uint timestamp)"
];

    // Department enum mapping
    export const DEPARTMENTS = {
    GENERAL: 0,
    POLICE: 1,
    ELECTRICITY: 2,
    WATER: 3,
    TRANSPORT: 4
    };

    export const DEPARTMENT_NAMES = {
    0: 'General',
    1: 'Police',
    2: 'Electricity',
    3: 'Water',
    4: 'Transport'
    };

    class BlockchainService {
    constructor() {
        this.provider = null;
        this.signer = null;
        this.contract = null;
        this.contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || contractConfig.address;
    }

    async connectWallet() {
        try {
        if (typeof window.ethereum !== 'undefined') {
            this.provider = new ethers.BrowserProvider(window.ethereum);
            this.signer = await this.provider.getSigner();
            
            if (this.contractAddress) {
            this.contract = new ethers.Contract(
                this.contractAddress,
                COMPLAINT_SYSTEM_ABI,
                this.signer
            );
            }
            
            return { success: true, address: await this.signer.getAddress() };
        } else {
            throw new Error('MetaMask not found');
        }
        } catch (error) {
        console.error('Wallet connection failed:', error);
        return { success: false, error: error.message };
        }
    }

    async fileComplaint(description, department, files = []) {
        try {
        if (!this.contract) {
            throw new Error('Contract not initialized');
        }

        // Prepare complaint data for IPFS
        const complaintData = {
            description,
            department: DEPARTMENT_NAMES[department],
            timestamp: new Date().toISOString(),
            files: []
        };

        // Upload files to IPFS if any
        const fileHashes = [];
        for (const file of files) {
            const uploadResult = await ipfsService.uploadFile(file);
            if (uploadResult.success) {
                fileHashes.push(uploadResult.hash);
                complaintData.files.push({
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    ipfsHash: uploadResult.hash,
                    url: ipfsService.getIPFSUrl(uploadResult.hash)
                });
            }
        }

        // Upload complaint data to IPFS
        const ipfsResult = await ipfsService.uploadComplaintData(complaintData);
        if (!ipfsResult.success) {
            throw new Error('Failed to upload to IPFS: ' + ipfsResult.error);
        }

            let departmentId = department;

            // If it's a string name (like "Water" or "Police"), map to number
            if (typeof department === 'string' && isNaN(department)) {
            const found = Object.entries(DEPARTMENT_NAMES).find(
                ([, name]) => name.toLowerCase() === department.toLowerCase()
            );
            departmentId = found ? Number(found[0]) : 0; // Default to 0 (General)
            }

            // If it's a numeric string ("3"), convert to number
            if (typeof department === 'string' && !isNaN(department)) {
            departmentId = Number(department);
            }


        const tx = await this.contract.fileComplaintWithIPFS(description, departmentId, ipfsResult.hash);

        const receipt = await tx.wait();
        
        // Add individual file hashes to the complaint
        for (const fileHash of fileHashes) {
            try {
                await this.contract.addFileToComplaint(Number(receipt.logs[0].topics[1]), fileHash);
            } catch (error) {
                console.warn('Failed to add file hash to complaint:', error.message);
            }
        }
        
        return { 
            success: true, 
            txHash: receipt.hash, 
            ipfsHash: ipfsResult.hash,
            fileHashes,
            complaintData
        };
        } catch (error) {
        console.error('Failed to file complaint:', error);
        return { success: false, error: error.message };
        }
    }

    async fileComplaintWithIPFS(description, department, ipfsHash) {
        try {
        if (!this.contract) {
            throw new Error('Contract not initialized');
        }

        const tx = await this.contract.fileComplaintWithIPFS(description, department, ipfsHash);
        const receipt = await tx.wait();
        
        return { success: true, txHash: receipt.hash };
        } catch (error) {
        console.error('Failed to file complaint with IPFS:', error);
        return { success: false, error: error.message };
        }
    }

    async addFileToComplaint(complaintId, fileHash) {
        try {
        if (!this.contract) {
            throw new Error('Contract not initialized');
        }

        const tx = await this.contract.addFileToComplaint(complaintId, fileHash);
        const receipt = await tx.wait();
        
        return { success: true, txHash: receipt.hash };
        } catch (error) {
        console.error('Failed to add file to complaint:', error);
        return { success: false, error: error.message };
        }
    }

    async resolveComplaint(complaintId) {
        try {
        if (!this.contract) {
            throw new Error('Contract not initialized');
        }

        const tx = await this.contract.resolveComplaint(complaintId);
        const receipt = await tx.wait();
        
        return { success: true, txHash: receipt.hash };
        } catch (error) {
        console.error('Failed to resolve complaint:', error);
        return { success: false, error: error.message };
        }
    }

    async getComplaint(complaintId) {
        try {
        if (!this.contract) {
            throw new Error('Contract not initialized');
        }

        const complaint = await this.contract.getComplaint(complaintId);
        
        // Try to retrieve additional data from IPFS
        let ipfsData = null;
        if (complaint.ipfsHash) {
            try {
                const ipfsResult = await ipfsService.retrieveComplaintData(complaint.ipfsHash);
                if (ipfsResult.success) {
                    ipfsData = ipfsResult.data;
                }
            } catch (error) {
                console.warn('Failed to retrieve IPFS data:', error.message);
            }
        }

        return {
            success: true,
            complaint: {
            id: complaint.id.toString(),
            user: complaint.user,
            description: complaint.description,
            department: DEPARTMENT_NAMES[complaint.department],
            timestamp: new Date(Number(complaint.timestamp) * 1000),
            resolved: complaint.resolved,
            resolver: complaint.resolver,
            ipfsHash: complaint.ipfsHash,
            fileHashes: complaint.fileHashes,
            ipfsData: ipfsData, // Additional data from IPFS including file metadata
            files: ipfsData?.files || [] // File metadata with names, sizes, types, URLs
            }
        };
        } catch (error) {
        console.error('Failed to get complaint:', error);
        return { success: false, error: error.message };
        }
    }

    async getAllComplaints() {
        try {
        if (!this.contract) {
            throw new Error('Contract not initialized');
        }

        // First check if there are any complaints
        const count = await this.contract.complaintCount();
        if (Number(count) === 0) {
            return { success: true, complaints: [] };
        }

        const complaints = await this.contract.getAllComplaints();
        
        // Process complaints and retrieve IPFS data
        const formattedComplaints = await Promise.all(complaints.map(async (complaint) => {
            // Try to retrieve additional data from IPFS
            let ipfsData = null;
            if (complaint.ipfsHash) {
                try {
                    const ipfsResult = await ipfsService.retrieveComplaintData(complaint.ipfsHash);
                    if (ipfsResult.success) {
                        ipfsData = ipfsResult.data;
                    }
                } catch (error) {
                    console.warn(`Failed to retrieve IPFS data for complaint ${complaint.id}:`, error.message);
                }
            }

            return {
                id: complaint.id.toString(),
                user: complaint.user,
                description: complaint.description,
                department: DEPARTMENT_NAMES[complaint.department],
                timestamp: new Date(Number(complaint.timestamp) * 1000),
                resolved: complaint.resolved,
                resolver: complaint.resolver,
                ipfsHash: complaint.ipfsHash,
                fileHashes: complaint.fileHashes,
                ipfsData: ipfsData, // Additional data from IPFS including file metadata
                files: ipfsData?.files || [] // File metadata with names, sizes, types, URLs
            };
        }));

        return { success: true, complaints: formattedComplaints };
        } catch (error) {
        console.error('Failed to get all complaints:', error);
        return { success: false, error: error.message };
        }
    }

    async getComplaintCount() {
        try {
        if (!this.contract) {
            throw new Error('Contract not initialized');
        }

        const count = await this.contract.complaintCount();
        return { success: true, count: Number(count) };
        } catch (error) {
        console.error('Failed to get complaint count:', error);
        return { success: false, error: error.message };
        }
    }

    async getAdmin() {
        try {
        if (!this.contract) {
            throw new Error('Contract not initialized');
        }

        // Try to get admin address - handle potential ABI issues
        let admin;
        try {
            admin = await this.contract.admin();
        } catch (adminError) {
            console.warn('admin() function failed, trying alternative method:', adminError.message);
            // If admin() fails, we can't determine admin status
            return { success: false, error: 'Unable to determine admin address' };
        }

        return { success: true, admin };
        } catch (error) {
        console.error('Failed to get admin:', error);
        return { success: false, error: error.message };
        }
    }

    async isAdmin() {
        try {
        if (!this.contract || !this.signer) {
            return { success: false, isAdmin: false };
        }

        const adminResult = await this.getAdmin();
        if (!adminResult.success) {
            console.warn('Cannot determine admin status:', adminResult.error);
            return { success: false, isAdmin: false };
        }

        const userAddress = await this.signer.getAddress();
        const isAdmin = userAddress.toLowerCase() === adminResult.admin.toLowerCase();
        
        return { success: true, isAdmin };
        } catch (error) {
        console.error('Failed to check admin status:', error);
        return { success: false, isAdmin: false };
        }
    }

    async getComplaintsByUser(userAddress) {
        try {
        if (!this.contract) {
            throw new Error('Contract not initialized');
        }

        const allComplaints = await this.contract.getAllComplaints();
        const userComplaints = allComplaints.filter(complaint => 
            complaint.user.toLowerCase() === userAddress.toLowerCase()
        );

        const formattedComplaints = userComplaints.map(complaint => ({
            id: complaint.id.toString(),
            user: complaint.user,
            description: complaint.description,
            department: DEPARTMENT_NAMES[complaint.department],
            timestamp: new Date(Number(complaint.timestamp) * 1000),
            resolved: complaint.resolved,
            resolver: complaint.resolver,
            ipfsHash: complaint.ipfsHash,
            fileHashes: complaint.fileHashes
        }));

        return { success: true, complaints: formattedComplaints };
        } catch (error) {
        console.error('Failed to get user complaints:', error);
        return { success: false, error: error.message };
        }
    }

    async getComplaintsByDepartment(department) {
        try {
        if (!this.contract) {
            throw new Error('Contract not initialized');
        }

        const allComplaints = await this.contract.getAllComplaints();
        const departmentComplaints = allComplaints.filter(complaint => 
            complaint.department === department
        );

        const formattedComplaints = departmentComplaints.map(complaint => ({
            id: complaint.id.toString(),
            user: complaint.user,
            description: complaint.description,
            department: DEPARTMENT_NAMES[complaint.department],
            timestamp: new Date(Number(complaint.timestamp) * 1000),
            resolved: complaint.resolved,
            resolver: complaint.resolver,
            ipfsHash: complaint.ipfsHash,
            fileHashes: complaint.fileHashes
        }));

        return { success: true, complaints: formattedComplaints };
        } catch (error) {
        console.error('Failed to get department complaints:', error);
        return { success: false, error: error.message };
        }
    }

    async getNetworkInfo() {
        try {
        if (!this.provider) {
            throw new Error('Provider not initialized');
        }

        const network = await this.provider.getNetwork();
        const blockNumber = await this.provider.getBlockNumber();
        
        return {
            success: true,
            network: {
                name: network.name,
                chainId: Number(network.chainId),
                blockNumber
            }
        };
        } catch (error) {
        console.error('Failed to get network info:', error);
        return { success: false, error: error.message };
        }
    }

    async getTransactionReceipt(txHash) {
        try {
        if (!this.provider) {
            throw new Error('Provider not initialized');
        }

        const receipt = await this.provider.getTransactionReceipt(txHash);
        return { success: true, receipt };
        } catch (error) {
        console.error('Failed to get transaction receipt:', error);
        return { success: false, error: error.message };
        }
    }
    }

    export const blockchainService = new BlockchainService();
