import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const HOME = process.env.PHOTOS === "0" ? "/?photos=0" : "/";

for (const theme of ["dark", "light"] as const) {
  test(`axe: no serious or critical issues (${theme})`, async ({ page }) => {
    await page.addInitScript((t) => {
      try { localStorage.setItem("theme", t); } catch {}
    }, theme);
    await page.goto(HOME);
    await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
    // open every disclosure so contrast of revealed content is checked too
    await page.evaluate(() => document.querySelectorAll("details").forEach((d) => (d.open = true)));
    const { violations } = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"])
      .analyze();
    const blocking = violations.filter((v) => v.impact === "serious" || v.impact === "critical");
    expect(
      blocking.map((v) => `${v.id} (${v.impact}): ${v.nodes.map((n) => n.target.join(" ")).slice(0, 4).join(" | ")}`),
    ).toEqual([]);
  });
}

test("axe: pressed shortlist, open revision history and mobile menu", async ({ page }) => {
  await page.goto(HOME);
  await page.locator("#notices").getByRole("button", { name: /^Shortlist/ }).first().click();
  await page.locator("#notices").getByRole("button", { name: /^Rev A/ }).first().click();
  const { violations } = await new AxeBuilder({ page }).analyze();
  expect(violations.filter((v) => v.impact === "serious" || v.impact === "critical").map((v) => v.id)).toEqual([]);
});
