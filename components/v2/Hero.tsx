import { URLS, notices } from "@/lib/data";
import { CompactNotice } from "@/components/NoticeFeed";
import { Field, type FieldKind } from "./Field";

export type HeroId = "a" | "c" | "e" | "f" | "g" | "h";
export const HERO_IDS: HeroId[] = ["a", "c", "e", "f", "g", "h"];
export const HERO_NOTES: Record<HeroId, string> = {
  a: "Statement. Type only.",
  c: "Feed. Notices beside the promise.",
  e: "The mass. The K as a field of dots.",
  f: "Signal in the shape. Red is what fits.",
  g: "Lens. The market filtered by fit.",
  h: "One of these is yours.",
};

function Actions({ note = true }: { note?: boolean }) {
  return (
    <div className="m-actions">
      <a href={URLS.trial} className="m-btn">Start the Business trial</a>
      <a href={URLS.pricing} className="m-link">See pricing</a>
      {note && <p className="m-fine">7-day trial, one per organisation, no payment method.</p>}
    </div>
  );
}

function A() {
  return (
    <section className="m-hero m-hero-a">
      <div className="m-wrap">
        <p className="m-lab">For infrastructure bid teams</p>
        <h1>Turn your own project files into an expression of interest that meets the shortlisting criteria.</h1>
        <p className="m-lead">
          Klarum finds open tenders that fit your similar assignments, then drafts the EOI. Every experience claim links to the page that proves it.
        </p>
        <Actions />
        <a href={URLS.review} className="m-link m-quiet">Or review one upcoming tender with us</a>
      </div>
    </section>
  );
}

function C() {
  return (
    <section className="m-hero m-hero-c">
      <div className="m-wrap m-split">
        <div>
          <p className="m-lab">For infrastructure bid teams</p>
          <h1>Open tenders that fit your similar assignments, in one feed.</h1>
          <p className="m-lead">Klarum then drafts the EOI. Every experience claim links to the page that proves it.</p>
          <Actions />
          <a href={URLS.review} className="m-link m-quiet">Or review one upcoming tender with us</a>
        </div>
        <div className="m-feed">
          <p className="m-lab">Open notices · Sample fit</p>
          <ul>{notices.map((n) => <CompactNotice key={n.id} n={n} />)}</ul>
        </div>
      </div>
    </section>
  );
}

function FieldHero({ kind, title, lead }: { kind: FieldKind; title: string; lead: string }) {
  return (
    <section className={`m-hero m-hero-field m-hero-${kind}`}>
      <div className="m-wrap m-split">
        <div>
          <p className="m-lab">For infrastructure bid teams</p>
          <h1>{title}</h1>
          <p className="m-lead">{lead}</p>
          <Actions />
          <a href={URLS.review} className="m-link m-quiet">Or review one upcoming tender with us</a>
        </div>
        <Field kind={kind} />
      </div>
    </section>
  );
}

const E = () => <FieldHero kind="mass" title="Source more of the work that fits." lead="Klarum finds open tenders that fit your similar assignments, then drafts the EOI." />;
const F = () => <FieldHero kind="signal" title="The right work, resolved from the noise." lead="Klarum finds open tenders that fit your similar assignments." />;
const G = () => <FieldHero kind="lens" title="The whole market, filtered by what you can deliver." lead="Sources include national procurement portals, TED and the development banks. Klarum marks the notices that fit your similar assignments." />;
const H = () => <FieldHero kind="one" title="One of these is yours." lead="Sources include national procurement portals, TED and the development banks. Every notice links back to the original publication." />;

export function Hero({ id }: { id: HeroId }) {
  return { a: <A />, c: <C />, e: <E />, f: <F />, g: <G />, h: <H /> }[id];
}
