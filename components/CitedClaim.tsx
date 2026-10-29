import type { CitedClaimData, Notice } from "@/lib/notices";
import styles from "./CitedClaim.module.css";

type Props = {
  claim: CitedClaimData;
  /** The real notice the requirement comes from. */
  source?: Notice;
};

/**
 * A sentence from a draft EOI with a chip that opens the page that proves it.
 * Works without JavaScript: the chip is a <details> summary.
 */
export function CitedClaim({ claim, source }: Props) {
  return (
    <figure className={styles.claim}>
      <figcaption className={styles.req}>
        <span className="lab">Shortlisting criterion</span>
        <span className={styles.reqText}>{claim.requirement}</span>
        {source ? (
          <a className={styles.reqSource} href={source.source_url} rel="noopener noreferrer" target="_blank">
            {source.source_name}
            <span className="sr-only"> (opens the original notice)</span>
          </a>
        ) : null}
      </figcaption>

      <div className={styles.draft}>
        <p className="lab">Draft EOI · Relevant experience</p>
        <blockquote className={styles.quote}>
          <p>{claim.draft_sentence}</p>
        </blockquote>

        <details className={styles.cite}>
          <summary className={styles.chip}>
            <span aria-hidden="true" className={styles.chipIcon}>¶</span>
            {claim.citation_label}
            <span className="sr-only">, show source excerpt</span>
          </summary>
          <div className={styles.panel}>
            <p className="lab">Source excerpt</p>
            <p className={styles.excerpt}>{claim.excerpt}</p>
          </div>
        </details>

        {claim.is_sample ? (
          <p className={styles.sample}>Sample reference. Your own files replace it.</p>
        ) : null}
      </div>
    </figure>
  );
}
