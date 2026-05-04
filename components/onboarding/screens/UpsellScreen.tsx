"use client";

import React from "react";
import { StepProgress } from "../StepProgress";
import { BackButton, OnboardingButton } from "../OnboardingButton";

interface Props {
    onBack: () => void;
    onNext: () => void;
    onSkip: () => void;
}

const FEATURES = [
    "Automatic background removal",
    "Detailed AI metadata tagging",
    "Closet inventory report (PDF)",
];

export function UpsellScreen({ onBack, onNext, onSkip }: Props) {
    return (
        <div style={{ display: "flex", flexDirection: "column" }}>
            <BackButton onClick={onBack} />
            <StepProgress total={6} current={5} />

            <h2 style={h2}>Tired of uploading one by one?</h2>
            <p style={sub}>
                Get your entire closet digitized by our professionals. Send us high-res photos or request a local stylist visit.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 28 }}>
                {FEATURES.map(f => (
                    <div key={f} style={styles.featureRow}>
                        <span style={styles.checkmark}>✓</span>
                        <span style={{ fontSize: 15, color: "var(--ob-text)" }}>{f}</span>
                    </div>
                ))}
            </div>

            <OnboardingButton onClick={onNext}>Tell me more</OnboardingButton>

            <button onClick={onSkip} style={styles.skip}>
                No thanks, I'll do it manually &nbsp;→
            </button>
        </div>
    );
}

const h2: React.CSSProperties = { fontSize: 26, fontWeight: 700, color: "var(--ob-text)", margin: "0 0 6px" };
const sub: React.CSSProperties = { fontSize: 15, color: "var(--ob-text-muted)", margin: "0 0 24px", lineHeight: 1.6 };

const styles: Record<string, React.CSSProperties> = {
    featureRow: {
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "14px 18px",
        borderRadius: 12,
        background: "#f5f5f5",
    },
    checkmark: {
        color: "#2d9e5e",
        fontWeight: 700,
        fontSize: 16,
        flexShrink: 0,
    },
    skip: {
        background: "none",
        border: "none",
        cursor: "pointer",
        fontSize: 14,
        fontWeight: 600,
        color: "var(--ob-text)",
        textAlign: "center",
        marginTop: 14,
        padding: "8px 0",
    },
};
