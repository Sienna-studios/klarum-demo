import { test, expect } from "@playwright/test";

// Visual regression baseline for /lab/states: full page, both themes on one page, at 390 and 1280.
// Baselines live in tests/lab.spec.ts-snapshots/. Update with: npx playwright test lab --update-snapshots
test("lab/states: visual baseline", async ({ page }, info) => {
  test.skip(info.project.name === "reduced-motion", "baseline is taken at 390 and 1280 only");
  await page.goto("/lab/states");
  await page.evaluate(() => document.fonts.ready);
  await page.waitForLoadState("networkidle");
  await expect(page).toHaveScreenshot(`states-${info.project.name}.png`, { fullPage: true, animations: "disabled", maxDiffPixelRatio: 0.002 });
});

test("lab/states: every state is present in both themes", async ({ page }, info) => {
  test.skip(info.project.name !== "desktop-1280");
  await page.goto("/lab/states");
  for (const theme of ["dark", "light"]) {
    const t = page.locator(`[data-lab-theme="${theme}"]`);
    await expect(t.locator("[data-component='cited-claim']")).toHaveCount(5);
    await expect(t.locator(".nrow.full")).toHaveCount(10);
    await expect(t.locator(".nrow.full.sl")).toHaveCount(1);
    await expect(t.locator(".nrow.compact")).toHaveCount(5);
    await expect(t.locator(".rev-hist:not([hidden])")).toHaveCount(3);
    await expect(t.locator(".sheet")).toHaveCount(3);
    await expect(t.getByText("Supervision of repair and rehabilitation of highways, bridges and drainage structures across four districts, lot 2 (1/2)").first()).toBeVisible();
  }
});
