"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { CircleLoader } from "@/components/loading-screen";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { currentUser, loading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !loading && !currentUser) {
      router.push("/sign-in");
    }
  }, [mounted, currentUser, loading, router]);

  if (!mounted || loading) {
    return <CircleLoader />;
  }

  return currentUser ? <>{children}</> : null;
}
