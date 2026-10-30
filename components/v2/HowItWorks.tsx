"use client";

import { useEffect, useId, useState, type KeyboardEvent } from "react";
import { CitedClaim } from "@/components/CitedClaim";
import { Pips } from "@/components/Pips";
import { closesLine, metaLine, notices, vanuatu } from "@/lib/data";
import { MATCHED_ON, NOT_MATCHED, STATUSES, STEPS, WALL } from "@/lib/hiw";

const matches = [...notices].sort((a, b) => b.fit_sample - a.fit_sample);
const criteria = vanuatu.shortlisting_criteria ?? [];

/** Four-step click-through: notices arrive, fit to your record, requirements, cited draft.
 *  Motion is opacity and transform only, on --t-fast multiples, so it is off under prefers-reduced-motion. */
export function HowItWorks() {
  const [beat, setBeat] = useState(0);
  const [ready, setReady] = useState(false);
  const id = useId();
  useEffect(() => setReady(true), []);

  const step = STEPS[beat];
  const last = STEPS.length - 1;
  const go = (b: number) => setBeat((b + STEPS.length) % STEPS.length);
  const onKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const n = STEPS.length;
    const to = { ArrowDown: (i + 1) % n, ArrowRight: (i + 1) % n, ArrowUp: (i - 1 + n) % n, ArrowLeft: (i - 1 + n) % n, Home: 0, End: n - 1 }[e.key];
    if (to === undefined) return;
    e.preventDefault();
    setBeat(to);
    document.getElementById(`${id}-t${to}`)?.focus();
  };
  const layer = (i: number, on = beat === i) => ({
    className: `hiw-layer L${i}${on ? " is-on" : ""}`,
    "aria-hidden": ready ? !on : undefined,
    inert: ready ? !on : undefined,
  });

  return (
    <div className="hiw-stage" data-beat={beat}>
      <div className="hiw-steps" role="tablist" aria-label="How it works, four steps" aria-orientation="vertical">
        {STEPS.map((s, i) => (
          <button
            key={s.tab}
            type="button"
            role="tab"
            id={`${id}-t${i}`}
            aria-selected={beat === i}
            aria-controls={`${id}-draw`}
            tabIndex={beat === i ? 0 : -1}
            onClick={() => setBeat(i)}
            onKeyDown={(e) => onKey(e, i)}
          >
            <span className="hiw-n" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
            <span className="hiw-sl">{s.tab}</span>
            <span className="nrow-meta">{s.sub}</span>
            <span className="hiw-bar" aria-hidden="true"><i style={{ ["--fill" as string]: i <= beat ? 1 : 0 }} /></span>
          </button>
        ))}
      </div>

      <div className="hiw-beat" aria-live="polite">
        <p className="lab">{step.key}</p>
        <p className="hiw-beat-t">{step.text}</p>
      </div>

      <div className="hiw-ctl">
        <button type="button" className="m-btn m-btn-sec" onClick={() => go(beat + 1)}>{step.next}</button>
        <button type="button" className="m-link m-quiet" disabled={beat === 0} onClick={() => go(beat - 1)}>Back</button>
      </div>

      <div className="hiw-draw" id={`${id}-draw`} role="tabpanel" aria-labelledby={`${id}-t${beat}`}>
        {/* 1 · notices arrive */}
        <div {...layer(0)}>
          <div className="hiw-wall-h">
            <p className="lab">Sample feed · 28 notices · 7 sources · 3 listed twice</p>
            <p className="nrow-meta">klarum.com/notices, 30 Oct 2026, plus three sample notices</p>
          </div>
          <ul className="hiw-wall" aria-label="Notices as they arrive">
            {WALL.map((w, i) => (
              <li key={i} className={["hiw-w", w.look, w.keep ? "keep" : ""].filter(Boolean).join(" ")} style={{ ["--i" as string]: i, ["--x" as string]: w.x, ["--y" as string]: w.y, ["--r" as string]: `${w.r}deg`, ["--z" as string]: w.keep ? 20 : i }}>
                <p className="nrow-meta">{w.src}</p>
                <p className="nrow-title">{w.title}</p>
              </li>
            ))}
          </ul>
          <p className="m-fine hiw-wall-more">Showing 14 of the 28.</p>
        </div>

        {/* 2 · fit to your record */}
        <div {...layer(1)}>
          <p className="lab hiw-colh">3 of 28 fit · sample fit</p>
          <ul className="hiw-matches">
            {matches.map((n, i) => (
              <li key={n.id} className="hiw-m in-r" style={{ ["--i" as string]: i }}>
                <div className="hiw-m-main">
                  <a className="hiw-m-t" href={n.source_url} rel="noopener">{n.title}</a>
                  <p className="nrow-meta">{metaLine(n)}</p>
                  <p className="nrow-meta">{closesLine(n)}</p>
                </div>
                <div className="hiw-m-fit">
                  <Pips n={n.fit_sample} />
                  <span className="chip chip-flat">Matched on · {MATCHED_ON[n.id]} · Sample</span>
                </div>
              </li>
            ))}
          </ul>
          <div className="hiw-aside in-u" style={{ ["--i" as string]: 1 }}>
            <p className="lab">25 not matched · four shown</p>
            <ul>
              {NOT_MATCHED.map((n, i) => (
                <li key={i}><p className="nrow-title">{n.title}</p><p className="nrow-meta">{n.src}</p></li>
              ))}
            </ul>
          </div>
        </div>

        {/* 3 · requirements */}
        <div {...layer(2)}>
          <div className="hiw-sum">
            <div>
              <p className="lab">Requirements checklist · shortlisting criteria</p>
              <p className="hiw-sum-t">{vanuatu.title}</p>
            </div>
            <a className="m-link m-small m-quiet" href={vanuatu.source_url} rel="noopener">Source: {vanuatu.source_name}</a>
          </div>
          <ol className="hiw-reqs">
            {criteria.map((c, i) => (
              <li key={c} className="hiw-req in-l" style={{ ["--i" as string]: i }}>
                <span className="hiw-req-n" aria-hidden="true">{i + 1}</span>
                <div>
                  <p className="nrow-meta">Criterion {i + 1}</p>
                  <p className="hiw-req-t">{c}</p>
                  {i === 1 && <p className="hiw-req-tag"><span className="chip chip-flat">Cited draft · sample · see step 4</span></p>}
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* 4 · cited draft and the workspace */}
        <div {...layer(3)}>
          <div className="hiw-bid">
            <div className="surface hiw-claimcard in-r" style={{ ["--i" as string]: 0 }}>
              <p className="lab hiw-for">Answers criterion 2</p>
              <CitedClaim />
            </div>
            <div className="surface hiw-ws in-u" style={{ ["--i" as string]: 1 }}>
              <p className="lab">Bid workspace · status · sample</p>
              <ol className="hiw-ladder" aria-label="Bid workspace status">
                {STATUSES.map((s, i) => (
                  <li key={s} className={"chip chip-flat" + (i === 1 ? " on" : "")} aria-current={i === 1 ? "step" : undefined}>{s}</li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>

      <noscript>
        <style>{`.hiw-layer{opacity:1!important;transform:none!important;grid-area:auto!important;margin-bottom:32px}.hiw-layer *{opacity:1!important;transform:none!important}.hiw-draw{display:block}.hiw-steps,.hiw-ctl,.hiw-beat{display:none}`}</style>
      </noscript>
    </div>
  );
}
