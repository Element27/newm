import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import AuthProvider from "./providers/AuthProvider";

const arkitech = localFont({
    src: [
        { path: "./fonts/arkitech/Arkitech-Light.otf", weight: "300", style: "normal" },
        { path: "./fonts/arkitech/Arkitech-Light.otf", weight: "400", style: "normal" },
        { path: "./fonts/arkitech/Arkitech-Medium.otf", weight: "500", style: "normal" },
        { path: "./fonts/arkitech/Arkitech-Medium.otf", weight: "700", style: "normal" },
        { path: "./fonts/arkitech/Arkitech-Medium.otf", weight: "900", style: "normal" },
    ],
    variable: "--font-arkitech",
    display: "swap",
});

export const metadata: Metadata = {
    title: "Mura — Wardrobe Assistant",
    description: "Digitize, organize, and style your wardrobe",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={arkitech.variable} suppressHydrationWarning>
                <AuthProvider>{children}</AuthProvider>
            </body>
        </html>
    );
}
