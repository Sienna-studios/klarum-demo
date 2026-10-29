import { URLS, notices } from "@/lib/data";
import { CompactNotice } from "@/components/NoticeFeed";
import { HeroPhoto } from "@/components/HeroPhoto";
import { Field, type FieldKind } from "./Field";

export type HeroId = "c" | "e" | "f" | "g";
export const HERO_IDS: HeroId[] = ["c", "e", "f", "g"];
export const HERO_NOTES: Record<HeroId, string> = {
  c: "Feed. Notices beside the promise.",
  e: "The mass. The K as a field of dots.",
  f: "Signal in the shape. Red is what fits.",
  g: "Lens. The market filtered by fit.",
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

function C({ photos }: { photos: boolean }) {
  return (
    <section className={photos ? "m-hero m-hero-c has-photo" : "m-hero m-hero-c"}>
      {photos && <HeroPhoto />}
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
          <ul>{notices.map((n, i) => <CompactNotice key={n.id} n={n} i={i} />)}</ul>
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

export function Hero({ id, photos = false }: { id: HeroId; photos?: boolean }) {
  return { c: <C photos={photos} />, e: <E />, f: <F />, g: <G /> }[id];
}
