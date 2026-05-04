"use client";

import React from "react";
import { StepProgress } from "../StepProgress";
import { BackButton } from "../OnboardingButton";

interface Props {
    onBack: () => void;
    onNext: () => void;
}

export function SignUpScreen({ onBack, onNext }: Props) {
    return (
        <div style={styles.root}>
            <BackButton onClick={onBack} />
            <StepProgress total={6} current={1} />

            <h2 style={styles.heading}>Create Your Account</h2>
            <p style={styles.sub}>Sign up to sync your closet across all your devices.</p>

            <div style={{ marginTop: 28, display: "flex", flexDirection: "column", gap: 12 }}>
                <SocialBtn icon="G" label="Continue with Google" onClick={onNext} />
                <SocialBtn icon="🍎" label="Continue with Apple" onClick={onNext} />
                <SocialBtn icon="f" label="Continue with Facebook" onClick={onNext} isBlue />
            </div>

            <div style={styles.dividerRow}>
                <div style={styles.divider} />
                <span style={styles.orText}>or</span>
                <div style={styles.divider} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <SocialBtn icon="✉" label="Continue with Mail" onClick={onNext} />
            </div>

            <p style={styles.terms}>
                By continuing, you agree to our{" "}
                <a href="#" style={styles.link}>Terms of Service</a> and{" "}
                <a href="#" style={styles.link}>Privacy Policy.</a>
            </p>
        </div>
    );
}

function SocialBtn({ icon, label, onClick, isBlue }: { icon: string; label: string; onClick: () => void; isBlue?: boolean }) {
    return (
        <button
            onClick={onClick}
            style={{
                width: "100%",
                padding: "14px 20px",
                borderRadius: 60,
                border: "1.5px solid var(--ob-border)",
                background: "#fff",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 14,
                fontSize: 15,
                fontWeight: 500,
                color: "var(--ob-text)",
                transition: "border-color 200ms",
            }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = "#999")}
            onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--ob-border)")}
        >
            <span style={{ width: 28, height: 28, borderRadius: "50%", background: isBlue ? "#1877F2" : "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: isBlue ? "#fff" : "#333", fontWeight: 700, flexShrink: 0 }}>
                {icon}
            </span>
            {label}
        </button>
    );
}

const styles: Record<string, React.CSSProperties> = {
    root: { display: "flex", flexDirection: "column" },
    heading: { fontSize: 28, fontWeight: 700, color: "var(--ob-text)", margin: "0 0 6px" },
    sub: { fontSize: 15, color: "var(--ob-text-muted)", margin: 0 },
    dividerRow: { display: "flex", alignItems: "center", gap: 12, margin: "16px 0 4px" },
    divider: { flex: 1, height: 1, backgroundColor: "var(--ob-border)" },
    orText: { fontSize: 14, color: "var(--ob-text-muted)" },
    terms: { fontSize: 13, color: "var(--ob-text-muted)", textAlign: "center", marginTop: 20 },
    link: { color: "var(--ob-primary)", textDecoration: "underline" },
};
