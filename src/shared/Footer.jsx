    "use client";
    import React from "react";
    import { Twitter, Youtube, Instagram, Github } from "lucide-react";

    function Footer() {
    return (
        <footer className="w-full bg-[#0a0a1a] text-gray-400 border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
            
            <div>
            <h2 className="text-2xl font-bold text-white">Complain<span className="text-purple-500">Vault</span></h2>
            <p className="mt-3 text-sm text-gray-400">
                A blockchain-based smart complaint system that ensures privacy, 
                transparency, and quick resolutions.
            </p>
            </div>

            <div>
            <h3 className="text-white font-semibold mb-3">About</h3>
            <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition">Features</a></li>
                <li><a href="#" className="hover:text-white transition">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition">Support</a></li>
                <li><a href="#" className="hover:text-white transition">Forums</a></li>
            </ul>
            </div>

            <div>
            <h3 className="text-white font-semibold mb-3">Project</h3>
            <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition">Contribute</a></li>
                <li><a href="#" className="hover:text-white transition">Changelog</a></li>
                <li><a href="#" className="hover:text-white transition">Releases</a></li>
                <li><a href="#" className="hover:text-white transition">Docs</a></li>
            </ul>
            </div>

            <div>
            <h3 className="text-white font-semibold mb-3">Community</h3>
            <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition">Join Discord</a></li>
                <li><a href="#" className="hover:text-white transition">Follow on Twitter</a></li>
                <li><a href="#" className="hover:text-white transition">Email Newsletter</a></li>
                <li><a href="#" className="hover:text-white transition">GitHub Discussions</a></li>
            </ul>
            </div>
        </div>

        <div className="border-t border-gray-800 mt-6">
            <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm">&copy; {new Date().getFullYear()} ComplainVault. All rights reserved.</p>

            <div className="flex space-x-4 mt-4 md:mt-0">
                <a href="#" className="hover:text-white"><Twitter size={18} /></a>
                <a href="#" className="hover:text-white"><Youtube size={18} /></a>
                <a href="#" className="hover:text-white"><Instagram size={18} /></a>
                <a href="#" className="hover:text-white"><Github size={18} /></a>
            </div>
            </div>
        </div>
        </footer>
    );
    }

    export default Footer;
