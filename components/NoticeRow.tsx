"use client";

import { useId, useState } from "react";
import type { Notice } from "@/lib/notices";
import styles from "./NoticeRow.module.css";

type Props = {
  notice: Notice;
  /** Compact rows sit in the hero feed and workflow card: no tag, no button. */
  compact?: boolean;
  defaultShortlisted?: boolean;
};

export function NoticeRow({ notice, compact = false, defaultShortlisted = false }: Props) {
  const [shortlisted, setShortlisted] = useState(defaultShortlisted);
  const popId = useId();

  return (
    <li
      className={`${styles.row} ${compact ? styles.compact : ""}`}
      data-shortlisted={shortlisted || undefined}
    >
      <div className={styles.titleBlock}>
        <p className={styles.meta}>
          {notice.type} · {notice.category}
          {compact ? null : <> · {notice.buyer}</>}
        </p>
        <h3 className={styles.title}>
          <a href={notice.source_url} rel="noopener noreferrer" target="_blank">
            {notice.title}
            <span className="sr-only"> (opens the original notice)</span>
          </a>
        </h3>
        <p className={styles.meta}>
          {notice.country} · Closes: {notice.closes ?? notice.closes_label}
        </p>
      </div>

      <Fit value={notice.fit_sample} hatched={shortlisted} compact={compact} />

      {compact ? null : (
        <>
          <button type="button" className={styles.rev} aria-describedby={popId}>
            <svg aria-hidden="true" width="10" height="10" viewBox="0 0 12 12">
              <path d="M6 1l5 10H1z" fill="none" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            Rev {notice.revision.rev}
            <span role="tooltip" id={popId} className={styles.pop}>
              {notice.revision.history.join(" · ")}
            </span>
          </button>

          <button
            type="button"
            className={styles.shortlist}
            aria-pressed={shortlisted}
            onClick={() => setShortlisted((v) => !v)}
          >
            {shortlisted ? "Shortlisted" : "Shortlist"}
          </button>
        </>
      )}
    </li>
  );
}

function Fit({ value, hatched, compact }: { value: number; hatched: boolean; compact: boolean }) {
  const label = `Sample fit ${value} of 5${hatched ? ", shortlisted" : ""}`;
  return (
    <span className={`${styles.fit} ${compact ? styles.fitSmall : ""}`} role="img" aria-label={label}>
      {[1, 2, 3, 4, 5].map((i) => (
        <i key={i} className={i <= value ? (hatched ? styles.hatch : styles.on) : undefined} />
      ))}
    </span>
  );
}
