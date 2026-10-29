import manifest from "./photos.json";

export type PhotoSlot = keyof typeof manifest; // "plate" (bridges) | "cta" (rail)
export type Grade = "dark" | "light";

const MOBILE_MAX = 760; // px; matches the site's phone breakpoint

/** <source> list for one slot and grade: mobile crop first (media-matched), then the desktop crop, AVIF before WebP. */
export function photoSources(slot: PhotoSlot, grade: Grade) {
  const m = manifest[slot].crops;
  const set = (bp: "mobile" | "desktop", fmt: "avif" | "webp") =>
    m[bp].widths.map((w) => `/photos/${slot}-${grade}-${bp}-${w}.${fmt} ${w}w`).join(", ");
  return (["avif", "webp"] as const).flatMap((fmt) => [
    { media: `(max-width: ${MOBILE_MAX}px)`, type: `image/${fmt}`, srcSet: set("mobile", fmt) },
    { media: undefined, type: `image/${fmt}`, srcSet: set("desktop", fmt) },
  ]).sort((a, b) => Number(!a.media) - Number(!b.media) || 0);
}

export const photoFallback = (slot: PhotoSlot, grade: Grade) => {
  const d = manifest[slot].crops.desktop;
  return { src: `/photos/${slot}-${grade}-desktop-${d.widths[0]}.webp`, width: d.widths[0], height: Math.round(d.widths[0] / d.aspect) };
};
