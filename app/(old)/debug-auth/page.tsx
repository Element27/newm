"use client";

export default function DebugAuthPage() {
  return (
    <div className="mx-auto max-w-xl p-8">
      <h1 className="text-2xl font-semibold">Debug Auth Info</h1>
      <p className="mt-2 text-sm text-[color:var(--muted)]">
        Authentication now uses Supabase browser sessions on the client and
        bearer-token verification on the API.
      </p>
    </div>
  );
}
