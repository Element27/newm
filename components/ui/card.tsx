import React from "react";

export function Card({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return (
    <div
      className={[
        "bg-card border border-border rounded-xl shadow-lg overflow-hidden",
        "transition-all duration-300 hover:shadow-xl hover:-translate-y-1",
        "backdrop-blur-sm",
        className
      ].join(" ")}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return <div className={["px-6 pt-6", className].join(" ")}>{children}</div>;
}

export function CardTitle({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return <h3 className={["text-lg font-bold text-foreground", className].join(" ")}>{children}</h3>;
}

export function CardContent({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return <div className={["px-6 pb-6 pt-4", className].join(" ")}>{children}</div>;
}

