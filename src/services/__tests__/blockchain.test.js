import { blockchainService, DEPARTMENTS, DEPARTMENT_NAMES } from '../blockchain';

// Mock ethers
const mockContract = {
  fileComplaint: jest.fn(),
  fileComplaintWithIPFS: jest.fn(),
  addFileToComplaint: jest.fn(),
  resolveComplaint: jest.fn(),
  getComplaint: jest.fn(),
  getAllComplaints: jest.fn(),
  complaintCount: jest.fn()
};

const mockProvider = {
  getSigner: jest.fn()
};

const mockSigner = {
  getAddress: jest.fn()
};

jest.mock('ethers', () => ({
  ethers: {
    BrowserProvider: jest.fn(() => mockProvider),
    Contract: jest.fn(() => mockContract)
  }
}));

// Mock window.ethereum
Object.defineProperty(window, 'ethereum', {
  value: {
    request: jest.fn()
  },
  writable: true
});

describe('Blockchain Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    blockchainService.provider = null;
    blockchainService.signer = null;
    blockchainService.contract = null;
  });

  describe('connectWallet', () => {
    it('should connect wallet successfully', async () => {
      mockProvider.getSigner.mockResolvedValue(mockSigner);
      mockSigner.getAddress.mockResolvedValue('0x1234567890123456789012345678901234567890');

      const result = await blockchainService.connectWallet();

      expect(result.success).toBe(true);
      expect(result.address).toBe('0x1234567890123456789012345678901234567890');
    });

    it('should handle wallet connection failure', async () => {
      delete window.ethereum;

      const result = await blockchainService.connectWallet();

      expect(result.success).toBe(false);
      expect(result.error).toBe('MetaMask not found');
    });
  });

  describe('fileComplaint', () => {
    beforeEach(() => {
      blockchainService.contract = mockContract;
    });

    it('should file complaint successfully', async () => {
      const mockTx = { wait: jest.fn().mockResolvedValue({ hash: '0xtx123' }) };
      mockContract.fileComplaint.mockResolvedValue(mockTx);

      const result = await blockchainService.fileComplaint('Test complaint', DEPARTMENTS.GENERAL);

      expect(result.success).toBe(true);
      expect(result.txHash).toBe('0xtx123');
      expect(mockContract.fileComplaint).toHaveBeenCalledWith('Test complaint', DEPARTMENTS.GENERAL);
    });

    it('should handle filing error', async () => {
      mockContract.fileComplaint.mockRejectedValue(new Error('Transaction failed'));

      const result = await blockchainService.fileComplaint('Test complaint', DEPARTMENTS.GENERAL);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Transaction failed');
    });

    it('should handle missing contract', async () => {
      blockchainService.contract = null;

      const result = await blockchainService.fileComplaint('Test complaint', DEPARTMENTS.GENERAL);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Contract not initialized');
    });
  });

  describe('fileComplaintWithIPFS', () => {
    beforeEach(() => {
      blockchainService.contract = mockContract;
    });

    it('should file complaint with IPFS hash', async () => {
      const mockTx = { wait: jest.fn().mockResolvedValue({ hash: '0xtx123' }) };
      mockContract.fileComplaintWithIPFS.mockResolvedValue(mockTx);

      const result = await blockchainService.fileComplaintWithIPFS(
        'Test complaint',
        DEPARTMENTS.POLICE,
        'QmIPFSHash123'
      );

      expect(result.success).toBe(true);
      expect(result.txHash).toBe('0xtx123');
      expect(mockContract.fileComplaintWithIPFS).toHaveBeenCalledWith(
        'Test complaint',
        DEPARTMENTS.POLICE,
        'QmIPFSHash123'
      );
    });
  });

  describe('addFileToComplaint', () => {
    beforeEach(() => {
      blockchainService.contract = mockContract;
    });

    it('should add file to complaint', async () => {
      const mockTx = { wait: jest.fn().mockResolvedValue({ hash: '0xtx123' }) };
      mockContract.addFileToComplaint.mockResolvedValue(mockTx);

      const result = await blockchainService.addFileToComplaint(1, 'QmNewFileHash');

      expect(result.success).toBe(true);
      expect(result.txHash).toBe('0xtx123');
      expect(mockContract.addFileToComplaint).toHaveBeenCalledWith(1, 'QmNewFileHash');
    });
  });

  describe('resolveComplaint', () => {
    beforeEach(() => {
      blockchainService.contract = mockContract;
    });

    it('should resolve complaint successfully', async () => {
      const mockTx = { wait: jest.fn().mockResolvedValue({ hash: '0xtx123' }) };
      mockContract.resolveComplaint.mockResolvedValue(mockTx);

      const result = await blockchainService.resolveComplaint(1);

      expect(result.success).toBe(true);
      expect(result.txHash).toBe('0xtx123');
      expect(mockContract.resolveComplaint).toHaveBeenCalledWith(1);
    });
  });

  describe('getComplaint', () => {
    beforeEach(() => {
      blockchainService.contract = mockContract;
    });

    it('should get complaint with IPFS data', async () => {
      const mockComplaint = {
        id: 1,
        user: '0x1234567890123456789012345678901234567890',
        description: 'Test complaint',
        department: 0,
        timestamp: 1640995200,
        resolved: false,
        resolver: '0x0000000000000000000000000000000000000000',
        ipfsHash: 'QmIPFSHash123',
        fileHashes: ['QmFile1', 'QmFile2']
      };

      mockContract.getComplaint.mockResolvedValue(mockComplaint);

      const result = await blockchainService.getComplaint(1);

      expect(result.success).toBe(true);
      expect(result.complaint.id).toBe('1');
      expect(result.complaint.description).toBe('Test complaint');
      expect(result.complaint.department).toBe('General');
      expect(result.complaint.ipfsHash).toBe('QmIPFSHash123');
      expect(result.complaint.fileHashes).toEqual(['QmFile1', 'QmFile2']);
    });
  });

  describe('getAllComplaints', () => {
    beforeEach(() => {
      blockchainService.contract = mockContract;
    });

    it('should get all complaints with IPFS data', async () => {
      const mockComplaints = [
        {
          id: 0,
          user: '0x1234567890123456789012345678901234567890',
          description: 'Complaint 1',
          department: 0,
          timestamp: 1640995200,
          resolved: false,
          resolver: '0x0000000000000000000000000000000000000000',
          ipfsHash: 'QmHash1',
          fileHashes: []
        },
        {
          id: 1,
          user: '0x0987654321098765432109876543210987654321',
          description: 'Complaint 2',
          department: 1,
          timestamp: 1640995300,
          resolved: true,
          resolver: '0x1111111111111111111111111111111111111111',
          ipfsHash: 'QmHash2',
          fileHashes: ['QmFile1']
        }
      ];

      mockContract.getAllComplaints.mockResolvedValue(mockComplaints);

      const result = await blockchainService.getAllComplaints();

      expect(result.success).toBe(true);
      expect(result.complaints).toHaveLength(2);
      expect(result.complaints[0].department).toBe('General');
      expect(result.complaints[1].department).toBe('Police');
      expect(result.complaints[0].ipfsHash).toBe('QmHash1');
      expect(result.complaints[1].ipfsHash).toBe('QmHash2');
    });
  });

  describe('getComplaintCount', () => {
    beforeEach(() => {
      blockchainService.contract = mockContract;
    });

    it('should get complaint count', async () => {
      mockContract.complaintCount.mockResolvedValue(5);

      const result = await blockchainService.getComplaintCount();

      expect(result.success).toBe(true);
      expect(result.count).toBe(5);
    });
  });

  describe('Constants', () => {
    it('should have correct department constants', () => {
      expect(DEPARTMENTS.GENERAL).toBe(0);
      expect(DEPARTMENTS.POLICE).toBe(1);
      expect(DEPARTMENTS.ELECTRICITY).toBe(2);
      expect(DEPARTMENTS.WATER).toBe(3);
      expect(DEPARTMENTS.TRANSPORT).toBe(4);
    });

    it('should have correct department names', () => {
      expect(DEPARTMENT_NAMES[0]).toBe('General');
      expect(DEPARTMENT_NAMES[1]).toBe('Police');
      expect(DEPARTMENT_NAMES[2]).toBe('Electricity');
      expect(DEPARTMENT_NAMES[3]).toBe('Water');
      expect(DEPARTMENT_NAMES[4]).toBe('Transport');
    });
  });
});
