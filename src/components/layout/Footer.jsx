import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-black/50 backdrop-blur-lg border-t border-white/20 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-400 to-white bg-clip-text text-transparent mb-4">
              ComplainVault
            </h3>
            <p className="text-gray-400 mb-4">
              A secure blockchain-powered complaint system ensuring transparency, 
              security, and trust in complaint resolution.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/" className="hover:text-white transition">Home</a></li>
              <li><a href="/file-complaint" className="hover:text-white transition">File Complaint</a></li>
              <li><a href="/complaints" className="hover:text-white transition">My Complaints</a></li>
              <li><a href="/analytics" className="hover:text-white transition">Analytics</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/help" className="hover:text-white transition">Help Center</a></li>
              <li><a href="/contact" className="hover:text-white transition">Contact Us</a></li>
              <li><a href="/privacy" className="hover:text-white transition">Privacy Policy</a></li>
              <li><a href="/terms" className="hover:text-white transition">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/20 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 ComplainVault. All rights reserved. Built with blockchain technology.</p>
        </div>
      </div>
    </footer>
  );
}
