import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// Light version at /v2: hero C only, rebuilt after PD6-HatchMosaic. Dark version stays at /.
const H1 = /Open tenders that fit your similar assignments, in one feed\./;
const FORBIDDEN = /app\.klarum\.com|api\.klarum\.com|posthog/i;

test("v2 hero: all of C's content, one primary action, light ground", async ({ page }) => {
  await page.goto("/v2");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(H1);
  await expect(page.getByText("For infrastructure bid teams")).toBeVisible();
  await expect(page.getByText("Klarum then drafts the EOI. Every experience claim links to the page that proves it.")).toBeVisible();
  const trial = page.getByRole("link", { name: "Start the Business trial" }).first();
  await expect(trial).toHaveAttribute("href", "https://app.klarum.com");
  await expect(page.getByRole("link", { name: "See pricing" }).first()).toBeVisible();
  await expect(page.getByText("7-day trial, one per organisation, no payment method.")).toBeVisible();
  await expect(page.getByRole("link", { name: "Or review one upcoming tender with us" })).toBeVisible();
  const feed = page.locator(".mh-feed");
  await expect(feed.getByText("Open notices · Sample fit")).toBeVisible();
  await expect(feed.locator(".nrow")).toHaveCount(3);
  await expect(feed.locator(".pips")).toHaveCount(3);
  const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  const [r, g, b] = bg.match(/\d+/g)!.map(Number);
  expect(Math.min(r, g, b), "page ground must be light").toBeGreaterThan(235);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(0);
  await expect(page.getByRole("navigation", { name: "Hero variants" })).toHaveCount(0);
});

test("v2 hero: the mosaic is decorative and carries the legend", async ({ page }) => {
  await page.goto("/v2");
  await expect(page.locator(".mh-bg")).toHaveAttribute("aria-hidden", "true");
  expect(await page.locator(".mh-band i.s").count()).toBeGreaterThan(10);
  expect(await page.locator(".mh-band i.h").count()).toBeGreaterThan(5);
  await expect(page.locator(".mh-legend")).toHaveText(/Fits your index · Shortlisted · Illustrative/);
});

test("v2: the old hero routes redirect to /v2 and keep the query", async ({ page }) => {
  for (const id of ["c", "e", "f", "g"]) {
    await page.goto(`/v2/${id}?photos=0`);
    expect(new URL(page.url()).pathname).toBe("/v2");
    expect(new URL(page.url()).search).toBe("?photos=0");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(H1);
  }
});

test("v2: the hero photo is the only image above the fold, preloaded at high priority", async ({ page }) => {
  await page.goto("/v2");
  const above = await page.locator("img").evaluateAll((els) =>
    els.filter((e) => e.getBoundingClientRect().top < window.innerHeight).map((e) => (e.closest("[data-photo]") as HTMLElement | null)?.dataset.photo ?? "other"));
  expect(above).toEqual(["hero"]);
  await expect(page.locator("img[fetchpriority=high]")).toHaveCount(1);
  expect(await page.locator('link[rel=preload][as=image][fetchpriority=high]').count()).toBeGreaterThan(0);
  await page.goto("/v2?photos=0");
  expect(await page.locator("img").count()).toBe(0);
});

test("v2 axe: no serious or critical issues", async ({ page }) => {
  await page.goto("/v2");
  await page.evaluate(() => document.querySelectorAll("details").forEach((d) => (d.open = true)));
  const { violations } = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"])
    .analyze();
  expect(
    violations
      .filter((v) => v.impact === "serious" || v.impact === "critical")
      .map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).slice(0, 3).join(" | ")}`),
  ).toEqual([]);
});

test("v2: no forbidden requests; <=410 KB and <=25 requests before load", async ({ browser }, info) => {
  const context = await browser.newContext({ ...info.project.use });
  const page = await context.newPage();
  const cdp = await context.newCDPSession(page);
  await cdp.send("Network.enable");
  await cdp.send("Network.setCacheDisabled", { cacheDisabled: true });
  let n = 0, bytes = 0, loaded = false;
  const urls: string[] = [];
  cdp.on("Network.requestWillBeSent", (e) => { if (!loaded) { n++; urls.push(e.request.url); } });
  cdp.on("Network.loadingFinished", (e) => { if (!loaded) bytes += e.encodedDataLength; });
  page.once("load", () => { loaded = true; });
  await page.goto("/v2", { waitUntil: "load" });
  await page.waitForTimeout(2000);
  await context.close();
  console.log(`v2 ${info.project.name}: ${(bytes / 1024).toFixed(1)} KB, ${n} requests`);
  expect(urls.filter((u) => FORBIDDEN.test(u))).toEqual([]);
  expect(n).toBeLessThanOrEqual(25);
  expect(bytes).toBeLessThanOrEqual(410 * 1024);
});

test("v2: screenshots", async ({ page }, info) => {
  test.skip(info.project.name === "reduced-motion");
  await page.goto("/v2");
  await page.evaluate(() => document.fonts.ready);
  const dir = `screenshots/v2/${info.project.name}`;
  await page.screenshot({ path: `${dir}/hero.png` });
  await page.screenshot({ path: `${dir}/page.png`, fullPage: true });
});

test("v2: shortlist, cited claim and pricing toggle still work", async ({ page }) => {
  await page.goto("/v2");
  const btn = page.locator("#notices").getByRole("button", { name: /Shortlist/ }).first();
  await btn.click();
  await expect(btn).toHaveAttribute("aria-pressed", "true");
  await page.locator("details.cite > summary").click();
  await expect(page.locator("details.cite")).toHaveAttribute("open", "");
  await page.locator("#pricing").getByRole("button", { name: /Yearly/ }).click();
  await expect(page.locator("#pricing").getByText("€2,000")).toBeVisible();
});

test("v2: claims.md 'confirm' rows stay out", async ({ page }) => {
  await page.goto("/v2");
  const t = await page.locator("body").innerText();
  expect(t).not.toMatch(/thirty|same day|legal team can sign|ISO ?27001|SOC ?2/i);
});
