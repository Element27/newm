"use client";

export default function OldAppLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto min-h-screen animate-fadeIn">
      {children}
    </main>
  );
}
