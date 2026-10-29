import manifest from "./photos.json";

export type PhotoName = keyof typeof manifest;

/** srcset for one format, e.g. "/photos/hangar-640.avif 640w, ..." (widths come from scripts/photos.mjs). */
export const photoSet = (name: PhotoName, fmt: "avif" | "webp") =>
  manifest[name].widths.map((w) => `/photos/${name}-${w}.${fmt} ${w}w`).join(", ");

export const photoSrc = (name: PhotoName) => {
  const w = manifest[name].widths.filter((x) => x <= 960).at(-1)!;
  return `/photos/${name}-${w}.webp`;
};

export const photoSize = (name: PhotoName) => ({ width: manifest[name].width, height: manifest[name].height });
