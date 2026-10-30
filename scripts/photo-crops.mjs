// Crop rectangles (source pixels) for the two kept photos, per slot and breakpoint. `fx, fy` is the focal point.
// CANDIDATES feed the contact sheet (npm run photos:crops); CHOSEN is what scripts/photos.mjs bakes.
// Slot shapes: plate 12:5 desktop / 4:3 mobile; CTA band 3:1 desktop / 1:1 mobile (CSS object-fit: cover trims the rest).
export const SLOTS = {
  plate: { photo: "hero-background-poster", desktop: 12 / 5, mobile: 4 / 3 }, // bridges
  cta: { photo: "aerial-fields", desktop: 3, mobile: 1 }, // rail
  hero: { photo: "hero-background-poster", desktop: 2000 / 710, mobile: 4 / 3 }, // bridges, full colour: the light page hero (PD6)
};

const r = (x, y, w, h, fx, fy) => ({ x, y, w, h, fx, fy });

export const CANDIDATES = {
  hero: {
    desktop: [{ id: "A", note: "wide strip: tram, bridge deck and traffic near the top, river and foliage below; the panel covers the lower part", ...r(560, 730, 2000, 710, 900, 880) }],
    mobile: [{ id: "C", note: "tight on tram and bridge deck (same crop as the plate)", ...r(300, 700, 960, 720, 900, 880) }],
  },
  plate: {
    desktop: [
      { id: "A", note: "full span: all three crossings and the tram", ...r(0, 300, 2560, 1067, 900, 880) },
      { id: "B", note: "near steel bridge, tram and traffic", ...r(0, 560, 1920, 800, 900, 880) },
      { id: "C", note: "far bridges and the angel, near bridge cropped", ...r(640, 280, 1920, 800, 1650, 420) },
    ],
    mobile: [
      { id: "A", note: "near bridge, tram, river", ...r(0, 480, 1280, 960, 900, 880) },
      { id: "B", note: "tram plus the middle bridge", ...r(500, 380, 1280, 960, 900, 880) },
      { id: "C", note: "tight on tram and bridge deck", ...r(300, 700, 960, 720, 900, 880) },
    ],
  },
  cta: {
    desktop: [
      { id: "A", note: "nose and train body, tracks", ...r(0, 900, 2000, 667, 700, 1380) },
      { id: "B", note: "train upper body, road and traffic", ...r(0, 700, 2000, 667, 900, 1100) },
      { id: "C", note: "zoom: train middle and converging tracks", ...r(500, 900, 1500, 500, 1100, 1150) },
    ],
    mobile: [
      { id: "A", note: "nose and train", ...r(150, 850, 1000, 1000, 650, 1350) },
      { id: "B", note: "tracks and train rear", ...r(1000, 700, 1000, 1000, 1300, 1200) },
      { id: "C", note: "nose, platform, tracks", ...r(300, 1000, 1000, 1000, 700, 1400) },
    ],
  },
};

// filled in after the contact sheet is reviewed
export const CHOSEN = { plate: { desktop: "A", mobile: "C" }, cta: { desktop: "B", mobile: "B" }, hero: { desktop: "A", mobile: "C" } };
