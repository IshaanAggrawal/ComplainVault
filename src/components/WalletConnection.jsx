"use client";
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { blockchainService } from '@/services/blockchain';
import { setBlockchainConnection, clearError } from '@/shared/store/slices/ComplaintSlice';
import toast from 'react-hot-toast';

const WalletConnection = ({ onConnect, onDisconnect }) => {
    const [isConnecting, setIsConnecting] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const dispatch = useDispatch();
    const { blockchainConnected, userAddress, isAdmin, networkInfo, error } = useSelector((state) => state.complaints);

    useEffect(() => {
        // Check if wallet is already connected
        checkWalletConnection();
    }, []);

    const checkWalletConnection = async () => {
        try {
            if (typeof window.ethereum !== 'undefined') {
                const accounts = await window.ethereum.request({ method: 'eth_accounts' });
                if (accounts.length > 0) {
                    await connectWallet();
                }
            }
        } catch (error) {
            console.error('Error checking wallet connection:', error);
        }
    };

    const connectWallet = async () => {
        setIsConnecting(true);
        dispatch(clearError());

        try {
            const walletResult = await blockchainService.connectWallet();
            
            if (walletResult.success) {
                // Get additional blockchain info
                const [adminResult, networkResult] = await Promise.all([
                    blockchainService.isAdmin(),
                    blockchainService.getNetworkInfo()
                ]);

                const connectionInfo = {
                    connected: true,
                    address: walletResult.address,
                    isAdmin: adminResult.success ? adminResult.isAdmin : false,
                    networkInfo: networkResult.success ? networkResult.network : null
                };

                // Log admin status for debugging
                if (!adminResult.success) {
                    console.warn('Could not determine admin status:', adminResult.error);
                }

                dispatch(setBlockchainConnection(connectionInfo));
                
                toast.success('Wallet connected successfully!');
                if (onConnect) onConnect(connectionInfo);
            } else {
                toast.error('Failed to connect wallet: ' + walletResult.error);
                dispatch(setBlockchainConnection({
                    connected: false,
                    address: null,
                    isAdmin: false,
                    networkInfo: null
                }));
            }
        } catch (error) {
            console.error('Wallet connection error:', error);
            toast.error('Failed to connect wallet: ' + error.message);
            dispatch(setBlockchainConnection({
                connected: false,
                address: null,
                isAdmin: false,
                networkInfo: null
            }));
        } finally {
            setIsConnecting(false);
        }
    };

    const disconnectWallet = () => {
        dispatch(setBlockchainConnection({
            connected: false,
            address: null,
            isAdmin: false,
            networkInfo: null
        }));
        
        toast.success('Wallet disconnected');
        if (onDisconnect) onDisconnect();
    };

    const formatAddress = (address) => {
        if (!address) return '';
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    };

    const getExplorerUrl = (address) => {
        if (!networkInfo) return '#';
        const chainId = networkInfo.chainId;
        
        switch (chainId) {
            case 1: // Ethereum Mainnet
                return `https://etherscan.io/address/${address}`;
            case 11155111: // Sepolia
                return `https://sepolia.etherscan.io/address/${address}`;
            case 5: // Goerli
                return `https://goerli.etherscan.io/address/${address}`;
            default:
                return '#';
        }
    };

    if (!blockchainConnected) {
        return (
            <div className="flex items-center space-x-4">
                <button
                    onClick={connectWallet}
                    disabled={isConnecting}
                    className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white px-4 py-2 rounded-lg transition duration-200 flex items-center space-x-2"
                >
                    {isConnecting ? (
                        <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            <span>Connecting...</span>
                        </>
                    ) : (
                        <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            <span>Connect Wallet</span>
                        </>
                    )}
                </button>
            </div>
        );
    }

    return (
        <div className="flex items-center space-x-4">
    

            {/* Wallet Address */}
            <div className="flex items-center space-x-2">
                <button
                    onClick={() => setShowDetails(!showDetails)}
                    className="bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg transition duration-200 flex items-center space-x-2"
                >
                    <span className="font-mono text-sm">{formatAddress(userAddress)}</span>
                    <svg 
                        className={`w-4 h-4 transition-transform ${showDetails ? 'rotate-180' : ''}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
            </div>

            {/* Disconnect Button */}
            <button
                onClick={disconnectWallet}
                className="text-gray-400 hover:text-white transition duration-200"
                title="Disconnect Wallet"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
            </button>

            {/* Details Dropdown */}
            {showDetails && (
                <div className="absolute top-16 right-4 bg-gray-800 rounded-lg p-4 shadow-xl border border-gray-700 min-w-64 z-50">
                    <div className="space-y-3">
                        <div>
                            <label className="text-xs text-gray-400 uppercase tracking-wide">Address</label>
                            <div className="flex items-center space-x-2 mt-1">
                                <span className="font-mono text-sm text-white break-all">{userAddress}</span>
                                <a
                                    href={getExplorerUrl(userAddress)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-purple-400 hover:text-purple-300 transition"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                </a>
                            </div>
                        </div>

                        {networkInfo && (
                            <div>
                                <label className="text-xs text-gray-400 uppercase tracking-wide">Network</label>
                                <div className="mt-1">
                                    <div className="text-sm text-white">{networkInfo.name}</div>
                                    <div className="text-xs text-gray-400">Chain ID: {networkInfo.chainId}</div>
                                    <div className="text-xs text-gray-400">Block: {networkInfo.blockNumber}</div>
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="text-xs text-gray-400 uppercase tracking-wide">Role</label>
                            <div className="mt-1">
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                    isAdmin 
                                        ? 'bg-yellow-500 text-yellow-900' 
                                        : 'bg-blue-500 text-blue-900'
                                }`}>
                                    {isAdmin ? 'Administrator' : 'User'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Error Display */}
            {error && (
                <div className="absolute top-16 right-4 bg-red-500 text-white px-4 py-2 rounded-lg text-sm max-w-xs z-50">
                    {error}
                </div>
            )}
        </div>
    );
};

export default WalletConnection;
