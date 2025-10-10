"use client";
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useSelector } from 'react-redux';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { ROLES, ROLE_LABELS } from '@/services/clerkRoles';

export default function AdminPage() {
  const { user } = useUser();
  const { isAdmin } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState(ROLES.CITIZEN);

  // Mock users data - in real app, this would come from your backend
  useEffect(() => {
    const mockUsers = [
      {
        id: '1',
        email: 'john@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: ROLES.CITIZEN,
        createdAt: '2024-01-15',
        complaintsCount: 3
      },
      {
        id: '2',
        email: 'jane@police.gov',
        firstName: 'Jane',
        lastName: 'Smith',
        role: ROLES.POLICE,
        createdAt: '2024-01-10',
        complaintsCount: 12
      },
      {
        id: '3',
        email: 'admin@complaintvault.com',
        firstName: 'Admin',
        lastName: 'User',
        role: ROLES.ADMIN,
        createdAt: '2024-01-01',
        complaintsCount: 0
      }
    ];
    
    setUsers(mockUsers);
    setLoading(false);
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      // In a real app, you would call your backend API here
      console.log(`Changing user ${userId} role to ${newRole}`);
      
      // Update local state
      setUsers(users.map(user => 
        user.id === userId 
          ? { ...user, role: newRole }
          : user
      ));
      
      alert(`User role updated to ${ROLE_LABELS[newRole]}`);
    } catch (error) {
      console.error('Error updating user role:', error);
      alert('Error updating user role');
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
        <Header />
        <div className="pt-20 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">Access Denied</h1>
            <p className="text-gray-300">You don't have permission to access this page.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
        <Header />
        <div className="pt-20 flex items-center justify-center min-h-screen">
          <div className="text-white text-xl">Loading...</div>
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
          <h1 className="text-4xl font-bold text-white mb-8 text-center">Admin Panel</h1>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h3 className="text-white font-semibold mb-2">Total Users</h3>
              <p className="text-3xl font-bold text-purple-400">{users.length}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h3 className="text-white font-semibold mb-2">Police Officers</h3>
              <p className="text-3xl font-bold text-blue-400">
                {users.filter(u => u.role === ROLES.POLICE).length}
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h3 className="text-white font-semibold mb-2">Citizens</h3>
              <p className="text-3xl font-bold text-green-400">
                {users.filter(u => u.role === ROLES.CITIZEN).length}
              </p>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-6">User Management</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-left text-white py-4 px-2">User</th>
                    <th className="text-left text-white py-4 px-2">Email</th>
                    <th className="text-left text-white py-4 px-2">Current Role</th>
                    <th className="text-left text-white py-4 px-2">Complaints</th>
                    <th className="text-left text-white py-4 px-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-white/10">
                      <td className="py-4 px-2">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold">
                              {user.firstName[0]}{user.lastName[0]}
                            </span>
                          </div>
                          <div>
                            <p className="text-white font-medium">
                              {user.firstName} {user.lastName}
                            </p>
                            <p className="text-gray-400 text-sm">
                              Joined {new Date(user.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-2 text-gray-300">{user.email}</td>
                      <td className="py-4 px-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          user.role === ROLES.ADMIN ? 'bg-red-500/20 text-red-400' :
                          user.role === ROLES.POLICE ? 'bg-blue-500/20 text-blue-400' :
                          'bg-green-500/20 text-green-400'
                        }`}>
                          {ROLE_LABELS[user.role]}
                        </span>
                      </td>
                      <td className="py-4 px-2 text-gray-300">{user.complaintsCount}</td>
                      <td className="py-4 px-2">
                        <div className="flex space-x-2">
                          <select
                            value={user.role}
                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                            className="bg-white/20 border border-white/30 rounded-lg text-white px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                          >
                            <option value={ROLES.CITIZEN}>Citizen</option>
                            <option value={ROLES.POLICE}>Police Officer</option>
                            <option value={ROLES.ADMIN}>Administrator</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Role Information */}
          <div className="mt-8 bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h3 className="text-xl font-bold text-white mb-4">Role Permissions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="text-green-400 font-semibold mb-2">Citizen</h4>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• File complaints</li>
                  <li>• View own complaints</li>
                  <li>• Track complaint status</li>
                </ul>
              </div>
              <div>
                <h4 className="text-blue-400 font-semibold mb-2">Police Officer</h4>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• All citizen permissions</li>
                  <li>• View assigned complaints</li>
                  <li>• Resolve complaints</li>
                  <li>• View department analytics</li>
                </ul>
              </div>
              <div>
                <h4 className="text-red-400 font-semibold mb-2">Administrator</h4>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• All permissions</li>
                  <li>• Manage users</li>
                  <li>• System analytics</li>
                  <li>• Manage departments</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
