"use client";

import React from "react";
import { StepProgress } from "../StepProgress";
import { BackButton } from "../OnboardingButton";

interface Props {
    onBack: () => void;
    onDone: () => void;
}

const STEPS = [
    "Analyzing style quiz....",
    "Curating closet basics....",
    "Fine-tuning AI stylist....",
];

export function LoadingProfileScreen({ onBack, onDone }: Props) {
    const [completedSteps, setCompletedSteps] = React.useState<number>(0);
    const [spin, setSpin] = React.useState(0);

    // Simulate progress
    React.useEffect(() => {
        const interval = setInterval(() => {
            setCompletedSteps(prev => {
                if (prev >= STEPS.length) {
                    clearInterval(interval);
                    setTimeout(onDone, 600);
                    return prev;
                }
                return prev + 1;
            });
        }, 900);
        const spinInterval = setInterval(() => setSpin(s => s + 3), 16);
        return () => { clearInterval(interval); clearInterval(spinInterval); };
    }, [onDone]);

    return (
        <div style={{ display: "flex", flexDirection: "column" }}>
            <BackButton onClick={onBack} />
            <StepProgress total={6} current={6} />

            {/* Spinner */}
            <div style={styles.spinnerWrap}>
                <div style={styles.orbit}>
                    <div
                        style={{
                            ...styles.sparkle,
                            transform: `rotate(${spin}deg)`,
                        }}
                    >
                        ✦
                    </div>
                </div>
            </div>

            <h3 style={styles.heading}>Generating your style profile</h3>

            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 16 }}>
                {STEPS.map((step, i) => (
                    <div key={step} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ color: i < completedSteps ? "#2d9e5e" : "#ccc", fontWeight: 700 }}>
                            {i < completedSteps ? "✓" : "○"}
                        </span>
                        <span style={{ fontSize: 15, color: i < completedSteps ? "var(--ob-text)" : "var(--ob-text-muted)" }}>
                            {step}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

const styles: Record<string, React.CSSProperties> = {
    spinnerWrap: { display: "flex", justifyContent: "center", marginTop: 40, marginBottom: 32 },
    orbit: {
        width: 140,
        height: 140,
        borderRadius: "50%",
        border: "2px dashed #ccc",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    sparkle: {
        fontSize: 56,
        color: "var(--ob-primary)",
        display: "inline-block",
        lineHeight: 1,
    },
    heading: { fontSize: 22, fontWeight: 700, color: "var(--ob-text)", margin: 0, textAlign: "center" },
};
