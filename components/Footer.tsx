import { KMark } from "./KMark";
import { SheetCaption } from "./SheetCaption";

const W = "https://www.klarum.com";
const cols = [
  [["Notices", "/notices"], ["Pricing", "/pricing"], ["Integrations", "/integrations"], ["Changelog", "/changelog"]],
  [["About", "/about"], ["Articles", "/articles"], ["Contact", "/contact"], ["Research", "/research"]],
  [["Privacy", "/privacy"], ["Terms", "/terms"], ["Security", "/security"], ["Trust Center", "/legal#trust"]],
];

/** P3: title-block footer. Static, no motion. */
export function Footer() {
  return (
    <footer className="foot">
      <KMark className="foot-k" />
      <div className="wrap foot-in">
        <div className="foot-grid">
          <div>
            <p className="wordmark">
              <KMark className="wm-k" /> Klarum
            </p>
            <p className="foot-small">© 2026 Klarum Technologies AB</p>
            <p className="foot-small">Medborgarplatsen 25, 118 72 Stockholm</p>
            <p className="foot-small">
              <a href="mailto:um@klarum.com">um@klarum.com</a>
            </p>
          </div>
          {cols.map((col, i) => (
            <ul key={i} className="foot-links">
              {col.map(([label, path]) => (
                <li key={label}>
                  <a href={W + path}>{label}</a>
                </li>
              ))}
            </ul>
          ))}
        </div>
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
    </footer>
  );
}
