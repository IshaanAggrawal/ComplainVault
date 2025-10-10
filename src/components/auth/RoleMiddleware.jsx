"use client";
import { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter, usePathname } from 'next/navigation';
import { getUserRole } from '@/services/roleManager';

export default function RoleMiddleware({ children }) {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  // Pages that don't require role selection
  const publicPages = ['/sign-in', '/sign-up', '/select-role', '/'];
  const isPublicPage = publicPages.includes(pathname);

  useEffect(() => {
    if (!isLoaded) return;

    if (user && !isPublicPage) {
      const userRole = getUserRole();
      
      // If user is signed in but has no role, redirect to role selection
      if (!userRole) {
        router.push('/select-role');
        return;
      }

      // Redirect based on role if on home page
      if (pathname === '/' && userRole) {
        if (userRole === 'police') {
          router.push('/dashboard');
        } else if (userRole === 'admin') {
          router.push('/admin');
        }
      }
    }
  }, [user, isLoaded, pathname, router, isPublicPage]);

  return children;
}
