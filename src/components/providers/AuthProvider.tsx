"use client";

import { AuthProvider as FirebaseAuthProvider } from "@/context/AuthContext";
import type { ReactNode } from "react";

export default function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <FirebaseAuthProvider>
      {children}
    </FirebaseAuthProvider>
  );
}