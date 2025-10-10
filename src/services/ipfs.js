class IPFSService {
  constructor() {
    this.client = null;
    this.isInitialized = false;
  }

  async initialize() {
    if (this.isInitialized) return;

    // Only initialize on client side
    if (typeof window === 'undefined') {
      throw new Error('IPFS service can only be used on client side');
    }

    try {
      const { create } = await import('ipfs-http-client');
      
      this.client = create({
        host: 'ipfs.infura.io',
        port: 5001,
        protocol: 'https',
        headers: {
          authorization: `Basic ${Buffer.from(
            `${process.env.NEXT_PUBLIC_INFURA_PROJECT_ID}:${process.env.NEXT_PUBLIC_INFURA_PROJECT_SECRET}`
          ).toString('base64')}`
        }
      });
      
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize IPFS client:', error);
      throw error;
    }
  }

  async uploadComplaintData(complaintData) {
    try {
      await this.initialize();
      
      // Convert complaint data to JSON string
      const jsonData = JSON.stringify(complaintData, null, 2);
      
      // Upload to IPFS
      const result = await this.client.add(jsonData);
      const ipfsHash = result.path;
      
      console.log('Complaint data uploaded to IPFS:', ipfsHash);
      return { success: true, hash: ipfsHash };
    } catch (error) {
      console.error('Failed to upload to IPFS:', error);
      return { success: false, error: error.message };
    }
  }

  async uploadFile(file) {
    try {
      await this.initialize();
      
      const result = await this.client.add(file);
      const ipfsHash = result.path;
      
      console.log('File uploaded to IPFS:', ipfsHash);
      return { success: true, hash: ipfsHash };
    } catch (error) {
      console.error('Failed to upload file to IPFS:', error);
      return { success: false, error: error.message };
    }
  }

  async retrieveComplaintData(ipfsHash) {
    try {
      await this.initialize();
      
      const chunks = [];
      for await (const chunk of this.client.cat(ipfsHash)) {
        chunks.push(chunk);
      }
      
      const data = Buffer.concat(chunks).toString();
      const complaintData = JSON.parse(data);
      
      return { success: true, data: complaintData };
    } catch (error) {
      console.error('Failed to retrieve from IPFS:', error);
      return { success: false, error: error.message };
    }
  }

  async retrieveFile(ipfsHash) {
    try {
      await this.initialize();
      
      const chunks = [];
      for await (const chunk of this.client.cat(ipfsHash)) {
        chunks.push(chunk);
      }
      
      const fileData = Buffer.concat(chunks);
      return { success: true, data: fileData };
    } catch (error) {
      console.error('Failed to retrieve file from IPFS:', error);
      return { success: false, error: error.message };
    }
  }

  async uploadFiles(files) {
    try {
      await this.initialize();
      
      const uploadPromises = files.map(file => this.uploadFile(file));
      const results = await Promise.all(uploadPromises);
      
      return results;
    } catch (error) {
      console.error('Failed to upload files to IPFS:', error);
      return files.map(() => ({ success: false, error: error.message }));
    }
  }

  getIPFSUrl(hash) {
    return `https://ipfs.io/ipfs/${hash}`;
  }
}

export const ipfsService = new IPFSService();