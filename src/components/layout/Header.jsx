"use client";
import Link from "next/link";
import { useState } from "react";
import { useUser, SignInButton, UserButton } from "@clerk/nextjs";
import { useSelector, useDispatch } from "react-redux";
import { getRoleBasedRoutes, ROLES } from "@/services/roleManager";
import RoleIndicator from "@/components/auth/RoleIndicator";
import WalletConnection from "@/components/WalletConnection";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isSignedIn, isLoaded } = useUser();
  const { role, isAdmin, isPolice, isCitizen } = useSelector((state) => state.user);
  const { blockchainConnected, isAdmin: blockchainAdmin } = useSelector((state) => state.complaints);
  const dispatch = useDispatch();
  const closeMenu = () => setIsOpen(false);

  const getLinks = () => {
    if (!isSignedIn) {
      return (
        <>
          <Link href="/" onClick={closeMenu} className="hover:text-purple-400 transition">Home</Link>
          <Link href="/analytics" onClick={closeMenu} className="hover:text-purple-400 transition">Analytics</Link>
          <Link href="/sign-in" className="cursor-pointer hover:text-purple-400">Login</Link>
        </>
      );
    }

    // Get role-based routes
    const routes = getRoleBasedRoutes(role);
    
    const baseRoutes = routes.map((route) => (
      <Link 
        key={route.path} 
        href={route.path} 
        onClick={closeMenu} 
        className="hover:text-purple-400 transition"
      >
        {route.label}
      </Link>
    ));

    // Add blockchain admin link if user is blockchain admin
    if (blockchainAdmin) {
      baseRoutes.push(
        <Link 
          key="/complaint-admin" 
          href="/complaint-admin" 
          onClick={closeMenu} 
          className="hover:text-purple-400 transition"
        >
          Blockchain Admin
        </Link>
      );
    }

    return baseRoutes;
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-black/30 backdrop-blur-lg border-b border-white/20 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <span className="text-3xl font-bold bg-gradient-to-r from-gray-400 to-white bg-clip-text text-transparent">
          ComplainVault
        </span>

        <div className="hidden md:flex space-x-8 font-medium text-gray-200 text-lg items-center">
          {isLoaded && getLinks()}
          {isSignedIn && (
            <div className="flex items-center space-x-4">
              <RoleIndicator />
              <WalletConnection />
              <UserButton signOutUrl="/" />
            </div>
          )}
        </div>

        <button
          className="md:hidden text-gray-200 focus:outline-none text-2xl"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? "✕" : "☰"}
        </button>
      </div>

      {isOpen && (
        <div className=" flex flex-col md:hidden bg-black/50 backdrop-blur-md px-6 py-6 space-y-4 text-gray-100 text-lg font-medium animate-fadeIn">
          {isLoaded && getLinks()}
          {isSignedIn && <UserButton signOutUrl="/" />}
        </div>
      )}
    </nav>
  );
}
