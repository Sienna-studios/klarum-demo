import { notices, type Notice } from "@/lib/data";
import { Pips } from "@/components/Pips";

/* Static, deterministic "notice field" art. Pure SVG, no raster, no motion. */

function rng(seed: number) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const K_PATH = "M18 14 L100 18 L182 190 L186 14 L330 14 L668 252 L670 268 L668 500 L320 500 L205 312 L198 500 L108 500 L18 262 Z";
const K_POLY: [number, number][] = [[18,14],[100,18],[182,190],[186,14],[330,14],[668,252],[670,268],[668,500],[320,500],[205,312],[198,500],[108,500],[18,262]];

function inPoly(x: number, y: number, poly: [number, number][]) {
  let c = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i], [xj, yj] = poly[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c;
  }
  return c;
}

type Dot = { x: number; y: number; hit: boolean };

function scatter(n: number, w: number, h: number, seed: number, keep: (x: number, y: number) => boolean, hits: (x: number, y: number, i: number) => boolean): Dot[] {
  const r = rng(seed), out: Dot[] = [];
  let guard = 0;
  while (out.length < n && guard++ < n * 40) {
    const x = Math.round(r() * w), y = Math.round(r() * h);
    if (keep(x, y)) out.push({ x, y, hit: hits(x, y, out.length) });
  }
  return out;
}

const grey = "#c3cad1", red = "#ef4136";

function Dots({ dots, r = 3, rHit = 5.5 }: { dots: Dot[]; r?: number; rHit?: number }) {
  return (
    <>
      {dots.filter((d) => !d.hit).map((d, i) => <circle key={i} cx={d.x} cy={d.y} r={r} fill={grey} />)}
      {dots.filter((d) => d.hit).map((d, i) => <circle key={`h${i}`} cx={d.x} cy={d.y} r={rHit} fill={red} />)}
    </>
  );
}

const K_DOTS = scatter(1500, 700, 518, 7, (x, y) => inPoly(x, y, K_POLY), (_x, _y, i) => i % 97 === 5);
const LENS = { cx: 330, cy: 260, r: 150 };
const FIELD_DOTS = scatter(430, 640, 520, 11, () => true, (x, y, i) => i % 5 === 0 && (x - LENS.cx) ** 2 + (y - LENS.cy) ** 2 < (LENS.r - 14) ** 2);

function Card({ n, left, top, hit }: { n: Notice; left: string; top: string; hit?: boolean }) {
  return (
    <a href={n.source_url} rel="noopener" className={hit ? "m-fcard hit" : "m-fcard"} style={{ left, top }}>
      <span className="m-fcard-t">{n.title}</span>
      <span className="m-fcard-m">
        <span>{n.type === "Request for expressions of interest" ? "REOI" : n.type}</span>
        <Pips n={n.fit_sample} />
      </span>
    </a>
  );
}

const [ted, vanuatu, srilanka] = notices;

export type FieldKind = "mass" | "signal" | "lens";

export function Field({ kind }: { kind: FieldKind }) {
  const kShape = kind === "mass" || kind === "signal";
  return (
    <figure className={`m-field m-field-${kind}`}>
      <svg viewBox={kShape ? "0 0 700 518" : "0 0 640 520"} aria-hidden="true" focusable="false">
        {kind === "mass" && (
          <>
            <defs>
              <pattern id="m-dots" width="16" height="16" patternUnits="userSpaceOnUse"><circle cx="8" cy="8" r="3" fill={grey} /></pattern>
            </defs>
            <path d={K_PATH} fill="url(#m-dots)" />
          </>
        )}
        {kind === "signal" && <Dots dots={K_DOTS} r={2.6} rHit={6} />}
        {kind === "lens" && (
          <>
            <Dots dots={FIELD_DOTS} />
            <circle cx={LENS.cx} cy={LENS.cy} r={LENS.r} fill="none" stroke="#14202c" strokeWidth="1.5" />
          </>
        )}
      </svg>
      {kind === "mass" && (<><Card n={ted} left="2%" top="6%" /><Card n={vanuatu} left="42%" top="38%" hit /><Card n={srilanka} left="8%" top="68%" /></>)}
      {kind === "signal" && <Card n={vanuatu} left="40%" top="68%" hit />}
      {kind === "lens" && (<><Card n={vanuatu} left="30%" top="26%" hit /><Card n={ted} left="38%" top="58%" hit /></>)}
      <figcaption className="m-fcap">
        {{ mass: "The mark is the mass. Notices are pulled out of it.", signal: "Grey is the feed. Red is what fits.", lens: "Inside the circle: what fits your similar assignments." }[kind]} Illustrative; fit scores are sample values.
      </figcaption>
    </figure>
  );
}
