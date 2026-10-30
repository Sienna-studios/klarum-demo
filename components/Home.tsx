import { notices, URLS } from "@/lib/data";
import { CitedClaim } from "@/components/CitedClaim";
import { CompactNotice, NoticeList } from "@/components/NoticeFeed";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { LazyPhoto } from "@/components/LazyPhoto";
import { Plate } from "@/components/Plate";
import { Pricing } from "@/components/Pricing";

const BACKERS = ["KTH", "AI Sweden", "AWS", "Google Maps", "Apple", "Svea Solar", "Lyceum Technology"];
const STAGES = ["Sourced", "Drafting", "Submitted", "Awarded"];
const SOURCES = [
  ["National procurement portals", "Contracted public sources."],
  ["TED", "Contracted public source."],
  ["Development banks", "Contracted public sources."],
  ["Original publication", "Every notice links back to it."],
];
const DOCS = [
  ["Database", "Hosted in Frankfurt."],
  ["Model inference", "Runs in Stockholm on AWS Bedrock."],
  ["Document parsing", "Documents sent for parsing go to a US processor, which receives the whole document."],
  ["Training", "Customer content is not used for training."],
  ["Certifications", "None listed."],
];
const FAQ = [
  ["Is the free tier a trial?", "No. The free tier is the floor of the plan ladder, not a trial that expires. It has one seat, a monthly matching allowance, SharePoint and Google Drive connectors and CSV and PDF exports. It has no drafting and no team features."],
  ["How does the Business trial work?", "It lasts 7 days, one per organisation, and needs no payment method. Access pauses at expiry and your data is retained."],
  ["How are seats billed?", "Business is €200 per seat per month or €2,000 per seat per year, excl. VAT. Yearly saves two months. Seats are prorated."],
  ["What does Partner change?", "A negotiated seat price and terms, invoiced, plus an org-wide audit log and export, bespoke integrations and dedicated support. SSO and SCIM are planned, not available."],
  ["Which sources does Klarum search?", "Contracted public sources: national procurement portals, TED and the development banks. Every notice links back to the original publication."],
];

export function Home({ photos = true }: { photos?: boolean }) {
  const noticesBlock = (
    <div id="notices" className="notices-block">
      <p className="lab">Open notices</p>
      <p className="fine">Fit scores are sample values. Each title links to the original publication.</p>
      <NoticeList items={notices} />
    </div>
  );
  return (
    <>
      <a href="#main" className="skip">Skip to content</a>
      <Header />
      <main id="main">
        <section id="hero" className="hero">
          <div className="wrap hero-in">
            <div className="hero-copy">
              <p className="lab">For infrastructure bid teams</p>
              <h1>Turn your own project files into an expression of interest that meets the shortlisting criteria.</h1>
              <p className="lead">
                Klarum finds open tenders that fit your similar assignments, then drafts the EOI. Every experience claim links to the page that proves it.
              </p>
              <div className="actions">
                <a href={URLS.trial} className="btn btn-pri">Start the Business trial</a>
                <a href={URLS.pricing} className="tlink">See pricing</a>
              </div>
              <a href={URLS.review} className="tlink quiet">Or review one upcoming tender with us</a>
              <p className="fine">7-day trial, one per organisation, no payment method.</p>
            </div>
            <div className="surface feed">
              <p className="lab feed-h">Open notices · Sample fit</p>
              <ul>
                {notices.map((n, i) => <CompactNotice key={n.id} n={n} i={i} />)}
              </ul>
            </div>
          </div>
        </section>

        <section className="proof">
          <div className="wrap">
            <p className="lab">Built and backed by people from</p>
            <ul className="proof-list" aria-label="Built and backed by people from">
              {BACKERS.map((b) => <li key={b}>{b}</li>)}
            </ul>
          </div>
        </section>

        <section className="section" id="workflow">
          <div className="wrap">
            <h2>From notice to award, in one place.</h2>
            <div className="grid3 cards">
              <article className="surface card">
                <p className="lab">01 · Sourcing</p>
                <h3>Every notice worth your time, in one feed.</h3>
                <ul className="surface mini">
                  {notices.slice(0, 1).map((n, i) => <CompactNotice key={n.id} n={n} i={i} />)} {/* one row: the hero and Open notices already list all three */}
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
                  {STAGES.map((s) => <li key={s}>{s}</li>)}
                </ol>
                <dl className="kpis">
                  {["Win rate", "Cycle time", "Bids per quarter"].map((k) => (
                    <div key={k}><dt className="lab">{k}</dt><dd>–</dd></div>
                  ))}
                </dl>
                <p className="fine">Sample layout. No data shown.</p>
              </article>
            </div>

            {!photos && noticesBlock}
          </div>
        </section>
        {photos && (
          <>
            <Plate />
            <section className="section notices-band">
              <div className="wrap">{noticesBlock}</div>
            </section>
          </>
        )}

        <section className="section" id="sources">
          <div className="wrap">
            <h2>Sources</h2>
            <p className="lead">Contracted public sources: national portals, TED and the development banks.</p>
            <ul className="grid4 tiles">
              {SOURCES.map(([t, d]) => (
                <li key={t} className="surface tile"><p className="lab">Source</p><p className="tile-t">{t}</p><p className="fine">{d}</p></li>
              ))}
            </ul>
          </div>
        </section>

        <section className="section" id="documents">
          <div className="wrap">
            <h2>Where your documents go</h2>
            <div className="dashed docs">
              <ul className="docs-list">
                {DOCS.map(([k, v]) => (
                  <li key={k}>
                    <p className="lab">{k}</p>
                    <p>{v}</p>
                    <a href={URLS.trust} className="tlink small">Trust Center<span className="sr">: {k}</span></a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="section" id="pricing">
          <div className="wrap">
            <h2>Pricing</h2>
            <Pricing />
          </div>
        </section>

        <section className="section" id="faq">
          <div className="wrap faq-wrap">
            <h2>Questions</h2>
            <div>
              {FAQ.map(([q, a]) => (
                <details key={q} className="faq">
                  <summary>{q}</summary>
                  <p>{a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className={photos ? "section cta has-photo" : "section cta"}>
          {photos && <LazyPhoto slot="cta" sizes="100vw" className="ph-cta" />}
          <div className="wrap">
            <h2>See it on your own pipeline.</h2>
            <div className="actions">
              <a href={URLS.trial} className="btn btn-pri">Start the Business trial</a>
              <a href={URLS.pricing} className="btn btn-sec">See pricing</a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
