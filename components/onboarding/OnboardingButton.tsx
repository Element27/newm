"use client";

import React from "react";

interface OnboardingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "ghost";
    children: React.ReactNode;
}

export function OnboardingButton({ variant = "primary", children, style, ...rest }: OnboardingButtonProps) {
    const base: React.CSSProperties = {
        width: "100%",
        padding: "16px 24px",
        borderRadius: "var(--ob-radius-pill)",
        fontSize: 16,
        fontWeight: 600,
        cursor: "pointer",
        border: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        transition: "background-color 200ms ease, transform 120ms ease",
        letterSpacing: "0.01em",
    };

    const primaryStyle: React.CSSProperties = {
        backgroundColor: "var(--ob-primary)",
        color: "#fff",
    };
    const ghostStyle: React.CSSProperties = {
        backgroundColor: "transparent",
        color: "var(--ob-text)",
        fontWeight: 500,
    };

    return (
        <button
            style={{ ...base, ...(variant === "primary" ? primaryStyle : ghostStyle), ...style }}
            onMouseEnter={(e) => {
                if (variant === "primary") {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--ob-primary-hover)";
                }
            }}
            onMouseLeave={(e) => {
                if (variant === "primary") {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--ob-primary)";
                }
            }}
            {...rest}
        >
            {children}
        </button>
    );
}

export function BackButton({ onClick }: { onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            style={{
                width: 38,
                height: 38,
                borderRadius: "50%",
                border: "1.5px solid #ccc",
                background: "#fff",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 20,
                fontSize: 16,
                color: "#333",
                transition: "border-color 200ms",
            }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--ob-primary)")}
            onMouseLeave={e => (e.currentTarget.style.borderColor = "#ccc")}
            aria-label="Go back"
        >
            ←
        </button>
    );
}
