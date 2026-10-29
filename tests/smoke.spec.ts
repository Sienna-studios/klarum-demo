import { test, expect } from "@playwright/test";

const H1 =
  "Turn your own project files into an expression of interest that meets the shortlisting criteria.";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("hero: default copy and actions", async ({ page }) => {
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(H1);
  await expect(page.getByText("Every experience claim links to the page that proves it.")).toBeVisible();
  const trial = page.getByRole("link", { name: "Start the Business trial" }).first();
  await expect(trial).toHaveAttribute("href", "https://app.klarum.com");
  await expect(page.getByRole("link", { name: "Or review one upcoming tender with us" })).toHaveAttribute(
    "href",
    "https://www.klarum.com/contact#bookings",
  );
  for (const l of await page.getByRole("link", { name: "See pricing" }).all()) {
    await expect(l).toHaveAttribute("href", /klarum\.com\/pricing$/);
  }
});

test("sections render in order", async ({ page }) => {
  const headings = await page.getByRole("heading", { level: 2 }).allTextContents();
  const order = [
    "From notice to award, in one place.",
    "Where your documents go",
    "See it on your own pipeline.",
  ];
  let last = -1;
  for (const h of order) {
    const i = headings.findIndex((t) => t.includes(h));
    expect(i, `missing h2 "${h}"`).toBeGreaterThan(last);
    last = i;
  }
  await expect(page.getByText("Built and backed by people from")).toBeVisible();
  for (const n of ["KTH", "AI Sweden", "AWS", "Google Maps", "Apple", "Svea Solar", "Lyceum Technology"]) {
    await expect(page.getByRole("list", { name: "Built and backed by" }).getByText(n, { exact: true })).toBeVisible();
  }
});

test("P1 notice row: shortlist toggles, fit exposed as text, rev tag described", async ({ page }) => {
  const section = page.locator("#notices");
  const rows = section.getByRole("listitem").filter({ has: page.getByRole("button", { name: /Shortlist/ }) });
  await expect(rows).toHaveCount(3);
  await expect(section.getByLabel("Fit 4 of 5").first()).toBeVisible();
  await expect(section.getByText("Sample fit").first()).toBeVisible();

  const btn = rows.first().getByRole("button", { name: /Shortlist/ });
  await expect(btn).toHaveAttribute("aria-pressed", "false");
  const box = await btn.boundingBox();
  expect(box!.height).toBeGreaterThanOrEqual(44);
  await btn.click();
  await expect(btn).toHaveAttribute("aria-pressed", "true");
  await expect(btn).toHaveText("Shortlisted");
  await btn.click();
  await expect(btn).toHaveAttribute("aria-pressed", "false");

  const tag = rows.first().getByRole("button", { name: /^Rev A/ });
  const id = await tag.getAttribute("aria-describedby");
  expect(id).toBeTruthy();
  await tag.focus();
  await expect(page.locator(`#${id}`)).toBeVisible();
  await expect(page.locator(`#${id}`)).toContainText("published");
});

test("P2 cited claim: details chip opens the source, no JS needed", async ({ page }) => {
  const chip = page.locator("details.cite > summary");
  await expect(chip).toBeVisible();
  const box = await chip.boundingBox();
  expect(box!.height).toBeGreaterThanOrEqual(44);
  await expect(page.getByText("At least 3 similar assignments in the last 10 years").first()).toBeVisible();
  await expect(page.getByText("Sample", { exact: false }).first()).toBeVisible();
  await chip.click();
  await expect(page.locator("details.cite")).toHaveAttribute("open", "");
  await expect(page.locator("details.cite").getByText("[Sample excerpt]")).toBeVisible();
  await expect(
    page.locator("details.cite").getByRole("link", { name: /Vanuatu/ }),
  ).toHaveAttribute("href", /pwd\.gov\.vu/);
});

test("P3 title-block footer", async ({ page }) => {
  const table = page.getByRole("table", { name: "Sheet information" });
  await expect(table).toBeVisible();
  for (const t of ["A-101", "C", "Home.", "1:1", "Medborgarplatsen 25", "www.klarum.com", "2026"]) {
    await expect(table.getByText(t, { exact: false }).first()).toBeVisible();
  }
  const footer = page.getByRole("contentinfo");
  await expect(footer.getByText("© 2026 Klarum Technologies AB")).toBeVisible();
  for (const l of ["Notices", "Pricing", "Integrations", "Changelog", "About", "Articles", "Contact", "Research", "Privacy", "Terms", "Security", "Trust Center"]) {
    await expect(footer.getByRole("link", { name: l, exact: true })).toBeVisible();
  }
});

test("pricing: billing toggle and plans", async ({ page }) => {
  const pricing = page.locator("#pricing");
  await expect(pricing.getByText("€200")).toBeVisible();
  await pricing.getByRole("button", { name: /Yearly/ }).click();
  await expect(pricing.getByText("€2,000")).toBeVisible();
  await expect(pricing.getByText("Planned").first()).toBeVisible(); // SSO/SCIM never shown as included
  await expect(pricing.getByRole("link", { name: "Start the Business trial" })).toHaveAttribute("href", "https://app.klarum.com");
});

test("FAQ: five details, keyboard operable", async ({ page }) => {
  const items = page.locator("#faq details");
  await expect(items).toHaveCount(5);
  await items.first().locator("summary").click();
  await expect(items.first()).toHaveAttribute("open", "");
});

test("claims.md: 'confirm' rows stay out", async ({ page }) => {
  const text = await page.locator("body").innerText();
  expect(text).not.toMatch(/thirty/i);
  expect(text).not.toMatch(/same day/i);
  expect(text).not.toMatch(/legal team can sign/i);
  expect(text).not.toMatch(/ISO ?27001|SOC ?2/i);
});

test("theme toggle switches data-theme", async ({ page }) => {
  const html = page.locator("html");
  await page.getByRole("button", { name: "Switch theme" }).click();
  await expect(html).toHaveAttribute("data-theme", "light");
  await page.getByRole("button", { name: "Switch theme" }).click();
  await expect(html).toHaveAttribute("data-theme", "dark");
});

test("focus is visible on interactive elements", async ({ page }) => {
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  const outline = await page.evaluate(() => {
    const s = getComputedStyle(document.activeElement!);
    return { w: s.outlineWidth, st: s.outlineStyle };
  });
  expect(outline.st).not.toBe("none");
  expect(parseFloat(outline.w)).toBeGreaterThanOrEqual(2);
});

test("touch targets >= 44px for buttons and links in header/hero", async ({ page }) => {
  const els = page.locator("header :is(a,button):visible, #hero :is(a,button):visible");
  for (const el of await els.all()) {
    const b = await el.boundingBox();
    if (!b) continue;
    expect(b.height, await el.innerText()).toBeGreaterThanOrEqual(43.5);
  }
});

test("phone: nav hidden and menu button shown at <=760", async ({ page }) => {
  const w = page.viewportSize()!.width;
  const menu = page.getByRole("button", { name: "Menu" });
  const nav = page.locator("header nav a", { hasText: "Notices" });
  if (w <= 760) {
    await expect(menu).toBeVisible();
    await expect(nav).toBeHidden();
  } else {
    await expect(menu).toBeHidden();
    await expect(nav).toBeVisible();
  }
});

test("no horizontal overflow", async ({ page }) => {
  const over = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(over).toBeLessThanOrEqual(0);
});
