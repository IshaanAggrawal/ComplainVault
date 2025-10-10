"use client";
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { loadComplaintsFromBlockchain } from '@/shared/store/slices/ComplaintSlice';
import { blockchainService } from '@/services/blockchain';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalComplaints: 0,
    pendingComplaints: 0,
    resolvedComplaints: 0,
    departmentStats: {},
    recentComplaints: []
  });
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();
  const { list: complaints, blockchainConnected, userAddress, isAdmin } = useSelector((state) => state.complaints);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    calculateStats();
  }, [complaints]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Connect to wallet
      const walletResult = await blockchainService.connectWallet();
      if (!walletResult.success) {
        toast.error('Failed to connect wallet: ' + walletResult.error);
        setLoading(false);
        return;
      }

      // Load complaints
      await dispatch(loadComplaintsFromBlockchain()).unwrap();
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error('Failed to load dashboard data: ' + error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    const total = complaints.length;
    const pending = complaints.filter(c => !c.resolved).length;
    const resolved = complaints.filter(c => c.resolved).length;
    
    const departmentStats = complaints.reduce((acc, complaint) => {
      const dept = complaint.department;
      acc[dept] = (acc[dept] || 0) + 1;
      return acc;
    }, {});

    const recentComplaints = complaints
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 5);

    setStats({
      totalComplaints: total,
      pendingComplaints: pending,
      resolvedComplaints: resolved,
      departmentStats,
      recentComplaints
    });
  };

  const getStatusColor = (resolved) => {
    return resolved ? 'text-green-400' : 'text-yellow-400';
  };

  const getStatusText = (resolved) => {
    return resolved ? 'Resolved' : 'Pending';
  };

  const getExplorerUrl = (txHash) => {
    return `https://sepolia.etherscan.io/tx/${txHash}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
        <Header />
        <div className="pt-20 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <div className="text-white text-xl">Loading dashboard...</div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      <Header />
      <div className="pt-20 pb-20">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-4xl font-bold text-white mb-8 text-center">Dashboard</h1>
          
          {/* Welcome Message */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 mb-8">
            <h2 className="text-2xl font-semibold text-white mb-2">
              Welcome to ComplainVault
            </h2>
            <p className="text-gray-300">
              {blockchainConnected 
                ? `Connected as ${userAddress?.slice(0, 6)}...${userAddress?.slice(-4)}`
                : 'Please connect your wallet to access full functionality'
              }
            </p>
            {isAdmin && (
              <div className="mt-4">
                <span className="bg-yellow-500 text-yellow-900 px-3 py-1 rounded-full text-sm font-semibold">
                  Administrator
                </span>
              </div>
            )}
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-white">{stats.totalComplaints}</div>
                  <div className="text-gray-300">Total Complaints</div>
                </div>
                <div className="text-purple-400 text-4xl">📋</div>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-yellow-400">{stats.pendingComplaints}</div>
                  <div className="text-gray-300">Pending</div>
                </div>
                <div className="text-yellow-400 text-4xl">⏳</div>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-green-400">{stats.resolvedComplaints}</div>
                  <div className="text-gray-300">Resolved</div>
                </div>
                <div className="text-green-400 text-4xl">✅</div>
              </div>
            </div>
          </div>

          {/* Department Statistics */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 mb-8">
            <h3 className="text-xl font-semibold text-white mb-4">Complaints by Department</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {Object.entries(stats.departmentStats).map(([dept, count]) => (
                <div key={dept} className="text-center">
                  <div className="text-2xl font-bold text-white">{count}</div>
                  <div className="text-sm text-gray-300">{dept}</div>
                </div>
              ))}
              {Object.keys(stats.departmentStats).length === 0 && (
                <div className="col-span-full text-center text-gray-400">
                  No complaints filed yet
                </div>
              )}
            </div>
          </div>

          {/* Recent Complaints */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 mb-8">
            <h3 className="text-xl font-semibold text-white mb-4">Recent Complaints</h3>
            {stats.recentComplaints.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-400 text-lg mb-4">No complaints found</div>
                <a
                  href="/file-complaint"
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition"
                >
                  File Your First Complaint
                </a>
              </div>
            ) : (
              <div className="space-y-4">
                {stats.recentComplaints.map((complaint) => (
                  <div
                    key={complaint.id}
                    className="bg-white/5 rounded-lg p-4 border border-white/10"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-white font-medium">
                        Complaint #{complaint.id}
                      </h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(complaint.resolved)}`}>
                        {getStatusText(complaint.resolved)}
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm mb-2">
                      {complaint.description.length > 100 
                        ? `${complaint.description.substring(0, 100)}...`
                        : complaint.description
                      }
                    </p>
                    <div className="flex justify-between items-center text-xs text-gray-400">
                      <span>Department: {complaint.department}</span>
                      <span>{new Date(complaint.timestamp).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-semibold text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <a
                  href="/file-complaint"
                  className="block bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg transition text-center"
                >
                  File New Complaint
                </a>
                <a
                  href="/complaints"
                  className="block bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition text-center"
                >
                  View All Complaints
                </a>
                {isAdmin && (
                  <a
                    href="/complaint-admin"
                    className="block bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-3 rounded-lg transition text-center"
                  >
                    Admin Panel
                  </a>
                )}
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-semibold text-white mb-4">System Status</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Blockchain</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    blockchainConnected ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                  }`}>
                    {blockchainConnected ? 'Connected' : 'Disconnected'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">IPFS</span>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-500 text-white">
                    Available
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Network</span>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-500 text-white">
                    Sepolia
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
