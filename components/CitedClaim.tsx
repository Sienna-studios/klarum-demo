import { citedClaim as c, vanuatu } from "@/lib/data";

type Forced = { open?: boolean; state?: "hover" | "focus" };

/** Cited-claim chip: draft sentence, and a <details> chip that opens the requirement → evidence → draft chain (Met). No JS. */
export function CitedClaim({ open = false, state }: Forced) {
  return (
    <figure className="claim" data-component="cited-claim">
      <p className="lab">Draft EOI · sample</p>
      <blockquote className="quote">{c.draft_sentence}</blockquote>
      <details className="cite" open={open}>
        <summary data-state={state}>
          <span className="chip">Met · Kenya Roads report, p. 47 · Sample</span>
        </summary>
        <ol className="trace surface">
          <li>
            <p className="lab">1 · Requirement · Vanuatu REOI</p>
            <p className="trace-t">{c.requirement}</p>
            <p className="nrow-meta">
              Source:{" "}
              <a href={vanuatu.source_url} rel="noopener">{vanuatu.source_name}</a>
            </p>
          </li>
          <li className="trace-ev">
            <p className="lab">2 · Evidence · Sample document</p>
            <p className="trace-t">Kenya Roads completion report</p>
            <p className="nrow-meta">Page 47</p>
            <p className="trace-x">{c.excerpt}</p>
          </li>
          <li>
            <p className="lab">3 · In the draft</p>
            <p className="trace-t">{c.draft_sentence}</p>
          </li>
        </ol>
      </details>
    </figure>
  );
}
