import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "destructive";
  loading?: boolean;
};

export function Button({ variant = "secondary", loading = false, className = "", children, disabled, ...props }: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 h-10 px-4 rounded-lg font-medium text-sm transition-all duration-300 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none";

  const variants: Record<string, string> = {
    primary: "bg-gradient-to-r from-primary to-purple-600 text-white border-0 hover:shadow-glow hover:scale-105 hover:brightness-110",
    secondary: "bg-card text-foreground border border-border hover:border-primary hover:shadow-md hover:scale-105",
    ghost: "bg-transparent text-foreground border border-transparent hover:bg-card hover:border-border hover:shadow-sm",
    destructive: "bg-gradient-to-r from-destructive to-red-600 text-white border-0 hover:shadow-lg hover:scale-105 hover:brightness-110",
  };

  return (
    <button
      className={[base, variants[variant], className].join(" ")}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </button>
  );
}


