import { photoSet, photoSize, photoSrc } from "@/lib/photos";

const NAME = "hero-background-poster";

/** Hero background behind the scrim. Preloaded at high priority; decorative, so alt="". */
export function HeroPhoto() {
  const { width, height } = photoSize(NAME);
  return (
    <>
      <link rel="preload" as="image" type="image/avif" imageSrcSet={photoSet(NAME, "avif")} imageSizes="100vw" fetchPriority="high" />
      <picture className="ph ph-hero" data-photo="hero" aria-hidden="true">
        <source type="image/avif" srcSet={photoSet(NAME, "avif")} sizes="100vw" />
        <source type="image/webp" srcSet={photoSet(NAME, "webp")} sizes="100vw" />
        <img src={photoSrc(NAME)} alt="" width={width} height={height} fetchPriority="high" decoding="async" />
      </picture>
    </>
  );
}
