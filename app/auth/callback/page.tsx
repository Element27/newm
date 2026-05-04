"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabase";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const supabase = getSupabaseBrowser();
    if (!supabase) {
      router.replace("/onboarding?auth_error=misconfigured");
      return;
    }

    let routed = false;
    const routeToOnboarding = (ok: boolean) => {
      if (routed) return;
      routed = true;
      router.replace(ok ? "/onboarding?verified=1" : "/onboarding?auth_error=invalid_or_expired_link");
    };

    void supabase.auth.getSession().then(({ data, error }) => {
      if (error) {
        routeToOnboarding(false);
        return;
      }
      if (data.session?.user) {
        routeToOnboarding(true);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        routeToOnboarding(true);
      }
    });

    const timeoutId = window.setTimeout(() => {
      routeToOnboarding(false);
    }, 10000);

    return () => {
      subscription.unsubscribe();
      window.clearTimeout(timeoutId);
    };
  }, [router]);

  return (
    <main className="grid min-h-screen place-items-center px-6">
      <div className="max-w-md text-center">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-border border-t-primary" />
        <h1 className="mt-6 text-2xl font-semibold text-black">Verifying login</h1>
        <p className="mt-2 text-sm text-black">
          Restoring your session and routing you back to onboarding.
        </p>
      </div>
    </main>
  );
}
