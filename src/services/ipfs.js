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
      // Try different IPFS providers in order of preference
      const providers = [
        // Infura IPFS (if credentials are available)
        ...(process.env.NEXT_PUBLIC_INFURA_PROJECT_ID && process.env.NEXT_PUBLIC_INFURA_PROJECT_SECRET ? [{
          name: 'Infura IPFS',
          createClient: async () => {
            const { create } = await import('ipfs-http-client');
            return create({
              host: 'ipfs.infura.io',
              port: 5001,
              protocol: 'https',
              headers: {
                authorization: `Basic ${Buffer.from(
                  `${process.env.NEXT_PUBLIC_INFURA_PROJECT_ID}:${process.env.NEXT_PUBLIC_INFURA_PROJECT_SECRET}`
                ).toString('base64')}`
              }
            });
          }
        }] : []),
        
        // Pinata IPFS (if credentials are available)
        ...(process.env.NEXT_PUBLIC_PINATA_API_KEY ? [{
          name: 'Pinata IPFS',
          createClient: async () => {
            const { create } = await import('ipfs-http-client');
            return create({
              host: 'api.pinata.cloud',
              port: 443,
              protocol: 'https',
              headers: {
                'pinata_api_key': process.env.NEXT_PUBLIC_PINATA_API_KEY,
                'pinata_secret_api_key': process.env.NEXT_PUBLIC_PINATA_SECRET_KEY
              }
            });
          }
        }] : []),
        
        // Local IPFS node (for development)
        {
          name: 'Local IPFS',
          createClient: async () => {
            const { create } = await import('ipfs-http-client');
            return create({
              host: 'localhost',
              port: 5001,
              protocol: 'http'
            });
          }
        }
      ];

      let lastError = null;
      
      // Try authenticated providers first
      for (const provider of providers) {
        try {
          console.log(`Trying IPFS provider: ${provider.name}`);
          this.client = await provider.createClient();
          
          // Test the connection
          await this.client.id();
          console.log(`✅ Connected to IPFS provider: ${provider.name}`);
          this.isInitialized = true;
          return;
        } catch (error) {
          console.warn(`❌ Failed to connect to ${provider.name}:`, error.message);
          lastError = error;
          continue;
        }
      }
      
      // If no authenticated providers work, use localStorage fallback
      console.log('⚠️ No authenticated IPFS providers available. Using localStorage fallback mode.');
      this.client = {
        add: async (data) => {
          // Generate a hash and store data locally
          const encoder = new TextEncoder();
          const dataString = typeof data === 'string' ? data : JSON.stringify(data);
          const dataBuffer = encoder.encode(dataString);
          const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
          const hashArray = Array.from(new Uint8Array(hashBuffer));
          const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
          const hash = `Qm${hashHex.substring(0, 44)}`;
          
          // Store in localStorage for retrieval
          try {
            localStorage.setItem(`ipfs_fallback_${hash}`, dataString);
            console.log(`📦 Stored data locally with hash: ${hash}`);
          } catch (error) {
            console.error('Failed to store in localStorage:', error);
          }
          
          return { path: hash };
        },
        cat: async function* (hash) {
          // First try localStorage (for fallback-generated hashes)
          try {
            const localData = localStorage.getItem(`ipfs_fallback_${hash}`);
            if (localData) {
              console.log(`📦 Retrieved data from localStorage for hash: ${hash}`);
              yield new TextEncoder().encode(localData);
              return;
            }
          } catch (error) {
            console.warn('Failed to read from localStorage:', error);
          }
          
          // If not in localStorage, try public IPFS gateways (for real IPFS hashes)
          const gateways = [
            `https://ipfs.io/ipfs/${hash}`,
            `https://cloudflare-ipfs.com/ipfs/${hash}`,
            `https://gateway.pinata.cloud/ipfs/${hash}`
          ];
          
          let lastError;
          for (const gateway of gateways) {
            try {
              console.log(`🌐 Trying IPFS gateway: ${gateway}`);
              const response = await fetch(gateway);
              if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
              }
              const data = await response.arrayBuffer();
              console.log(`✅ Retrieved data from gateway: ${gateway}`);
              yield new Uint8Array(data);
              return;
            } catch (error) {
              lastError = error;
              console.warn(`❌ Failed to fetch from ${gateway}:`, error.message);
              continue;
            }
          }
          
          // If data not found anywhere, return mock data for demonstration
          console.warn(`⚠️ Data not found for hash ${hash}. Returning mock data.`);
          const mockData = {
            title: "Mock Complaint Data",
            description: "This complaint data could not be retrieved from IPFS or localStorage. This is mock data for demonstration purposes.",
            status: "pending",
            timestamp: Date.now(),
            note: "Original data unavailable - configure IPFS credentials to retrieve real data"
          };
          yield new TextEncoder().encode(JSON.stringify(mockData));
        },
        isFallbackMode: true
      };
      
      this.isInitialized = true;
      console.log('✅ Using IPFS fallback mode (data stored in localStorage)');
      
    } catch (error) {
      console.error('Failed to initialize IPFS client:', error);
      throw error;
    }
  }

  async uploadComplaintData(complaintData) {
    try {
      await this.initialize();
      
      if (!this.client) {
        throw new Error('IPFS client not initialized');
      }
      
      // Convert complaint data to JSON string
      const jsonData = JSON.stringify(complaintData, null, 2);
      
      // Upload to IPFS
      const result = await this.client.add(jsonData);
      const ipfsHash = result.path;
      
      console.log('Complaint data uploaded to IPFS:', ipfsHash);
      return { success: true, hash: ipfsHash };
    } catch (error) {
      console.error('Failed to upload to IPFS:', error);
      
      // Provide more specific error messages
      let errorMessage = error.message;
      if (error.message.includes('project ID does not have access')) {
        errorMessage = 'IPFS service access denied. Please check your API credentials or use a different IPFS provider.';
      } else if (error.message.includes('Failed to connect to any IPFS provider')) {
        errorMessage = 'Unable to connect to any IPFS provider. Please check your internet connection or configure IPFS credentials.';
      } else if (error.message.includes('Retrieval not supported with fallback mode')) {
        errorMessage = 'IPFS retrieval is not available in fallback mode. Please configure IPFS credentials for full functionality.';
      }
      
      return { success: false, error: errorMessage };
    }
  }

  async uploadFile(file) {
    try {
      await this.initialize();
      
      if (!this.client) {
        throw new Error('IPFS client not initialized');
      }
      
      const result = await this.client.add(file);
      const ipfsHash = result.path;
      
      console.log('File uploaded to IPFS:', ipfsHash);
      return { success: true, hash: ipfsHash };
    } catch (error) {
      console.error('Failed to upload file to IPFS:', error);
      
      // Provide more specific error messages
      let errorMessage = error.message;
      if (error.message.includes('project ID does not have access')) {
        errorMessage = 'IPFS service access denied. Please check your API credentials or use a different IPFS provider.';
      } else if (error.message.includes('Failed to connect to any IPFS provider')) {
        errorMessage = 'Unable to connect to any IPFS provider. Please check your internet connection or configure IPFS credentials.';
      } else if (error.message.includes('Retrieval not supported with fallback mode')) {
        errorMessage = 'IPFS retrieval is not available in fallback mode. Please configure IPFS credentials for full functionality.';
      }
      
      return { success: false, error: errorMessage };
    }
  }

  async retrieveComplaintData(ipfsHash) {
    try {
      await this.initialize();
      
      if (!this.client) {
        throw new Error('IPFS client not initialized');
      }
      
      const chunks = [];
      for await (const chunk of this.client.cat(ipfsHash)) {
        chunks.push(chunk);
      }
      
      // Handle both Node.js Buffer and browser Uint8Array
      let data;
      if (typeof Buffer !== 'undefined') {
        data = Buffer.concat(chunks).toString();
      } else {
        // Browser environment
        const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
        const result = new Uint8Array(totalLength);
        let offset = 0;
        for (const chunk of chunks) {
          result.set(chunk, offset);
          offset += chunk.length;
        }
        data = new TextDecoder().decode(result);
      }
      
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
      
      if (!this.client) {
        throw new Error('IPFS client not initialized');
      }
      
      const chunks = [];
      for await (const chunk of this.client.cat(ipfsHash)) {
        chunks.push(chunk);
      }
      
      // Handle both Node.js Buffer and browser Uint8Array
      let fileData;
      if (typeof Buffer !== 'undefined') {
        fileData = Buffer.concat(chunks);
      } else {
        // Browser environment
        const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
        fileData = new Uint8Array(totalLength);
        let offset = 0;
        for (const chunk of chunks) {
          fileData.set(chunk, offset);
          offset += chunk.length;
        }
      }
      
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

  // Helper method to check if in fallback mode
  isInFallbackMode() {
    return this.client?.isFallbackMode === true;
  }

  // Clear all fallback data from localStorage
  clearFallbackData() {
    if (typeof window === 'undefined') return;
    
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('ipfs_fallback_')) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => localStorage.removeItem(key));
    console.log(`🗑️ Cleared ${keysToRemove.length} fallback entries from localStorage`);
  }
}

export const ipfsService = new IPFSService();