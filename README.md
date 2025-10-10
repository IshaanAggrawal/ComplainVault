# ComplainVault - Blockchain-Based Complaint System

A secure, transparent, and decentralized complaint management system built on blockchain technology. This dApp allows citizens to file complaints, track their status, and ensures complete transparency in the resolution process.

## 🚀 Features

- **Blockchain Integration**: All complaints are stored on the blockchain for immutability
- **Department-based Routing**: Complaints are automatically routed to relevant departments
- **Real-time Tracking**: Track complaint status in real-time
- **Secure Authentication**: Built with Clerk for secure user management
- **Modern UI**: Beautiful, responsive design with Tailwind CSS
- **Smart Contract**: Automated complaint processing with Solidity

## 🏗️ Architecture

```
├── src/
│   ├── app/                    # Next.js App Router pages
│   ├── components/             # Reusable UI components
│   │   ├── layout/            # Layout components (Header, Footer)
│   │   └── ...                # Other components
│   ├── pages/                 # Page components
│   ├── services/              # Blockchain and API services
│   ├── shared/                # Shared utilities and store
│   └── config/                # Configuration files
├── blockchain/                # Smart contracts and deployment
│   ├── contracts/            # Solidity contracts
│   ├── scripts/              # Deployment scripts
│   └── test/                 # Contract tests
└── Chatbot/                  # AI chatbot integration
```

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **Tailwind CSS** - Styling
- **Redux Toolkit** - State management
- **Clerk** - Authentication
- **Ethers.js** - Blockchain interaction

### Blockchain
- **Solidity** - Smart contract language
- **Hardhat** - Development framework
- **Ethers.js** - Blockchain interaction

### Backend
- **FastAPI** - Python API server
- **Node.js** - Additional server components

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git
- MetaMask wallet

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd complaint-dapp
   ```

2. **Install dependencies**
   ```bash
   # Install frontend dependencies
   npm install
   
   # Install blockchain dependencies
   cd blockchain
   npm install
   cd ..
   ```

3. **Set up environment variables**
   ```bash
   # Copy the example environment file
   cp .env.example .env.local
   
   # Edit .env.local with your configuration
   ```

4. **Deploy smart contracts**
   ```bash
   cd blockchain
   npx hardhat compile
   npx hardhat run scripts/deploy.js --network localhost
   cd ..
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

## 📋 Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Blockchain Configuration
NEXT_PUBLIC_CONTRACT_ADDRESS=0x1234567890123456789012345678901234567890
NEXT_PUBLIC_NETWORK_ID=31337
NEXT_PUBLIC_RPC_URL=http://localhost:8545

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
CLERK_SECRET_KEY=your_clerk_secret_key_here

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Smart Contract Deployment

1. **Start local blockchain**
   ```bash
   cd blockchain
   npx hardhat node
   ```

2. **Deploy contracts**
   ```bash
   npx hardhat run scripts/deploy.js --network localhost
   ```

3. **Update contract address**
   Copy the deployed contract address to your `.env.local` file.

## 🎯 Usage

### For Citizens
1. **Connect Wallet**: Connect your MetaMask wallet
2. **File Complaint**: Fill out the complaint form with details
3. **Track Status**: Monitor your complaint's progress
4. **View History**: Access all your filed complaints

### For Officers
1. **Login**: Access the officer dashboard
2. **View Assigned**: See complaints assigned to your department
3. **Resolve**: Mark complaints as resolved
4. **Analytics**: View department performance metrics

### For Admins
1. **Admin Panel**: Access comprehensive admin controls
2. **User Management**: Manage user roles and permissions
3. **System Analytics**: View system-wide statistics
4. **Contract Management**: Manage smart contract parameters

## 🔧 Development

### Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── page.js            # Home page
│   ├── file-complaint/    # File complaint page
│   └── complaints/        # View complaints page
├── components/            # Reusable components
│   ├── layout/           # Header, Footer
│   └── ...               # Other components
├── services/             # External services
│   └── blockchain.js     # Blockchain integration
├── shared/               # Shared utilities
│   └── store/           # Redux store
└── config/               # Configuration
```

### Key Components

- **Header**: Navigation and user authentication
- **FileComplaint**: Complaint submission form
- **ComplaintsList**: Display and manage complaints
- **BlockchainService**: Handle blockchain interactions

### Smart Contract Functions

- `fileComplaint(description, department)`: File a new complaint
- `resolveComplaint(complaintId)`: Mark complaint as resolved
- `getComplaint(complaintId)`: Retrieve complaint details
- `getAllComplaints()`: Get all complaints

## 🧪 Testing

### Frontend Testing
```bash
npm run test
```

### Smart Contract Testing
```bash
cd blockchain
npx hardhat test
```

## 🚀 Deployment

### Frontend Deployment
```bash
npm run build
npm run start
```

### Smart Contract Deployment
```bash
cd blockchain
npx hardhat run scripts/deploy.js --network <network-name>
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Contact the development team
- Check the documentation

## 🔮 Roadmap

- [ ] IPFS integration for file storage
- [ ] Mobile app development
- [ ] Advanced analytics dashboard
- [ ] Multi-chain support
- [ ] AI-powered complaint categorization
- [ ] Automated resolution workflows

---

Built with ❤️ using Next.js, Solidity, and blockchain technology.