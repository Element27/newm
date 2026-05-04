"use client";

import React from "react";
import { StepProgress } from "../StepProgress";
import { BackButton, OnboardingButton } from "../OnboardingButton";

interface Tip {
    icon: string;
    title: string;
    subtitle: string;
    buttonLabel: string;
}

const TIPS: Tip[] = [
    {
        icon: "📷",
        title: "Snap a Photo",
        subtitle: "Take a clear photo of your garment against a neutral background.",
        buttonLabel: "Next Tip",
    },
    {
        icon: "🏷️",
        title: "AI Tagging",
        subtitle: "Our AI automatically detects category, color, and fabric.",
        buttonLabel: "Next Tip",
    },
    {
        icon: "❤️",
        title: "Curate Outfits",
        subtitle: "Get personalized outfit suggestions based on what you own.",
        buttonLabel: "Start Uploading",
    },
];

interface Props {
    onBack: () => void;
    onNext: () => void;
    step: 4 | 5 | 6; // which tips step we're on
}

export function TipScreen({ onBack, onNext, step }: Props) {
    const tipIndex = step - 4; // 0, 1, or 2
    const tip = TIPS[tipIndex];
    const dotTotal = TIPS.length;
    const dotCurrent = tipIndex;

    return (
        <div style={{ display: "flex", flexDirection: "column" }}>
            <BackButton onClick={onBack} />
            <StepProgress total={6} current={step} />

            <h2 style={h2}>{tip.title}</h2>
            <p style={sub}>{tip.subtitle}</p>

            {/* Icon box */}
            <div style={styles.iconBox}>
                <div style={styles.iconBtn}>
                    <span style={{ fontSize: 36 }}>{tip.icon}</span>
                </div>
            </div>

            {/* Dot indicator */}
            <div style={styles.dots}>
                {Array.from({ length: dotTotal }).map((_, i) => (
                    <span
                        key={i}
                        style={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            backgroundColor: i === dotCurrent ? "var(--ob-primary)" : "#d0d0d0",
                            transition: "background-color 300ms",
                        }}
                    />
                ))}
            </div>

            <OnboardingButton onClick={onNext}>{tip.buttonLabel}</OnboardingButton>
        </div>
    );
}

const h2: React.CSSProperties = { fontSize: 28, fontWeight: 700, color: "var(--ob-text)", margin: "0 0 6px" };
const sub: React.CSSProperties = { fontSize: 15, color: "var(--ob-text-muted)", margin: "0 0 24px" };

const styles: Record<string, React.CSSProperties> = {
    iconBox: { display: "flex", justifyContent: "center", alignItems: "center", padding: "48px 0" },
    iconBtn: {
        width: 100, height: 100, borderRadius: 24,
        background: "var(--ob-primary)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 40,
        boxShadow: "0 8px 32px rgba(26,60,52,0.25)",
    },
    dots: { display: "flex", justifyContent: "center", gap: 8, marginBottom: 24 },
};
