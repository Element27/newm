"use client";

import React from "react";
import { AuthUser, useAuthStore } from "../../lib/authStore";
import { getSupabaseBrowser } from "../../lib/supabase";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const setAuth = useAuthStore((s) => s.setAuth);
  const setLoading = useAuthStore((s) => s.setLoading);

  React.useEffect(() => {
    let active = true;

    async function hydrateSession() {
      const supabase = getSupabaseBrowser();
      if (!supabase) {
        if (active) {
          setAuth(null, null);
          setLoading(false);
        }
        return;
      }

      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!active) return;
        const user = session?.user
          ? ({ id: session.user.id, email: session.user.email || null } as AuthUser)
          : null;
        setAuth(user, null);
      } catch {
        if (!active) return;
        setAuth(null, null);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void hydrateSession();

    const supabase = getSupabaseBrowser();
    const subscription = supabase?.auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      const user = session?.user
        ? ({ id: session.user.id, email: session.user.email || null } as AuthUser)
        : null;
      setAuth(user, null);
      setLoading(false);
    }).data.subscription;

    const onFocus = () => {
      void hydrateSession();
    };
    window.addEventListener("focus", onFocus);

    return () => {
      active = false;
      window.removeEventListener("focus", onFocus);
      subscription?.unsubscribe();
    };
  }, [setAuth, setLoading]);

  return <>{children}</>;
}

