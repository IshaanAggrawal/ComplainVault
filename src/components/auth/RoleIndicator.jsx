"use client";
import { useSelector } from 'react-redux';
import { ROLES, ROLE_LABELS } from '@/services/roleManager';

export default function RoleIndicator() {
  const { role, isAdmin, isPolice, isCitizen } = useSelector((state) => state.user);

  const getRoleColor = () => {
    if (isAdmin) return 'bg-red-500/20 text-red-400 border-red-500/30';
    if (isPolice) return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    return 'bg-green-500/20 text-green-400 border-green-500/30';
  };

  const getRoleIcon = () => {
    if (isAdmin) return '👑';
    if (isPolice) return '👮';
    return '👤';
  };

  return (
    <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full border ${getRoleColor()}`}>
      <span className="text-sm">{getRoleIcon()}</span>
      <span className="text-sm font-medium">{ROLE_LABELS[role]}</span>
    </div>
  );
}
