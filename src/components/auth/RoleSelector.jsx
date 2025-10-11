"use client";
import { useState } from 'react';
import { ROLES, ROLE_LABELS, setUserRole } from '@/services/roleManager';
import toast from 'react-hot-toast';

export default function RoleSelector({ onRoleSelected }) {
  const [selectedRole, setSelectedRole] = useState(ROLES.CITIZEN);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRoleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Set role in localStorage
      setUserRole(selectedRole);
      
      toast.success(Role set to ${ROLE_LABELS[selectedRole]});
      onRoleSelected(selectedRole);
    } catch (error) {
      console.error('Error setting role:', error);
      toast.error('Failed to set role. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const roleOptions = [
    {
      value: ROLES.CITIZEN,
      label: ROLE_LABELS[ROLES.CITIZEN],
      description: 'File complaints and track their status',
      icon: '👤',
      color: 'border-green-500 bg-green-500/10'
    },
    {
      value: ROLES.POLICE,
      label: ROLE_LABELS[ROLES.POLICE],
      description: 'Manage and resolve assigned complaints',
      icon: '👮',
      color: 'border-blue-500 bg-blue-500/10'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-2xl w-full border border-white/20">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">Choose Your Role</h1>
          <p className="text-gray-300">
            Select the role that best describes your position in the complaint system.
          </p>
        </div>

        <form onSubmit={handleRoleSubmit} className="space-y-6">
          <div className="space-y-4">
            {roleOptions.map((option) => (
              <label
                key={option.value}
                className={`block cursor-pointer p-6 rounded-xl border-2 transition-all ${
                  selectedRole === option.value
                    ? option.color + ' border-opacity-100'
                    : 'border-white/20 bg-white/5 hover:bg-white/10'
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value={option.value}
                  checked={selectedRole === option.value}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="sr-only"
                />
                <div className="flex items-center space-x-4">
                  <div className="text-4xl">{option.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {option.label}
                    </h3>
                    <p className="text-gray-300">{option.description}</p>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 ${
                    selectedRole === option.value
                      ? 'border-white bg-white'
                      : 'border-white/50'
                  }`}>
                    {selectedRole === option.value && (
                      <div className="w-full h-full rounded-full bg-purple-500 m-0.5"></div>
                    )}
                  </div>
                </div>
              </label>
            ))}
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="text-yellow-400 text-xl">⚠</div>
              <div>
                <h4 className="text-yellow-400 font-semibold mb-1">Important</h4>
                <p className="text-yellow-200 text-sm">
                  You can change your role later, but some features may require admin approval.
                  Police officer roles need to be verified by administrators.
                </p>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
          >
            {isSubmitting ? 'Setting Role...' : 'Continue'}
          </button>
        </form>
      </div>
    </div>
  );
}
