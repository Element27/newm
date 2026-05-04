"use client";

import React from "react";
import { OnboardingButton } from "../OnboardingButton";

interface Props {
    onNext: () => void;
}

export function WelcomeScreen({ onNext }: Props) {
    return (
        <div style={styles.root}>
            {/* Multicolor headline */}
            <h1 style={styles.headline}>
                <span style={{ color: "var(--ob-text)" }}>Your Personal</span>
                <br />
                <span style={{ color: "var(--ob-accent-yellow)" }}>AI </span>
                <span style={{ color: "var(--ob-accent-orange)" }}>Stylist</span>
            </h1>

            <p style={styles.subtitle}>
                Unlock your wardrobe's full potential and discover outfits you never knew you had.
            </p>

            <div style={{ marginTop: 48 }}>
                <OnboardingButton onClick={onNext}>
                    Get Started &nbsp;→
                </OnboardingButton>
            </div>
        </div>
    );
}

const styles: Record<string, React.CSSProperties> = {
    root: {
        display: "flex",
        flexDirection: "column",
        gap: 16,
        paddingTop: 40,
    },
    headline: {
        fontSize: "clamp(36px, 4vw, 52px)",
        fontWeight: 900,
        lineHeight: 1.1,
        letterSpacing: "-0.02em",
        color: "var(--ob-text)",
        margin: 0,
        fontFamily: "var(--font-arkitech), 'Space Grotesk', sans-serif",
        textTransform: "uppercase",
    },
    subtitle: {
        fontSize: 17,
        color: "var(--ob-text-muted)",
        lineHeight: 1.6,
        maxWidth: 380,
        margin: 0,
    },
};
