"use client";

export default function TestAuthPage() {
  return (
    <div className="mx-auto max-w-xl p-8">
      <h1 className="text-2xl font-semibold">Auth Test Info</h1>
      <p className="mt-2 text-sm text-[color:var(--muted)]">
        Magic-link auth now completes through Supabase on the client, then API
        requests are authorized with the current bearer token.
      </p>
    </div>
  );
}
