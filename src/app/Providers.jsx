"use client";

import { store } from "@/shared/store/store";
import { ClerkProvider } from "@clerk/nextjs";
import { Provider } from "react-redux";
import ClerkRoleSync from "@/components/auth/ClerkRoleSync";
import RoleMiddleware from "@/components/auth/RoleMiddleware";

export default function ClientProviders({ children }) {
  return (
    <ClerkProvider>
      <Provider store={store}>
        <ClerkRoleSync />
        <RoleMiddleware>
          {children}
        </RoleMiddleware>
      </Provider>
    </ClerkProvider>
  );
}
