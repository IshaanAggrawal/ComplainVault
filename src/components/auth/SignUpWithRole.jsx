"use client";
import { useState } from 'react';
import { SignUp } from '@clerk/nextjs';
import { useUser } from '@clerk/nextjs';
import RoleSelectionModal from './RoleSelectionModal';

export default function SignUpWithRole() {
  const [showRoleModal, setShowRoleModal] = useState(false);
  const { user, isLoaded } = useUser();

  // Show role selection modal when user is signed up
  if (isLoaded && user && !showRoleModal) {
    setShowRoleModal(true);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-md w-full border border-white/20">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">Sign Up</h1>
          <p className="text-gray-300">Create your account to get started</p>
        </div>
        
        <SignUp 
          routing="hash"
          appearance={{
            elements: {
              formButtonPrimary: 'bg-purple-600 hover:bg-purple-700 text-white',
              card: 'bg-transparent shadow-none',
              headerTitle: 'text-white',
              headerSubtitle: 'text-gray-300',
              socialButtonsBlockButton: 'bg-white/10 border-white/20 text-white hover:bg-white/20',
              formFieldInput: 'bg-white/10 border-white/20 text-white placeholder-gray-300',
              formFieldLabel: 'text-white',
              footerActionLink: 'text-purple-400 hover:text-purple-300',
              identityPreviewText: 'text-gray-300',
              formResendCodeLink: 'text-purple-400 hover:text-purple-300'
            }
          }}
        />
      </div>

      <RoleSelectionModal 
        isOpen={showRoleModal}
        onClose={() => setShowRoleModal(false)}
      />
    </div>
  );
}
