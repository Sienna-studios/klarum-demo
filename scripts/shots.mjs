// Full-page screenshots at 1280 and 390, after scrolling so every photo has loaded (first screens are in squint/). Saved as WebP for the judges.
// Run: npm run review:shots
import { join } from "node:path";
import sharp from "sharp";
import { PAGES, launch, main, newPage, outDir, pageKeys, scrollThrough, settle } from "./lib/review.mjs";

const VIEWS = [{ name: "1280", width: 1280, height: 800, mobile: false }, { name: "390", width: 390, height: 844, mobile: true }];

main(async (base) => {
  const browser = await launch();
  for (const key of pageKeys()) {
    const cfg = PAGES[key];
    const dir = outDir(key, "shots");
    for (const v of VIEWS) {
      const { ctx, page } = await newPage(browser, { theme: cfg.primaryTheme, width: v.width, height: v.height, mobile: v.mobile, reducedMotion: "reduce" });
      await page.goto(base + cfg.path, { waitUntil: "load" });
      await settle(page);
      await scrollThrough(page); // lazy photos load only near the viewport
      const shot = await page.screenshot({ fullPage: true });
      await ctx.close();
      await sharp(shot).webp({ quality: 80 }).toFile(join(dir, `full-${v.name}.webp`));
    }
    console.log(`[shots] ${key}: full-1280 and full-390`);
  }
  await browser.close();
});
