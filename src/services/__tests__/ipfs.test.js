import { ipfsService, uploadComplaintFile, uploadComplaintData, getFileFromIPFS } from '../ipfs';

// Mock IPFS client
const mockIPFSClient = {
  add: jest.fn(),
  cat: jest.fn(),
  pin: {
    add: jest.fn()
  },
  files: {
    stat: jest.fn()
  }
};

// Mock the ipfs-http-client
jest.mock('ipfs-http-client', () => ({
  create: jest.fn(() => mockIPFSClient)
}));

describe('IPFS Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('uploadFile', () => {
    it('should upload a file successfully', async () => {
      const mockFile = new File(['test content'], 'test.txt', { type: 'text/plain' });
      const mockResult = {
        path: 'QmTestHash123',
        size: 1024
      };

      mockIPFSClient.add.mockResolvedValue(mockResult);

      const result = await ipfsService.uploadFile(mockFile);

      expect(result.success).toBe(true);
      expect(result.hash).toBe('QmTestHash123');
      expect(result.size).toBe(1024);
      expect(result.url).toBe('https://ipfs.io/ipfs/QmTestHash123');
      expect(mockIPFSClient.add).toHaveBeenCalledWith(
        expect.any(Buffer),
        { pin: true, progress: expect.any(Function) }
      );
    });

    it('should handle upload errors', async () => {
      const mockFile = new File(['test content'], 'test.txt', { type: 'text/plain' });
      const mockError = new Error('Upload failed');

      mockIPFSClient.add.mockRejectedValue(mockError);

      const result = await ipfsService.uploadFile(mockFile);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Upload failed');
    });
  });

  describe('uploadFiles', () => {
    it('should upload multiple files', async () => {
      const mockFiles = [
        new File(['content1'], 'file1.txt', { type: 'text/plain' }),
        new File(['content2'], 'file2.txt', { type: 'text/plain' })
      ];

      mockIPFSClient.add
        .mockResolvedValueOnce({ path: 'QmHash1', size: 100 })
        .mockResolvedValueOnce({ path: 'QmHash2', size: 200 });

      const results = await ipfsService.uploadFiles(mockFiles);

      expect(results).toHaveLength(2);
      expect(results[0].fileName).toBe('file1.txt');
      expect(results[0].hash).toBe('QmHash1');
      expect(results[1].fileName).toBe('file2.txt');
      expect(results[1].hash).toBe('QmHash2');
    });
  });

  describe('uploadJSON', () => {
    it('should upload JSON data', async () => {
      const mockData = { test: 'data' };
      const mockResult = { path: 'QmJSONHash', size: 50 };

      mockIPFSClient.add.mockResolvedValue(mockResult);

      const result = await ipfsService.uploadJSON(mockData);

      expect(result.success).toBe(true);
      expect(result.hash).toBe('QmJSONHash');
      expect(mockIPFSClient.add).toHaveBeenCalledWith(
        Buffer.from(JSON.stringify(mockData)),
        { pin: true }
      );
    });
  });

  describe('getFile', () => {
    it('should retrieve file from IPFS', async () => {
      const mockChunks = [Buffer.from('chunk1'), Buffer.from('chunk2')];
      mockIPFSClient.cat.mockReturnValue(mockChunks[Symbol.asyncIterator]());

      const result = await ipfsService.getFile('QmTestHash');

      expect(result).toEqual(Buffer.concat(mockChunks));
    });

    it('should handle retrieval errors', async () => {
      mockIPFSClient.cat.mockRejectedValue(new Error('File not found'));

      const result = await ipfsService.getFile('QmInvalidHash');

      expect(result).toBeNull();
    });
  });

  describe('pinFile', () => {
    it('should pin file successfully', async () => {
      mockIPFSClient.pin.add.mockResolvedValue();

      const result = await ipfsService.pinFile('QmTestHash');

      expect(result.success).toBe(true);
      expect(mockIPFSClient.pin.add).toHaveBeenCalledWith('QmTestHash');
    });

    it('should handle pin errors', async () => {
      mockIPFSClient.pin.add.mockRejectedValue(new Error('Pin failed'));

      const result = await ipfsService.pinFile('QmTestHash');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Pin failed');
    });
  });

  describe('getFileInfo', () => {
    it('should get file information', async () => {
      const mockStats = {
        size: 1024,
        type: 'file'
      };

      mockIPFSClient.files.stat.mockResolvedValue(mockStats);

      const result = await ipfsService.getFileInfo('QmTestHash');

      expect(result.success).toBe(true);
      expect(result.size).toBe(1024);
      expect(result.type).toBe('file');
      expect(result.hash).toBe('QmTestHash');
    });
  });

  describe('Utility Functions', () => {
    it('uploadComplaintFile should call ipfsService.uploadFile', async () => {
      const mockFile = new File(['test'], 'test.txt');
      const mockResult = { success: true, hash: 'QmHash' };

      jest.spyOn(ipfsService, 'uploadFile').mockResolvedValue(mockResult);

      const result = await uploadComplaintFile(mockFile);

      expect(result).toEqual(mockResult);
      expect(ipfsService.uploadFile).toHaveBeenCalledWith(mockFile);
    });

    it('uploadComplaintData should call ipfsService.uploadJSON', async () => {
      const mockData = { complaint: 'data' };
      const mockResult = { success: true, hash: 'QmHash' };

      jest.spyOn(ipfsService, 'uploadJSON').mockResolvedValue(mockResult);

      const result = await uploadComplaintData(mockData);

      expect(result).toEqual(mockResult);
      expect(ipfsService.uploadJSON).toHaveBeenCalledWith(mockData);
    });

    it('getFileFromIPFS should call ipfsService.getFile', async () => {
      const mockBuffer = Buffer.from('test content');
      jest.spyOn(ipfsService, 'getFile').mockResolvedValue(mockBuffer);

      const result = await getFileFromIPFS('QmHash');

      expect(result).toEqual(mockBuffer);
      expect(ipfsService.getFile).toHaveBeenCalledWith('QmHash');
    });
  });
});
