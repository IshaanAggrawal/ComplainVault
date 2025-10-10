    "use client";
    import Link from "next/link";
    import { useState } from "react";
    import { useUser, SignInButton, SignOutButton, UserButton } from "@clerk/nextjs";
    import { useSelector } from "react-redux";

    export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const { user, isSignedIn, isLoaded } = useUser();
    const role = useSelector((state) => state.user.role);
    const closeMenu = () => setIsOpen(false);

    const getLinks = () => {
        if (!isSignedIn) {
        return (
            <>
            <Link href="/" onClick={closeMenu} className="hover:text-purple-400 transition">Home</Link>
            <Link href="/analytics" onClick={closeMenu} className="hover:text-purple-400 transition">Analytics</Link>
            <SignInButton>
                <span className="cursor-pointer hover:text-purple-400">Login</span>
            </SignInButton>
            </>
        );
        }

        if (role === "Citizen") {
        return (
            <>
            <Link href="/" onClick={closeMenu} className="hover:text-purple-400 transition">Home</Link>
            <Link href="/complaints/new" onClick={closeMenu} className="hover:text-purple-400 transition">File Complaint</Link>
            <Link href="/complaints" onClick={closeMenu} className="hover:text-purple-400 transition">My Complaints</Link>
            </>
        );
        }

        if (role === "Officer") {
        return (
            <>
            <Link href="/" onClick={closeMenu} className="hover:text-purple-400 transition">Dashboard</Link>
            <Link href="/complaints/assigned" onClick={closeMenu} className="hover:text-purple-400 transition">Assigned Complaints</Link>
            <Link href="/analytics" onClick={closeMenu} className="hover:text-purple-400 transition">Analytics</Link>
            </>
        );
        }

        if (role === "Admin") {
        return (
            <>
            <Link href="/" onClick={closeMenu} className="hover:text-purple-400 transition">Admin Panel</Link>
            <Link href="/users" onClick={closeMenu} className="hover:text-purple-400 transition">Manage Users</Link>
            <Link href="/complaints" onClick={closeMenu} className="hover:text-purple-400 transition">All Complaints</Link>
            <Link href="/analytics" onClick={closeMenu} className="hover:text-purple-400 transition">Analytics</Link>
            </>
        );
        }

        return null; 
    };

    return (
        <nav className="fixed top-0 left-0 w-full z-50 bg-black/30 backdrop-blur-lg border-b border-white/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <span className="text-3xl font-bold bg-gradient-to-r from-gray-400 to-white bg-clip-text text-transparent">
            ComplainVault
            </span>

            <div className="hidden md:flex space-x-8 font-medium text-gray-200 text-lg items-center">
            {isLoaded && getLinks()}
            {isSignedIn && <UserButton signOutUrl="/" />
}
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
            {isSignedIn && <UserButton signOutUrl="/" />
}
            </div>
        )}
        </nav>
    );
    }
