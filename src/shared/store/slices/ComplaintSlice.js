import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { blockchainService } from "@/services/blockchain";

// Async thunks for blockchain operations
export const loadComplaintsFromBlockchain = createAsyncThunk(
    'complaints/loadFromBlockchain',
    async (_, { rejectWithValue }) => {
        try {
            const result = await blockchainService.getAllComplaints();
            if (result.success) {
                return result.complaints;
            } else {
                return rejectWithValue(result.error);
            }
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fileComplaintToBlockchain = createAsyncThunk(
    'complaints/fileToBlockchain',
    async ({ description, department, ipfsHash, files }, { rejectWithValue }) => {
        try {
            const result = await blockchainService.fileComplaintWithIPFS(description, department, ipfsHash);
            if (result.success) {
                return {
                    ...result,
                    description,
                    department,
                    ipfsHash,
                    files
                };
            } else {
                return rejectWithValue(result.error);
            }
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const resolveComplaintOnBlockchain = createAsyncThunk(
    'complaints/resolveOnBlockchain',
    async (complaintId, { rejectWithValue }) => {
        try {
            const result = await blockchainService.resolveComplaint(complaintId);
            if (result.success) {
                return { complaintId, txHash: result.txHash };
            } else {
                return rejectWithValue(result.error);
            }
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const complaintSlice = createSlice({
    name: "complaints",
    initialState: {
        list: [],
        loading: false,
        error: null,
        lastUpdated: null,
        blockchainConnected: false,
        userAddress: null,
        isAdmin: false,
        networkInfo: null
    },
    reducers: {
        addComplaint: (state, action) => {
            const existingIndex = state.list.findIndex(c => c.id === action.payload.id);
            if (existingIndex === -1) {
                state.list.push(action.payload);
            } else {
                state.list[existingIndex] = action.payload;
            }
        },
        updateComplaint: (state, action) => {
            const index = state.list.findIndex(c => c.id === action.payload.id);
            if (index !== -1) {
                state.list[index] = { ...state.list[index], ...action.payload };
            }
        },
        resolveComplaint: (state, action) => {
            const index = state.list.findIndex(c => c.id === action.payload);
            if (index !== -1) {
                state.list[index].resolved = true;
                state.list[index].status = "Resolved";
            }
        },
        setBlockchainConnection: (state, action) => {
            state.blockchainConnected = action.payload.connected;
            state.userAddress = action.payload.address;
            state.isAdmin = action.payload.isAdmin;
            state.networkInfo = action.payload.networkInfo;
        },
        clearError: (state) => {
            state.error = null;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        clearComplaints: (state) => {
            state.list = [];
            state.lastUpdated = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Load complaints from blockchain
            .addCase(loadComplaintsFromBlockchain.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loadComplaintsFromBlockchain.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
                state.lastUpdated = new Date().toISOString();
            })
            .addCase(loadComplaintsFromBlockchain.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // File complaint to blockchain
            .addCase(fileComplaintToBlockchain.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fileComplaintToBlockchain.fulfilled, (state, action) => {
                state.loading = false;
                const newComplaint = {
                    id: Date.now().toString(),
                    description: action.payload.description,
                    department: action.payload.department,
                    ipfsHash: action.payload.ipfsHash,
                    files: action.payload.files,
                    txHash: action.payload.txHash,
                    timestamp: new Date().toISOString(),
                    resolved: false,
                    status: "Pending"
                };
                state.list.push(newComplaint);
            })
            .addCase(fileComplaintToBlockchain.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Resolve complaint on blockchain
            .addCase(resolveComplaintOnBlockchain.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(resolveComplaintOnBlockchain.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.list.findIndex(c => c.id === action.payload.complaintId);
                if (index !== -1) {
                    state.list[index].resolved = true;
                    state.list[index].status = "Resolved";
                    state.list[index].resolveTxHash = action.payload.txHash;
                }
            })
            .addCase(resolveComplaintOnBlockchain.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { 
    addComplaint, 
    updateComplaint, 
    resolveComplaint, 
    setBlockchainConnection, 
    clearError, 
    setLoading, 
    clearComplaints 
} = complaintSlice.actions;

export default complaintSlice.reducer;
