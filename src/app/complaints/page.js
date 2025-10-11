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
  const { list: complaints, loading } = useSelector((state) => state.complaints);

  useEffect(() => {
    loadComplaints();
  }, []);

  const loadComplaints = async () => {
    try {
      const walletResult = await blockchainService.connectWallet();
      if (!walletResult.success) {
        toast.error('Failed to connect wallet: ' + walletResult.error);
        return;
      }
      await dispatch(loadComplaintsFromBlockchain()).unwrap();
    } catch (error) {
      console.error('Error loading complaints:', error);
      toast.error('An error occurred while loading complaints.');
    }
  };

  const filteredComplaints = complaints.filter((c) =>
    filter === 'all' ? true : filter === 'pending' ? !c.resolved : c.resolved
  );

  const getStatusColor = (resolved) =>
    resolved
      ? 'bg-gradient-to-r from-green-400 to-emerald-600 text-white shadow-green-500/30'
      : 'bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 shadow-orange-400/30';

  const getStatusText = (resolved) => (resolved ? 'Resolved' : 'Pending');

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
        <Header />
        <div className="pt-20 flex items-center justify-center min-h-screen">
          <div className="text-white text-xl animate-pulse">Loading complaints...</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      <Header />
      <div className="pt-20 pb-24">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-4xl font-extrabold text-white mb-10 text-center tracking-tight">
            My Complaints
          </h1>

          {/* Filter Buttons */}
          <div className="flex justify-center mb-10 space-x-4">
            {['all', 'pending', 'resolved'].map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-6 py-2.5 rounded-full font-medium transition-all duration-300 
                  ${filter === type
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg shadow-purple-500/30 scale-105'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:scale-105'
                  }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>

          {/* Complaints List */}
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredComplaints.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <div className="text-gray-400 text-xl mb-6">No complaints found</div>
                <a
                  href="/file-complaint"
                  className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-indigo-500 hover:to-purple-600 text-white px-6 py-3 rounded-full transition-all duration-300 shadow-lg shadow-purple-500/30"
                >
                  File a New Complaint
                </a>
              </div>
            ) : (
              filteredComplaints.map((complaint, index) => (
                <div
                  key={complaint.id || index}
                  className="group relative bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-purple-400/40 transition-all duration-300 hover:shadow-[0_0_30px_rgba(168,85,247,0.3)]"
                >
                  {/* Status Chip */}
                  <div
                    className={`absolute top-5 right-5 px-4 py-1.5 text-sm font-semibold rounded-full shadow-md ${getStatusColor(
                      complaint.resolved
                    )}`}
                  >
                    {getStatusText(complaint.resolved)}
                  </div>

                  {/* Complaint Title */}
                  <h3 className="text-2xl font-semibold text-white mb-3 pr-28">
                    {complaint.title || `Complaint #${complaint.id}`}
                  </h3>

                  {/* Department */}
                  <p className="text-gray-400 text-sm mb-4">
                    🏢 Department: <span className="text-gray-200">{complaint.department}</span>
                  </p>

                  {/* Description */}
                  <p className="text-gray-200 text-sm leading-relaxed mb-6 line-clamp-3">
                    {complaint.description}
                  </p>

                  {/* Timestamp */}
                  <div className="text-xs text-gray-400 mb-4">
                    📅 Filed:{' '}
                    {new Date(
                      isNaN(complaint.timestamp)
                        ? complaint.timestamp
                        : Number(complaint.timestamp) * 1000
                    ).toLocaleString()}
                  </div>

                  {/* Links */}
                  <div className="flex flex-wrap gap-3 mt-3 text-sm">
                    {complaint.txHash && (
                      <a
                        href={`https://etherscan.io/tx/${complaint.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-full bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 hover:text-white transition"
                      >
                        🔗 View on Blockchain
                      </a>
                    )}
                    {complaint.ipfsHash && (
                      <a
                        href={`https://ipfs.io/ipfs/${complaint.ipfsHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-full bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 hover:text-white transition"
                      >
                        🧩 View Files
                      </a>
                    )}
                  </div>

                  {/* Attached Files */}
                  {complaint.files && complaint.files.length > 0 && (
                    <div className="mt-6 pt-4 border-t border-white/10">
                      <h4 className="text-white font-medium mb-3 text-sm uppercase tracking-wide">
                        Attached Files
                      </h4>
                      <div className="space-y-3">
                        {complaint.files.map((file, fileIndex) => (
                          <div
                            key={fileIndex}
                            className="flex items-center justify-between bg-white/5 rounded-xl p-3 hover:bg-white/10 transition"
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center text-white">
                                {file.type?.startsWith('image/') ? '🖼️' : '📄'}
                              </div>
                              <div>
                                <p className="text-white text-sm font-medium">{file.name}</p>
                                <p className="text-gray-400 text-xs">
                                  {(file.size / 1024 / 1024).toFixed(2)} MB • {file.type}
                                </p>
                              </div>
                            </div>
                            <div className="flex space-x-3">
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
