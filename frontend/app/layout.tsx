import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "FROMBUDDY - AI Gov Assistant",
  description: "Private, Secure, Guidance-only assistant for Indian Government Services. No PII collection.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${outfit.variable}`} suppressHydrationWarning>
        <div className="disclaimer-banner">
          ⚠️ OFFICIAL DISCLAIMER: This is NOT a government website. Guidance Only. No PII Stored.
        </div>
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
