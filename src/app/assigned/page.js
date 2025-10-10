"use client";
import { useEffect, useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { blockchainService } from '@/services/blockchain';
import toast from 'react-hot-toast';

export default function AssignedComplaintsPage() {
	const [assigned, setAssigned] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		loadAssigned();
	}, []);

	const loadAssigned = async () => {
		try {
			setLoading(true);
			const walletResult = await blockchainService.connectWallet();
			if (!walletResult.success) {
				toast.error('Failed to connect wallet: ' + walletResult.error);
				setLoading(false);
				return;
			}
			const result = await blockchainService.getAssignedComplaints?.();
			if (result?.success) {
				setAssigned(result.complaints || []);
			} else {
				setAssigned([]);
			}
		} catch (e) {
			console.error(e);
			toast.error('Error loading assigned complaints');
			setAssigned([]);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
			<Header />
			<div className="pt-20 pb-20">
				<div className="max-w-6xl mx-auto px-6 py-8">
					<h1 className="text-4xl font-bold text-white mb-8 text-center">Assigned Complaints</h1>
					{loading ? (
						<div className="text-white/80 text-center py-12">Loading...</div>
					) : assigned.length === 0 ? (
						<div className="text-gray-300 text-center py-12">No assigned complaints.</div>
					) : (
						<div className="space-y-6">
							{assigned.map((c, i) => (
								<div key={c.id || i} className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
									<div className="flex justify-between items-start mb-2">
										<h3 className="text-xl font-semibold text-white">{c.title || `Complaint #${c.id}`}</h3>
										<span className={`px-3 py-1 rounded-full text-sm ${c.resolved ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'}`}>{c.resolved ? 'Resolved' : 'Pending'}</span>
									</div>
									<p className="text-gray-300 mb-2">{c.description}</p>
									<div className="text-gray-400 text-sm">Department: {c.department || 'N/A'}</div>
								</div>
							))}
						</div>
					)}
				</div>
			</div>
			<Footer />
		</div>
	);
}


