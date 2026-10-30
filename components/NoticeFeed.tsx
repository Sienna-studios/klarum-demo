"use client";

import { useId, useState } from "react";
import { type Notice, closesLine, isRevised, metaLine } from "@/lib/data";
import { useStress } from "@/lib/stress";
import { Pips } from "./Pips";

/** Forced states for /lab/states, where a pseudo-class cannot be held still. */
export type RowState = { open?: boolean; shortlisted?: boolean; hover?: boolean; focus?: "title" | "rev" | "shortlist"; sampleHistory?: string[] };

function Meta({ n }: { n: Notice }) {
  const closes = closesLine(n);
  return (
    <>
      <span className="nrow-meta">{metaLine(n)}</span>
      {closes && <span className="nrow-meta">{closes}</span>}
    </>
  );
}

/** Compact variant: hero feed and workflow card. Whole row is one link to the original publication. A tag shows only past Rev A. */
export function CompactNotice({ n: base, i = -1, shortlisted = false }: { n: Notice; i?: number; shortlisted?: boolean }) {
  const n = useStress(base, i);
  return (
    <li className={shortlisted ? "nrow compact sl" : "nrow compact"}>
      <a href={n.source_url} rel="noopener" className="nrow-link">
        <span className="nrow-main">
          <span className="nrow-title">{n.title}</span>
          <Meta n={n} />
        </span>
        <span className="nrow-fit">
          {isRevised(n) && <span className="rev rev-static">Rev {n.revision.rev}</span>}
          <Pips n={n.fit_sample} />
        </span>
      </a>
    </li>
  );
}

/** Full variant: fit squares, hatched shortlist state, revision tag that opens its revision block. */
export function NoticeRow({ n: base, i = -1, state = {} }: { n: Notice; i?: number; state?: RowState }) {
  const n = useStress(base, i);
  const [on, setOn] = useState(!!state.shortlisted);
  const [open, setOpen] = useState(!!state.open);
  const uid = useId();
  const hist = `rev-${uid}`;
  const title = `title-${uid}`;
  const history = state.sampleHistory ?? n.revision.history;
  const ds = (who: "title" | "rev" | "shortlist") => (state.focus === who ? "focus" : state.hover ? "hover" : undefined);
  return (
    <li className={on ? "nrow full sl" : "nrow full"}>
      <div className="nrow-title-wrap">
        <a id={title} href={n.source_url} rel="noopener" className="nrow-title" data-state={ds("title")}>
          {n.title}
        </a>
      </div>
      <div className="nrow-meta-wrap">
        <Meta n={n} />
      </div>
      <div className="nrow-fit">
        <Pips n={n.fit_sample} />
        <span className="nrow-meta">Sample fit</span>
      </div>
      <button
        type="button"
        className="rev"
        aria-label={`Rev ${n.revision.rev}: show revision history`}
        aria-expanded={open}
        aria-controls={hist}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={(e) => { if (e.key === "Escape" && open) { e.stopPropagation(); setOpen(false); } }}
        data-state={ds("rev")}
      >
        Rev {n.revision.rev}
      </button>
      <button
        type="button"
        className="shortlist"
        aria-pressed={on}
        aria-label={`${on ? "Shortlisted" : "Shortlist"}: ${n.title}`}
        onClick={() => setOn((v) => !v)}
        data-state={ds("shortlist")}
      >
        {on ? "Shortlisted" : "Shortlist"}
      </button>
      <div id={hist} className="rev-hist" role="group" aria-label={`Revision history, ${n.title}`} hidden={!open}>
        <p className="rev-hist-h">Rev · Note</p>
        <ol>
          {history.map((h) => (
            <li key={h}>{h}</li>
          ))}
        </ol>
      </div>
    </li>
  );
}

export function NoticeList({ items }: { items: Notice[] }) {
  return (
    <ul className="surface nlist" data-component="notice-list">
      {items.map((n, i) => (
        <NoticeRow key={n.id} n={n} i={i} />
      ))}
    </ul>
  );
}
