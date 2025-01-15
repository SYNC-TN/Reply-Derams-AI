//lib/auth-client.ts
"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface LoginRequiredProps {
  children: React.ReactNode;
}

export function LoginRequired({
  children,
}: LoginRequiredProps): React.ReactElement | null {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session) {
    return null;
  }

  return <>{children}</>;
}
