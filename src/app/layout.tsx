import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Using Google Fonts as requested
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Aura Study - AI Learning Companion",
    description: "Explain topics, summarize notes, and generate quizzes with AI.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <div className="main-background">
                    {/* Background blobs for aesthetics */}
                    <div style={{
                        position: 'fixed',
                        top: '-20%',
                        left: '-10%',
                        width: '50%',
                        height: '50%',
                        background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, rgba(15, 23, 42, 0) 70%)',
                        zIndex: -1,
                        pointerEvents: 'none'
                    }} />
                    <div style={{
                        position: 'fixed',
                        bottom: '-20%',
                        right: '-10%',
                        width: '50%',
                        height: '50%',
                        background: 'radial-gradient(circle, rgba(236, 72, 153, 0.15) 0%, rgba(15, 23, 42, 0) 70%)',
                        zIndex: -1,
                        pointerEvents: 'none'
                    }} />
                    {children}
                </div>
            </body>
        </html>
    );
}
