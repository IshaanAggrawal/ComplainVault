import { createSlice } from "@reduxjs/toolkit";
import { ROLES } from "@/services/roleManager";

const initialState = {
  user: null,
  role: ROLES.CITIZEN,
  isAuthenticated: false,
  permissions: [],
  isAdmin: false,
  isPolice: false,
  isCitizen: true,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      const { user, role, permissions } = action.payload;
      
      // Serialize user data to avoid non-serializable values
      const serializedUser = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        imageUrl: user.imageUrl,
        createdAt: user.createdAt ? new Date(user.createdAt).toISOString() : null,
        updatedAt: user.updatedAt ? new Date(user.updatedAt).toISOString() : null
      };
      
      state.user = serializedUser;
      state.role = role || ROLES.CITIZEN;
      state.permissions = permissions || [];
      state.isAuthenticated = true;
      state.isAdmin = role === ROLES.ADMIN;
      state.isPolice = role === ROLES.POLICE;
      state.isCitizen = role === ROLES.CITIZEN;
    },
    updateRole: (state, action) => {
      const { role, permissions } = action.payload;
      state.role = role;
      state.permissions = permissions || [];
      state.isAdmin = role === ROLES.ADMIN;
      state.isPolice = role === ROLES.POLICE;
      state.isCitizen = role === ROLES.CITIZEN;
    },
    clearUser: (state) => {
      state.user = null;
      state.role = ROLES.CITIZEN;
      state.permissions = [];
      state.isAuthenticated = false;
      state.isAdmin = false;
      state.isPolice = false;
      state.isCitizen = true;
    },
  },
});

export const { setUser, updateRole, clearUser } = userSlice.actions;
export default userSlice.reducer;
