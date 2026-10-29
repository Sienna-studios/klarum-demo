import { URLS, notices } from "@/lib/data";
import { CitedClaim } from "@/components/CitedClaim";
import { CompactNotice } from "@/components/NoticeFeed";
import { KMark } from "@/components/KMark";

export type HeroId = "a" | "b" | "c" | "d";
export const HERO_IDS: HeroId[] = ["a", "b", "c", "d"];
export const HERO_NOTES: Record<HeroId, string> = {
  a: "Statement. Type only.",
  b: "Proof. The cited claim is the hero.",
  c: "Feed. Notices beside the promise.",
  d: "Mark. The K as a quiet shape.",
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

function B() {
  return (
    <section className="m-hero m-hero-b">
      <div className="m-wrap">
        <p className="m-lab">For infrastructure bid teams</p>
        <h1>Every claim in your EOI, linked to the page that proves it.</h1>
        <div className="m-hero-claim"><CitedClaim /></div>
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

function D() {
  return (
    <section className="m-hero m-hero-d">
      <KMark className="m-bigk" />
      <div className="m-wrap">
        <p className="m-lab">For infrastructure bid teams</p>
        <h1>Search live tender notices, draft from your own references, track every bid.</h1>
        <Actions />
        <a href={URLS.review} className="m-link m-quiet">Or review one upcoming tender with us</a>
      </div>
    </section>
  );
}

export function Hero({ id }: { id: HeroId }) {
  return { a: <A />, b: <B />, c: <C />, d: <D /> }[id];
}
