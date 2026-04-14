"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/firebase";

export default function AdminProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const [checking, setChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setIsAuthenticated(false);
        setChecking(false);
        sessionStorage.removeItem("admin_token");
        router.replace("/admin/login");
      } else {
        // Check for token and expiry
        const tokenData = sessionStorage.getItem("admin_token");
        const now = Date.now();
        if (tokenData) {
          const { timestamp } = JSON.parse(tokenData);
          // 5 minutes = 300000 ms
          if (now - timestamp > 300000) {
            // Token expired
            signOut(auth);
            sessionStorage.removeItem("admin_token");
            setIsAuthenticated(false);
            setChecking(false);
            router.replace("/admin/login");
            return;
          }
        } else {
          // Set token on first login
          sessionStorage.setItem(
            "admin_token",
            JSON.stringify({ timestamp: now }),
          );
        }
        setIsAuthenticated(true);
        setChecking(false);
      }
    });

    // Set up interval to check token expiry every 10 seconds
    const interval = setInterval(() => {
      const tokenData = sessionStorage.getItem("admin_token");
      const now = Date.now();
      if (tokenData) {
        const { timestamp } = JSON.parse(tokenData);
        if (now - timestamp > 300000) {
          signOut(auth);
          sessionStorage.removeItem("admin_token");
          setIsAuthenticated(false);
          setChecking(false);
          router.replace("/admin/login");
        }
      }
    }, 10000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, [router]);

  if (checking) return null;
  if (!isAuthenticated) return null;
  return <>{children}</>;
}
