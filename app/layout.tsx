import type { Metadata, Viewport } from "next";
import { inter, mono } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Klarum demo",
  description: "Reference rebuild of the klarum.com homepage. Not Klarum's production site.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0d0d10" },
    { media: "(prefers-color-scheme: light)", color: "#f6f6f3" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
