"use client";

import React from "react";
import { StepProgress } from "../StepProgress";
import { BackButton, OnboardingButton } from "../OnboardingButton";

interface Props {
    onBack: () => void;
    onNext: () => void;
}

const STYLES = ["Masculine", "Feminine", "Neutral"] as const;
const SIZES = ["XS", "S", "M", "L", "XL", "XXL"] as const;

export function AboutYouScreen({ onBack, onNext }: Props) {
    const [selectedStyle, setSelectedStyle] = React.useState<string>("Masculine");
    const [selectedSize, setSelectedSize] = React.useState<string>("XS");

    return (
        <div style={{ display: "flex", flexDirection: "column" }}>
            <BackButton onClick={onBack} />
            <StepProgress total={6} current={2} />

            <h2 style={h2}>About You</h2>
            <p style={sub}>We'll use this to personalize your style recommendations.</p>

            <label style={label}>YOUR NAME</label>
            <div style={inputWrap}>
                <span style={{ color: "#aaa", fontSize: 16 }}>👤</span>
                <input
                    type="text"
                    placeholder="E.g John Doe"
                    style={input}
                />
            </div>

            <label style={{ ...label, marginTop: 24 }}>SELECT YOUR PRIMARY STYLE</label>
            <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
                {STYLES.map(s => (
                    <button
                        key={s}
                        onClick={() => setSelectedStyle(s)}
                        style={{
                            flex: 1,
                            padding: "11px 0",
                            borderRadius: 60,
                            border: "1.5px solid",
                            borderColor: selectedStyle === s ? "var(--ob-primary)" : "var(--ob-border)",
                            background: selectedStyle === s ? "var(--ob-primary)" : "#fff",
                            color: selectedStyle === s ? "#fff" : "var(--ob-text)",
                            fontWeight: 600,
                            fontSize: 14,
                            cursor: "pointer",
                            transition: "all 200ms",
                        }}
                    >
                        {s}
                    </button>
                ))}
            </div>

            <label style={{ ...label, marginTop: 24 }}>STANDARD SIZE</label>
            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                {SIZES.map(s => (
                    <button
                        key={s}
                        onClick={() => setSelectedSize(s)}
                        style={{
                            width: 44,
                            height: 44,
                            borderRadius: "50%",
                            border: "1.5px solid",
                            borderColor: selectedSize === s ? "var(--ob-primary)" : "var(--ob-border)",
                            background: selectedSize === s ? "var(--ob-primary)" : "#fff",
                            color: selectedSize === s ? "#fff" : "var(--ob-text)",
                            fontWeight: 600,
                            fontSize: 13,
                            cursor: "pointer",
                            transition: "all 200ms",
                            flexShrink: 0,
                        }}
                    >
                        {s}
                    </button>
                ))}
            </div>

            <div style={{ marginTop: 32 }}>
                <OnboardingButton onClick={onNext}>Next</OnboardingButton>
            </div>
        </div>
    );
}

const h2: React.CSSProperties = { fontSize: 28, fontWeight: 700, color: "var(--ob-text)", margin: "0 0 6px" };
const sub: React.CSSProperties = { fontSize: 15, color: "var(--ob-text-muted)", margin: "0 0 24px" };
const label: React.CSSProperties = { fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", color: "var(--ob-text)", textTransform: "uppercase" };
const inputWrap: React.CSSProperties = { display: "flex", alignItems: "center", gap: 10, border: "1.5px solid var(--ob-border)", borderRadius: 12, padding: "12px 16px", marginTop: 10, background: "#fff" };
const input: React.CSSProperties = { flex: 1, border: "none", outline: "none", fontSize: 15, color: "var(--ob-text)", background: "transparent", fontFamily: "inherit" };
