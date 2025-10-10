// Simple role management system without Clerk metadata
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

// Role permissions
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

// Local storage key for user role
const ROLE_STORAGE_KEY = 'complaint_dapp_user_role';

// Get user role from localStorage
export const getUserRole = () => {
  if (typeof window === 'undefined') return ROLES.CITIZEN;
  
  const storedRole = localStorage.getItem(ROLE_STORAGE_KEY);
  return storedRole || ROLES.CITIZEN;
};

// Set user role in localStorage
export const setUserRole = (role) => {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem(ROLE_STORAGE_KEY, role);
};

// Clear user role
export const clearUserRole = () => {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem(ROLE_STORAGE_KEY);
};

// Check if user has specific permission
export const hasPermission = (userRole, permission) => {
  const permissions = PERMISSIONS[userRole] || PERMISSIONS[ROLES.CITIZEN];
  return permissions.includes(permission);
};

// Get role-based routes
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
      { path: '/assigned', label: 'Assigned Complaints' },
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

// Role validation
export const isValidRole = (role) => {
  return Object.values(ROLES).includes(role);
};

export default {
  ROLES,
  ROLE_LABELS,
  PERMISSIONS,
  getUserRole,
  setUserRole,
  clearUserRole,
  hasPermission,
  getRoleBasedRoutes,
  isValidRole
};
