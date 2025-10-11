<div align="center">
  <h1>🔐 ComplainVault</h1>
  <p><strong>Blockchain-Powered Transparent Complaint Management System</strong></p>
  
  <p>
    <img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js" alt="Next.js 15" />
    <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react" alt="React 19" />
    <img src="https://img.shields.io/badge/Solidity-Smart_Contracts-363636?style=for-the-badge&logo=solidity" alt="Solidity" />
    <img src="https://img.shields.io/badge/Hardhat-Development-FFF100?style=for-the-badge&logo=hardhat" alt="Hardhat" />
  </p>

  <p>A secure, transparent, and decentralized complaint management system that leverages blockchain technology to ensure immutability, accountability, and trust in public grievance redressal.</p>

  <p>
    <a href="#-features">Features</a> •
    <a href="#-demo">Demo</a> •
    <a href="#-quick-start">Quick Start</a> •
    <a href="#-documentation">Documentation</a> •
    <a href="#-contributing">Contributing</a>
  </p>
</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [System Architecture](#-system-architecture)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Configuration](#-configuration)
- [Usage Guide](#-usage-guide)
- [Smart Contracts](#-smart-contracts)
- [Development](#-development)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)
- [Support](#-support)

---

## 🌟 Overview

**ComplainVault** revolutionizes the traditional complaint management process by bringing transparency, security, and accountability through blockchain technology. Built as a decentralized application (dApp), it eliminates the possibility of complaint manipulation, ensures real-time tracking, and provides citizens with a trustworthy platform to voice their concerns.

### Why ComplainVault?

- **🔒 Immutable Records**: Once filed, complaints cannot be altered or deleted
- **🔍 Complete Transparency**: Track every status update on the blockchain
- **⚡ Real-time Updates**: Instant notification on complaint status changes
- **🎯 Department Routing**: Intelligent categorization and routing to relevant departments
- **🛡️ Secure Authentication**: Enterprise-grade security with Clerk authentication
- **📊 Analytics Dashboard**: Comprehensive insights for administrators and departments

---

## ✨ Key Features

### For Citizens
- 📝 **Easy Complaint Filing**: Intuitive form to submit complaints with detailed descriptions
- 🔗 **Blockchain Verification**: Receive blockchain transaction hash as proof of filing
- 📱 **Real-time Tracking**: Monitor complaint status from filing to resolution
- 📚 **Complaint History**: Access complete history of all filed complaints
- 🔔 **Smart Notifications**: Get notified when complaint status changes
- 💬 **AI Chatbot Support**: Get instant help with the integrated chatbot

### For Department Officers
- 📥 **Centralized Dashboard**: View all complaints assigned to your department
- ✅ **Quick Resolution**: Mark complaints as resolved with comments
- 📊 **Performance Metrics**: Track department-wise resolution statistics
- 🎯 **Priority Management**: Handle urgent complaints efficiently
- 📈 **Analytics**: View trends and patterns in complaint data

### For Administrators
- 👥 **User Management**: Manage roles, permissions, and department assignments
- 🏢 **Department Control**: Add/remove departments and assign officers
- 📊 **System Analytics**: Comprehensive overview of system performance
- ⚙️ **Contract Management**: Monitor and manage smart contract parameters
- 🔐 **Security Oversight**: Track and manage system security settings

---

## 🏗️ System Architecture

```
ComplainVault/
├── 📁 src/                          # Frontend source code
│   ├── 📁 app/                      # Next.js App Router pages
│   │   ├── page.js                  # Home page
│   │   ├── file-complaint/          # Complaint filing interface
│   │   ├── complaints/              # Complaint listing & tracking
│   │   ├── dashboard/               # User dashboard
│   │   ├── officer/                 # Officer portal
│   │   └── admin/                   # Admin panel
│   ├── 📁 components/               # Reusable UI components
│   │   ├── layout/                  # Header, Footer, Sidebar
│   │   ├── forms/                   # Form components
│   │   ├── cards/                   # Card components
│   │   └── modals/                  # Modal dialogs
│   ├── 📁 services/                 # External service integrations
│   │   ├── blockchain.js            # Blockchain interaction layer
│   │   ├── api.js                   # API service
│   │   └── notifications.js         # Notification service
│   ├── 📁 shared/                   # Shared utilities
│   │   ├── store/                   # Redux store & slices
│   │   ├── hooks/                   # Custom React hooks
│   │   └── utils/                   # Helper functions
│   └── 📁 config/                   # Configuration files
│       └── constants.js             # App constants
│
├── 📁 blockchain/                   # Smart contract ecosystem
│   ├── 📁 contracts/                # Solidity smart contracts
│   │   ├── ComplaintManager.sol    # Main complaint contract
│   │   ├── AccessControl.sol       # Role-based access control
│   │   └── DepartmentRegistry.sol  # Department management
│   ├── 📁 scripts/                  # Deployment & utility scripts
│   │   ├── deploy.js               # Contract deployment
│   │   └── verify.js               # Contract verification
│   ├── 📁 test/                     # Smart contract tests
│   │   └── ComplaintManager.test.js
│   └── hardhat.config.js           # Hardhat configuration
│
├── 📁 Chatbot/                      # AI chatbot integration
│   ├── app.py                      # FastAPI chatbot server
│   └── models/                     # AI models
│
├── 📁 public/                       # Static assets
│   ├── images/
│   └── icons/
│
├── 📄 .env.example                  # Environment variables template
├── 📄 package.json                  # Node.js dependencies
├── 📄 tailwind.config.js           # Tailwind CSS configuration
├── 📄 next.config.js               # Next.js configuration
└── 📄 README.md                     # This file
```

### Data Flow

```
User → MetaMask → Smart Contract → Blockchain
                      ↓
                 Event Emitted
                      ↓
                Frontend (React)
                      ↓
                Redux Store → UI Update
```

---

## 🛠️ Tech Stack

### Frontend Technologies
| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 15.x | React framework with App Router & SSR |
| **React** | 19.x | UI library for building interactive interfaces |
| **Tailwind CSS** | 3.x | Utility-first CSS framework |
| **Redux Toolkit** | Latest | State management & data flow |
| **Clerk** | Latest | Authentication & user management |
| **Ethers.js** | 6.x | Ethereum wallet integration & blockchain interaction |
| **Lucide React** | Latest | Beautiful, consistent icons |

### Blockchain Technologies
| Technology | Purpose |
|------------|---------|
| **Solidity** | Smart contract development (v0.8.x) |
| **Hardhat** | Development environment & testing framework |
| **OpenZeppelin** | Secure, audited smart contract libraries |
| **Ethers.js** | Blockchain interaction library |

### Backend Technologies
| Technology | Purpose |
|------------|---------|
| **FastAPI** | Python-based API server for chatbot |
| **Node.js** | Server-side JavaScript runtime |

### Development Tools
- **Git** - Version control
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Husky** - Git hooks

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher) - [Download](https://nodejs.org/)
- **npm** (v9.0.0 or higher) or **yarn** (v1.22.0 or higher)
- **Git** - [Download](https://git-scm.com/)
- **MetaMask** browser extension - [Install](https://metamask.io/)
- **Python** (v3.8+ for chatbot) - [Download](https://www.python.org/)

### Installation

#### 1️⃣ Clone the Repository

```bash
git clone https://github.com/IshaanAggrawal/ComplainVault.git
cd ComplainVault
```

#### 2️⃣ Install Frontend Dependencies

```bash
# Using npm
npm install

# Using yarn
yarn install
```

#### 3️⃣ Install Blockchain Dependencies

```bash
cd blockchain
npm install
cd ..
```

#### 4️⃣ Install Chatbot Dependencies (Optional)

```bash
cd Chatbot
pip install -r requirements.txt
cd ..
```

#### 5️⃣ Set Up Environment Variables

```bash
# Copy the example environment file
cp .env.example .env.local
```

Edit `.env.local` with your configuration (see [Configuration](#-configuration) section).

#### 6️⃣ Compile Smart Contracts

```bash
cd blockchain
npx hardhat compile
cd ..
```

#### 7️⃣ Start Local Blockchain (Development)

```bash
cd blockchain
npx hardhat node
# Keep this terminal running
```

#### 8️⃣ Deploy Smart Contracts (New Terminal)

```bash
cd blockchain
npx hardhat run scripts/deploy.js --network localhost
# Copy the contract address from the output
cd ..
```

#### 9️⃣ Update Contract Address

Update `NEXT_PUBLIC_CONTRACT_ADDRESS` in `.env.local` with the deployed contract address.

#### 🔟 Start Development Server

```bash
npm run dev
```

#### 1️⃣1️⃣ Start Chatbot Server (Optional - New Terminal)

```bash
cd Chatbot
python app.py
```

#### 1️⃣2️⃣ Open Application

Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

---

## ⚙️ Configuration

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# ==========================================
# BLOCKCHAIN CONFIGURATION
# ==========================================
# Deployed smart contract address
NEXT_PUBLIC_CONTRACT_ADDRESS=0x1234567890123456789012345678901234567890

# Network ID (1 = Mainnet, 11155111 = Sepolia, 31337 = Localhost)
NEXT_PUBLIC_NETWORK_ID=31337

# RPC URL for blockchain connection
NEXT_PUBLIC_RPC_URL=http://localhost:8545

# Optional: Alchemy or Infura API key for production
NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_api_key_here

# ==========================================
# CLERK AUTHENTICATION
# ==========================================
# Get these from https://dashboard.clerk.com
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxx
CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxx

# Clerk redirect URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# ==========================================
# API CONFIGURATION
# ==========================================
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:3001

# Chatbot API URL
NEXT_PUBLIC_CHATBOT_URL=http://localhost:8000

# ==========================================
# APPLICATION SETTINGS
# ==========================================
# Application environment
NODE_ENV=development

# Enable debug mode
NEXT_PUBLIC_DEBUG=true
```

### MetaMask Configuration

1. **Install MetaMask**: Install the [MetaMask browser extension](https://metamask.io/)
2. **Add Local Network** (for development):
   - Network Name: `Localhost 8545`
   - RPC URL: `http://localhost:8545`
   - Chain ID: `31337`
   - Currency Symbol: `ETH`

3. **Import Test Account**: Import one of the test accounts from Hardhat node output

### Clerk Configuration

1. Create a free account at [Clerk](https://clerk.com/)
2. Create a new application
3. Copy the publishable key and secret key
4. Add them to your `.env.local` file
5. Configure OAuth providers (optional): Google, GitHub, etc.

---

## 📖 Usage Guide

### For Citizens

#### Filing a Complaint

1. **Connect Wallet**
   - Click "Connect Wallet" in the header
   - Approve MetaMask connection
   - Ensure you're on the correct network

2. **Navigate to File Complaint**
   - Click "File Complaint" in the navigation menu
   - Fill out the complaint form:
     - **Title**: Brief summary of your complaint
     - **Description**: Detailed explanation
     - **Department**: Select relevant department
     - **Priority**: Choose priority level (Low/Medium/High)
     - **Location**: Specify location (optional)
     - **Attachments**: Upload supporting documents (optional)

3. **Submit Complaint**
   - Review your complaint details
   - Click "Submit Complaint"
   - Approve the transaction in MetaMask
   - Wait for confirmation
   - Receive your complaint ID and transaction hash

4. **Track Your Complaint**
   - Navigate to "My Complaints"
   - View complaint status: Pending, In Progress, or Resolved
   - Check blockchain transaction details
   - View department responses and updates

### For Department Officers

1. **Access Officer Dashboard**
   - Sign in with your officer credentials
   - View dashboard with assigned complaints

2. **Review Complaints**
   - Browse complaints assigned to your department
   - Filter by status, priority, or date
   - View detailed complaint information

3. **Process Complaints**
   - Click on a complaint to view details
   - Add internal notes (not visible to citizens)
   - Update status to "In Progress"
   - When resolved, add resolution notes
   - Mark as "Resolved" on blockchain

4. **View Analytics**
   - Check department performance metrics
   - View resolution time statistics
   - Analyze complaint trends

### For Administrators

1. **Access Admin Panel**
   - Sign in with admin credentials
   - Navigate to admin dashboard

2. **Manage Users**
   - Add/remove department officers
   - Assign roles and permissions
   - Manage user access levels

3. **Manage Departments**
   - Create new departments
   - Assign officers to departments
   - Configure department settings

4. **System Analytics**
   - View system-wide statistics
   - Monitor blockchain transaction status
   - Generate reports
   - Track user engagement

---

## 📜 Smart Contracts

### ComplaintManager.sol

The main smart contract handling all complaint operations.

#### Key Functions

```solidity
// File a new complaint
function fileComplaint(
    string memory _title,
    string memory _description,
    string memory _department
) external returns (uint256)

// Resolve a complaint (Officer/Admin only)
function resolveComplaint(
    uint256 _complaintId,
    string memory _resolutionNote
) external

// Get complaint details
function getComplaint(uint256 _complaintId) 
    external view returns (Complaint memory)

// Get all complaints by a user
function getUserComplaints(address _user) 
    external view returns (uint256[] memory)

// Get complaints by department
function getDepartmentComplaints(string memory _department) 
    external view returns (uint256[] memory)
```

#### Events

```solidity
event ComplaintFiled(
    uint256 indexed complaintId,
    address indexed filer,
    string department,
    uint256 timestamp
);

event ComplaintResolved(
    uint256 indexed complaintId,
    address indexed resolver,
    uint256 timestamp
);

event StatusUpdated(
    uint256 indexed complaintId,
    Status newStatus,
    uint256 timestamp
);
```

#### Data Structures

```solidity
struct Complaint {
    uint256 id;
    address filer;
    string title;
    string description;
    string department;
    Status status;
    uint256 filedAt;
    uint256 resolvedAt;
    address resolver;
    string resolutionNote;
}

enum Status {
    Pending,
    InProgress,
    Resolved
}
```

### AccessControl.sol

Manages role-based access control for different user types.

### DepartmentRegistry.sol

Manages department registration and officer assignments.

---

## 💻 Development

### Project Structure Explained

- **`src/app/`**: Next.js 15 App Router pages with layouts
- **`src/components/`**: Reusable React components
- **`src/services/`**: External API and blockchain service wrappers
- **`src/shared/`**: Redux store, custom hooks, and utilities
- **`blockchain/`**: Smart contracts, deployment scripts, and tests
- **`Chatbot/`**: FastAPI-based AI chatbot backend

### Key Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Lint code
npm run lint

# Format code
npm run format

# Type check
npm run type-check
```

### Blockchain Development Commands

```bash
# Compile contracts
cd blockchain && npx hardhat compile

# Run tests
npx hardhat test

# Deploy to localhost
npx hardhat run scripts/deploy.js --network localhost

# Deploy to testnet (Sepolia)
npx hardhat run scripts/deploy.js --network sepolia

# Verify contract
npx hardhat verify --network sepolia DEPLOYED_CONTRACT_ADDRESS
```

### Code Style Guidelines

- Use **ES6+** syntax
- Follow **Airbnb JavaScript Style Guide**
- Use **functional components** with hooks
- Write **self-documenting code** with clear variable names
- Add **JSDoc comments** for complex functions
- Keep components **small and focused** (Single Responsibility)
- Use **TypeScript** where beneficial (optional)

---

## 🧪 Testing

### Frontend Testing

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Smart Contract Testing

```bash
cd blockchain

# Run all contract tests
npx hardhat test

# Run specific test file
npx hardhat test test/ComplaintManager.test.js

# Generate coverage report
npx hardhat coverage
```

### Test Structure

```javascript
// Example test structure
describe("ComplaintManager", function () {
  let complaintManager;
  let owner, user1, officer;

  beforeEach(async function () {
    // Setup
  });

  describe("Filing Complaints", function () {
    it("Should file a complaint successfully", async function () {
      // Test implementation
    });
  });
});
```

---

## 🚀 Deployment

### Frontend Deployment (Vercel)

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Configure environment variables
   - Deploy

3. **Configure Environment Variables**
   - Add all variables from `.env.local`
   - Update contract addresses for production network

### Smart Contract Deployment

#### Deploy to Testnet (Sepolia)

1. **Get Testnet ETH**
   - Visit [Sepolia Faucet](https://sepoliafaucet.com/)
   - Get test ETH for deployment

2. **Configure Hardhat**
   ```javascript
   // hardhat.config.js
   networks: {
     sepolia: {
       url: `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
       accounts: [PRIVATE_KEY]
     }
   }
   ```

3. **Deploy**
   ```bash
   cd blockchain
   npx hardhat run scripts/deploy.js --network sepolia
   ```

4. **Verify Contract**
   ```bash
   npx hardhat verify --network sepolia DEPLOYED_ADDRESS
   ```

#### Deploy to Mainnet

⚠️ **Warning**: Deploying to mainnet requires real ETH and careful consideration.

1. Thoroughly test on testnets
2. Get security audit if possible
3. Update hardhat.config.js with mainnet configuration
4. Deploy using production private key
5. Verify contract on Etherscan

---

## 🗺️ Roadmap

### Phase 1: Core Features ✅
- [x] Basic complaint filing system
- [x] Blockchain integration
- [x] User authentication
- [x] Department-based routing
- [x] Real-time tracking

### Phase 2: Enhanced Features 🚧
- [ ] **IPFS Integration**: Decentralized file storage for attachments
- [ ] **Multi-language Support**: Support for multiple languages
- [ ] **Email Notifications**: Automated email alerts
- [ ] **SMS Integration**: SMS notifications for critical updates
- [ ] **Advanced Search**: Full-text search with filters

### Phase 3: Analytics & AI 📊
- [ ] **AI-powered Categorization**: Automatic complaint categorization
- [ ] **Sentiment Analysis**: Analyze complaint sentiment
- [ ] **Predictive Analytics**: Predict resolution times
- [ ] **Advanced Dashboard**: Interactive data visualizations
- [ ] **Custom Reports**: Generate custom analytical reports

### Phase 4: Expansion 🌍
- [ ] **Mobile Apps**: Native iOS and Android applications
- [ ] **Multi-chain Support**: Support for Polygon, BSC, etc.
- [ ] **API Marketplace**: Public API for third-party integrations
- [ ] **White-label Solution**: Customizable for different organizations
- [ ] **Automated Workflows**: Smart contract-based automated resolutions

### Phase 5: Community 🤝
- [ ] **Public Voting**: Community voting on complaint priorities
- [ ] **Reputation System**: Officer and department ratings
- [ ] **Bounty System**: Rewards for quick resolutions
- [ ] **DAO Governance**: Decentralized governance model

---

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### How to Contribute

1. **Fork the Repository**
   ```bash
   # Click the "Fork" button on GitHub
   ```

2. **Clone Your Fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/ComplainVault.git
   cd ComplainVault
   ```

3. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **Make Changes**
   - Write clean, well-documented code
   - Follow existing code style
   - Add tests if applicable

5. **Commit Changes**
   ```bash
   git add .
   git commit -m "Add: your feature description"
   ```

6. **Push to GitHub**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create Pull Request**
   - Go to your fork on GitHub
   - Click "New Pull Request"
   - Describe your changes
   - Submit for review

### Contribution Guidelines

- **Code Quality**: Write clean, readable, and maintainable code
- **Testing**: Add tests for new features
- **Documentation**: Update documentation for any changes
- **Commit Messages**: Use clear, descriptive commit messages
- **Issue First**: Create an issue before starting work on major features

### Areas to Contribute

- 🐛 **Bug Fixes**: Fix reported issues
- ✨ **New Features**: Implement roadmap features
- 📚 **Documentation**: Improve documentation
- 🎨 **UI/UX**: Enhance user interface
- 🧪 **Testing**: Add more test coverage
- 🌍 **Translations**: Add language support

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2025 Ishaan Aggarwal

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

---

## 🆘 Support

Need help? We're here for you!

### Documentation
- 📖 [Full Documentation](https://complainvault.gitbook.io) (Coming Soon)
- 🎥 [Video Tutorials](https://youtube.com/@complainvault) (Coming Soon)
- 💬 [FAQ](https://github.com/IshaanAggrawal/ComplainVault/wiki/FAQ)

### Community
- 💬 [Discord Server](https://discord.gg/complainvault) - Join our community
- 🐦 [Twitter](https://twitter.com/complainvault) - Follow for updates
- 📧 [Email](mailto:support@complainvault.com) - Direct support

### Report Issues
- 🐛 [Bug Reports](https://github.com/IshaanAggrawal/ComplainVault/issues/new?template=bug_report.md)
- 💡 [Feature Requests](https://github.com/IshaanAggrawal/ComplainVault/issues/new?template=feature_request.md)
- 🔒 [Security Issues](mailto:security@complainvault.com) - Report privately

### Getting Help

1. **Check Documentation**: Most answers are in the docs
2. **Search Issues**: Someone may have had the same question
3. **Ask Community**: Join Discord for real-time help
4. **Create Issue**: Describe your problem with details

---

## 🙏 Acknowledgments

Special thanks to:

- **OpenZeppelin** for secure smart contract libraries
- **Hardhat** team for the amazing development framework
- **Next.js** team for the powerful React framework
- **Clerk** for seamless authentication
- **Tailwind CSS** for beautiful styling utilities
- **Ethers.js** for blockchain interaction
- All **contributors** who help improve this project

---

## 📊 Project Stats

![GitHub stars](https://img.shields.io/github/stars/IshaanAggrawal/ComplainVault?style=social)
![GitHub forks](https://img.shields.io/github/forks/IshaanAggrawal/ComplainVault?style=social)
![GitHub issues](https://img.shields.io/github/issues/IshaanAggrawal/ComplainVault)
![GitHub pull requests](https://img.shields.io/github/issues-pr/IshaanAggrawal/ComplainVault)

---

## 🌟 Star History

If you find this project useful, please consider giving it a ⭐ on GitHub!

---

<div align="center">
  <p>Built with ❤️ by <a href="https://github.com/IshaanAggrawal">Ishaan Aggarwal</a></p>
  <p>
    <a href="https://github.com/IshaanAggrawal/ComplainVault">GitHub</a> •
    <a href="https://complainvault.com">Website</a> •
    <a href="https://twitter.com/complainvault">Twitter</a> •
    <a href="https://discord.gg/complainvault">Discord</a>
  </p>
  
  <p><strong>⚡ Powered by Blockchain Technology ⚡</strong></p>
  
  <p>
    <sub>Transparent • Secure • Decentralized</sub>
  </p>
</div>
