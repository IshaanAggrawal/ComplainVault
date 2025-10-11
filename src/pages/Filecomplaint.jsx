    "use client";
    import React, { useState } from "react";
    import { useDispatch, useSelector } from "react-redux";
    import { fileComplaintToBlockchain } from "@/shared/store/slices/ComplaintSlice";
    import { blockchainService, DEPARTMENTS } from "@/services/blockchain";
    import { ipfsService } from "@/services/ipfs";
    import toast from "react-hot-toast";
    import Header from "@/components/layout/Header";
    import Footer from "@/components/layout/Footer";

    // ✅ Backend API endpoint (FastAPI RAG)
    const API_BASE = "http://127.0.0.1:8000";

    // --- Helper function: Classify complaint using FastAPI ---
    const classifyComplaint = async (description) => {
    try {
        const response = await fetch(`${API_BASE}/classify`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ description }),
        });

        if (!response.ok) throw new Error("Failed to classify complaint");

        const data = await response.json();
        return data; // { department, department_id, raw_response }
    } catch (error) {
        console.error("Classification error:", error);
        return null;
    }
    };

    function FileComplaint() {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        department: DEPARTMENTS.GENERAL,
    });
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [files, setFiles] = useState([]);
    const [uploadingFiles, setUploadingFiles] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const dispatch = useDispatch();
    const { loading } = useSelector((state) => state.complaints);

    // --- Handle input change + auto-classify description ---
    const handleInputChange = async (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
        ...prev,
        [name]: value,
        }));

        // Auto-classify when description is sufficiently long
        if (name === "description" && value.trim().length > 20) {
        toast.loading("Classifying complaint...", { id: "classification" });
        const result = await classifyComplaint(value);
        toast.dismiss("classification");

        if (result?.department) {
            setFormData((prev) => ({
            ...prev,
            department: result.department,
            }));
            toast.success(`Classified under: ${result.department}`);
        } else {
            toast.error("Unable to classify complaint");
        }
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
        if (file) {
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);
        } else {
        setImagePreview(null);
        }
    };

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setFiles(selectedFiles);
    };

    const uploadFilesToIPFS = async (files) => {
        setUploadingFiles(true);
        try {
        const uploadResults = await ipfsService.uploadFiles(files);
        return uploadResults.filter((result) => result.success);
        } catch (error) {
        console.error("Error uploading files to IPFS:", error);
        toast.error("Failed to upload files to IPFS");
        return [];
        } finally {
        setUploadingFiles(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
        // Connect to MetaMask wallet
        const walletResult = await blockchainService.connectWallet();
        if (!walletResult.success) {
            toast.error("Failed to connect wallet: " + walletResult.error);
            return;
        }

        let filesToUpload = [];
        if (files.length > 0 || image) {
            if (image) filesToUpload.push(image);
            filesToUpload.push(...files);

            toast.loading("Uploading files to IPFS...", { id: "ipfs-upload" });
            const uploadResults = await uploadFilesToIPFS(filesToUpload);

            if (uploadResults.length > 0) {
            toast.success("Files uploaded to IPFS successfully!", { id: "ipfs-upload" });
            } else {
            toast.error("Failed to upload files to IPFS", { id: "ipfs-upload" });
            return;
            }
        }

        // File complaint on blockchain
        const result = await blockchainService.fileComplaint(
            formData.description,
            formData.department,
            filesToUpload
        );

        if (result.success) {
            toast.success("Complaint filed successfully with IPFS & classification!");
            setSubmitted(true);
        } else {
            toast.error("Failed to file complaint: " + result.error);
        }
        } catch (error) {
        console.error("Error filing complaint:", error);
        toast.error("An error occurred while filing the complaint: " + error);
        }
    };

    if (submitted) {
        return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
            <Header />
            <div className="pt-20 flex items-center justify-center min-h-screen">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-md mx-4 text-center">
                <div className="text-green-400 text-6xl mb-4">✓</div>
                <h2 className="text-2xl font-bold text-white mb-4">Complaint Submitted Successfully!</h2>
                <p className="text-gray-300 mb-6">
                Your complaint has been recorded on the blockchain and assigned to the{" "}
                <span className="text-purple-300 font-semibold">{formData.department}</span>.
                </p>
                <button
                onClick={() => {
                    setSubmitted(false);
                    setFormData({ title: "", description: "", department: DEPARTMENTS.GENERAL });
                    setImage(null);
                    setImagePreview(null);
                    setFiles([]);
                }}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition"
                >
                File Another Complaint
                </button>
            </div>
            </div>
            <Footer />
        </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
        <Header />
        <div className="pt-20 flex items-center justify-center min-h-screen">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-2xl mx-4 w-full">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">File a Complaint</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div>
                <label className="block text-white font-medium mb-2">Title</label>
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter complaint title"
                />
                </div>

                {/* Description */}
                <div>
                <label className="block text-white font-medium mb-2">Description</label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Describe your complaint in detail"
                />
                </div>

                {/* Department display */}
                <div className="bg-white/10 border border-white/20 rounded-lg p-3 text-white text-sm mb-4">
                <p>
                    <span className="font-semibold text-purple-300">Detected Department:</span>{" "}
                    {formData.department || "Not classified yet"}
                </p>
                </div>

                {/* Attach Image */}
                <div>
                <label className="block text-white font-medium mb-2">Attach Image (Optional)</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                />
                {imagePreview && (
                    <img
                    src={imagePreview}
                    alt="Preview"
                    className="mt-4 max-w-full max-h-48 rounded-lg"
                    />
                )}
                </div>

                {/* Attach Files */}
                <div>
                <label className="block text-white font-medium mb-2">Attach Additional Files (Optional)</label>
                <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                />
                {files.length > 0 && (
                    <div className="mt-4">
                    <p className="text-white text-sm mb-2">Selected files:</p>
                    <ul className="text-gray-300 text-sm">
                        {files.map((file, index) => (
                        <li key={index} className="truncate">
                            {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                        </li>
                        ))}
                    </ul>
                    </div>
                )}
                </div>

                {/* Submit Button */}
                <button
                type="submit"
                disabled={loading || uploadingFiles}
                className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
                >
                {uploadingFiles ? "Uploading to IPFS..." : loading ? "Submitting..." : "Submit Complaint"}
                </button>
            </form>
            </div>
        </div>
        <Footer />
        </div>
    );
    }

    export default FileComplaint;
