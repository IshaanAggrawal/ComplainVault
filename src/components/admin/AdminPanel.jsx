    "use client";
    import React, { useState, useEffect } from "react";
    import { useDispatch, useSelector } from "react-redux";
    import {
    loadComplaintsFromBlockchain,
    resolveComplaintOnBlockchain,
    } from "@/shared/store/slices/ComplaintSlice";
    import { blockchainService } from "@/services/blockchain";
    import toast from "react-hot-toast";
    import Header from "../layout/Header";

    const AdminPanel = () => {
    const [filter, setFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        resolved: 0,
        byDepartment: {},
    });

    const dispatch = useDispatch();
    const { list: complaints, loading, isAdmin } = useSelector(
        (state) => state.complaints
    );

    useEffect(() => {
        if (isAdmin) loadComplaints();
    }, [isAdmin]);

    useEffect(() => {
        calculateStats();
    }, [complaints]);

    const loadComplaints = async () => {
        try {
        await dispatch(loadComplaintsFromBlockchain()).unwrap();
        } catch (error) {
        toast.error("Failed to load complaints: " + error);
        }
    };

    const calculateStats = () => {
        const total = complaints.length;
        const pending = complaints.filter((c) => !c.resolved).length;
        const resolved = complaints.filter((c) => c.resolved).length;

        const byDepartment = complaints.reduce((acc, complaint) => {
        const dept = complaint.department;
        acc[dept] = (acc[dept] || 0) + 1;
        return acc;
        }, {});

        setStats({ total, pending, resolved, byDepartment });
    };

    const handleResolveComplaint = async (complaintId) => {
        try {
        await dispatch(resolveComplaintOnBlockchain(complaintId)).unwrap();
        toast.success("Complaint resolved successfully!");
        } catch (error) {
        toast.error("Failed to resolve complaint: " + error);
        }
    };

    const filteredComplaints = complaints.filter((complaint) => {
        const matchesFilter =
        filter === "all" ||
        (filter === "pending" && !complaint.resolved) ||
        (filter === "resolved" && complaint.resolved);
        const matchesSearch =
        searchTerm === "" ||
        complaint.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
        complaint.department
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const getStatusStyle = (resolved) =>
        resolved
        ? "bg-green-500/30 text-green-300 border border-green-400/30"
        : "bg-yellow-500/30 text-yellow-300 border border-yellow-400/30";

    return (
        <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 text-white">
            <div className="pt-24 pb-20 max-w-7xl mx-auto px-6">
            <h1 className="text-4xl font-bold text-center mb-10 tracking-wide">
                ⚙️ Admin Complaint Dashboard
            </h1>

            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                {[
                {
                    title: "Total Complaints",
                    value: stats.total,
                    color: "from-purple-500 to-pink-400",
                },
                {
                    title: "Pending",
                    value: stats.pending,
                    color: "from-yellow-500 to-orange-400",
                },
                {
                    title: "Resolved",
                    value: stats.resolved,
                    color: "from-green-500 to-emerald-400",
                },
                {
                    title: "Resolution Rate",
                    value:
                    stats.total > 0
                        ? Math.round((stats.resolved / stats.total) * 100)
                        : 0,
                    suffix: "%",
                    color: "from-blue-500 to-cyan-400",
                },
                ].map((card, i) => (
                <div
                    key={i}
                    className={`bg-gradient-to-br ${card.color} rounded-2xl p-6 text-center shadow-lg shadow-black/20 hover:scale-105 transition`}
                >
                    <div className="text-3xl font-bold">{card.value}{card.suffix || ""}</div>
                    <div className="text-white/90 mt-2">{card.title}</div>
                </div>
                ))}
            </div>

            {/* Department Chips */}
            <div className="flex flex-wrap gap-3 mb-10 justify-center">
                {Object.entries(stats.byDepartment).map(([dept, count]) => (
                <div
                    key={dept}
                    className="px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-sm font-medium hover:bg-white/20 transition"
                >
                    {dept}: <span className="text-purple-300 ml-1">{count}</span>
                </div>
                ))}
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
                <div className="flex space-x-2">
                {["all", "pending", "resolved"].map((type) => (
                    <button
                    key={type}
                    onClick={() => setFilter(type)}
                    className={`px-5 py-2 rounded-full text-sm font-semibold transition ${
                        filter === type
                        ? "bg-purple-600 text-white shadow-lg shadow-purple-500/40"
                        : "bg-white/10 text-gray-300 hover:bg-white/20"
                    }`}
                    >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                ))}
                </div>

                <input
                type="text"
                placeholder="🔍 Search complaints..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-80 px-4 py-2 rounded-full bg-white/10 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
            </div>

            {/* Complaints List */}
            <div className="space-y-6">
                {loading ? (
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                    <div className="text-white text-xl">Loading complaints...</div>
                </div>
                ) : filteredComplaints.length === 0 ? (
                <div className="text-center py-16 text-gray-400 text-lg">
                    No complaints found 🚫
                </div>
                ) : (
                filteredComplaints.map((complaint) => (
                    <div
                    key={complaint.id}
                    className="group bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl p-6 transition transform hover:scale-[1.01] hover:shadow-xl"
                    >
                    <div className="flex justify-between items-start mb-4">
                        <div>
                        <h3 className="text-2xl font-semibold text-white mb-1">
                            Complaint #{complaint.id}
                        </h3>
                        <p className="text-gray-300 text-sm">
                            🏢 {complaint.department}
                        </p>
                        <p className="text-gray-400 text-xs mt-1">
                            👤 Filed by: {complaint.user}
                        </p>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                        <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                            complaint.resolved
                            )}`}
                        >
                            {complaint.resolved ? "Resolved" : "Pending"}
                        </span>
                        {!complaint.resolved && (
                            <button
                            onClick={() => handleResolveComplaint(complaint.id)}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition shadow-md"
                            >
                            Mark Resolved ✅
                            </button>
                        )}
                        </div>
                    </div>

                    <p className="text-gray-300 mb-4 leading-relaxed">
                        {complaint.description}
                    </p>

                    <div className="flex justify-between items-center text-sm text-gray-400">
                        <span>
                        📅 Filed:{" "}
                        {new Date(complaint.timestamp).toLocaleDateString()}
                        </span>
                        <div className="flex space-x-4">
                        {complaint.txHash && (
                            <a
                            href={`https://sepolia.etherscan.io/tx/${complaint.txHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-purple-400 hover:text-purple-300"
                            >
                            Blockchain 🔗
                            </a>
                        )}
                        {complaint.ipfsHash && (
                            <a
                            href={`https://ipfs.io/ipfs/${complaint.ipfsHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300"
                            >
                            View Files 📁
                            </a>
                        )}
                        </div>
                    </div>
                    </div>
                ))
                )}
            </div>
            </div>
        </div>
        </>
    );
    };

    export default AdminPanel;
