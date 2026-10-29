import { citedClaim as c, vanuatu } from "@/lib/data";

/** P2: a sentence from a draft EOI, and a <details> chip that opens the source. No JS. */
export function CitedClaim() {
  return (
    <figure className="claim" data-component="cited-claim">
      <p className="lab">Requirement · Vanuatu REOI</p>
      <p className="claim-req">{c.requirement}</p>
      <p className="lab">Draft EOI · sample</p>
      <blockquote className="quote">{c.draft_sentence}</blockquote>
      <details className="cite">
        <summary>
          <span className="chip">{c.citation_label}</span>
        </summary>
        <div className="cite-panel surface">
          <p className="lab">Source · sample document</p>
          <p className="cite-doc">Kenya Roads completion report</p>
          <p className="nrow-meta">Page 47</p>
          <p className="cite-ex">{c.excerpt}</p>
          <p className="nrow-meta">
            Requirement source:{" "}
            <a href={vanuatu.source_url} rel="noopener">
              {vanuatu.source_name}
            </a>
          </p>
        </div>
      </details>
    </figure>
  );
}
