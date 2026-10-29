import { notices, URLS } from "@/lib/data";
import { BACKERS, DOCS, FAQ, STEPS } from "@/lib/content";
import { CitedClaim } from "@/components/CitedClaim";
import { Footer } from "@/components/Footer";
import { KMark } from "@/components/KMark";
import { NoticeList } from "@/components/NoticeFeed";
import { Pricing } from "@/components/Pricing";
import { Hero, type HeroId } from "./Hero";
import { LazyPhoto } from "@/components/LazyPhoto";
import { Plate } from "@/components/Plate";
import { Switcher } from "./Switcher";

export function Page({ hero, photos = true }: { hero: HeroId; photos?: boolean }) {
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
          <a href={URLS.trial} className="m-btn m-btn-sm">Start the Business trial</a>
        </div>
      </header>

      <main id="main">
        <Hero id={hero} />

        <section className="m-proof">
          <div className="m-wrap">
            <p className="m-lab">Built and backed by people from</p>
            <ul aria-label="Built and backed by people from">
              {BACKERS.map((b) => <li key={b}>{b}</li>)}
            </ul>
          </div>
        </section>

        <section className="m-section">
          <div className="m-wrap">
            <h2>From notice to award, in one place.</h2>
            <ol className="m-steps">
              {STEPS.map(([n, label, title, text]) => (
                <li key={n}>
                  <p className="m-lab">{n} · {label}</p>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="m-section m-tint">
          <div className="m-wrap m-narrow">
            <h2>Go or no-go, then a draft cited to your own record.</h2>
            <CitedClaim />
          </div>
        </section>

        {photos && <Plate grade="light" />}

        <section className="m-section" id="notices">
          <div className="m-wrap">
            <h2>Open notices</h2>
            <p className="m-fine">Fit scores are sample values. Each title links to the original publication.</p>
            <NoticeList items={notices} />
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
          {photos && <LazyPhoto slot="cta" grade="light" sizes="100vw" className="ph-cta" />}
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
      <Switcher current={hero} />
    </div>
  );
}
