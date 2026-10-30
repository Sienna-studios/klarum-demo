// Mosaic tiles for the light hero, after PD6-HatchMosaic: red squares on a fixed 40 px grid, only in the photo band above
// the panel, clear of the steel bridge, the tram and the traffic. Row 0 (under the header) stays empty.
// Two clusters, both on the same 40 px grid as the panel: `left` is anchored to the hero's left edge, `right` to the
// panel's right edge (the panel is snapped to the grid, so both line up at any width). Row numbers are 0 to 5 (the band is
// six rows), columns count from each cluster's own origin.
// Solid = fits, hatched = shortlisted, the same two states as the fit squares and the shortlist hatch in the notice card.
// Two thirds hatched, one third solid. `abovecard` tiles are hatched and touch the panel's top edge, just above the card.
export type Tile = { r: number; c: number; kind: "s" | "h"; m?: boolean; card?: boolean };

const h = (r: number, c: number, extra: Partial<Tile> = {}): Tile => ({ r, c, kind: "h", ...extra });
const s = (r: number, c: number, extra: Partial<Tile> = {}): Tile => ({ r, c, kind: "s", ...extra });

export const TILES = {
  // anchored to the hero's left edge. Row 1 runs above the tram's roofline; rows 1 and 2 at the far left clear the tram.
  left: [
    h(1, 0, { m: true }), s(1, 1, { m: true }), h(1, 2, { m: true }), s(1, 3), h(1, 4), h(1, 6), h(1, 9, { m: true }), s(1, 12),
    h(2, 0), h(2, 1), s(2, 2),
  ],
  // anchored to the panel's right edge (origin 320 px left of it); the outer top-right corner is columns 8 and up
  right: [
    h(1, 0), s(1, 1), h(1, 2), s(1, 3), h(1, 4), h(1, 5), h(1, 6), s(1, 7), h(1, 8), h(1, 9), h(1, 10), s(1, 11), h(1, 12), h(1, 13),
    h(2, 6), s(2, 7), h(2, 8), s(2, 9), h(2, 10), h(2, 11), s(2, 12), h(2, 13),
    h(3, 7), h(3, 8), s(3, 9), h(3, 10), s(3, 11), h(3, 12), s(3, 13),
    h(4, 9), s(4, 10), s(4, 11), h(4, 12), h(4, 13),
    // just above the notice card, touching the panel's top edge
    h(5, 2, { card: true }), h(5, 3, { card: true }), h(5, 4, { card: true }),
  ],
} as const;
