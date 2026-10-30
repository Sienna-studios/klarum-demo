// Mosaic cells for the light hero, after PD6-HatchMosaic: red squares on a fixed 48 px grid, dense at the
// top and bottom edges of the photo and thinning inward, with the near bridge, the tram and the far bridges kept clear.
// Deterministic (hash noise), so the markup is stable between builds. Zones are in 48 px grid units, drawn on the
// 1440 x 810 design and kept conservative: the photo scales with the viewport, the cells do not.
// Solid = fits, hatched = shortlisted: the same two states as the fit squares and the shortlist hatch in the feed.
export type Cell = { band: "top" | "bot"; r: number; c: number; kind: "s" | "h" };

const COLS = 40; // 1920 px; the stage clips what does not fit
const TOP_ROWS = 4;
const BOT_ROWS = 3;
const HATCH_SHARE = 0.4;

const hash = (i: number, j: number, s: number) => {
  let h = (Math.imul(i, 374761393) + Math.imul(j, 668265263) + s) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
};
const sm = (t: number) => t * t * (3 - 2 * t);
const noise = (x: number, y: number, sc: number, s: number) => {
  const u = x / sc, v = y / sc, i = Math.floor(u), j = Math.floor(v), fu = sm(u - i), fv = sm(v - j);
  return (hash(i, j, s) * (1 - fu) + hash(i + 1, j, s) * fu) * (1 - fv) + (hash(i, j + 1, s) * (1 - fu) + hash(i + 1, j + 1, s) * fu) * fv;
};
// keep a cell when its score beats the threshold for its depth from the edge: dense at the edge, sparse inward
const THRESHOLD = [0.3, 0.44, 0.58, 0.7];

export function mosaicCells(): Cell[] {
  const cells: Cell[] = [];
  for (const band of ["top", "bot"] as const) {
    const rows = band === "top" ? TOP_ROWS : BOT_ROWS;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < COLS; c++) {
        if (band === "top" && r === 3 && c <= 23) continue; // old-town roofs (x < 700) and the far bridges (x 430 to 1130), both from y 150
        if (band === "bot" && r === 2 && c <= 19) continue; // near bridge piers (x < 960, y up to 690)
        if (band === "bot" && r === 1 && c >= 8 && c <= 19) continue; // pier bases: the stage gets shorter at narrower widths
        if (band === "bot" && r <= 1 && c <= 7) continue; // the legend sits here
        const cx = c * 48 + 24, cy = (band === "top" ? r : 100 + r) * 48 + 24;
        const ends = (Math.abs(cx - 720) / 720) * 0.12; // a little denser toward the left and right ends
        const v = noise(cx, cy, 140, band === "top" ? 7 : 19) * 0.7 + hash(c, r, band === "top" ? 3 : 5) * 0.3 + ends;
        if (v < THRESHOLD[r]) continue;
        cells.push({ band, r, c, kind: hash(c, r, 11) < HATCH_SHARE ? "h" : "s" });
      }
    }
  }
  return cells;
}
