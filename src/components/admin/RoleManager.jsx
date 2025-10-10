"use client";
import { useState, useEffect } from 'react';
import { ROLES, ROLE_LABELS, setUserRole, getUserRole } from '@/services/roleManager';
import toast from 'react-hot-toast';

export default function RoleManager({ userId, currentRole, onRoleChange }) {
  const [selectedRole, setSelectedRole] = useState(currentRole);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleRoleUpdate = async () => {
    setIsUpdating(true);
    
    try {
      // In a real app, you would call your backend API here
      // For now, we'll just update localStorage
      setUserRole(selectedRole);
      
      toast.success(`User role updated to ${ROLE_LABELS[selectedRole]}`);
      onRoleChange(selectedRole);
    } catch (error) {
      console.error('Error updating role:', error);
      toast.error('Failed to update role');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
      <h3 className="text-xl font-bold text-white mb-4">Role Management</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-white font-medium mb-2">
            Select Role
          </label>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value={ROLES.CITIZEN}>Citizen</option>
            <option value={ROLES.POLICE}>Police Officer</option>
            <option value={ROLES.ADMIN}>Administrator</option>
          </select>
        </div>

        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
          <h4 className="text-blue-400 font-semibold mb-2">Role Permissions</h4>
          <div className="text-gray-300 text-sm">
            {selectedRole === ROLES.CITIZEN && (
              <ul className="space-y-1">
                <li>• File complaints</li>
                <li>• View own complaints</li>
                <li>• Track complaint status</li>
              </ul>
            )}
            {selectedRole === ROLES.POLICE && (
              <ul className="space-y-1">
                <li>• All citizen permissions</li>
                <li>• View assigned complaints</li>
                <li>• Resolve complaints</li>
                <li>• View department analytics</li>
              </ul>
            )}
            {selectedRole === ROLES.ADMIN && (
              <ul className="space-y-1">
                <li>• All permissions</li>
                <li>• Manage users</li>
                <li>• System analytics</li>
                <li>• Manage departments</li>
              </ul>
            )}
          </div>
        </div>

        <button
          onClick={handleRoleUpdate}
          disabled={isUpdating || selectedRole === currentRole}
          className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
        >
          {isUpdating ? 'Updating...' : 'Update Role'}
        </button>
      </div>
    </div>
  );
}
