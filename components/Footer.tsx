import { KMark } from "./KMark";

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
        <table className="tb" aria-label="Sheet information">
          <tbody>
            <tr>
              <td rowSpan={2} className="tb-mark">
                <KMark className="tb-k" />
                <span className="sr">Klarum</span>
              </td>
              <td><span className="k">Sheet</span><span className="v mono">A-101</span></td>
              <td><span className="k">Rev</span><span className="v mono rev-c">C</span></td>
              <td><span className="k">Title</span><span className="v">Home.</span></td>
            </tr>
            <tr>
              <td><span className="k">Scale</span><span className="v mono">1:1</span></td>
              <td colSpan={2}><span className="k">Office</span><span className="v">Stockholm, Medborgarplatsen 25</span></td>
            </tr>
            <tr>
              <td colSpan={3}><span className="k">Web</span><span className="v mono">www.klarum.com</span></td>
              <td><span className="k">Year</span><span className="v mono">2026</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </footer>
  );
}
