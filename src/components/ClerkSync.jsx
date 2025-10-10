    "use client";
    import { useEffect } from "react";
    import { useDispatch } from "react-redux";
    import { useUser } from "@clerk/nextjs";
    import { setUser, clearUser } from "@/shared/store/slices/userSlice";

    export default function ClerkSync({ children }) {
    const { user, isSignedIn } = useUser();
    const dispatch = useDispatch();

    useEffect(() => {
        if (isSignedIn) {
        dispatch(setUser({
            user: user.emailAddresses[0]?.emailAddress || user.id,
            role: user.publicMetadata?.role || "Citizen",
        }));
        } else {
        dispatch(clearUser());
        }
    }, [isSignedIn, user, dispatch]);

    return children;
    }
