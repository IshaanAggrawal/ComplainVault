"use client";
import { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useDispatch } from 'react-redux';
import { setUser, clearUser } from '@/shared/store/slices/userSlice';
import { getUserRole, PERMISSIONS } from '@/services/roleManager';

export default function ClerkRoleSync() {
  const { user, isLoaded } = useUser();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isLoaded) return;

    if (user) {
      // Get role from localStorage
      const role = getUserRole();
      const permissions = PERMISSIONS[role] || PERMISSIONS.citizen;
      
      // Sync user data with Redux store (serialized)
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
        role,
        permissions
      }));
    } else {
      // Clear user data if not authenticated
      dispatch(clearUser());
    }
  }, [user, isLoaded, dispatch]);

  // This component doesn't render anything
  return null;
}
