"use client";
import { useEffect, useState } from 'react';

export default function ClerkDebug() {
  const [debugInfo, setDebugInfo] = useState({});

  useEffect(() => {
    const info = {
      clerkKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? 'Set' : 'Missing',
      clerkSecret: process.env.CLERK_SECRET_KEY ? 'Set' : 'Missing',
      nodeEnv: process.env.NODE_ENV,
      publicUrl: process.env.NEXT_PUBLIC_URL,
      timestamp: new Date().toISOString()
    };
    setDebugInfo(info);
  }, []);

  return (
    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 m-4">
      <h3 className="text-yellow-400 font-semibold mb-2">Clerk Debug Info</h3>
      <div className="text-sm text-gray-300 space-y-1">
        <div>CLERK_PUBLISHABLE_KEY: {debugInfo.clerkKey}</div>
        <div>CLERK_SECRET_KEY: {debugInfo.clerkSecret}</div>
        <div>NODE_ENV: {debugInfo.nodeEnv}</div>
        <div>PUBLIC_URL: {debugInfo.publicUrl || 'Not set'}</div>
        <div>Timestamp: {debugInfo.timestamp}</div>
      </div>
    </div>
  );
}
