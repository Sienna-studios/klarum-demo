// Contact sheet of the candidate crops, natural colour, focal point marked, chosen crops outlined.
// Writes screenshots/review/photos-crops.png. Run: npm run photos:crops
import { readFileSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";
import { CANDIDATES, CHOSEN, SLOTS } from "./photo-crops.mjs";
import { ROOT } from "./lib/review.mjs";

const rows = [["plate", "desktop", 480, "Bridges: plate, desktop (12:5)"], ["plate", "mobile", 360, "Bridges: plate, 390 px (4:3)"], ["cta", "desktop", 480, "Rail: CTA band, desktop (3:1)"], ["cta", "mobile", 300, "Rail: CTA band, 390 px (1:1)"]];
const GAP = 16, PAD = 24, LAB = 52;
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
const svg = (w, h, body) => Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" font-family="sans-serif">${body}</svg>`);

const tiles = [];
let y = PAD, W = 0;
for (const [slot, bp, tw, title] of rows) {
  const src = readFileSync(join(ROOT, "photos", `${SLOTS[slot].photo}.jpg`));
  const th = Math.round(tw / SLOTS[slot][bp]);
  tiles.push({ input: svg(1500, 30, `<text x="0" y="22" font-size="20" font-weight="700" fill="#111">${esc(title)}</text>`), left: PAD, top: y });
  y += 36;
  let x = PAD;
  for (const c of CANDIDATES[slot][bp]) {
    const crop = await sharp(src).extract({ left: c.x, top: c.y, width: c.w, height: c.h }).resize(tw, th, { fit: "fill" }).png().toBuffer();
    const fx = ((c.fx - c.x) / c.w) * tw, fy = ((c.fy - c.y) / c.h) * th;
    const picked = CHOSEN[slot][bp] === c.id;
    const mark = `<circle cx="${fx}" cy="${fy}" r="14" fill="none" stroke="#fff" stroke-width="4"/><circle cx="${fx}" cy="${fy}" r="14" fill="none" stroke="#ef4136" stroke-width="2"/><path d="M${fx - 24} ${fy}H${fx + 24}M${fx} ${fy - 24}V${fy + 24}" stroke="#ef4136" stroke-width="2"/>` +
      (picked ? `<rect x="2" y="2" width="${tw - 4}" height="${th - 4}" fill="none" stroke="#18a05e" stroke-width="5"/>` : "");
    tiles.push({ input: crop, left: x, top: y });
    tiles.push({ input: svg(tw, th, mark), left: x, top: y });
    tiles.push({ input: svg(tw, LAB, `<text x="0" y="20" font-size="16" font-weight="700" fill="${picked ? "#0b7a43" : "#111"}">${c.id}${picked ? "  (picked)" : ""}</text><text x="0" y="40" font-size="13" fill="#444">${esc(c.note)}</text>`), left: x, top: y + th + 4 });
    x += tw + GAP;
  }
  W = Math.max(W, x - GAP + PAD);
  y += th + LAB + 28;
}
await sharp({ create: { width: W, height: y, channels: 3, background: "#f2f2ef" } }).composite(tiles).png().toFile(join(ROOT, "screenshots/review/photos-crops.png"));
console.log(`photos-crops.png ${W}x${y}`);
