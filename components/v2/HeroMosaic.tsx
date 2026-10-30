import { notices, URLS } from "@/lib/data";
import { photoFallback, photoSources } from "@/lib/photos";
import { CompactNotice } from "@/components/NoticeFeed";

const sources = photoSources("hero", "color");
const preloads = sources.filter((s) => s.type === "image/avif");

/**
 * Light hero C. The photograph runs full-bleed behind the whole hero, bridge and tram in the band above one off-white panel
 * snapped to a 40 px grid; the panel holds the copy on the left and the notice card on the right, as the old hero C did.
 * The red tile band was removed in Step 3: tiles were decoration, and red is reserved for fit, revision, citation and the primary action. Copy is unchanged.
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
