import { test, expect } from "@playwright/test";

// Keyboard-only interaction tests for the three signature moments. No mouse: Tab, Enter, Space, Escape.
// Accessible names asserted with getByRole. Runs on `/` (dark) and `/v2` (light).
for (const path of ["/", "/v2"]) {
  test.describe(`moments on ${path}`, () => {
    test("revision tag: Tab to it, Enter opens the history, Escape closes it", async ({ page }) => {
      await page.goto(path);
      const row = page.locator("#notices .nrow.full").first();
      const tag = row.getByRole("button", { name: "Rev A: show revision history" });
      await row.scrollIntoViewIfNeeded();
      await row.getByRole("link").first().focus();
      await page.keyboard.press("Tab");
      await expect(tag).toBeFocused();
      await expect(tag).toHaveAttribute("aria-expanded", "false");
      await page.keyboard.press("Enter");
      await expect(tag).toHaveAttribute("aria-expanded", "true");
      const hist = row.getByRole("group", { name: /^Revision history, / });
      await expect(hist).toBeVisible();
      await expect(hist).toContainText("A · published on TED");
      await page.keyboard.press("Escape");
      await expect(tag).toHaveAttribute("aria-expanded", "false");
      await expect(hist).toBeHidden();
      await expect(tag).toBeFocused();
      await page.keyboard.press("Space");
      await expect(tag).toHaveAttribute("aria-expanded", "true");
    });

    test("shortlist: Tab to it, Space toggles it, row and fit squares change", async ({ page }) => {
      await page.goto(path);
      const row = page.locator("#notices .nrow.full").first();
      const tag = row.getByRole("button", { name: /^Rev A/ });
      const btn = row.getByRole("button", { name: /^Shortlist(ed)?: Supervision of repair/ });
      await tag.focus();
      await page.keyboard.press("Tab");
      await expect(btn).toBeFocused();
      await expect(btn).toHaveAttribute("aria-pressed", "false");
      await page.keyboard.press("Space");
      await expect(btn).toHaveAttribute("aria-pressed", "true");
      await expect(row).toHaveClass(/\bsl\b/);
      const hatch = await row.locator(".pip.on").first().evaluate((e) => getComputedStyle(e).backgroundImage);
      expect(hatch).toContain("repeating-linear-gradient");
      await page.keyboard.press("Enter");
      await expect(btn).toHaveAttribute("aria-pressed", "false");
      await expect(row).not.toHaveClass(/\bsl\b/);
      // the other rows are untouched
      await expect(page.locator("#notices .nrow.full.sl")).toHaveCount(0);
    });

    test("citation: Tab to the chip, Enter opens the chain, Enter closes it", async ({ page }) => {
      await page.goto(path);
      const claim = page.locator("[data-component='cited-claim']").first();
      const chip = claim.locator("summary");
      await claim.scrollIntoViewIfNeeded();
      await chip.focus();
      await expect(chip).toBeFocused();
      await expect(chip).toHaveAccessibleName("Met · Kenya Roads report, p. 47 · Sample");
      await page.keyboard.press("Enter");
      await expect(claim.locator("details")).toHaveAttribute("open", "");
      const chain = claim.getByRole("list");
      await expect(chain.getByRole("listitem")).toHaveCount(3);
      await expect(chain.getByText("At least 3 similar assignments in the last 10 years")).toBeVisible();
      await expect(chain.getByText("Kenya Roads completion report")).toBeVisible();
      await expect(chain.getByRole("link", { name: /REOI/ })).toBeVisible();
      await page.keyboard.press("Enter");
      await expect(claim.locator("details")).not.toHaveAttribute("open", "");
    });
  });
}

test("reduced motion: the three moments open with no transition or animation", async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: "reduce", viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage();
  await page.goto("/");
  const row = page.locator("#notices .nrow.full").first();
  await row.getByRole("button", { name: /^Rev A/ }).click();
  await page.locator("[data-component='cited-claim'] summary").first().click();
  const motion = await page.evaluate(() =>
    ["#notices .rev-hist", "[data-component='cited-claim'] .trace", "#notices .rev"].map((s) => {
      const cs = getComputedStyle(document.querySelector(s)!);
      return { s, anim: cs.animationName, animDur: cs.animationDuration, trans: cs.transitionDuration };
    }));
  for (const m of motion) {
    expect(m.anim === "none" || parseFloat(m.animDur) === 0, `${m.s} animation`).toBe(true);
    expect(parseFloat(m.trans), `${m.s} transition`).toBe(0);
  }
  await ctx.close();
});
