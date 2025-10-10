// Environment configuration
export const config = {
  // Blockchain Configuration
  contractAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0x1234567890123456789012345678901234567890',
  networkId: process.env.NEXT_PUBLIC_NETWORK_ID || 31337,
  rpcUrl: process.env.NEXT_PUBLIC_RPC_URL || 'http://localhost:8545',
  
  // Clerk Authentication
  clerkPublishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  clerkSecretKey: process.env.CLERK_SECRET_KEY,
  
  // API Configuration
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  
  // App Configuration
  appName: 'ComplainVault',
  appDescription: 'Blockchain-based complaint system',
  version: '1.0.0'
};

export default config;
