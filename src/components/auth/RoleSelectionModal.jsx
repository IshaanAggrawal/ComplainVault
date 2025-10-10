"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ROLES, ROLE_LABELS, setUserRole } from '@/services/roleManager';
import { useDispatch } from 'react-redux';
import { setUser } from '@/shared/store/slices/userSlice';
import { useUser } from '@clerk/nextjs';
import toast from 'react-hot-toast';

export default function RoleSelectionModal({ isOpen, onClose }) {
  const [selectedRole, setSelectedRole] = useState(ROLES.CITIZEN);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useUser();

  const handleRoleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Set role in localStorage
      setUserRole(selectedRole);
      
      // Update Redux store with serialized user data
      if (user) {
        const serializedUser = {
          id: user.id,
          email: user.emailAddresses[0]?.emailAddress,
          firstName: user.firstName,
          lastName: user.lastName,
          imageUrl: user.imageUrl,
          createdAt: user.createdAt ? new Date(user.createdAt).toISOString() : null,
          updatedAt: user.updatedAt ? new Date(user.updatedAt).toISOString() : null
        };

        dispatch(setUser({
          user: serializedUser,
          role: selectedRole,
          permissions: getRolePermissions(selectedRole)
        }));
      }
      
      toast.success(`Welcome! Role set to ${ROLE_LABELS[selectedRole]}`);
      
      // Redirect based on role
      if (selectedRole === ROLES.POLICE) {
        router.push('/dashboard');
      } else if (selectedRole === ROLES.ADMIN) {
        router.push('/admin');
      } else {
        router.push('/');
      }
      
      onClose();
    } catch (error) {
      console.error('Error setting role:', error);
      toast.error('Failed to set role. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRolePermissions = (role) => {
    const permissions = {
      [ROLES.CITIZEN]: ['file_complaint', 'view_own_complaints', 'track_complaint_status'],
      [ROLES.POLICE]: ['view_assigned_complaints', 'resolve_complaints', 'view_department_analytics', 'file_complaint', 'view_own_complaints'],
      [ROLES.ADMIN]: ['manage_users', 'view_all_complaints', 'assign_complaints', 'system_analytics', 'manage_departments', 'file_complaint', 'view_own_complaints', 'resolve_complaints']
    };
    return permissions[role] || permissions[ROLES.CITIZEN];
  };

  const roleOptions = [
    {
      value: ROLES.CITIZEN,
      label: ROLE_LABELS[ROLES.CITIZEN],
      description: 'File complaints and track their status',
      icon: '👤',
      color: 'border-green-500 bg-green-500/10',
      features: [
        'File new complaints',
        'Track complaint status',
        'View complaint history'
      ]
    },
    {
      value: ROLES.POLICE,
      label: ROLE_LABELS[ROLES.POLICE],
      description: 'Manage and resolve assigned complaints',
      icon: '👮',
      color: 'border-blue-500 bg-blue-500/10',
      features: [
        'View assigned complaints',
        'Resolve complaints',
        'View analytics'
      ]
    }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
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
              <div className="text-yellow-400 text-xl">⚠️</div>
              <div>
                <h4 className="text-yellow-400 font-semibold mb-1">Important</h4>
                <p className="text-yellow-200 text-sm">
                  You can change your role later in your profile settings.
                  Police officer roles may require additional verification.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-center space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-semibold rounded-lg transition"
            >
              {isSubmitting ? 'Setting Role...' : 'Continue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
