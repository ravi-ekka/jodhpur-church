
"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

import { useAuth } from "@/context/AuthContext";

export default function RequireAuth({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();

  const router = useRouter();
  const params = useParams();

  const locale = params.locale as string;

  useEffect(() => {
    if (loading) {
      return;
    }

    // User is not logged in
    if (!user) {
      router.replace(`/${locale}/login`);
      return;
    }

    // User is logged in but email is not verified
    if (!user.emailVerified) {
      router.replace(`/${locale}/verify-email`);
      return;
    }
  }, [loading, user, locale, router]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <p className="text-muted-foreground">
          Loading...
        </p>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  if (!user.emailVerified) {
    return null;
  }

  return <>{children}</>;
}

