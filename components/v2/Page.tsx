import { URLS } from "@/lib/data";
import { BACKERS, DOCS, FAQ } from "@/lib/content";
import { CitedClaim } from "@/components/CitedClaim";
import { Footer } from "@/components/Footer";
import { KMark } from "@/components/KMark";
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
          <div className="m-wrap m-narrow">
            <h2>Go or no-go, then a draft cited to your own record.</h2>
            <CitedClaim />
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
