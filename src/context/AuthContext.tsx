"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";

import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    sendEmailVerification,
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
    updateProfile,
    type User,
} from "firebase/auth";

import { auth } from "@/lib/firebase/firebase";

type AuthContextType = {
    user: User | null;
    loading: boolean;

    signup: (
        name: string,
        email: string,
        password: string,
        locale: string
    ) => Promise<User>;

    login: (
        email: string,
        password: string
    ) => Promise<User>;

    loginWithGoogle: () => Promise<User>;

    logout: () => Promise<void>;

    sendVerificationEmail: (
        locale: string
    ) => Promise<void>;

    refreshUser: () => Promise<User>;
};

const AuthContext =
    createContext<AuthContextType | undefined>(
        undefined
    );

export function AuthProvider({
    children,
}: {
    children: ReactNode;
}) {
    const [user, setUser] =
        useState<User | null>(null);

    const [loading, setLoading] =
        useState(true);

    // ============================================================
    // AUTH STATE
    // ============================================================

    useEffect(() => {
        const unsubscribe =
            onAuthStateChanged(
                auth,
                (currentUser) => {
                    setUser(currentUser);
                    setLoading(false);
                }
            );

        return unsubscribe;
    }, []);

    // ============================================================
    // CREATE / ENSURE FIRESTORE PROFILE
    // ============================================================

    const ensureUserProfile = async (
        firebaseUser: User
    ) => {
        const idToken =
            await firebaseUser.getIdToken();

        const response = await fetch(
            "/api/auth/profile",
            {
                method: "POST",

                headers: {
                    Authorization:
                        `Bearer ${idToken}`,
                },
            }
        );

        const data =
            await response
                .json()
                .catch(() => null);

        if (!response.ok) {
            throw new Error(
                data?.error ||
                    "Unable to create user profile."
            );
        }

        return data;
    };

    // ============================================================
    // SIGNUP
    // ============================================================

    const signup = async (
        name: string,
        email: string,
        password: string,
        locale: string
    ) => {
        // 1. Create Firebase Authentication account
        const credential =
            await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );

        // 2. Update Firebase Authentication profile
        await updateProfile(
            credential.user,
            {
                displayName: name,
            }
        );

        // 3. Create Firestore users/{uid}
        await ensureUserProfile(
            credential.user
        );

        // 4. Send verification email
        const actionCodeSettings = {
            url: `${window.location.origin}/${locale}/verify-email`,
            handleCodeInApp: true,
        };

        await sendEmailVerification(
            credential.user,
            actionCodeSettings
        );

        return credential.user;
    };

    // ============================================================
    // LOGIN
    // ============================================================

    const login = async (
        email: string,
        password: string
    ) => {
        // 1. Login with Firebase Authentication
        const credential =
            await signInWithEmailAndPassword(
                auth,
                email,
                password
            );

        // 2. Make sure Firestore profile exists
        await ensureUserProfile(
            credential.user
        );

        return credential.user;
    };

    // ============================================================
    // GOOGLE LOGIN
    // ============================================================

    const loginWithGoogle = async () => {
        const provider =
            new GoogleAuthProvider();

        // 1. Login with Google/Firebase
        const credential =
            await signInWithPopup(
                auth,
                provider
            );

        // 2. Create Firestore profile if needed
        await ensureUserProfile(
            credential.user
        );

        return credential.user;
    };

    // ============================================================
    // LOGOUT
    // ============================================================

    const logout = async () => {
        await signOut(auth);
    };

    // ============================================================
    // SEND VERIFICATION EMAIL
    // ============================================================

    const sendVerification = async (
        locale: string
    ) => {
        if (!auth.currentUser) {
            throw new Error(
                "No user is currently signed in."
            );
        }

        const actionCodeSettings = {
            url: `${window.location.origin}/${locale}/verify-email`,
            handleCodeInApp: true,
        };

        await sendEmailVerification(
            auth.currentUser,
            actionCodeSettings
        );
    };

    // ============================================================
    // REFRESH USER
    // ============================================================

    const refreshUser = async () => {
        if (!auth.currentUser) {
            throw new Error(
                "No user is currently signed in."
            );
        }

        await auth.currentUser.reload();

        const currentUser =
            auth.currentUser;

        setUser(currentUser);

        return currentUser;
    };

    // ============================================================
    // PROVIDER
    // ============================================================

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                signup,
                login,
                loginWithGoogle,
                logout,
                sendVerificationEmail:
                    sendVerification,
                refreshUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

// ============================================================
// HOOK
// ============================================================

export function useAuth() {
    const context =
        useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth must be used inside AuthProvider"
        );
    }

    return context;
}