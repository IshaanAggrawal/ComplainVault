"use client";
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import RoleGuard from '@/components/auth/RoleGuard';
import { ROLES } from '@/services/clerkRoles';

export default function Dashboard() {
  const { isPolice, isAdmin } = useSelector((state) => state.user);
  const [stats, setStats] = useState({
    assignedComplaints: 0,
    resolvedToday: 0,
    pendingComplaints: 0,
    averageResolutionTime: 0
  });
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - in real app, fetch from API
    setStats({
      assignedComplaints: 12,
      resolvedToday: 3,
      pendingComplaints: 9,
      averageResolutionTime: 2.5
    });

    setRecentComplaints([
      {
        id: '1',
        title: 'Street Light Out',
        description: 'Street light not working on Main Street',
        department: 'Electricity',
        status: 'Pending',
        priority: 'Medium',
        createdAt: '2024-01-15T10:30:00Z'
      },
      {
        id: '2',
        title: 'Pothole Report',
        description: 'Large pothole on Highway 101',
        department: 'Transport',
        status: 'In Progress',
        priority: 'High',
        createdAt: '2024-01-15T09:15:00Z'
      }
    ]);

    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
        <Header />
        <div className="pt-20 flex items-center justify-center min-h-screen">
          <div className="text-white text-xl">Loading dashboard...</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <RoleGuard requiredRole={ROLES.POLICE}>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
        <Header />
        <div className="pt-20 pb-20">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-white mb-2">Police Dashboard</h1>
              <p className="text-gray-300">Manage and track assigned complaints</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-300 text-sm">Assigned Complaints</p>
                    <p className="text-3xl font-bold text-white">{stats.assignedComplaints}</p>
                  </div>
                  <div className="text-blue-400 text-3xl">📋</div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-300 text-sm">Resolved Today</p>
                    <p className="text-3xl font-bold text-white">{stats.resolvedToday}</p>
                  </div>
                  <div className="text-green-400 text-3xl">✅</div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-300 text-sm">Pending</p>
                    <p className="text-3xl font-bold text-white">{stats.pendingComplaints}</p>
                  </div>
                  <div className="text-yellow-400 text-3xl">⏳</div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-300 text-sm">Avg. Resolution (days)</p>
                    <p className="text-3xl font-bold text-white">{stats.averageResolutionTime}</p>
                  </div>
                  <div className="text-purple-400 text-3xl">⏱️</div>
                </div>
              </div>
            </div>

            {/* Recent Complaints */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <h2 className="text-2xl font-bold text-white mb-6">Recent Complaints</h2>
                <div className="space-y-4">
                  {recentComplaints.map((complaint) => (
                    <div key={complaint.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-white font-semibold">{complaint.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          complaint.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-400' :
                          complaint.status === 'In Progress' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-green-500/20 text-green-400'
                        }`}>
                          {complaint.status}
                        </span>
                      </div>
                      <p className="text-gray-300 text-sm mb-2">{complaint.description}</p>
                      <div className="flex justify-between items-center text-sm text-gray-400">
                        <span>Department: {complaint.department}</span>
                        <span>Priority: {complaint.priority}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
                <div className="space-y-4">
                  <a
                    href="/assigned"
                    className="block bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg transition"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">📋</div>
                      <div>
                        <h3 className="font-semibold">View Assigned Complaints</h3>
                        <p className="text-sm opacity-90">Manage your assigned complaints</p>
                      </div>
                    </div>
                  </a>

                  <a
                    href="/analytics"
                    className="block bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-lg transition"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">📊</div>
                      <div>
                        <h3 className="font-semibold">View Analytics</h3>
                        <p className="text-sm opacity-90">Check performance metrics</p>
                      </div>
                    </div>
                  </a>

                  <a
                    href="/file-complaint"
                    className="block bg-green-600 hover:bg-green-700 text-white p-4 rounded-lg transition"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">➕</div>
                      <div>
                        <h3 className="font-semibold">File New Complaint</h3>
                        <p className="text-sm opacity-90">Create a new complaint</p>
                      </div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </RoleGuard>
  );
}
