"use client";

import React from "react";
import { StepProgress } from "../StepProgress";
import { BackButton, OnboardingButton } from "../OnboardingButton";

interface Props {
    onBack: () => void;
    onFinish: () => void;
}

export function SuccessScreen({ onBack, onFinish }: Props) {
    return (
        <div style={{ display: "flex", flexDirection: "column" }}>
            <BackButton onClick={onBack} />
            <StepProgress total={6} current={6} />

            <h2 style={h2}>You're All Set!</h2>
            <p style={sub}>
                Your personalized stylist is ready. Start by exploring your daily outfit suggestions!
            </p>

            {/* Celebration cards */}
            <div style={styles.cardsRow}>
                {/* Outfit card */}
                <div style={styles.card}>
                    <div style={{ height: 140, background: "linear-gradient(135deg, #3a9e6a, #2d7a50)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ fontSize: 40 }}>👔</span>
                    </div>
                    <div style={{ padding: "10px 12px", background: "#2d7a50" }}>
                        <p style={{ fontWeight: 700, fontSize: 13, color: "#fff", margin: "0 0 2px" }}>The Modern Monocle</p>
                        <div style={styles.matchBadge}><span>✦</span> 98% Match</div>
                    </div>
                </div>

                {/* Celebration card */}
                <div style={{ ...styles.card, background: "var(--ob-primary)" }}>
                    <div style={{ height: 140, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ fontSize: 60 }}>🎉</span>
                    </div>
                    <div style={{ padding: "10px 12px" }}>
                        <p style={{ fontWeight: 700, fontSize: 13, color: "#fff", margin: "0 0 2px" }}>Yaaaaah!!!</p>
                        <div style={styles.matchBadge}><span>✦</span> 98% Match</div>
                    </div>
                </div>
            </div>

            {/* Stars decoration */}
            <div style={styles.stars} aria-hidden="true">
                {["★", "★", "★", "★", "★"].map((s, i) => (
                    <span key={i} style={{ color: "#f9c74f", fontSize: 18, opacity: 0.8 }}>{s}</span>
                ))}
            </div>

            <div style={styles.setup}>
                <span style={{ color: "#2d9e5e", fontWeight: 700 }}>✓</span>
                &nbsp; Setup Complete
            </div>

            <OnboardingButton onClick={onFinish}>Dashboard</OnboardingButton>
        </div>
    );
}

const h2: React.CSSProperties = { fontSize: 26, fontWeight: 700, color: "var(--ob-text)", margin: "0 0 6px" };
const sub: React.CSSProperties = { fontSize: 15, color: "var(--ob-text-muted)", margin: "0 0 20px", lineHeight: 1.6 };

const styles: Record<string, React.CSSProperties> = {
    cardsRow: { display: "flex", gap: 12 },
    card: { flex: 1, borderRadius: 16, overflow: "hidden", background: "#2d7a50", boxShadow: "0 4px 20px rgba(0,0,0,0.12)" },
    matchBadge: {
        background: "rgba(255,255,255,0.9)",
        color: "var(--ob-text)",
        fontSize: 11,
        fontWeight: 700,
        padding: "4px 10px",
        borderRadius: 20,
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        marginTop: 4,
    },
    stars: { display: "flex", justifyContent: "center", gap: 6, margin: "16px 0 8px" },
    setup: { textAlign: "center", fontWeight: 600, fontSize: 15, color: "var(--ob-text)", marginBottom: 16 },
};
