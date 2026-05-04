"use client";

import React from "react";
import { StepProgress } from "../StepProgress";
import { BackButton } from "../OnboardingButton";

interface Props {
    onBack: () => void;
    onSkip: () => void;
}

export function FirstUploadScreen({ onBack, onSkip }: Props) {
    return (
        <div style={{ display: "flex", flexDirection: "column" }}>
            <BackButton onClick={onBack} />
            <StepProgress total={6} current={4} />

            <h2 style={h2}>First Upload</h2>
            <p style={sub}>
                Let's add your first piece to see the AI in action. Choose a clear photo of any top or jacket.
            </p>

            {/* Drop zone */}
            <label style={styles.dropZone} htmlFor="ob-file-input">
                <div style={styles.cameraIcon}>📷</div>
                <p style={{ fontWeight: 600, color: "var(--ob-text)", fontSize: 16, margin: "0 0 4px" }}>
                    Tap to Upload
                </p>
                <p style={{ fontSize: 13, color: "var(--ob-text-muted)", margin: 0 }}>JPEG, PNG up to 10MB</p>
                <input id="ob-file-input" type="file" accept="image/*" style={{ display: "none" }} />
            </label>

            <button onClick={onSkip} style={styles.skip}>
                Skip for Now &nbsp;→
            </button>
        </div>
    );
}

const h2: React.CSSProperties = { fontSize: 28, fontWeight: 700, color: "var(--ob-text)", margin: "0 0 6px" };
const sub: React.CSSProperties = { fontSize: 15, color: "var(--ob-text-muted)", margin: "0 0 24px" };

const styles: Record<string, React.CSSProperties> = {
    dropZone: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        padding: "40px 20px",
        border: "2px dashed var(--ob-border)",
        borderRadius: 16,
        cursor: "pointer",
        background: "#fafafa",
        transition: "border-color 200ms",
        marginBottom: 16,
    },
    cameraIcon: {
        width: 64,
        height: 64,
        borderRadius: "50%",
        background: "#e8e8e8",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 28,
        color: "#888",
    },
    skip: {
        background: "none",
        border: "none",
        cursor: "pointer",
        fontSize: 14,
        fontWeight: 600,
        color: "var(--ob-text)",
        textAlign: "center",
        marginTop: 8,
        padding: "8px 0",
    },
};
