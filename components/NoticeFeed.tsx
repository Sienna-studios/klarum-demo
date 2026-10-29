"use client";

import { useState } from "react";
import { type Notice, closesLine, metaLine } from "@/lib/data";
import { Pips } from "./Pips";

/** P1, compact variant: hero feed and workflow card. Whole row is one link to the original publication. */
export function CompactNotice({ n }: { n: Notice }) {
  return (
    <li className="nrow compact">
      <a href={n.source_url} rel="noopener" className="nrow-link">
        <span className="nrow-main">
          <span className="nrow-title">{n.title}</span>
          <span className="nrow-meta">{metaLine(n)}</span>
          <span className="nrow-meta">{closesLine(n)}</span>
        </span>
        <span className="nrow-fit">
          <Pips n={n.fit_sample} />
        </span>
      </a>
    </li>
  );
}

/** P1, full variant: fit pips, hatched shortlist state, revision tag with history popover. */
function NoticeRow({ n }: { n: Notice }) {
  const [on, setOn] = useState(false);
  const pop = `rev-${n.id}`;
  const title = `title-${n.id}`;
  return (
    <li className={on ? "nrow full sl" : "nrow full"}>
      <div className="nrow-title-wrap">
        <a id={title} href={n.source_url} rel="noopener" className="nrow-title">
          {n.title}
        </a>
      </div>
      <div className="nrow-meta-wrap">
        <p className="nrow-meta">{metaLine(n)}</p>
        <p className="nrow-meta">{closesLine(n)}</p>
      </div>
      <div className="nrow-fit">
        <Pips n={n.fit_sample} />
        <span className="nrow-meta">Sample fit</span>
      </div>
      <div className="rev-wrap">
        <button
          type="button"
          className="rev"
          aria-describedby={pop}
          onKeyDown={(e) => e.key === "Escape" && e.currentTarget.blur()}
        >
          Rev {n.revision.rev}
        </button>
        <div id={pop} role="tooltip" className="rev-pop">
          {n.revision.history.map((h) => (
            <span key={h}>{h}</span>
          ))}
        </div>
      </div>
      <button
        type="button"
        className="shortlist"
        aria-pressed={on}
        aria-describedby={title}
        onClick={() => setOn((v) => !v)}
      >
        {on ? "Shortlisted" : "Shortlist"}
      </button>
    </li>
  );
}

export function NoticeList({ items }: { items: Notice[] }) {
  return (
    <ul className="surface nlist" data-component="notice-list">
      {items.map((n) => (
        <NoticeRow key={n.id} n={n} />
      ))}
    </ul>
  );
}
