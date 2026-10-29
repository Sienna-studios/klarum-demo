import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// Light, minimalist version at /v2/<hero>. Dark version stays at /.
const HEROES = {
  a: /Turn your own project files into an expression of interest/,
  b: /Every claim in your EOI, linked to the page that proves it\./,
  c: /Open tenders that fit your similar assignments, in one feed\./,
  d: /Search live tender notices, draft from your own references, track every bid\./,
} as const;
const FORBIDDEN = /app\.klarum\.com|api\.klarum\.com|posthog/i;

for (const [id, h1] of Object.entries(HEROES)) {
  test.describe(`v2 hero ${id}`, () => {
    test("renders: h1, one primary action, light ground", async ({ page }) => {
      await page.goto(`/v2/${id}`);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(h1);
      const trial = page.getByRole("link", { name: "Start the Business trial" }).first();
      await expect(trial).toHaveAttribute("href", "https://app.klarum.com");
      const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
      const [r, g, b] = bg.match(/\d+/g)!.map(Number);
      expect(Math.min(r, g, b), "page ground must be light").toBeGreaterThan(235);
      expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(0);
    });

    test("axe: no serious or critical issues", async ({ page }) => {
      await page.goto(`/v2/${id}`);
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

    test("no forbidden requests; <=410 KB and <=25 requests before load", async ({ browser }, info) => {
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
      await page.goto(`/v2/${id}`, { waitUntil: "load" });
      await page.waitForTimeout(2000);
      await context.close();
      console.log(`v2/${id} ${info.project.name}: ${(bytes / 1024).toFixed(1)} KB, ${n} requests`);
      expect(urls.filter((u) => FORBIDDEN.test(u))).toEqual([]);
      expect(n).toBeLessThanOrEqual(25);
      expect(bytes).toBeLessThanOrEqual(410 * 1024);
    });

    test("screenshots", async ({ page }, info) => {
      test.skip(info.project.name === "reduced-motion");
      await page.goto(`/v2/${id}`);
      await page.evaluate(() => document.fonts.ready);
      const dir = `screenshots/v2/${info.project.name}`;
      await page.screenshot({ path: `${dir}/hero-${id}.png` });
      if (id === "a") await page.screenshot({ path: `${dir}/page.png`, fullPage: true });
    });
  });
}

test("v2: switcher links all four heroes and the dark version", async ({ page }) => {
  await page.goto("/v2/a");
  const nav = page.getByRole("navigation", { name: "Hero variants" });
  for (const l of ["A", "B", "C", "D"]) await expect(nav.getByRole("link", { name: new RegExp(`^Hero ${l}`) })).toBeVisible();
  await expect(nav.getByRole("link", { name: /Dark version/ })).toHaveAttribute("href", "/");
});

test("v2: shortlist, cited claim and pricing toggle still work", async ({ page }) => {
  await page.goto("/v2/a");
  const btn = page.locator("#notices").getByRole("button", { name: /Shortlist/ }).first();
  await btn.click();
  await expect(btn).toHaveAttribute("aria-pressed", "true");
  await page.locator("details.cite > summary").click();
  await expect(page.locator("details.cite")).toHaveAttribute("open", "");
  await page.locator("#pricing").getByRole("button", { name: /Yearly/ }).click();
  await expect(page.locator("#pricing").getByText("€2,000")).toBeVisible();
});

test("v2: claims.md 'confirm' rows stay out", async ({ page }) => {
  await page.goto("/v2/a");
  const t = await page.locator("body").innerText();
  expect(t).not.toMatch(/thirty|same day|legal team can sign|ISO ?27001|SOC ?2/i);
});
