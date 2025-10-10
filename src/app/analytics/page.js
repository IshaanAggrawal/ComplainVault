"use client";
import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const AnalyticsMap = dynamic(() => import('@/components/analytics/AnalyticsMap'), { ssr: false });

export default function AnalyticsPage() {
	// Demo complaint clusters: { lat, lng, severity, count }
	const points = useMemo(() => ([
		{ lat: 28.6139, lng: 77.209, severity: 'high', count: 15 }, // Delhi
		{ lat: 19.076, lng: 72.8777, severity: 'medium', count: 9 }, // Mumbai
		{ lat: 12.9716, lng: 77.5946, severity: 'high', count: 20 }, // Bengaluru
		{ lat: 22.5726, lng: 88.3639, severity: 'medium', count: 7 }, // Kolkata
		{ lat: 13.0827, lng: 80.2707, severity: 'low', count: 4 }, // Chennai
	]), []);

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
			<Header />
			<div className="pt-20 pb-20">
				<div className="max-w-7xl mx-auto px-6 py-8">
					<h1 className="text-4xl font-bold text-white mb-6 text-center">Analytics</h1>
					<p className="text-gray-300 text-center mb-6">Sensitive areas highlighted with circles by complaint density and severity.</p>
					<div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden">
						<AnalyticsMap points={points} />
					</div>
				</div>
			</div>
			<Footer />
		</div>
	);
}


