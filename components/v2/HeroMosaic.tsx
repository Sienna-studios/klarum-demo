import { notices, URLS } from "@/lib/data";
import { mosaicCells } from "@/lib/mosaic";
import { photoFallback, photoSources } from "@/lib/photos";
import { CompactNotice } from "@/components/NoticeFeed";

const cells = mosaicCells();
const sources = photoSources("hero", "color");
const preloads = sources.filter((s) => s.type === "image/avif");

/**
 * Light hero C, rebuilt after PD6-HatchMosaic: a full-bleed colour photograph, a mosaic of red squares along its top and
 * bottom edges (solid = fits, hatched = shortlisted, the same language as the fit squares), an off-white panel with the
 * copy, and the product preview overlapping the panel's lower edge. Copy is unchanged from the previous hero C.
 */
export function HeroMosaic({ photos = true }: { photos?: boolean }) {
  const fb = photoFallback("hero", "color");
  return (
    <section className={photos ? "m-hero m-hero-c mh has-photo" : "m-hero m-hero-c mh"}>
      <div className="mh-bg" aria-hidden="true">
        {photos && (
          <>
            {preloads.map((s) => (
              <link key={s.media ?? "desktop"} rel="preload" as="image" type={s.type} media={s.media ?? "(min-width: 761px)"} imageSrcSet={s.srcSet} imageSizes="100vw" fetchPriority="high" />
            ))}
            <picture className="mh-photo" data-photo="hero">
              {sources.map((s) => <source key={s.type + (s.media ?? "")} media={s.media} type={s.type} srcSet={s.srcSet} sizes="100vw" />)}
              <img src={fb.src} width={fb.width} height={fb.height} alt="" fetchPriority="high" decoding="async" />
            </picture>
          </>
        )}
        {(["top", "bot"] as const).map((band) => (
          <div key={band} className={`mh-band mh-${band}`}>
            {cells.filter((c) => c.band === band).map((c) => (
              <i key={`${c.r}-${c.c}`} className={c.kind === "h" ? "h" : "s"} data-r={c.r} style={{ gridArea: `${band === "top" ? c.r + 1 : 3 - c.r} / ${c.c + 1}` }} />
            ))}
          </div>
        ))}
        <p className="mh-legend">
          <span className="mh-sw s" />Fits your index<span className="mh-dot"> · </span>
          <span className="mh-sw h" />Shortlisted<span className="mh-dot"> · </span>Illustrative
        </p>
      </div>
      <div className="m-wrap mh-front">
        <div className="mh-panel">
          <p className="m-lab">For infrastructure bid teams</p>
          <h1>Open tenders that fit your similar assignments, in one feed.</h1>
          <p className="m-lead">Klarum then drafts the EOI. Every experience claim links to the page that proves it.</p>
          <div className="m-actions">
            <a href={URLS.trial} className="m-btn">Start the Business trial</a>
            <a href={URLS.pricing} className="m-link">See pricing</a>
            <p className="m-fine">7-day trial, one per organisation, no payment method.</p>
          </div>
          <a href={URLS.review} className="m-link m-quiet">Or review one upcoming tender with us</a>
        </div>
        <div className="m-feed mh-feed">
          <p className="m-lab">Open notices · Sample fit</p>
          <ul>{notices.map((n, i) => <CompactNotice key={n.id} n={n} i={i} />)}</ul>
        </div>
      </div>
    </section>
  );
}
