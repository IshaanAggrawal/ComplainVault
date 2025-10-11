"use client";
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { loadComplaintsFromBlockchain } from '@/shared/store/slices/ComplaintSlice';
import { blockchainService } from '@/services/blockchain';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import toast from 'react-hot-toast';

export default function ComplaintsPage() {
  const [filter, setFilter] = useState('all');
  const dispatch = useDispatch();
  const { list: complaints, loading, error } = useSelector((state) => state.complaints);

  useEffect(() => {
    loadComplaints();
  }, []);

  const loadComplaints = async () => {
    try {
      // Connect to wallet first
      const walletResult = await blockchainService.connectWallet();
      if (!walletResult.success) {
        toast.error('Failed to connect wallet: ' + walletResult.error);
        return;
      }

      // Load complaints using Redux thunk
      await dispatch(loadComplaintsFromBlockchain()).unwrap();
    } catch (error) {
      console.error('Error loading complaints:', error);
      toast.error('An error occurred while loading complaints: ' + error);
    }
  };

  const filteredComplaints = complaints.filter(complaint => {
    if (filter === 'all') return true;
    if (filter === 'pending') return !complaint.resolved;
    if (filter === 'resolved') return complaint.resolved;
    return true;
  });

  const getStatusColor = (resolved) => {
    return resolved ? 'text-green-400' : 'text-yellow-400';
  };

  const getStatusText = (resolved) => {
    return resolved ? 'Resolved' : 'Pending';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
        <Header />
        <div className="pt-20 flex items-center justify-center min-h-screen">
          <div className="text-white text-xl">Loading complaints...</div>
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
          <h1 className="text-4xl font-bold text-white mb-8 text-center">My Complaints</h1>
          
          {/* Filter Buttons */}
          <div className="flex justify-center mb-8 space-x-4">
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-2 rounded-lg transition ${
                filter === 'all' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-white/20 text-gray-300 hover:bg-white/30'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-6 py-2 rounded-lg transition ${
                filter === 'pending' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-white/20 text-gray-300 hover:bg-white/30'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilter('resolved')}
              className={`px-6 py-2 rounded-lg transition ${
                filter === 'resolved' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-white/20 text-gray-300 hover:bg-white/30'
              }`}
            >
              Resolved
            </button>
          </div>

          {/* Complaints List */}
          <div className="space-y-6">
            {filteredComplaints.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-xl mb-4">No complaints found</div>
                <a
                  href="/file-complaint"
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition"
                >
                  File a New Complaint
                </a>
              </div>
            ) : (
              filteredComplaints.map((complaint, index) => (
                <div
                  key={complaint.id || index}
                  className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">
                        {complaint.title || `Complaint #${complaint.id}`}
                      </h3>
                      <p className="text-gray-300 text-sm">
                        Department: {complaint.department}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(complaint.resolved)}`}>
                      {getStatusText(complaint.resolved)}
                    </span>
                  </div>
                  
                  <p className="text-gray-300 mb-4">
                    {complaint.description}
                  </p>
                  
                  <div className="flex justify-between items-center text-sm text-gray-400">
                    <span>
                  Filed: {new Date(
                    isNaN(complaint.timestamp)
                      ? complaint.timestamp
                      : Number(complaint.timestamp) * 1000
                  ).toLocaleString()}

                    </span>
                    <div className="flex space-x-4">
                      {complaint.txHash && (
                        <a
                          href={`https://etherscan.io/tx/${complaint.txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-purple-400 hover:text-purple-300 transition"
                        >
                          View on Blockchain
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
                  
                  {/* Display attached files */}
                  {complaint.files && complaint.files.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-white/20">
                      <h4 className="text-white font-medium mb-2">Attached Files:</h4>
                      <div className="space-y-2">
                        {complaint.files.map((file, fileIndex) => (
                          <div key={fileIndex} className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-purple-600 rounded flex items-center justify-center">
                                <span className="text-white text-xs">
                                  {file.type?.startsWith('image/') ? '🖼️' : '📄'}
                                </span>
                              </div>
                              <div>
                                <p className="text-white text-sm font-medium">{file.name}</p>
                                <p className="text-gray-400 text-xs">
                                  {(file.size / 1024 / 1024).toFixed(2)} MB • {file.type}
                                </p>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              {file.url && (
                                <a
                                  href={file.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-400 hover:text-blue-300 text-sm transition"
                                >
                                  View
                                </a>
                              )}
                              {file.ipfsHash && (
                                <a
                                  href={`https://ipfs.io/ipfs/${file.ipfsHash}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-purple-400 hover:text-purple-300 text-sm transition"
                                >
                                  IPFS
                                </a>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
