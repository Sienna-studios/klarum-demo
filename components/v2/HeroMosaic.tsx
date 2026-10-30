import { notices, URLS } from "@/lib/data";
import { TILES, type Tile } from "@/lib/mosaic";
import { photoFallback, photoSources } from "@/lib/photos";
import { CompactNotice } from "@/components/NoticeFeed";

const sources = photoSources("hero", "color");
const preloads = sources.filter((s) => s.type === "image/avif");

const Tiles = ({ cluster, tiles }: { cluster: "left" | "right"; tiles: readonly Tile[] }) => (
  <div className={`mh-tiles mh-t${cluster === "left" ? "l" : "r"}`}>
    {tiles.map((t) => (
      <i key={`${t.r}-${t.c}`} className={t.kind === "h" ? "h" : "s"} data-m={t.m ? "" : undefined} style={{ gridArea: `${t.r + 1} / ${t.c + 1}` }} />
    ))}
  </div>
);

/**
 * Light hero C. The photograph runs full-bleed behind the whole hero, bridge and tram in the band above one off-white panel
 * snapped to a 40 px grid; the panel holds the copy on the left and the notice card on the right, as the old hero C did.
 * Red tiles sit in the band only (solid = fits, hatched = shortlisted). Copy is unchanged from the previous hero C.
 */
export function HeroMosaic({ photos = true }: { photos?: boolean }) {
  const fb = photoFallback("hero", "color");
  return (
    <section className={photos ? "m-hero m-hero-c mh has-photo" : "m-hero m-hero-c mh"}>
      <div className="mh-bg" aria-hidden="true">
        {photos && (
          <>
            {preloads.map((s) => (
              <link key={s.media ?? "desktop"} rel="preload" as="image" type={s.type} media={s.media ?? "(min-width: 761px)"} imageSrcSet={s.srcSet} imageSizes={s.media ? "100vw" : "2090px"} fetchPriority="high" />
            ))}
            <picture className="mh-photo" data-photo="hero">
              {sources.map((s) => <source key={s.type + (s.media ?? "")} media={s.media} type={s.type} srcSet={s.srcSet} sizes={s.media ? "100vw" : "2090px"} />)}
              <img src={fb.src} width={fb.width} height={fb.height} alt="" fetchPriority="high" decoding="async" />
            </picture>
          </>
        )}
        <Tiles cluster="left" tiles={TILES.left} />
        <Tiles cluster="right" tiles={TILES.right} />
        <div className="mh-legend-box">
          <p className="mh-legend">
            <span className="mh-sw s" />Fits your index<span className="mh-dot"> · </span>
            <span className="mh-sw h" />Shortlisted<span className="mh-dot"> · </span>Illustrative
          </p>
        </div>
      </div>
      <div className="mh-flow">
        <div className="mh-band" />
        <div className="mh-panel">
          <div className="mh-cols">
            <div className="mh-copy">
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
        </div>
        <div className="mh-foot" />
      </div>
    </section>
  );
}
