import React from "react";

export function Badge({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={[
      "inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs bg-card",
      className,
    ].join(" ")}>{children}</span>
  );
}

