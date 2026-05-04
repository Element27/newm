"use client";

import React from "react";
import { StepProgress } from "../StepProgress";
import { BackButton, OnboardingButton } from "../OnboardingButton";

interface Props {
    onBack: () => void;
    onNext: () => void;
}

const STYLES_QUIZ = [
    { key: "minimalist", label: "Minimalist", bg: "#f5f5f5", blob: "#ddd" },
    { key: "streetwear", label: "Streetwear", bg: "#3a3a3a", blob: "#555", dark: true },
    { key: "athleisure", label: "Athleisure", bg: "#fffde7", blob: "#c8b400" },
    { key: "bohemian", label: "Bohemian", bg: "#e3eeff", blob: "#8ab4f8" },
    { key: "vintage", label: "Vintage", bg: "#4a3f8a", blob: "#6b5fbe", dark: true },
    { key: "preppy", label: "Preppy", bg: "#fff0f3", blob: "#f4a9c0" },
    { key: "classic", label: "Classic", bg: "#3a3a3a", blob: "#555", dark: true },
    { key: "grunge", label: "Grunge", bg: "#f0f0f0", blob: "#8ab4f8" },
    { key: "streetwear2", label: "Streetwear", bg: "#f5f5f5", blob: "#ddd" },
] as const;

export function StyleQuizScreen({ onBack, onNext }: Props) {
    const [selected, setSelected] = React.useState<Set<string>>(new Set(["minimalist"]));

    const toggle = (key: string) => {
        setSelected(prev => {
            const n = new Set(prev);
            if (n.has(key)) n.delete(key); else n.add(key);
            return n;
        });
    };

    return (
        <div style={{ display: "flex", flexDirection: "column" }}>
            <BackButton onClick={onBack} />
            <StepProgress total={6} current={3} />

            <h2 style={h2}>Style Quiz</h2>
            <p style={sub}>Choose at least 2 styles that resonate with your personal taste.</p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginTop: 16 }}>
                {STYLES_QUIZ.map(style => {
                    const isSelected = selected.has(style.key);
                    return (
                        <button
                            key={style.key}
                            onClick={() => toggle(style.key)}
                            style={{
                                position: "relative",
                                padding: "14px 14px 40px",
                                borderRadius: 16,
                                border: isSelected ? "2px solid var(--ob-text)" : "2px solid transparent",
                                background: style.bg,
                                cursor: "pointer",
                                textAlign: "left",
                                transition: "border-color 200ms",
                                overflow: "hidden",
                                minHeight: 110,
                            }}
                        >
                            <span style={{ fontSize: 14, fontWeight: 600, color: (style as any).dark ? "#fff" : "var(--ob-text)" }}>
                                {style.label}
                            </span>
                            {/* blob decoration */}
                            <span style={{ position: "absolute", bottom: -6, right: -6, width: 48, height: 48, background: style.blob, borderRadius: "60% 40% 70% 30% / 60% 30% 70% 40%", opacity: 0.9 }} />
                            {isSelected && (
                                <span style={{
                                    position: "absolute", bottom: 8, right: 8, width: 22, height: 22,
                                    borderRadius: "50%", background: "var(--ob-text)", color: "#fff",
                                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12,
                                }}>
                                    ✓
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            <div style={{ marginTop: 20 }}>
                <OnboardingButton onClick={onNext} style={{ opacity: selected.size < 2 ? 0.5 : 1 }}>
                    Next
                </OnboardingButton>
            </div>
        </div>
    );
}

const h2: React.CSSProperties = { fontSize: 28, fontWeight: 700, color: "var(--ob-text)", margin: "0 0 6px" };
const sub: React.CSSProperties = { fontSize: 15, color: "var(--ob-text-muted)", margin: "0 0 8px" };
