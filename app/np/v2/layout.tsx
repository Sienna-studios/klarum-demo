import type { Metadata } from "next";
import "../../v2/minimal.css";

export const metadata: Metadata = {
  title: "Klarum homepage rebuild (demo, light)",
  robots: { index: false, follow: false },
};

export default function NoPhotosV2Layout({ children }: { children: React.ReactNode }) {
  return children;
}
