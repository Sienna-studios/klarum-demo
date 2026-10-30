import type { Metadata } from "next";
import "./minimal.css";
import "./hiw.css";

export const metadata: Metadata = {
  title: "Klarum homepage rebuild (demo, light)",
  robots: { index: false, follow: false },
};

export default function V2Layout({ children }: { children: React.ReactNode }) {
  return children;
}
