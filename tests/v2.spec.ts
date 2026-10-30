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
  await expect(page.locator(".mh-panel").getByText("7-day trial, one per organisation, no payment method.")).toBeVisible();
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

test("v2 hero: no tile band, the photo band is clear", async ({ page }, info) => {
  test.skip(info.project.name !== "desktop-1280");
  await page.goto("/v2");
  await expect(page.locator(".mh-tiles")).toHaveCount(0);
  await expect(page.locator(".mh-bg")).toHaveAttribute("aria-hidden", "true");
});

test("v2 hero: the panel is snapped to the 40 px grid and the first screen holds everything at 1280 x 800", async ({ page }, info) => {
  test.skip(info.project.name !== "desktop-1280");
  await page.goto("/v2");
  const panel = (await page.locator(".mh-panel").boundingBox())!;
  const hero = (await page.locator(".mh").boundingBox())!;
  expect(panel.x % 40).toBe(0);
  expect(panel.width % 40).toBe(0);
  expect((panel.y - hero.y) % 40).toBe(0);
  expect(panel.y - hero.y, "at least 240 px of photo above the panel").toBeGreaterThanOrEqual(240);
  const vh = page.viewportSize()!.height;
  for (const sel of [".mh-copy h1", ".mh-copy .m-lead", ".mh-copy .m-btn", ".mh-copy .m-fine", ".mh-copy .m-quiet", ".mh-feed .nrow:nth-child(3)"]) {
    const b = (await page.locator(sel).boundingBox())!;
    expect(b.y + b.height, `${sel} inside the first screen`).toBeLessThanOrEqual(vh);
  }
  // copy left, notice card right, top-aligned
  const copy = (await page.locator(".mh-copy").boundingBox())!;
  const feed = (await page.locator(".mh-feed").boundingBox())!;
  expect(feed.x).toBeGreaterThan(copy.x + copy.width);
  expect(Math.abs(feed.y - copy.y)).toBeLessThanOrEqual(2);
});

test("v2 header button: outlined while the hero is in view, solid red after", async ({ page }, info) => {
  test.skip(info.project.name !== "desktop-1280");
  await page.goto("/v2");
  const btn = page.locator(".m-btn-hdr");
  await expect(btn).toHaveAttribute("data-solid", "false");
  await page.evaluate(() => window.scrollTo(0, document.querySelector(".mh")!.getBoundingClientRect().bottom + scrollY + 200));
  await expect(btn).toHaveAttribute("data-solid", "true");
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(btn).toHaveAttribute("data-solid", "false");
});

test("v2: the old hero routes redirect to /v2 and keep the query", async ({ page }) => {
  for (const id of ["c", "e", "f", "g"]) {
    await page.goto(`/v2/${id}?photos=0`);
    expect(new URL(page.url()).pathname).toBe("/v2");
    expect(new URL(page.url()).search).toBe("?photos=0");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(H1);
  }
});

test("v2: the hero photo is the only image above the fold on desktop, below the panel on a phone (so the h1 is the LCP)", async ({ page }, info) => {
  await page.goto("/v2");
  const above = await page.locator("img").evaluateAll((els) =>
    els.filter((e) => e.getBoundingClientRect().top < window.innerHeight).map((e) => (e.closest("[data-photo]") as HTMLElement | null)?.dataset.photo ?? "other"));
  const phone = info.project.name === "mobile-390";
  expect(above).toEqual(phone ? [] : ["hero"]);
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

// The byte budget is a mobile, cold-load measurement (CLAUDE.md); requests and forbidden hosts are checked on every project.
test("v2: no forbidden requests; <=410 KB (mobile) and <=25 requests before load", async ({ browser }, info) => {
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
  if (info.project.name === "mobile-390") expect(bytes).toBeLessThanOrEqual(410 * 1024);
});

test("v2: screenshots", async ({ page }, info) => {
  test.skip(info.project.name === "reduced-motion");
  await page.goto("/v2");
  await page.evaluate(() => document.fonts.ready);
  const dir = `screenshots/v2/${info.project.name}`;
  await page.screenshot({ path: `${dir}/hero.png` });
  await page.screenshot({ path: `${dir}/page.png`, fullPage: true });
});

test("v2: cited claim and pricing toggle still work", async ({ page }) => {
  await page.goto("/v2");
  await page.getByRole("tab").nth(3).click(); // the cited draft is step 4 of How it works
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
