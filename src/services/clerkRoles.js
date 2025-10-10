import { useUser } from '@clerk/nextjs';

// Role constants
export const ROLES = {
  CITIZEN: 'citizen',
  POLICE: 'police',
  ADMIN: 'admin'
};

export const ROLE_LABELS = {
  [ROLES.CITIZEN]: 'Citizen',
  [ROLES.POLICE]: 'Police Officer',
  [ROLES.ADMIN]: 'Administrator'
};

// Role-based permissions
export const PERMISSIONS = {
  [ROLES.CITIZEN]: [
    'file_complaint',
    'view_own_complaints',
    'track_complaint_status'
  ],
  [ROLES.POLICE]: [
    'view_assigned_complaints',
    'resolve_complaints',
    'view_department_analytics',
    'file_complaint',
    'view_own_complaints'
  ],
  [ROLES.ADMIN]: [
    'manage_users',
    'view_all_complaints',
    'assign_complaints',
    'system_analytics',
    'manage_departments',
    'file_complaint',
    'view_own_complaints',
    'resolve_complaints'
  ]
};

// Hook to get user role from Clerk metadata
export const useUserRole = () => {
  const { user, isLoaded } = useUser();
  
  if (!isLoaded || !user) {
    return { role: null, isLoaded: false };
  }

  // Get role from user's public metadata
  const role = user.publicMetadata?.role || ROLES.CITIZEN;
  
  return {
    role,
    isLoaded,
    permissions: PERMISSIONS[role] || PERMISSIONS[ROLES.CITIZEN],
    isAdmin: role === ROLES.ADMIN,
    isPolice: role === ROLES.POLICE,
    isCitizen: role === ROLES.CITIZEN
  };
};

// Check if user has specific permission
export const hasPermission = (userRole, permission) => {
  const permissions = PERMISSIONS[userRole] || PERMISSIONS[ROLES.CITIZEN];
  return permissions.includes(permission);
};

// Role-based route protection
export const getRoleBasedRoutes = (role) => {
  const baseRoutes = [
    { path: '/', label: 'Home', public: true }
  ];

  const roleRoutes = {
    [ROLES.CITIZEN]: [
      { path: '/file-complaint', label: 'File Complaint' },
      { path: '/complaints', label: 'My Complaints' }
    ],
    [ROLES.POLICE]: [
      { path: '/dashboard', label: 'Dashboard' },
      { path: '/complaints/assigned', label: 'Assigned Complaints' },
      { path: '/analytics', label: 'Analytics' },
      { path: '/file-complaint', label: 'File Complaint' }
    ],
    [ROLES.ADMIN]: [
      { path: '/admin', label: 'Admin Panel' },
      { path: '/users', label: 'Manage Users' },
      { path: '/complaints', label: 'All Complaints' },
      { path: '/analytics', label: 'Analytics' },
      { path: '/departments', label: 'Departments' }
    ]
  };

  return [...baseRoutes, ...(roleRoutes[role] || roleRoutes[ROLES.CITIZEN])];
};

export default {
  ROLES,
  ROLE_LABELS,
  PERMISSIONS,
  useUserRole,
  hasPermission,
  getRoleBasedRoutes
};
