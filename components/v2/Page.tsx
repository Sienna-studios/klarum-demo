import { notices, URLS } from "@/lib/data";
import { BACKERS, DOCS, FAQ, STAGES } from "@/lib/content";
import { CitedClaim } from "@/components/CitedClaim";
import { Footer } from "@/components/Footer";
import { KMark } from "@/components/KMark";
import { CompactNotice } from "@/components/NoticeFeed";
import { Pricing } from "@/components/Pricing";
import { HeaderCta } from "./HeaderCta";
import { HeroMosaic } from "./HeroMosaic";
import { LazyPhoto } from "@/components/LazyPhoto";

export function Page({ photos = true }: { photos?: boolean }) {
  return (
    <div className="m">
      <a href="#main" className="m-skip">Skip to content</a>
      <header className="m-head" id="top">
        <div className="m-wrap m-head-in">
          <a href="#top" className="m-logo" aria-label="Klarum home">
            <KMark className="m-logo-k" />
            <span>Klarum</span>
          </a>
          <nav aria-label="Main" className="m-nav">
            <a href="#notices">Notices</a>
            <a href="#pricing">Pricing</a>
          </nav>
          <HeaderCta href={URLS.trial} />
        </div>
      </header>

      <main id="main">
        <HeroMosaic photos={photos} />

        <section className="m-proof">
          <div className="m-wrap">
            <p className="m-lab">Built and backed by people from</p>
            <ul aria-label="Built and backed by people from">
              {BACKERS.map((b) => <li key={b}>{b}</li>)}
            </ul>
          </div>
        </section>

        <section className="m-section m-tint">
          <div className="m-wrap">
            <h2>From notice to award, in one place.</h2>
            <div className="grid3 cards m-cards">
              <article className="surface card">
                <p className="lab">01 · Sourcing</p>
                <h3>Every notice worth your time, in one feed.</h3>
                <ul className="surface mini">
                  <CompactNotice n={notices[0]} i={0} />
                </ul>
              </article>
              <article className="surface card">
                <p className="lab">02 · Decision and drafting</p>
                <h3>Go or no-go, then a draft cited to your own record.</h3>
                <CitedClaim />
              </article>
              <article className="surface card">
                <p className="lab">03 · Lifecycle</p>
                <h3>The bid does not end at submission.</h3>
                <ol className="stages" aria-label="Bid stages">
                  {STAGES.map((st) => <li key={st}>{st}</li>)}
                </ol>
                <dl className="kpis">
                  {["Win rate", "Cycle time", "Bids per quarter"].map((k) => (
                    <div key={k}><dt className="lab">{k}</dt><dd>–</dd></div>
                  ))}
                </dl>
                <p className="fine">Sample layout. No data shown.</p>
              </article>
            </div>
          </div>
        </section>

        <section className="m-section m-tint" id="documents">
          <div className="m-wrap">
            <h2>Where your documents go</h2>
            <ul className="m-docs">
              {DOCS.map(([k, v]) => (
                <li key={k}>
                  <p className="m-lab">{k}</p>
                  <p>{v}</p>
                  <a href={URLS.trust} className="m-link m-small">Trust Center<span className="sr">: {k}</span></a>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="m-section" id="pricing">
          <div className="m-wrap">
            <h2>Pricing</h2>
            <Pricing />
          </div>
        </section>

        <section className="m-section m-tint" id="faq">
          <div className="m-wrap m-narrow">
            <h2>Questions</h2>
            {FAQ.map(([q, a]) => (
              <details key={q} className="m-faq">
                <summary>{q}</summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className={photos ? "m-section m-cta has-photo" : "m-section m-cta"}>
          {photos && <LazyPhoto slot="cta" grade="color" sizes="100vw" className="ph-cta" />}
          <div className="m-wrap">
            <h2>See it on your own pipeline.</h2>
            <div className="m-actions">
              <a href={URLS.trial} className="m-btn">Start the Business trial</a>
              <a href={URLS.pricing} className="m-link">See pricing</a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
