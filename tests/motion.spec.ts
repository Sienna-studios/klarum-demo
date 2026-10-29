import { test, expect } from "@playwright/test";

test("reduced motion: no transitions or animations anywhere", async ({ page }, info) => {
  test.skip(info.project.name !== "reduced-motion");
  await page.goto("/");
  const offenders = await page.evaluate(() =>
    [...document.querySelectorAll("*")]
      .filter((el) => {
        const s = getComputedStyle(el);
        const t = s.transitionDuration.split(",").some((d) => parseFloat(d) > 0);
        const a = s.animationName !== "none" && s.animationDuration.split(",").some((d) => parseFloat(d) > 0);
        return t || a;
      })
      .map((el) => el.tagName + "." + el.className),
  );
  expect(offenders).toEqual([]);
});

test("motion only touches opacity and transform", async ({ page }, info) => {
  test.skip(info.project.name === "reduced-motion");
  await page.goto("/");
  const bad = await page.evaluate(() => {
    const out: string[] = [];
    for (const el of document.querySelectorAll("*")) {
      const s = getComputedStyle(el);
      const props = s.transitionProperty.split(",").map((p) => p.trim());
      const durs = s.transitionDuration.split(",").map(parseFloat);
      props.forEach((p, i) => {
        if (durs[i % durs.length] > 0 && !["opacity", "transform"].includes(p)) out.push(`${el.tagName}.${el.className}:${p}`);
      });
    }
    return out;
  });
  expect(bad).toEqual([]);
});
