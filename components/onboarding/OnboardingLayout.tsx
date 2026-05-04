"use client";

import React from "react";
import Image from "next/image";

interface OnboardingLayoutProps {
  children: React.ReactNode;
  stepKey?: string;
}

export function OnboardingLayout({ children, stepKey }: OnboardingLayoutProps) {
  return (
    <div className="min-h-screen bg-[color:var(--ob-bg)] lg:grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
      <div className="relative min-h-[34vh] overflow-hidden bg-[#f0ede8] lg:min-h-screen">
        <div className="absolute inset-0 bg-gradient-to-br from-black/5 to-transparent" />
        <div className="relative h-full w-full">
          <Image
            src="/images/img.png"
            alt="Fashion model"
            fill
            className="object-cover object-center"
            priority
          />
        </div>
      </div>

      <div className="flex items-center justify-center px-4 py-8 sm:px-6 lg:px-10">
        <div
          key={stepKey}
          className="ob-step-enter w-full max-w-2xl rounded-[2rem] border border-white/60 bg-white/85 p-6 shadow-xl backdrop-blur sm:p-8"
        >
          {children}
        </div>
      </div>
    </div>
  );
}
