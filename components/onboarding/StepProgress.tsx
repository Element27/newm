"use client";

import React from "react";

interface StepProgressProps {
    total: number;
    current: number; // 1-indexed
}

export function StepProgress({ total, current }: StepProgressProps) {
    return (
        <div style={styles.root} aria-label={`Step ${current} of ${total}`}>
            {Array.from({ length: total }).map((_, i) => {
                const filled = i < current;
                return (
                    <span
                        key={i}
                        style={{
                            ...styles.bar,
                            backgroundColor: filled ? "var(--ob-primary)" : "#d0d0d0",
                        }}
                    />
                );
            })}
        </div>
    );
}

const styles: Record<string, React.CSSProperties> = {
    root: {
        display: "flex",
        gap: 6,
        marginBottom: 28,
    },
    bar: {
        flex: 1,
        height: 4,
        borderRadius: 4,
        transition: "background-color 350ms ease",
    },
};
