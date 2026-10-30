// Squint and grayscale views of the first screen at 1280 and 390, saved next to the original.
// -squint = blurred (sigma 6) and desaturated, -gray = desaturated only. Run: npm run review:squint
import { join } from "node:path";
import sharp from "sharp";
import { PAGES, launch, main, newPage, outDir, pageKeys, settle } from "./lib/review.mjs";

const VIEWS = [{ name: "1280", width: 1280, height: 800, mobile: false }, { name: "390", width: 390, height: 844, mobile: true }];

main(async (base) => {
  const browser = await launch();
  for (const key of pageKeys()) {
    const cfg = PAGES[key];
    const dir = outDir(key, "squint");
    for (const v of VIEWS) {
      const { ctx, page } = await newPage(browser, { theme: cfg.primaryTheme, width: v.width, height: v.height, mobile: v.mobile, reducedMotion: "reduce" });
      await page.goto(base + cfg.path, { waitUntil: "load" });
      await settle(page);
      const shot = await page.screenshot();
      await ctx.close();
      await sharp(shot).toFile(join(dir, `first-${v.name}.png`));
      await sharp(shot).grayscale().toFile(join(dir, `first-${v.name}-gray.png`));
      await sharp(shot).grayscale().blur(6).toFile(join(dir, `first-${v.name}-squint.png`));
    }
    console.log(`[squint] ${key}: first-1280 and first-390, original / -gray / -squint`);
  }
  await browser.close();
});
