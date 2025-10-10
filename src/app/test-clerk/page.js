"use client";
import { SignUp, SignIn } from '@clerk/nextjs';
import ClerkDebug from '@/components/debug/ClerkDebug';

export default function TestClerkPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Clerk Test Page</h1>
          <p className="text-gray-300">Test Clerk components loading</p>
        </div>
        
        <ClerkDebug />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4 text-center">Sign Up</h2>
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
          
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4 text-center">Sign In</h2>
            <SignIn 
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
        </div>
      </div>
    </div>
  );
}
