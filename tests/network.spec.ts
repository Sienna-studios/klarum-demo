import { test, expect, type Request } from "@playwright/test";

// Run against any URL: BASE_URL=https://www.klarum.com npx playwright test network --project=mobile-390
const FORBIDDEN = /(^|\.)app\.klarum\.com$|(^|\.)api\.klarum\.com$|posthog/i;
const BYTES_BUDGET = 410 * 1024;
const REQUEST_BUDGET = 25;

test("HAR: no request to app.klarum.com, api.klarum.com or posthog before interaction", async ({ browser, baseURL }, info) => {
  const context = await browser.newContext({
    ...info.project.use,
    recordHar: { path: info.outputPath("before-interaction.har") },
  });
  const page = await context.newPage();
  const hosts: string[] = [];
  const urls: string[] = [];
  page.on("request", (r: Request) => {
    urls.push(r.url());
    try { hosts.push(new URL(r.url()).hostname); } catch {}
  });
  await page.goto(baseURL!, { waitUntil: "load" });
  await page.waitForLoadState("networkidle").catch(() => {});
  await page.waitForTimeout(3000); // timers (tours, analytics boots) fire here if they exist
  await context.close(); // flushes the HAR

  const bad = urls.filter((u) => {
    try { return FORBIDDEN.test(new URL(u).hostname) || /posthog/i.test(u); } catch { return false; }
  });
  expect(bad, "forbidden requests before interaction").toEqual([]);
  info.annotations.push({ type: "hosts", description: [...new Set(hosts)].join(", ") });
});

test("budget: <=410 KB and <=25 requests before load (mobile, cold)", async ({ browser, baseURL }, info) => {
  test.skip(info.project.name !== "mobile-390", "budget is a mobile measurement");
  const context = await browser.newContext({ ...info.project.use });
  const page = await context.newPage();
  const cdp = await context.newCDPSession(page);
  await cdp.send("Network.enable");
  await cdp.send("Network.setCacheDisabled", { cacheDisabled: true });
  let count = 0;
  let bytes = 0;
  let loaded = false;
  cdp.on("Network.requestWillBeSent", (e) => {
    if (!loaded && !e.request.url.startsWith("data:")) count++;
  });
  cdp.on("Network.dataReceived", () => {});
  cdp.on("Network.loadingFinished", (e) => {
    if (!loaded) bytes += e.encodedDataLength;
  });
  page.once("load", () => { loaded = true; });
  await page.goto(baseURL!, { waitUntil: "load" });
  await context.close();
  info.annotations.push({ type: "measured", description: `${(bytes / 1024).toFixed(1)} KB, ${count} requests` });
  console.log(`before load: ${(bytes / 1024).toFixed(1)} KB over ${count} requests`);
  expect(count, "requests before load").toBeLessThanOrEqual(REQUEST_BUDGET);
  expect(bytes, "bytes before load").toBeLessThanOrEqual(BYTES_BUDGET);
});

test("no video, iframe or images above the fold", async ({ page }) => {
  await page.goto("/");
  expect(await page.locator("video, iframe").count()).toBe(0);
  const imgs = await page.locator("img").evaluateAll((els) =>
    els.filter((e) => e.getBoundingClientRect().top < window.innerHeight).length);
  expect(imgs).toBe(0);
});
