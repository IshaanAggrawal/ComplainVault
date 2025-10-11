"use client";
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadComplaintsFromBlockchain, resolveComplaintOnBlockchain } from '@/shared/store/slices/ComplaintSlice';
import { blockchainService, DEPARTMENT_NAMES } from '@/services/blockchain';
import toast from 'react-hot-toast';
import Header from '../layout/Header';

const AdminPanel = () => {
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        resolved: 0,
        byDepartment: {}
    });

    const dispatch = useDispatch();
    const { list: complaints, loading, error, isAdmin } = useSelector((state) => state.complaints);

    useEffect(() => {
        if (isAdmin) {
            loadComplaints();
        }
    }, [isAdmin]);

    useEffect(() => {
        calculateStats();
    }, [complaints]);

    const loadComplaints = async () => {
        try {
            await dispatch(loadComplaintsFromBlockchain()).unwrap();
        } catch (error) {
            toast.error('Failed to load complaints: ' + error);
        }
    };

    const calculateStats = () => {
        const total = complaints.length;
        const pending = complaints.filter(c => !c.resolved).length;
        const resolved = complaints.filter(c => c.resolved).length;
        
        const byDepartment = complaints.reduce((acc, complaint) => {
            const dept = complaint.department;
            acc[dept] = (acc[dept] || 0) + 1;
            return acc;
        }, {});

        setStats({ total, pending, resolved, byDepartment });
    };

    const handleResolveComplaint = async (complaintId) => {
        try {
            await dispatch(resolveComplaintOnBlockchain(complaintId)).unwrap();
            toast.success('Complaint resolved successfully!');
            setSelectedComplaint(null);
        } catch (error) {
            toast.error('Failed to resolve complaint: ' + error);
        }
    };

    const filteredComplaints = complaints.filter(complaint => {
        const matchesFilter = filter === 'all' || 
            (filter === 'pending' && !complaint.resolved) ||
            (filter === 'resolved' && complaint.resolved);
        
        const matchesSearch = searchTerm === '' || 
            complaint.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            complaint.department.toLowerCase().includes(searchTerm.toLowerCase());
        
        return matchesFilter && matchesSearch;
    });

    const getStatusColor = (resolved) => {
        return resolved ? 'bg-green-500' : 'bg-yellow-500';
    };

    const getStatusText = (resolved) => {
        return resolved ? 'Resolved' : 'Pending';
    };

    const getExplorerUrl = (txHash) => {
        return `https://sepolia.etherscan.io/tx/${txHash}`;
    };

    if (!isAdmin) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center">
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-md mx-4 text-center">
                    <div className="text-red-400 text-6xl mb-4">🚫</div>
                    <h2 className="text-2xl font-bold text-white mb-4">Access Denied</h2>
                    <p className="text-gray-300 mb-4">
                        You need administrator privileges to access this panel.
                    </p>
                    <div className="text-sm text-gray-400">
                        <p>If you believe you should have admin access:</p>
                        <ul className="mt-2 text-left">
                            <li>• Check if your wallet is connected</li>
                            <li>• Verify you're using the admin address</li>
                            <li>• Ensure the contract is properly deployed</li>
                            <li>• Check browser console for errors</li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
        <Header/>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
            <div className="pt-20 pb-20">
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <h1 className="text-4xl font-bold text-white mb-8 text-center">Admin Panel</h1>
                    
                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                            <div className="text-3xl font-bold text-white">{stats.total}</div>
                            <div className="text-gray-300">Total Complaints</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                            <div className="text-3xl font-bold text-yellow-400">{stats.pending}</div>
                            <div className="text-gray-300">Pending</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                            <div className="text-3xl font-bold text-green-400">{stats.resolved}</div>
                            <div className="text-gray-300">Resolved</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                            <div className="text-3xl font-bold text-purple-400">
                                {stats.pending > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0}%
                            </div>
                            <div className="text-gray-300">Resolution Rate</div>
                        </div>
                    </div>

                    {/* Department Statistics */}
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 mb-8">
                        <h3 className="text-xl font-semibold text-white mb-4">Complaints by Department</h3>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            {Object.entries(stats.byDepartment).map(([dept, count]) => (
                                <div key={dept} className="text-center">
                                    <div className="text-2xl font-bold text-white">{count}</div>
                                    <div className="text-sm text-gray-300">{dept}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Filters and Search */}
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="flex space-x-2">
                            <button
                                onClick={() => setFilter('all')}
                                className={`px-4 py-2 rounded-lg transition ${
                                    filter === 'all' 
                                        ? 'bg-purple-600 text-white' 
                                        : 'bg-white/20 text-gray-300 hover:bg-white/30'
                                }`}
                            >
                                All
                            </button>
                            <button
                                onClick={() => setFilter('pending')}
                                className={`px-4 py-2 rounded-lg transition ${
                                    filter === 'pending' 
                                        ? 'bg-purple-600 text-white' 
                                        : 'bg-white/20 text-gray-300 hover:bg-white/30'
                                }`}
                            >
                                Pending
                            </button>
                            <button
                                onClick={() => setFilter('resolved')}
                                className={`px-4 py-2 rounded-lg transition ${
                                    filter === 'resolved' 
                                        ? 'bg-purple-600 text-white' 
                                        : 'bg-white/20 text-gray-300 hover:bg-white/30'
                                }`}
                            >
                                Resolved
                            </button>
                        </div>
                        
                        <input
                            type="text"
                            placeholder="Search complaints..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="flex-1 px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>

                    {/* Complaints List */}
                    <div className="space-y-4">
                        {loading ? (
                            <div className="text-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                                <div className="text-white text-xl">Loading complaints...</div>
                            </div>
                        ) : filteredComplaints.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="text-gray-400 text-xl mb-4">No complaints found</div>
                            </div>
                        ) : (
                            filteredComplaints.map((complaint) => (
                                <div
                                    key={complaint.id}
                                    className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex-1">
                                            <h3 className="text-xl font-semibold text-white mb-2">
                                                Complaint #{complaint.id}
                                            </h3>
                                            <p className="text-gray-300 text-sm mb-2">
                                                Department: {complaint.department}
                                            </p>
                                            <p className="text-gray-300 text-sm">
                                                User: {complaint.user}
                                            </p>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium text-white ${getStatusColor(complaint.resolved)}`}>
                                                {getStatusText(complaint.resolved)}
                                            </span>
                                            {!complaint.resolved && (
                                                <button
                                                    onClick={() => handleResolveComplaint(complaint.id)}
                                                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
                                                >
                                                    Resolve
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <p className="text-gray-300 mb-4">
                                        {complaint.description}
                                    </p>
                                    
                                    <div className="flex justify-between items-center text-sm text-gray-400">
                                        <span>
                                            Filed: {new Date(complaint.timestamp).toLocaleDateString()}
                                        </span>
                                        <div className="flex space-x-4">
                                            {complaint.txHash && (
                                                <a
                                                    href={getExplorerUrl(complaint.txHash)}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-purple-400 hover:text-purple-300 transition"
                                                >
                                                    View Transaction
                                                </a>
                                            )}
                                            {complaint.ipfsHash && (
                                                <a
                                                    href={`https://ipfs.io/ipfs/${complaint.ipfsHash}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-400 hover:text-blue-300 transition"
                                                >
                                                    View Files
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
        </>
    );
};

export default AdminPanel;
