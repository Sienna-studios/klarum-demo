import { test } from "@playwright/test";

// Screenshots are written to ./screenshots/<project>/ and committed as review artefacts.
test("screenshots: full page and personality components", async ({ page }, info) => {
  const dir = `screenshots/${info.project.name}`;
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: `${dir}/page.png`, fullPage: true });
  await page.screenshot({ path: `${dir}/hero.png` });

  const p1 = page.locator("#notices [data-component='notice-list']");
  await p1.scrollIntoViewIfNeeded();
  await p1.getByRole("button", { name: /Shortlist/ }).first().click();
  await p1.getByRole("button", { name: /^Rev A/ }).first().focus();
  await p1.screenshot({ path: `${dir}/p1-notice-row.png` });

  const p2 = page.locator("[data-component='cited-claim']");
  await p2.locator("summary").click();
  await p2.screenshot({ path: `${dir}/p2-cited-claim.png` });

  const p3 = page.getByRole("contentinfo");
  await p3.scrollIntoViewIfNeeded();
  await p3.screenshot({ path: `${dir}/p3-footer.png` });

  await page.getByRole("button", { name: "Switch theme" }).evaluate((b) => b.scrollIntoView());
  await page.getByRole("button", { name: "Switch theme" }).click();
  await page.screenshot({ path: `${dir}/page-light.png`, fullPage: true });
});
