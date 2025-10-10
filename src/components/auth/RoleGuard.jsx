"use client";
import { useUser } from '@clerk/nextjs';
import { useSelector } from 'react-redux';
import { useUserRole, hasPermission } from '@/services/clerkRoles';
import { ROLES } from '@/services/clerkRoles';

export default function RoleGuard({ 
  children, 
  requiredRole, 
  requiredPermission,
  fallback = null 
}) {
  const { isLoaded } = useUser();
  const { role, isAdmin, isPolice, isCitizen } = useSelector((state) => state.user);
  const { isLoaded: roleLoaded } = useUserRole();

  // Show loading state
  if (!isLoaded || !roleLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  // Check role-based access
  if (requiredRole) {
    const hasRole = 
      requiredRole === ROLES.ADMIN ? isAdmin :
      requiredRole === ROLES.POLICE ? isPolice :
      requiredRole === ROLES.CITIZEN ? isCitizen :
      false;

    if (!hasRole) {
      return fallback || <AccessDenied requiredRole={requiredRole} />;
    }
  }

  // Check permission-based access
  if (requiredPermission && !hasPermission(role, requiredPermission)) {
    return fallback || <AccessDenied permission={requiredPermission} />;
  }

  return children;
}

function AccessDenied({ requiredRole, permission }) {
  const getErrorMessage = () => {
    if (requiredRole) {
      return `This page requires ${requiredRole} access.`;
    }
    if (permission) {
      return `You don't have permission to access this feature.`;
    }
    return 'Access denied.';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">🚫</div>
        <h1 className="text-4xl font-bold text-white mb-4">Access Denied</h1>
        <p className="text-gray-300 mb-6">{getErrorMessage()}</p>
        <a
          href="/"
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition"
        >
          Go Home
        </a>
      </div>
    </div>
  );
}
