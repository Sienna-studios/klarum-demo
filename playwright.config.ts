import { defineConfig } from "@playwright/test";

const PORT = 3100;
const external = process.env.BASE_URL;

export default defineConfig({
  testDir: "./tests",
  outputDir: "./test-results",
  reporter: [["list"]],
  fullyParallel: false,
  workers: 1,
  use: {
    baseURL: external ?? `http://localhost:${PORT}`,
    colorScheme: "dark", // the page is dark by default; the OS preference is exercised in axe via data-theme
    launchOptions: { args: ["--no-sandbox"] },
  },
  webServer: external
    ? undefined
    : {
        command: `npm run build && npx next start -p ${PORT}`,
        url: `http://localhost:${PORT}`,
        reuseExistingServer: true,
        timeout: 240_000,
      },
  projects: [
    {
      name: "mobile-390",
      use: {
        viewport: { width: 390, height: 844 },
        deviceScaleFactor: 2,
        isMobile: true,
        hasTouch: true,
      },
    },
    { name: "desktop-1280", use: { viewport: { width: 1280, height: 800 } } },
    {
      name: "reduced-motion",
      use: { viewport: { width: 1280, height: 800 }, reducedMotion: "reduce" },
    },
  ],
});
