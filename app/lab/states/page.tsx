import type { Metadata } from "next";
import type { ReactNode } from "react";
import { CitedClaim } from "@/components/CitedClaim";
import { CompactNotice, NoticeRow, type RowState } from "@/components/NoticeFeed";
import { SheetCaption } from "@/components/SheetCaption";
import { notices, type Notice } from "@/lib/data";
import "./lab.css";

export const metadata: Metadata = { title: "States (lab)", robots: { index: false, follow: false } };

const LONG_TITLE =
  "Supervision of repair and rehabilitation of highways, bridges and drainage structures across four districts, lot 2 (1/2)";
const [base, second] = notices;
const noBuyer: Notice = { ...second, buyer: "", closes: null, closes_label: "" };
const longTitle: Notice = { ...base, title: LONG_TITLE };
const revisedC: Notice = { ...second, revision: { rev: "C", history: ["C · Sample: drawings reissued", "B · Sample: clarification issued", "A · REOI published"] } };

const Cap = ({ children }: { children: ReactNode }) => <p className="lab lab-cap">{children}</p>;
const Row = ({ n, state, cap, reduce }: { n: Notice; state?: RowState; cap: string; reduce?: boolean }) => (
  <div className={reduce ? "lab-state lab-reduce" : "lab-state"}>
    <Cap>{cap}</Cap>
    <ul className="lab-rows"><NoticeRow n={n} state={state} /></ul>
  </div>
);
const Compact = ({ n, cap, shortlisted }: { n: Notice; cap: string; shortlisted?: boolean }) => (
  <div className="lab-state">
    <Cap>{cap}</Cap>
    <ul className="lab-rows"><CompactNotice n={n} shortlisted={shortlisted} /></ul>
  </div>
);
const Claim = ({ cap, reduce, ...p }: { cap: string; reduce?: boolean; open?: boolean; state?: "hover" | "focus" }) => (
  <div className={reduce ? "lab-state lab-reduce" : "lab-state"}>
    <Cap>{cap}</Cap>
    <div className="lab-card"><CitedClaim {...p} /></div>
  </div>
);

function Theme({ theme }: { theme: "dark" | "light" }) {
  return (
    <div className={`lab-theme theme-${theme}`} data-lab-theme={theme}>
      <h2 className="lab-cap">{theme === "dark" ? "Dark" : "Light"}</h2>

      <section className="lab-moment" aria-label={`Cited-claim chip, ${theme}`}>
        <Cap>Cited-claim chip</Cap>
        <Claim cap="Default, closed" />
        <Claim cap="Hover" state="hover" />
        <Claim cap="Focus-visible" state="focus" />
        <Claim cap="Open (Met, sample)" open />
        <Claim cap="Reduced motion: opens with no fade" open reduce />
      </section>

      <section className="lab-moment" aria-label={`Notice row, ${theme}`}>
        <Cap>Notice row, full</Cap>
        <Row n={base} cap="Default" />
        <Row n={base} cap="Hover" state={{ hover: true }} />
        <Row n={base} cap="Focus-visible, revision tag" state={{ focus: "rev" }} />
        <Row n={base} cap="Focus-visible, shortlist" state={{ focus: "shortlist" }} />
        <Row n={base} cap="Revision history open (real data, Rev A)" state={{ open: true }} />
        <Row n={revisedC} cap="Revision history open (sample history)" state={{ open: true }} />
        <Row n={base} cap="Shortlisted" state={{ shortlisted: true }} />
        <Row n={longTitle} cap="120-character title" />
        <Row n={noBuyer} cap="Missing buyer and deadline" />
        <Row n={base} cap="Reduced motion: history opens with no fade" state={{ open: true }} reduce />
        <Cap>Notice row, compact</Cap>
        <Compact n={base} cap="Default" />
        <Compact n={revisedC} cap="Revised (Rev C shows a tag)" />
        <Compact n={base} cap="Shortlisted" shortlisted />
        <Compact n={longTitle} cap="120-character title" />
        <Compact n={noBuyer} cap="Missing buyer and deadline" />
      </section>

      <section className="lab-moment" aria-label={`Drawing-sheet caption, ${theme}`}>
        <Cap>Drawing-sheet caption</Cap>
        <div className="lab-state">
          <Cap>Plate caption</Cap>
          <SheetCaption label="Plate information" className="sheet-plate" cells={[{ k: "Plate", v: "1", mono: true }, { k: "Subject", v: "River crossings" }, { k: "Status", v: "Sample image" }]} />
        </div>
        <div className="lab-state">
          <Cap>Footer title block</Cap>
          <SheetCaption
            label="Sheet information"
            mark
            cells={[
              { k: "Sheet", v: "A-101", mono: true },
              { k: "Rev", v: "C", mono: true, rev: true },
              { k: "Title", v: "Home." },
              { k: "Scale", v: "1:1", mono: true },
              { k: "Office", v: "Stockholm, Medborgarplatsen 25", span: 2 },
              { k: "Web", v: "www.klarum.com", mono: true, span: 3 },
              { k: "Year", v: "2026", mono: true },
            ]}
          />
        </div>
        <div className="lab-state">
          <Cap>Long value and missing value</Cap>
          <SheetCaption label="Plate information, long and missing" className="sheet-plate" cells={[{ k: "Plate", v: "12", mono: true }, { k: "Subject", v: "Supervision of repair and rehabilitation of highways, bridges and drainage structures" }, { k: "Status", v: "" }]} />
        </div>
      </section>
    </div>
  );
}

export default async function States({ searchParams }: { searchParams: Promise<{ captions?: string }> }) {
  const { captions } = await searchParams;
  return (
    <div className={captions === "0" ? "lab-page theme-dark nocap" : "lab-page theme-dark"}>
      <header className="lab-head lab-cap">
        <h1>States of the three signature moments</h1>
        <p className="fine">Dark left, light right. Forced states are static copies; keyboard behaviour is tested in tests/moments.spec.ts.</p>
      </header>
      <div className="lab-themes">
        <Theme theme="dark" />
        <Theme theme="light" />
      </div>
    </div>
  );
}
