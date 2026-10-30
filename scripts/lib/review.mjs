// Shared helpers for the review tools: production server, pages under review, output folders.
import { spawn, spawnSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { setTimeout as sleep } from "node:timers/promises";

export const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
export const ROUND = process.env.ROUND || "round-0";
export const PORT = Number(process.env.REVIEW_PORT || 3200);

/** PHOTOS=0 reviews the `?photos=0` baseline (same pages, no photos). */
export const NO_PHOTOS = process.env.PHOTOS === "0";
const Q = NO_PHOTOS ? "?photos=0" : "";
export const withQuery = (path, extra) => path + (path.includes("?") ? "&" : "?") + extra;

/** The two versions kept in DECISIONS.md. Both share tokens.css and the components. */
export const PAGES = {
  dark: {
    path: "/" + Q,
    target: "design/brief/renders/Home-Draft-Dark.webp",
    themes: ["dark", "light"], // `/` follows the data-theme switch
    primaryTheme: "dark",
  },
  light: {
    path: "/v2" + Q,
    target: "design/brief/renders/Home-Draft-Light.webp",
    // /v2 has no theme switch. "native" = no stored theme, OS dark (how the earlier screenshots were taken):
    // minimal.css re-points the tokens. "os-light" = OS light: the tokens.css light block outranks minimal.css.
    themes: ["native", "os-light"],
    primaryTheme: "native",
  },
};

export const pageKeys = () => (process.env.PAGES ? process.env.PAGES.split(",") : Object.keys(PAGES));
export const outDir = (key, ...sub) => {
  const d = join(ROOT, "screenshots/review", ROUND, key, ...sub);
  mkdirSync(d, { recursive: true });
  return d;
};

export function sh(cmd, args, opts = {}) {
  const r = spawnSync(cmd, args, { cwd: ROOT, stdio: "inherit", env: process.env, ...opts });
  if (r.status !== 0) throw new Error(`${cmd} ${args.join(" ")} exited ${r.status}`);
}

/** Builds, starts `next start`, runs fn(baseUrl), stops the server. Reuses BASE_URL when the runner already started one. */
export async function withServer(fn) {
  if (process.env.BASE_URL) return fn(process.env.BASE_URL.replace(/\/$/, ""));
  try { await fetch(`http://localhost:${PORT}`); throw new Error(`port ${PORT} is already serving something (a stale next start?); stop it or set REVIEW_PORT`); } catch (e) { if (/already serving/.test(e.message)) throw e; }
  sh("npm", ["run", "build"], { stdio: ["ignore", "ignore", "inherit"] });
  const server = spawn("npx", ["next", "start", "-p", String(PORT)], { cwd: ROOT, stdio: "ignore", detached: true });
  const base = `http://localhost:${PORT}`;
  try {
    for (let i = 0; i < 60; i++) {
      try { if ((await fetch(base)).ok) break; } catch {}
      await sleep(500);
    }
    return await fn(base);
  } finally {
    try { process.kill(-server.pid); } catch {}
  }
}

/** Runs a script module as the CLI entry with the server up. */
export async function main(run) {
  await withServer(run);
}

export async function launch() {
  const { chromium } = await import("playwright");
  return chromium.launch({ args: ["--no-sandbox"] });
}

/** New context with the theme stored the way the page reads it (localStorage "theme"). */
export async function newPage(browser, { theme = "dark", width = 1280, height = 800, dpr = 1, reducedMotion = "no-preference", mobile = false } = {}) {
  const stored = theme === "dark" || theme === "light";
  const ctx = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: dpr,
    reducedMotion,
    colorScheme: theme === "light" || theme === "os-light" ? "light" : "dark",
    isMobile: mobile,
    hasTouch: mobile,
  });
  if (stored) await ctx.addInitScript((t) => { try { localStorage.setItem("theme", t); } catch {} }, theme);
  const page = await ctx.newPage();
  return { ctx, page };
}

export async function settle(page) {
  await page.evaluate(() => document.fonts.ready);
  await page.waitForLoadState("networkidle").catch(() => {});
  await page.waitForTimeout(250);
}

export const median = (a) => { const s = [...a].sort((x, y) => x - y); const m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };

/** Scrolls the whole page so IntersectionObserver photos load, waits for every image, returns to the top. */
export async function scrollThrough(page) {
  await page.evaluate(async () => {
    const h = document.documentElement.scrollHeight;
    for (let y = 0; y < h; y += 400) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 80)); }
    window.scrollTo(0, h);
    await new Promise((r) => setTimeout(r, 250));
  });
  await page.waitForFunction(() => [...document.images].every((i) => i.complete), null, { timeout: 15000 }).catch(() => {});
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);
}
