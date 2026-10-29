import localFont from "next/font/local";

// Self-hosted, latin subset only: one variable Inter file and one mono weight.
export const inter = localFont({
  src: "../node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2",
  weight: "100 900",
  variable: "--nf-inter",
  display: "swap",
});

export const mono = localFont({
  src: "../node_modules/@fontsource/jetbrains-mono/files/jetbrains-mono-latin-500-normal.woff2",
  weight: "500",
  variable: "--nf-mono",
  display: "swap",
  preload: false,
});
