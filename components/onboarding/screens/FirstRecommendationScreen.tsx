"use client";

import React from "react";
import { StepProgress } from "../StepProgress";
import { BackButton, OnboardingButton } from "../OnboardingButton";

interface Props {
    onBack: () => void;
    onNext: () => void;
}

export function FirstRecommendationScreen({ onBack, onNext }: Props) {
    return (
        <div style={{ display: "flex", flexDirection: "column" }}>
            <BackButton onClick={onBack} />
            <StepProgress total={6} current={6} />

            <h2 style={h2}>Your First Recommendation</h2>
            <p style={sub}>
                Based on your choice: <strong>Minimalist &amp; Streetwear</strong>
            </p>

            {/* Outfit card */}
            <div style={styles.card}>
                <div style={styles.cardImageWrap}>
                    <div style={styles.cardImagePlaceholder}>
                        <span style={{ fontSize: 48 }}>👔</span>
                    </div>
                </div>
                <div style={styles.cardFooter}>
                    <div>
                        <p style={{ fontWeight: 700, fontSize: 18, color: "#fff", margin: "0 0 4px" }}>The Modern Monocle</p>
                        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", margin: 0 }}>
                            Perfect for: <strong style={{ color: "#fff" }}>Coffee runs, Weekend brunches</strong>
                        </p>
                    </div>
                    <div style={styles.matchBadge}>
                        <span style={{ fontSize: 12 }}>✦</span> 98% Match
                    </div>
                </div>
            </div>

            <div style={{ marginTop: 16 }}>
                <OnboardingButton onClick={onNext}>Looks great</OnboardingButton>
            </div>
        </div>
    );
}

const h2: React.CSSProperties = { fontSize: 26, fontWeight: 700, color: "var(--ob-text)", margin: "0 0 6px" };
const sub: React.CSSProperties = { fontSize: 15, color: "var(--ob-text-muted)", margin: "0 0 20px" };

const styles: Record<string, React.CSSProperties> = {
    card: {
        borderRadius: 20,
        overflow: "hidden",
        background: "#2d7a50",
        boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
    },
    cardImageWrap: { height: 260, overflow: "hidden", position: "relative" },
    cardImagePlaceholder: {
        width: "100%",
        height: "100%",
        background: "linear-gradient(135deg, #3a9e6a 0%, #2d7a50 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    cardFooter: {
        padding: "16px 20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
    },
    matchBadge: {
        background: "rgba(255,255,255,0.9)",
        color: "var(--ob-text)",
        fontSize: 12,
        fontWeight: 700,
        padding: "6px 12px",
        borderRadius: 20,
        display: "flex",
        alignItems: "center",
        gap: 4,
        flexShrink: 0,
    },
};
