// Measure a URL (default: the live site) with the same harness as the demo.
//   CHROME_PATH=/opt/pw-browsers/chromium-1243/chrome-linux64/chrome node scripts/baseline.mjs https://www.klarum.com
// Prints medians of 3 Lighthouse runs (mobile + desktop) and runs the HAR / budget tests.
import { execSync } from "node:child_process";
import { readdirSync, readFileSync, rmSync } from "node:fs";

const url = process.argv[2] ?? "https://www.klarum.com";
const median = (a) => [...a].sort((x, y) => x - y)[Math.floor(a.length / 2)];
const sh = (c, env = {}) => execSync(c, { stdio: "inherit", env: { ...process.env, ...env } });

for (const mode of ["mobile", "desktop"]) {
  rmSync(".lighthouseci", { recursive: true, force: true });
  const preset = mode === "desktop" ? "--preset=desktop" : "";
  sh(`npx lhci collect --url=${url} --numberOfRuns=3 --settings.chromeFlags="--no-sandbox --headless=new" ${preset}`.trim());
  const runs = readdirSync(".lighthouseci").filter((f) => /^lhr-.*\.json$/.test(f))
    .map((f) => JSON.parse(readFileSync(`.lighthouseci/${f}`, "utf8")));
  const pick = (id) => median(runs.map((r) => r.audits[id].numericValue));
  console.log(`\n== ${mode} median of ${runs.length} ==`);
  console.log("score", median(runs.map((r) => r.categories.performance.score * 100)));
  console.log("FCP ms", Math.round(pick("first-contentful-paint")));
  console.log("LCP ms", Math.round(pick("largest-contentful-paint")));
  console.log("TBT ms", Math.round(pick("total-blocking-time")));
  console.log("CLS", pick("cumulative-layout-shift").toFixed(3));
  console.log("transfer KB (full load)", Math.round(pick("total-byte-weight") / 1024));
  console.log("requests (full load)", Math.round(median(runs.map((r) => r.audits["network-requests"].details.items.length))));
}

try {
  sh(`npx playwright test network --project=mobile-390 --reporter=list`, { BASE_URL: url });
} catch { console.log("network tests failed against", url, "(expected for the live site)"); }
